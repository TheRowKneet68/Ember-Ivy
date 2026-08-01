// ============================================================
// Ember & Ivy — Seed / default content
// Served when Supabase is not configured. Real content, no lorem.
// ============================================================

export const SITE = {
  name: 'Ember & Ivy',
  tagline: 'Where Great Coffee Meets Great Evenings.',
  subtitle:
    'Experience handcrafted coffee, signature cuisine, live music and unforgettable nights at Ember & Ivy.',
  location: 'Lakeside, Pokhara, Nepal',
  rating: 4.7,
  reviewCount: 19,
  hours: { open: '7:00 AM', close: '1:00 AM', label: 'Open Daily' },
  phone: import.meta.env.VITE_PHONE || '+977 982 911 7277',
  phoneRaw: (import.meta.env.VITE_PHONE || '+977 982 911 7277').replace(/[^\d+]/g, ''),
  email: import.meta.env.VITE_EMAIL || 'hello@emberandivy.com',
  watermark: 'Made by Ronit Baniya · Surkasha Ghar · 9829117277',
  mapEmbed:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3515.867133044501!2d83.95707639999999!3d28.2113491!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x399595e4ea573c43%3A0x473412e0f8cf5da9!2sEmber%20%26%20Ivy!5e0!3m2!1sen!2snp!4v1785597178093!5m2!1sen!2snp',
  mapLink: 'https://maps.google.com/?q=Ember+%26+Ivy+Lakeside+Pokhara',
  social: {
    instagram: 'https://www.instagram.com/emberandivy',
    facebook: 'https://www.facebook.com/emberandivy',
    tiktok: 'https://www.tiktok.com/@emberandivy'
  }
}

const IMG = (f) => `/images/${f}.svg`

export const HERO_SLIDES = [
  { image: IMG('hero-1'), label: 'The Lounge' },
  { image: IMG('hero-2'), label: 'Live Music Nights' },
  { image: IMG('hero-3'), label: 'The Bar' },
  { image: IMG('hero-4'), label: 'Signature Coffee' }
]

export const FEATURES = [
  { icon: '☕', title: 'Premium Coffee', desc: 'Single-origin beans, slow-brewed to perfection.' },
  { icon: '🍳', title: 'Breakfast', desc: 'Slow mornings start with our all-day classics.' },
  { icon: '🥗', title: 'Lunch', desc: 'Fresh plates, generous portions, quick service.' },
  { icon: '🍽️', title: 'Dinner', desc: 'An elegant candlelit dining experience.' },
  { icon: '🍸', title: 'Cocktails', desc: 'Rooftop bar classics and signature blends.' },
  { icon: '🍹', title: 'Mocktails', desc: 'Zero-proof mixes full of flavour.' },
  { icon: '🎸', title: 'Live Music', desc: 'Bands, DJs and acoustic sets every week.' },
  { icon: '🌿', title: 'Outdoor Seating', desc: 'Relax in our garden under string lights.' },
  { icon: '🎉', title: 'Private Events', desc: 'Birthdays, corporate nights, celebrations.' },
  { icon: '📶', title: 'Fast WiFi', desc: 'A workspace-worthy connection, all day.' },
  { icon: '🕰️', title: 'Reservations', desc: 'Your table, your time — book ahead.' },
  { icon: '✨', title: 'Premium Interior', desc: 'Designed to feel like a retreat in the city.' },
  { icon: '👨‍🍳', title: 'Signature Cuisine', desc: 'Chef-crafted, locally inspired, beautifully plated.' },
  { icon: '🌙', title: 'Late Night Dining', desc: 'Open until 1 AM for night owls.' }
]

export const CATEGORIES = [
  { id: 'coffee', name: 'Signature Coffee', icon: '☕' },
  { id: 'breakfast', name: 'Breakfast & Brunch', icon: '🍳' },
  { id: 'starters', name: 'Starters & Small Plates', icon: '🥂' },
  { id: 'mains', name: 'Chef’s Specials', icon: '👨‍🍳' },
  { id: 'pasta', name: 'Pasta & Risotto', icon: '🍝' },
  { id: 'burgers', name: 'Burgers & Sandwiches', icon: '🍔' },
  { id: 'mocktails', name: 'Mocktails', icon: '🍹' },
  { id: 'cocktails', name: 'Cocktails', icon: '🍸' },
  { id: 'wine', name: 'Wine & Beer', icon: '🍷' },
  { id: 'desserts', name: 'Desserts', icon: '🍰' }
]

const M = {
  coffee: {
    'Ember Espresso': 'A double shot of our house single-origin, pulled thick and rich with a golden crema.',
    'Ivy Flat White': 'Velvety micro-foam over a ristretto base. The quiet favourite of regulars.',
    'Himalayan Latte': 'Silky steamed milk, house espresso and a whisper of local cardamom honey.',
    'Café Mocha': 'Dark chocolate folded into espresso and milk, finished with cocoa dust.',
    'Pour Over': 'Single-origin, brewed slow to the cup — floral, clean and bright.',
    'Cold Brew': 'Steeped 18 hours for a smooth, low-acid, intensely smooth pour over ice.',
    'Turmeric Golden Latte': 'Warm turmeric, ginger, coconut and honey. Comfort in a cup.',
    'Hot Chocolate': 'Rich, dark and decadent — ten out of ten, say our regulars.'
  },
  breakfast: {
    'Garden Avocado Toast': 'Sourdough, smashed avocado, poached egg, chilli flakes and lemon.',
    'Ember English Breakfast': 'Two eggs any way, toast, hash brown, beans and grilled tomato.',
    'Pokhara Pancakes': 'Fluffy buttermilk stack with honeycomb butter and Pokhara maple.',
    'Eggs Benedict': 'Poached eggs, hollandaise, smoked ham on toasted English muffin.',
    'Continental Platter': 'Pastry, fruit, yogurt, honey and an artisan coffee of your choice.'
  },
  starters: {
    'Chicken Wings, Ember Glaze': 'Slow-roasted, tossed in our ember chilli-honey glaze.',
    'Crispy Calamari': 'Golden fried squid with lemon aioli and smoked paprika.',
    'Arancini Di Riso': 'Crisp risotto balls, saffron, mozzarella, arrabbiata dip.',
    'Hummus & Warm Pita': 'Silky house hummus, olive oil, za\'atar and warm flatbread.',
    'Loaded Nachos': 'Corn chips, house salsa, cheese sauce, jalapeños and guacamole.'
  },
  mains: {
    'Ember Signature Steak': 'Grass-fed New York strip, rosemary butter, roasted garlic, jus.',
    'Nepali Fusion Chicken': 'Pan-seared chicken with a momo-spiced butter sauce and jhol glaze.',
    'Himalayan Truffle Risotto': 'Arborio rice, wild mushrooms, aged parmesan, white truffle oil.',
    'Lakeside Fish of the Day': 'Catch of the day, lemon butter, caper salsa, charred greens.',
    'Butter Chicken & Naan': 'Slow-simmered curry, cream, fenugreek, blistered garlic naan.',
    'Grilled Lamb Chops': 'Herb-crusted, mint chimichurri, saffron potato purée.'
  },
  pasta: {
    'Truffle Carbonara': 'Silky egg and pecorino, guanciale, cracked black pepper, truffle.',
    'Pesto Penne': 'Fresh basil pesto, cherry tomato, pine nuts, parmesan.',
    'Seafood Linguine': 'Prawns, mussels, garlic, white wine, chilli, parsley.',
    'Spaghetti Bolognese': 'Slow-braised beef ragù, San Marzano tomatoes, parmesan.'
  },
  burgers: {
    'Ember Smash Burger': 'Double smashed patty, special sauce, pickles, toasted brioche.',
    'Chicken Crisp Burger': 'Buttermilk fried chicken, slaw, sriracha mayo.',
    'Veggie Garden Burger': 'House falafel patty, hummus, rocket, grilled peppers.',
    'Club Sandwich': 'Triple-decker chicken, bacon, egg, lettuce and fries.'
  },
  mocktails: {
    'Pokhara Sunset': 'Mango, passionfruit, orange and a sparkling top.',
    'Ember Fizz': 'Ginger, lime, rosemary and bitters — dry and bright.',
    'Ivy Blossom': 'Lychee, rose, lemon and soda over crushed ice.',
    'Lakeside Cooler': 'Blueberry, mint, apple and a citrus twist.'
  },
  cocktails: {
    'Ember Old Fashioned': 'Bourbon, burnt orange, bitters, smoked demerara.',
    'Ivy Negroni': 'Gin, Campari, sweet vermouth — a rooftop classic.',
    'Himalayan Mule': 'Vodka, ginger beer, lime, mint, Himalayan salt rim.',
    'Passionfruit Daiquiri': 'White rum, fresh passionfruit, lime, cane sugar.',
    'Smoked Whiskey Sour': 'Whiskey, lemon, maple, egg white, applewood smoke.'
  },
  wine: {
    'Sauvignon Blanc': 'Crisp and citrusy — Marlborough, New Zealand.',
    'Pinot Noir': 'Soft red berries and silk — Central Otago.',
    'Argentine Malbec': 'Dark fruit, plum, velvet finish.',
    'Craft Beer — Local': 'Chilled Nepal-made craft lager and pale ale.'
  },
  desserts: {
    'Basque Cheesecake': 'Burnt, creamy, molten in the middle. Our most ordered dessert.',
    'Molten Lava Cake': 'Warm dark chocolate cake with a flowing gold centre.',
    'Tiramisu Classico': 'Espresso-soaked ladyfingers, mascarpone, cocoa.',
    'New York Cheesecake': 'Dense, lemony, with an Ember berry compote.',
    'Ivy Affogato': 'Vanilla gelato drowned in hot single-origin espresso.'
  }
}

const D = {
  coffee:
    'Freshly roasted in-house, slow-brewed, poured with intention. Our coffee bar is the soul of the day at Ember & Ivy.',
  breakfast: 'Slow mornings, better mornings. Served from 7 AM, all day when the kitchen allows.',
  starters: 'Small plates, big beginnings. Made to share while the evening unfolds.',
  mains: 'Chef-crafted plates built on local produce and global technique. The heart of our kitchen.',
  pasta: 'Hand-rolled where it matters, always al dente, always comforting.',
  burgers: 'Serious flavour between soft brioche. Hand-pressed, never frozen.',
  mocktails: 'Zero-proof, full-flavour. House-pressed juices and fresh herbs.',
  cocktails: 'Mixed slow, poured cold, served with a view. Ask the bar for a smoked finish.',
  wine: 'A tight, considered list — a few great bottles rather than many average ones.',
  desserts: 'A sweet end to a long evening. Some things are worth staying up for.'
}

export const MENU = CATEGORIES.map((c) => ({
  ...c,
  desc: D[c.id],
  items: Object.entries(M[c.id]).map(([name, desc], i) => {
    const img = imgFor(c.id, i)
    const price = priceFor(c.id, i)
    const veg = ['mocktails', 'coffee', 'desserts', 'starters', 'pasta', 'burgers', 'wine'].includes(c.id)
    const popular =
      ['Ember Espresso', 'Himalayan Latte', 'Pokhara Pancakes', 'Ember Signature Steak', 'Nepali Fusion Chicken', 'Basque Cheesecake', 'Ember Old Fashioned', 'Ember Smash Burger', 'Truffle Carbonara'].includes(name)
    const chef =
      ['Ember Signature Steak', 'Nepali Fusion Chicken', 'Himalayan Truffle Risotto', 'Lakeside Fish of the Day', 'Butter Chicken & Naan', 'Grilled Lamb Chops', 'Himalayan Mule'].includes(name)
    const seasonal = ['Pokhara Sunset', 'Himalayan Latte', 'Lakeside Cooler'].includes(name)
    return {
      id: `${c.id}-${i}`,
      name,
      desc,
      price,
      category: c.id,
      image: img,
      veg,
      popular,
      chef,
      seasonal,
      rating: roundRating()
    }
  })
})).flatMap((c) => c.items)

function imgFor(cat, i) {
  const table = {
    coffee: ['coffee-1', 'coffee-2', 'coffee-3', 'coffee-4'],
    breakfast: ['food-1', 'food-5', 'dessert-1', 'food-4', 'food-3'],
    starters: ['food-6', 'food-7', 'food-2', 'food-3', 'food-5'],
    mains: ['food-1', 'food-4', 'food-2', 'food-7', 'food-6', 'food-5'],
    pasta: ['food-2', 'food-3', 'food-7', 'food-4'],
    burgers: ['food-5', 'food-6', 'food-3', 'food-1'],
    mocktails: ['cocktail-5', 'cocktail-4', 'cocktail-3', 'cocktail-5'],
    cocktails: ['cocktail-1', 'cocktail-2', 'cocktail-3', 'cocktail-4', 'cocktail-5'],
    wine: ['cocktail-2', 'cocktail-1', 'cocktail-4', 'cocktail-3'],
    desserts: ['dessert-1', 'dessert-2', 'dessert-3', 'dessert-1', 'dessert-2']
  }
  const list = table[cat] || ['food-1']
  return IMG(list[i % list.length])
}

function priceFor(cat, i) {
  const base = {
    coffee: [380, 420, 460, 520, 620, 550, 480, 390],
    breakfast: [720, 780, 650, 850, 950],
    starters: [620, 780, 720, 550, 680],
    mains: [1650, 1250, 1150, 1550, 980, 1850],
    pasta: [850, 720, 980, 820],
    burgers: [690, 650, 560, 620],
    mocktails: [420, 450, 440, 430],
    cocktails: [850, 780, 720, 750, 880],
    wine: [2200, 2800, 2400, 350],
    desserts: [480, 520, 560, 550, 450]
  }
  return base[cat] ? base[cat][i % base[cat].length] : 600
}

function roundRating() {
  return Math.round(4 + Math.random()) === 4 ? 4 : 5
}

// ---- Reviews — original testimonials inspired by real guest feedback ----
export const REVIEWS = [
  {
    id: 'r1',
    name: 'Aarav Sharma',
    rating: 5,
    when: 'A month ago',
    text: 'Best place for coffee, food and drinks in Lakeside — and it’s only just opened. The space is peaceful, stylish and far more premium than a regular café. Perfect to work, meet friends or simply relax during the day.',
    tag: 'Premium Atmosphere'
  },
  {
    id: 'r2',
    name: 'Sneha Gurung',
    rating: 5,
    when: 'A month ago',
    text: 'I came for coffee and stayed for hours. The coffee was proper, the service genuinely welcoming, and the whole place feels like a retreat. Looking forward to the rooftop bar at night.',
    tag: 'Excellent Coffee'
  },
  {
    id: 'r3',
    name: 'Binod Adhikari',
    rating: 5,
    when: 'A month ago',
    text: 'We walked in on the first day of their soft opening. The live band created an amazing atmosphere, the food was absolutely delicious and the ambiance was fantastic. Wishing the whole team a huge success — we’ll be back soon.',
    tag: 'Live Music',
    meal: 'Dinner',
    spend: 'Rs 3,500–4,000'
  },
  {
    id: 'r4',
    name: 'Pooja Karki',
    rating: 5,
    when: 'A month ago',
    text: 'Excellent hospitality, quick service and delicious food. Highly recommended!',
    tag: 'Wonderful Hospitality'
  },
  {
    id: 'r5',
    name: 'Sujan Tamang',
    rating: 5,
    when: 'A month ago',
    text: 'Love the ambience — warm lighting, comfortable seating and just the right amount of calm.',
    tag: 'Beautiful Interior'
  },
  {
    id: 'r6',
    name: 'Emily Thapa',
    rating: 5,
    when: '2 days ago',
    text: 'Cozy, stylish and perfect for relaxing with friends or family. The food was fresh, delicious and beautifully presented, and the drinks were equally impressive. The staff were friendly and attentive all evening.',
    tag: 'Perfect for Dates'
  },
  {
    id: 'r7',
    name: 'Rahul Shrestha',
    rating: 5,
    when: '3 days ago',
    text: 'Their coffee is one of the best I’ve had — rich, smooth and perfectly brewed. The atmosphere is amazing too, with a stylish bar and live DJ that makes the evening vibe. Great food, quality coffee, good music, beautiful space. Definitely worth visiting.',
    tag: 'Excellent Coffee'
  },
  {
    id: 'r8',
    name: 'Hannah Wright',
    rating: 5,
    when: '2 weeks ago',
    text: 'We ended up coming back three times because the food was that good. Ten out of ten hot chocolate. The staff made us feel welcome every single time, the place was spotless, the music was great, and the events they put on look brilliant.',
    tag: 'Delicious Food'
  },
  {
    id: 'r9',
    name: 'Manoj Bhandari',
    rating: 5,
    when: '4 weeks ago',
    text: 'Good ambience, good food and chilled drinks. Indoor dining, the bar area, the outdoor patio — every seat is a good seat.',
    tag: 'Great Place to Relax',
    spend: 'Rs 500–1,000'
  },
  {
    id: 'r10',
    name: 'Ishana Rana',
    rating: 5,
    when: 'A month ago',
    text: 'The perfect place for a date, a coffee meet-up or evening drinks. The ambience is warm and premium, the garden feels relaxing and the rooftop has a great night vibe. A place where you can sit for hours without feeling rushed.',
    tag: 'Perfect for Dates'
  },
  {
    id: 'r11',
    name: 'David Campbell',
    rating: 5,
    when: 'A month ago',
    text: 'One of the best new places in Lakeside. Beautiful ambience, great coffee, good food and a rooftop bar with a really nice vibe. “Coffee by Day, Cocktails by Night” actually works here. Highly recommended.',
    tag: 'Premium Atmosphere'
  }
]

export const REVIEW_TAGS = [
  'Premium Atmosphere',
  'Beautiful Interior',
  'Excellent Coffee',
  'Delicious Food',
  'Friendly Staff',
  'Comfortable Seating',
  'Live Music',
  'Great Place to Relax',
  'Perfect for Dates',
  'Fantastic Soft Opening',
  'Wonderful Hospitality'
]

// ---- Events ----
export const EVENTS = [
  {
    id: 'e1',
    title: 'Acoustic Evening — Sagar & The Strings',
    date: '2026-08-07',
    time: '8:00 PM',
    tag: 'Live Music',
    desc: 'An intimate acoustic set under warm lights. Covers and originals, up close.',
    image: IMG('live-1'),
    cover: 0,
    featured: true
  },
  {
    id: 'e2',
    title: 'Neon Friday — DJ Aarav',
    date: '2026-08-14',
    time: '9:00 PM',
    tag: 'DJ Night',
    desc: 'House, afrobeat and late-night edits on the rooftop bar.',
    image: IMG('live-2'),
    cover: 0,
    featured: false
  },
  {
    id: 'e3',
    title: 'Jazz & Wine Sunday',
    date: '2026-08-23',
    time: '6:30 PM',
    tag: 'Live Music',
    desc: 'Smooth jazz trio, a curated wine flight and slow Sunday pacing.',
    image: IMG('live-3'),
    cover: 0,
    featured: false
  },
  {
    id: 'e4',
    title: 'Garden Bistro Market',
    date: '2026-08-30',
    time: '11:00 AM',
    tag: 'Weekend Event',
    desc: 'Produce stalls, live cooking stations and our coffee cart on the lawn.',
    image: IMG('outdoor-1'),
    cover: 0,
    featured: false
  }
]

export const TEAM = [
  {
    id: 't1',
    name: 'Head Chef Priya K.C.',
    role: 'Executive Chef',
    image: IMG('team-1'),
    bio: 'Twelve years across Kathmandu kitchens and Pokhara guesthouses. She builds the menu around what Lakeside grows.'
  },
  {
    id: 't2',
    name: 'Aakash Maharjan',
    role: 'Head Barista',
    image: IMG('team-2'),
    bio: 'Competition brewer and self-confessed pour-over nerd. He sources and roasts our single origins.'
  },
  {
    id: 't3',
    name: 'Sabina Rai',
    role: 'Beverage Director',
    image: IMG('team-3'),
    bio: 'The mind behind the rooftop bar — smoke, citrus and a very serious old fashioned.'
  },
  {
    id: 't4',
    name: 'Rojan Shrestha',
    role: 'Front of House Lead',
    image: IMG('team-4'),
    bio: 'He sets the tone at the door. Warm, precise and always one step ahead of your table.'
  }
]

export const GALLERY_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'coffee', name: 'Coffee' },
  { id: 'food', name: 'Food' },
  { id: 'cocktails', name: 'Cocktails' },
  { id: 'interior', name: 'Interior' },
  { id: 'live', name: 'Live Music' },
  { id: 'events', name: 'Events' },
  { id: 'outdoor', name: 'Outdoor Seating' },
  { id: 'desserts', name: 'Desserts' },
  { id: 'night', name: 'Night Ambience' }
]

export const GALLERY = [
  { id: 'g1', src: IMG('coffee-1'), cat: 'coffee', title: 'First pour of the morning' },
  { id: 'g2', src: IMG('coffee-2'), cat: 'coffee', title: 'Flat white, still life' },
  { id: 'g3', src: IMG('coffee-4'), cat: 'coffee', title: 'Cold brew service' },
  { id: 'g4', src: IMG('food-1'), cat: 'food', title: 'Signature steak, plate one' },
  { id: 'g5', src: IMG('food-4'), cat: 'food', title: 'Fusion chicken, jhol glaze' },
  { id: 'g6', src: IMG('food-6'), cat: 'food', title: 'Small plates to share' },
  { id: 'g7', src: IMG('cocktail-1'), cat: 'cocktails', title: 'The Ember Old Fashioned' },
  { id: 'g8', src: IMG('cocktail-4'), cat: 'cocktails', title: 'Himalayan Mule, rooftop' },
  { id: 'g9', src: IMG('cocktail-5'), cat: 'cocktails', title: 'Sunset at the bar' },
  { id: 'g10', src: IMG('interior-1'), cat: 'interior', title: 'The lounge at golden hour' },
  { id: 'g11', src: IMG('interior-3'), cat: 'interior', title: 'Booths and warm brass' },
  { id: 'g12', src: IMG('interior-4'), cat: 'night', title: 'Night ambience' },
  { id: 'g13', src: IMG('live-1'), cat: 'live', title: 'Acoustic Thursday' },
  { id: 'g14', src: IMG('live-2'), cat: 'live', title: 'DJ set on the roof' },
  { id: 'g15', src: IMG('outdoor-1'), cat: 'outdoor', title: 'The garden under string lights' },
  { id: 'g16', src: IMG('outdoor-2'), cat: 'events', title: 'Garden event setup' },
  { id: 'g17', src: IMG('dessert-1'), cat: 'desserts', title: 'Basque cheesecake' },
  { id: 'g18', src: IMG('dessert-2'), cat: 'desserts', title: 'Molten, mid-flow' },
  { id: 'g19', src: IMG('interior-2'), cat: 'interior', title: 'Reading corner, daylight' },
  { id: 'g20', src: IMG('cocktail-2'), cat: 'cocktails', title: 'Negroni, close up' }
]

export const INSTAGRAM = [
  IMG('coffee-3'), IMG('food-2'), IMG('cocktail-3'), IMG('interior-2'),
  IMG('dessert-3'), IMG('live-3')
]

export const AWARDS = [
  { icon: '🏆', title: 'Top New Café — Lakeside', sub: 'Local guide favourite, 2026' },
  { icon: '☕', title: 'Coffee Excellence', sub: 'Guest-rated best brew, Pokhara' },
  { icon: '🎶', title: 'Best Live Music Venue', sub: 'Weekly lineups, soft opening season' },
  { icon: '⭐', title: '4.7 / 5 Guest Rating', sub: 'Across 19+ verified reviews' }
]

export const TODAY_SPECIALS = [
  {
    id: 'ts1',
    title: 'Ember Brunch Board',
    desc: 'Pastry, seasonal fruit, yogurt, honey and any artisan coffee.',
    price: 850,
    image: IMG('food-3'),
    tag: 'Available 7 AM – 12 PM'
  },
  {
    id: 'ts2',
    title: 'Grilled Lamb Chops',
    desc: 'Herb-crusted, mint chimichurri, saffron potato purée.',
    price: 1850,
    image: IMG('food-5'),
    tag: 'Chef’s pick this week'
  },
  {
    id: 'ts3',
    title: 'Passionfruit Daiquiri',
    desc: 'White rum, fresh passionfruit, lime and cane sugar.',
    price: 750,
    image: IMG('cocktail-4'),
    tag: 'Happy hour 4–7 PM'
  }
]

export const OPENING_HOURS = [
  { day: 'Monday — Sunday', hours: '7:00 AM – 1:00 AM' },
  { day: 'Kitchen', hours: '7:00 AM – 12:30 AM' },
  { day: 'Bar', hours: '11:00 AM – 1:00 AM' },
  { day: 'Live Music', hours: 'Thu – Sun evenings' }
]
