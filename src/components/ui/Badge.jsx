import './badge.css';

const tones = {
  brand: 'badge--brand',
  accent: 'badge--accent',
  green: 'badge--green',
  amber: 'badge--amber',
  red: 'badge--red',
  neutral: 'badge--neutral',
};

export default function Badge({ tone = 'neutral', children, className = '' }) {
  return <span className={`badge ${tones[tone]} ${className}`}>{children}</span>;
}
