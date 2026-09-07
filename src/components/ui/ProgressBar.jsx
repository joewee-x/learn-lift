import './progressbar.css';

export default function ProgressBar({ value, className = '', showLabel = false }) {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`pb ${className}`}>
      <div className="pb__track" role="progressbar" aria-valuenow={clamped} aria-valuemin={0} aria-valuemax={100}>
        <div className="pb__fill" style={{ width: `${clamped}%` }} />
      </div>
      {showLabel && <span className="pb__label">{clamped}%</span>}
    </div>
  );
}
