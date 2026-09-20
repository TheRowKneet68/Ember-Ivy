import { createContext, useContext, useEffect, useState } from 'react'
import { getSettings } from '../lib/store.js'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('ei-theme') || 'dark'
    } catch {
      return 'dark'
    }
  })

  useEffect(() => {
    document.documentElement.classList.toggle('light', theme === 'light')
    try {
      localStorage.setItem('ei-theme', theme)
    } catch {}
  }, [theme])

  useEffect(() => {
    let hasPref = false
    try {
      hasPref = Boolean(localStorage.getItem('ei-theme'))
    } catch {}
    if (hasPref) return
    getSettings().then((s) => {
      if (s && s.defaultTheme) {
        document.documentElement.classList.toggle('light', s.defaultTheme === 'light')
      }
    }).catch(() => {})
  }, [])

  const toggle = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))

  return <ThemeContext.Provider value={{ theme, toggle }}>{children}</ThemeContext.Provider>
}

export const useTheme = () => useContext(ThemeContext)
