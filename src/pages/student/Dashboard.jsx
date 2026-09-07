import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CourseCard from '../../components/CourseCard';
import ProgressBar from '../../components/ui/ProgressBar';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getCourse } from '../../utils/helpers';
import './dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getEnrollments(user.id), api.getPublishedCourses()]).then(([enr, all]) => {
      const withCourses = enr
        .map((e) => ({ ...e, course: getCourse(e.courseId) }))
        .filter((e) => e.course);
      setEnrollments(withCourses);
      const enrolledIds = new Set(enr.map((e) => e.courseId));
      setRecommended(all.filter((c) => !enrolledIds.has(c.id)).slice(0, 4));
      setLoading(false);
    });
  }, [user.id]);

  const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100);
  const continueCourse = inProgress[0];

  const deadlines = [
    { id: 1, title: 'Build a Component — assignment due', date: 'Sep 20' },
    { id: 2, title: 'JavaScript Basics Quiz', date: 'Sep 22' },
  ];

  return (
    <div className="page dash">
      <h1 className="page-title">Hi, {user.name.split(' ')[0]} 👋</h1>
      <p className="page-sub">Here's what's happening with your learning.</p>

      {loading ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <Skeleton className="h-48 lg:col-span-2" />
          <Skeleton className="h-48" />
        </div>
      ) : (
        <div className="dash__grid">
          <div className="dash__continue">
            {continueCourse ? (
              <div className="dash__continue-card">
                <div className="dash__continue-media">
                  <img src={continueCourse.course.thumbnail} alt={continueCourse.course.title} />
                </div>
                <div className="dash__continue-body">
                  <span className="dash__label">Continue learning</span>
                  <h2 className="dash__continue-title">{continueCourse.course.title}</h2>
                  <p className="dash__continue-sub">Next: React Fundamentals Quiz</p>
                  <div className="flex items-center gap-3 mt-3">
                    <ProgressBar value={continueCourse.progress} className="flex-1" showLabel />
                  </div>
                  <div className="mt-4">
                    <Link to={`/learn/${continueCourse.courseId}`}><Button>Resume</Button></Link>
                  </div>
                </div>
              </div>
            ) : (
              <div className="dash__panel">
                <EmptyState
                  icon="🚀"
                  title="Ready to start learning?"
                  description="Enroll in a course and it will show up here."
                  action={<Link to="/courses"><Button>Explore courses</Button></Link>}
                />
              </div>
            )}

            <h2 className="section-title sm">Your courses</h2>
            <div className="dash__courses">
              {enrollments.length === 0 ? (
                <EmptyState icon="📚" title="No enrollments yet" description="Find a course and start learning today." />
              ) : (
                enrollments.slice(0, 3).map((e) => (
                  <Link key={e.id} to={`/learn/${e.courseId}`} className="dash__course">
                    <img src={e.course.thumbnail} alt="" />
                    <div className="dash__course-body">
                      <span className="dash__course-title">{e.course.title}</span>
                      <div className="flex items-center gap-3">
                        <ProgressBar value={e.progress} className="flex-1" />
                        <span className="text-xs font-bold text-slate-600">{e.progress}%</span>
                      </div>
                    </div>
                  </Link>
                ))
              )}
              {enrollments.length > 3 && (
                <Link to="/my-learning" className="text-sm font-semibold text-brand-700">View all →</Link>
              )}
            </div>
          </div>

          <div className="dash__side">
            <div className="dash__panel">
              <h2 className="dash__panel-title">Upcoming deadlines</h2>
              {deadlines.length === 0 ? (
                <p className="text-sm text-slate-500">Nothing due soon. Enjoy the free time!</p>
              ) : (
                <ul className="dash__deadlines">
                  {deadlines.map((d) => (
                    <li key={d.id}>
                      <div className="dash__deadline-date">{d.date}</div>
                      <div className="dash__deadline-info">
                        <span className="dash__deadline-title">{d.title.split(' — ')[0]}</span>
                        <span className="text-xs text-slate-400">{d.title.split(' — ')[1]}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="dash__panel">
              <h2 className="dash__panel-title">Quick stats</h2>
              <div className="dash__stats">
                <div><strong>{enrollments.length}</strong><span>Courses</span></div>
                <div><strong>{Math.round(enrollments.reduce((s, e) => s + e.progress, 0) / Math.max(1, enrollments.length))}%</strong><span>Avg progress</span></div>
                <div><strong>{enrollments.filter((e) => e.progress === 100).length}</strong><span>Completed</span></div>
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="section-title">Recommended for you</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {recommended.map((c) => <CourseCard key={c.id} course={c} />)}
      </div>
    </div>
  );
}