import { supabase, supabaseConfigured } from './supabase'
import { MENU, CATEGORIES, REVIEWS, EVENTS, GALLERY, HERO_SLIDES, TEAM, INSTAGRAM } from '../data/seed'

const TABLES = {
  menu: 'menu_items',
  categories: 'categories',
  reviews: 'reviews',
  events: 'events',
  gallery: 'gallery',
  reservations: 'reservations',
  hero_slides: 'hero_slides',
  team: 'team',
  instagram: 'instagram'
}

function seedFor(key) {
  switch (key) {
    case 'menu': return MENU
    case 'categories': return CATEGORIES
    case 'reviews': return REVIEWS
    case 'events': return EVENTS
    case 'gallery': return GALLERY
    case 'hero_slides': return HERO_SLIDES
    case 'team': return TEAM
    case 'instagram': return INSTAGRAM
    default: return []
  }
}

/* ---------------- demo backend (localStorage) ---------------- */

const LS_KEY = 'ei_data_v1'

function readLS() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || {}
  } catch {
    return {}
  }
}

function writeLS(data) {
  localStorage.setItem(LS_KEY, JSON.stringify(data))
}

function hydrate() {
  const data = readLS()
  let changed = false
  for (const key of Object.keys(TABLES)) {
    if (data[key] === undefined) {
      data[key] = seedFor(key)
      changed = true
    }
  }
  if (data.reservations === undefined) {
    data.reservations = []
    changed = true
  }
  if (data.settings === undefined) {
    data.settings = { theme: 'dark', watermark: '' }
    changed = true
  }
  if (data.analytics === undefined) {
    data.analytics = { visits: 0 }
    changed = true
  }
  if (changed) writeLS(data)
  return data
}

/* ---------------- public API ---------------- */

async function supabaseList(table) {
  const { data, error } = await supabase.from(table).select('*').order('created_at', { ascending: true })
  if (error) throw error
  return data
}

export const store = {
  async list(key) {
    if (supabaseConfigured && TABLES[key]) {
      return supabaseList(TABLES[key])
    }
    const data = hydrate()
    return data[key] || seedFor(key)
  },

  async get(key, id) {
    if (supabaseConfigured && TABLES[key]) {
      const { data, error } = await supabase.from(TABLES[key]).select('*').eq('id', id).single()
      if (!error && data) return data
    }
    const rows = await this.list(key)
    return rows.find((r) => String(r.id) === String(id))
  },

  async insert(key, row) {
    const clean = { ...row }
    if (supabaseConfigured && TABLES[key]) {
      const { error } = await supabase.from(TABLES[key]).insert(clean)
      if (error) throw new Error(error.message)
      return clean
    }
    const data = hydrate()
    data[key].push({ id: `id-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, ...clean })
    writeLS(data)
    return data[key][data[key].length - 1]
  },

  async update(key, id, patch) {
    if (supabaseConfigured && TABLES[key]) {
      const { error } = await supabase.from(TABLES[key]).update(patch).eq('id', id)
      if (error) throw new Error(error.message)
      return { id, ...patch }
    }
    const data = hydrate()
    data[key] = data[key].map((r) => (String(r.id) === String(id) ? { ...r, ...patch } : r))
    writeLS(data)
    return data[key].find((r) => String(r.id) === String(id))
  },

  async remove(key, id) {
    if (supabaseConfigured && TABLES[key]) {
      const { error } = await supabase.from(TABLES[key]).delete().eq('id', id)
      if (error) throw new Error(error.message)
      return true
    }
    const data = hydrate()
    data[key] = data[key].filter((r) => String(r.id) !== String(id))
    writeLS(data)
    return true
  }
}

/* ---------------- settings ---------------- */

export async function getSettings() {
  if (supabaseConfigured) {
    const { data } = await supabase.from('settings').select('*')
    if (data && data.length) {
      const obj = {}
      for (const row of data) obj[row.key] = row.value
      return obj
    }
  }
  return hydrate().settings
}

export async function saveSetting(key, value) {
  if (supabaseConfigured) {
    const { error } = await supabase.from('settings').upsert({ key, value })
    if (error) throw new Error(error.message)
    return
  }
  const data = hydrate()
  data.settings = { ...data.settings, [key]: value }
  writeLS(data)
}

/* ---------------- analytics (lightweight) ---------------- */

export async function trackVisit() {
  if (supabaseConfigured) {
    const { data } = await supabase.from('analytics').select('*').eq('key', 'visits').maybeSingle()
    const next = (data?.value || 0) + 1
    await supabase.from('analytics').upsert({ key: 'visits', value: next })
    return
  }
  const data = hydrate()
  data.analytics.visits = (data.analytics.visits || 0) + 1
  writeLS(data)
}

export async function getAnalytics() {
  if (supabaseConfigured) {
    const { data } = await supabase.from('analytics').select('*')
    const obj = {}
    for (const row of data || []) obj[row.key] = row.value
    return obj
  }
  return hydrate().analytics
}
