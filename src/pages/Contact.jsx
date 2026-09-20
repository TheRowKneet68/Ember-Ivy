import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icons.jsx'
import Reveal from '../components/Reveal.jsx'
import { sendEmail } from '../lib/emailjs.js'
import { escapeHtml } from '../lib/escape.js'
import { SITE, OPENING_HOURS } from '../data/seed.js'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [state, setState] = useState('idle')
  const [error, setError] = useState('')

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setState('sending')
    const res = await sendEmail({
      to_name: 'Ember & Ivy Team',
      subject: `Message from ${form.name}: ${form.subject || 'General'}`,
      message_html: `<p><strong>From:</strong> ${escapeHtml(form.name)} (${escapeHtml(form.email)})</p><p><strong>Subject:</strong> ${escapeHtml(form.subject || 'General')}</p><p>${escapeHtml(form.message)}</p>`
    })
    if (res.ok || res.demo) setState('done')
    else {
      setState('idle')
      setError('Could not send your message. Please email us directly.')
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / Contact</div>
          <span className="eyebrow">Find Us</span>
          <h1>Come Say <em>Hello</em></h1>
          <p>On the shore of Lake Phewa — a short walk from the Lakeside strip, worth the stroll.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <Reveal>
            <div className="map-wrap">
              <iframe
                src={SITE.mapEmbed}
                title="Ember & Ivy — Lakeside, Pokhara"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </Reveal>

          <div className="info-grid" style={{ marginTop: 28 }}>
            <div className="info-card">
              <div className="i-icon"><Icon name="pin" size={20} /></div>
              <h4>Location</h4>
              <p>
                Lakeside Road, Pokhara 33700<br />
                <a href={SITE.mapLink} target="_blank" rel="noreferrer">Get directions ↗</a>
              </p>
            </div>
            <div className="info-card">
              <div className="i-icon"><Icon name="phone" size={20} /></div>
              <h4>Phone / WhatsApp</h4>
              <p><a href={`tel:${SITE.phoneRaw}`}>{SITE.phone}</a></p>
            </div>
            <div className="info-card">
              <div className="i-icon"><Icon name="mail" size={20} /></div>
              <h4>Email</h4>
              <p><a href={`mailto:${SITE.email}`}>{SITE.email}</a></p>
            </div>
            <div className="info-card">
              <div className="i-icon"><Icon name="clock" size={20} /></div>
              <h4>Opening Hours</h4>
              <ul style={{ color: 'var(--muted)', fontSize: 14.5 }}>
                {OPENING_HOURS.map((h) => (
                  <li key={h.day} style={{ marginBottom: 4 }}>
                    <span style={{ color: 'var(--text-dim)' }}>{h.day}</span> — {h.hours}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="split" style={{ marginTop: 76, gridTemplateColumns: '1fr 1fr', alignItems: 'start' }}>
            <Reveal>
              <div>
                <span className="eyebrow">Message Us</span>
                <h3 style={{ fontSize: 'clamp(28px, 4vw, 40px)', margin: '16px 0 10px' }}>We’d Love to <em>Hear</em> From You</h3>
                <p style={{ color: 'var(--muted)' }}>
                  Questions, group bookings, press, or ideas for a night at Ember &amp; Ivy — drop us a line.
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 26 }}>
                  <a className="icon-btn" href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                    <Icon name="instagram" size={19} />
                  </a>
                  <a className="icon-btn" href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                    <Icon name="facebook" size={19} />
                  </a>
                  <a className="icon-btn" href={SITE.social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
                    <Icon name="tiktok" size={19} />
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              {state === 'done' ? (
                <div className="form-success">
                  <div className="fs-icon"><Icon name="check" size={34} /></div>
                  <h3>Message sent.</h3>
                  <p>Thanks for writing — we’ll get back to you within the day.</p>
                </div>
              ) : (
                <form className="glass" style={{ padding: 34 }} onSubmit={onSubmit}>
                  <div className="form-grid">
                    <div className="field">
                      <label className="label" htmlFor="c-name">Name <span className="required">*</span></label>
                      <input id="c-name" className="input" required placeholder="Your name" value={form.name} onChange={set('name')} />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="c-email">Email <span className="required">*</span></label>
                      <input id="c-email" className="input" required type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
                    </div>
                    <div className="field field--full">
                      <label className="label" htmlFor="c-subject">Subject</label>
                      <input id="c-subject" className="input" placeholder="Group booking, press, question…" value={form.subject} onChange={set('subject')} />
                    </div>
                    <div className="field field--full">
                      <label className="label" htmlFor="c-msg">Message <span className="required">*</span></label>
                      <textarea id="c-msg" className="textarea" required placeholder="Tell us everything…" value={form.message} onChange={set('message')} />
                    </div>
                  </div>
                  {error && <p className="form-error">{error}</p>}
                  <div style={{ marginTop: 20 }}>
                    <button className="btn btn--primary" disabled={state === 'sending'}>
                      {state === 'sending' ? <span className="spinner" /> : 'Send Message'}
                    </button>
                  </div>
                </form>
              )}
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
