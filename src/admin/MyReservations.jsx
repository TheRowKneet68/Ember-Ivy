import { useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase.js'
import { store } from '../lib/store.js'
import { useAuth } from './AuthContext.jsx'
import { useToast } from './AdminApp.jsx'

// Client portal: a guest sees only the reservations that were booked with
// their email and can cancel one that is still pending.
export default function MyReservations() {
  const { user } = useAuth()
  const toast = useToast()
  const [rows, setRows] = useState(null)
  const email = supabaseConfigured ? user?.email : String(user || '').toLowerCase()

  async function load() {
    if (!email) return setRows([])
    if (supabaseConfigured) {
      const { data, error } = await supabase.from('reservations').select('*').eq('email', email).order('created_at', { ascending: false })
      if (error) throw new Error(error.message)
      return setRows(data || [])
    }
    const all = await store.list('reservations')
    setRows(all.filter((r) => String(r.email || '').toLowerCase() === email))
  }

  useEffect(() => {
    load().catch(() => setRows([]))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email])

  async function cancel(row) {
    if (!window.confirm(`Cancel your reservation for ${row.date} at ${row.time}?`)) return
    try {
      await store.update('reservations', row.id, { status: 'cancelled' })
      toast.success('Reservation cancelled.')
      await load()
    } catch (err) {
      toast.error(err.message || 'Could not cancel the reservation.')
    }
  }

  const sorted = rows ? [...rows].sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0)) : []

  return (
    <div className="admin-card">
      <div className="ac-head">
        <h3>My Reservations</h3>
      </div>
      <div className="ac-body" style={{ padding: 0 }}>
        {sorted.length === 0 ? (
          <div className="empty-state">
            <div className="e-ico">🕰️</div>
            <p>No reservations found for <strong>{email || 'this account'}</strong>.</p>
            <p className="form-note">Bookings are matched to the email you used when reserving.</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
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
                    <td>{r.date} <div style={{ color: 'var(--muted)', fontSize: 12.5 }}>{r.time}</div></td>
                    <td>{r.guests}</td>
                    <td>{r.occasion || '—'}</td>
                    <td style={{ maxWidth: 200 }}>{r.message || '—'}</td>
                    <td><span className={`pill pill--${r.status || 'pending'}`}>{r.status || 'pending'}</span></td>
                    <td>
                      <div className="row-actions">
                        {(r.status || 'pending') === 'pending' && (
                          <button className="btn btn--ghost btn--sm" onClick={() => cancel(r)} style={{ borderColor: 'rgba(180,90,70,.4)', color: '#e08d78' }}>Cancel</button>
                        )}
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