import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Icon from './ui/Icon';
import { useAuth } from '../context/AuthContext';
import './adminsidebar.css';

const adminNav = [
  { group: 'Overview', items: [{ to: '/admin', label: 'Dashboard', icon: 'grid', end: true }] },
  {
    group: 'Management',
    items: [
      { to: '/admin/users', label: 'Users', icon: 'users' },
      { to: '/admin/courses', label: 'Courses', icon: 'grid' },
      { to: '/admin/categories', label: 'Categories', icon: 'list' },
    ],
  },
  {
    group: 'Operations',
    items: [
      { to: '/admin/payments', label: 'Payments', icon: 'dollar' },
      { to: '/admin/reports', label: 'Reports', icon: 'barChart' },
      { to: '/admin/support', label: 'Support', icon: 'message' },
      { to: '/admin/settings', label: 'Settings', icon: 'settings' },
    ],
  },
];

export default function AdminSidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`adminbar ${collapsed ? 'adminbar--collapsed' : ''}`}>
      <div className="adminbar__logo">
        <span className="adminbar__mark">LH</span>
        <span className="adminbar__name">LearnHub Admin</span>
      </div>
      <nav className="adminbar__nav">
        {adminNav.map((group) => (
          <div key={group.group} className="adminbar__group">
            <span className="adminbar__group-label">{group.group}</span>
            {group.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => `adminbar__link ${isActive ? 'adminbar__link--active' : ''}`}
              >
                <Icon name={item.icon} size={18} />
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        ))}
      </nav>
      <div className="adminbar__foot">
        <Link to="/" className="adminbar__link"><Icon name="arrowLeft" size={18} /><span>Back to site</span></Link>
        <button
          className="adminbar__link"
          onClick={() => { logout(); navigate('/'); }}
        >
          <Icon name="x" size={18} /><span>Sign out {user?.name?.split(' ')[0]}</span>
        </button>
      </div>
      <button className="adminbar__collapse" onClick={() => setCollapsed((c) => !c)} aria-label="Toggle sidebar">
        <Icon name="menu" size={18} />
      </button>
    </aside>
  );
}