import { useState } from 'react';
import { useEffect } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Tabs from '../../components/ui/Tabs';
import Icon from '../../components/ui/Icon';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';

export default function AdminSupport() {
  const { showToast } = useToast();
  const [items, setItems] = useState([]);
  const [tab, setTab] = useState('open');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getFlaggedContent().then((f) => { setItems(f); setLoading(false); });
  }, []);

  const filtered = items.filter((i) => (tab === 'open' ? i.status === 'open' : i.status === 'resolved'));

  const resolve = (id, action) => {
    setItems((list) => list.map((i) => (i.id === id ? { ...i, status: 'resolved' } : i)));
    showToast(action === 'dismiss' ? 'Flag dismissed — content stays up' : 'Flagged content removed', action === 'dismiss' ? 'info' : 'success');
  };

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Support & flagged content</h1>
          <p className="page-sub">Review reported reviews, questions, and courses</p>
        </div>
      </div>

      <Tabs
        tabs={[
          { value: 'open', label: 'Open', count: items.filter((i) => i.status === 'open').length },
          { value: 'resolved', label: 'Resolved', count: items.filter((i) => i.status === 'resolved').length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-5 space-y-3">
        {loading ? <Skeleton className="h-40" /> :
          filtered.length === 0 ? (
            <EmptyState icon="🛡️" title={tab === 'open' ? 'All clear!' : 'Nothing resolved yet'} description="No flagged content in this view." />
          ) : filtered.map((f) => (
            <div key={f.id} className="supp-card">
              <div className="supp-card__icon"><Icon name={f.type === 'course' ? 'grid' : 'message'} size={18} /></div>
              <div className="supp-card__body">
                <div className="flex items-center gap-2">
                  <Badge tone={f.type === 'course' ? 'brand' : 'amber'}>{f.type}</Badge>
                  <span className="text-xs text-slate-400">{formatDate(f.createdAt)}</span>
                </div>
                <h3 className="supp-card__title">{f.target}</h3>
                <p className="supp-card__reason">Reported for: <strong>{f.reason}</strong> by {f.reportedBy}</p>
              </div>
              {f.status === 'open' && (
                <div className="supp-card__actions">
                  <Button size="sm" onClick={() => resolve(f.id, 'dismiss')}>Dismiss</Button>
                  <Button size="sm" variant="destructive" onClick={() => resolve(f.id, 'remove')}>Remove content</Button>
                </div>
              )}
            </div>
          ))}
      </div>
    </div>
  );
}