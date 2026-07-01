import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../Icon';
import { interact } from '../../utils/haptics';
import { ROUTES } from '../../routes';

const RESEND_COOLDOWN_SEC = 60;

/**
 * @param {{
 *   email: string,
 *   onEmailChange?: (email: string) => void,
 *   onVerify: (values: { email: string, token: string }) => Promise<void>,
 *   onResend: (email: string) => Promise<void>,
 * }} props
 */
function OtpVerifyForm({ email, onEmailChange, onVerify, onResend }) {
  const [token, setToken] = useState('');
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return undefined;
    const id = setInterval(() => {
      setCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [cooldown]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedEmail = email.trim();
    const trimmedToken = token.trim();

    if (!trimmedEmail) {
      setError('Enter your email address.');
      return;
    }
    if (trimmedToken.length < 6) {
      setError('Enter the 6-digit code from your email.');
      return;
    }

    setError(null);
    setMessage(null);
    setSubmitting(true);
    interact('tap', 'light');

    try {
      await onVerify({ email: trimmedEmail, token: trimmedToken });
    } catch (err) {
      setError(err.message || 'Invalid or expired code.');
      interact('tap', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail || cooldown > 0) return;

    setError(null);
    setMessage(null);
    setResending(true);
    interact('tap', 'light');

    try {
      await onResend(trimmedEmail);
      setMessage('A new code was sent. Check your inbox.');
      setCooldown(RESEND_COOLDOWN_SEC);
    } catch (err) {
      setError(err.message || 'Could not resend code.');
      interact('tap', 'error');
    } finally {
      setResending(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="verify-email">Email</label>
        <input
          id="verify-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => onEmailChange?.(e.target.value)}
          readOnly={!onEmailChange}
          placeholder="you@example.com"
        />
      </div>

      <div className="auth-field">
        <label htmlFor="verify-otp">Verification code</label>
        <input
          id="verify-otp"
          className="auth-otp-input"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          pattern="[0-9]*"
          maxLength={6}
          required
          value={token}
          onChange={(e) => setToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
          placeholder="000000"
          aria-describedby="verify-otp-hint"
        />
        <p id="verify-otp-hint" className="auth-otp-hint">
          Enter the 6-digit code we sent to your email.
        </p>
      </div>

      {error && (
        <p className="auth-error" role="alert">
          <Icon name="warning" size={16} />
          {error}
        </p>
      )}

      {message && (
        <p className="auth-message" role="status">
          {message}
        </p>
      )}

      <button type="submit" className="btn-primary auth-submit" disabled={submitting}>
        {submitting ? 'Verifying…' : 'Verify email'}
      </button>

      <p className="auth-resend">
        {cooldown > 0 ? (
          <>Resend code in {cooldown}s</>
        ) : (
          <button
            type="button"
            className="auth-resend-btn"
            onClick={handleResend}
            disabled={resending || !email.trim()}
          >
            {resending ? 'Sending…' : 'Resend code'}
          </button>
        )}
      </p>

      <p className="auth-switch">
        <Link to={ROUTES.login} onClick={() => interact('tap', 'light')}>
          Back to sign in
        </Link>
      </p>
    </form>
  );
}

export default OtpVerifyForm;
