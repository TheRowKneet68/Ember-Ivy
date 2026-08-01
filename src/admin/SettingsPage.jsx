import { useEffect, useState } from 'react'
import { getSettings, saveSetting } from '../lib/store.js'
import { useToast } from './AdminApp.jsx'

const SECTIONS = [
  { key: 'about', label: 'About / Story' },
  { key: 'features', label: 'Features Grid' },
  { key: 'coffee', label: 'Signature Coffee' },
  { key: 'chef', label: 'Chef’s Specials' },
  { key: 'popular', label: 'Popular Dishes' },
  { key: 'today', label: 'Today’s Specials' },
  { key: 'music', label: 'Upcoming Live Music' },
  { key: 'gallery', label: 'Gallery Preview' },
  { key: 'team', label: 'Meet Our Team' },
  { key: 'instagram', label: 'Instagram Feed' },
  { key: 'reviews', label: 'Customer Reviews' },
  { key: 'awards', label: 'Awards' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'cta', label: 'Reservation CTA' }
]

export default function SettingsPage() {
  const toast = useToast()
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings({}))
  }, [])

  if (!settings) return <div className="empty-state">Loading settings…</div>

  const sections = settings.sections || Object.fromEntries(SECTIONS.map((s) => [s.key, true]))

  async function patch(obj) {
    const next = { ...settings, ...obj }
    setSettings(next)
    await saveSetting('site', next)
    toast.success('Saved.')
  }

  function toggleSection(key) {
    patch({ sections: { ...sections, [key]: !sections[key] } })
  }

  function setTheme(t) {
    document.documentElement.classList.toggle('light', t === 'light')
    try {
      localStorage.setItem('ei-theme', t)
    } catch {}
    patch({ defaultTheme: t })
  }

  return (
    <div style={{ display: 'grid', gap: 26 }}>
      <div className="admin-card">
        <div className="ac-head"><h3>Theme</h3></div>
        <div className="ac-body">
          <div className="toggle-row">
            <div>
              <div className="tr-label">Default theme for new visitors</div>
              <div className="tr-sub">Visitors can still switch with the moon/sun button.</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className={`btn btn--sm ${settings.defaultTheme !== 'light' ? 'btn--primary' : 'btn--dark'}`} onClick={() => setTheme('dark')}>Dark</button>
              <button className={`btn btn--sm ${settings.defaultTheme === 'light' ? 'btn--primary' : 'btn--dark'}`} onClick={() => setTheme('light')}>Light</button>
            </div>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <div className="ac-head"><h3>Homepage Sections</h3></div>
        <div className="ac-body">
          {SECTIONS.map((s) => (
            <div className="toggle-row" key={s.key}>
              <div className="tr-label">{s.label}</div>
              <button
                type="button"
                className={`switch ${sections[s.key] === false ? '' : 'switch--on'}`}
                onClick={() => toggleSection(s.key)}
                aria-label={`Toggle ${s.label}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
