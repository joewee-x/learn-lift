import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import ProgressBar from '../../components/ui/ProgressBar';
import Skeleton from '../../components/ui/Skeleton';
import { api } from '../../services/api';
import { formatDate } from '../../utils/helpers';
import { enrollments, users } from '../../data/db';

export default function CourseStudents() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getCourse(courseId).then((c) => { setCourse(c); setLoading(false); });
  }, [courseId]);

  if (loading) return <div className="page"><Skeleton className="h-8 w-1/2 mt-8" /><Skeleton className="h-64 mt-6" /></div>;
  if (!course) return <div className="page"><h1>Course not found</h1></div>;

  const rows = enrollments
    .filter((e) => e.courseId === courseId)
    .map((e) => {
      const student = users.find((u) => u.id === e.studentId) || { name: 'Unknown', avatar: '' };
      return { ...e, studentName: student.name, studentEmail: student.email };
    });

  const columns = [
    {
      key: 'studentName', label: 'Student', sortable: true,
      render: (r) => (
        <div className="flex items-center gap-2">
          <img src={`https://i.pravatar.cc/40?u=${r.studentId}`} alt="" className="w-8 h-8 rounded-full object-cover" />
          <div>
            <span className="block font-semibold text-sm">{r.studentName}</span>
            <span className="block text-xs text-slate-400">{r.studentEmail}</span>
          </div>
        </div>
      ),
    },
    { key: 'enrolledAt', label: 'Enrolled', sortable: true, render: (r) => formatDate(r.enrolledAt) },
    {
      key: 'progress', label: 'Progress', sortable: true,
      render: (r) => (
        <div className="w-28">
          <ProgressBar value={r.progress} />
          <span className="text-xs font-bold text-slate-600">{r.progress}%</span>
        </div>
      ),
    },
    {
      key: 'status', label: 'Status', render: (r) => (
        <Badge tone={r.progress === 100 ? 'green' : r.progress > 0 ? 'brand' : 'neutral'}>
          {r.progress === 100 ? 'Completed' : r.progress > 0 ? 'In progress' : 'Not started'}
        </Badge>
      ),
    },
  ];

  return (
    <div className="page">
      <div className="page-head">
        <div>
          <Link to={`/instructor/courses/${courseId}/edit`} className="text-sm text-brand-700 font-semibold">← Back to curriculum</Link>
          <h1 className="page-title">{course.title}</h1>
          <p className="page-sub">Students enrolled in this course</p>
        </div>
        <Link to={`/instructor/courses/${courseId}/edit`}><Button variant="secondary">Edit course</Button></Link>
      </div>

      <DataTable
        columns={columns}
        rows={rows}
        searchable
        searchPlaceholder="Search students…"
        emptyTitle="No students enrolled yet"
        emptyDesc="Once students enroll, they'll appear here with their progress."
      />
    </div>
  );
}