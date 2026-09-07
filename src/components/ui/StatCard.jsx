import './statcard.css';

export default function StatCard({ label, value, sub, icon: Icon, tone = 'brand' }) {
  return (
    <div className="statcard">
      {Icon && (
        <div className={`statcard__icon statcard__icon--${tone}`}>
          <Icon size={18} />
        </div>
      )}
      <div className="statcard__info">
        <span className="statcard__label">{label}</span>
        <span className="statcard__value">{value}</span>
        {sub && <span className="statcard__sub">{sub}</span>}
      </div>
    </div>
  );
}