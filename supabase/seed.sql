-- ============================================================
-- Ember & Ivy - seed content (generated from src/data/seed.js)
-- Run AFTER supabase/schema.sql. Safe to re-run: each table is only
-- seeded when it is currently empty.
-- Images reference the repo's public/images/*.svg assets.
-- ============================================================

insert into public.categories (name, icon, description, sort)
select name, icon, description, sort from (values
  ($$Signature Coffee$$, $$☕$$, $$Freshly roasted in-house, slow-brewed, poured with intention. Our coffee bar is the soul of the day at Ember & Ivy.$$, 0),
  ($$Breakfast & Brunch$$, $$🍳$$, $$Slow mornings, better mornings. Served from 7 AM, all day when the kitchen allows.$$, 1),
  ($$Starters & Small Plates$$, $$🥂$$, $$Small plates, big beginnings. Made to share while the evening unfolds.$$, 2),
  ($$Chef’s Specials$$, $$👨‍🍳$$, $$Chef-crafted plates built on local produce and global technique. The heart of our kitchen.$$, 3),
  ($$Pasta & Risotto$$, $$🍝$$, $$Hand-rolled where it matters, always al dente, always comforting.$$, 4),
  ($$Burgers & Sandwiches$$, $$🍔$$, $$Serious flavour between soft brioche. Hand-pressed, never frozen.$$, 5),
  ($$Mocktails$$, $$🍹$$, $$Zero-proof, full-flavour. House-pressed juices and fresh herbs.$$, 6),
  ($$Cocktails$$, $$🍸$$, $$Mixed slow, poured cold, served with a view. Ask the bar for a smoked finish.$$, 7),
  ($$Wine & Beer$$, $$🍷$$, $$A tight, considered list — a few great bottles rather than many average ones.$$, 8),
  ($$Desserts$$, $$🍰$$, $$A sweet end to a long evening. Some things are worth staying up for.$$, 9)
) as v(name, icon, description, sort)
where not exists (select 1 from public.categories);

insert into public.menu_items (name, description, price, category, image, veg, popular, chef, seasonal, rating, created_at)
select name, description, price, category, image, veg, popular, chef, seasonal, rating, created_at from (values
  ($$Ember Espresso$$, $$A double shot of our house single-origin, pulled thick and rich with a golden crema.$$, 380, $$Signature Coffee$$, $$/images/coffee-1.svg$$, true, true, false, false, 4, now() - (50) * interval '1 second'),
  ($$Ivy Flat White$$, $$Velvety micro-foam over a ristretto base. The quiet favourite of regulars.$$, 420, $$Signature Coffee$$, $$/images/coffee-2.svg$$, true, false, false, false, 4, now() - (49) * interval '1 second'),
  ($$Himalayan Latte$$, $$Silky steamed milk, house espresso and a whisper of local cardamom honey.$$, 460, $$Signature Coffee$$, $$/images/coffee-3.svg$$, true, true, false, true, 5, now() - (48) * interval '1 second'),
  ($$Café Mocha$$, $$Dark chocolate folded into espresso and milk, finished with cocoa dust.$$, 520, $$Signature Coffee$$, $$/images/coffee-4.svg$$, true, false, false, false, 5, now() - (47) * interval '1 second'),
  ($$Pour Over$$, $$Single-origin, brewed slow to the cup — floral, clean and bright.$$, 620, $$Signature Coffee$$, $$/images/coffee-1.svg$$, true, false, false, false, 4, now() - (46) * interval '1 second'),
  ($$Cold Brew$$, $$Steeped 18 hours for a smooth, low-acid, intensely smooth pour over ice.$$, 550, $$Signature Coffee$$, $$/images/coffee-2.svg$$, true, false, false, false, 5, now() - (45) * interval '1 second'),
  ($$Turmeric Golden Latte$$, $$Warm turmeric, ginger, coconut and honey. Comfort in a cup.$$, 480, $$Signature Coffee$$, $$/images/coffee-3.svg$$, true, false, false, false, 5, now() - (44) * interval '1 second'),
  ($$Hot Chocolate$$, $$Rich, dark and decadent — ten out of ten, say our regulars.$$, 390, $$Signature Coffee$$, $$/images/coffee-4.svg$$, true, false, false, false, 4, now() - (43) * interval '1 second'),
  ($$Garden Avocado Toast$$, $$Sourdough, smashed avocado, poached egg, chilli flakes and lemon.$$, 720, $$Breakfast & Brunch$$, $$/images/food-1.svg$$, false, false, false, false, 5, now() - (42) * interval '1 second'),
  ($$Ember English Breakfast$$, $$Two eggs any way, toast, hash brown, beans and grilled tomato.$$, 780, $$Breakfast & Brunch$$, $$/images/food-5.svg$$, false, false, false, false, 4, now() - (41) * interval '1 second'),
  ($$Pokhara Pancakes$$, $$Fluffy buttermilk stack with honeycomb butter and Pokhara maple.$$, 650, $$Breakfast & Brunch$$, $$/images/dessert-1.svg$$, false, true, false, false, 5, now() - (40) * interval '1 second'),
  ($$Eggs Benedict$$, $$Poached eggs, hollandaise, smoked ham on toasted English muffin.$$, 850, $$Breakfast & Brunch$$, $$/images/food-4.svg$$, false, false, false, false, 4, now() - (39) * interval '1 second'),
  ($$Continental Platter$$, $$Pastry, fruit, yogurt, honey and an artisan coffee of your choice.$$, 950, $$Breakfast & Brunch$$, $$/images/food-3.svg$$, false, false, false, false, 5, now() - (38) * interval '1 second'),
  ($$Chicken Wings, Ember Glaze$$, $$Slow-roasted, tossed in our ember chilli-honey glaze.$$, 620, $$Starters & Small Plates$$, $$/images/food-6.svg$$, true, false, false, false, 4, now() - (37) * interval '1 second'),
  ($$Crispy Calamari$$, $$Golden fried squid with lemon aioli and smoked paprika.$$, 780, $$Starters & Small Plates$$, $$/images/food-7.svg$$, true, false, false, false, 5, now() - (36) * interval '1 second'),
  ($$Arancini Di Riso$$, $$Crisp risotto balls, saffron, mozzarella, arrabbiata dip.$$, 720, $$Starters & Small Plates$$, $$/images/food-2.svg$$, true, false, false, false, 4, now() - (35) * interval '1 second'),
  ($$Hummus & Warm Pita$$, $$Silky house hummus, olive oil, za'atar and warm flatbread.$$, 550, $$Starters & Small Plates$$, $$/images/food-3.svg$$, true, false, false, false, 5, now() - (34) * interval '1 second'),
  ($$Loaded Nachos$$, $$Corn chips, house salsa, cheese sauce, jalapeños and guacamole.$$, 680, $$Starters & Small Plates$$, $$/images/food-5.svg$$, true, false, false, false, 5, now() - (33) * interval '1 second'),
  ($$Ember Signature Steak$$, $$Grass-fed New York strip, rosemary butter, roasted garlic, jus.$$, 1650, $$Chef’s Specials$$, $$/images/food-1.svg$$, false, true, true, false, 5, now() - (32) * interval '1 second'),
  ($$Nepali Fusion Chicken$$, $$Pan-seared chicken with a momo-spiced butter sauce and jhol glaze.$$, 1250, $$Chef’s Specials$$, $$/images/food-4.svg$$, false, true, true, false, 4, now() - (31) * interval '1 second'),
  ($$Himalayan Truffle Risotto$$, $$Arborio rice, wild mushrooms, aged parmesan, white truffle oil.$$, 1150, $$Chef’s Specials$$, $$/images/food-2.svg$$, false, false, true, false, 5, now() - (30) * interval '1 second'),
  ($$Lakeside Fish of the Day$$, $$Catch of the day, lemon butter, caper salsa, charred greens.$$, 1550, $$Chef’s Specials$$, $$/images/food-7.svg$$, false, false, true, false, 5, now() - (29) * interval '1 second'),
  ($$Butter Chicken & Naan$$, $$Slow-simmered curry, cream, fenugreek, blistered garlic naan.$$, 980, $$Chef’s Specials$$, $$/images/food-6.svg$$, false, false, true, false, 5, now() - (28) * interval '1 second'),
  ($$Grilled Lamb Chops$$, $$Herb-crusted, mint chimichurri, saffron potato purée.$$, 1850, $$Chef’s Specials$$, $$/images/food-5.svg$$, false, false, true, false, 4, now() - (27) * interval '1 second'),
  ($$Truffle Carbonara$$, $$Silky egg and pecorino, guanciale, cracked black pepper, truffle.$$, 850, $$Pasta & Risotto$$, $$/images/food-2.svg$$, true, true, false, false, 5, now() - (26) * interval '1 second'),
  ($$Pesto Penne$$, $$Fresh basil pesto, cherry tomato, pine nuts, parmesan.$$, 720, $$Pasta & Risotto$$, $$/images/food-3.svg$$, true, false, false, false, 5, now() - (25) * interval '1 second'),
  ($$Seafood Linguine$$, $$Prawns, mussels, garlic, white wine, chilli, parsley.$$, 980, $$Pasta & Risotto$$, $$/images/food-7.svg$$, true, false, false, false, 4, now() - (24) * interval '1 second'),
  ($$Spaghetti Bolognese$$, $$Slow-braised beef ragù, San Marzano tomatoes, parmesan.$$, 820, $$Pasta & Risotto$$, $$/images/food-4.svg$$, true, false, false, false, 5, now() - (23) * interval '1 second'),
  ($$Ember Smash Burger$$, $$Double smashed patty, special sauce, pickles, toasted brioche.$$, 690, $$Burgers & Sandwiches$$, $$/images/food-5.svg$$, true, true, false, false, 5, now() - (22) * interval '1 second'),
  ($$Chicken Crisp Burger$$, $$Buttermilk fried chicken, slaw, sriracha mayo.$$, 650, $$Burgers & Sandwiches$$, $$/images/food-6.svg$$, true, false, false, false, 5, now() - (21) * interval '1 second'),
  ($$Veggie Garden Burger$$, $$House falafel patty, hummus, rocket, grilled peppers.$$, 560, $$Burgers & Sandwiches$$, $$/images/food-3.svg$$, true, false, false, false, 4, now() - (20) * interval '1 second'),
  ($$Club Sandwich$$, $$Triple-decker chicken, bacon, egg, lettuce and fries.$$, 620, $$Burgers & Sandwiches$$, $$/images/food-1.svg$$, true, false, false, false, 4, now() - (19) * interval '1 second'),
  ($$Pokhara Sunset$$, $$Mango, passionfruit, orange and a sparkling top.$$, 420, $$Mocktails$$, $$/images/cocktail-5.svg$$, true, false, false, true, 4, now() - (18) * interval '1 second'),
  ($$Ember Fizz$$, $$Ginger, lime, rosemary and bitters — dry and bright.$$, 450, $$Mocktails$$, $$/images/cocktail-4.svg$$, true, false, false, false, 5, now() - (17) * interval '1 second'),
  ($$Ivy Blossom$$, $$Lychee, rose, lemon and soda over crushed ice.$$, 440, $$Mocktails$$, $$/images/cocktail-3.svg$$, true, false, false, false, 4, now() - (16) * interval '1 second'),
  ($$Lakeside Cooler$$, $$Blueberry, mint, apple and a citrus twist.$$, 430, $$Mocktails$$, $$/images/cocktail-5.svg$$, true, false, false, true, 4, now() - (15) * interval '1 second'),
  ($$Ember Old Fashioned$$, $$Bourbon, burnt orange, bitters, smoked demerara.$$, 850, $$Cocktails$$, $$/images/cocktail-1.svg$$, false, true, false, false, 5, now() - (14) * interval '1 second'),
  ($$Ivy Negroni$$, $$Gin, Campari, sweet vermouth — a rooftop classic.$$, 780, $$Cocktails$$, $$/images/cocktail-2.svg$$, false, false, false, false, 5, now() - (13) * interval '1 second'),
  ($$Himalayan Mule$$, $$Vodka, ginger beer, lime, mint, Himalayan salt rim.$$, 720, $$Cocktails$$, $$/images/cocktail-3.svg$$, false, false, true, false, 5, now() - (12) * interval '1 second'),
  ($$Passionfruit Daiquiri$$, $$White rum, fresh passionfruit, lime, cane sugar.$$, 750, $$Cocktails$$, $$/images/cocktail-4.svg$$, false, false, false, false, 4, now() - (11) * interval '1 second'),
  ($$Smoked Whiskey Sour$$, $$Whiskey, lemon, maple, egg white, applewood smoke.$$, 880, $$Cocktails$$, $$/images/cocktail-5.svg$$, false, false, false, false, 4, now() - (10) * interval '1 second'),
  ($$Sauvignon Blanc$$, $$Crisp and citrusy — Marlborough, New Zealand.$$, 2200, $$Wine & Beer$$, $$/images/cocktail-2.svg$$, true, false, false, false, 4, now() - (9) * interval '1 second'),
  ($$Pinot Noir$$, $$Soft red berries and silk — Central Otago.$$, 2800, $$Wine & Beer$$, $$/images/cocktail-1.svg$$, true, false, false, false, 5, now() - (8) * interval '1 second'),
  ($$Argentine Malbec$$, $$Dark fruit, plum, velvet finish.$$, 2400, $$Wine & Beer$$, $$/images/cocktail-4.svg$$, true, false, false, false, 4, now() - (7) * interval '1 second'),
  ($$Craft Beer — Local$$, $$Chilled Nepal-made craft lager and pale ale.$$, 350, $$Wine & Beer$$, $$/images/cocktail-3.svg$$, true, false, false, false, 5, now() - (6) * interval '1 second'),
  ($$Basque Cheesecake$$, $$Burnt, creamy, molten in the middle. Our most ordered dessert.$$, 480, $$Desserts$$, $$/images/dessert-1.svg$$, true, true, false, false, 4, now() - (5) * interval '1 second'),
  ($$Molten Lava Cake$$, $$Warm dark chocolate cake with a flowing gold centre.$$, 520, $$Desserts$$, $$/images/dessert-2.svg$$, true, false, false, false, 5, now() - (4) * interval '1 second'),
  ($$Tiramisu Classico$$, $$Espresso-soaked ladyfingers, mascarpone, cocoa.$$, 560, $$Desserts$$, $$/images/dessert-3.svg$$, true, false, false, false, 5, now() - (3) * interval '1 second'),
  ($$New York Cheesecake$$, $$Dense, lemony, with an Ember berry compote.$$, 550, $$Desserts$$, $$/images/dessert-1.svg$$, true, false, false, false, 5, now() - (2) * interval '1 second'),
  ($$Ivy Affogato$$, $$Vanilla gelato drowned in hot single-origin espresso.$$, 450, $$Desserts$$, $$/images/dessert-2.svg$$, true, false, false, false, 4, now() - (1) * interval '1 second')
) as v(name, description, price, category, image, veg, popular, chef, seasonal, rating, created_at)
where not exists (select 1 from public.menu_items);

insert into public.reviews (name, rating, review_date, text, tag, created_at)
select name, rating, review_date, text, tag, created_at from (values
  ($$Aarav Sharma$$, 5, $$A month ago$$, $$Best place for coffee, food and drinks in Lakeside — and it’s only just opened. The space is peaceful, stylish and far more premium than a regular café. Perfect to work, meet friends or simply relax during the day.$$, $$Premium Atmosphere$$, now() - (19) * interval '1 minute'),
  ($$Sneha Gurung$$, 5, $$A month ago$$, $$I came for coffee and stayed for hours. The coffee was proper, the service genuinely welcoming, and the whole place feels like a retreat. Looking forward to the rooftop bar at night.$$, $$Excellent Coffee$$, now() - (18) * interval '1 minute'),
  ($$Binod Adhikari$$, 5, $$A month ago$$, $$We walked in on the first day of their soft opening. The live band created an amazing atmosphere, the food was absolutely delicious and the ambiance was fantastic. Wishing the whole team a huge success — we’ll be back soon.$$, $$Live Music$$, now() - (17) * interval '1 minute'),
  ($$Pooja Karki$$, 5, $$A month ago$$, $$Excellent hospitality, quick service and delicious food. Highly recommended!$$, $$Wonderful Hospitality$$, now() - (16) * interval '1 minute'),
  ($$Sujan Tamang$$, 5, $$A month ago$$, $$Love the ambience — warm lighting, comfortable seating and just the right amount of calm.$$, $$Beautiful Interior$$, now() - (15) * interval '1 minute'),
  ($$Emily Thapa$$, 5, $$2 days ago$$, $$Cozy, stylish and perfect for relaxing with friends or family. The food was fresh, delicious and beautifully presented, and the drinks were equally impressive. The staff were friendly and attentive all evening.$$, $$Perfect for Dates$$, now() - (14) * interval '1 minute'),
  ($$Rahul Shrestha$$, 5, $$3 days ago$$, $$Their coffee is one of the best I’ve had — rich, smooth and perfectly brewed. The atmosphere is amazing too, with a stylish bar and live DJ that makes the evening vibe. Great food, quality coffee, good music, beautiful space. Definitely worth visiting.$$, $$Excellent Coffee$$, now() - (13) * interval '1 minute'),
  ($$Hannah Wright$$, 5, $$2 weeks ago$$, $$We ended up coming back three times because the food was that good. Ten out of ten hot chocolate. The staff made us feel welcome every single time, the place was spotless, the music was great, and the events they put on look brilliant.$$, $$Delicious Food$$, now() - (12) * interval '1 minute'),
  ($$Manoj Bhandari$$, 5, $$4 weeks ago$$, $$Good ambience, good food and chilled drinks. Indoor dining, the bar area, the outdoor patio — every seat is a good seat.$$, $$Great Place to Relax$$, now() - (11) * interval '1 minute'),
  ($$Ishana Rana$$, 5, $$A month ago$$, $$The perfect place for a date, a coffee meet-up or evening drinks. The ambience is warm and premium, the garden feels relaxing and the rooftop has a great night vibe. A place where you can sit for hours without feeling rushed.$$, $$Perfect for Dates$$, now() - (10) * interval '1 minute'),
  ($$David Campbell$$, 5, $$A month ago$$, $$One of the best new places in Lakeside. Beautiful ambience, great coffee, good food and a rooftop bar with a really nice vibe. “Coffee by Day, Cocktails by Night” actually works here. Highly recommended.$$, $$Premium Atmosphere$$, now() - (9) * interval '1 minute'),
  ($$Nabin K.C.$$, 3, $$4 days ago$$, $$A group dinner hit a few bumps on a busy night — one plate arrived cold and the order got mixed up. The staff apologised and fixed it, but it did take a while. Worth another visit on a quieter evening.$$, $$Honest Feedback$$, now() - (8) * interval '1 minute'),
  ($$Ritu Joshi$$, 4, $$A month ago$$, $$Really good food and a lovely atmosphere overall. Service was a touch slow when it got busy, but the staff made up for it — warm, friendly and quick to help once we had their attention.$$, $$Friendly Staff$$, now() - (7) * interval '1 minute'),
  ($$Kiran Bista$$, 5, $$A month ago$$, $$The food is amazing, staff is so friendly, nice service. Everything we ordered came fast and tasted even better.$$, $$Delicious Food$$, now() - (6) * interval '1 minute'),
  ($$Alisha Pradhan$$, 4, $$A month ago$$, $$Great food and a very comfortable setting. The room was quiet enough to talk easily — ideal for a long lunch. Would come back for the pasta alone.$$, $$Comfortable Seating$$, now() - (5) * interval '1 minute'),
  ($$Tom Whitfield$$, 5, $$2 weeks ago$$, $$The ideal solo-work spot. Fast WiFi, comfy seating and coffee that stays at the right temperature while you actually get things done. The laptop crowd found their corner here.$$, $$Great Place to Relax$$, now() - (4) * interval '1 minute'),
  ($$Sarita Lama$$, 5, $$3 weeks ago$$, $$Came for the rooftop, stayed for the view over the lake. The drinks were genuinely good and the staff let us take our time. Worth every flight of stairs.$$, $$Premium Atmosphere$$, now() - (3) * interval '1 minute'),
  ($$Deepak Mahato$$, 4, $$A month ago$$, $$Brought the family for brunch. Kids-friendly, quick service and the pancakes vanished in seconds. Prices are fair for the quality you get.$$, $$Friendly Staff$$, now() - (2) * interval '1 minute'),
  ($$Maya Thapa$$, 5, $$A month ago$$, $$Their soft opening ran like they’d been open for years. Seamless from the door to the dessert menu — you’d never guess they’d just launched. Professional from day one.$$, $$Fantastic Soft Opening$$, now() - (1) * interval '1 minute')
) as v(name, rating, review_date, text, tag, created_at)
where not exists (select 1 from public.reviews);

insert into public.events (title, date, time, tag, description, image, cover, featured, created_at)
select title, date, time, tag, description, image, cover, featured, created_at from (values
  ($$Acoustic Evening — Sagar & The Strings$$, $$2026-08-07$$::date, $$8:00 PM$$, $$Live Music$$, $$An intimate acoustic set under warm lights. Covers and originals, up close.$$, $$/images/live-1.svg$$, 0, true, now() - (4) * interval '1 hour'),
  ($$Neon Friday — DJ Aarav$$, $$2026-08-14$$::date, $$9:00 PM$$, $$DJ Night$$, $$House, afrobeat and late-night edits on the rooftop bar.$$, $$/images/live-2.svg$$, 0, false, now() - (3) * interval '1 hour'),
  ($$Jazz & Wine Sunday$$, $$2026-08-23$$::date, $$6:30 PM$$, $$Live Music$$, $$Smooth jazz trio, a curated wine flight and slow Sunday pacing.$$, $$/images/live-3.svg$$, 0, false, now() - (2) * interval '1 hour'),
  ($$Garden Bistro Market$$, $$2026-08-30$$::date, $$11:00 AM$$, $$Weekend Event$$, $$Produce stalls, live cooking stations and our coffee cart on the lawn.$$, $$/images/outdoor-1.svg$$, 0, false, now() - (1) * interval '1 hour')
) as v(title, date, time, tag, description, image, cover, featured, created_at)
where not exists (select 1 from public.events);

insert into public.gallery (src, cat, title, created_at)
select src, cat, title, created_at from (values
  ($$/images/coffee-1.svg$$, $$coffee$$, $$First pour of the morning$$, now() - (20) * interval '1 second'),
  ($$/images/coffee-2.svg$$, $$coffee$$, $$Flat white, still life$$, now() - (19) * interval '1 second'),
  ($$/images/coffee-4.svg$$, $$coffee$$, $$Cold brew service$$, now() - (18) * interval '1 second'),
  ($$/images/food-1.svg$$, $$food$$, $$Signature steak, plate one$$, now() - (17) * interval '1 second'),
  ($$/images/food-4.svg$$, $$food$$, $$Fusion chicken, jhol glaze$$, now() - (16) * interval '1 second'),
  ($$/images/food-6.svg$$, $$food$$, $$Small plates to share$$, now() - (15) * interval '1 second'),
  ($$/images/cocktail-1.svg$$, $$cocktails$$, $$The Ember Old Fashioned$$, now() - (14) * interval '1 second'),
  ($$/images/cocktail-4.svg$$, $$cocktails$$, $$Himalayan Mule, rooftop$$, now() - (13) * interval '1 second'),
  ($$/images/cocktail-5.svg$$, $$cocktails$$, $$Sunset at the bar$$, now() - (12) * interval '1 second'),
  ($$/images/interior-1.svg$$, $$interior$$, $$The lounge at golden hour$$, now() - (11) * interval '1 second'),
  ($$/images/interior-3.svg$$, $$interior$$, $$Booths and warm brass$$, now() - (10) * interval '1 second'),
  ($$/images/interior-4.svg$$, $$night$$, $$Night ambience$$, now() - (9) * interval '1 second'),
  ($$/images/live-1.svg$$, $$live$$, $$Acoustic Thursday$$, now() - (8) * interval '1 second'),
  ($$/images/live-2.svg$$, $$live$$, $$DJ set on the roof$$, now() - (7) * interval '1 second'),
  ($$/images/outdoor-1.svg$$, $$outdoor$$, $$The garden under string lights$$, now() - (6) * interval '1 second'),
  ($$/images/outdoor-2.svg$$, $$events$$, $$Garden event setup$$, now() - (5) * interval '1 second'),
  ($$/images/dessert-1.svg$$, $$desserts$$, $$Basque cheesecake$$, now() - (4) * interval '1 second'),
  ($$/images/dessert-2.svg$$, $$desserts$$, $$Molten, mid-flow$$, now() - (3) * interval '1 second'),
  ($$/images/interior-2.svg$$, $$interior$$, $$Reading corner, daylight$$, now() - (2) * interval '1 second'),
  ($$/images/cocktail-2.svg$$, $$cocktails$$, $$Negroni, close up$$, now() - (1) * interval '1 second')
) as v(src, cat, title, created_at)
where not exists (select 1 from public.gallery);

insert into public.hero_slides (image, label, sort)
select image, label, sort from (values
  ($$/images/hero-1.svg$$, $$The Lounge$$, 1),
  ($$/images/hero-2.svg$$, $$Live Music Nights$$, 2),
  ($$/images/hero-3.svg$$, $$The Bar$$, 3),
  ($$/images/hero-4.svg$$, $$Signature Coffee$$, 4)
) as v(image, label, sort)
where not exists (select 1 from public.hero_slides);

insert into public.team (name, role, image, bio, created_at)
select name, role, image, bio, created_at from (values
  ($$Head Chef Priya K.C.$$, $$Executive Chef$$, $$/images/team-1.svg$$, $$Twelve years across Kathmandu kitchens and Pokhara guesthouses. She builds the menu around what Lakeside grows.$$, now() - (4) * interval '1 minute'),
  ($$Aakash Maharjan$$, $$Head Barista$$, $$/images/team-2.svg$$, $$Competition brewer and self-confessed pour-over nerd. He sources and roasts our single origins.$$, now() - (3) * interval '1 minute'),
  ($$Sabina Rai$$, $$Beverage Director$$, $$/images/team-3.svg$$, $$The mind behind the rooftop bar — smoke, citrus and a very serious old fashioned.$$, now() - (2) * interval '1 minute'),
  ($$Rojan Shrestha$$, $$Front of House Lead$$, $$/images/team-4.svg$$, $$He sets the tone at the door. Warm, precise and always one step ahead of your table.$$, now() - (1) * interval '1 minute')
) as v(name, role, image, bio, created_at)
where not exists (select 1 from public.team);

insert into public.instagram (src, link, sort)
select src, link, sort from (values
  ($$/images/coffee-3.svg$$, NULL, 1),
  ($$/images/food-2.svg$$, NULL, 2),
  ($$/images/cocktail-3.svg$$, NULL, 3),
  ($$/images/interior-2.svg$$, NULL, 4),
  ($$/images/dessert-3.svg$$, NULL, 5),
  ($$/images/live-3.svg$$, NULL, 6)
) as v(src, link, sort)
where not exists (select 1 from public.instagram);

