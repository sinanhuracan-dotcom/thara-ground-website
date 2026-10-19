/*
 * BUILD SCRIPT: writes every HTML page from data.js and i18n.js.
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
const EARLY = "(function(){var d=document.documentElement;d.classList.add('js');" +
  "var s=function(k){try{return localStorage.getItem(k)}catch(e){return null}};" +
  "d.setAttribute('data-theme',s('theme')==='light'?'light':'dark');" +
  "var l=s('lang');if(l!=='ar'&&l!=='en'){var n=(navigator.language||'en').toLowerCase();l=n.indexOf('ar')===0?'ar':'en'}" +
  "d.lang=l;d.dir=l==='ar'?'rtl':'ltr';if(l!=='en')d.classList.add('relang');" +
  "setTimeout(function(){d.classList.add('reveal-all')},4000)})();";

// remove pages from older builds
fs.rmSync(path.join(__dirname, 'categories'), { recursive: true, force: true });

function write(file, html) {
  const full = path.join(__dirname, file);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, html);
}

function pageHTML(ctx, file) {
  const base = ctx.base;
  const title = R.title(ctx), desc = R.description(ctx);
  const body = R.render(ctx);
  const canonical = D.site.url.replace(/\/$/, '') + '/' + file;
  return `<!doctype html>
<html lang="en" dir="ltr" data-theme="dark">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<meta name="theme-color" content="#06170D">
<link rel="canonical" href="${esc(canonical)}">
<meta property="og:type" content="website">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<link rel="icon" href="${base}assets/img/favicon.png" type="image/png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="${FONTS}">
<link rel="stylesheet" href="${base}assets/css/styles.css">
<script>${EARLY}</script>
<noscript><style>.relang #app{visibility:visible}.js .reveal{opacity:1;transform:none}</style></noscript>
</head>
<body data-page="${ctx.page}" data-slug="${ctx.slug || ''}" data-base="${base}">
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
function add(file, ctx) { write(file, pageHTML(ctx, file)); urls.push(file); }

add('index.html', { lang: 'en', page: 'home', slug: '', base: '' });
D.divisions.forEach(d => add('products/' + d.id + '.html', { lang: 'en', page: 'division', slug: d.id, base: '../' }));
add('privacy.html', { lang: 'en', page: 'legal', slug: 'privacy', base: '' });
add('terms.html', { lang: 'en', page: 'legal', slug: 'terms', base: '' });

const root = D.site.url.replace(/\/$/, '');
write('sitemap.xml', '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  urls.map(u => '  <url><loc>' + root + '/' + (u === 'index.html' ? '' : u) + '</loc></url>').join('\n') + '\n</urlset>\n');
write('robots.txt', 'User-agent: *\nAllow: /\nSitemap: ' + root + '/sitemap.xml\n');

console.log('Built ' + urls.length + ' pages, sitemap.xml and robots.txt');
