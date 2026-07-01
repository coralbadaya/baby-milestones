import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes';

/**
 * @param {{ children: import('react').ReactNode, role?: 'admin'|'staff' }} props
 */
function RequireRole({ children, role = 'admin' }) {
  const { user, loading, profileLoading, isAdmin, isStaff } = useAuth();

  if (loading || (user && profileLoading)) {
    return <div className="auth-loading">Loading…</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} replace />;
  }

  const allowed = role === 'staff' ? isStaff : isAdmin;
  if (!allowed) {
    return <Navigate to={ROUTES.home} replace />;
  }

  return children;
}

export default RequireRole;
