import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthPageShell } from '../components/auth/AuthForm';
import OtpVerifyForm from '../components/auth/OtpVerifyForm';
import { isEmailVerified, useAuth } from '../context/AuthContext';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';

function VerifyEmail() {
  usePageMeta({
    title: 'Verify Email',
    description: 'Confirm your email when you are ready. You can use Yarn Trails in the meantime.',
    robots: 'noindex, nofollow',
  });

  const { user, verifyEmailOtp, resendSignupOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || user?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const next = location.state?.from || ROUTES.account;

  if (user && isEmailVerified(user)) {
    return <Navigate to={next} replace />;
  }

  const handleVerify = async ({ email: verifyEmail, token }) => {
    try {
      await verifyEmailOtp({ email: verifyEmail, token });
    } catch (err) {
      const msg = err?.message?.toLowerCase() || '';
      if (!user || !(msg.includes('already') || msg.includes('confirmed'))) {
        throw err;
      }
    }
    navigate(next, { replace: true });
  };

  return (
    <AuthPageShell
      title="Verify when you can"
      intro="We sent a 6-digit code. You already have an account — enter the code now, or skip and do it later from Account."
    >
      <OtpVerifyForm
        email={email}
        onEmailChange={setEmail}
        onVerify={handleVerify}
        onResend={resendSignupOtp}
      />
      <p className="auth-switch">
        <Link
          to={user ? next : ROUTES.login}
          onClick={() => interact('tap', 'light')}
        >
          {user ? 'Continue without verifying' : 'Back to sign in'}
        </Link>
      </p>
    </AuthPageShell>
  );
}

export default VerifyEmail;
