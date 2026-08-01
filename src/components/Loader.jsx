import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export default function Loader() {
  const [done, setDone] = useState(false)
  const { pathname } = useLocation()

  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900)
    return () => clearTimeout(t)
  }, [pathname])

  return (
    <div className={`loader ${done ? 'loader--done' : ''}`} aria-hidden={done}>
      <div className="loader-inner">
        <div className="loader-ring" />
        <div className="l-word">Ember &amp; Ivy</div>
        <div className="l-sub">Lakeside · Pokhara</div>
      </div>
    </div>
  )
}
