import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Tabs from '../../components/ui/Tabs';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getCourse, formatDate } from '../../utils/helpers';
import './mylearning.css';

export default function MyLearning() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getEnrollments(user.id).then((enr) => {
      setEnrollments(enr.map((e) => ({ ...e, course: getCourse(e.courseId) })).filter((e) => e.course));
      setLoading(false);
    });
  }, [user.id]);

  const filtered = enrollments.filter((e) =>
    tab === 'all' ? true : tab === 'inprogress' ? e.progress > 0 && e.progress < 100 : e.progress === 100,
  );

  return (
    <div className="page">
      <h1 className="page-title">My Learning</h1>
      <p className="page-sub">All of your enrolled courses in one place.</p>

      <div className="mt-6">
        <Tabs
          tabs={[
            { value: 'all', label: 'All', count: enrollments.length },
            { value: 'inprogress', label: 'In Progress', count: enrollments.filter((e) => e.progress > 0 && e.progress < 100).length },
            { value: 'completed', label: 'Completed', count: enrollments.filter((e) => e.progress === 100).length },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="ml-grid">
            {[0, 1, 2].map((i) => <Skeleton key={i} className="h-56" />)}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="🎓"
            title={tab === 'completed' ? 'No completed courses yet' : 'You haven\'t enrolled in any courses yet'}
            description={tab === 'completed' ? 'Complete a course to earn your certificate.' : 'Browse the catalog and start your learning journey.'}
            action={<Link to="/courses"><Button>Browse courses</Button></Link>}
          />
        ) : (
          <div className="ml-grid">
            {filtered.map((e) => (
              <div key={e.id} className="ml-card">
                <Link to={`/learn/${e.courseId}`} className="ml-card__media">
                  <img src={e.course.thumbnail} alt={e.course.title} />
                </Link>
                <div className="ml-card__body">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="ml-card__title"><Link to={`/learn/${e.courseId}`}>{e.course.title}</Link></h3>
                    {e.progress === 100 && <Badge tone="green">Completed</Badge>}
                  </div>
                  <p className="ml-card__enrolled">Enrolled {formatDate(e.enrolledAt)}</p>
                  <div className="ml-card__progress">
                    <ProgressBar value={e.progress} showLabel />
                  </div>
                  <div className="ml-card__actions">
                    <Link to={`/learn/${e.courseId}`}>
                      <Button size="sm" variant={e.progress === 100 ? 'secondary' : 'primary'}>
                        {e.progress === 100 ? 'Review course' : 'Resume'}
                      </Button>
                    </Link>
                    {e.progress === 100 && (
                      <Link to="/certificates"><Button size="sm" variant="ghost">Certificate</Button></Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}