# Thara Ground Trading Company: wholesale fruit and vegetable website

A multi-page website for a fruit and vegetable wholesaler in the Dammam vegetable market.
Plain HTML, CSS and JavaScript. No framework and nothing to install to view it.

- 1 home page, 3 product line pages (`products/`: Vegetables, Fruit, Leafy greens and herbs; each lists every category and variety), privacy and terms pages
- English and Arabic (the Arabic version flips the whole layout right to left), switched from the footer
- Black and green design, dark by default, with a light (white and green) version one click away in the header; the choice is remembered
- Orders go through WhatsApp. There is no buyer portal yet (see "Adding a portal later")

## Home page sections (same order as the reference site)

Top bar (phone, WhatsApp, hours, language) → header with a Products mega-menu and phone number → hero with an opening-hours pill, two buttons and key numbers → What we supply (3 big cards that open the product line pages, plus an order card) → Producers and clients strip → About us with vision, mission and a stat badge → How ordering works (4 steps) → Why choose us with customer-type pills → Locations → Testimonials → Gallery → Order band → Contact form and details → 4-column footer.

- **Testimonials and gallery** stay hidden until you fill `testimonials` and `gallery` in `data.js`. Only add real customer quotes and your own photos.
- **Social links** in the footer appear when you fill `company.social` in `data.js`.
- **Contact form** opens WhatsApp with the message ready to send (no server needed).
- **About text, vision and mission** are in `i18n.js` (`about.*`). They are a first draft: edit them to match your real story.

## Files

| File | What it is |
|---|---|
| `assets/js/data.js` | Products, categories, brands, clients, stats, phone, email, WhatsApp number |
| `assets/js/i18n.js` | All visible text in English and Arabic |
| `assets/css/styles.css` | Design and colours (the `:root` block at the top) |
| `assets/js/render.js`, `main.js` | Page structure and behaviour |
| `build.js` | Writes the HTML pages from the data and translation files |
| `assets/img/` | `logo.svg`, `hero.svg`, and card artwork in `cat/` and `ind/` |
| `tools/make-art.js` | Regenerates the placeholder card artwork |
| `PHOTOS.md` | How to add real photos |

## How to edit

1. Change text in `assets/js/i18n.js`, or products, numbers and contacts in `assets/js/data.js`.
2. Run `node build.js` (needs Node.js). This rewrites `index.html` and every page in `categories/`.
3. Upload the whole folder to your hosting.

You can also open `index.html` directly in a browser to preview it.

## Still to fill in

- **Logo:** your logo is `assets/img/logo.png` (and `favicon.png` for the browser tab). To change it, replace those files.
- **Real photos:** see `PHOTOS.md`. The top hero works best with your own wide photo (the market, your shop or a delivery truck): save it as `assets/img/hero.jpg` and set `hero.image: 'img/hero.jpg'` in `data.js`. A short silent video also works (`hero.video`).
- **Farm names:** the featured producer is Dawa Agriculture. Add the other producers to `brands` and your clients to `clients` in `data.js`. The names marked `PRODUCER 02` to `12`, `CLIENT 02` to `12` and `[Second brand name]` are placeholders.
- **Imported produce:** add the names to the right category in `data.js` when you have them.
- **Packing:** add `'crate'`, `'carton'`, `'sack'` or `'bundle'` as the last value of a product line to show its packing.
- **Tagline:** `brand.tagline` in `i18n.js`.
- **Domain:** set `site.url` in `data.js` before the final build.
- **Legal pages:** replace `privacy.*` and `terms.*` in `i18n.js` with text approved by a legal adviser.
- **Arabic:** have a native Arabic speaker read the Arabic text and product names.

## Adding a portal later

While `company.portalUrl` in `data.js` is empty, every portal button is an "Order on WhatsApp" button. When you have a buyer portal, put its address in `portalUrl` and `portalLoginUrl`, run `node build.js`, and the portal buttons and portal sections return.

## Chinese

Chinese is switched off. Chinese product names are still in `data.js` if you ever want it back.

## Putting it online and on Google

1. Buy a domain (for example `tharaground.com`).
2. Host the folder on any static host (Cloudflare Pages, Netlify or GitHub Pages are free) and connect the domain.
3. Add the site to Google Search Console and submit `https://your-domain/sitemap.xml`.
4. Create a Google Business Profile for the shop so it appears on Google Maps.
