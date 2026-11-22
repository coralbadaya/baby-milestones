import { useEffect } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm, { AuthPageShell } from '../components/auth/AuthForm';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../utils/analytics';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';

function Login() {
  const location = useLocation();
  const isSignupPath = location.pathname === ROUTES.signup;
  usePageMeta({
    title: isSignupPath ? 'Create Account' : 'Sign In',
    description: 'Sign in or create a Yarn Trails account with your email.',
    robots: 'noindex, nofollow',
  });
  const { continueWithPassword, user } = useAuth();
  const navigate = useNavigate();
  const from = location.state?.from || ROUTES.account;

  useEffect(() => {
    if (isSignupPath) trackEvent('signup_view');
  }, [isSignupPath]);

  if (user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async ({ email, password, displayName }) => {
    const result = await continueWithPassword({ email, password, displayName });
    trackEvent(result.action === 'signup' ? 'signup_completed' : 'login_completed');
    if (!result.session) {
      navigate(ROUTES.verifyEmail, { replace: true, state: { email, from } });
      return;
    }
    navigate(from, { replace: true });
  };

  return (
    <AuthPageShell
      title="Welcome"
      intro="Sign in or create an account with your email. We’ll send a code you can use later to verify — you can start now."
    >
      <AuthForm onSubmit={handleSubmit} />
      <p className="auth-forgot">
        <Link to={ROUTES.premium}>Explore membership</Link>
      </p>
    </AuthPageShell>
  );
}

export default Login;
