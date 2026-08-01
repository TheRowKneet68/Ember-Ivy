import { useState } from 'react'
import { sendEmail } from '../lib/emailjs.js'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [state, setState] = useState('idle') // idle | sending | done | error

  async function onSubmit(e) {
    e.preventDefault()
    if (!email) return
    setState('sending')
    const res = await sendEmail({
      to_name: 'Ember & Ivy Team',
      subject: 'New newsletter subscriber',
      message_html: `<p>A new subscriber has joined the Ember &amp; Ivy list:</p><p><strong>${email}</strong></p>`
    })
    setState(res.ok || res.demo ? 'done' : 'error')
  }

  if (state === 'done') {
    return (
      <section className="section">
        <div className="container">
          <div className="newsletter">
            <span className="eyebrow" style={{ justifyContent: 'center' }}>Newsletter</span>
            <h3>You’re on the List. ✦</h3>
            <p>Look out for event invites, new menu drops and rooftop nights — straight to your inbox.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="section">
      <div className="container">
        <div className="newsletter">
          <span className="eyebrow" style={{ justifyContent: 'center' }}>Stay in the Loop</span>
          <h3>Join the <em style={{ color: 'var(--gold-soft)' }}>Ember &amp; Ivy</em> List</h3>
          <p>Be the first to hear about live music nights, new menu drops and rooftop events.</p>
          <form className="news-form" onSubmit={onSubmit}>
            <input
              className="input"
              type="email"
              required
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button className="btn btn--primary" disabled={state === 'sending'}>
              {state === 'sending' ? <span className="spinner" /> : 'Subscribe'}
            </button>
          </form>
          {state === 'error' && <p className="form-error">Something went wrong — please try again later.</p>}
        </div>
      </div>
    </section>
  )
}
