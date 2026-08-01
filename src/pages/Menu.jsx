import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import MenuCard from '../components/MenuCard.jsx'
import { store } from '../lib/store.js'
import { CATEGORIES } from '../data/seed.js'

export default function Menu() {
  const [menu, setMenu] = useState([])
  const [cat, setCat] = useState('all')

  useEffect(() => {
    store.list('menu').then(setMenu).catch(() => setMenu([]))
  }, [])

  const cats = [{ id: 'all', name: 'Everything', icon: '✦' }, ...CATEGORIES]
  const shown = cat === 'all' ? menu : menu.filter((m) => m.category === cat)
  const activeCat = cats.find((c) => c.id === cat)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / Menu</div>
          <span className="eyebrow">The Menu</span>
          <h1>Eat, Drink &amp; Stay a <em>While</em></h1>
          <p>Handcrafted coffee, chef’s specials, small plates and rooftop cocktails — priced honestly, plated beautifully.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <div className="tabs">
            {cats.map((c) => (
              <button
                key={c.id}
                className={`tab-btn ${cat === c.id ? 'tab-btn--active' : ''}`}
                onClick={() => setCat(c.id)}
              >
                {c.icon} {c.name}
              </button>
            ))}
          </div>

          <Reveal className="center" delay={0.05}>
            <p style={{ color: 'var(--muted)', marginBottom: 36, fontSize: 15 }}>
              {activeCat?.name === 'Everything' ? 'Our full menu' : activeCat?.name} — all prices in Nepali Rupees.
              <span style={{ display: 'block', marginTop: 6 }}>
                <span className="badge badge--veg">Veg</span> &nbsp;
                <span className="badge badge--nonveg">Non-Veg</span> &nbsp;
                <span className="badge badge--pop">Popular</span> &nbsp;
                <span className="badge badge--chef">Chef’s Pick</span> &nbsp;
                <span className="badge badge--seasonal">Seasonal</span>
              </span>
            </p>
          </Reveal>

          {shown.length ? (
            <div className="menu-grid">
              {shown.map((m, i) => (
                <Reveal key={m.id} delay={(i % 4) * 0.07}>
                  <MenuCard item={m} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="e-ico">🍽️</div>
              <p>This section is being plated. Check back soon or explore another category.</p>
            </div>
          )}

          <Reveal className="center" delay={0.15}>
            <p style={{ marginTop: 56, color: 'var(--muted)' }}>
              Hungry for something specific? <Link to="/contact" style={{ color: 'var(--gold)' }}>Message us</Link> and we’ll arrange it.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}
