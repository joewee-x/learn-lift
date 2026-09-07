import { useEffect, useState } from 'react';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { courses } from '../../data/db';
import { getInstructor, formatCurrency } from '../../utils/helpers';

function BarRow({ label, value, max, color = 'brand' }) {
  const pct = max ? (value / max) * 100 : 0;
  return (
    <div className="bar-row">
      <span className="bar-row__label">{label}</span>
      <div className="bar-row__track"><div className="bar-row__fill" style={{ width: `${pct}%`, background: `var(--color-${color}-500)` }} /></div>
      <span className="bar-row__value">{value}</span>
    </div>
  );
}

export default function AdminReports() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTransactions().then(() => { setLoading(false); });
  }, []);

  const published = courses.filter((c) => c.status === 'published');
  const topCourses = [...published].sort((a, b) => b.studentCount - a.studentCount).slice(0, 5);
  const maxCourse = topCourses[0]?.studentCount || 1;
  const topInstructors = [...new Set(published.map((c) => c.instructorId))]
    .map((id) => ({
      id,
      name: getInstructor(id)?.name,
      revenue: published.filter((c) => c.instructorId === id).reduce((s, c) => s + c.studentCount * c.price * 0.7, 0),
    }))
    .sort((a, b) => b.revenue - a.revenue).slice(0, 5);
  const maxInstr = topInstructors[0]?.revenue || 1;
  const revenueSeries = [3200, 4100, 3800, 5200, 6100, 5800, 7400, 8100, 7600, 9200, 10500, 11800];
  const maxRev = Math.max(...revenueSeries);
  const userGrowth = [80, 110, 140, 175, 210, 260, 305, 360, 420, 480, 560, 640];
  const maxU = Math.max(...userGrowth);

  if (loading) return <div className="page"><Skeleton className="h-20 mt-4" /></div>;

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Reports & analytics</h1>
          <p className="page-sub">Platform performance in depth</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="admin-card-title">Revenue over time</h2>
          <div className="revchart" style={{ height: 200 }}>
            {revenueSeries.map((v, i) => (
              <div key={i} className="revchart__col">
                <div className="revchart__bar" style={{ height: `${(v / maxRev) * 100}%` }} title={formatCurrency(v)} />
                <span className="revchart__label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="admin-card-title">User growth</h2>
          <div className="revchart" style={{ height: 200 }}>
            {userGrowth.map((v, i) => (
              <div key={i} className="revchart__col">
                <div className="revchart__bar revchart__bar--green" style={{ height: `${(v / maxU) * 100}%` }} title={`${v} users`} />
                <span className="revchart__label">{['J','F','M','A','M','J','J','A','S','O','N','D'][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="admin-card-title">Top-performing courses</h2>
          <div className="space-y-4">
            {topCourses.map((c) => (
              <BarRow key={c.id} label={c.title} value={`${c.studentCount.toLocaleString()} students`} max={maxCourse} />
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="admin-card-title">Top instructors by revenue</h2>
          <div className="space-y-4">
            {topInstructors.map((i) => (
              <BarRow key={i.id} label={i.name} value={formatCurrency(i.revenue)} max={maxInstr} color="accent" />
            ))}
          </div>
        </div>
      </div>

      <div className="card p-5 mt-6">
        <h2 className="admin-card-title">Category popularity (enrollments)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            ['Web Development', 54],
            ['Data Science', 22],
            ['Design', 18],
            ['Marketing', 16],
            ['Business', 11],
            ['Photography', 4],
          ].map(([name, pct]) => (
            <div key={name} className="cat-pill">
              <div className="cat-pill__bar" style={{ background: `linear-gradient(90deg, var(--color-brand-500) ${pct * 2}%, #e2e8f0 ${pct * 2}%)` }} />
              <strong className="text-xs">{name}</strong>
              <span className="text-xs text-slate-400">{pct}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}