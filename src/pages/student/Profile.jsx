import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import Badge from '../../components/ui/Badge';
import { getCourse } from '../../utils/helpers';
import './profile.css';

export default function Profile() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    api.getEnrollments(user.id).then((enr) => {
      setEnrollments(enr.map((e) => ({ ...e, course: getCourse(e.courseId) })).filter((e) => e.course));
    });
  }, [user.id]);

  const completed = enrollments.filter((e) => e.progress === 100).length;
  const inProgress = enrollments.filter((e) => e.progress > 0 && e.progress < 100).length;

  return (
    <div className="page page--narrow">
      <div className="profile-head">
        <img src={user.avatar || `https://i.pravatar.cc/120?u=${user.id}`} alt={user.name} className="profile-avatar" />
        <div>
          <h1 className="profile-name">{user.name}</h1>
          <p className="profile-bio">{user.bio || 'Lifelong learner on LearnHub.'}</p>
          <Badge tone="brand">Student</Badge>
        </div>
      </div>
      <div className="profile-stats">
        <div><strong>{enrollments.length}</strong><span>Enrolled</span></div>
        <div><strong>{inProgress}</strong><span>In progress</span></div>
        <div><strong>{completed}</strong><span>Completed</span></div>
      </div>
    </div>
  );
}