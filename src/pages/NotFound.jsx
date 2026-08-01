import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <section className="section" style={{ minHeight: '70vh', display: 'grid', placeItems: 'center' }}>
      <div className="container center">
        <h1 style={{ fontSize: 96, fontFamily: 'var(--font-head)', color: 'var(--gold-soft)' }}>404</h1>
        <h2 style={{ fontSize: 'clamp(26px, 4vw, 40px)', margin: '12px 0' }}>This Table’s Already Taken.</h2>
        <p style={{ color: 'var(--muted)', maxWidth: 440, margin: '0 auto 28px' }}>
          The page you’re looking for has left for the evening. Let’s get you back somewhere warm.
        </p>
        <Link to="/" className="btn btn--primary btn--lg">Back to Home</Link>
      </div>
    </section>
  )
}
