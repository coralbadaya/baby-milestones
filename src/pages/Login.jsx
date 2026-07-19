import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm, { AuthPageShell, AuthSwitchLink } from '../components/auth/AuthForm';
import { isEmailVerified, useAuth } from '../context/AuthContext';
import { isEmailNotConfirmedError } from '../utils/auth';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';

function Login() {
  usePageMeta({ title: 'Sign In', description: 'Sign in to your Yarn Trails account.' });
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || ROUTES.account;

  if (user && isEmailVerified(user)) {
    return <Navigate to={from} replace />;
  }
  if (user && !isEmailVerified(user)) {
    return <Navigate to={ROUTES.verifyEmail} state={{ email: user.email }} replace />;
  }

  const handleSubmit = async ({ email, password }) => {
    try {
      await signIn({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      if (isEmailNotConfirmedError(err)) {
        navigate(ROUTES.verifyEmail, { replace: true, state: { email } });
        return;
      }
      throw err;
    }
  };

  return (
    <AuthPageShell
      title="Welcome back"
      intro="Sign in to sync your membership and saved progress."
      footer={<AuthSwitchLink mode="login" />}
    >
      <AuthForm mode="login" onSubmit={handleSubmit} />
      <p className="auth-forgot">
        <Link to={ROUTES.premium}>Explore membership</Link>
      </p>
    </AuthPageShell>
  );
}

export default Login;
