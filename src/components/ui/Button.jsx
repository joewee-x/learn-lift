import './button.css';

const variants = {
  primary: 'btn--primary',
  secondary: 'btn--secondary',
  ghost: 'btn--ghost',
  destructive: 'btn--destructive',
  link: 'btn--link',
};

const sizes = {
  sm: 'btn--sm',
  md: 'btn--md',
  lg: 'btn--lg',
};

export default function Button({
  variant = 'primary', size = 'md', className = '', children,
  loading, disabled, ...props
}) {
  const classes = ['btn', variants[variant], sizes[size], loading ? 'btn--loading' : '', className].filter(Boolean).join(' ');
  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading ? <span className="btn__spinner" aria-hidden="true" /> : children}
      {loading && <span className="sr-only">Loading</span>}
    </button>
  );
}
