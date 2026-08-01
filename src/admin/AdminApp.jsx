import { createContext, useContext, useState } from 'react'
import { Routes, Route, NavLink, Navigate, Link, useLocation } from 'react-router-dom'
import { AuthProvider, useAuth } from './AuthContext.jsx'
import Icon from '../components/Icons.jsx'
import Dashboard from './Dashboard.jsx'
import CrudPage from './CrudPage.jsx'
import ReservationsPage from './ReservationsPage.jsx'
import SettingsPage from './SettingsPage.jsx'

/* ---------- Toast ---------- */
const ToastCtx = createContext(null)
export const useToast = () => useContext(ToastCtx)

function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const push = (type, text) => {
    const id = Date.now() + Math.random()
    setToasts((t) => [...t, { id, type, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200)
  }
  const value = {
    success: (text) => push('success', text),
    error: (text) => push('error', text)
  }
  return (
    <ToastCtx.Provider value={value}>
      {children}
      <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 1500, display: 'flex', flexDirection: 'column', gap: 10 }}>
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast--${t.type}`}>
            <Icon name="check" size={16} /> {t.text}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

/* ---------- Nav ---------- */
const NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '⌂' },
  { to: '/admin/menu', label: 'Menu', icon: '🍽️' },
  { to: '/admin/categories', label: 'Categories', icon: '🗂️' },
  { to: '/admin/gallery', label: 'Gallery', icon: '🖼️' },
  { to: '/admin/reviews', label: 'Reviews', icon: '⭐' },
  { to: '/admin/reservations', label: 'Reservations', icon: '🕰️' },
  { to: '/admin/events', label: 'Events', icon: '🎶' },
  { to: '/admin/hero', label: 'Hero Slides', icon: '🎬' },
  { to: '/admin/team', label: 'Team', icon: '👥' },
  { to: '/admin/instagram', label: 'Instagram', icon: '📸' },
  { to: '/admin/settings', label: 'Settings & Theme', icon: '⚙️' }
]

function AdminLayout({ children }) {
  const { signOut, mode } = useAuth()
  const { pathname } = useLocation()
  const current = NAV.find((n) => pathname.startsWith(n.to))
  return (
    <div className="admin-shell">
      <aside className="admin-side">
        <div className="a-logo">
          <span className="monogram">E&I</span>
          <span className="wordmark">
            Ember &amp; Ivy
            <small>Admin Panel</small>
          </span>
        </div>
        <nav className="a-nav">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : '')}>
              <span className="a-ico">{n.icon}</span> {n.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="admin-main">
        <div className="admin-topbar">
          <h1>{current?.label || 'Dashboard'}</h1>
          <div className="at-user">
            <span className="badge badge--pop">{mode === 'supabase' ? 'Supabase' : 'Demo mode'}</span>
            <Link to="/" className="btn btn--dark btn--sm">View Site</Link>
            <button className="btn btn--ghost btn--sm" onClick={signOut}>Sign Out</button>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

/* ---------- Login ---------- */
function Login() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="auth-wrap">
      <form className="auth-card" onSubmit={onSubmit}>
        <div className="a-logo">
          <span className="monogram">E&I</span>
          <h1>Ember &amp; Ivy Admin</h1>
          <p className="form-note" style={{ textAlign: 'center' }}>
            Sign in to manage the menu, gallery, reviews, reservations and events.
          </p>
        </div>
        <div className="field">
          <label className="label">Email</label>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@emberandivy.com" />
        </div>
        <div className="field mt-24">
          <label className="label">Password</label>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
        </div>
        {error && <p className="form-error">{error}</p>}
        <button className="btn btn--primary btn--block mt-24" disabled={busy}>
          {busy ? <span className="spinner" /> : 'Sign In'}
        </button>
      </form>
    </div>
  )
}

/* ---------- Root ---------- */
function AdminPanel() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-wrap">
        <div className="loader-ring" />
      </div>
    )
  }

  if (!user) return <Login />

  return (
    <AdminLayout>
      <Routes>
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menu" element={<CrudPage resourceKey="menu" />} />
        <Route path="categories" element={<CrudPage resourceKey="categories" />} />
        <Route path="gallery" element={<CrudPage resourceKey="gallery" />} />
        <Route path="reviews" element={<CrudPage resourceKey="reviews" />} />
        <Route path="reservations" element={<ReservationsPage />} />
        <Route path="events" element={<CrudPage resourceKey="events" />} />
        <Route path="hero" element={<CrudPage resourceKey="hero_slides" />} />
        <Route path="team" element={<CrudPage resourceKey="team" />} />
        <Route path="instagram" element={<CrudPage resourceKey="instagram" />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </AdminLayout>
  )
}

export default function AdminApp() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AdminPanel />
      </ToastProvider>
    </AuthProvider>
  )
}
