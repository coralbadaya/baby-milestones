import { useState } from 'react';
import { DEV_AUTH_ASSIST_ENABLED, TEST_ADMIN, TEST_USER } from '../../constants/devTestAuth';

/**
 * @param {{
 *   onFillCredentials?: (values: { email: string, password: string, displayName?: string }) => void,
 *   onFillOtp?: (otp: string) => void,
 *   email?: string,
 *   fetchOtp?: (email: string) => Promise<string>,
 * }} props
 */
function DevAuthAssist({ onFillCredentials, onFillOtp, email = '', fetchOtp }) {
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState(null);

  if (!DEV_AUTH_ASSIST_ENABLED) return null;

  const pullOtp = async () => {
    const target = email.trim();
    if (!target || !fetchOtp) {
      setNote('Enter a @mailinator.com email first, then send or resend the code.');
      return;
    }
    setBusy(true);
    setNote(null);
    try {
      const otp = await fetchOtp(target);
      onFillOtp?.(otp);
      setNote(`Filled code ${otp} from Mailinator.`);
    } catch (err) {
      setNote(err.message || 'Could not fetch OTP.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-dev-assist" data-testid="dev-auth-assist">
      <p className="auth-dev-assist__label">Dev shortcuts</p>
      <div className="auth-dev-assist__row">
        {onFillCredentials ? (
          <>
            <button
              type="button"
              className="auth-dev-assist__btn"
              onClick={() => onFillCredentials(TEST_USER)}
            >
              {TEST_USER.label}
            </button>
            <button
              type="button"
              className="auth-dev-assist__btn"
              onClick={() => onFillCredentials(TEST_ADMIN)}
            >
              {TEST_ADMIN.label}
            </button>
          </>
        ) : null}
        {onFillOtp && fetchOtp ? (
          <button type="button" className="auth-dev-assist__btn" onClick={pullOtp} disabled={busy}>
            {busy ? 'Fetching…' : 'Fill OTP from Mailinator'}
          </button>
        ) : null}
      </div>
      {note ? <p className="auth-dev-assist__note">{note}</p> : null}
    </div>
  );
}

export default DevAuthAssist;