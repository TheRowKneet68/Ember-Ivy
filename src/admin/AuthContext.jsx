import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, supabaseConfigured } from '../lib/supabase.js'
import { demoSignIn } from '../lib/users.js'

const AuthContext = createContext(null)

async function fetchRole(id) {
  try {
    const { data } = await supabase.from('profiles').select('role').eq('id', id).maybeSingle()
    return data?.role || null
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (supabaseConfigured) {
      supabase.auth.getSession().then(async ({ data }) => {
        const u = data.session?.user || null
        setUser(u)
        setRole(u ? await fetchRole(u.id) : null)
        setLoading(false)
      })
      const { data: sub } = supabase.auth.onAuthStateChange(async (_e, session) => {
        const u = session?.user || null
        setUser(u)
        setRole(u ? await fetchRole(u.id) : null)
        setLoading(false)
      })
      return () => sub?.subscription?.unsubscribe()
    }
    try {
      setUser(sessionStorage.getItem('ei-admin-user') || null)
      setRole(sessionStorage.getItem('ei-admin-role') || null)
    } catch {}
    setLoading(false)
  }, [])

  async function signIn(email, password) {
    if (supabaseConfigured) {
      const { error, data } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)
      setRole(await fetchRole(data.user.id))
      return
    }
    const row = await demoSignIn(email, password)
    try {
      sessionStorage.setItem('ei-admin-user', row.email)
      sessionStorage.setItem('ei-admin-role', row.role)
    } catch {}
    setUser(row.email)
    setRole(row.role)
  }

  async function signOut() {
    if (supabaseConfigured) {
      await supabase.auth.signOut()
    }
    try {
      sessionStorage.removeItem('ei-admin-user')
      sessionStorage.removeItem('ei-admin-role')
    } catch {}
    setUser(null)
    setRole(null)
  }

  const value = { user, role, loading, signIn, signOut, mode: supabaseConfigured ? 'supabase' : 'demo' }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)