import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Icon from '../../components/ui/Icon';
import Modal from '../../components/ui/Modal';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { getInstructor } from '../../utils/helpers';

const statusMap = {
  draft: { label: 'Draft', tone: 'neutral' },
  pending: { label: 'Pending review', tone: 'amber' },
  published: { label: 'Published', tone: 'green' },
};

export default function AdminCourses() {
  const { showToast } = useToast();
  const [courses, setCourses] = useState([]);
  const [tab, setTab] = useState('pending');
  const [loading, setLoading] = useState(true);
  const [reviewCourse, setReviewCourse] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showReject, setShowReject] = useState(false);

  useEffect(() => {
    api.getCourses().then((c) => { setCourses(c); setLoading(false); });
  }, []);

  const filtered = courses.filter((c) => (tab === 'pending' ? c.status === 'pending' : tab === 'published' ? c.status === 'published' : c.status === 'draft'));

  const decide = async (course, decision) => {
    await api.setCourseStatus(course.id, decision === 'approve' ? 'published' : 'draft');
    setCourses((list) => list.map((c) => (c.id === course.id ? { ...c, status: decision === 'approve' ? 'published' : 'draft' } : c)));
    setReviewCourse(null);
    setShowReject(false);
    showToast(decision === 'approve' ? `"${course.title}" is now live` : 'Course rejected and returned to draft', decision === 'approve' ? 'success' : 'info');
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Course moderation</h1>
          <p className="page-sub">Approve, reject, and manage the course catalog</p>
        </div>
      </div>

      <Tabs
        tabs={[
          { value: 'pending', label: 'Pending review', count: courses.filter((c) => c.status === 'pending').length },
          { value: 'published', label: 'Live', count: courses.filter((c) => c.status === 'published').length },
          { value: 'draft', label: 'Drafts', count: courses.filter((c) => c.status === 'draft').length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-5">
        {loading ? <Skeleton className="h-64" /> : (
          <div className="space-y-3">
            {filtered.length === 0 && (
              <div className="card p-10 text-center text-slate-500 text-sm">
                {tab === 'pending' ? 'No courses waiting for review. 🎉' : 'No courses in this state.'}
              </div>
            )}
            {filtered.map((c) => {
              const st = statusMap[c.status];
              return (
                <div key={c.id} className="adm-course">
                  <img src={c.thumbnail} alt={c.title} />
                  <div className="adm-course__body">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-bold">{c.title}</h3>
                      <Badge tone={st.tone}>{st.label}</Badge>
                    </div>
                    <p className="text-xs text-slate-500">By {getInstructor(c.instructorId)?.name} · {c.studentCount.toLocaleString()} students</p>
                  </div>
                  <div className="adm-course__actions">
                    {c.status === 'pending' && (
                      <Button size="sm" onClick={() => setReviewCourse(c)}><Icon name="search" size={14} /> Review</Button>
                    )}
                    <Link to={`/courses/${c.id}`}><Button size="sm" variant="secondary">View</Button></Link>
                    {c.status === 'published' && (
                      <Button size="sm" variant="ghost" onClick={async () => {
                        await api.setCourseStatus(c.id, 'draft');
                        setCourses((list) => list.map((x) => (x.id === c.id ? { ...x, status: 'draft' } : x)));
                        showToast('Course unpublished', 'info');
                      }}>Unpublish</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        open={!!reviewCourse}
        onClose={() => setReviewCourse(null)}
        title={reviewCourse?.title}
        size="lg"
        footer={
          showReject ? (
            <>
              <Button variant="ghost" onClick={() => setShowReject(false)}>Cancel</Button>
              <Button variant="destructive" onClick={() => decide(reviewCourse, 'reject')}>Reject course</Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => setShowReject(true)}>Reject</Button>
              <Button onClick={() => decide(reviewCourse, 'approve')}>Approve & publish</Button>
            </>
          )
        }
      >
        {reviewCourse && (
          <div className="space-y-4">
            <img src={reviewCourse.thumbnail} alt="" className="w-full rounded-lg aspect-video object-cover" />
            <p className="text-slate-600 text-sm leading-relaxed">{reviewCourse.description}</p>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-slate-400 block text-xs">Instructor</span><strong>{getInstructor(reviewCourse.instructorId)?.name}</strong></div>
              <div><span className="text-slate-400 block text-xs">Price</span><strong>{reviewCourse.price === 0 ? 'Free' : `$${reviewCourse.price.toFixed(2)}`}</strong></div>
              <div><span className="text-slate-400 block text-xs">Level</span><strong>{reviewCourse.level}</strong></div>
              <div><span className="text-slate-400 block text-xs">Students</span><strong>{reviewCourse.studentCount.toLocaleString()}</strong></div>
            </div>
            {showReject && (
              <div>
                <label className="block text-sm font-semibold mb-1">Reason for rejection (sent to instructor)</label>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm"
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="e.g. The curriculum requires more detail…"
                />
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}