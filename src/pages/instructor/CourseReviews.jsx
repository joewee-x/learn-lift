import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import RatingStars from '../../components/ui/RatingStars';
import Button from '../../components/ui/Button';
import EmptyState from '../../components/ui/EmptyState';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';

export default function CourseReviews() {
  const { courseId } = useParams();
  const { showToast } = useToast();
  const [course, setCourse] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => { api.getReviews(courseId).then(setReviews); api.getCourse(courseId).then(setCourse); }, [courseId]);

  if (!course) return <div className="page"><h1 className="page-title mt-8">Loading…</h1></div>;

  return (
    <div className="page page--narrow">
      <div className="page-head">
        <div>
          <Link to={`/instructor/courses/${courseId}/edit`} className="text-sm text-brand-700 font-semibold">← Back to curriculum</Link>
          <h1 className="page-title">Reviews · {course.title}</h1>
          <p className="page-sub">What students are saying</p>
        </div>
      </div>

      {reviews.length === 0 ? (
        <EmptyState icon="⭐" title="No reviews yet" description="Reviews from students will appear here once they complete the course." />
      ) : (
        <div className="mt-4 space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="qa-item">
              <div className="flex items-center gap-2 flex-wrap">
                <img src={`https://i.pravatar.cc/40?u=${r.studentId}`} alt="" className="w-8 h-8 rounded-full" />
                <strong className="text-sm">{r.studentName}</strong>
                <span className="text-xs text-slate-400">{formatDate(r.createdAt)}</span>
              </div>
              <div className="mt-2"><RatingStars rating={r.rating} /></div>
              <p className="qa-item__question">{r.comment}</p>
              <Button variant="secondary" size="sm" onClick={() => showToast('Reply feature is a mock — public reply would go here', 'info')}>Reply publicly</Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}