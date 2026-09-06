import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import RequireAuth from '../components/auth/RequireAuth';
import Icon from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { useBabyIdentity } from '../hooks/useBabyIdentity';
import { supabase } from '../utils/supabaseClient';
import { membershipExpiry, membershipLabel } from '../utils/membership';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';
import { BRAND_NAME } from '../constants/brand';

function AccountContent() {
  usePageMeta({ title: 'Account', description: 'Manage your Yarn Trails membership and profile.', robots: 'noindex, nofollow' });
  const {
    user, profile, membership, isPremium, isAdmin, isStaff,
    signOut, updateDisplayName, redeemPromoCode, refreshProfile,
  } = useAuth();
  const { birthDate, setBirthDate, babyName, setBabyName } = useBabyIdentity();

  const [displayName, setDisplayName] = useState(profile?.display_name || '');
  const [babyNameDraft, setBabyNameDraft] = useState(babyName || '');
  const [babyBirthDraft, setBabyBirthDraft] = useState(birthDate || '');
  const [promoCode, setPromoCode] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (profile?.display_name) setDisplayName(profile.display_name);
  }, [profile?.display_name]);

  useEffect(() => {
    setBabyNameDraft(babyName || '');
    setBabyBirthDraft(birthDate || '');
  }, [babyName, birthDate]);

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

  const handleSaveBaby = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      setBabyName(babyNameDraft.trim());
      setBirthDate(babyBirthDraft);
      interact('check', 'success');
      setMessage('Baby profile updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleExport = async () => {
    setBusy(true);
    setError(null);
    try {
      const { data, error: exportError } = await supabase.rpc('export_my_data');
      if (exportError) throw exportError;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'yarntrails-data.json';
      a.click();
      URL.revokeObjectURL(url);
      setMessage('Download started.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteAccount = async () => {
    setBusy(true);
    setError(null);
    try {
      const { data, error: delError } = await supabase.functions.invoke('delete-my-account', {
        body: { confirm: true },
      });
      if (delError) throw delError;
      if (data?.error) throw new Error(data.error);
      interact('tap', 'light');
      await signOut();
    } catch (err) {
      setError(err.message || 'Could not delete account.');
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

      <section className="account-card">
        <h2>Baby</h2>
        <form onSubmit={handleSaveBaby}>
          <label htmlFor="account-baby-name" className="auth-field-label">Name</label>
          <input
            id="account-baby-name"
            type="text"
            value={babyNameDraft}
            onChange={(e) => setBabyNameDraft(e.target.value)}
            className="account-input"
            autoComplete="off"
          />
          <label htmlFor="account-baby-birth" className="auth-field-label">Birth date</label>
          <input
            id="account-baby-birth"
            type="date"
            value={babyBirthDraft}
            onChange={(e) => setBabyBirthDraft(e.target.value)}
            className="account-input"
          />
          <button type="submit" className="btn-primary account-save" disabled={busy}>
            Save baby
          </button>
        </form>
      </section>

      <section className="account-card">
        <h2>Your data</h2>
        <p className="account-hint">
          Download a copy of your profile, tracking, and vaccine records. Photos and voice files are listed by path, not included as binaries.
        </p>
        <button type="button" className="btn-ghost" onClick={handleExport} disabled={busy}>
          Download my data
        </button>
        {confirmDelete ? (
          <div className="account-delete">
            <p className="account-hint">
              This permanently deletes your account, private photos, and voice notes. Tracking cannot be recovered.
            </p>
            <button type="button" className="btn-primary account-delete-confirm" onClick={handleDeleteAccount} disabled={busy}>
              Delete permanently
            </button>
            <button type="button" className="btn-ghost" onClick={() => setConfirmDelete(false)} disabled={busy}>
              Cancel
            </button>
          </div>
        ) : (
          <button type="button" className="btn-ghost account-delete-start" onClick={() => setConfirmDelete(true)}>
            Delete account
          </button>
        )}
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
        <p className="account-feedback-link">
          <Link to={ROUTES.feedback} onClick={() => interact('tap', 'light')}>
            Share feedback
          </Link>
        </p>
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
