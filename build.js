/*
 * BUILD SCRIPT: writes every HTML page from data.js and i18n.js, in English (root)
 * and Arabic (ar/ folder, right-to-left), plus sitemap.xml and robots.txt.
 * Run after editing the data or translation files:   node build.js
 * Needs Node.js 16 or newer. No packages to install.
 */
const fs = require('fs');
const path = require('path');

const D = require('./assets/js/data.js');
const I = require('./assets/js/i18n.js');
const R = require('./assets/js/render.js').create(D, I);
const esc = R.esc;

const FONTS = 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@600;800&family=IBM+Plex+Mono:wght@500;600&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=IBM+Plex+Sans:wght@400;500;600&display=swap';

// Runs before first paint: sets theme (light by default), language and direction, so the page does not flash.
// Arabic pages carry data-page-lang="ar" and always use Arabic; English pages follow the saved choice or the browser language.
const EARLY = "(function(){var d=document.documentElement;d.classList.add('js');" +
  "var s=function(k){try{return localStorage.getItem(k)}catch(e){return null}};" +
  "d.setAttribute('data-theme',s('theme')==='light'?'light':'dark');" +
  "var l=d.getAttribute('data-page-lang');if(!l){l=s('lang');if(l!=='ar'&&l!=='en'){var n=(navigator.language||'en').toLowerCase();l=n.indexOf('ar')===0?'ar':'en'}}" +
  "d.lang=l;d.dir=l==='ar'?'rtl':'ltr';if(l!=='en')d.classList.add('relang');" +
  "setTimeout(function(){d.classList.add('reveal-all')},4000)})();";

// remove pages from older builds
fs.rmSync(path.join(__dirname, 'categories'), { recursive: true, force: true });

function write(file, html) {
  const full = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
}

// Each logical page exists once per language. `en` and `ar` are the file paths.
const PAGES = [
  { page: 'home', slug: '', en: 'index.html', ar: 'ar/index.html' },
  ...D.divisions.map(d => ({ page: 'division', slug: d.id, en: 'products/' + d.id + '.html', ar: 'ar/products/' + d.id + '.html' })),
  { page: 'legal', slug: 'privacy', en: 'privacy.html', ar: 'ar/privacy.html' },
  { page: 'legal', slug: 'terms', en: 'terms.html', ar: 'ar/terms.html' }
];

const ROOT = D.site.url.replace(/\/$/, '');
const absUrl = file => ROOT + '/' + (file === 'index.html' || file === 'ar/index.html' ? file.replace(/index\.html$/, '') : file);
const relBase = file => { const depth = path.posix.dirname(file).split('/').filter(x => x && x !== '.').length; return depth ? '../'.repeat(depth) : ''; };
const relTo = (from, to) => path.posix.relative(path.posix.dirname(from), to) || path.posix.basename(to);

// schema.org LocalBusiness data (JSON-LD) for the home page: helps Google show the business in maps and local results.
function localBusinessLD(lang, file) {
  const T = k => I[lang][k] || I.en[k];
  const cities = D.locations.cities.map(c => ({ '@type': 'City', name: c[lang] || c.en }));
  const social = Object.values(D.company.social || {}).filter(Boolean);
  const obj = {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'WholesaleStore'],
    '@id': absUrl('index.html') + '#business',
    name: T('brand.full'),
    alternateName: T('brand.name'),
    url: absUrl(file),
    image: absUrl('assets/img/logo.png'),
    telephone: D.company.phone.replace(/\s/g, ''),
    email: D.company.email,
    address: { '@type': 'PostalAddress', streetAddress: T('contact.addressVal'), addressLocality: 'Dammam', addressCountry: 'SA' },
    openingHoursSpecification: [{ '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '04:30', closes: '20:30' }],
    areaServed: cities,
    hasMap: D.company.mapUrl,
    inLanguage: lang
  };
  if (social.length) obj.sameAs = social;
  return '<script type="application/ld+json">' + JSON.stringify(obj).replace(/</g, '\\u003c') + '</script>';
}

function pageHTML(ctx, file, counterpart) {
  const base = relBase(file);
  const title = R.title(ctx), desc = R.description(ctx);
  const body = R.render(ctx);
  const isAr = ctx.lang === 'ar';
  const enFile = isAr ? counterpart : file, arFile = isAr ? file : counterpart;
  return `<!doctype html>
<html lang="${ctx.lang}" dir="${isAr ? 'rtl' : 'ltr'}" data-theme="dark"${isAr ? ' data-page-lang="ar"' : ''}>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#06170D">
<link rel="canonical" href="${esc(absUrl(file))}">
<link rel="alternate" hreflang="en" href="${esc(absUrl(enFile))}">
<link rel="alternate" hreflang="ar" href="${esc(absUrl(arFile))}">
<link rel="alternate" hreflang="x-default" href="${esc(absUrl(enFile))}">
<meta property="og:type" content="website">
<meta property="og:locale" content="${isAr ? 'ar_SA' : 'en_US'}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<link rel="icon" href="${base}assets/img/favicon.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${base}assets/css/styles.css">
<script>${EARLY}</script>
${ctx.page === 'home' ? localBusinessLD(ctx.lang, file) : ''}
<noscript><style>.relang #app{visibility:visible}.js .reveal{opacity:1;transform:none}</style></noscript>
</head>
<body data-page="${ctx.page}" data-slug="${ctx.slug || ''}" data-base="${base}" data-alt="${esc(relTo(file, counterpart))}">
<div id="app">${body}</div>
<script src="${base}assets/js/data.js" defer></script>
<script src="${base}assets/js/i18n.js" defer></script>
<script src="${base}assets/js/render.js" defer></script>
<script src="${base}assets/js/main.js" defer></script>
</body>
</html>
`;
}

const urls = [];
PAGES.forEach(p => {
  const enCtx = { lang: 'en', page: p.page, slug: p.slug, base: relBase(p.en) };
  const arCtx = { lang: 'ar', page: p.page, slug: p.slug, base: relBase(p.ar) };
  write(p.en, pageHTML(enCtx, p.en, p.ar));
  write(p.ar, pageHTML(arCtx, p.ar, p.en));
  urls.push(p.en, p.ar);
});

const alt = u => '    <xhtml:link rel="alternate" hreflang="%L" href="' + absUrl(u) + '"/>';
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' +
  PAGES.map(p => ['en', 'ar'].map(l => {
    const f = p[l];
    return '  <url>\n    <loc>' + absUrl(f) + '</loc>\n' +
      alt(p.en).replace('%L', 'en') + '\n' + alt(p.ar).replace('%L', 'ar') + '\n' +
      '  </url>';
  }).join('\n')).join('\n') + '\n</urlset>\n');
write('robots.txt', 'User-agent: *\nAllow: /\nSitemap: ' + ROOT + '/sitemap.xml\n');

console.log('Built ' + urls.length + ' pages, sitemap.xml and robots.txt');
