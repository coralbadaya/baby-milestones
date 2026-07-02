import { useState } from 'react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PageSection from '../components/PageSection';
import EditorialBand from '../components/EditorialBand';
import TrustStrip from '../components/TrustStrip';
import Icon from '../components/Icon';
import { interact } from '../utils/haptics';
import { PLANS } from '../constants/premium';
import { useAuth } from '../context/AuthContext';
import { membershipExpiry, membershipLabel } from '../utils/membership';
import { readLocalPremium } from '../utils/localPremium';
import { formatPremiumRateLine } from '../utils/premiumPricing';
import { ROUTES } from '../routes';
import { usePageMeta } from '../utils/pageMeta';
import { startCheckout } from '../utils/stripeCheckout';

function Premium() {
  usePageMeta({
    title: 'Nestbean Plus — AI Baby Book',
    description: 'Turn milestones into their story. Basic is free forever; Plus unlocks unlimited AI stories, the full flip-book, and HD memories.',
  });

  const {
    user, isPremium, membership, loading, redeemPromoCode, startLocalTrial,
  } = useAuth();

  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState(null);
  const [promoMessage, setPromoMessage] = useState(null);
  const [busy, setBusy] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  const plusPlan = PLANS.plus;
  const expiry = membershipExpiry(membership);
  const label = membershipLabel(membership);
  const pricing = formatPremiumRateLine();
  const isMember = isPremium && user;
  const isLocalPreview = isPremium && !user;
  const localPreviewEnds = isLocalPreview && readLocalPremium().trialEndsAt
    ? new Date(readLocalPremium().trialEndsAt).toLocaleDateString()
    : null;
  const showGuestHeroCtas = !loading && !user;

  const handleRedeem = async (e) => {
    e.preventDefault();
    if (!promoCode.trim() || !user) return;

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

  const handleCheckout = async (sku) => {
    setCheckoutError(null);
    interact('tap', 'light');
    if (!user) {
      window.location.href = `${ROUTES.signup}?next=${encodeURIComponent(ROUTES.premium)}`;
      return;
    }
    setBusy(true);
    try {
      await startCheckout(sku);
    } catch (err) {
      setCheckoutError(err.message || 'Checkout unavailable — try a promo code during early access.');
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
        eyebrow="AI baby book"
        title="Turn milestones into their story"
        subtitle="Log photos and milestones free forever. Plus unlocks the magic — AI stories, the full flip-book, and keepsakes worth sharing."
        size="md"
      >
        {showGuestHeroCtas && (
          <div className="welcome-hero__actions welcome-hero__actions--premium">
            <Link
              to={ROUTES.signup}
              className="btn-primary welcome-hero__cta"
              onClick={() => interact('tap', 'light')}
            >
              {isLocalPreview ? 'Create account — save your preview' : 'Start free — Basic is forever'}
            </Link>
            {!isLocalPreview && (
              <button type="button" className="btn-ghost welcome-hero__cta" onClick={onLocalTrial}>
                Preview Plus locally
              </button>
            )}
          </div>
        )}
      </PageHero>

      <EditorialBand tagline="The art of early motherhood" />

      <PageSection surface="white" width="wide" className="page-body--with-mobile-nav">
        <section className="premium-pricing">
          {loading ? (
            <p className="premium-loading">Loading membership…</p>
          ) : isMember ? (
            <div className="premium-status card-accent-top">
              <h2 className="font-display">You&apos;re on Plus — {label}</h2>
              {expiry && (
                <p className="premium-status__trial">
                  Access through {new Date(expiry).toLocaleDateString()}
                </p>
              )}
              {membership?.status === 'comp' && (
                <p className="premium-status__trial">
                  Founding member — complimentary Plus during early access
                </p>
              )}
              {user && (
                <Link to={ROUTES.account} className="btn-ghost" onClick={() => interact('tap', 'light')}>
                  Manage account
                </Link>
              )}
            </div>
          ) : (
            <>
              {isLocalPreview && (
                <p className="premium-plan__preview-banner" role="status">
                  You&apos;re previewing Plus on this device
                  {localPreviewEnds ? ` through ${localPreviewEnds}` : ''}.
                  {' '}Create an account to save progress across devices.
                </p>
              )}
              <div className="premium-compare">
                <div className="premium-compare__col card-accent-top">
                  <p className="premium-plan__eyebrow">{PLANS.basic.name}</p>
                  <p className="premium-plan__price">
                    <span className="premium-plan__amount">Free</span>
                    <span className="premium-plan__period"> forever</span>
                  </p>
                  <ul className="premium-plan__features">
                    {PLANS.basic.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>
                  {!user && (
                    <Link
                      to={ROUTES.signup}
                      className="btn-ghost premium-plan__cta"
                      onClick={() => interact('tap', 'light')}
                    >
                      Create free account
                    </Link>
                  )}
                </div>

                <div className="premium-compare__col premium-compare__col--featured card-accent-top">
                  <p className="premium-plan__eyebrow">{plusPlan.name}</p>
                  <p className="premium-plan__badge">First Year Plan — {pricing.savingsPct}% off monthly</p>
                  <p className="premium-plan__price">
                    <span className="premium-plan__amount">{pricing.annual}</span>
                    <span className="premium-plan__period">/yr</span>
                  </p>
                  <p className="premium-plan__annual">{pricing.line}</p>
                  <p className="premium-plan__region">{pricing.regionNote}</p>
                  <ul className="premium-plan__features">
                    {plusPlan.features.map((f) => (
                      <li key={f}>{f}</li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    className="btn-primary premium-plan__cta"
                    disabled={busy}
                    onClick={() => handleCheckout('plus_annual')}
                  >
                    Get First Year Plan
                  </button>
                  <button
                    type="button"
                    className="btn-ghost premium-plan__local"
                    disabled={busy}
                    onClick={() => handleCheckout('plus_monthly')}
                  >
                    {pricing.monthly}/mo — no trial
                  </button>
                  <button
                    type="button"
                    className="btn-ghost premium-plan__local"
                    disabled={busy}
                    onClick={() => handleCheckout('first_year_bundle')}
                  >
                    Bundle + hardcover — {pricing.bundle}
                  </button>
                  <button
                    type="button"
                    className="btn-ghost premium-plan__local"
                    disabled={busy}
                    onClick={() => handleCheckout('gift_subscription')}
                  >
                    Gift a first year — {pricing.gift}
                  </button>

                  {checkoutError && <p className="auth-error" role="alert">{checkoutError}</p>}

                  {!user && <TrustStrip className="trust-strip--premium" showPrivacyNote />}

                  {user && (
                    <>
                      <form className="premium-promo-form" onSubmit={handleRedeem}>
                        <input
                          type="text"
                          value={promoCode}
                          onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                          placeholder="Access or gift code"
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
                  )}

                  {!user && (
                    <>
                      <button
                        type="button"
                        className="btn-ghost premium-plan__local premium-plan__local--prominent"
                        onClick={onLocalTrial}
                      >
                        Preview Plus without an account
                      </button>
                      <p className="premium-plan__note">
                        7-day trial on annual only — offered after your first AI story.{' '}
                        <Link to={ROUTES.login}>Sign in</Link>.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <p className="premium-trial-note">
                <Icon name="sparkles" size={18} />
                Generate one full AI story free — then unlock Plus when the moment lands.
              </p>
            </>
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
