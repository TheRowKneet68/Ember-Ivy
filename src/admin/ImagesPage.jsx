import { useEffect, useState } from 'react'
import { getSettings, saveSetting } from '../lib/store.js'
import { SITE_IMAGES } from '../lib/siteImages.js'
import ImageField from './ImageField.jsx'
import { useToast } from './AdminApp.jsx'

export default function ImagesPage() {
  const toast = useToast()
  const [settings, setSettings] = useState(null)

  useEffect(() => {
    getSettings().then(setSettings).catch(() => setSettings({}))
  }, [])

  if (!settings) return <div className="empty-state">Loading images…</div>

  async function update(key, value) {
    setSettings((s) => ({ ...s, [key]: value }))
    try {
      await saveSetting(key, value)
      toast.success('Image saved.')
    } catch (err) {
      toast.error(err.message || 'Save failed.')
    }
  }

  return (
    <div style={{ display: 'grid', gap: 18 }}>
      <p className="form-note">
        Photos used directly on the homepage. Upload a picture (auto-compressed) or paste a link.
        Menu, gallery, hero, team and Instagram photos are edited from their own pages.
      </p>
      {SITE_IMAGES.map((img) => (
        <div className="admin-card" key={img.key}>
          <div className="ac-head"><h3>{img.label}</h3></div>
          <div className="ac-body">
            <ImageField
              label={img.label}
              value={settings[img.key] || img.default}
              onChange={(v) => update(img.key, v)}
            />
          </div>
        </div>
      ))}
    </div>
  )
}