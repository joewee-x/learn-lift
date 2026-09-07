import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function RequireAuth({ role, children }) {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (role && user.role !== role) {
    const home = user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/dashboard';
    return <Navigate to={home} replace />;
  }

  return children;
}

export function PublicOnly({ children }) {
  const { user } = useAuth();
  if (user) {
    const home = user.role === 'admin' ? '/admin' : user.role === 'instructor' ? '/instructor' : '/dashboard';
    return <Navigate to={home} replace />;
  }
  return children;
}