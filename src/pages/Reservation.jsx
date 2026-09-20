import { useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icons.jsx'
import Reveal from '../components/Reveal.jsx'
import { store } from '../lib/store.js'
import { sendEmail } from '../lib/emailjs.js'
import { escapeHtml } from '../lib/escape.js'
import { SITE } from '../data/seed.js'

const OCCASIONS = ['Just dinner', 'Date night', 'Birthday', 'Anniversary', 'Private event', 'Corporate dinner', 'Celebration']
const TIME_SLOTS = [
  '7:00 AM', '8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM', '6:00 PM',
  '7:00 PM', '8:00 PM', '9:00 PM', '10:00 PM', '11:00 PM', '12:00 AM'
]

const today = new Date().toISOString().split('T')[0]

export default function Reservation() {
  const [form, setForm] = useState({
    name: '', phone: '', email: '', guests: 2, date: '', time: '8:00 PM',
    occasion: 'Just dinner', message: ''
  })
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(null)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e) {
    e.preventDefault()
    setError('')
    setSending(true)
    try {
      const reservation = await store.insert('reservations', { ...form, status: 'pending' })
      await sendEmail({
        to_name: form.name,
        subject: `Reservation received — ${form.date} at ${form.time}`,
        message_html: `<p>Dear <strong>${escapeHtml(form.name)}</strong>,</p><p>Thank you for reserving at Ember &amp; Ivy.</p>
          <p><strong>Guests:</strong> ${escapeHtml(form.guests)}<br/><strong>When:</strong> ${escapeHtml(form.date)} at ${escapeHtml(form.time)}<br/><strong>Occasion:</strong> ${escapeHtml(form.occasion)}</p>
          <p>We'll confirm by phone or email shortly. See you in Lakeside!</p>`
      })
      setDone({ ...form, id: reservation.id })
      window.scrollTo({ top: 0, behavior: 'smooth' })
    } catch (err) {
      setError('Could not save your reservation. Please try again or call us directly.')
    } finally {
      setSending(false)
    }
  }

  return (
    <>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb"><Link to="/">Home</Link> / Reservation</div>
          <span className="eyebrow">Reservations</span>
          <h1>Reserve Your <em>Table</em></h1>
          <p>Weekend tables go fast. Book ahead and we’ll have everything ready when you arrive.</p>
        </div>
      </section>

      <section className="section" style={{ paddingTop: 60 }}>
        <div className="container">
          <div style={{ maxWidth: 820, margin: '0 auto' }}>
            {done ? (
              <Reveal>
                <div className="form-success">
                  <div className="fs-icon"><Icon name="check" size={34} /></div>
                  <h3>Thank you, {done.name.split(' ')[0]} — you’re booked.</h3>
                  <p>
                    {done.guests} guest{done.guests > 1 ? 's' : ''} · {done.date} at {done.time} · {done.occasion}.
                    <br />
                    We’ll confirm shortly by phone or email.
                  </p>
                  <div style={{ marginTop: 28, display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Link to="/menu" className="btn btn--primary">Browse the Menu</Link>
                    <Link to="/" className="btn btn--dark">Back Home</Link>
                  </div>
                </div>
              </Reveal>
            ) : (
              <Reveal>
                <form className="glass" style={{ padding: 'clamp(28px, 4vw, 52px)' }} onSubmit={onSubmit}>
                  <div className="form-grid">
                    <div className="field">
                      <label className="label" htmlFor="r-name">Full Name <span className="required">*</span></label>
                      <input id="r-name" className="input" required placeholder="e.g. Priya Sharma" value={form.name} onChange={set('name')} />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="r-phone">Phone <span className="required">*</span></label>
                      <input id="r-phone" className="input" required type="tel" placeholder="98XXXXXXXX" value={form.phone} onChange={set('phone')} />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="r-email">Email</label>
                      <input id="r-email" className="input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="r-guests">Guests</label>
                      <select id="r-guests" className="select" value={form.guests} onChange={set('guests')}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 20].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="r-date">Date <span className="required">*</span></label>
                      <input id="r-date" className="input" required type="date" min={today} value={form.date} onChange={set('date')} />
                    </div>
                    <div className="field">
                      <label className="label" htmlFor="r-time">Time <span className="required">*</span></label>
                      <select id="r-time" className="select" required value={form.time} onChange={set('time')}>
                        {TIME_SLOTS.map((t) => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                    <div className="field field--full">
                      <label className="label" htmlFor="r-occasion">Special Occasion</label>
                      <select id="r-occasion" className="select" value={form.occasion} onChange={set('occasion')}>
                        {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="field field--full">
                      <label className="label" htmlFor="r-msg">Message to the Team</label>
                      <textarea id="r-msg" className="textarea" placeholder="Allergies, seating preferences, a cake, decorations, anything we should know…" value={form.message} onChange={set('message')} />
                    </div>
                  </div>

                  {error && <p className="form-error">{error}</p>}

                  <div style={{ marginTop: 26, display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                    <button className="btn btn--primary btn--lg" disabled={sending}>
                      {sending ? <span className="spinner" /> : <><Icon name="calendar" size={16} /> Confirm Reservation</>}
                    </button>
                    <span className="form-note">
                      Prefer to talk? Call us at <a href={`tel:${SITE.phoneRaw}`} style={{ color: 'var(--gold)' }}>{SITE.phone}</a>
                    </span>
                  </div>
                </form>
              </Reveal>
            )}

            <Reveal delay={0.1}>
              <div className="info-grid" style={{ marginTop: 28 }}>
                <div className="info-card">
                  <div className="i-icon"><Icon name="clock" size={20} /></div>
                  <h4>Hours</h4>
                  <p>Open daily<br />7:00 AM – 1:00 AM</p>
                </div>
                <div className="info-card">
                  <div className="i-icon"><Icon name="users" size={20} /></div>
                  <h4>Groups &amp; Events</h4>
                  <p>Private dining and corporate bookings — message us for the full menu.</p>
                </div>
                <div className="info-card">
                  <div className="i-icon"><Icon name="sparkle" size={20} /></div>
                  <h4>Birthdays</h4>
                  <p>Cake, candles and a table ready. Tell us the occasion and we’ll handle the rest.</p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
