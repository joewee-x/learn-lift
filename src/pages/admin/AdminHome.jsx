import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import Icon from '../../components/ui/Icon';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { courses, users, transactions, flaggedContent } from '../../data/db';
import { formatCurrency } from '../../utils/helpers';
import './admin.css';

const growth = [120, 155, 180, 210, 260, 300, 355, 400, 470, 520, 610, 680];

export default function AdminHome() {
  const [loading, setLoading] = useState(true);
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    Promise.all([api.getCourses({ status: 'pending' })]).then(([p]) => {
      setPendingCount(p.length);
      setLoading(false);
    });
  }, []);

  const totalRevenue = transactions.filter((t) => t.status === 'paid').reduce((s, t) => s + t.amount, 0);
  const openFlags = flaggedContent.filter((f) => f.status === 'open').length;
  const max = Math.max(...growth);

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Platform Overview</h1>
          <p className="page-sub">LearnHub at a glance</p>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">{[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <div className="admin-stats">
          <StatCard label="Total users" value={users.length.toLocaleString()} icon={IconFn('users')} tone="brand" />
          <StatCard label="Total courses" value={courses.filter((c) => c.status === 'published').length.toLocaleString()} icon={IconFn('grid')} tone="accent" />
          <StatCard label="Total revenue" value={formatCurrency(totalRevenue)} icon={IconFn('dollar')} tone="green" />
          <StatCard label="Active enrollments" value={(12400).toLocaleString()} icon={IconFn('play')} tone="amber" />
        </div>
      )}

      <div className="admin-grid">
        <div className="card p-5">
          <h2 className="admin-card-title">Growth (users)</h2>
          <div className="revchart" style={{ height: 190 }}>
            {growth.map((v, i) => (
              <div key={i} className="revchart__col">
                <div className="revchart__bar" style={{ height: `${(v / max) * 100}%` }} title={v.toString()} />
                <span className="revchart__label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="admin-card-title">Needs attention</h2>
          <ul className="admin-attn">
            <li>
              <Link to="/admin/courses">
                <span className="admin-attn__icon admin-attn__icon--amber"><Icon name="grid" size={16} /></span>
                <div><strong>{pendingCount} courses</strong><span>Pending approval</span></div>
                <Icon name="chevronRight" size={16} className="admin-attn__arrow" />
              </Link>
            </li>
            <li>
              <Link to="/admin/support">
                <span className="admin-attn__icon admin-attn__icon--red"><Icon name="bell" size={16} /></span>
                <div><strong>{openFlags} flagged items</strong><span>Reviews & Q&A reported</span></div>
                <Icon name="chevronRight" size={16} className="admin-attn__arrow" />
              </Link>
            </li>
            <li>
              <Link to="/admin/payments">
                <span className="admin-attn__icon admin-attn__icon--brand"><Icon name="dollar" size={16} /></span>
                <div><strong>2 pending payouts</strong><span>Awaiting payment</span></div>
                <Icon name="chevronRight" size={16} className="admin-attn__arrow" />
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export function IconFn(name) {
  return function W({ size = 18 }) { return <Icon name={name} size={size} />; };
}