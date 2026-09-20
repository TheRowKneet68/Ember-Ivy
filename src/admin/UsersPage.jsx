import { useEffect, useState } from 'react'
import { users, ROLES } from '../lib/users.js'
import { useAuth } from './AuthContext.jsx'
import { useToast } from './AdminApp.jsx'

export default function UsersPage() {
  const { user, mode } = useAuth()
  const toast = useToast()
  const [rows, setRows] = useState(null)
  const [form, setForm] = useState({ email: '', password: '', role: 'employee' })
  const [busy, setBusy] = useState(false)

  async function reload() {
    setRows(await users.list())
  }

  useEffect(() => {
    users.list().then(setRows).catch(() => setRows([]))
  }, [])

  async function add(e) {
    e.preventDefault()
    setBusy(true)
    try {
      await users.create(form)
      toast.success('Account created. They can sign in at /admin now.')
      setForm({ email: '', password: '', role: 'employee' })
      await reload()
    } catch (err) {
      toast.error(err.message || 'Could not create the account.')
    } finally {
      setBusy(false)
    }
  }

  async function changeRole(id, role) {
    try {
      await users.setRole(id, role)
      toast.success('Role updated.')
      await reload()
    } catch (err) {
      toast.error(err.message || 'Could not change the role.')
    }
  }

  async function remove(row) {
    if (row.email === user?.email || (mode === 'demo' && row.email === String(user).toLowerCase())) {
      window.alert('You cannot delete your own account.')
      return
    }
    if (!window.confirm(`Remove ${row.email}? They will no longer be able to sign in.`)) return
    try {
      await users.remove(row.id)
      toast.success('Account removed.')
      await reload()
    } catch (err) {
      toast.error(err.message || 'Could not remove the account.')
    }
  }

  return (
    <div style={{ display: 'grid', gap: 26 }}>
      <div className="admin-card">
        <div className="ac-head">
          <h3>Add a Person</h3>
        </div>
        <div className="ac-body">
          <form className="admin-form" onSubmit={add}>
            <div className="form-grid">
              <div className="field">
                <label className="label">Email</label>
                <input className="input" type="email" required placeholder="person@yourcafe.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="field">
                <label className="label">Temporary Password</label>
                <input className="input" type="text" required placeholder="Something they can remember" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="field">
                <label className="label">What can they do?</label>
                <select className="select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
              </div>
              <div className="field" style={{ alignSelf: 'flex-end' }}>
                <button type="submit" className="btn btn--primary btn--sm" disabled={busy}>
                  {busy ? <span className="spinner" /> : 'Create Account'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="admin-card">
        <div className="ac-head">
          <h3>Who has access</h3>
        </div>
        <div className="ac-body" style={{ padding: 0 }}>
          {rows === null ? (
            <div className="empty-state">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="empty-state">No accounts yet.</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Email</th>
                    <th>Access level</th>
                    <th style={{ textAlign: 'right' }}>Remove</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <strong>{r.email}</strong>
                        {(mode === 'demo' ? String(user).toLowerCase() : user?.email) === r.email && (
                          <div style={{ color: 'var(--muted)', fontSize: 12.5 }}>you</div>
                        )}
                      </td>
                      <td>
                        <select
                          className="select"
                          style={{ padding: '8px 30px 8px 12px', fontSize: 13 }}
                          value={r.role}
                          onChange={(e) => changeRole(r.id, e.target.value)}
                        >
                          {ROLES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                        </select>
                      </td>
                      <td style={{ textAlign: 'right' }}>
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
    </div>
  )
}