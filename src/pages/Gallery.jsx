import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Lightbox from '../components/Lightbox.jsx'
import { store } from '../lib/store.js'
import { GALLERY_CATEGORIES } from '../data/seed.js'

export default function Gallery() {
  const [items, setItems] = useState([])
  const [cat, setCat] = useState('all')
  const [lb, setLb] = useState(null)

  useEffect(() => {
    store.list('gallery').then(setItems).catch(() => setItems([]))
  }, [])

  const shown = cat === 'all' ? items : items.filter((g) => g.cat === cat)

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / Gallery</div>
          <span className="eyebrow">The Gallery</span>
          <h1>Moments at <em>Ember &amp; Ivy</em></h1>
          <p>Coffee, plates, cocktails, interiors and the nights that make Lakeside worth staying for.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <div className="tabs">
            {GALLERY_CATEGORIES.map((c) => (
              <button
                key={c.id}
                className={`tab-btn ${cat === c.id ? 'tab-btn--active' : ''}`}
                onClick={() => setCat(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          {shown.length ? (
            <div className="gallery-grid">
              {shown.map((g, i) => (
                <Reveal key={g.id} delay={(i % 4) * 0.06}>
                  <div className="gallery-item" onClick={() => setLb(i)}>
                    <img src={g.src} alt={g.title} loading="lazy" />
                    <div className="g-overlay">
                      <span>{g.cat}</span>
                      <h5>{g.title}</h5>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="e-ico">📷</div>
              <p>No photos here yet — new ones land soon.</p>
            </div>
          )}
        </div>
      </section>

      {lb !== null && (
        <Lightbox
          items={shown}
          index={lb}
          onClose={() => setLb(null)}
          onNavigate={(i) => setLb(i)}
        />
      )}
    </>
  )
}
