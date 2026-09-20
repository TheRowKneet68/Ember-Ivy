import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '../components/Icons.jsx'
import Reveal from '../components/Reveal.jsx'
import SectionHead from '../components/SectionHead.jsx'
import Stars from '../components/Stars.jsx'
import MenuCard from '../components/MenuCard.jsx'
import Countdown from '../components/Countdown.jsx'
import Newsletter from '../components/Newsletter.jsx'
import { store, getSettings } from '../lib/store.js'
import {
  SITE, HERO_SLIDES, FEATURES, REVIEWS, REVIEW_TAGS, TEAM, INSTAGRAM,
  AWARDS, TODAY_SPECIALS
} from '../data/seed.js'

export default function Home() {
  const [menu, setMenu] = useState([])
  const [events, setEvents] = useState([])
  const [gallery, setGallery] = useState([])
  const [instagram, setInstagram] = useState(null)
  const [slides, setSlides] = useState(HERO_SLIDES)
  const [reviews, setReviews] = useState(REVIEWS)
  const [team, setTeam] = useState(TEAM)
  const [sections, setSections] = useState(null)
  const [slide, setSlide] = useState(0)

  useEffect(() => {
    const total = slides.length || 1
    const timer = setInterval(() => setSlide((s) => (s + 1) % total), 6000)
    return () => clearInterval(timer)
  }, [slides.length])

  useEffect(() => {
    store.list('menu').then(setMenu).catch(() => setMenu([]))
    store.list('events').then(setEvents).catch(() => setEvents([]))
    store.list('gallery').then(setGallery).catch(() => setGallery([]))
    store.list('reviews').then((rows) => rows.length && setReviews(rows)).catch(() => {})
    store.list('team').then((rows) => rows.length && setTeam(rows)).catch(() => {})
    store.list('hero_slides').then((rows) => {
      const srcs = rows.map((r) => r.image).filter(Boolean)
      if (srcs.length) setSlides(rows)
    }).catch(() => {})
    store.list('instagram').then((rows) => {
      const srcs = rows.map((r) => (typeof r === 'string' ? r : r.src)).filter(Boolean)
      if (srcs.length) setInstagram(srcs)
    }).catch(() => {})
    getSettings().then((s) => setSections(s.sections || null)).catch(() => setSections(null))
  }, [])

  const popular = menu.filter((m) => m.popular).slice(0, 8)
  const chefSpecials = menu.filter((m) => m.chef).slice(0, 4)
  const featuredEvent = events.find((event) => event.featured) || events[0] || null

  const show = (k) => (sections === null ? true : sections[k] !== false)

  return (
    <>
      <Hero slides={slides} slide={slide} setSlide={setSlide} />
      {show('about') && <Marquee />}
      {show('about') && <About />}
      {show('features') && <Features />}
      {show('coffee') && <SignatureCoffee menu={menu} />}
      {show('chef') && <ChefSpecials chefSpecials={chefSpecials} />}
      {show('popular') && <PopularDishes popular={popular} />}
      {show('today') && <TodaySpecials />}
      {show('music') && <UpcomingMusic events={events} featuredEvent={featuredEvent} />}
      {show('gallery') && <GalleryPreview gallery={gallery} />}
      {show('team') && <Team items={team} />}
      {show('instagram') && <Instagram items={instagram || INSTAGRAM} />}
      {show('reviews') && <Reviews items={reviews} />}
      {show('awards') && <Awards />}
      {show('newsletter') && <Newsletter />}
      {show('cta') && <CtaBanner />}
    </>
  )
}

/* ---------- Hero ---------- */
function Hero({ slides, slide, setSlide }) {
  return (
    <section className="hero">
      <div className="hero-slides">
        {slides.map((s, i) => (
          <div key={s.image} className={`hero-slide ${i === slide ? 'hero-slide--active' : ''}`}>
            <img src={s.image} alt={s.label} />
          </div>
        ))}
      </div>
      <div className="hero-overlay" />

      <div className="hero-content">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1 }}
        >
          <span className="hero-eyebrow">Lakeside · Pokhara · Open Daily 7 AM – 1 AM</span>
        </motion.div>
        <motion.h1
          className="hero-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.25 }}
        >
          Where Great Coffee <br className="hero-br" /> Meets <span className="gold">Great Evenings.</span>
        </motion.h1>
        <motion.p
          className="hero-sub"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
        >
          {SITE.subtitle}
        </motion.p>
        <motion.div
          className="hero-actions"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.55 }}
        >
          <Link to="/menu" className="btn btn--primary btn--lg">Explore Menu</Link>
          <Link to="/reservation" className="btn btn--ghost btn--lg">Reserve Table</Link>
        </motion.div>
        <motion.div
          className="hero-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        >
          <span>⭐ <b>4.7</b> · 19+ Reviews</span>
          <span>☕ <b>Café · Restaurant · Lounge</b></span>
          <span>🎶 <b>Live Music</b></span>
        </motion.div>
      </div>

      <div className="hero-dots">
        {slides.map((s, i) => (
          <button
            key={s.image}
            className={`hero-dot ${i === slide ? 'hero-dot--active' : ''}`}
            onClick={() => setSlide(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

function Marquee() {
  const words = ['Specialty Coffee', 'Signature Cuisine', 'Cocktail Lounge', 'Live Music', 'Rooftop Bar', 'Private Events']
  const row = [...words, ...words]
  return (
    <div className="marquee">
      <div className="marquee-track">
        {row.map((w, i) => (
          <span key={i}>{w}</span>
        ))}
      </div>
    </div>
  )
}

/* ---------- About ---------- */
function About() {
  const points = [
    'Premium coffee', 'Signature food', 'Elegant interior', 'Live music',
    'Relaxed atmosphere', 'Excellent hospitality'
  ]
  return (
    <section className="section">
      <div className="container split">
        <Reveal className="split-media">
          <img src="/images/interior-1.svg" alt="The Ember & Ivy lounge" />
          <span className="frame-border" />
          <span className="float-chip">“Coffee by Day, Cocktails by Night”</span>
        </Reveal>
        <div className="split-body">
          <Reveal>
            <span className="eyebrow">Our Story</span>
            <h3>A New Kind of <em>Evening</em> in Lakeside</h3>
            <p>
              Ember &amp; Ivy is a newly opened premium café and dining destination on the shore of
              Lake Phewa. By morning it’s a quiet corner for a proper pour-over; by dusk it becomes
              a candlelit dining room and cocktail bar — and by night, a live music stage.
            </p>
            <p>
              Everything is made in-house, sourced from the valley where it can be, and plated like
              it belongs in a hotel in the hills. No shortcuts, no compromise — just good food,
              honest coffee and an atmosphere that lets you stay for hours.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <ul className="split-list">
              {points.map((p) => <li key={p}>{p}</li>)}
            </ul>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <Link to="/reservation" className="btn btn--primary">Visit Us</Link>
              <Link to="/gallery" className="btn btn--dark">See the Space</Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Features ---------- */
function Features() {
  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHead
          eyebrow="What We Offer"
          title="Everything a <em>Great Day</em> Needs"
          sub="From your first espresso to your last cocktail of the night — all under one roof in Lakeside."
        />
        <div className="feature-grid">
          {FEATURES.map((f, i) => (
            <Reveal key={f.title} delay={(i % 7) * 0.06}>
              <div className="feature-card">
                <div className="f-icon">{f.icon}</div>
                <h4>{f.title}</h4>
                <p>{f.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Signature Coffee ---------- */
function SignatureCoffee({ menu }) {
  const coffees = menu.filter((m) => m.category === 'coffee').slice(0, 4)
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="The Coffee Bar"
          title="Signature <em>Coffee Collection</em>"
          sub="Single-origin beans, roasted in-house and poured with intention. This is the soul of our daytime."
        />
        {coffees.length ? (
          <div className="menu-grid">
            {coffees.map((c, i) => (
              <Reveal key={c.id} delay={i * 0.08}>
                <MenuCard item={c} />
              </Reveal>
            ))}
          </div>
        ) : (
          <div className="menu-grid">
            {['Ember Espresso', 'Ivy Flat White', 'Himalayan Latte', 'Cold Brew'].map((n, i) => (
              <Reveal key={n} delay={i * 0.08}>
                <MenuCard item={{ id: n, name: n, desc: 'A house classic from our coffee bar.', price: 420, image: `/images/coffee-${i + 1}.svg`, veg: true, rating: 5 }} />
              </Reveal>
            ))}
          </div>
        )}
        <Reveal className="center" delay={0.2}>
          <Link to="/menu" className="btn btn--dark mt-40">View Full Coffee Menu</Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Chef's Specials ---------- */
function ChefSpecials({ chefSpecials }) {
  const list = chefSpecials.length ? chefSpecials : [
    { id: 's1', name: 'Ember Signature Steak', tag: 'House Classic', desc: 'Grass-fed strip, rosemary butter, roasted garlic.', price: 1650, image: '/images/food-1.svg' },
    { id: 's2', name: 'Himalayan Truffle Risotto', tag: 'Veg Delight', desc: 'Wild mushrooms, aged parmesan, white truffle oil.', price: 1150, image: '/images/food-2.svg' },
    { id: 's3', name: 'Nepali Fusion Chicken', tag: 'Local Twist', desc: 'Momo-spiced butter sauce, jhol glaze.', price: 1250, image: '/images/food-4.svg' },
    { id: 's4', name: 'Lakeside Fish of the Day', tag: 'From the Lake', desc: 'Lemon butter, caper salsa, charred greens.', price: 1550, image: '/images/food-7.svg' }
  ]
  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHead
          eyebrow="From the Kitchen"
          title="Chef’s <em>Recommendations</em>"
          sub="Dishes that define us — built on local produce and global technique."
        />
        <div className="specials-grid">
          <div style={{ display: 'grid', gap: 16 }}>
            {list.map((d, i) => (
              <Reveal key={d.id || d.name} delay={i * 0.07}>
                <div className="special-card">
                  <img src={d.image} alt={d.name} loading="lazy" />
                  <div>
                    <span className="s-tag">{d.tag || 'Chef’s Special'}</span>
                    <h5>{d.name}</h5>
                    <p>{d.desc}</p>
                    <span className="m-price"><small>Rs </small>{Number(d.price).toLocaleString()}</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <div className="special-feature">
              <img src="/images/chef-1.svg" alt="Chef at work" />
              <div className="sf-body">
                <span className="s-tag" style={{ color: 'var(--gold-soft)' }}>From Our Kitchen</span>
                <h5>Plated Like It Belongs in a Hotel in the Hills</h5>
                <p>Every plate leaves the pass with intention — local produce, honest technique, no shortcuts.</p>
                <Link to="/reservation" className="btn btn--primary">Reserve a Table</Link>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ---------- Popular Dishes ---------- */
function PopularDishes({ popular }) {
  const items = popular.length ? popular : [
    { id: 'p1', name: 'Ember Smash Burger', desc: 'Double patty, special sauce, pickles, toasted brioche.', price: 690, image: '/images/food-5.svg', veg: false, popular: true, rating: 5 },
    { id: 'p2', name: 'Truffle Carbonara', desc: 'Silky egg and pecorino, guanciale, cracked pepper.', price: 850, image: '/images/food-2.svg', veg: false, popular: true, rating: 5 },
    { id: 'p3', name: 'Basque Cheesecake', desc: 'Burnt, creamy, molten in the middle.', price: 480, image: '/images/dessert-1.svg', veg: true, popular: true, rating: 5 },
    { id: 'p4', name: 'Ember Old Fashioned', desc: 'Bourbon, burnt orange, bitters, smoked demerara.', price: 850, image: '/images/cocktail-1.svg', veg: true, popular: true, rating: 5 }
  ]
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Guest Favourites"
          title="Popular <em>Dishes</em>"
          sub="The plates people order again — and come back three times for."
        />
        <div className="menu-grid">
          {items.map((m, i) => (
            <Reveal key={m.id} delay={i * 0.08}>
              <MenuCard item={m} />
            </Reveal>
          ))}
        </div>
        <Reveal className="center" delay={0.2}>
          <Link to="/menu" className="btn btn--dark mt-40">Browse the Full Menu</Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Today's Specials ---------- */
function TodaySpecials() {
  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHead
          eyebrow="Fresh Today"
          title="Today’s <em>Specials</em>"
          sub="Chef’s pick of the day — available while the market says so."
        />
        <div className="menu-grid">
          {TODAY_SPECIALS.map((s, i) => (
            <Reveal key={s.id} delay={i * 0.08}>
              <div className="menu-card">
                <div className="m-media">
                  <img src={s.image} alt={s.title} loading="lazy" />
                  <div className="m-card-badges"><span className="badge badge--seasonal">{s.tag}</span></div>
                </div>
                <div className="m-card-body">
                  <div className="m-card-top">
                    <h4>{s.title}</h4>
                    <span className="m-price"><small>Rs </small>{Number(s.price).toLocaleString()}</span>
                  </div>
                  <p>{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Upcoming Music ---------- */
function UpcomingMusic({ events, featuredEvent }) {
  const upcoming = [...events].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 3)
  const list = upcoming.length ? upcoming : [
    { id: 'ev1', title: 'Acoustic Evening — Sagar & The Strings', date: '2026-08-07', time: '8:00 PM', tag: 'Live Music', desc: 'An intimate acoustic set under warm lights.' },
    { id: 'ev2', title: 'Neon Friday — DJ Aarav', date: '2026-08-14', time: '9:00 PM', tag: 'DJ Night', desc: 'House, afrobeat and late-night edits on the rooftop.' },
    { id: 'ev3', title: 'Jazz & Wine Sunday', date: '2026-08-23', time: '6:30 PM', tag: 'Live Music', desc: 'A smooth trio and a curated wine flight.' }
  ]
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Live Music & Events"
          title="Upcoming <em>Live Nights</em>"
          sub="Bands, DJs and acoustic sets — the evenings Lakeside talks about."
        />
        <Reveal className="center" delay={0.1}>
          <div style={{ marginBottom: 44 }}>
            <Countdown target={list[0].date} label="until the next live night" />
          </div>
        </Reveal>
        <div className="event-list">
          {list.map((e, i) => {
            const d = new Date(e.date)
            return (
              <Reveal key={e.id} delay={i * 0.08}>
                <div className="event-row">
                  <div className="event-date">
                    <div className="d">{d.getDate()}</div>
                    <div className="m">{d.toLocaleString('en', { month: 'short' }).toUpperCase()}</div>
                  </div>
                  <div className="event-info">
                    <h4>{e.title}</h4>
                    <p>{e.desc}</p>
                    <div className="event-tags">
                      <span className="badge badge--pop">{e.tag}</span>
                      <span className="badge badge--pop">{e.time}</span>
                      {e.featured && <span className="badge badge--chef">Featured</span>}
                    </div>
                  </div>
                  <div className="event-cta">
                    <Link to="/reservation" className="btn btn--ghost btn--sm">Book Your Spot</Link>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------- Gallery Preview ---------- */
function GalleryPreview({ gallery }) {
  const preview = gallery.slice(0, 8)
  const items = preview.length ? preview : [
    { id: 'g1', src: '/images/interior-1.svg', cat: 'interior', title: 'The lounge' },
    { id: 'g2', src: '/images/coffee-1.svg', cat: 'coffee', title: 'First pour' },
    { id: 'g3', src: '/images/cocktail-1.svg', cat: 'cocktails', title: 'The bar' },
    { id: 'g4', src: '/images/food-1.svg', cat: 'food', title: 'Signature plate' },
    { id: 'g5', src: '/images/live-1.svg', cat: 'live', title: 'Acoustic night' },
    { id: 'g6', src: '/images/outdoor-1.svg', cat: 'outdoor', title: 'The garden' },
    { id: 'g7', src: '/images/dessert-1.svg', cat: 'desserts', title: 'Basque cheesecake' },
    { id: 'g8', src: '/images/interior-3.svg', cat: 'interior', title: 'Booths' }
  ]
  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHead
          eyebrow="A Glimpse"
          title="Inside <em>Ember & Ivy</em>"
          sub="Warm lights, brass details, a garden and a rooftop that comes alive after dark."
        />
        <div className="gallery-grid">
          {items.map((g, i) => (
            <Reveal key={g.id} delay={i * 0.05}>
              <Link to="/gallery" className="gallery-item" style={{ display: 'block' }}>
                <img src={g.src} alt={g.title} loading="lazy" />
                <div className="g-overlay">
                  <span>{g.cat}</span>
                  <h5>{g.title}</h5>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
        <Reveal className="center" delay={0.2}>
          <Link to="/gallery" className="btn btn--dark mt-40">View Full Gallery</Link>
        </Reveal>
      </div>
    </section>
  )
}

/* ---------- Team ---------- */
function Team({ items }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="The People"
          title="Meet Our <em>Team</em>"
          sub="The faces behind the coffee, the kitchen and the good nights."
        />
        <div className="team-grid">
          {items.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              <div className="team-card">
                <div className="t-avatar">
                  <img src={t.image} alt={t.name} loading="lazy" />
                </div>
                <div className="t-body">
                  <h4>{t.name}</h4>
                  <div className="t-role">{t.role}</div>
                  <p>{t.bio}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Instagram ---------- */
function Instagram({ items }) {
  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHead
          eyebrow="@emberandivy"
          title="Follow the <em>Feed</em>"
          sub="Daily pours, plates and late nights from the rooftop."
        />
        <div className="insta-grid">
          {items.slice(0, 6).map((src, i) => (
            <Reveal key={i} delay={i * 0.05}>
              <a
                className="insta-item"
                href="https://www.instagram.com/emberandivy"
                target="_blank"
                rel="noreferrer"
              >
                <img src={src} alt="Ember & Ivy on Instagram" loading="lazy" />
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Reviews ---------- */
function Reviews({ items }) {
  return (
    <section className="section">
      <div className="container">
        <SectionHead
          eyebrow="Guest Love"
          title="What <em>Lakeside</em> Says"
          sub="Real words from real guests — our first season, as told by the people who spent it with us."
        />
        <Reveal>
          <div className="rating-summary">
            <div>
              <div className="rs-num">4.7</div>
              <div className="rs-stars"><Stars rating={4.7} size={22} /></div>
              <div className="rs-count">{SITE.reviewCount}+ verified guest reviews</div>
            </div>
            <div className="rs-tags">
              {REVIEW_TAGS.slice(0, 8).map((t) => (
                <span key={t} className="badge badge--pop">{t}</span>
              ))}
            </div>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}>
          {items.slice(0, 9).map((r, i) => (
            <Reveal key={r.id} delay={i * 0.07}>
              <article className="review-card">
                <Stars rating={r.rating} />
                <blockquote>“{r.text}”</blockquote>
                <footer>
                  <span className="r-avatar">{r.name.charAt(0)}</span>
                  <div>
                    <div className="r-name">{r.name}</div>
                    <div className="r-meta">{r.when || r.review_date} · {r.tag}</div>
                  </div>
                </footer>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- Awards ---------- */
function Awards() {
  return (
    <section className="section section--alt">
      <div className="container">
        <SectionHead
          eyebrow="Recognition"
          title="A Few <em>Bravos</em>"
          sub="Early honours and the rating that matters most — from the people who came."
        />
        <div className="award-strip">
          {AWARDS.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.08}>
              <div className="award-card">
                <div className="a-icon">{a.icon}</div>
                <h5>{a.title}</h5>
                <p>{a.sub}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ---------- CTA ---------- */
function CtaBanner() {
  return (
    <section className="section">
      <div className="container">
        <Reveal>
          <div className="cta-banner">
            <div className="cb-img"><img src="/images/cta-1.svg" alt="" /></div>
            <span className="hero-eyebrow">Tables go fast on weekends</span>
            <h3>Your Evening in Lakeside Starts Here</h3>
            <p>Reserve your table for dinner, a rooftop cocktail or a night of live music.</p>
            <div className="hero-actions">
              <Link to="/reservation" className="btn btn--primary btn--lg">Reserve a Table</Link>
              <Link to="/events" className="btn btn--ghost btn--lg">See Upcoming Events</Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
