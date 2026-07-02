/** @typedef {'free'|'plus'} MembershipPlan */
/** @typedef {'free'|'trial'|'active'|'comp'|'expired'} MembershipStatus */

/**
 * @param {{ plan?: string, status?: string, trial_ends_at?: string|null, premium_until?: string|null }|null} membership
 */
export function isPremiumActive(membership) {
  return isPlusActive(membership);
}

/**
 * @param {{ plan?: string, status?: string, trial_ends_at?: string|null, premium_until?: string|null }|null} membership
 */
export function isPlusActive(membership) {
  if (!membership) return false;

  const now = Date.now();

  if (membership.status === 'comp') return true;

  if (membership.status === 'active') {
    if (!membership.premium_until) return true;
    return new Date(membership.premium_until).getTime() > now;
  }

  if (membership.status === 'trial') {
    if (!membership.trial_ends_at) return false;
    return new Date(membership.trial_ends_at).getTime() > now;
  }

  return false;
}

/** @param {{ status?: string }|null} membership */
export function membershipLabel(membership) {
  if (!membership) return 'Basic';

  switch (membership.status) {
    case 'comp':
      return 'Founding Member';
    case 'trial':
      return isPlusActive(membership) ? 'Plus Trial' : 'Basic';
    case 'active':
      return isPlusActive(membership) ? 'Plus' : 'Basic';
    default:
      return 'Basic';
  }
}

/** @param {{ trial_ends_at?: string|null, premium_until?: string|null, status?: string }|null} membership */
export function membershipExpiry(membership) {
  if (!membership) return null;
  if (membership.status === 'comp') return null;
  if (membership.status === 'trial') return membership.trial_ends_at;
  if (membership.status === 'active') return membership.premium_until;
  return null;
}
