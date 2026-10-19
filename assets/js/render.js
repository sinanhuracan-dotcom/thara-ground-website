/*
 * RENDERER: turns data.js + i18n.js into page HTML.
 * Used twice: by build.js (Node) to write the static English pages, and by main.js (browser)
 * to re-render the page when the visitor switches language.
 * You normally do not need to edit this file. To change layout, edit it together with styles.css.
 *
 * Portal: while company.portalUrl in data.js is empty, every portal button becomes an
 * "Order on WhatsApp" button. Fill in portalUrl once you have a buyer portal and the portal buttons return.
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SiteRender = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  var ICON = {
    sun: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>',
    close: '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    pause: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15a1 1 0 0 0 1.5.9l12-7.5a1 1 0 0 0 0-1.8l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>',
    arrow: '<svg class="arr" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    tick: '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    chat: '<svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm0 2a8 8 0 1 1-4.2 14.8l-.4-.2-2.6.7.7-2.5-.3-.4A8 8 0 0 1 12 4zm-3 3.5c-.3 0-.7.1-1 .5-.4.5-1.1 1.2-1.1 2.8s1.2 3.2 1.3 3.4c.2.2 2.3 3.6 5.6 4.9 2.8 1.1 3.3.9 3.9.8.6 0 2-.8 2.2-1.6.3-.8.3-1.5.2-1.6-.1-.2-.3-.3-.7-.5l-2-1c-.3-.1-.5-.2-.7.2l-.9 1.1c-.2.2-.3.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-2-1.8-2.3-.2-.3 0-.5.1-.7l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6l-.9-2.2c-.2-.5-.5-.5-.7-.5z"/></svg>'
  };

  function create(D, I) {
    function t(lang, key, vars) {
      var s = I[lang] && I[lang][key];
      if (s == null) s = I.en[key];
      if (s == null) s = key;
      if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] != null ? vars[k] : m; });
      return s;
    }
    function pick(o, lang) { return o[lang] || o.en; }
    function rich(s) { return esc(s).replace(/\*([^*]+)\*/g, '<em class="accent">$1</em>'); }
    function waUrl(text) { return 'https://wa.me/' + D.company.whatsapp + '?text=' + encodeURIComponent(text); }
    function accessUrl() { return 'mailto:' + D.company.email + '?subject=' + encodeURIComponent(D.company.accessSubject); }
    function quoteUrl() { return 'mailto:' + D.company.email + '?subject=' + encodeURIComponent(D.company.quoteSubject || 'Quotation request'); }
    function hasPortal() { return !!D.company.portalUrl; }
    function fmtNum(n) { return new Intl.NumberFormat('en-US').format(n); }
    function divBy(id) { return D.divisions.filter(function (d) { return d.id === id; })[0]; }
    function divOfCat(slug) { return D.divisions.filter(function (d) { return d.cats.indexOf(slug) >= 0; })[0]; }
    function catBy(slug) { return D.categories.filter(function (c) { return c.slug === slug; })[0]; }

    function links(ctx) {
      var base = ctx.base || '';
      return {
        home: base + 'index.html',
        div: function (id) { return base + 'products/' + id + '.html'; },
        cat: function (slug) { var d = divOfCat(slug); return base + 'products/' + (d ? d.id : 'veg') + '.html#' + slug; },
        sect: function (id) { return (ctx.page === 'home' ? '' : base + 'index.html') + '#' + id; },
        asset: function (p) { return base + 'assets/' + p; },
        page: function (p) { return base + p; }
      };
    }

    // Main call-to-action: the portal if you have one, otherwise WhatsApp.
    function orderBtn(lang, cls, text, withArrow) {
      var arrow = withArrow ? ICON.arrow : '';
      if (hasPortal()) return '<a class="btn primary ' + cls + '" href="' + D.company.portalUrl + '">' + esc(t(lang, 'portal.name')) + arrow + '</a>';
      return '<a class="btn primary ' + cls + '" href="' + waUrl(text || t(lang, 'wa.text')) + '" target="_blank" rel="noopener">' + esc(t(lang, 'cta.order')) + arrow + '</a>';
    }

    // Image for a category or industry. Uses item.image if set, else img/<folder>/<id>.<ext> (ext from data.js images.ext).
    // The .svg artwork is the fallback if a photo file is missing (main.js swaps it in).
    function photo(folder, id, item, L, size, eager) {
      var ext = (D.images && D.images.ext) || 'svg';
      var src = L.asset(item.image || ('img/' + folder + '/' + id + '.' + ext));
      var fb = L.asset('img/' + folder + '/' + id + '.svg');
      return '<img src="' + src + '" data-fallback="' + fb + '" alt="" width="' + size[0] + '" height="' + size[1] + '"' + (eager ? '' : ' loading="lazy"') + ' decoding="async">';
    }

    function marquee(listHtml, cls, label) {
      return '<div class="marquee ' + (cls || '') + '" dir="ltr"><div class="marquee-track">' +
        '<ul role="list"' + (label ? ' aria-label="' + esc(label) + '"' : '') + '>' + listHtml + '</ul>' +
        '<ul aria-hidden="true">' + listHtml + '</ul></div></div>';
    }
    function logoChip(b, L) {
      if (b.logo && b.tile) return '<li><span class="logo-tile"><img class="logo-img" src="' + L.asset(b.logo) + '" alt="' + esc(b.name) + '" loading="lazy" height="72"></span></li>';
      if (b.logo) return '<li><img class="logo-img" src="' + L.asset(b.logo) + '" alt="' + esc(b.name) + '" loading="lazy" height="40"></li>';
      return '<li><span class="logo-chip">' + esc(b.name) + '</span></li>';
    }
    function brandMark(b, L) {
      return b.logo ? '<img src="' + L.asset(b.logo) + '" alt="' + esc(b.name) + '" loading="lazy" height="64">' : '<span>' + esc(b.name) + '</span>';
    }

    /* ---------- shared pieces ---------- */
    function header(ctx) {
      var lang = ctx.lang, L = links(ctx);
      var tel = D.company.phone.replace(/\s/g, '');
      var mega = D.divisions.map(function (d) {
        return '<a href="' + L.div(d.id) + '"><b>' + esc(t(lang, 'supply.' + d.id + '.t')) + '</b><span>' + esc(t(lang, 'supply.' + d.id + '.d')) + '</span></a>';
      }).join('');
      var megaHtml = '<div class="mega" role="group" aria-label="' + esc(t(lang, 'nav.products')) + '"><div class="mega-list">' + mega + '</div>' +
        '<div class="mega-shop"><b>' + esc(t(lang, 'loc.shop')) + '</b><span>' + esc(t(lang, 'contact.addressVal')) + '</span>' +
        '<a href="' + D.company.mapUrl + '" target="_blank" rel="noopener">' + esc(t(lang, 'loc.map')) + '</a></div></div>';
      var nav = '<div class="nav-dd"><a href="' + L.sect('supply') + '">' + esc(t(lang, 'nav.products')) + '</a>' + megaHtml + '</div>' +
        '<a href="' + L.sect('about') + '">' + esc(t(lang, 'nav.about')) + '</a>' +
        ['why', 'how', 'locations', 'contact'].map(function (id) {
          return '<a href="' + L.sect(id) + '">' + esc(t(lang, 'nav.' + id)) + '</a>';
        }).join('');
      var PH = '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/></svg>';
      var langSw = '<div class="lang-sw" role="group" aria-label="' + esc(t(lang, 'lang.label')) + '">' + langLinks(lang) + '</div>';
      var mainA = hasPortal() ? orderBtn(lang, 'hdr-portal', null, false)
        : '<a class="btn primary hdr-portal" href="' + waUrl(t(lang, 'wa.text')) + '" target="_blank" rel="noopener">' + ICON.chat.replace('width="28" height="28"', 'width="18" height="18"') + esc(t(lang, 'topbar.wa')) + '</a>';
      var navExtra = '<div class="nav-extra"><a class="nav-tel" href="tel:' + tel + '" dir="ltr">' + PH + esc(D.company.phone) + '</a>' + langSw + '</div>';
      var navBtn = orderBtn(lang, 'nav-portal', null, false);
      return '<a class="skip" href="#main">' + esc(t(lang, 'skip')) + '</a>' +
        '<header class="site-header" id="siteHeader"><div class="wrap hdr">' +
        '<a class="logo" href="' + L.home + '"><img class="logo-mark" src="' + L.asset('img/logo.png') + '" alt="" width="66" height="40">' +
        '<span class="logo-text"><b>' + esc(t(lang, 'brand.name')) + '</b><small>' + esc(t(lang, 'brand.tagline')) + '</small></span></a>' +
        '<nav class="nav" id="nav" aria-label="' + esc(t(lang, 'nav.main')) + '">' + nav + navExtra + navBtn + '</nav>' +
        '<div class="hdr-actions"><a class="hdr-phone" href="tel:' + tel + '" dir="ltr">' + PH + esc(D.company.phone) + '</a>' + langSw +
        '<button type="button" class="icon-btn theme-btn" id="themeBtn" aria-label="' + esc(t(lang, 'theme.toggle')) + '">' + ICON.sun + ICON.moon + '</button>' +
        mainA +
        '<button type="button" class="icon-btn menu-btn" id="menuBtn" aria-expanded="false" aria-controls="nav" aria-label="' + esc(t(lang, 'nav.menu')) + '">' + ICON.menu + ICON.close + '</button>' +
        '</div></div></header>';
    }

    function langLinks(lang) {
      return [['en', 'English', 'en'], ['ar', 'العربية', 'ar']].map(function (x) {
        return '<button type="button" data-lang="' + x[0] + '" lang="' + x[2] + '" aria-pressed="' + (lang === x[0]) + '">' + x[1] + '</button>';
      }).join('');
    }

    function footer(ctx) {
      var lang = ctx.lang, L = links(ctx), tel = D.company.phone.replace(/\s/g, '');
      var prodLinks = D.divisions.map(function (d) {
        return '<li><a href="' + L.div(d.id) + '">' + esc(t(lang, 'supply.' + d.id + '.t')) + '</a></li>';
      }).join('') + '<li><a href="' + L.sect('supply') + '">' + esc(t(lang, 'footer.all')) + '</a></li>';
      var co = ['about', 'why', 'brands', 'how', 'locations', 'contact'].map(function (id) {
        return '<li><a href="' + L.sect(id) + '">' + esc(t(lang, 'nav.' + id)) + '</a></li>';
      }).join('');
      var contactCol = '<h2 class="foot-h">' + esc(t(lang, 'footer.contact')) + '</h2><ul class="foot-contact">' +
        '<li>' + esc(t(lang, 'contact.addressVal')) + '</li>' +
        '<li><a href="tel:' + tel + '" dir="ltr">' + esc(D.company.phone) + '</a></li>' +
        '<li><a href="' + waUrl(t(lang, 'wa.text')) + '" target="_blank" rel="noopener">' + esc(t(lang, 'footer.wa')) + '</a></li>' +
        '<li><a href="mailto:' + D.company.email + '">' + esc(D.company.email) + '</a></li>' +
        '<li><a href="' + L.sect('contact') + '">' + esc(t(lang, 'form.title')) + '</a></li>' +
        (hasPortal() ? '<li><a href="' + D.company.portalLoginUrl + '">' + esc(t(lang, 'footer.login')) + '</a></li>' : '') + '</ul>';
      return '<footer class="site-footer"><div class="wrap">' +
        '<div class="foot-grid">' +
        '<div class="foot-brand"><a class="logo" href="' + L.home + '"><img class="logo-mark" src="' + L.asset('img/logo.png') + '" alt="" width="66" height="40" loading="lazy">' +
        '<span class="logo-text"><b>' + esc(t(lang, 'brand.name')) + '</b></span></a>' +
        '<p class="foot-tag">' + esc(t(lang, 'brand.tagline')) + '</p>' +
        '<p>' + esc(t(lang, 'footer.blurb')) + '</p>' + socialLinks(lang) + '</div>' +
        '<div><h2 class="foot-h">' + esc(t(lang, 'footer.company')) + '</h2><ul>' + co + '</ul></div>' +
        '<div><h2 class="foot-h">' + esc(t(lang, 'footer.products')) + '</h2><ul>' + prodLinks + '</ul></div>' +
        '<div>' + contactCol + '</div>' +
        '</div>' +
        '<div class="foot-bottom"><p>' + esc(t(lang, 'footer.rights')) + '</p>' +
        '<div class="foot-lang" role="group" aria-label="' + esc(t(lang, 'lang.label')) + '">' + langLinks(lang) + '</div>' +
        '<p class="foot-legal"><a href="' + L.page('privacy.html') + '">' + esc(t(lang, 'footer.privacy')) + '</a>' +
        '<a href="' + L.page('terms.html') + '">' + esc(t(lang, 'footer.terms')) + '</a></p></div>' +
        '</div></footer>';
    }

    function waFloat(ctx) {
      var lang = ctx.lang;
      return '<a class="wa-float" href="' + waUrl(t(lang, 'wa.text')) + '" target="_blank" rel="noopener" aria-label="' + esc(t(lang, 'wa.label')) + '">' + ICON.chat + '</a>';
    }

    /* ---------- home page sections ---------- */
    function stats(ctx) {
      var lang = ctx.lang;
      var items = D.stats.map(function (s) {
        return '<div class="stat"><dt>' + esc(t(lang, 'stats.' + s.id)) + '</dt><dd><span class="count" dir="ltr" data-to="' + s.value + '" data-suffix="' + esc(s.suffix || '') + '">' + fmtNum(s.value) + esc(s.suffix || '') + '</span></dd></div>';
      }).join('');
      return '<dl class="hero-stats" aria-label="' + esc(t(lang, 'stats.label')) + '">' + items + '</dl>';
    }

    function hero(ctx) {
      var lang = ctx.lang, L = links(ctx), H = D.hero;
      var media = H.video
        ? '<video class="hero-img" autoplay muted loop playsinline poster="' + L.asset(H.image) + '"><source src="' + L.asset(H.video) + '"></video>'
        : '<img class="hero-img" src="' + L.asset(H.image) + '" alt="" width="1600" height="900" fetchpriority="high" decoding="async">';
      var tabs = '';
      for (var i = 1; i <= H.slides; i++) {
        tabs += '<button type="button" class="hero-tab' + (i === 1 ? ' active' : '') + '" role="tab" aria-selected="' + (i === 1) + '" data-slide="' + (i - 1) + '">' +
          '<span class="n">0' + i + '</span><span class="lb">' + esc(t(lang, 'hero.' + i + '.tab')) + '</span><span class="bar"><i></i></span></button>';
      }
      return '<section class="hero" id="top" aria-labelledby="heroTitle">' +
        '<div class="hero-media" aria-hidden="true">' + media + '</div><div class="hero-shade" aria-hidden="true"></div>' +
        '<div class="wrap hero-in"><div class="hero-copy" role="tabpanel">' +
        '<p class="hero-eyebrow">' + esc(t(lang, 'hero.eyebrow')) + '</p>' +
        '<h1 id="heroTitle">' + rich(t(lang, 'hero.1.title')) + '</h1>' +
        '<p class="lead" id="heroSub">' + esc(t(lang, 'hero.1.sub')) + '</p>' +
        '<div class="cta"><a class="btn primary lg" href="' + L.sect('supply') + '">' + esc(t(lang, 'cta.explore')) + ICON.arrow + '</a>' +
        '<a class="btn outline lg" href="' + waUrl(t(lang, 'wa.text')) + '" target="_blank" rel="noopener">' + esc(t(lang, 'cta.salesTeam')) + '</a></div></div>' +
        stats(ctx) + '</div>' +
        (H.slides > 1 ? '<div class="wrap"><div class="hero-bar"><div class="hero-tabs" role="tablist" aria-label="' + esc(t(lang, 'hero.tabs')) + '">' + tabs + '</div>' +
        '<button type="button" class="icon-btn hero-pause" id="heroPause" aria-pressed="false" aria-label="' + esc(t(lang, 'hero.pause')) + '">' + ICON.pause + ICON.play + '</button></div></div>' : '') +
        '</section>';
    }

    function sectionHead(lang, eyebrowKey, titleKey, subKey, id, center) {
      return '<div class="sec-head reveal' + (center ? ' center' : '') + '"><p class="eyebrow">' + esc(t(lang, eyebrowKey)) + '</p><h2 class="title"' + (id ? ' id="' + id + '"' : '') + '>' + esc(t(lang, titleKey)) + '</h2>' +
        (subKey ? '<p class="sub">' + esc(t(lang, subKey)) + '</p>' : '') + '</div>';
    }

    function products(ctx) {
      var lang = ctx.lang, L = links(ctx);
      var cards = D.categories.map(function (c, i) {
        return '<a class="card cat-card reveal" style="--i:' + (i % 4) + '" href="' + L.cat(c.slug) + '">' +
          '<span class="cat-img">' + photo('cat', c.slug, c, L, [800, 600]) + '</span>' +
          '<span class="cat-body"><span class="cat-name">' + esc(pick(c.name, lang)) + '</span>' +
          '<span class="cat-count">' + esc(t(lang, c.items.length === 1 ? 'cat.count1' : 'cat.count', { n: c.items.length })) + '</span></span></a>';
      }).join('');
      var names = D.categories.map(function (c) { return '<li><span class="mq-dot" aria-hidden="true"></span>' + esc(pick(c.name, lang)) + '</li>'; }).join('');
      return '<section class="sec" id="products" aria-labelledby="productsT"><div class="wrap">' +
        sectionHead(lang, 'products.eyebrow', 'products.title', 'products.sub', 'productsT') +
        '<div class="cat-grid">' + cards + '</div></div>' +
        '<div class="mq-wrap" aria-hidden="true">' + marquee(names, 'mq-names') + '</div></section>';
    }

    function industries(ctx) {
      var lang = ctx.lang, L = links(ctx);
      var cards = D.industries.map(function (x, i) {
        return '<article class="card ind-card reveal" style="--i:' + (i % 3) + '"><div class="ind-img">' + photo('ind', x.id, x, L, [800, 600]) +
          '<span class="ind-n">0' + (i + 1) + '</span></div><div class="ind-body"><h3>' + esc(t(lang, 'ind.' + x.id + '.t')) + '</h3><p>' + esc(t(lang, 'ind.' + x.id + '.d')) + '</p></div></article>';
      }).join('');
      return '<section class="sec alt" id="industries" aria-labelledby="indT"><div class="wrap">' +
        sectionHead(lang, 'industries.eyebrow', 'industries.title', 'industries.sub', 'indT') +
        '<div class="grid-3">' + cards + '</div></div></section>';
    }

    function why(ctx) {
      var lang = ctx.lang;
      var cards = D.why.map(function (x, i) {
        return '<article class="card info-card reveal" style="--i:' + i + '"><span class="why-n">0' + (i + 1) + '</span>' +
          '<h3>' + esc(t(lang, 'why.' + x.id + '.t')) + '</h3><p>' + esc(t(lang, 'why.' + x.id + '.d')) + '</p></article>';
      }).join('');
      var pills = D.industries.map(function (x) { return '<li class="pill">' + esc(t(lang, 'ind.' + x.id + '.t')) + '</li>'; }).join('');
      return '<section class="sec" id="why" aria-labelledby="whyT"><div class="wrap">' +
        sectionHead(lang, 'why.eyebrow', 'why.title', 'why.sub', 'whyT', true) +
        '<div class="grid-4">' + cards + '</div></div></section>';
    }

    function brands(ctx) {
      var lang = ctx.lang, L = links(ctx), B = D.brands;
      function fill(list, min) { var out = list.slice(); while (out.length < min) out = out.concat(list); return out; }
      var wall = marquee(fill(B.list, 8).map(function (b) { return logoChip(b, L); }).join(''), '', t(lang, 'brands.title'));
      var clients = marquee(fill(D.clients, 6).map(function (b) { return logoChip(b, L); }).join(''), 'rev', t(lang, 'clients.title'));
      return '<section class="sec alt" id="brands" aria-labelledby="brandsT"><div class="wrap">' +
        '<div class="sec-head row reveal"><div><p class="eyebrow">' + esc(t(lang, 'brands.eyebrow')) + '</p><h2 class="title" id="brandsT">' + esc(t(lang, 'brands.title')) + '</h2></div></div></div>' +
        '<div class="mq-wrap">' + wall + '</div>' +
        '<div class="wrap"><h3 class="clients-h reveal">' + esc(t(lang, 'clients.title')) + '</h3></div>' +
        '<div class="mq-wrap">' + clients + '</div></section>';
    }

    function tickList(lang, prefix, n) {
      var out = '';
      for (var i = 1; i <= n; i++) out += '<li>' + ICON.tick + '<span>' + esc(t(lang, prefix + i)) + '</span></li>';
      return out;
    }

    function how(ctx) {
      var lang = ctx.lang;
      var steps = [1, 2, 3, 4].map(function (n) {
        return '<li class="step card reveal" style="--i:' + (n - 1) + '"><span class="step-n">0' + n + '</span>' +
          '<h3>' + esc(t(lang, 'how.step' + n + '.t')) + '</h3><p>' + esc(t(lang, 'how.step' + n + '.d')) + '</p></li>';
      }).join('');
      var btns = '<a class="btn wa" href="' + waUrl(t(lang, 'wa.text')) + '" target="_blank" rel="noopener">' + esc(t(lang, 'cta.order')) + ICON.arrow + '</a>' +
        '<a class="btn" href="tel:' + D.company.phone.replace(/\s/g, '') + '">' + esc(t(lang, 'supply.call')) + '</a>' +
        (hasPortal() ? '<a class="btn primary" href="' + D.company.portalUrl + '">' + esc(t(lang, 'portal.name')) + '</a>' : '');
      return '<section class="sec" id="how" aria-labelledby="howT"><div class="wrap">' +
        sectionHead(lang, 'how.eyebrow', 'how.title', null, 'howT') +
        '<ol class="steps" role="list">' + steps + '</ol></div></section>';
    }

    function supply(ctx) {
      var lang = ctx.lang, L = links(ctx), tel = D.company.phone.replace(/\s/g, '');
      function svg(d) { return '<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + d + '</svg>'; }
      var IC = {
        veg: svg('<path d="M5 19c0-8 5-13 14-14 0 9-5 14-13 14z"/><path d="M5 19c3-5 6-8 10-10"/>'),
        fruit: svg('<path d="M12 7c-2-2-6-1-6 4 0 4 3 8 6 8s6-4 6-8c0-5-4-6-6-4z"/><path d="M12 7c0-2 1-3 3-4"/>'),
        leafy: svg('<path d="M12 21V9"/><path d="M12 13c-4 0-6-2-6-6 4 0 6 2 6 6z"/><path d="M12 11c0-4 2-6 6-6 0 4-2 6-6 6z"/>'),
        phone: svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>')
      };
      var UR = '<svg class="ur" viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M7 17L17 7M8 7h9v9"/></svg>';
      var cards = D.divisions.map(function (d, i) {
        var big = i === 0, c0 = catBy(d.link) || {};
        return '<a class="bn bn-' + d.id + (big ? ' bn-big' : '') + ' reveal" style="--i:' + i + '" href="' + L.div(d.id) + '">' +
          (d.image ? '<span class="bn-bg" aria-hidden="true">' + photo('cat', d.link, d, L, [800, 600]) + '</span>' : '') +
          '<span class="bn-top"><span class="bn-ic">' + IC[d.id] + '</span><span class="bn-go">' + UR + '</span></span>' +
          '<span class="bn-body"><span class="bn-t">' + esc(t(lang, 'supply.' + d.id + '.t')) + '</span>' +
          '<span class="bn-d">' + esc(t(lang, 'supply.' + d.id + '.d')) + '</span></span></a>';
      }).join('');
      var order = '<a class="bn bn-order reveal" style="--i:4" href="tel:' + tel + '">' +
        '<span class="bn-bg" aria-hidden="true"><img src="' + L.asset('img/order.jpg') + '" alt="" width="1600" height="893" loading="lazy" decoding="async"></span>' +
        '<span class="bn-top"><span class="bn-ic">' + IC.phone + '</span><span class="bn-go acc">' + UR + '</span></span>' +
        '<span class="bn-body"><span class="bn-t">' + esc(t(lang, 'supply.orderT')) + '</span>' +
        '<span class="bn-d">' + esc(t(lang, 'supply.orderD2')) + ' <b dir="ltr">' + esc(D.company.phone) + '</b></span></span></a>';
      return '<section class="sec dark" id="supply" aria-labelledby="supplyT"><div class="wrap">' +
        '<div class="sup-head reveal"><h2 class="title" id="supplyT">' + esc(t(lang, 'supply.title')) + '</h2><p>' + esc(t(lang, 'supply.sub')) + '</p></div>' +
        '<div class="bento">' + cards + order + '</div></div></section>';
    }

    function about(ctx) {
      var lang = ctx.lang, L = links(ctx);
      var years = 20, wh = 2; D.stats.forEach(function (x) { if (x.id === 'years') years = x.value; if (x.id === 'warehouses') wh = x.value; });
      return '<section class="sec alt" id="about" aria-labelledby="aboutT"><div class="wrap about-grid about-solo">' +
        '<div class="about-text reveal"><p class="eyebrow">' + esc(t(lang, 'about.eyebrow')) + '</p><h2 class="title" id="aboutT">' + esc(t(lang, 'about.title')) + '</h2>' +
        '<p>' + esc(t(lang, 'about.p1', { years: years })) + '</p><p>' + esc(t(lang, 'about.p2')) + '</p>' +
        '<div class="vm"><div class="card vm-card"><span class="vm-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg></span><h3>' + esc(t(lang, 'about.vision.t')) + '</h3><p>' + esc(t(lang, 'about.vision.d')) + '</p></div>' +
        '<div class="card vm-card"><span class="vm-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5"/></svg></span><h3>' + esc(t(lang, 'about.mission.t')) + '</h3><p>' + esc(t(lang, 'about.mission.d')) + '</p></div></div></div>' +
        '</div></section>';
    }

    function ventures(ctx) {
      var lang = ctx.lang, L = links(ctx);
      var items = [['fw', 'M3 9l1.5-5h15L21 9M4 9v11h16V9M9 20v-6h6v6'], ['fd', 'M12 21c-4.5 0-8-3.2-8-7.5C4 9 8 7 12 8c4-1 8 1 8 5.5 0 4.3-3.5 7.5-8 7.500zM12 8c0-2 1-3.500 3-4.500']];
      var cards = items.map(function (it, i) {
        var mark = true ? '<span class="vent-logo"><img src="' + L.asset('img/freshday.png') + '" alt="" width="417" height="398" loading="lazy" decoding="async"></span>' : null;
        return '<article class="card vent-card reveal" style="--i:' + i + '">' + (mark || '<span class="vm-ic" aria-hidden="true"><svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="' + it[1] + '"/></svg></span>') +
          '<p class="vent-tag">' + esc(t(lang, 'grp.tag')) + '</p><h3>' + esc(t(lang, 'grp.' + it[0] + '.t')) + '</h3><p>' + esc(t(lang, 'grp.' + it[0] + '.d')) + '</p></article>';
      }).join('');
      return '<section class="sec" id="ventures" aria-labelledby="grpT"><div class="wrap">' +
        sectionHead(lang, 'grp.eyebrow', 'grp.title', 'grp.sub', 'grpT') + '<div class="grid-2 vent-grid">' + cards + '</div></div></section>';
    }

    function locations(ctx) {
      var lang = ctx.lang;
      var chips = D.locations.cities.map(function (c) { return '<li class="chip">' + esc(pick(c, lang)) + '</li>'; }).join('');
      return '<section class="sec" id="locations" aria-labelledby="locT"><div class="wrap">' +
        sectionHead(lang, 'loc.eyebrow', 'loc.title', null, 'locT') +
        '<div class="grid-2"><article class="card loc-card reveal"><h3>' + esc(t(lang, 'loc.shop')) + '</h3>' +
        '<p>' + esc(t(lang, 'contact.addressVal')) + '</p><p class="muted">' + esc(t(lang, 'contact.hoursVal')) + '</p>' +
        '<a class="btn" href="' + D.company.mapUrl + '" target="_blank" rel="noopener">' + esc(t(lang, 'loc.map')) + ICON.arrow + '</a></article>' +
        '<article class="card loc-card reveal" style="--i:1"><h3>' + esc(t(lang, 'loc.deliver')) + '</h3><ul class="chips" role="list">' + chips + '</ul></article></div></div></section>';
    }

    function testimonials(ctx) {
      var lang = ctx.lang; if (!D.testimonials || !D.testimonials.length) return '';
      var cards = D.testimonials.map(function (x, i) {
        return '<figure class="card tm-card reveal" style="--i:' + (i % 3) + '"><blockquote>' + esc(pick(x.quote, lang)) + '</blockquote>' +
          '<figcaption><span class="avatar" aria-hidden="true">' + esc(x.name.charAt(0)) + '</span><span class="who-t"><b>' + esc(x.name) + '</b>' + (x.role ? '<span>' + esc(pick(x.role, lang)) + '</span>' : '') + '</span></figcaption></figure>';
      }).join('');
      return '<section class="sec alt" id="testimonials" aria-labelledby="tmT"><div class="wrap">' +
        sectionHead(lang, 'tm.eyebrow', 'tm.title', null, 'tmT') + '<div class="grid-3">' + cards + '</div></div></section>';
    }

    function gallery(ctx) {
      var lang = ctx.lang, L = links(ctx); if (!D.gallery || !D.gallery.length) return '';
      var imgs = D.gallery.map(function (g, i) {
        return '<li class="gal-item reveal" style="--i:' + (i % 4) + '"><img src="' + L.asset(g.src) + '" alt="' + esc(g.alt ? pick(g.alt, lang) : '') + '" loading="lazy" decoding="async"></li>';
      }).join('');
      return '<section class="sec" id="gallery" aria-labelledby="galT"><div class="wrap">' +
        sectionHead(lang, 'gal.eyebrow', 'gal.title', null, 'galT') + '<ul class="gallery" role="list">' + imgs + '</ul></div></section>';
    }

    function socialLinks(lang) {
      var S = (D.company.social) || {}, names = { instagram: 'Instagram', facebook: 'Facebook', x: 'X', tiktok: 'TikTok', snapchat: 'Snapchat' };
      var out = Object.keys(names).filter(function (k) { return S[k]; }).map(function (k) {
        return '<a href="' + esc(S[k]) + '" target="_blank" rel="noopener">' + names[k] + '</a>';
      }).join('');
      return out ? '<p class="foot-social"><span>' + esc(t(lang, 'footer.follow')) + '</span>' + out + '</p>' : '';
    }

    function topbar(ctx) {
      var lang = ctx.lang, tel = D.company.phone.replace(/\s/g, '');
      return '<div class="topbar"><div class="wrap topbar-in"><div class="topbar-info">' +
        '<a href="tel:' + tel + '" dir="ltr">' + esc(D.company.phone) + '</a>' +
        '<a href="' + waUrl(t(lang, 'wa.text')) + '" target="_blank" rel="noopener">' + esc(t(lang, 'topbar.wa')) + '</a>' +
        '<span class="tb-hours">' + esc(t(lang, 'topbar.hours')) + '</span></div>' +
        '<div class="foot-lang" role="group" aria-label="' + esc(t(lang, 'lang.label')) + '">' + langLinks(lang) + '</div></div></div>';
    }

    function cta(ctx) {
      var lang = ctx.lang;
      var btns = hasPortal()
        ? '<a class="btn light lg" href="' + D.company.portalLoginUrl + '">' + esc(t(lang, 'cta.login')) + ICON.arrow + '</a>' +
          '<a class="btn ghost-light lg" href="' + accessUrl() + '">' + esc(t(lang, 'cta.access')) + '</a>'
        : '<a class="btn light lg" href="tel:' + D.company.phone.replace(/\s/g, '') + '" dir="ltr">' + esc(t(lang, 'cta.call')) + ' ' + esc(D.company.phone) + '</a>' +
          '<a class="btn ghost-light lg" href="' + waUrl(t(lang, 'wa.text')) + '" target="_blank" rel="noopener">' + esc(t(lang, 'cta.order')) + '</a>';
      return '<section class="cta-band" id="order" aria-labelledby="ctaT"><div class="wrap"><div class="cta-in reveal">' +
        '<h2 id="ctaT">' + esc(t(lang, 'cta.title')) + '</h2><p>' + esc(t(lang, hasPortal() ? 'cta.sub' : 'cta.subNoPortal')) + '</p>' +
        '<div class="cta">' + btns + '</div></div></div></section>';
    }

    function contact(ctx) {
      var lang = ctx.lang;
      var info = [['phone', '<a href="tel:' + D.company.phone.replace(/\s/g, '') + '" dir="ltr">' + esc(D.company.phone) + '</a>'],
        ['email', '<a href="mailto:' + D.company.email + '">' + esc(D.company.email) + '</a>']].map(function (x) {
        return '<div><dt>' + esc(t(lang, 'contact.' + x[0])) + '</dt><dd>' + x[1] + '</dd></div>';
      }).join('');
      return '<section class="sec alt" id="contact" aria-labelledby="contactT"><div class="wrap">' +
        sectionHead(lang, 'contact.eyebrow', 'contact.title', null, 'contactT') +
        '<div class="grid-2 contact-grid"><dl class="contact-list card reveal">' + info + '</dl>' +
        '<form class="card contact-form reveal" id="contactForm" style="--i:1"><h3>' + esc(t(lang, 'form.title')) + '</h3>' +
        '<label>' + esc(t(lang, 'form.name')) + '<input name="name" autocomplete="name" required></label>' +
        '<label>' + esc(t(lang, 'form.phone')) + '<input name="phone" type="tel" autocomplete="tel" dir="ltr"></label>' +
        '<label>' + esc(t(lang, 'form.msg')) + '<textarea name="msg" rows="4" required></textarea></label>' +
        '<button class="btn primary" type="submit">' + esc(t(lang, 'form.send')) + ICON.arrow + '</button>' +
        '<p class="muted">' + esc(t(lang, 'form.note')) + '</p></form></div></div></section>';
    }

    /* ---------- category page ---------- */
    function divisionMain(ctx) {
      var lang = ctx.lang, L = links(ctx), dv = divBy(ctx.slug) || D.divisions[0];
      var name = t(lang, 'supply.' + dv.id + '.t'), first = catBy(dv.cats[0]) || D.categories[0];
      var jump = dv.cats.map(function (sl) { var c = catBy(sl); return c ? '<a class="chip" href="#' + sl + '">' + esc(pick(c.name, lang)) + '</a>' : ''; }).join('');
      var sections = dv.cats.map(function (sl, k) {
        var c = catBy(sl); if (!c) return '';
        var items = c.items.map(function (it, i) {
          return '<li class="card item reveal" style="--i:' + (i % 4) + '"><span class="item-name">' + esc(pick(it.name, lang)) + '</span>' +
            (it.pack ? '<span class="item-pack"><small>' + esc(t(lang, 'cat.pack')) + '</small>' + esc(t(lang, 'pack.' + it.pack)) + '</span>' : '') + '</li>';
        }).join('');
        return '<section class="sec cat-sec' + (k % 2 ? ' alt' : '') + '" id="' + sl + '" aria-labelledby="h-' + sl + '"><div class="wrap">' +
          '<div class="cat-head"><span class="cat-thumb">' + photo('cat', sl, c, L, [800, 600]) + '</span><div><h2 class="title sm" id="h-' + sl + '">' + esc(pick(c.name, lang)) + '</h2>' +
          '<p class="muted">' + esc(t(lang, 'cat.count', { n: c.items.length })) + '</p></div></div>' +
          '<ul class="items" role="list">' + items + '</ul></div></section>';
      }).join('');
      var others = D.divisions.map(function (x) {
        var cur = x.id === dv.id;
        return '<a class="chip' + (cur ? ' current' : '') + '" href="' + L.div(x.id) + '"' + (cur ? ' aria-current="page"' : '') + '>' + esc(t(lang, 'supply.' + x.id + '.t')) + '</a>';
      }).join('');
      var wa = waUrl(t(lang, 'wa.textFor', { name: name }));
      return '<main id="main"><section class="page-hero" style="--h:' + first.hue + '"><div class="wrap">' +
        '<nav class="crumbs" aria-label="Breadcrumb"><a href="' + L.home + '">' + esc(t(lang, 'cat.home')) + '</a><span aria-hidden="true">/</span>' +
        '<a href="' + L.sect('supply') + '">' + esc(t(lang, 'supply.title')) + '</a><span aria-hidden="true">/</span><span aria-current="page">' + esc(name) + '</span></nav>' +
        '<div class="ph"><div class="ph-img">' + photo('cat', first.slug, dv.image ? dv : first, L, [800, 600], true) + '</div><div><h1>' + esc(name) + '</h1><p class="lead">' + esc(t(lang, 'supply.' + dv.id + '.d')) + '</p>' +
        '<div class="chips jump">' + jump + '</div></div></div>' +
        '<div class="cta"><a class="btn primary lg" href="' + wa + '" target="_blank" rel="noopener">' + esc(t(lang, 'cta.order')) + ICON.arrow + '</a>' +
        '<a class="btn lg" href="tel:' + D.company.phone.replace(/\s/g, '') + '" dir="ltr">' + esc(D.company.phone) + '</a></div></div></section>' +
        sections +
        '<section class="sec" aria-labelledby="othersT"><div class="wrap"><p class="note">' + esc(t(lang, 'cat.priceNote')) + '</p>' +
        '<h2 class="title sm" id="othersT">' + esc(t(lang, 'cat.other')) + '</h2><div class="chips">' + others + '</div></div></section>' +
        '</main>';
    }

    function legalMain(ctx) {
      var lang = ctx.lang, k = ctx.slug; // 'privacy' or 'terms'
      return '<main id="main"><section class="sec legal"><div class="wrap narrow"><h1 class="title">' + esc(t(lang, k + '.title')) + '</h1>' +
        '<p>' + esc(t(lang, k + '.p1')) + '</p><p>' + esc(t(lang, k + '.p2')) + '</p></div></section></main>';
    }

    function render(ctx) {
      var out = header(ctx);
      if (ctx.page === 'home') {
        out += '<main id="main">' + hero(ctx) + supply(ctx) + about(ctx) + brands(ctx) + why(ctx) + how(ctx) + ventures(ctx) + locations(ctx) + testimonials(ctx) + gallery(ctx) + cta(ctx) + contact(ctx) + '</main>';
      } else if (ctx.page === 'division') {
        out += divisionMain(ctx);
      } else {
        out += legalMain(ctx);
      }
      return out + footer(ctx);
    }

    function title(ctx) {
      var lang = ctx.lang;
      if (ctx.page === 'home') return t(lang, 'site.title');
      if (ctx.page === 'division') return t(lang, 'supply.' + ctx.slug + '.t') + ' | ' + t(lang, 'brand.full');
      return t(lang, ctx.slug + '.title') + ' | ' + t(lang, 'brand.full');
    }
    function description(ctx) {
      var lang = ctx.lang;
      if (ctx.page === 'division') return t(lang, 'supply.' + ctx.slug + '.d');
      return t(lang, 'site.desc');
    }

    return { render: render, title: title, description: description, t: t, rich: rich, esc: esc };
  }

  return { create: create, esc: esc };
});
