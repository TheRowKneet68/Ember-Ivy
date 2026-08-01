export default function Stars({ rating = 5, size = 15 }) {
  return (
    <span className="stars" aria-label={`${rating} out of 5 stars`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(rating) ? '' : 'star--off'}>
          ★
        </span>
      ))}
    </span>
  )
}
