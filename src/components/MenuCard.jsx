import Stars from './Stars.jsx'

const BADGES = [
  { cond: (i) => i.popular, cls: 'badge--pop', label: 'Popular' },
  { cond: (i) => i.chef, cls: 'badge--chef', label: 'Chef’s Pick' },
  { cond: (i) => i.seasonal, cls: 'badge--seasonal', label: 'Seasonal' }
]

export default function MenuCard({ item }) {
  return (
    <article className="menu-card">
      <div className="m-media">
        <img src={item.image} alt={item.name} loading="lazy" />
        <div className="m-card-badges">
          {BADGES.filter((b) => b.cond(item)).map((b) => (
            <span key={b.label} className={`badge ${b.cls}`}>{b.label}</span>
          ))}
          <span className={`badge ${item.veg ? 'badge--veg' : 'badge--nonveg'}`}>
            {item.veg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>
      </div>
      <div className="m-card-body">
        <div className="m-card-top">
          <h4>{item.name}</h4>
          <span className="m-price">
            <small>Rs </small>
            {Number(item.price).toLocaleString()}
          </span>
        </div>
        <p>{item.desc}</p>
        <div className="m-card-foot">
          <Stars rating={Number(item.rating) || 5} />
          <span className="m-veg">{item.veg ? 'Vegetarian' : 'Non-Vegetarian'}</span>
        </div>
      </div>
    </article>
  )
}
