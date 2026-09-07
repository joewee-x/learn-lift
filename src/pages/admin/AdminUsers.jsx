import { useEffect, useState } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import Tabs from '../../components/ui/Tabs';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatDate } from '../../utils/helpers';

export default function AdminUsers() {
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [tab, setTab] = useState('student');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getUsersIncludingStudents().then((u) => { setUsers(u); setLoading(false); });
  }, []);

  const filtered = users.filter((u) => u.role === tab);
  const toggleStatus = (u) => {
    const newStatus = u.status === 'active' ? 'suspended' : 'active';
    setUsers((list) => list.map((x) => (x.id === u.id ? { ...x, status: newStatus } : x)));
    showToast(`${u.name} ${newStatus === 'active' ? 'reactivated' : 'suspended'}`, 'info');
  };

  const columns = [
    {
      key: 'name', label: 'User', sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2">
          <img src={r.avatar || `https://i.pravatar.cc/40?u=${r.id}`} alt="" className="w-8 h-8 rounded-full object-cover" />
          <div>
            <span className="block font-semibold text-sm">{r.name}</span>
            <span className="block text-xs text-slate-400">{r.email}</span>
          </div>
        </div>
      ),
    },
    { key: 'joinDate', label: 'Joined', sortable: true, render: (r) => formatDate(r.joinDate) },
    {
      key: 'status', label: 'Status', render: (r) => (
        <Badge tone={r.status === 'active' ? 'green' : 'red'}>{r.status}</Badge>
      ),
    },
    {
      key: 'verified', label: 'Verified', render: (r) => r.role === 'instructor'
        ? <Badge tone={r.verified ? 'brand' : 'neutral'}>{r.verified ? 'Verified' : 'Unverified'}</Badge>
        : <span className="text-slate-400">—</span>,
    },
    {
      key: 'actions', label: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => showToast(`Viewing ${r.name}'s profile (mock)`, 'info')}>View</Button>
          <Button variant="ghost" size="sm" onClick={() => toggleStatus(r)}>
            {r.status === 'active' ? 'Suspend' : 'Reactivate'}
          </Button>
          {r.role === 'instructor' && !r.verified && (
            <Button variant="secondary" size="sm" onClick={() => {
              setUsers((list) => list.map((x) => (x.id === r.id ? { ...x, verified: true } : x)));
              showToast(`${r.name} verified as instructor`);
            }}>Verify</Button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">User management</h1>
          <p className="page-sub">Manage students and instructors</p>
        </div>
      </div>
      <Tabs
        tabs={[
          { value: 'student', label: 'Students', count: users.filter((u) => u.role === 'student').length },
          { value: 'instructor', label: 'Instructors', count: users.filter((u) => u.role === 'instructor').length },
        ]}
        active={tab}
        onChange={setTab}
      />
      <div className="mt-5">
        {loading ? <Skeleton className="h-64" /> : (
          <DataTable
            columns={columns}
            rows={filtered}
            searchable
            searchPlaceholder="Search by name or email…"
            emptyTitle="No users found"
            emptyDesc="Try a different filter or search term."
          />
        )}
      </div>
    </div>
  );
}