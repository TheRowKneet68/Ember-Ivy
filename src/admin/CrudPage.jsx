import { useEffect, useState } from 'react'
import { store } from '../lib/store.js'
import { RESOURCE_INDEX, CAT_OPTIONS } from './fields.jsx'
import { useToast } from './AdminApp.jsx'
import ImageField from './ImageField.jsx'

export default function CrudPage({ resourceKey }) {
  const cfg = RESOURCE_INDEX[resourceKey]
  const toast = useToast()
  const [rows, setRows] = useState(null)
  const [editing, setEditing] = useState(null)
  const [busy, setBusy] = useState(false)
  const [catOptions, setCatOptions] = useState(null)

  useEffect(() => {
    let alive = true
    store.list(resourceKey).then((data) => alive && setRows(data)).catch(() => alive && setRows([]))
    return () => {
      alive = false
    }
  }, [resourceKey])

  useEffect(() => {
    if (resourceKey !== 'menu') return
    let alive = true
    store.list('categories').then((cats) => {
      if (!alive) return
      const names = (cats || []).map((c) => c.name || c).filter(Boolean)
      if (names.length) setCatOptions(Array.from(new Set([...CAT_OPTIONS, ...names])))
    }).catch(() => {})
    return () => {
      alive = false
    }
  }, [resourceKey])

  const fields = Object.entries(cfg.fields)
  const columns = fields.slice(0, 4)

  async function reload() {
    setRows(await store.list(resourceKey))
  }

  function startEdit(row) {
    setEditing({ ...(row || {}) })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function setField(key, value) {
    setEditing((e) => ({ ...e, [key]: value }))
  }

  async function save(e) {
    e.preventDefault()
    if (!editing) return
    setBusy(true)
    try {
      if (editing.id) await store.update(resourceKey, editing.id, editing)
      else await store.insert(resourceKey, editing)
      toast.success(editing.id ? 'Updated.' : 'Added.')
      setEditing(null)
      await reload()
    } catch (err) {
      toast.error(err.message || 'Save failed.')
    } finally {
      setBusy(false)
    }
  }

  async function remove(row) {
    if (!window.confirm(`Delete "${row.name || row.title || row.id}"? This cannot be undone.`)) return
    try {
      await store.remove(resourceKey, row.id)
      toast.success('Deleted.')
      await reload()
    } catch (err) {
      toast.error(err.message || 'Delete failed.')
    }
  }

  return (
    <>
      <div className="admin-card">
        <div className="ac-head">
          <h3>{cfg.title}</h3>
          <button className="btn btn--primary btn--sm" onClick={() => startEdit(null)}>
            + Add New
          </button>
        </div>
        <div className="ac-body">
          {editing !== null && (
            <form className="admin-form" onSubmit={save} style={{ padding: '22px', border: '1px solid var(--line-soft)', borderRadius: 14, marginBottom: 26, background: 'var(--surface-2)' }}>
              {fields.map(([key, f]) => (
                <div key={key} className={`field ${f.type === 'textarea' || f.type === 'bool' ? 'field--full' : ''}`}>
                  <label className="label">{f.label}</label>
                  {f.type === 'textarea' && (
                    <textarea className="textarea" value={editing[key] || ''} onChange={(e) => setField(key, e.target.value)} />
                  )}
                  {f.type === 'select' && (
                    <select className="select" value={editing[key] || ''} onChange={(e) => setField(key, e.target.value)}>
                      <option value="">— select —</option>
                      {(key === 'category' && catOptions ? catOptions : f.options).map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  )}
                  {f.type === 'bool' && (
                    <div className="toggle-row">
                      <div>
                        <div className="tr-label">{f.label}</div>
                      </div>
                      <button
                        type="button"
                        className={`switch ${editing[key] ? 'switch--on' : ''}`}
                        onClick={() => setField(key, !editing[key])}
                        aria-label={f.label}
                      />
                    </div>
                  )}
                  {f.type === 'number' && (
                    <input className="input" type="number" value={editing[key] ?? ''} onChange={(e) => setField(key, e.target.value === '' ? '' : Number(e.target.value))} />
                  )}
                  {f.type === 'date' && <input className="input" type="date" value={editing[key] || ''} onChange={(e) => setField(key, e.target.value)} />}
                  {f.type === 'text' && <input className="input" value={editing[key] || ''} onChange={(e) => setField(key, e.target.value)} />}
                  {f.type === 'image' && (
                    <ImageField label={f.label} value={editing[key] || ''} onChange={(v) => setField(key, v)} />
                  )}
                </div>
              ))}
              <div className="form-actions">
                <button type="button" className="btn btn--dark btn--sm" onClick={() => setEditing(null)}>Cancel</button>
                <button type="submit" className="btn btn--primary btn--sm" disabled={busy}>
                  {busy ? <span className="spinner" /> : editing.id ? 'Save Changes' : 'Add'}
                </button>
              </div>
            </form>
          )}

          {rows === null ? (
            <div className="empty-state">Loading…</div>
          ) : rows.length === 0 ? (
            <div className="empty-state">
              <div className="e-ico">✦</div>
              <p>Nothing here yet. Add your first entry.</p>
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    {columns.map(([key]) => <th key={key}>{cfg.fields[key].label}</th>)}
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.id}>
                      {columns.map(([key]) => (
                        <td key={key}>
                          {cfg.fields[key].type === 'image' && row[key] ? (
                            <img src={row[key]} alt="" style={{ width: 56, height: 42, objectFit: 'cover', borderRadius: 8 }} />
                          ) : typeof row[key] === 'boolean' ? (
                            row[key] ? '✓' : '—'
                          ) : (
                            String(row[key] ?? '—').slice(0, 60)
                          )}
                        </td>
                      ))}
                      <td>
                        <div className="row-actions">
                          <button className="btn btn--dark btn--sm" onClick={() => startEdit(row)}>Edit</button>
                          <button className="btn btn--ghost btn--sm" onClick={() => remove(row)} style={{ borderColor: 'rgba(180,90,70,.4)', color: '#e08d78' }}>Delete</button>
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
      <p className="form-note">{cfg.desc}</p>
    </>
  )
}
