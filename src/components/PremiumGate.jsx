import { Link } from 'react-router-dom';
import { useEffect } from 'react';
import { interact } from '../utils/haptics';
import { PREMIUM_FEATURE_COPY, PREMIUM_FEATURES } from '../constants/premium';
import { useAuth } from '../context/AuthContext';
import { trackEvent } from '../utils/analytics';
import { ROUTES } from '../routes';
import Icon from './Icon';

function FlipBookArt() {
  return (
    <svg
      className="premium-gate__art"
      viewBox="0 0 220 148"
      role="img"
      aria-hidden="true"
    >
      <ellipse cx="110" cy="136" rx="72" ry="7" fill="#1E2A26" opacity="0.12" />
      <path d="M30 30h160a10 10 0 0 1 10 10v78a10 10 0 0 1-10 10H30a10 10 0 0 1-10-10V40a10 10 0 0 1 10-10z" fill="#3F5E52" />
      <path d="M36 38h74v84H44a8 8 0 0 1-8-8V38z" fill="#F6F0E6" />
      <path d="M110 38h74v76a8 8 0 0 1-8 8h-66V38z" fill="#FFFBF7" />
      <rect x="106" y="38" width="8" height="84" fill="#E4D3B0" />
      <rect x="188" y="46" width="3" height="68" rx="1.5" fill="#C4A35A" />
      <path d="M50 54h46M50 66h38M50 78h42" stroke="#C4A35A" strokeWidth="2" strokeLinecap="round" />
      <circle cx="62" cy="100" r="7" fill="#E4D3B0" />
      <path d="M62 96a4 4 0 1 0 0 8 3.2 3.2 0 1 1 0-8z" fill="#3F5E52" />
      <rect x="126" y="50" width="46" height="34" rx="4" fill="#E7D4C2" />
      <circle cx="138" cy="61" r="4" fill="#C4A35A" />
      <path d="M126 84l12-11 9 7 7-5 18 9v0H126z" fill="#3F5E52" opacity="0.45" />
      <path d="M126 96h38M126 106h26" stroke="#1E2A26" strokeWidth="1.6" strokeLinecap="round" opacity="0.28" />
    </svg>
  );
}

function PremiumGate({ feature, children, compact = false }) {
  const { isPremium, user, startLocalTrial } = useAuth();
  const copy = PREMIUM_FEATURE_COPY[feature] || {
    title: 'Yarn Trails Plus',
    teaser: 'Unlock the full AI baby book experience.',
  };

  useEffect(() => {
    if (!isPremium) trackEvent('gate_hit', { feature });
  }, [isPremium, feature]);

  if (isPremium) {
    return children;
  }

  return (
    <div className={`premium-gate${compact ? ' premium-gate--compact' : ''}`}>
      <div className="premium-gate__content premium-gate__content--blurred">
        {children}
      </div>
      <div className="premium-gate__overlay">
        {feature === PREMIUM_FEATURES.flipBookFull ? (
          <FlipBookArt />
        ) : (
          <Icon name="sparkles" size={24} className="premium-gate__icon" />
        )}
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
