import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 140.3 4 175.9 4 273.1c0 16.5 3 33.3 9 50.5 7.9 23 36.6 101.3 53.5 101.3 12.8 0 28.9-19.1 52.6-19.1 22.9 0 38.9 19.1 54.2 19.1 16.9 0 30.2-26.2 42.5-52.6 7.7-18.2 14.2-36.6 14.2-36.6s-2.4-1.2-6.9-3.3c-35.7-14.7-52.4-42.2-52.4-78.6zM272 46.6c22.3-27.2 20.1-52.7 19.5-53.6-26.6 1.5-51.4 12.9-68.9 33.9-18.2 20.4-25.9 45.2-23.6 70.6 23.7 1.8 47.7-7 73-50.9z" />
    </svg>
  );
}

const labels = {
  google: (mode) => (mode === 'login' ? 'Log in with Google' : 'Sign up with Google'),
  apple: (mode) => (mode === 'login' ? 'Log in with Apple' : 'Sign up with Apple'),
};

export default function SocialAuth({ mode = 'signup' }) {
  const { login, signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(null);

  const handle = async (provider) => {
    setBusy(provider);
    try {
      if (mode === 'login') {
        const u = await login('ava@example.com', 'demo123');
        showToast(`Welcome back, ${u.name.split(' ')[0]}!`);
        navigate('/dashboard');
      } else {
        const email = provider === 'google' ? 'join-google@learnhub.io' : 'join-apple@learnhub.io';
        await signup({ name: 'Social Learner', email, role: 'student' });
        showToast('Account created! Welcome to LearnHub.');
        navigate('/dashboard');
      }
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setBusy(null);
    }
  };

  return (
    <div className="auth__social">
      <button
        type="button"
        className="auth__social-btn"
        onClick={() => handle('google')}
        disabled={!!busy}
      >
        <GoogleIcon />
        {labels.google(mode)}
      </button>
      <button
        type="button"
        className="auth__social-btn auth__social-btn--apple"
        onClick={() => handle('apple')}
        disabled={!!busy}
      >
        <AppleIcon />
        {labels.apple(mode)}
      </button>
    </div>
  );
}