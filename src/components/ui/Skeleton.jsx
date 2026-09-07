import './skeleton.css';

export default function Skeleton({ className = '', variant = 'text' }) {
  return <div className={`skel skel--${variant} ${className}`} aria-hidden="true" />;
}

export function SkeletonCard() {
  return (
    <div className="skel-card">
      <Skeleton variant="media" />
      <div className="skel-card__body">
        <Skeleton />
        <Skeleton className="w-3/4" />
        <Skeleton variant="short" />
        <Skeleton variant="short" className="w-1/3" />
      </div>
    </div>
  );
}