import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import Icon from '../../components/ui/Icon';
import DataTable from '../../components/ui/DataTable';
import Skeleton from '../../components/ui/Skeleton';
import Badge from '../../components/ui/Badge';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

const payoutSeries = [1200, 900, 1500, 1320, 1750, 2100, 1980, 2400, 2600, 2850, 3100, 3400];

export default function Earnings() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getCourseByInstructor(user.id), api.getPayouts()]).then(([c, p]) => {
      setCourses(c);
      setPayouts(p.filter((x) => x.instructorId === user.id));
      setLoading(false);
    });
  }, [user.id]);

  const totalRevenue = courses.reduce((s, c) => s + c.studentCount * c.price * 0.7, 0);
  const pending = payouts.filter((p) => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const max = Math.max(...payoutSeries);

  const columns = [
    { key: 'amount', label: 'Amount', sortable: true, render: (r) => <strong>{formatCurrency(r.amount)}</strong> },
    { key: 'date', label: 'Date', sortable: true, render: (r) => formatDate(r.date) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">Earnings</h1>
          <p className="page-sub">Track your revenue and payouts.</p>
        </div>
        <Button onClick={() => showToast('Payout request submitted (mock)', 'info')}>Request payout</Button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">{[0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />)}</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="Total revenue" value={formatCurrency(totalRevenue)} icon={IconFn('dollar')} tone="green" />
          <StatCard label="Pending payout" value={formatCurrency(pending)} icon={IconFn('clock')} tone="amber" />
          <StatCard label="Sold courses" value={courses.reduce((s, c) => s + c.studentCount, 0).toLocaleString()} icon={IconFn('star')} tone="brand" />
        </div>
      )}

      <div className="card p-5 mt-6">
        <h2 className="text-base font-extrabold mb-4">Revenue over time</h2>
        <div className="revchart" style={{ height: 220 }}>
          {payoutSeries.map((v, i) => (
            <div key={i} className="revchart__col">
              <div className="revchart__bar" style={{ height: `${(v / max) * 100}%` }} title={formatCurrency(v)} />
              <span className="revchart__label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
            </div>
          ))}
        </div>
      </div>

      <h2 className="text-lg font-extrabold mt-8 mb-3">Earnings by course</h2>
      <div className="space-y-2">
        {courses.map((c) => (
          <div key={c.id} className="inst-course">
            <img src={c.thumbnail} alt={c.title} />
            <div className="inst-course__body">
              <h3 className="text-sm font-bold">{c.title}</h3>
              <p className="text-xs text-slate-500">{c.studentCount} sales</p>
            </div>
            <strong className="text-sm">{formatCurrency(c.studentCount * c.price * 0.7)}</strong>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-extrabold mt-8 mb-3">Payout history</h2>
      <DataTable columns={columns} rows={payouts} emptyTitle="No payouts yet" emptyDesc="Your payouts will appear here once you start earning." />
    </div>
  );
}

function StatusBadge({ status }) {
  return <Badge tone={status === 'paid' ? 'green' : 'amber'}>{status}</Badge>;
}

function IconFn(name) {
  return function W({ size }) { return <Icon name={name} size={size} />; };
}