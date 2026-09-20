import { Link } from 'react-router-dom'
import Icon from './Icons.jsx'
import { SITE, OPENING_HOURS } from '../data/seed.js'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="f-about">
            <Link to="/" className="nav-logo">
              <span className="monogram">E&I</span>
              <span className="wordmark" style={{ color: '#fff' }}>
                Ember &amp; Ivy
                <small>Lakeside · Pokhara</small>
              </span>
            </Link>
            <p>
              A premium café, restaurant, cocktail lounge and live music venue on the shores of
              Lake Phewa. Handcrafted coffee by day, signature cuisine and unforgettable evenings
              by night.
            </p>
            <div className="f-social">
              <a className="icon-btn" href={SITE.social.instagram} target="_blank" rel="noreferrer" aria-label="Instagram">
                <Icon name="instagram" size={18} />
              </a>
              <a className="icon-btn" href={SITE.social.facebook} target="_blank" rel="noreferrer" aria-label="Facebook">
                <Icon name="facebook" size={18} />
              </a>
              <a className="icon-btn" href={SITE.social.tiktok} target="_blank" rel="noreferrer" aria-label="TikTok">
                <Icon name="tiktok" size={18} />
              </a>
            </div>
          </div>

          <div>
            <h5>Explore</h5>
            <ul className="f-links">
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/gallery">Gallery</Link></li>
              <li><Link to="/events">Live Music &amp; Events</Link></li>
              <li><Link to="/reservation">Reservations</Link></li>
              <li><Link to="/contact">Contact &amp; Directions</Link></li>
              <li><Link to="/admin">Admin Panel</Link></li>
            </ul>
          </div>

          <div>
            <h5>Contact</h5>
            <ul className="f-contact">
              <li>
                <span className="fc-icon"><Icon name="pin" size={17} /></span>
                <span>Lakeside Road, Pokhara, Nepal</span>
              </li>
              <li>
                <span className="fc-icon"><Icon name="phone" size={17} /></span>
                <a href={`tel:${SITE.phoneRaw}`}>{SITE.phone}</a>
              </li>
              <li>
                <span className="fc-icon"><Icon name="mail" size={17} /></span>
                <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
              </li>
              <li>
                <span className="fc-icon"><Icon name="clock" size={17} /></span>
                <span>{SITE.hours.label} · {SITE.hours.open} – {SITE.hours.close}</span>
              </li>
            </ul>
          </div>

          <div>
            <h5>Hours</h5>
            <ul className="footer-hours">
              {OPENING_HOURS.map((h) => (
                <li key={h.day}>
                  <span className="fl">{h.day}</span>
                  <span className="fr">{h.hours}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} {SITE.name}. All rights reserved.</span>
          <span>
            Made with <span className="heart">✦</span> in Pokhara
            {SITE.watermark && <span> · {SITE.watermark}</span>}
          </span>
        </div>
      </div>
    </footer>
  )
}
