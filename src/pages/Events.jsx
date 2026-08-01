import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Reveal from '../components/Reveal.jsx'
import Countdown from '../components/Countdown.jsx'
import { store } from '../lib/store.js'

export default function Events() {
  const [events, setEvents] = useState([])
  const [view, setView] = useState('upcoming')

  useEffect(() => {
    store.list('events').then(setEvents).catch(() => setEvents([]))
  }, [])

  const sorted = [...events].sort((a, b) => new Date(a.date) - new Date(b.date))
  const today = new Date().toISOString().split('T')[0]
  const upcoming = sorted.filter((e) => e.date >= today)
  const past = sorted.filter((e) => e.date < today).reverse()
  const shown = view === 'upcoming' ? upcoming : past

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / Events</div>
          <span className="eyebrow">Live Music &amp; Events</span>
          <h1>Evenings Worth <em>Staying</em> For</h1>
          <p>Bands, DJs, acoustic sets and rooftop nights — the live calendar at Ember &amp; Ivy.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <Reveal className="center">
            <div className="tabs" style={{ marginBottom: 40 }}>
              <button className={`tab-btn ${view === 'upcoming' ? 'tab-btn--active' : ''}`} onClick={() => setView('upcoming')}>
                Upcoming
              </button>
              <button className={`tab-btn ${view === 'past' ? 'tab-btn--active' : ''}`} onClick={() => setView('past')}>
                Past Nights
              </button>
            </div>
          </Reveal>

          {shown.length ? (
            <div className="event-list" style={{ maxWidth: 880, margin: '0 auto' }}>
              {shown.map((e, i) => {
                const d = new Date(e.date)
                return (
                  <Reveal key={e.id} delay={i * 0.07}>
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
                        {view === 'upcoming' ? (
                          <Link to="/reservation" className="btn btn--ghost btn--sm">Book Your Spot</Link>
                        ) : (
                          <span className="badge badge--pop">That was a night ✦</span>
                        )}
                      </div>
                    </div>
                  </Reveal>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <div className="e-ico">🎶</div>
              <p>
                {view === 'upcoming'
                  ? 'New live nights are being booked. Check back soon or follow us on Instagram for the drop.'
                  : 'No past events yet — the first season is still being written.'}
              </p>
            </div>
          )}

          {upcoming.length > 0 && (
            <Reveal className="center" delay={0.1}>
              <div style={{ marginTop: 60 }}>
                <p className="eyebrow" style={{ justifyContent: 'center', marginBottom: 18 }}>Next Live Night</p>
                <Countdown target={upcoming[0].date} label="until the next live night" />
              </div>
            </Reveal>
          )}
        </div>
      </section>
    </>
  )
}
