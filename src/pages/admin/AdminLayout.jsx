import { useCallback, useEffect, useState } from 'react';
import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import RequireRole from '../../components/auth/RequireRole';
import CoralLogo from '../../components/CoralLogo';
import Icon from '../../components/Icon';
import { useAuth } from '../../context/AuthContext';
import { useEscToClose } from '../../hooks/useEscToClose';
import { ROUTES } from '../../routes';
import { ADMIN_INBOX_UPDATED } from '../../utils/adminEvents';
import { interact } from '../../utils/haptics';
import { usePageMeta } from '../../utils/pageMeta';
import { supabase } from '../../utils/supabaseClient';

const ADMIN_NAV = [
  { to: ROUTES.admin, label: 'Overview', end: true, icon: 'squares-four' },
  { to: ROUTES.adminInbox, label: 'Inbox', icon: 'envelope', badgeKey: 'inbox' },
  { to: ROUTES.adminUsers, label: 'Users', icon: 'users' },
  { to: ROUTES.adminPromos, label: 'Promo codes', icon: 'ticket' },
  { to: ROUTES.adminNewsletter, label: 'Newsletter', icon: 'paper-plane' },
  { to: ROUTES.adminCommunity, label: 'Community', icon: 'users' },
  { to: ROUTES.adminDiy, label: 'DIY images', icon: 'image', adminOnly: true },
];

function AdminLayoutInner() {
  const { isAdmin, user, signOut } = useAuth();
  const { pathname } = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [inboxCount, setInboxCount] = useState(0);
  const navItems = ADMIN_NAV.filter((item) => !item.adminOnly || isAdmin);

  usePageMeta({
    title: 'Admin',
    description: 'Nestbean admin center — inbox, users, promo codes, newsletter, community, and DIY images.',
  });

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  useEscToClose(drawerOpen, closeDrawer);

  const fetchInboxCount = useCallback(async () => {
    const { count } = await supabase
      .from('contact_submissions')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new');
    setInboxCount(count ?? 0);
  }, []);

  useEffect(() => {
    fetchInboxCount();
  }, [fetchInboxCount, pathname]);

  useEffect(() => {
    const handleInboxUpdated = () => { fetchInboxCount(); };
    window.addEventListener(ADMIN_INBOX_UPDATED, handleInboxUpdated);
    return () => window.removeEventListener(ADMIN_INBOX_UPDATED, handleInboxUpdated);
  }, [fetchInboxCount]);

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
      <a href="#admin-content" className="admin-skip-link">
        Skip to admin content
      </a>

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
            {navItems.map(({ to, label, end, icon, badgeKey }) => (
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
                {badgeKey === 'inbox' && inboxCount > 0 ? (
                  <span className="admin-nav-badge" aria-label={`${inboxCount} new messages`}>
                    {inboxCount}
                  </span>
                ) : null}
              </NavLink>
            ))}
          </nav>

          <Link to={ROUTES.account} className="admin-back" onClick={handleNavClick}>
            ← Back to app
          </Link>
        </aside>

        <main className="admin-main" id="admin-content" tabIndex={-1}>
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
