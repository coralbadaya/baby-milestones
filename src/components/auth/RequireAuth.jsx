import { Navigate, useLocation } from 'react-router-dom';
import { isEmailVerified, useAuth } from '../../context/AuthContext';
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

  if (!isEmailVerified(user)) {
    return (
      <Navigate
        to={ROUTES.verifyEmail}
        state={{ email: user.email }}
        replace
      />
    );
  }

  return children;
}

export default RequireAuth;
