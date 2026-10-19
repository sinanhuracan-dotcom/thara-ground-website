# Adding real photos

The category and industry cards currently show generated artwork so the site looks complete.
To use real photographs:

1. Save one photo per card, **named exactly after the slug**, in these folders (4:3 landscape, about 1200 × 900 px, JPG or WebP, under 250 KB each):
   - `assets/img/cat/` : `tomatoes`, `cucumbers-squash`, `potatoes-roots`, `onions-garlic`, `peppers-eggplant`, `leafy-herbs`, `cabbage-broccoli`, `citrus`, `apples-pears`, `grapes-berries`, `melons`, `tropical-fruit`, `stone-fruit-pomegranate`
   - `assets/img/ind/` : `supermarkets`, `restaurants`, `hotels`, `juice`, `grocers`, `camps`
2. In `assets/js/data.js`, change `images: { ext: 'svg' }` to `images: { ext: 'jpg' }` (or `'webp'`).
3. Run `node build.js`. Any photo that is missing still falls back to the artwork, so you can add them gradually.
4. The hero background is `assets/img/hero.svg`. Replace it with a wide photo (at least 1600 px) and set `hero.image` in `data.js`.

## Where to get photos

- **Best: your own.** A phone photo of your crates in good daylight looks more real than any stock image and shows buyers what you actually sell.
- **Free stock sites** that allow commercial use: Unsplash, Pexels and Pixabay. Check the licence on each photo page before using it, and keep a note of where each came from.
- **Do not** copy pictures from Google Image results or other companies' websites. Most are copyrighted, and a business website can receive takedown notices or claims for using them.

## Search terms

| Slot | Search for |
|---|---|
| tomatoes | tomatoes crate market |
| cucumbers-squash | cucumbers zucchini |
| potatoes-roots | potatoes carrots sack |
| onions-garlic | onions garlic |
| peppers-eggplant | bell peppers eggplant |
| leafy-herbs | parsley mint lettuce bunch |
| cabbage-broccoli | cabbage cauliflower broccoli |
| citrus | oranges lemons crate |
| apples-pears | apples pears |
| grapes-berries | grapes strawberries |
| melons | watermelon cantaloupe |
| tropical-fruit | bananas mango pineapple |
| stone-fruit-pomegranate | peaches plums pomegranate |
| supermarkets | supermarket produce aisle |
| restaurants | restaurant kitchen vegetables |
| hotels | hotel buffet |
| juice | fresh orange juice |
| grocers | grocery store fruit stand |
| camps | desert camp tents |
