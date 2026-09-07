import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import AdminSidebar from './AdminSidebar';
import './layout.css';

export function PublicLayout() {
  return (
    <div className="shell">
      <Navbar />
      <main className="shell__main">
        <Outlet />
      </main>
    </div>
  );
}

export function PortalLayout() {
  return (
    <div className="shell">
      <Navbar />
      <main className="shell__main shell__main--portal">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminLayout() {
  return (
    <div className="shell admin-shell">
      <AdminSidebar />
      <main className="admin-shell__main">
        <Outlet />
      </main>
    </div>
  );
}