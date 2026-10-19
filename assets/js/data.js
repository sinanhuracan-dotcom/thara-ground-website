/*
 * SITE DATA: edit this file to change products, brands, clients, stats and contact details.
 * After editing, run `node build.js` to regenerate the HTML pages (see README.md).
 * All visible interface text lives in i18n.js. Product names live here in English and Arabic (a Chinese name is kept for later but not shown).
 */
(function (root, factory) {
  var d = factory();
  if (typeof module === 'object' && module.exports) module.exports = d;
  else root.SITE_DATA = d;
})(typeof self !== 'undefined' ? self : this, function () {

  // N(en, ar, zh) builds a name in three languages.
  function N(en, ar, zh) { return { en: en, ar: ar, zh: zh }; }
  // L(en, ar, zh, pack) builds a product line. pack is optional: crate, carton, sack or bundle. Leave it out until you know the packing.
  function L(en, ar, zh, pack) { return { name: N(en, ar, zh), pack: pack }; }

  return {
    site: {
      url: 'https://www.example.com' // used in sitemap.xml; replace with your real domain
    },

    company: {
      phone: '+966 55 504 2596',
      email: 'sinanhuracan@gmail.com',
      whatsapp: '966555632845',                    // digits only, with country code
      portalUrl: '',          // leave empty until you build a buyer portal; when filled, the site shows portal buttons
      portalLoginUrl: '',
      accessSubject: 'Business access request',
      quoteSubject: 'Quotation request',
      mapUrl: 'https://www.google.com/maps/search/?api=1&query=Dammam+Vegetable+Market',
      // Add the full address of your pages to show social icons in the footer. Leave '' to hide.
      social: { instagram: '', facebook: '', x: '', tiktok: '', snapchat: '' }
    },

    // Where you deliver. Names in i18n are not needed: they are here in both languages.
    locations: {
      cities: [
        { en: 'Dammam', ar: 'الدمام' }, { en: 'Khobar', ar: 'الخبر' }, { en: 'Dhahran', ar: 'الظهران' },
        { en: 'Qatif', ar: 'القطيف' }, { en: 'Jubail', ar: 'الجبيل' }
      ]
    },

    // "What we supply": three cards on the home page. cats = category slugs counted in the card.
    divisions: [
      { id: 'veg',   image: 'img/vegetables.jpg', cats: ['tomatoes','cucumbers-squash','potatoes-roots','onions-garlic','peppers-eggplant','cabbage-broccoli'], link: 'tomatoes' },
      { id: 'fruit', image: 'img/fruits.jpg', cats: ['citrus','apples-pears','grapes-berries','melons','tropical-fruit','stone-fruit-pomegranate'], link: 'citrus' },
      { id: 'leafy', image: 'img/leafy.jpg', cats: ['leafy-herbs'], link: 'leafy-herbs' }
    ],

    // Customer quotes and gallery photos. Both sections stay hidden while these lists are empty.
    // Testimonial: { quote: { en: '...', ar: '...' }, name: 'Customer name', role: { en: 'Restaurant owner', ar: 'صاحب مطعم' } }
    testimonials: [],
    // Gallery: { src: 'img/gallery/shop-1.jpg', alt: { en: 'Our shop in the Dammam market', ar: 'محلنا في سوق الدمام' } }
    gallery: [],

    // Card images. 'svg' uses the generated artwork in assets/img/cat and assets/img/ind.
    // After adding real photos named after each slug (for example assets/img/cat/tomatoes.jpg),
    // change ext to 'jpg' (or 'webp'). Any photo that is missing falls back to the artwork.
    images: { ext: 'svg' },

    hero: {
      image: 'img/hero.jpg',   // path inside /assets: your trucks and warehouse photo (JPG or WebP).
      video: '',               // optional: e.g. 'video/hero.mp4'. Leave empty to use the image.
      slides: 1,               // 1 = a single fixed message. (Rotating tabs were removed.)
      slideMs: 7000
    },

    // Animated counters. labels are in i18n.js under stats.<id>
    stats: [
      { id: 'years',      value: 20,      suffix: '+' },
      { id: 'varieties',  value: 700,     suffix: '+' },
      { id: 'customers',  value: 1000,    suffix: '+' },
      { id: 'employees',  value: 150,     suffix: '+' },
      { id: 'tonnes',     value: 20000,   suffix: ''  },
      { id: 'warehouses', value: 2,       suffix: ''  }
    ],

    // 13 product categories. Each has its own page: categories/<slug>.html
    categories: [
      { slug: 'tomatoes', icon: '🍅', hue: 8, name: N('Tomatoes', 'الطماطم', '番茄'), items: [
        L('Tomato', 'طماطم', '番茄'),
        L('Cherry tomato (250 g)', 'طماطم كرزية (250 جم)', '圣女果（250克）'),
        L('Cherry tomato, yellow', 'طماطم كرزية صفراء', '黄色圣女果')
      ]},
      { slug: 'cucumbers-squash', icon: '🥒', hue: 110, name: N('Cucumbers, Squash & Pods', 'الخيار والكوسا والقرنيات', '黄瓜、瓜类与豆荚'), items: [
        L('Cucumber', 'خيار', '黄瓜'),
        L('Marrow', 'كوسا', '西葫芦'),
        L('Marrow, small', 'كوسا صغيرة', '小西葫芦'),
        L('Pumpkin, green', 'قرع أخضر', '青南瓜'),
        L('Pumpkin, white', 'قرع أبيض', '白南瓜'),
        L('Pumpkin, yellow', 'قرع أصفر', '黄南瓜'),
        L('Bitter gourd', 'قرع مر', '苦瓜'),
        L('Snake gourd', 'قرع ثعباني', '蛇瓜'),
        L('Okra', 'بامية', '秋葵'),
        L('Drumstick (moringa)', 'مورينجا (درمستيك)', '辣木荚'),
        L('Green beans', 'فاصوليا خضراء', '四季豆')
      ]},
      { slug: 'potatoes-roots', icon: '🥔', hue: 35, name: N('Potatoes & Roots', 'البطاطس والجذور', '土豆与根茎类'), items: [
        L('Potato, big', 'بطاطس كبيرة', '大土豆'),
        L('Sweet potato', 'بطاطا حلوة', '红薯'),
        L('Yam', 'يام', '山药'),
        L('Carrots, imported', 'جزر مستورد', '进口胡萝卜'),
        L('Baby carrot', 'جزر صغير', '小胡萝卜'),
        L('Beetroot', 'شمندر', '甜菜根'),
        L('Radish, red', 'فجل أحمر', '樱桃萝卜'),
        L('Radish, white', 'فجل أبيض', '白萝卜'),
        L('Turnip', 'لفت', '芜菁')
      ]},
      { slug: 'onions-garlic', icon: '🧅', hue: 28, name: N('Onions, Garlic & Ginger', 'البصل والثوم والزنجبيل', '洋葱、大蒜与生姜'), items: [
        L('Onion', 'بصل', '洋葱'),
        L('Onion, white', 'بصل أبيض', '白洋葱'),
        L('Spring onion', 'بصل أخضر', '小葱'),
        L('Leeks', 'كراث', '韭葱'),
        L('Garlic (China)', 'ثوم صيني', '中国大蒜'),
        L('Ginger (China)', 'زنجبيل صيني', '中国生姜')
      ]},
      { slug: 'peppers-eggplant', icon: '🫑', hue: 130, name: N('Peppers & Eggplant', 'الفلفل والباذنجان', '辣椒与茄子'), items: [
        L('Capsicum, green', 'فلفل أخضر', '青椒'),
        L('Capsicum, red', 'فلفل أحمر', '红椒'),
        L('Capsicum, yellow', 'فلفل أصفر', '黄椒'),
        L('Chilli, green (Indian)', 'فلفل حار أخضر هندي', '印度青辣椒'),
        L('Chilli, local', 'فلفل حار محلي', '本地辣椒'),
        L('Eggplant', 'باذنجان', '茄子'),
        L('Eggplant, white small', 'باذنجان أبيض صغير', '小白茄'),
        L('Baby eggplant', 'باذنجان صغير', '小茄子')
      ]},
      { slug: 'leafy-herbs', icon: '🥬', hue: 95, name: N('Leafy Greens & Herbs', 'الورقيات والأعشاب', '叶菜与香草'), items: [
        L('Lettuce, iceberg', 'خس آيسبرغ', '冰山生菜'),
        L('Lettuce, local', 'خس محلي', '本地生菜'),
        L('Lettuce, Lollo Biondo', 'خس لولو بيوندو', '绿叶生菜（Lollo Biondo）'),
        L('Lettuce, Lollo Rosso', 'خس لولو روسو', '红叶生菜（Lollo Rosso）'),
        L('Lettuce, French', 'خس فرنسي', '法国生菜'),
        L('Lettuce, American', 'خس أمريكي', '美国生菜'),
        L('Spinach', 'سبانخ', '菠菜'),
        L('Red spinach', 'سبانخ أحمر', '红苋菜'),
        L('Rocca (rocket)', 'روكا', '芝麻菜'),
        L('Jarjeer', 'جرجير', '本地芝麻菜'),
        L('Regla (purslane)', 'رجلة', '马齿苋'),
        L('Celery', 'كرفس', '芹菜'),
        L('Basil, fresh', 'ريحان طازج', '新鲜罗勒'),
        L('Coriander leaves', 'كزبرة', '香菜'),
        L('Curry leaves', 'ورق الكاري', '咖喱叶'),
        L('Dill leaves', 'شبت', '莳萝'),
        L('Mint leaves', 'نعناع', '薄荷'),
        L('Parsley', 'بقدونس', '欧芹'),
        L('Parsley, English', 'بقدونس إنجليزي', '英国欧芹'),
        L('Rosemary, fresh', 'إكليل الجبل طازج', '新鲜迷迭香'),
        L('Thyme', 'زعتر', '百里香'),
        L('Methi leaves (fenugreek)', 'حلبة خضراء', '葫芦巴叶'),
        L('Korat leaves', 'ورق كورات', 'Korat叶')
      ]},
      { slug: 'cabbage-broccoli', icon: '🥦', hue: 120, name: N('Cabbage, Broccoli & Mushrooms', 'الملفوف والبروكلي والفطر', '甘蓝、西兰花与蘑菇'), items: [
        L('Cabbage, white', 'ملفوف أبيض', '圆白菜'),
        L('Cabbage, red', 'ملفوف أحمر', '紫甘蓝'),
        L('Cauliflower, local', 'قرنبيط محلي', '本地花椰菜'),
        L('Broccoli', 'بروكلي', '西兰花'),
        L('Mushroom, fresh', 'فطر طازج', '新鲜蘑菇')
      ]},
      { slug: 'citrus', icon: '🍊', hue: 30, name: N('Citrus', 'الحمضيات', '柑橘类'), items: [
        L('Orange', 'برتقال', '橙子'),
        L('Mandarin', 'يوسفي', '橘子'),
        L('Lemon, local', 'ليمون محلي', '本地柠檬'),
        L('Lemon, imported', 'ليمون مستورد', '进口柠檬'),
        L('Lemon, green (lime)', 'ليمون أخضر', '青柠')
      ]},
      { slug: 'apples-pears', icon: '🍎', hue: 0, name: N('Apples & Pears', 'التفاح والكمثرى', '苹果与梨'), items: [
        L('Apple, red', 'تفاح أحمر', '红苹果'),
        L('Apple, green', 'تفاح أخضر', '青苹果'),
        L('Pear', 'كمثرى', '梨')
      ]},
      { slug: 'grapes-berries', icon: '🍇', hue: 285, name: N('Grapes & Berries', 'العنب والتوت', '葡萄与浆果'), items: [
        L('Grapes, black seedless', 'عنب أسود بدون بذور', '无籽黑葡萄'),
        L('Grapes, green', 'عنب أخضر', '青葡萄'),
        L('Grapes, red', 'عنب أحمر', '红葡萄'),
        L('Strawberry', 'فراولة', '草莓'),
        L('Strawberry, African', 'فراولة أفريقية', '非洲草莓'),
        L('Blueberry', 'توت أزرق', '蓝莓'),
        L('Blackberry', 'توت أسود', '黑莓'),
        L('Raspberry', 'توت العليق', '树莓'),
        L('Red currant', 'كشمش أحمر', '红醋栗')
      ]},
      { slug: 'melons', icon: '🍉', hue: 350, name: N('Melons', 'البطيخ والشمام', '西瓜与甜瓜'), items: [
        L('Watermelon', 'بطيخ', '西瓜'),
        L('Sweet melon', 'شمام', '甜瓜')
      ]},
      { slug: 'tropical-fruit', icon: '🍌', hue: 50, name: N('Tropical & Exotic Fruit', 'الفواكه الاستوائية والغريبة', '热带及特色水果'), items: [
        L('Banana, yellow', 'موز أصفر', '黄香蕉'),
        L('Banana, green', 'موز أخضر', '青香蕉'),
        L('Banana, Indian', 'موز هندي', '印度香蕉'),
        L('Mango', 'مانجو', '芒果'),
        L('Papaya, yellow', 'بابايا صفراء', '黄木瓜'),
        L('Papaya, green', 'بابايا خضراء', '青木瓜'),
        L('Pineapple', 'أناناس', '菠萝'),
        L('Guava', 'جوافة', '番石榴'),
        L('Avocado', 'أفوكادو', '牛油果'),
        L('Dragon fruit', 'فاكهة التنين', '火龙果'),
        L('Kiwi', 'كيوي', '猕猴桃')
      ]},
      { slug: 'stone-fruit-pomegranate', icon: '🍑', hue: 18, name: N('Stone Fruit & Pomegranate', 'فواكه النواة والرمان', '核果与石榴'), items: [
        L('Peach', 'خوخ', '桃子'),
        L('Plum', 'برقوق', '李子'),
        L('Pomegranate', 'رمان', '石榴'),
        L('Cherry', 'كرز', '樱桃')
      ]}
    ],

    // Six industries. Titles and descriptions are in i18n.js under ind.<id>.t / ind.<id>.d
    industries: [
      { id: 'supermarkets', icon: '🛒' },
      { id: 'restaurants',  icon: '🍽️' },
      { id: 'hotels',       icon: '🏨' },
      { id: 'juice',        icon: '🥤' },
      { id: 'grocers',      icon: '🏪' },
      { id: 'camps',        icon: '⛺' }
    ],

    // Four "why us" cards. Text is in i18n.js under why.<id>.t / why.<id>.d
    why: [
      { id: 'direct',   icon: '🌾' },
      { id: 'pricing',  icon: '📈' },
      { id: 'delivery', icon: '🚚' },
      { id: 'quality',  icon: '✅' }
    ],

    // Brands: one featured card, then a scrolling wall. Replace the text with real brand names,
    // or add a `logo: 'img/brands/name.svg'` file path to show a logo image instead.
    // Producers we buy from. The strip repeats these names continuously, so two names are enough.
    // To add a producer, add { name: 'Name' } here. For a logo image add logo: 'img/brands/name.png'.
    brands: {
      featured: { name: 'Dawa Agriculture' },
      second: { name: 'Sharbatly Fruit' },
      list: [
        { name: 'Sharbatly Fruit', logo: 'img/sharbatly.png' }, { name: 'Dawa Agriculture', logo: 'img/dawa.png' }
      ]
    },

    // Clients you are allowed to list. The strip repeats these names continuously.
    clients: [
      { name: 'FRESH DAY SUPERMARKETS' }, { name: 'Fresh Day Fruits and Vegetables', logo: 'img/freshday.png', tile: true }, { name: 'SUAIDI COMPANY' }
    ]
  };
});
