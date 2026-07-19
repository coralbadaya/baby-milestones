import { Navigate, useNavigate } from 'react-router-dom';
import AuthForm, { AuthPageShell, AuthSwitchLink } from '../components/auth/AuthForm';
import { isEmailVerified, useAuth } from '../context/AuthContext';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';

function SignUp() {
  usePageMeta({
    title: 'Create Account',
    description: 'Join Yarn Trails — complimentary early-access membership included.',
  });
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  if (user && isEmailVerified(user)) {
    return <Navigate to={ROUTES.account} replace />;
  }
  if (user && !isEmailVerified(user)) {
    return <Navigate to={ROUTES.verifyEmail} state={{ email: user.email }} replace />;
  }

  const handleSubmit = async ({ email, password, displayName }) => {
    const { session } = await signUp({ email, password, displayName: displayName || undefined });
    if (session) {
      navigate(ROUTES.account, { replace: true });
    } else {
      navigate(ROUTES.verifyEmail, { replace: true, state: { email } });
    }
  };

  return (
    <AuthPageShell
      title="Create your account"
      intro="We’ll send a verification code to your email. Start with a complimentary 7-day Premium preview — no card required during early access."
      footer={<AuthSwitchLink mode="signup" />}
    >
      <AuthForm mode="signup" onSubmit={handleSubmit} />
    </AuthPageShell>
  );
}

export default SignUp;
