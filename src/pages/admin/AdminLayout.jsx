import { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import RequireRole from '../../components/auth/RequireRole';
import CoralLogo from '../../components/CoralLogo';
import Icon from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes';
import { interact } from '../../utils/haptics';
import { usePageMeta } from '../../utils/pageMeta';

const ADMIN_NAV = [
  { to: ROUTES.admin, label: 'Overview', end: true, icon: 'squares-four' },
  { to: ROUTES.adminInbox, label: 'Inbox', icon: 'envelope' },
  { to: ROUTES.adminUsers, label: 'Users', icon: 'users' },
  { to: ROUTES.adminPromos, label: 'Promo codes', icon: 'ticket' },
  { to: ROUTES.adminNewsletter, label: 'Newsletter', icon: 'paper-plane' },
  { to: ROUTES.adminDiy, label: 'DIY images', icon: 'image', adminOnly: true },
];

function AdminLayoutInner() {
  const { isAdmin, user, signOut } = useAuth();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navItems = ADMIN_NAV.filter((item) => !item.adminOnly || isAdmin);

  usePageMeta({
    title: 'Admin',
    description: 'Nestbean admin center — inbox, users, promo codes, newsletter, and DIY images.',
  });

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  const handleSignOut = async () => {
    interact('tap', 'light');
    await signOut();
  };

  const handleNavClick = () => {
    interact('tap', 'light');
    closeDrawer();
  };

  return (
    <div className="admin-shell">
      <header className="admin-topbar">
        <button
          type="button"
          className="admin-menu-toggle"
          aria-label={drawerOpen ? 'Close admin menu' : 'Open admin menu'}
          aria-expanded={drawerOpen}
          aria-controls="admin-sidebar"
          onClick={() => setDrawerOpen((open) => !open)}
        >
          <Icon name="list" size={22} />
        </button>

        <div className="admin-topbar-brand">
          <CoralLogo variant="mark" size={28} />
          <span className="admin-topbar-label">Admin</span>
        </div>

        <div className="admin-topbar-spacer" aria-hidden="true" />

        <span className={`admin-role-pill${isAdmin ? ' admin-role-pill--admin' : ''}`}>
          {isAdmin ? 'Admin' : 'Staff'}
        </span>

        {user?.email ? (
          <span className="admin-topbar-email" title={user.email}>
            {user.email}
          </span>
        ) : null}

        <button type="button" className="admin-topbar-signout" onClick={handleSignOut}>
          Sign out
        </button>
      </header>

      {drawerOpen ? (
        <button
          type="button"
          className="admin-drawer-backdrop"
          aria-label="Close admin menu"
          onClick={closeDrawer}
        />
      ) : null}

      <div className="admin-layout">
        <aside
          id="admin-sidebar"
          className={`admin-sidebar${drawerOpen ? ' admin-sidebar--open' : ''}`}
        >
          <nav className="admin-nav" aria-label="Admin">
            {navItems.map(({ to, label, end, icon }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `admin-nav-item${isActive ? ' admin-nav-item--active' : ''}`
                }
                onClick={handleNavClick}
              >
                <Icon name={icon} size={20} />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>

          <Link to={ROUTES.account} className="admin-back" onClick={handleNavClick}>
            ← Back to app
          </Link>
        </aside>

        <main className="admin-main" id="admin-content">
          <div className="admin-workspace">
            <Outlet />
          </div>
        </main>
      </div>
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
