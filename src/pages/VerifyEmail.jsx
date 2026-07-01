import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthPageShell } from '../components/auth/AuthForm';
import OtpVerifyForm from '../components/auth/OtpVerifyForm';
import { isEmailVerified, useAuth } from '../context/AuthContext';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';

function VerifyEmail() {
  usePageMeta({
    title: 'Verify Email',
    description: 'Confirm your email to activate your Nestbean account.',
  });

  const { user, verifyEmailOtp, resendSignupOtp } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const initialEmail = location.state?.email || user?.email || '';
  const [email, setEmail] = useState(initialEmail);

  if (user && isEmailVerified(user)) {
    return <Navigate to={ROUTES.account} replace />;
  }

  const handleVerify = async ({ email: verifyEmail, token }) => {
    await verifyEmailOtp({ email: verifyEmail, token });
    navigate(ROUTES.account, { replace: true });
  };

  return (
    <AuthPageShell
      title="Verify your email"
      intro="We sent a 6-digit code to your inbox. Enter it below to activate your account and start your complimentary Premium preview."
    >
      <OtpVerifyForm
        email={email}
        onEmailChange={setEmail}
        onVerify={handleVerify}
        onResend={resendSignupOtp}
      />
    </AuthPageShell>
  );
}

export default VerifyEmail;
