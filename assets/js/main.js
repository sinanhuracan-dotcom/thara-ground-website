/* BEHAVIOUR: language and theme switching, mobile menu, hero rotation, counters, scroll reveal. */
(function () {
  var D = window.SITE_DATA, I = window.I18N;
  var R = window.SiteRender.create(D, I);
  var root = document.documentElement, body = document.body;
  var app = document.getElementById('app');
  var page = body.getAttribute('data-page') || 'home';
  var slug = body.getAttribute('data-slug') || '';
  var base = body.getAttribute('data-base') || '';
  var lang = root.lang && I[root.lang] ? root.lang : 'en';
  var rm = window.matchMedia('(prefers-reduced-motion: reduce)');
  var cleanups = [];

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function cleanup() { while (cleanups.length) { try { cleanups.pop()(); } catch (e) {} } }
  function $(s, ctx) { return (ctx || app).querySelector(s); }
  function $$(s, ctx) { return [].slice.call((ctx || app).querySelectorAll(s)); }

  /* ---------- mount ---------- */
  function mount(rerender) {
    cleanup();
    var ctx = { lang: lang, page: page, slug: slug, base: base };
    if (rerender) app.innerHTML = R.render(ctx);
    root.lang = lang;
    root.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = R.title(ctx);
    var md = document.querySelector('meta[name="description"]');
    if (md) md.setAttribute('content', R.description(ctx));
    syncTheme();
    initImages();
    initHero();
    initCounters();
    initReveal();
    root.classList.remove('relang');
  }

  /* ---------- theme ---------- */
  function syncTheme() {
    var dark = root.getAttribute('data-theme') === 'dark';
    var b = $('#themeBtn'); if (b) b.setAttribute('aria-pressed', String(dark));
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute('content', dark ? '#08120C' : '#FFFFFF');
  }

  /* ---------- photo fallback: if a photo file is missing, use the generated artwork ---------- */
  function initImages() {
    $$('img[data-fallback]').forEach(function (img) {
      function swap() { var fb = img.getAttribute('data-fallback'); if (fb && img.getAttribute('src') !== fb) img.setAttribute('src', fb); }
      img.addEventListener('error', swap);
      if (img.complete && img.naturalWidth === 0) swap();
    });
  }

  /* ---------- hero rotation ---------- */
  function initHero() {
    var hero = $('.hero'); if (!hero) return;
    var tabs = $$('.hero-tab', hero);
    if (tabs.length < 2) return;
    var title = $('#heroTitle', hero), sub = $('#heroSub', hero), copy = $('.hero-copy', hero);
    var pauseBtn = $('#heroPause', hero), video = $('video', hero);
    var n = tabs.length, DUR = D.hero.slideMs || 7000;
    var idx = 0, elapsed = 0, last = performance.now(), raf = 0, paused = rm.matches, swapTimer = 0;

    function setText(i) {
      title.innerHTML = R.rich(R.t(lang, 'hero.' + (i + 1) + '.title'));
      sub.textContent = R.t(lang, 'hero.' + (i + 1) + '.sub');
    }
    function show(i, animate) {
      idx = i; elapsed = 0;
      tabs.forEach(function (tb, k) {
        tb.setAttribute('aria-selected', String(k === i));
        tb.classList.toggle('active', k === i);
        tb.querySelector('.bar i').style.transform = 'scaleX(0)';
      });
      clearTimeout(swapTimer);
      if (animate && !rm.matches) {
        copy.classList.add('swap');
        swapTimer = setTimeout(function () { setText(i); copy.classList.remove('swap'); }, 220);
      } else { setText(i); }
    }
    function tick(ts) {
      var dt = ts - last; last = ts;
      if (!paused && !document.hidden && dt < 500) {
        elapsed += dt;
        tabs[idx].querySelector('.bar i').style.transform = 'scaleX(' + Math.min(1, elapsed / DUR) + ')';
        if (elapsed >= DUR) show((idx + 1) % n, true);
      }
      raf = requestAnimationFrame(tick);
    }
    function setPaused(p) {
      paused = p;
      hero.classList.toggle('is-paused', p);
      pauseBtn.setAttribute('aria-pressed', String(p));
      pauseBtn.setAttribute('aria-label', R.t(lang, p ? 'hero.play' : 'hero.pause'));
      if (video) { if (p) video.pause(); else { var pr = video.play(); if (pr && pr.catch) pr.catch(function () {}); } }
    }
    tabs.forEach(function (tb, k) { tb.addEventListener('click', function () { show(k, true); }); });
    pauseBtn.addEventListener('click', function () { setPaused(!paused); });
    function onRm(e) { if (e.matches) setPaused(true); }
    if (rm.addEventListener) rm.addEventListener('change', onRm);
    setPaused(paused);
    raf = requestAnimationFrame(tick);
    cleanups.push(function () {
      cancelAnimationFrame(raf); clearTimeout(swapTimer);
      if (rm.removeEventListener) rm.removeEventListener('change', onRm);
    });
  }

  /* ---------- counters ---------- */
  function initCounters() {
    var els = $$('.count'); if (!els.length) return;
    if (rm.matches || !('IntersectionObserver' in window)) return; // keep the final numbers
    var fmt = new Intl.NumberFormat('en-US');
    function setVal(el, v) { el.textContent = fmt.format(Math.round(v)) + (el.getAttribute('data-suffix') || ''); }
    function run(el) {
      var to = parseFloat(el.getAttribute('data-to')), start = performance.now(), dur = 1600;
      (function step(ts) {
        var p = Math.min(1, (ts - start) / dur), e = 1 - Math.pow(1 - p, 3);
        setVal(el, to * e);
        if (p < 1) requestAnimationFrame(step);
      })(start);
    }
    els.forEach(function (el) { setVal(el, 0); });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { io.unobserve(en.target); run(en.target); } });
    }, { threshold: 0.4 });
    els.forEach(function (el) { io.observe(el); });
    cleanups.push(function () { io.disconnect(); });
  }

  /* ---------- scroll reveal ---------- */
  function initReveal() {
    var els = $$('.reveal');
    if (rm.matches || !('IntersectionObserver' in window)) { els.forEach(function (e) { e.classList.add('in'); }); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    els.forEach(function (e) { io.observe(e); });
    cleanups.push(function () { io.disconnect(); });
  }

  /* ---------- global listeners (bound once; the page body is re-rendered, the document is not) ---------- */
  function setMenu(open) {
    var h = $('#siteHeader'), b = $('#menuBtn'); if (!h || !b) return;
    h.classList.toggle('menu-open', open);
    b.setAttribute('aria-expanded', String(open));
  }
  document.addEventListener('click', function (e) {
    var lb = e.target.closest('[data-lang]');
    if (lb) {
      var next = lb.getAttribute('data-lang');
      if (next !== lang && I[next]) {
        lang = next; store('lang', lang);
        var y = window.scrollY; mount(true); window.scrollTo(0, y);
      }
      return;
    }
    if (e.target.closest('#themeBtn')) {
      var toDark = root.getAttribute('data-theme') !== 'dark';
      root.setAttribute('data-theme', toDark ? 'dark' : 'light');
      store('theme', toDark ? 'dark' : 'light');
      syncTheme();
      return;
    }
    if (e.target.closest('#menuBtn')) {
      setMenu(!$('#siteHeader').classList.contains('menu-open'));
      return;
    }
    if (e.target.closest('#nav a')) setMenu(false);
  });
  document.addEventListener('submit', function (e) {
    var f = e.target.closest('#contactForm'); if (!f) return;
    e.preventDefault();
    var v = function (n) { return (f.elements[n].value || '').trim(); };
    var text = R.t(lang, 'form.template', { name: v('name'), phone: v('phone') || '-', msg: v('msg') });
    window.open('https://wa.me/' + D.company.whatsapp + '?text=' + encodeURIComponent(text), '_blank', 'noopener');
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  window.addEventListener('resize', function () { if (window.innerWidth > 960) setMenu(false); });
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      var h = $('#siteHeader'); if (h) h.classList.toggle('scrolled', window.scrollY > 8);
      ticking = false;
    });
  }, { passive: true });

  mount(lang !== 'en');
})();
