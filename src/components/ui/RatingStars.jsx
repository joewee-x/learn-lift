export default function RatingStars({ rating, count, size = 14 }) {
  const stars = [];
  const rounded = Math.round(rating);
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" style={{ opacity: 1 }}>
        <path
          d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z"
          fill={i <= rounded ? '#f59e0b' : '#e2e8f0'}
        />
      </svg>,
    );
  }
  return (
    <span className="inline-flex items-center gap-0.5">
      <span className="inline-flex items-center gap-px">{stars}</span>
      {rating > 0 && <span className="ml-1 text-sm font-semibold text-slate-800">{rating.toFixed(1)}</span>}
      {count !== undefined && count > 0 && <span className="text-xs text-slate-500">({count.toLocaleString()})</span>}
    </span>
  );
}
