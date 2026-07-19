import { Link } from 'react-router-dom';
import { interact } from '../utils/haptics';
import { PREMIUM_FEATURE_COPY } from '../constants/premium';
import { useAuth } from '../context/AuthContext';
import { ROUTES } from '../routes';
import Icon from './Icon';

function PremiumGate({ feature, children, compact = false }) {
  const { isPremium, user, startLocalTrial } = useAuth();
  const copy = PREMIUM_FEATURE_COPY[feature] || {
    title: 'Yarn Trails Plus',
    teaser: 'Unlock the full AI baby book experience.',
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
            to={user ? ROUTES.premium : ROUTES.signup}
            className="btn-primary premium-gate__cta"
            onClick={() => interact('tap', 'light')}
          >
            {user ? 'Upgrade to Plus' : 'Start free'}
          </Link>
          {!user && (
            <button
              type="button"
              className="btn-ghost premium-gate__trial"
              onClick={() => { interact('tap', 'light'); startLocalTrial(); }}
            >
              Preview Plus locally
            </button>
          )}
          <Link
            to={ROUTES.premium}
            className="btn-ghost premium-gate__trial"
            onClick={() => interact('tap', 'light')}
          >
            Compare Basic vs Plus
          </Link>
        </div>
      </div>
    </div>
  );
}

export default PremiumGate;
