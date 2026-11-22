import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../routes';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="auth-loading">Loading…</div>;
  }

  if (!user) {
    return <Navigate to={ROUTES.login} state={{ from: location.pathname }} replace />;
  }

  return children;
}

export default RequireAuth;
