/*
 * ARTWORK GENERATOR: writes placeholder illustrations for the 13 category cards and 6 industry cards.
 * Replace any of them with a real photo: put the photo in assets/img/cat/ or assets/img/ind/ and set
 * `image: 'img/cat/your-photo.jpg'` on that category (or industry) in data.js.
 * Run: node tools/make-art.js
 */
const fs = require('fs');
const path = require('path');
const OUT = path.join(__dirname, '..', 'assets', 'img');

function rng(seed) { let a = 0; for (let i = 0; i < seed.length; i++) a = (a * 31 + seed.charCodeAt(i)) >>> 0;
  return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
function mix(hex, to, k) { const h = hex.replace('#', ''), n = parseInt(h, 16); const c = [n >> 16, (n >> 8) & 255, n & 255]; const t = to === 'w' ? 255 : 0;
  return '#' + c.map(v => Math.round(v + (t - v) * k).toString(16).padStart(2, '0')).join(''); }

const CATS = {
  'tomatoes': { bg: ['#2B0E10', '#6B1D1A'], cols: ['#FF6B4D', '#D62F23', '#E8442F'], kinds: ['round'], leaf: '#3FA45B' },
  'cucumbers-squash': { bg: ['#0B2616', '#1F5A33'], cols: ['#6FBF4F', '#2F8F3F', '#A3D86B'], kinds: ['long', 'long', 'round'], leaf: '#2E8F4E' },
  'potatoes-roots': { bg: ['#2A1D10', '#5C4023'], cols: ['#D9AE72', '#B98A4E', '#F08A2C'], kinds: ['ellipse', 'ellipse', 'long'], leaf: '#4C9A47' },
  'onions-garlic': { bg: ['#25122E', '#55306B'], cols: ['#B067C7', '#E9DDF0', '#8E3FA8'], kinds: ['round'], leaf: '#4C9A47' },
  'peppers-eggplant': { bg: ['#0F2A18', '#27603A'], cols: ['#E8442F', '#F2B705', '#4CAF50', '#6B2D86'], kinds: ['round', 'long'], leaf: '#2E8F4E' },
  'leafy-herbs': { bg: ['#0A2415', '#1D5C34'], cols: ['#5DBB63', '#2E8F4E', '#8ED081'], kinds: ['leaf'], leaf: '#2E8F4E' },
  'cabbage-broccoli': { bg: ['#0C2818', '#2A6A3B'], cols: ['#8ED081', '#4CAF50', '#E6F0C2', '#6A2C7B'], kinds: ['round', 'leaf'], leaf: '#2E8F4E' },
  'citrus': { bg: ['#2D1A06', '#80450F'], cols: ['#FFA531', '#F58A0B', '#FFD84A', '#9BD24C'], kinds: ['round'], leaf: '#3FA45B' },
  'apples-pears': { bg: ['#2A0E0E', '#6E2A22'], cols: ['#E0412F', '#8FCB4B', '#C7E36A', '#F0B03C'], kinds: ['round'], leaf: '#3FA45B' },
  'grapes-berries': { bg: ['#1C0F2D', '#4B2A78'], cols: ['#8E5BC4', '#5A2A8C', '#9ACD5A', '#E0405A'], kinds: ['bunch', 'bunch', 'round'], leaf: '#3FA45B' },
  'melons': { bg: ['#0C2616', '#245C37'], cols: ['#3FA45B', '#E8506B', '#F2C94C', '#8ED081'], kinds: ['biground'], leaf: '#2E8F4E' },
  'tropical-fruit': { bg: ['#2A2208', '#7A5A0F'], cols: ['#FFD84A', '#FFB02E', '#F26B3A', '#8ED081'], kinds: ['arc', 'round'], leaf: '#3FA45B' },
  'stone-fruit-pomegranate': { bg: ['#2D1210', '#7A2A2E'], cols: ['#FF9B6A', '#E8506B', '#C42B4B', '#F5C26B'], kinds: ['round'], leaf: '#3FA45B' }
};

function catSvg(slug, spec) {
  const r = rng(slug);
  let defs = '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + spec.bg[0] + '"/><stop offset="1" stop-color="' + spec.bg[1] + '"/></linearGradient>';
  spec.cols.forEach((c, i) => { defs += '<radialGradient id="g' + i + '" cx=".34" cy=".3" r=".85"><stop offset="0" stop-color="' + mix(c, 'w', .32) + '"/><stop offset="1" stop-color="' + mix(c, 'b', .22) + '"/></radialGradient>'; });
  let body = '<rect width="800" height="600" fill="url(#bg)"/><circle cx="640" cy="120" r="260" fill="#fff" opacity=".05"/>';
  const items = [];
  const n = 11 + Math.floor(r() * 4);
  for (let i = 0; i < n; i++) {
    items.push({ x: 90 + r() * 620, y: 150 + r() * 380, s: 46 + r() * 56, k: spec.kinds[Math.floor(r() * spec.kinds.length)], c: Math.floor(r() * spec.cols.length), a: (r() - .5) * 100 });
  }
  items.sort((a, b) => a.y - b.y);
  items.forEach(it => {
    const f = 'url(#g' + it.c + ')', x = it.x.toFixed(0), y = it.y.toFixed(0), s = it.s;
    if (it.k === 'round' || it.k === 'biground') {
      const rr = it.k === 'biground' ? s * 1.5 : s;
      body += '<circle cx="' + x + '" cy="' + y + '" r="' + rr.toFixed(0) + '" fill="' + f + '"/>' +
        '<ellipse cx="' + (it.x - rr * .35).toFixed(0) + '" cy="' + (it.y - rr * .42).toFixed(0) + '" rx="' + (rr * .26).toFixed(0) + '" ry="' + (rr * .14).toFixed(0) + '" fill="#fff" opacity=".24" transform="rotate(-28 ' + (it.x - rr * .35).toFixed(0) + ' ' + (it.y - rr * .42).toFixed(0) + ')"/>' +
        '<path d="M' + x + ' ' + (it.y - rr + 4).toFixed(0) + 'l-10 -14 10 4 10 -4z" fill="' + spec.leaf + '"/>';
    } else if (it.k === 'long' || it.k === 'ellipse') {
      const rx = it.k === 'long' ? s * 1.5 : s * 1.05, ry = it.k === 'long' ? s * .42 : s * .78;
      body += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + rx.toFixed(0) + '" ry="' + ry.toFixed(0) + '" fill="' + f + '" transform="rotate(' + it.a.toFixed(0) + ' ' + x + ' ' + y + ')"/>' +
        '<ellipse cx="' + (it.x - rx * .25).toFixed(0) + '" cy="' + (it.y - ry * .35).toFixed(0) + '" rx="' + (rx * .35).toFixed(0) + '" ry="' + (ry * .16).toFixed(0) + '" fill="#fff" opacity=".22" transform="rotate(' + it.a.toFixed(0) + ' ' + x + ' ' + y + ')"/>';
    } else if (it.k === 'leaf') {
      const rx = s * 1.5, ry = s * .62;
      body += '<g transform="rotate(' + it.a.toFixed(0) + ' ' + x + ' ' + y + ')"><ellipse cx="' + x + '" cy="' + y + '" rx="' + rx.toFixed(0) + '" ry="' + ry.toFixed(0) + '" fill="' + f + '"/>' +
        '<path d="M' + (it.x - rx).toFixed(0) + ' ' + y + 'H' + (it.x + rx).toFixed(0) + '" stroke="#fff" stroke-width="3" opacity=".25"/></g>';
    } else if (it.k === 'bunch') {
      for (let j = 0; j < 9; j++) {
        const cx = it.x + (j % 3 - 1) * 26 + (Math.floor(j / 3) % 2) * 12, cy = it.y + Math.floor(j / 3) * 24;
        body += '<circle cx="' + cx.toFixed(0) + '" cy="' + cy.toFixed(0) + '" r="21" fill="' + f + '"/><circle cx="' + (cx - 6).toFixed(0) + '" cy="' + (cy - 7).toFixed(0) + '" r="5" fill="#fff" opacity=".25"/>';
      }
    } else if (it.k === 'arc') {
      body += '<path d="M' + (it.x - s * 1.3).toFixed(0) + ' ' + y + 'Q' + x + ' ' + (it.y + s * 1.1).toFixed(0) + ' ' + (it.x + s * 1.3).toFixed(0) + ' ' + (it.y - 10).toFixed(0) + '" fill="none" stroke="' + mix(spec.cols[it.c], 'b', .05) + '" stroke-width="' + (s * .55).toFixed(0) + '" stroke-linecap="round"/>';
    } else if (it.k === 'date') {
      body += '<ellipse cx="' + x + '" cy="' + y + '" rx="' + (s * .7).toFixed(0) + '" ry="' + (s * .42).toFixed(0) + '" fill="' + f + '" transform="rotate(' + it.a.toFixed(0) + ' ' + x + ' ' + y + ')"/>';
    }
  });
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"><defs>' + defs + '</defs>' + body + '</svg>\n';
}

/* ---- industry scenes ---- */
function dots(r, x0, y0, w, h, n, cols, rad) { let s = ''; for (let i = 0; i < n; i++) s += '<circle cx="' + (x0 + r() * w).toFixed(0) + '" cy="' + (y0 + r() * h).toFixed(0) + '" r="' + rad + '" fill="' + cols[Math.floor(r() * cols.length)] + '"/>'; return s; }
const IND = {
  supermarkets(r) {
    let s = '<rect width="800" height="600" fill="url(#bg)"/>';
    [150, 290, 430].forEach(y => { s += '<rect x="60" y="' + (y + 70) + '" width="680" height="12" rx="4" fill="#CFE3D4" opacity=".7"/>' + dots(r, 80, y + 20, 640, 40, 26, ['#E8442F', '#FFA531', '#8ED081', '#F2C94C', '#B067C7'], 24); });
    return s + '<rect x="60" y="520" width="680" height="14" rx="5" fill="#CFE3D4" opacity=".7"/>';
  },
  restaurants(r) {
    return '<rect width="800" height="600" fill="url(#bg)"/><circle cx="400" cy="320" r="220" fill="#F4EFE6"/><circle cx="400" cy="320" r="170" fill="none" stroke="#D8CFBE" stroke-width="6"/>' +
      dots(r, 290, 210, 220, 220, 14, ['#E8442F', '#8ED081', '#FFA531', '#4CAF50', '#F2C94C'], 30) +
      '<path d="M110 120v360M85 120v110a25 25 0 0 0 50 0V120" stroke="#E6DCC8" stroke-width="10" fill="none" stroke-linecap="round"/><path d="M690 120c-40 40-40 120 0 150v210" stroke="#E6DCC8" stroke-width="12" fill="none" stroke-linecap="round"/>';
  },
  hotels(r) {
    let s = '<rect width="800" height="600" fill="url(#bg)"/><rect x="190" y="110" width="420" height="440" rx="8" fill="#E9DFC9"/><rect x="190" y="110" width="420" height="40" fill="#C9B98F"/>';
    for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) s += '<rect x="' + (225 + i * 98) + '" y="' + (175 + j * 62) + '" width="56" height="40" rx="4" fill="' + (r() > .35 ? '#FFD98A' : '#8099B5') + '"/>';
    return s + '<rect x="350" y="470" width="100" height="80" rx="4" fill="#7B5B3A"/>';
  },
  juice(r) {
    return '<rect width="800" height="600" fill="url(#bg)"/><path d="M290 190h220l-26 330a24 24 0 0 1-24 22H340a24 24 0 0 1-24-22z" fill="#FFB02E" opacity=".95"/><path d="M290 190h220l-6 80H296z" fill="#FFD84A"/><path d="M450 190l40-110 40 14" stroke="#F4F1E8" stroke-width="12" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
      '<circle cx="190" cy="430" r="72" fill="#F58A0B"/><circle cx="190" cy="430" r="56" fill="#FFD27A"/><path d="M190 374v112M134 430h112M150 390l80 80M230 390l-80 80" stroke="#F58A0B" stroke-width="4"/>' +
      '<circle cx="620" cy="470" r="60" fill="#9BD24C"/><circle cx="620" cy="470" r="46" fill="#D9F0A0"/>';
  },
  grocers(r) {
    let s = '<rect width="800" height="600" fill="url(#bg)"/><rect x="100" y="110" width="600" height="90" fill="#F4F1E8"/>';
    for (let i = 0; i < 10; i++) s += '<path d="M' + (100 + i * 60) + ' 150h60v70a30 30 0 0 1-60 0z" fill="' + (i % 2 ? '#F4F1E8' : '#E8442F') + '"/>';
    s += '<rect x="100" y="250" width="600" height="290" fill="#1B3A28" opacity=".55"/>';
    [140, 310, 480].forEach(x => { s += '<rect x="' + x + '" y="400" width="150" height="110" rx="8" fill="#8A6038"/>' + dots(r, x + 15, 370, 120, 40, 9, ['#E8442F', '#FFA531', '#8ED081', '#F2C94C'], 22); });
    return s;
  },
  camps(r) {
    let s = '<rect width="800" height="600" fill="url(#bg)"/><circle cx="620" cy="140" r="70" fill="#FFE29A" opacity=".9"/><rect y="440" width="800" height="160" fill="#B98A4E" opacity=".75"/>';
    [[190, 460, 1.2], [430, 480, 1.5], [640, 455, 1]].forEach(t => { const x = t[0], y = t[1], k = t[2]; s += '<path d="M' + (x - 110 * k) + ' ' + y + 'L' + x + ' ' + (y - 150 * k) + 'L' + (x + 110 * k) + ' ' + y + 'z" fill="#F0E7D2"/><path d="M' + x + ' ' + (y - 150 * k) + 'L' + (x + 24 * k) + ' ' + y + 'H' + (x - 24 * k) + 'z" fill="#4A3A24"/>'; });
    return s;
  }
};
const INDBG = {
  supermarkets: ['#0B2A33', '#1F5C6B'], restaurants: ['#2B1408', '#6B3414'], hotels: ['#1A1B3A', '#4B3F7A'],
  juice: ['#3A1C06', '#B85A0C'], grocers: ['#0B2616', '#256B3E'], camps: ['#2A1B3A', '#C16A3A']
};
function indSvg(id) {
  const r = rng(id);
  const defs = '<linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="' + INDBG[id][0] + '"/><stop offset="1" stop-color="' + INDBG[id][1] + '"/></linearGradient>';
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice"><defs>' + defs + '</defs>' + IND[id](r) + '</svg>\n';
}

fs.mkdirSync(path.join(OUT, 'cat'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'ind'), { recursive: true });
Object.keys(CATS).forEach(slug => fs.writeFileSync(path.join(OUT, 'cat', slug + '.svg'), catSvg(slug, CATS[slug])));
Object.keys(IND).forEach(id => fs.writeFileSync(path.join(OUT, 'ind', id + '.svg'), indSvg(id)));
console.log('Wrote ' + Object.keys(CATS).length + ' category images and ' + Object.keys(IND).length + ' industry images');
