import { useEffect, useState } from 'react';
import Tabs from '../../components/ui/Tabs';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { formatDate } from '../../utils/helpers';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMessages().then((m) => { setMessages(m); setLoading(false); });
  }, []);

  const filtered = messages.filter((m) => (tab === 'all' ? true : m.type === tab));

  return (
    <div className="page page--narrow">
      <h1 className="page-title">Messages</h1>
      <p className="page-sub">Announcements from instructors and Q&A threads you're part of.</p>
      <div className="mt-6">
        <Tabs
          tabs={[
            { value: 'all', label: 'All' },
            { value: 'announcement', label: 'Announcements' },
            { value: 'qa', label: 'Q&A' },
          ]}
          active={tab}
          onChange={setTab}
        />
      </div>
      <div className="mt-6 space-y-3">
        {loading ? [0, 1].map((i) => <Skeleton key={i} className="h-20" />) :
          filtered.length === 0 ? (
            <EmptyState icon="💬" title="No messages yet" description="Messages from your instructors will appear here." />
          ) : filtered.map((m) => (
            <div key={m.id} className="msg">
              <div className="msg__icon">
                <Icon name={m.type === 'announcement' ? 'bell' : 'message'} size={18} />
              </div>
              <div className="msg__body">
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge tone={m.type === 'announcement' ? 'brand' : 'green'}>{m.type === 'announcement' ? 'Announcement' : 'Question'}</Badge>
                  <span className="text-xs text-slate-400">{formatDate(m.createdAt)}</span>
                </div>
                <h3 className="msg__title">{m.title}</h3>
                <p className="msg__text">{m.body}</p>
                <span className="msg__meta">{m.from} · {m.courseTitle}</span>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}