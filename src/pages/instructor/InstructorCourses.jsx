import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import Tabs from '../../components/ui/Tabs';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate, formatCurrency } from '../../utils/helpers';

const statusMap = {
  draft: { label: 'Draft', tone: 'neutral' },
  pending: { label: 'In review', tone: 'amber' },
  published: { label: 'Published', tone: 'green' },
};

export default function InstructorCourses() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourseByInstructor(user.id).then((c) => { setCourses(c); setLoading(false); });
  }, [user.id]);

  const filtered = courses.filter((c) => (tab === 'all' ? true : c.status === tab));

  const unpublish = async (c) => {
    await api.setCourseStatus(c.id, 'draft');
    setCourses((list) => list.map((x) => (x.id === c.id ? { ...x, status: 'draft' } : x)));
    showToast('Course unpublished');
  };

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <h1 className="page-title">My courses</h1>
          <p className="page-sub">Create, edit, and manage your course catalog.</p>
        </div>
        <Link to="/instructor/courses/new"><Button><Icon name="plus" size={16} /> New course</Button></Link>
      </div>

      <Tabs
        tabs={[
          { value: 'all', label: 'All', count: courses.length },
          { value: 'draft', label: 'Draft', count: courses.filter((c) => c.status === 'draft').length },
          { value: 'pending', label: 'In review', count: courses.filter((c) => c.status === 'pending').length },
          { value: 'published', label: 'Published', count: courses.filter((c) => c.status === 'published').length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-6">
        {loading ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />) :
          filtered.length === 0 ? (
            <EmptyState
              icon="🎬"
              title="No courses here"
              description="Create a new course to get started sharing your knowledge."
              action={<Link to="/instructor/courses/new"><Button>Create a course</Button></Link>}
            />
          ) : (
            <div className="space-y-3">
              {filtered.map((c) => {
                const st = statusMap[c.status];
                const revenue = c.studentCount * c.price * 0.7;
                return (
                  <div key={c.id} className="inst-course">
                    <Link to={`/instructor/courses/${c.id}/edit`} className="inst-course__link-img">
                      <img src={c.thumbnail} alt={c.title} />
                    </Link>
                    <div className="inst-course__body">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-bold">{c.title}</h3>
                        <Badge tone={st.tone}>{st.label}</Badge>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">
                        {c.studentCount.toLocaleString()} students · {c.rating > 0 ? `${c.rating.toFixed(1)}★` : 'No ratings'} · {formatCurrency(revenue)}
                      </p>
                      <p className="text-xs text-slate-400">Updated {formatDate(c.updatedAt)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to={`/instructor/courses/${c.id}/edit`}><Button size="sm" variant="secondary"><Icon name="edit" size={14} /> Edit</Button></Link>
                      {c.status === 'published' && (
                        <Button size="sm" variant="ghost" onClick={() => unpublish(c)}>Unpublish</Button>
                      )}
                      {c.status === 'pending' && <Button size="sm" variant="ghost" disabled title="Waiting for admin review">Under review</Button>}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </div>
    </div>
  );
}