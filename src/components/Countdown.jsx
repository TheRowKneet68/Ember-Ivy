import { useEffect, useState } from 'react'

function diff(target) {
  const now = new Date()
  const t = new Date(target)
  const d = Math.max(0, t - now)
  return {
    days: Math.floor(d / 86400000),
    hours: Math.floor((d % 86400000) / 3600000),
    mins: Math.floor((d % 3600000) / 60000),
    secs: Math.floor((d % 60000) / 1000)
  }
}

export default function Countdown({ target, label }) {
  const [t, setT] = useState(() => diff(target))

  useEffect(() => {
    const id = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(id)
  }, [target])

  const done = t.days + t.hours + t.mins + t.secs === 0

  return (
    <div className="countdown">
      {done ? (
        <div className="cd-box" style={{ minWidth: 200 }}>
          <div className="num" style={{ fontSize: 26 }}>Tonight</div>
          <div className="lbl">{label}</div>
        </div>
      ) : (
        <>
          {Object.entries(t).map(([k, v]) => (
            <div className="cd-box" key={k}>
              <div className="num">{String(v).padStart(2, '0')}</div>
              <div className="lbl">{k}</div>
            </div>
          ))}
        </>
      )}
    </div>
  )
}
