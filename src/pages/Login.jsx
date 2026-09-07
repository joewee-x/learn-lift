import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import SocialAuth from '../components/SocialAuth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import './auth.css';

const demoAccounts = [
  { label: 'Student', email: 'ava@example.com' },
  { label: 'Instructor', email: 'maria@learnhub.io' },
  { label: 'Admin', email: 'admin@learnhub.io' },
];

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = () => {
    const from = location.state?.from;
    return from || '/dashboard';
  };

  const submit = async (e, override) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const u = await login(override || email, password || 'demo123');
      showToast(`Welcome back, ${u.name.split(' ')[0]}!`);
      const home = u.role === 'admin' ? '/admin' : u.role === 'instructor' ? '/instructor' : redirect();
      navigate(home);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <div className="auth__card">
        <h1 className="auth__title">Welcome back</h1>
        <p className="auth__sub">Log in to continue learning.</p>

        <div className="auth__demo">
          <span className="auth__demo-label">Demo accounts</span>
          <div className="auth__demo-row">
            {demoAccounts.map((d) => (
              <button key={d.email} className="auth__demo-btn" onClick={() => { setEmail(d.email); setPassword('demo123'); }}>
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <SocialAuth mode="login" />
        <div className="auth__divider"><span>or log in with email</span></div>

        <form onSubmit={submit} className="auth__form">
          {error && <div className="auth__error" role="alert">{error}</div>}
          <label className="auth__field">
            <span>Email</span>
            <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </label>
          <label className="auth__field">
            <span>Password</span>
            <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
          </label>
          <Button type="submit" className="w-full mt-2" loading={loading}>Log in</Button>
        </form>

        <p className="auth__switch">New to LearnHub? <Link to="/signup">Create an account</Link></p>
      </div>
    </div>
  );
}