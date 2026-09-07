import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/helpers';
import './messages.css';

const typeMeta = {
  grade: { label: 'Grade', tone: 'green' },
  announcement: { label: 'Announcement', tone: 'brand' },
  price: { label: 'Price drop', tone: 'amber' },
  enrollment: { label: 'Enrollment', tone: 'neutral' },
};

export default function Notifications() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getNotifications(user.id).then((n) => { setItems(n); setLoading(false); });
  }, [user.id]);

  const markAll = () => setItems((list) => list.map((n) => ({ ...n, isRead: true })));

  return (
    <div className="page page--narrow">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="page-title">Notifications</h1>
          <p className="page-sub">{items.filter((n) => !n.isRead).length} unread</p>
        </div>
        <Button variant="ghost" size="sm" onClick={markAll}>Mark all read</Button>
      </div>
      <div className="mt-6 space-y-2">
        {loading ? [0, 1, 2].map((i) => <Skeleton key={i} className="h-16" />) :
          items.length === 0 ? (
            <EmptyState icon="🔔" title="No notifications" description="Updates about grades, announcements, and prices will appear here." />
          ) : items.map((n) => {
            const meta = typeMeta[n.type] || { label: 'Update', tone: 'neutral' };
            return (
              <div key={n.id} className={`ntf ${!n.isRead ? 'ntf--unread' : ''}`}>
                <div className="ntf__body">
                  <div className="flex items-center gap-2">
                    <Badge tone={meta.tone}>{meta.label}</Badge>
                    <span className="text-xs text-slate-400">{formatDate(n.createdAt)}</span>
                    {!n.isRead && <span className="ntf__dot" aria-label="Unread" />}
                  </div>
                  <p className="ntf__text">{n.message}</p>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}