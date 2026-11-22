import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import RequireAuth from '../components/auth/RequireAuth';
import Icon from '../components/Icon';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import SectionHeader from '../components/SectionHeader';
import { useAuth } from '../context/AuthContext';
import { useBabyIdentity } from '../hooks/useBabyIdentity';
import { useFirstMoments } from '../hooks/useFirstMoments';
import { useMilestoneChecks } from '../hooks/useMilestoneChecks';
import { countCapturedMoments } from '../data/firsts';
import { VACCINE_SCHEDULES } from '../data/vaccines';
import { supabase } from '../utils/supabaseClient';
import { membershipExpiry, membershipLabel } from '../utils/membership';
import { isEmailVerified } from '../utils/auth';
import { formatBabyAgeLine } from '../utils/babyAge';
import { checkedIds } from '../utils/cloudMerge';
import { computeVaccineStats, getCurrentMonthFromBirthDate } from '../utils/vaccines';
import { interact } from '../utils/haptics';
import { usePageMeta } from '../utils/pageMeta';
import { ROUTES } from '../routes';
import { BRAND_NAME } from '../constants/brand';

const QUICK_LINKS = [
  { to: ROUTES.home, icon: 'home', title: 'Today', meta: 'Your daily dashboard' },
  { to: ROUTES.baby, icon: 'baby', title: 'My Baby', meta: 'Milestones & firsts' },
  { to: ROUTES.babyBookTab('home'), icon: 'book-open', title: 'Baby book', meta: 'Stories · Ideas · Album' },
  { to: ROUTES.babyMoments, icon: 'camera', title: 'Life firsts', meta: 'Photo journal' },
  { to: ROUTES.vaccination, icon: 'medical', title: 'Vaccination', meta: 'Schedules & records' },
  { to: ROUTES.momCare, icon: 'heart', title: 'My Care', meta: 'Postpartum & self-care' },
  { to: ROUTES.essentials, icon: 'shopping-cart', title: 'Essentials', meta: 'Shopping & travel' },
  { to: ROUTES.communityTab('feed'), icon: 'speech-bubble', title: 'Community', meta: 'Feed & tips' },
  { to: ROUTES.progress, icon: 'chart-bar', title: 'Progress', meta: 'Milestone journey' },
  { to: ROUTES.guides, icon: 'book-open', title: 'Guides', meta: 'Articles & research' },
];

function readVaccineSnapshot(birthDate) {
  let scheduleType = 'cdc_us';
  let recordsRoot = {};
  try {
    scheduleType = localStorage.getItem('babyVaccineScheduleType') || scheduleType;
    const raw = localStorage.getItem('babyVaccineRecords');
    recordsRoot = raw ? JSON.parse(raw) : {};
  } catch {
    /* keep defaults */
  }
  const items = VACCINE_SCHEDULES[scheduleType]?.items ?? [];
  const month = getCurrentMonthFromBirthDate(birthDate);
  const stats = computeVaccineStats(items, recordsRoot[scheduleType] ?? {}, month);
  return { done: stats.done, total: stats.total, due: stats.due + stats.overdue };
}

function AccountSnapshot({ tiles }) {
  return (
    <div className="account-snapshot" role="list">
      {tiles.map((tile) => (
        <div key={tile.label} className="account-snapshot__tile card-accent-top" role="listitem">
          <Icon name={tile.icon} size={22} className="account-snapshot__icon" />
          <p className="account-snapshot__value">{tile.value}</p>
          <p className="account-snapshot__label">{tile.label}</p>
          {tile.hint ? <p className="account-snapshot__hint">{tile.hint}</p> : null}
        </div>
      ))}
    </div>
  );
}

function AccountContent() {
  usePageMeta({
    title: 'My account',
    description: 'Your Yarn Trails membership, baby profile, and shortcuts across the app.',
    robots: 'noindex, nofollow',
  });

  const {
    user, profile, membership, isPremium, isAdmin, isStaff,
    signOut, updateDisplayName, redeemPromoCode, refreshProfile,
  } = useAuth();
  const { birthDate, setBirthDate, babyName, setBabyName, babyProfileId } = useBabyIdentity();
  const { checkedItems } = useMilestoneChecks(babyProfileId);
  const { firstMoments } = useFirstMoments(babyProfileId);

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
  const currentMonth = birthDate ? getCurrentMonthFromBirthDate(birthDate) : null;
  const ageLine = formatBabyAgeLine(birthDate);
  const vaccineSnap = useMemo(() => readVaccineSnapshot(birthDate), [birthDate]);
  const milestonesDone = checkedIds(checkedItems).length;
  const firstsDone = countCapturedMoments(firstMoments);
  const verified = isEmailVerified(user);
  const greetingName = displayName.trim() || profile?.display_name || user?.email?.split('@')[0] || 'there';

  const snapshotTiles = useMemo(() => {
    const membershipValue = isPremium ? label : 'Basic';
    return [
      {
        icon: 'sparkles',
        label: 'Membership',
        value: membershipValue,
        hint: isPremium && expiry
          ? `Through ${new Date(expiry).toLocaleDateString()}`
          : (isPremium && membership?.status === 'comp' ? 'Founding access' : 'See Plus below'),
      },
      {
        icon: 'baby',
        label: babyName?.trim() ? babyName.trim() : 'Baby profile',
        value: ageLine || 'Add birth date',
        hint: currentMonth ? `Tracking month ${currentMonth}` : 'Syncs across devices when signed in',
      },
      {
        icon: 'check',
        label: 'Milestones logged',
        value: milestonesDone.toLocaleString(),
        hint: 'Checked on month pages',
      },
      {
        icon: 'camera',
        label: 'Life firsts',
        value: `${firstsDone} saved`,
        hint: vaccineSnap.total
          ? `${vaccineSnap.done}/${vaccineSnap.total} vaccines recorded`
          : 'Photos & notes in My Baby',
      },
    ];
  }, [
    ageLine, babyName, currentMonth, expiry, firstsDone, isPremium, label,
    membership?.status, milestonesDone, vaccineSnap.done, vaccineSnap.total,
  ]);

  const clearFeedback = () => {
    setMessage(null);
    setError(null);
  };

  const handleSaveName = async (e) => {
    e.preventDefault();
    setBusy(true);
    clearFeedback();
    try {
      await updateDisplayName(displayName.trim());
      interact('check', 'success');
      setMessage('Display name saved.');
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
    clearFeedback();
    try {
      await redeemPromoCode(promoCode.trim());
      interact('check', 'success');
      setMessage('Access code applied.');
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
    clearFeedback();
    try {
      setBabyName(babyNameDraft.trim());
      setBirthDate(babyBirthDraft);
      interact('check', 'success');
      setMessage('Baby profile saved — Today and My Baby will personalize.');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleExport = async () => {
    setBusy(true);
    clearFeedback();
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
    clearFeedback();
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

  const handleRefreshMembership = async () => {
    if (user) await refreshProfile(user.id);
    setMessage('Membership status refreshed.');
  };

  const onLink = () => interact('tap', 'light');

  return (
    <>
      <PageHero
        imageKey="momCare"
        layout="split"
        size="md"
        eyebrow="Your space"
        title={`Hello, ${greetingName}`}
        subtitle="Membership, baby details, and one tap to anywhere in Yarn Trails."
      />

      <PageSection surface="ivory" width="wide" className="page-body--with-mobile-nav account-hub">
        {(message || error) && (
          <div
            className={`account-hub__toast${error ? ' account-hub__toast--error' : ''}`}
            role={error ? 'alert' : 'status'}
          >
            {error || message}
          </div>
        )}

        <AccountSnapshot tiles={snapshotTiles} />

        <div className="account-hub__layout">
          <div className="account-hub__main">
            <SectionHeader
              eyebrow="Navigate"
              title="Across the app"
              subtitle="The same journeys as the bottom bar — tuned for your account."
            />
            <div className="account-quick-links hub-quick-links account-quick-links--dense">
              {QUICK_LINKS.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="hub-quick-link card-accent-top card-hover-lift"
                  onClick={onLink}
                >
                  <Icon name={item.icon} size={20} />
                  <span>
                    <strong>{item.title}</strong>
                    <span className="hub-quick-link__meta">{item.meta}</span>
                  </span>
                </Link>
              ))}
            </div>

            <div className="account-panels">
              <section className="account-panel card-accent-top">
                <h2 className="account-panel__title">You</h2>
                <p className="account-panel__meta">{user?.email}</p>
                {!verified && (
                  <p className="account-panel__verify">
                    Verify when you can.{' '}
                    <Link to={ROUTES.verifyEmail} state={{ email: user?.email }} onClick={onLink}>
                      Enter the code from your email
                    </Link>
                    . You can use Yarn Trails in the meantime.
                  </p>
                )}
                <ul className="account-panel__facts">
                  <li>
                    <span>Email verified</span>
                    <span>{verified ? 'Yes' : 'Pending'}</span>
                  </li>
                  {profile?.created_at ? (
                    <li>
                      <span>Member since</span>
                      <span>{new Date(profile.created_at).toLocaleDateString()}</span>
                    </li>
                  ) : null}
                </ul>
                <form className="account-panel__form" onSubmit={handleSaveName}>
                  <label htmlFor="account-name" className="auth-field-label">Display name</label>
                  <input
                    id="account-name"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="account-input"
                    autoComplete="nickname"
                  />
                  <button type="submit" className="btn-primary account-panel__submit" disabled={busy}>
                    Save name
                  </button>
                </form>
              </section>

              <section className="account-panel card-accent-top">
                <h2 className="account-panel__title">Baby on this account</h2>
                <p className="account-panel__meta">
                  Used on Today, milestones, vaccination, and your baby book.
                </p>
                <form className="account-panel__form" onSubmit={handleSaveBaby}>
                  <label htmlFor="account-baby-name" className="auth-field-label">Name</label>
                  <input
                    id="account-baby-name"
                    type="text"
                    value={babyNameDraft}
                    onChange={(e) => setBabyNameDraft(e.target.value)}
                    className="account-input"
                    autoComplete="off"
                    placeholder="Optional"
                  />
                  <label htmlFor="account-baby-birth" className="auth-field-label">Birth date</label>
                  <input
                    id="account-baby-birth"
                    type="date"
                    value={babyBirthDraft}
                    onChange={(e) => setBabyBirthDraft(e.target.value)}
                    className="account-input"
                  />
                  <button type="submit" className="btn-primary account-panel__submit" disabled={busy}>
                    Save baby
                  </button>
                </form>
              </section>

              <section className="account-panel card-accent-top">
                <h2 className="account-panel__title">Privacy & data</h2>
                <p className="account-panel__meta">
                  JSON export includes profile, tracking, and vaccine records. Media paths are listed, not attached.
                </p>
                <button
                  type="button"
                  className="btn-ghost account-panel__submit account-panel__submit--block"
                  onClick={handleExport}
                  disabled={busy}
                >
                  Download my data
                </button>
                <details className="account-details">
                  <summary>Delete account</summary>
                  <p className="account-panel__meta">
                    Permanently removes your account, private photos, and voice notes. This cannot be undone.
                  </p>
                  {confirmDelete ? (
                    <div className="account-delete">
                      <button
                        type="button"
                        className="btn-primary account-delete-confirm"
                        onClick={handleDeleteAccount}
                        disabled={busy}
                      >
                        Delete permanently
                      </button>
                      <button
                        type="button"
                        className="btn-ghost"
                        onClick={() => setConfirmDelete(false)}
                        disabled={busy}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      className="btn-ghost account-delete-start"
                      onClick={() => setConfirmDelete(true)}
                    >
                      I want to delete my account
                    </button>
                  )}
                </details>
              </section>
            </div>
          </div>

          <aside className="account-hub__aside">
            <section className={`account-membership card-accent-top${isPremium ? ' account-membership--plus' : ''}`}>
              <div className="account-membership__head">
                <Icon name={isPremium ? 'sparkles' : 'user'} size={24} />
                <div>
                  <p className="account-membership__eyebrow">Membership</p>
                  <p className={`account-badge${isPremium ? ' account-badge--premium' : ''}`}>{label}</p>
                </div>
              </div>
              {expiry ? (
                <p className="account-expiry">Active until {new Date(expiry).toLocaleDateString()}</p>
              ) : null}
              {membership?.status === 'comp' ? (
                <p className="account-expiry">Early access — no charge during preview</p>
              ) : null}
              {!isPremium ? (
                <p className="account-hint">
                  Plus unlocks the baby book studio, cloud firsts, and premium guides.
                </p>
              ) : null}
              <Link
                to={ROUTES.premium}
                className="btn-primary account-membership__cta"
                onClick={onLink}
              >
                {isPremium ? 'View Plus benefits' : 'Explore Plus'}
              </Link>
              <button
                type="button"
                className="btn-ghost account-refresh"
                onClick={handleRefreshMembership}
              >
                Refresh status
              </button>
            </section>

            <section className="account-panel card-accent-top">
              <h2 className="account-panel__title">Access code</h2>
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

            {vaccineSnap.due > 0 && birthDate ? (
              <Link
                to={ROUTES.vaccination}
                className="account-nudge card-accent-top"
                onClick={onLink}
              >
                <Icon name="medical" size={20} />
                <span>
                  <strong>{vaccineSnap.due} vaccine{vaccineSnap.due === 1 ? '' : 's'} due</strong>
                  <span className="hub-quick-link__meta">Open vaccination tracker</span>
                </span>
              </Link>
            ) : null}

            {(isAdmin || isStaff) && (
              <Link
                to={ROUTES.admin}
                className="btn-primary account-admin-link"
                onClick={onLink}
              >
                Open admin center
              </Link>
            )}

            <nav className="account-legal" aria-label="Trust links">
              <Link to={ROUTES.privacy} onClick={onLink}>Privacy</Link>
              <Link to={ROUTES.medicalDisclaimer} onClick={onLink}>Medical disclaimer</Link>
              <Link to={ROUTES.cookies} onClick={onLink}>Cookies</Link>
              <Link to={ROUTES.feedback} onClick={onLink}>Feedback</Link>
            </nav>

            <button type="button" className="btn-ghost account-sign-out" onClick={handleSignOut}>
              Sign out of {BRAND_NAME}
            </button>
          </aside>
        </div>
      </PageSection>
    </>
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