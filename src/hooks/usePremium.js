/**
 * @deprecated Prefer useAuth() or useMembership() from AuthContext.
 * Thin wrapper kept for any legacy imports.
 */
import { useMembership } from '../context/AuthContext';
import { membershipExpiry } from '../utils/membership';

export function usePremium() {
  const {
    isPremium, membership, user, startLocalTrial,
  } = useMembership();

  return {
    isPremium,
    tier: isPremium ? 'premium' : 'free',
    trialEndsAt: membershipExpiry(membership),
    startTrial: user ? () => {} : startLocalTrial,
    setPremium: () => {},
    clearPremium: () => {},
  };
}
