import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { store, getAnalytics } from '../lib/store.js'

export default function Dashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    Promise.all([
      store.list('menu'),
      store.list('reservations'),
      store.list('reviews'),
      store.list('events'),
      getAnalytics()
    ]).then(([menu, reservations, reviews, events, analytics]) => {
      const pending = reservations.filter((r) => r.status === 'pending').length
      const recent = [...reservations].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)).slice(0, 6)
      setStats({
        menu: menu.length,
        pending,
        reservations: reservations.length,
        reviews: reviews.length,
        events: events.length,
        visits: analytics.visits || 0,
        recent
      })
    }).catch(() => {})
  }, [])

  if (!stats) return <div className="empty-state">Loading dashboard…</div>

  const cards = [
    { label: 'Menu Items', value: stats.menu, sub: 'live dishes', to: '/admin/menu' },
    { label: 'Pending Reservations', value: stats.pending, sub: 'need a reply', to: '/admin/reservations' },
    { label: 'Total Reservations', value: stats.reservations, sub: 'all time', to: '/admin/reservations' },
    { label: 'Reviews', value: stats.reviews, sub: 'guest testimonials', to: '/admin/reviews' },
    { label: 'Events', value: stats.events, sub: 'on the calendar', to: '/admin/events' },
    { label: 'Site Visits', value: stats.visits, sub: 'tracked visits', to: '/admin/dashboard' }
  ]

  return (
    <>
      <div className="admin-grid">
        {cards.map((c) => (
          <Link to={c.to} key={c.label} className="stat-card">
            <div className="s-label">{c.label}</div>
            <div className="s-value">{c.value}</div>
            <div className="s-sub">{c.sub}</div>
          </Link>
        ))}
      </div>

      <div className="admin-card">
        <div className="ac-head">
          <h3>Recent Reservations</h3>
          <Link to="/admin/reservations" className="btn btn--dark btn--sm">View All</Link>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {stats.recent.length === 0 ? (
            <div className="empty-state">No reservations yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Guest</th>
                    <th>When</th>
                    <th>Guests</th>
                    <th>Occasion</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recent.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.name}</strong>
                        <div style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.phone}</div>
                      </td>
                      <td>{r.date} · {r.time}</td>
                      <td>{r.guests}</td>
                      <td>{r.occasion}</td>
                      <td><span className={`pill pill--${r.status || 'pending'}`}>{r.status || 'pending'}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
