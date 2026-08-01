import { useEffect } from 'react'
import Icon from './Icons.jsx'

export default function Lightbox({ items, index, onClose, onNavigate }) {
  const item = items[index]

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNavigate((index + 1) % items.length)
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + items.length) % items.length)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [index, items.length, onClose, onNavigate])

  return (
    <div className="lightbox" onClick={onClose}>
      <button className="lb-close" onClick={onClose} aria-label="Close">
        <Icon name="close" size={22} />
      </button>
      <button
        className="lb-nav lb-nav--prev"
        onClick={(e) => {
          e.stopPropagation()
          onNavigate((index - 1 + items.length) % items.length)
        }}
        aria-label="Previous"
      >
        ‹
      </button>
      <img src={item?.src} alt={item?.title} onClick={(e) => e.stopPropagation()} />
      <button
        className="lb-nav lb-nav--next"
        onClick={(e) => {
          e.stopPropagation()
          onNavigate((index + 1) % items.length)
        }}
        aria-label="Next"
      >
        ›
      </button>
      <div className="lb-caption">{item?.title}</div>
    </div>
  )
}
