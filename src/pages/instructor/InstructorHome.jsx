import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import './instructor.css';

const revenueSeries = [820, 940, 1100, 1050, 1240, 1380, 1520, 1480, 1750, 1900, 2100, 2350];
const dayLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function RevenueChart() {
  const max = Math.max(...revenueSeries);
  return (
    <div className="revchart">
      {revenueSeries.map((v, i) => (
        <div key={i} className="revchart__col">
          <div className="revchart__bar" style={{ height: `${(v / max) * 100}%` }} title={`${dayLabels[i]}: ${formatCurrency(v)}`} />
          <span className="revchart__label">{dayLabels[i]}</span>
        </div>
      ))}
    </div>
  );
}

export default function InstructorHome() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourseByInstructor(user.id).then((c) => { setCourses(c); setLoading(false); });
  }, [user.id]);

  const totalStudents = courses.reduce((s, c) => s + c.studentCount, 0);
  const totalRevenue = courses.reduce((s, c) => s + c.studentCount * c.price * 0.7, 0);
  const avgRating = courses.filter((c) => c.rating > 0).length
    ? (courses.reduce((s, c) => s + c.rating, 0) / courses.filter((c) => c.rating > 0).length).toFixed(1)
    : '—';

  const activity = [
    { icon: 'users', text: 'New enrollment in Complete React Developer Bootcamp', time: '2h ago' },
    { icon: 'star', text: 'Priya left a 5-star review on Advanced JavaScript Patterns', time: '5h ago' },
    { icon: 'message', text: 'New question in Data Science with Python', time: '1d ago' },
  ];

  return (
    <div className="page inst">
      <div className="page-head">
        <div>
          <h1 className="page-title">Instructor Dashboard</h1>
          <p className="page-sub">Welcome back, {user.name.split(' ')[0]}. Here's your performance.</p>
        </div>
        <Link to="/instructor/courses/new"><Button><Icon name="plus" size={16} /> Create course</Button></Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => <Skeleton key={i} className="h-24" />)}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total students" value={totalStudents.toLocaleString()} icon={IconFn('users')} tone="brand" />
          <StatCard label="Total courses" value={courses.length} icon={IconFn('grid')} tone="accent" />
          <StatCard label="Total revenue" value={formatCurrency(totalRevenue)} icon={IconFn('dollar')} tone="green" />
          <StatCard label="Average rating" value={avgRating} icon={IconFn('star')} tone="amber" />
        </div>
      )}

      <div className="inst__grid">
        <div className="card inst__panel">
          <h2 className="inst__panel-title">Revenue (last 12 months)</h2>
          {loading ? <Skeleton className="h-52" /> : <RevenueChart />}
        </div>

        <div className="card inst__panel">
          <h2 className="inst__panel-title">Recent activity</h2>
          {loading ? <Skeleton className="h-52" /> : (
            <ul className="inst__activity">
              {activity.map((a, i) => (
                <li key={i}>
                  <span className="inst__activity-icon"><Icon name={a.icon} size={16} /></span>
                  <div>
                    <p className="inst__activity-text">{a.text}</p>
                    <span className="inst__activity-time">{a.time}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="page-head mt-8">
        <div>
          <h2 className="text-lg font-extrabold">Your courses</h2>
          <p className="text-sm text-slate-500">{courses.length} total</p>
        </div>
        <Link to="/instructor/courses" className="text-sm font-semibold text-brand-700">View all →</Link>
      </div>

      <div className="space-y-3">
        {loading ? [0, 1].map((i) => <Skeleton key={i} className="h-20" />) : courses.slice(0, 3).map((c) => (
          <div key={c.id} className="inst-course">
            <img src={c.thumbnail} alt={c.title} />
            <div className="inst-course__body">
              <h3 className="text-sm font-bold">{c.title}</h3>
              <p className="text-xs text-slate-500">{c.studentCount.toLocaleString()} students</p>
            </div>
            <StatusBadge status={c.status} />
            <Link to={`/instructor/courses/${c.id}/edit`}><Button size="sm" variant="secondary"><Icon name="edit" size={14} /> Edit</Button></Link>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = { draft: 'neutral', pending: 'amber', published: 'green' };
  return <Badge tone={map[status] || 'neutral'}>{status === 'pending' ? 'In review' : status}</Badge>;
}

function IconFn(name) {
  return function WrappedIcon({ size }) { return <Icon name={name} size={size} />; };
}