import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="auth">
      <div className="auth__card" style={{ textAlign: 'center' }}>
        <h1 className="auth__title">404</h1>
        <p className="auth__sub">We couldn't find that page.</p>
        <Link to="/"><Button>Back to Home</Button></Link>
      </div>
    </div>
  );
}