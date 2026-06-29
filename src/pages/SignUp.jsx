import { Navigate, useNavigate } from 'react-router-dom';
import AuthForm, { AuthPageShell, AuthSwitchLink } from '../components/auth/AuthForm';
import { useAuth } from '../context/AuthContext';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';

function SignUp() {
  usePageMeta({
    title: 'Create Account',
    description: 'Join Nestbean — complimentary early-access membership included.',
  });
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to={ROUTES.account} replace />;

  const handleSubmit = async ({ email, password, displayName }) => {
    await signUp({ email, password, displayName: displayName || undefined });
    navigate(ROUTES.account, { replace: true });
  };

  return (
    <AuthPageShell
      title="Create your account"
      intro="Start with a complimentary 7-day Premium preview. No card required during early access."
      footer={<AuthSwitchLink mode="signup" />}
    >
      <AuthForm mode="signup" onSubmit={handleSubmit} />
    </AuthPageShell>
  );
}

export default SignUp;
