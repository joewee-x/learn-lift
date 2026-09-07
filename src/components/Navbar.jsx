import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Icon from './ui/Icon';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { initials } from '../utils/helpers';
import './navbar.css';


export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(`/courses?q=${encodeURIComponent(query)}`);
    setMobileOpen(false);
  };

  const profileMenuTarget = user?.role === 'admin' ? '/admin' : user?.role === 'instructor' ? '/instructor' : '/profile';

  const profileMenu = (
    <div className="nav-profile__menu">
      <div className="nav-profile__head">
        <span className="font-bold">{user?.name}</span>
        <span className="text-xs capitalize text-slate-500">{user?.role}</span>
      </div>
      {user?.role === 'student' && <Link to="/profile" onClick={() => setProfileOpen(false)}>Profile</Link>}
      <Link to="/settings" onClick={() => setProfileOpen(false)}>Settings</Link>
      {user?.role === 'instructor' && <Link to="/instructor" onClick={() => setProfileOpen(false)}>Instructor Dashboard</Link>}
      {user?.role === 'admin' && <Link to="/admin" onClick={() => setProfileOpen(false)}>Admin Console</Link>}
      <button onClick={() => { logout(); setProfileOpen(false); navigate('/'); }}>Sign out</button>
    </div>
  );

  return (
    <>
      <header className="navbar">
        <div className="navbar__inner">
          <button className="navbar__hamburger" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
            <Icon name="menu" size={22} />
          </button>
          <Link to="/" className="navbar__logo">
            <span className="navbar__logo-mark">LH</span>
            <span className="navbar__logo-text">LearnHub</span>
          </Link>

          <form className="navbar__search" onSubmit={submitSearch}>
            <Icon name="search" size={16} className="navbar__searchicon" />
            <input
              aria-label="Search courses"
              placeholder="Search courses…"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </form>

          <nav className="navbar__links">
            <NavLink to="/courses" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>Explore</NavLink>
            {user?.role === 'student' && (
              <NavLink to="/my-learning" className={({ isActive }) => `navbar__link ${isActive ? 'navbar__link--active' : ''}`}>My Learning</NavLink>
            )}
          </nav>

          <div className="navbar__actions">
            {user?.role === 'student' && (
              <Link to="/cart" className="navbar__iconbtn" aria-label="Cart">
                <Icon name="cart" size={20} />
                {cart.length > 0 && <span className="navbar__badge">{cart.length}</span>}
              </Link>
            )}
            {user?.role === 'student' && (
              <Link to="/notifications" className="navbar__iconbtn" aria-label="Notifications">
                <Icon name="bell" size={20} />
              </Link>
            )}

            {!user ? (
              <div className="flex items-center gap-2">
                <Link to="/login" className="navbar__auth-login">Log in</Link>
                <Link to="/signup" className="navbar__auth-signup">Sign up</Link>
              </div>
            ) : (
              <div className="nav-profile" ref={profileRef}>
                <button className="navbar__avatar" onClick={() => setProfileOpen((o) => !o)} aria-label="Account menu">
                  {user.avatar ? <img src={user.avatar} alt="" /> : <span>{initials(user.name)}</span>}
                </button>
                {profileOpen && profileMenu}
              </div>
            )}
          </div>
        </div>

        {mobileOpen && (
          <div className="navbar__mobile">
            <form className="navbar__search navbar__search--mobile" onSubmit={submitSearch}>
              <Icon name="search" size={16} className="navbar__searchicon" />
              <input aria-label="Search courses" placeholder="Search courses…" value={query} onChange={(e) => setQuery(e.target.value)} />
            </form>
            <NavLink to="/courses" onClick={() => setMobileOpen(false)}>Explore</NavLink>
            {user?.role === 'student' && <NavLink to="/my-learning" onClick={() => setMobileOpen(false)}>My Learning</NavLink>}
            {user && <NavLink to={profileMenuTarget} onClick={() => setMobileOpen(false)}>Profile</NavLink>}
            {user?.role === 'instructor' && <NavLink to="/instructor" onClick={() => setMobileOpen(false)}>Instructor</NavLink>}
            {!user && <NavLink to="/login" onClick={() => setMobileOpen(false)}>Log in</NavLink>}
            {!user && <NavLink to="/signup" onClick={() => setMobileOpen(false)}>Sign up</NavLink>}
            {user && <button className="navbar__mobile-btn" onClick={() => { logout(); setMobileOpen(false); navigate('/'); }}>Sign out</button>}
          </div>
        )}
      </header>
      {user?.role === 'student' && (
        <nav className="tabbar" aria-label="Mobile navigation">
          <Link to="/" className="tabbar__item"><Icon name="grid" size={20} /><span>Home</span></Link>
          <Link to="/courses" className="tabbar__item"><Icon name="search" size={20} /><span>Search</span></Link>
          <Link to="/my-learning" className="tabbar__item"><Icon name="play" size={20} /><span>Learning</span></Link>
          <Link to="/profile" className="tabbar__item"><Icon name="user" size={20} /><span>Profile</span></Link>
        </nav>
      )}
    </>
  );
}