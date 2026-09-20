import { useRef, useState } from 'react'
import { saveImage } from '../lib/upload.js'
import { supabaseConfigured } from '../lib/supabase.js'

// A friendly photo picker: upload & auto-compress, or paste a link.
export default function ImageField({ label = 'Photo', value, onChange }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function onPick(e) {
    const file = e.target.files && e.target.files[0]
    setError('')
    if (!file) return
    setBusy(true)
    try {
      const url = await saveImage(file)
      onChange(url)
    } catch (err) {
      setError(err.message || 'Upload failed.')
    } finally {
      setBusy(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  return (
    <div className="image-field">
      <div className="if-preview">
        {value ? (
          <img src={value} alt="preview" />
        ) : (
          <span className="if-empty">No photo yet</span>
        )}
      </div>
      <div style={{ display: 'grid', gap: 8, flex: 1 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <button type="button" className="btn btn--dark btn--sm" disabled={busy} onClick={() => inputRef.current && inputRef.current.click()}>
            {busy ? <span className="spinner" /> : <>Upload picture</>}
          </button>
          {value && (
            <button type="button" className="btn btn--ghost btn--sm" onClick={() => onChange('')}>Remove</button>
          )}
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={onPick} />
        </div>
        <input
          className="input"
          placeholder="…or paste a link or path (e.g. /images/food-1.svg)"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          aria-label={`${label} link`}
        />
        {busy && <span className="form-note">Compressing &amp; saving…</span>}
        <span className="form-note">
          {supabaseConfigured
            ? 'Pictures are compressed and stored in the cloud.'
            : 'Demo mode: the picture is compressed and saved in this browser. Connect Supabase to store photos permanently.'}
        </span>
        {error && <span className="form-error">{error}</span>}
      </div>
    </div>
  )
}