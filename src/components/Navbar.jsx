import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Icon from './Icons.jsx'
import { useTheme } from '../context/ThemeContext.jsx'
import { SITE } from '../data/seed.js'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/menu', label: 'Menu' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/events', label: 'Events' },
  { to: '/contact', label: 'Contact' }
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo" onClick={() => setOpen(false)}>
          <span className="monogram">E&I</span>
          <span className="wordmark">
            Ember &amp; Ivy
            <small>Lakeside · Pokhara</small>
          </span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) => `nav-link ${isActive ? 'nav-link--active' : ''}`}
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav-actions">
          <button className="theme-toggle" onClick={toggle} aria-label="Toggle dark mode">
            <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
          </button>
          <Link to="/reservation" className="btn btn--primary btn--sm">
            Reserve
          </Link>
          <button
            className={`nav-toggle ${open ? 'nav-toggle--open' : ''}`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      {open && (
        <div className="mobile-menu">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setOpen(false)}
              className="nav-link"
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/reservation" className="btn btn--primary" onClick={() => setOpen(false)}>
            Reserve a Table
          </Link>
          <span style={{ marginTop: 24, fontSize: 12, letterSpacing: '0.2em', color: 'var(--muted)', textTransform: 'uppercase' }}>
            {SITE.hours.label} · {SITE.hours.open} – {SITE.hours.close}
          </span>
        </div>
      )}
    </header>
  )
}
