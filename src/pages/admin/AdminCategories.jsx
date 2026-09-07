import { useEffect, useState } from 'react';
import Button from '../../components/ui/Button';
import Icon from '../../components/ui/Icon';
import DataTable from '../../components/ui/DataTable';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function AdminCategories() {
  const { showToast } = useToast();
  const [cats, setCats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    api.getCategories().then((c) => { setCats(c); setLoading(false); });
  }, []);

  const add = () => {
    if (!newName.trim()) return;
    setCats((list) => [...list, { id: 'c' + Date.now(), name: newName, courses: 0 }]);
    setNewName('');
    showToast('Category added');
  };

  const remove = (id) => {
    setCats((list) => list.filter((c) => c.id !== id));
    showToast('Category removed', 'info');
  };

  const columns = [
    { key: 'name', label: 'Category', sortable: true, render: (r) => <strong className="text-sm">{r.name}</strong> },
    { key: 'courses', label: 'Courses', sortable: true },
    {
      key: 'actions', label: '',
      render: (r) => <Button variant="ghost" size="sm" onClick={() => remove(r.id)} aria-label={`Remove ${r.name}`}><Icon name="trash" size={16} /></Button>,
    },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Categories & tags</h1>
          <p className="page-sub">Manage the catalog taxonomy</p>
        </div>
      </div>

      <div className="flex gap-2 mb-5">
        <input
          className="flex-1 max-w-xs border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-brand-400"
          placeholder="New category name…"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button onClick={add}><Icon name="plus" size={16} /> Add category</Button>
      </div>

      {loading ? <Skeleton className="h-64" /> : (
        <DataTable
          columns={columns}
          rows={cats}
          searchable
          searchPlaceholder="Search categories…"
          emptyTitle="No categories yet"
          emptyDesc="Add your first category above."
        />
      )}
    </div>
  );
}