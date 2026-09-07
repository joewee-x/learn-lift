import { useEffect, useState } from 'react';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import Tabs from '../../components/ui/Tabs';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function AdminPayments() {
  const { showToast } = useToast();
  const [transactions, setTransactions] = useState([]);
  const [payouts, setPayouts] = useState([]);
  const [tab, setTab] = useState('transactions');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.getTransactions(), api.getPayouts()]).then(([t, p]) => {
      setTransactions(t); setPayouts(p); setLoading(false);
    });
  }, []);

  const markPaid = (id) => {
    setPayouts((list) => list.map((p) => (p.id === id ? { ...p, status: 'paid' } : p)));
    showToast('Payout marked as paid');
  };

  const txnCols = [
    { key: 'studentName', label: 'Student', sortable: true, render: (r) => <strong className="text-sm">{r.studentName}</strong> },
    {
      key: 'courseId', label: 'Course', render: (r) => {
        const nameById = { 'course-1': 'Complete React Developer Bootcamp', 'course-2': 'UI/UX Design Masterclass', 'course-3': 'Data Science with Python', 'course-6': 'Advanced JavaScript Patterns' };
        return <span className="text-sm">{nameById[r.courseId] || r.courseId}</span>;
      },
    },
    { key: 'amount', label: 'Amount', sortable: true, render: (r) => <strong>{formatCurrency(r.amount)}</strong> },
    { key: 'date', label: 'Date', sortable: true, render: (r) => formatDate(r.date) },
    { key: 'status', label: 'Status', render: (r) => <Badge tone={r.status === 'paid' ? 'green' : 'red'}>{r.status}</Badge> },
  ];

  const payoutCols = [
    { key: 'instructorId', label: 'Instructor', render: (r) => <InstructorName id={r.instructorId} /> },
    { key: 'amount', label: 'Amount', sortable: true, render: (r) => <strong>{formatCurrency(r.amount)}</strong> },
    { key: 'date', label: 'Date', sortable: true, render: (r) => formatDate(r.date) },
    { key: 'status', label: 'Status', sortable: true, render: (r) => <Badge tone={r.status === 'paid' ? 'green' : 'amber'}>{r.status}</Badge> },
    {
      key: 'actions', label: '',
      render: (r) => r.status === 'pending' && (
        <Button size="sm" onClick={() => markPaid(r.id)}>Mark as paid</Button>
      ),
    },
  ];

  return (
    <div>
      <div className="page-head">
        <div>
          <h1 className="page-title">Payments</h1>
          <p className="page-sub">Transactions and instructor payouts</p>
        </div>
      </div>

      <Tabs
        tabs={[
          { value: 'transactions', label: 'Transactions', count: transactions.length },
          { value: 'payouts', label: 'Instructor payouts', count: payouts.length },
        ]}
        active={tab}
        onChange={setTab}
      />

      <div className="mt-5">
        {loading ? <Skeleton className="h-64" /> : tab === 'transactions' ? (
          <DataTable columns={txnCols} rows={transactions} searchable searchPlaceholder="Search transactions…" />
        ) : (
          <DataTable columns={payoutCols} rows={payouts} emptyTitle="No payouts yet" emptyDesc="Instructor payouts will appear here." />
        )}
      </div>
    </div>
  );
}

function InstructorName({ id }) {
  const names = { i1: 'Prof. Maria Gomez', i2: 'Ravi Singh', i3: 'Elena Vasquez' };
  return <strong className="text-sm">{names[id] || id}</strong>;
}