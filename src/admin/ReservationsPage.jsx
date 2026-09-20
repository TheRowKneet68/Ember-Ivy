import { useEffect, useState } from 'react'
import { store } from '../lib/store.js'
import { useToast } from './AdminApp.jsx'

const STATUSES = ['pending', 'confirmed', 'cancelled']

export default function ReservationsPage() {
  const toast = useToast()
  const [rows, setRows] = useState(null)

  useEffect(() => {
    store.list('reservations').then(setRows).catch(() => setRows([]))
  }, [])

  async function reload() {
    setRows(await store.list('reservations'))
  }

  async function setStatus(row, status) {
    try {
      await store.update('reservations', row.id, { status })
      toast.success(`Marked ${status}.`)
      await reload()
    } catch (err) {
      toast.error(err.message || 'Could not update the status.')
    }
  }

  async function remove(row) {
    if (!window.confirm(`Delete reservation for ${row.name}?`)) return
    try {
      await store.remove('reservations', row.id)
      toast.success('Deleted.')
      await reload()
    } catch (err) {
      toast.error(err.message || 'Could not delete the reservation.')
    }
  }

  const sorted = rows ? [...rows].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)) : []

  return (
    <div className="admin-card">
      <div className="ac-head">
        <h3>Reservations</h3>
      </div>
      <div className="ac-body" style={{ padding: 0 }}>
        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="e-ico">🕰️</div>
            <p>No reservations yet. They’ll land here the moment a guest books.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Guest</th>
                  <th>Contact</th>
                  <th>When</th>
                  <th>Guests</th>
                  <th>Occasion</th>
                  <th>Message</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((r) => (
                  <tr key={r.id}>
                    <td><strong>{r.name}</strong></td>
                    <td>
                      <div>{r.phone}</div>
                      {r.email && <div style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.email}</div>}
                    </td>
                    <td>{r.date}<div style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.time}</div></td>
                    <td>{r.guests}</td>
                    <td>{r.occasion}</td>
                    <td style={{ maxWidth: 200 }}>{r.message || '—'}</td>
                    <td>
                      <select
                        className="select"
                        style={{ padding: '8px 30px 8px 12px', fontSize: 13 }}
                        value={r.status || 'pending'}
                        onChange={(e) => setStatus(r, e.target.value)}
                      >
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn--ghost btn--sm" onClick={() => remove(r)} style={{ borderColor: 'rgba(180,90,70,.4)', color: '#e08d78' }}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
