import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Icon from '../../components/ui/Icon';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';
import './qa.css';

const seedQA = [
  { id: 'q1', author: 'Sofia Ortiz', text: 'Can you explain the difference between useEffect and useLayoutEffect?', createdAt: '2026-08-12', resolved: true, reply: 'Great question! useLayoutEffect runs synchronously after DOM mutations, while useEffect runs asynchronously after paint.' },
  { id: 'q2', author: 'Noah Kim', text: 'Do we need Redux for larger applications?', createdAt: '2026-08-20', resolved: false, reply: '' },
];

export default function CourseQA() {
  const { courseId } = useParams();
  const { showToast } = useToast();
  const [course, setCourse] = useState(null);
  const [items, setItems] = useState(seedQA);
  const [replyFor, setReplyFor] = useState(null);
  const [replyText, setReplyText] = useState('');

  useEffect(() => { api.getCourse(courseId).then(setCourse); }, [courseId]);

  const submitReply = (id) => {
    if (!replyText.trim()) return;
    setItems((list) => list.map((q) => (q.id === id ? { ...q, reply: replyText, resolved: true } : q)));
    setReplyFor(null);
    setReplyText('');
    showToast('Reply posted');
  };

  return (
    <div className="page page--narrow">
      <div className="page-head">
        <div>
          <Link to={`/instructor/courses/${courseId}/edit`} className="text-sm text-brand-700 font-semibold">← Back to curriculum</Link>
          <h1 className="page-title">Q&A · {course?.title}</h1>
          <p className="page-sub">{items.filter((q) => !q.resolved).length} unanswered questions</p>
        </div>
      </div>

      {items.length === 0 ? (
        <EmptyState icon="💬" title="No questions yet" description="Student questions about your course will appear here." />
      ) : (
        <div className="space-y-3 mt-4">
          {items.map((q) => (
            <div key={q.id} className="qa-item">
              <div className="flex items-center gap-2 flex-wrap">
                <img src={`https://i.pravatar.cc/40?u=${q.author}`} alt="" className="w-8 h-8 rounded-full" />
                <strong className="text-sm">{q.author}</strong>
                <span className="text-xs text-slate-400">{formatDate(q.createdAt)}</span>
                <Badge tone={q.resolved ? 'green' : 'amber'}>{q.resolved ? 'Resolved' : 'Open'}</Badge>
              </div>
              <p className="qa-item__question">{q.text}</p>
              {q.reply && (
                <div className="qa-item__reply">
                  <p className="text-sm">{q.reply}</p>
                  <span className="text-xs text-slate-400">Your reply</span>
                </div>
              )}
              {!q.reply && !replyFor && (
                <Button variant="secondary" size="sm" onClick={() => setReplyFor(q.id)}><Icon name="message" size={14} /> Reply</Button>
              )}
              {replyFor === q.id && (
                <div className="qa-item__replyform">
                  <textarea rows={3} value={replyText} onChange={(e) => setReplyText(e.target.value)} placeholder="Write a helpful reply…" />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => submitReply(q.id)} disabled={!replyText.trim()}>Post reply</Button>
                    <Button variant="ghost" size="sm" onClick={() => { setReplyFor(null); setReplyText(''); }}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}