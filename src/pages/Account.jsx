import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RequireAuth from '../components/auth/RequireAuth';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { membershipExpiry, membershipLabel } from '../utils/membership';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';
import { BRAND_NAME } from '../constants/brand';

function AccountContent() {
  usePageMeta({ title: 'Account', description: 'Manage your Yarn Trails membership and profile.' });
  const {
    user, profile, membership, isPremium, isAdmin, isStaff,
    signOut, updateDisplayName, redeemPromoCode, refreshProfile,
  } = useAuth();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile?.display_name) setDisplayName(profile.display_name);
  }, [profile?.display_name]);

  const expiry = membershipExpiry(membership);
  const label = membershipLabel(membership);

  const handleSaveName = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await updateDisplayName(displayName.trim());
      interact('check', 'success');
      setMessage('Profile updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await redeemPromoCode(promoCode.trim());
      interact('check', 'success');
      setMessage('Access code applied successfully.');
      setPromoCode('');
    } catch (err) {
      setError(err.message);
      interact('tap', 'error');
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    interact('tap', 'light');
    await signOut();
  };

  const handleRefresh = async () => {
    if (user) await refreshProfile(user.id);
    setMessage('Membership refreshed.');
  };

  return (
    <div className="account-page fade-in">
      <header className="account-header">
        <Icon name="heart" size={36} className="account-icon" />
        <h1 className="font-display">Your account</h1>
        <p className="account-email">{user?.email}</p>
      </header>

      <section className="account-card card-accent-top">
        <h2>Membership</h2>
        <div className="account-membership-row">
          <span className={`account-badge${isPremium ? ' account-badge--premium' : ''}`}>
            {label}
          </span>
          {expiry && (
            <span className="account-expiry">
              Until {new Date(expiry).toLocaleDateString()}
            </span>
          )}
          {membership?.status === 'comp' && (
            <span className="account-expiry">Early access — no charge during preview</span>
          )}
        </div>
        {!isPremium && (
          <p className="account-hint">
            Redeem a founding access code or visit{' '}
            <Link to={ROUTES.premium}>membership</Link> to learn more.
          </p>
        )}
        <button type="button" className="btn-ghost account-refresh" onClick={handleRefresh}>
          Refresh status
        </button>
      </section>

      <section className="account-card">
        <h2>Redeem access code</h2>
        <form className="account-promo-form" onSubmit={handleRedeem}>
          <input
            type="text"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder="e.g. FOUNDING30"
            aria-label="Access code"
            className="account-promo-input"
          />
          <button type="submit" className="btn-primary" disabled={busy}>
            Redeem
          </button>
        </form>
      </section>

      <section className="account-card">
        <h2>Profile</h2>
        <form onSubmit={handleSaveName}>
          <label htmlFor="account-name" className="auth-field-label">Display name</label>
          <input
            id="account-name"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="account-input"
          />
          <button type="submit" className="btn-primary account-save" disabled={busy}>
            Save
          </button>
        </form>
      </section>

      {(isAdmin || isStaff) && (
        <section className="account-card">
          <h2>Team</h2>
          <Link
            to={ROUTES.admin}
            className="btn-primary account-admin-link"
            onClick={() => interact('tap', 'light')}
          >
            Open admin center
          </Link>
        </section>
      )}

      {message && <p className="account-message" role="status">{message}</p>}
      {error && <p className="auth-error" role="alert">{error}</p>}

      <footer className="account-footer">
        <button type="button" className="btn-ghost" onClick={handleSignOut}>
          Sign out of {BRAND_NAME}
        </button>
      </footer>
    </div>
  );
}

function Account() {
  return (
    <RequireAuth>
      <AccountContent />
    </RequireAuth>
  );
}

export default Account;
