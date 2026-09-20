import { supabase, supabaseConfigured } from './supabase'

// User accounts. With Supabase the roles live in the `profiles` table
// (and account creation/deletion goes through admin-protected RPCs). In
// demo mode users live in localStorage so the whole feature can be tried
// without a backend.

const LS_KEY = 'ei_users_v1'
const DEMO_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@emberandivy.com'
const DEMO_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'ember-admin'

function readLS() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY)) || null
  } catch {
    return null
  }
}

function writeLS(rows) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(rows))
  } catch {}
}

function seed() {
  const existing = readLS()
  if (existing) return existing
  const rows = [{ id: 'u-admin', email: DEMO_EMAIL.toLowerCase(), password: DEMO_PASS, role: 'admin' }]
  writeLS(rows)
  return rows
}

export const ROLES = [
  { value: 'admin', label: 'Admin — full access' },
  { value: 'employee', label: 'Employee — content only' },
  { value: 'client', label: 'Client — own reservations only' }
]

export const users = {
  async list() {
    if (supabaseConfigured) {
      const { data, error } = await supabase.from('profiles').select('id,email,role,created_at').order('created_at', { ascending: true })
      if (error) throw new Error(error.message)
      return data || []
    }
    return seed()
  },

  async create({ email, password, role }) {
    if (!email || !password) throw new Error('An email and password are required.')
    if (supabaseConfigured) {
      const { error } = await supabase.rpc('admin_create_user', { p_email: email, p_password: password, p_role: role })
      if (error) throw new Error(error.message)
      return
    }
    const rows = seed()
    if (rows.some((u) => u.email === email.trim().toLowerCase())) {
      throw new Error('A user with that email already exists.')
    }
    rows.push({ id: `u-${Date.now()}`, email: email.trim().toLowerCase(), password, role })
    writeLS(rows)
  },

  async setRole(id, role) {
    if (supabaseConfigured) {
      const { error } = await supabase.rpc('admin_set_role', { p_user_id: id, p_role: role })
      if (error) throw new Error(error.message)
      return
    }
    writeLS(seed().map((u) => (u.id === id ? { ...u, role } : u)))
  },

  async remove(id) {
    if (supabaseConfigured) {
      const { error } = await supabase.rpc('admin_delete_user', { p_user_id: id })
      if (error) throw new Error(error.message)
      return
    }
    writeLS(seed().filter((u) => u.id !== id))
  }
}

export async function demoSignIn(email, password) {
  const row = seed().find((u) => u.email === email.trim().toLowerCase() && u.password === password)
  if (!row) throw new Error('That email or password is not recognised.')
  return row
}