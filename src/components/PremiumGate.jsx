import { Link } from 'react-router-dom';
import { interact } from '../utils/haptics';
import { PREMIUM_FEATURE_COPY } from '../constants/premium';
import { ROUTES } from '../routes';
import { usePremium } from '../hooks/usePremium';
import Icon from './Icon';

function PremiumGate({ feature, children, compact = false }) {
  const { isPremium, startTrial } = usePremium();
  const copy = PREMIUM_FEATURE_COPY[feature] || {
    title: 'Premium',
    teaser: 'Unlock the full Nestbean experience.',
  };

  if (isPremium) {
    return children;
  }

  return (
    <div className={`premium-gate${compact ? ' premium-gate--compact' : ''}`}>
      <div className="premium-gate__content premium-gate__content--blurred">
        {children}
      </div>
      <div className="premium-gate__overlay">
        <Icon name="sparkles" size={24} className="premium-gate__icon" />
        <p className="premium-gate__title">{copy.title}</p>
        <p className="premium-gate__teaser">{copy.teaser}</p>
        <div className="premium-gate__actions">
          <Link
            to={ROUTES.premium}
            className="btn-primary premium-gate__cta"
            onClick={() => interact('tap', 'light')}
          >
            View Premium
          </Link>
          <button
            type="button"
            className="btn-ghost premium-gate__trial"
            onClick={() => { interact('tap', 'light'); startTrial(); }}
          >
            Start free trial
          </button>
        </div>
      </div>
    </div>
  );
}

export default PremiumGate;
