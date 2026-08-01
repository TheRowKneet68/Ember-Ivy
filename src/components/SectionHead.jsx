import Reveal from './Reveal.jsx'

export default function SectionHead({ eyebrow, title, sub, align = 'center' }) {
  return (
    <Reveal className={`section-head ${align === 'left' ? 'section-head--left' : ''}`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />
      {sub && <p className="section-sub">{sub}</p>}
    </Reveal>
  )
}
