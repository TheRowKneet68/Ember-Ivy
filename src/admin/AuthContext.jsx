import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase.js'

const AuthContext = createContext(null)

const DEMO_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@emberandivy.com'
const DEMO_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'ember-admin'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (supabaseConfigured) {
      supabase.auth.getSession().then(({ data }) => {
        setUser(data.session?.user || null)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
        setUser(session?.user || null)
        setLoading(false)
      })
      return () => sub?.subscription?.unsubscribe()
    }
    try {
      setUser(sessionStorage.getItem('ei-admin-user') || null)
    } catch {}
    setLoading(false)
  }, [])

  async function signIn(email, password) {
    if (supabaseConfigured) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      return
    }
    if (email.trim().toLowerCase() === DEMO_EMAIL.toLowerCase() && password === DEMO_PASS) {
      try {
        sessionStorage.setItem('ei-admin-user', email)
      } catch {}
      setUser(email)
      return
    }
    throw new Error('Invalid admin credentials.')
  }

  async function signOut() {
    if (supabaseConfigured) {
      await supabase.auth.signOut()
    }
    try {
      sessionStorage.removeItem('ei-admin-user')
    } catch {}
    setUser(null)
  }

  const value = { user, loading, signIn, signOut, mode: supabaseConfigured ? 'supabase' : 'demo' }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
