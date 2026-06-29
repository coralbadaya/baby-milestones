import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm, { AuthPageShell, AuthSwitchLink } from '../components/auth/AuthForm';
import { useAuth } from '../context/AuthContext';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';

function Login() {
  usePageMeta({ title: 'Sign In', description: 'Sign in to your Nestbean account.' });
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || ROUTES.account;

  if (user) return <Navigate to={from} replace />;

  const handleSubmit = async ({ email, password }) => {
    await signIn({ email, password });
    navigate(from, { replace: true });
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
