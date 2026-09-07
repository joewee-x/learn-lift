import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import Icon from '../../components/ui/Icon';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';
import './assignments.css';

const statusMap = {
  open: { label: 'Not submitted', tone: 'amber' },
  submitted: { label: 'Submitted', tone: 'brand' },
  graded: { label: 'Graded', tone: 'green' },
};

export default function Assignments() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [assignments, setAssignments] = useState([]);
  const [tab, setTab] = useState('all');
  const [active, setActive] = useState(null);
  const [submissionText, setSubmissionText] = useState('');
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getAssignments(), api.getEnrollments(user.id)]).then(([a, enr]) => {
      const enrolledCourseIds = new Set(enr.map((e) => e.courseId));
      setAssignments(a.filter((x) => enrolledCourseIds.has(x.courseId)));
      setLoading(false);
    });
  }, [user.id]);

  const filtered = assignments.filter((a) =>
    tab === 'all' ? true : tab === 'todo' ? a.status === 'open' : a.status === 'submitted' || a.status === 'graded',
  );

  const submitAssignment = () => {
    if (!submissionText.trim() && !fileName) return;
    api.submitAssignment(active.id, submissionText || fileName);
    setAssignments((list) => list.map((x) => (x.id === active.id ? { ...x, status: 'submitted', submittedAt: '2026-09-07' } : x)));
    setActive(null);
    setSubmissionText('');
    setFileName('');
    showToast('Assignment submitted');
  };

  return (
    <div className="page page--narrow">
      <h1 className="page-title">Assignments</h1>
      <p className="page-sub">Track and submit assignments across your courses.</p>

      <div className="mt-6">
        <Tabs
          tabs={[
            { value: 'all', label: 'All', count: assignments.length },
            { value: 'todo', label: 'To do', count: assignments.filter((a) => a.status === 'open').length },
            { value: 'done', label: 'Submitted & graded', count: assignments.filter((a) => a.status !== 'open').length },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>

      <div className="mt-6 space-y-3">
        {loading ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-24" />) :
          filtered.length === 0 ? (
            <EmptyState icon="📝" title="No assignments here" description="You're all caught up — nothing to submit right now." />
          ) : filtered.map((a) => {
            const st = statusMap[a.status] || statusMap.open;
            return (
              <div key={a.id} className="asg">
                <div className="asg__icon"><Icon name={a.status === 'graded' ? 'checkCircle' : 'file'} size={20} /></div>
                <div className="asg__body">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="asg__title">{a.title}</h3>
                    <Badge tone={st.tone}>{st.label}</Badge>
                  </div>
                  <p className="asg__course">{a.courseTitle}</p>
                  <p className="asg__due">Due {formatDate(a.dueDate)}</p>
                  {a.status === 'graded' && (
                    <div className="asg__grade">
                      <span className="asg__grade-num">{a.grade}%</span>
                      {a.feedback && <span className="text-xs text-slate-500">“{a.feedback}”</span>}
                    </div>
                  )}
                </div>
                {a.status !== 'graded' && (
                  <Button size="sm" variant={a.status === 'submitted' ? 'secondary' : 'primary'} onClick={() => setActive(a)}>
                    {a.status === 'submitted' ? 'View submission' : 'Submit'}
                  </Button>
                )}
              </div>
            );
          })}
      </div>

      <Modal
        open={!!active}
        onClose={() => setActive(null)}
        title={active?.title}
        footer={
          <>
            <Button variant="ghost" onClick={() => setActive(null)}>Cancel</Button>
            <Button onClick={submitAssignment} disabled={!submissionText.trim() && !fileName}>Submit assignment</Button>
          </>
        }
      >
        {active && (
          <div className="space-y-4">
            <div>
              <p className="asg-modal-label">Course</p>
              <p className="text-sm font-semibold">{active.courseTitle}</p>
            </div>
            <div>
              <p className="asg-modal-label">Instructions</p>
              <p className="text-sm text-slate-600 leading-relaxed">{active.instructions}</p>
            </div>
            {active.submissionType === 'file' && (
              <label className="asg-upload">
                <input type="file" onChange={(e) => setFileName(e.target.files[0]?.name || '')} className="hidden" />
                <Icon name="upload" size={18} />
                <span>{fileName || 'Click to upload a file'}</span>
              </label>
            )}
            {active.submissionType === 'text' && (
              <label className="block">
                <span className="asg-modal-label">Your answer</span>
                <textarea
                  className="w-full border border-slate-200 rounded-lg p-3 text-sm"
                  rows={5}
                  placeholder="Type your answer here…"
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.target.value)}
                />
              </label>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}