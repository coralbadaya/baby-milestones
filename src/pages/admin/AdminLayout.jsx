import { NavLink, Outlet, Link } from 'react-router-dom';
import RequireRole from '../../components/auth/RequireRole';
import { ROUTES } from '../../routes';
import { interact } from '../../utils/haptics';

const ADMIN_NAV = [
  { to: ROUTES.admin, label: 'Overview', end: true },
  { to: ROUTES.adminInbox, label: 'Inbox' },
  { to: ROUTES.adminUsers, label: 'Users' },
  { to: ROUTES.adminPromos, label: 'Promo codes' },
];

function AdminLayoutInner() {
  return (
    <div className="admin-layout fade-in">
      <aside className="admin-sidebar">
        <h2 className="admin-sidebar-title font-display">Admin</h2>
        <nav className="admin-nav" aria-label="Admin">
          {ADMIN_NAV.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => `admin-nav-link${isActive ? ' active' : ''}`}
              onClick={() => interact('tap', 'light')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <Link to={ROUTES.account} className="admin-back" onClick={() => interact('tap', 'light')}>
          ← Account
        </Link>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}

function AdminLayout() {
  return (
    <RequireRole role="staff">
      <AdminLayoutInner />
    </RequireRole>
  );
}

export default AdminLayout;
