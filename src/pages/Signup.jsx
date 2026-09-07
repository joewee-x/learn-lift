import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './auth.css';

export default function Signup() {
  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signup({ name, email, role, password });
      showToast(`Account created! Welcome, ${name.split(' ')[0]}.`);
      navigate(role === 'instructor' ? '/instructor' : '/dashboard');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Create your account</h1>
        <p className="auth__sub">Join LearnHub as a student or instructor.</p>

        <div className="auth__roles" role="radiogroup" aria-label="Account type">
          <button
            type="button"
            className={`auth__role ${role === 'student' ? 'auth__role--active' : ''}`}
            onClick={() => setRole('student')}
          >
            <span className="auth__role-emoji">🎓</span>
            <span className="auth__role-name">Student</span>
            <span className="auth__role-desc">Learn from top instructors</span>
          </button>
          <button
            type="button"
            className={`auth__role ${role === 'instructor' ? 'auth__role--active' : ''}`}
            onClick={() => setRole('instructor')}
          >
            <span className="auth__role-emoji">👨‍🏫</span>
            <span className="auth__role-name">Instructor</span>
            <span className="auth__role-desc">Create and sell courses</span>
          </button>
        </div>

        <form onSubmit={submit} className="auth__form">
          {error && <div className="auth__error" role="alert">{error}</div>}
          <label className="auth__field">
            <span>Full name</span>
            <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" />
          </label>
          <label className="auth__field">
            <span>Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="auth__field">
            <span>Password</span>
            <input type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" />
          </label>
          <Button type="submit" className="w-full mt-2" loading={loading}>
            {role === 'instructor' ? 'Create instructor account' : 'Create student account'}
          </Button>
        </form>

        <p className="auth__switch">Already have an account? <Link to="/login">Log in</Link></p>
      </div>
    </div>
  );
}