/** @typedef {'accepted' | 'rejected'} AnalyticsConsent */

const STORAGE_KEY = 'nestbean-cookie-consent';

/** @returns {{ analytics: AnalyticsConsent, updatedAt: string } | null} */
export function readCookieConsent() {
  if (typeof localStorage === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed?.analytics !== 'accepted' && parsed?.analytics !== 'rejected') return null;
    return parsed;
  } catch {
    return null;
  }
}

/** @param {AnalyticsConsent} analytics */
export function writeCookieConsent(analytics) {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    analytics,
    updatedAt: new Date().toISOString(),
  }));
}

/** @returns {AnalyticsConsent | null} */
export function getAnalyticsConsent() {
  return readCookieConsent()?.analytics ?? null;
}

/** @returns {boolean} */
export function hasAnalyticsConsentDecision() {
  return getAnalyticsConsent() !== null;
}

/** @returns {boolean} */
export function isAnalyticsConsented() {
  return getAnalyticsConsent() === 'accepted';
}

export function clearCookieConsent() {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}
