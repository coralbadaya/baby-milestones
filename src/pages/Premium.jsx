import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import { interact } from '../utils/haptics';
import { PLANS } from '../constants/premium';
import { usePremium } from '../hooks/usePremium';
import { ROUTES } from '../routes';
import { usePageMeta } from '../utils/pageMeta';

function Premium() {
  usePageMeta({
    title: 'Premium',
    description: 'Unlock additional tools and a calmer, more personal experience with Nestbean Premium.',
  });
  const { isPremium, startTrial, clearPremium, trialEndsAt } = usePremium();
  const plan = PLANS.premium;

  const onTrial = () => {
    interact('tap', 'light');
    startTrial();
  };

  return (
    <div className="premium-page">
      <PageHero
        imageKey="premium"
        eyebrow="Nestbean Premium"
        title="Quiet luxury for your first years"
        subtitle="Editorial guides, curated edits, and concierge depth — built for mothers who expect more."
        size="md"
      />

      <section className="premium-pricing">
        {isPremium ? (
          <div className="premium-status card-accent-top">
            <h2 className="font-display">You&apos;re on Premium</h2>
            {trialEndsAt && (
              <p className="premium-status__trial">
                Trial active until {new Date(trialEndsAt).toLocaleDateString()}
              </p>
            )}
            <button
              type="button"
              className="btn-ghost"
              onClick={() => { interact('tap', 'light'); clearPremium(); }}
            >
              Reset to free (demo)
            </button>
          </div>
        ) : (
          <div className="premium-plan card-accent-top">
            <p className="premium-plan__price">
              <span className="premium-plan__amount">£{plan.priceMonthly}</span>
              <span className="premium-plan__period">/ month</span>
            </p>
            <p className="premium-plan__annual">
              or £{plan.priceAnnual}/year — save 34%
            </p>
            <ul className="premium-plan__features">
              {plan.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <button type="button" className="btn-primary premium-plan__cta" onClick={onTrial}>
              Start {plan.trialDays}-day free trial
            </button>
            <p className="premium-plan__note">
              Payment integration coming soon. Trial unlocks Premium locally for demo.
            </p>
          </div>
        )}

        <p className="premium-back">
          <Link to={ROUTES.home} onClick={() => interact('tap', 'light')}>
            ← Back to Today
          </Link>
        </p>
      </section>
    </div>
  );
}

export default Premium;
