import { PREMIUM_STORAGE_KEY } from '../constants/premium';

/**
 * @param {string | null | undefined} raw JSON from localStorage
 * @param {number} [now] epoch ms
 */
export function parseLocalPremium(raw, now = Date.now()) {
  if (!raw) return { active: false, trialEndsAt: null, tier: 'free' };

  try {
    const local = JSON.parse(raw);
    if (local.tier === 'premium' && !local.trialEndsAt) {
      return { active: true, trialEndsAt: null, tier: 'premium' };
    }
    if (local.trialEndsAt) {
      const active = new Date(local.trialEndsAt).getTime() > now;
      return { active, trialEndsAt: local.trialEndsAt, tier: active ? 'premium' : 'free' };
    }
    return { active: false, trialEndsAt: null, tier: 'free' };
  } catch {
    return { active: false, trialEndsAt: null, tier: 'free' };
  }
}

/** @param {() => string | null} getItem */
export function readLocalPremium(getItem = () => localStorage.getItem(PREMIUM_STORAGE_KEY)) {
  return parseLocalPremium(getItem());
}
