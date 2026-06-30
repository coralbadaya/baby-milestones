import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import EditorialBand from '../components/EditorialBand';
import { interact } from '../utils/haptics';
import { PLANS } from '../constants/premium';
import { useAuth } from '../context/AuthContext';
import { membershipExpiry, membershipLabel } from '../utils/membership';
import { ROUTES } from '../routes';
import { usePageMeta } from '../utils/pageMeta';

function Premium() {
  usePageMeta({
    title: 'Early Access Membership',
    description: 'Join Nestbean early access — complimentary Premium preview for founding members.',
  });

  const {
    user, isPremium, membership, loading, redeemPromoCode, startLocalTrial,
  } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState(null);
  const [promoMessage, setPromoMessage] = useState(null);
  const [busy, setBusy] = useState(false);

  const plan = PLANS.premium;
  const expiry = membershipExpiry(membership);
  const label = membershipLabel(membership);

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!promoCode.trim()) return;
    if (!user) return;

    setBusy(true);
    setPromoError(null);
    setPromoMessage(null);
    interact('tap', 'light');

    try {
      await redeemPromoCode(promoCode.trim());
      interact('check', 'success');
      setPromoMessage('Access code applied.');
      setPromoCode('');
    } catch (err) {
      setPromoError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const onLocalTrial = () => {
    interact('tap', 'light');
    startLocalTrial();
  };

  return (
    <div className="premium-page">
      <PageHero
        imageKey="premium"
        layout="split"
        eyebrow="Early Access"
        title="Quiet luxury for your first years"
        subtitle="Editorial guides, curated edits, and concierge depth — built for mothers who expect more."
        size="md"
      />

      <EditorialBand tagline="The art of early motherhood" />

      <PageSection surface="ivory" width="wide" className="page-body--with-mobile-nav">
      <section className="premium-pricing">
        {loading ? (
          <p className="premium-loading">Loading membership…</p>
        ) : isPremium ? (
          <div className="premium-status card-accent-top">
            <h2 className="font-display">You&apos;re in — {label}</h2>
            {expiry && (
              <p className="premium-status__trial">
                Access through {new Date(expiry).toLocaleDateString()}
              </p>
            )}
            {membership?.status === 'comp' && (
              <p className="premium-status__trial">
                Founding member — complimentary during early access
              </p>
            )}
            {user && (
              <Link to={ROUTES.account} className="btn-ghost" onClick={() => interact('tap', 'light')}>
                Manage account
              </Link>
            )}
          </div>
        ) : (
          <div className="premium-plan card-accent-top">
            <p className="premium-plan__eyebrow">Early access membership</p>
            <p className="premium-plan__price">
              <span className="premium-plan__amount">Complimentary</span>
              <span className="premium-plan__period"> during preview</span>
            </p>
            <p className="premium-plan__annual">
              Founding rate after launch: £{plan.priceMonthly}/mo or £{plan.priceAnnual}/yr
            </p>
            <ul className="premium-plan__features">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>

            {user ? (
              <>
                <p className="premium-plan__note">
                  Your complimentary trial may have ended. Redeem a founding access code below
                  or contact us for early access.
                </p>
                <form className="premium-promo-form" onSubmit={handleRedeem}>
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                    placeholder="Founding access code"
                    aria-label="Access code"
                    className="premium-promo-input"
                  />
                  <button type="submit" className="btn-primary" disabled={busy}>
                    Redeem
                  </button>
                </form>
                {promoMessage && <p className="premium-promo-success" role="status">{promoMessage}</p>}
                {promoError && <p className="auth-error" role="alert">{promoError}</p>}
              </>
            ) : (
              <>
                <Link
                  to={ROUTES.signup}
                  className="btn-primary premium-plan__cta"
                  onClick={() => interact('tap', 'light')}
                >
                  Create account — {plan.trialDays}-day preview
                </Link>
                <p className="premium-plan__note">
                  No card required during early access. Already a member?{' '}
                  <Link to={ROUTES.login}>Sign in</Link>.
                </p>
                <button type="button" className="btn-ghost premium-plan__local" onClick={onLocalTrial}>
                  Preview locally without an account
                </button>
              </>
            )}
          </div>
        )}

        <p className="premium-back">
          <Link to={ROUTES.home} onClick={() => interact('tap', 'light')}>
            ← Back to Today
          </Link>
        </p>
      </section>
      </PageSection>
    </div>
  );
}

export default Premium;
