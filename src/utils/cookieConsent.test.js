import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

function createStorage() {
  /** @type {Record<string, string>} */
  const store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { Object.keys(store).forEach((key) => { delete store[key]; }); },
  };
}

describe('cookieConsent', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', createStorage());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns null when unset', async () => {
    const {
      hasAnalyticsConsentDecision,
      isAnalyticsConsented,
      readCookieConsent,
    } = await import('./cookieConsent.js');
    expect(readCookieConsent()).toBeNull();
    expect(hasAnalyticsConsentDecision()).toBe(false);
    expect(isAnalyticsConsented()).toBe(false);
  });

  it('persists accepted consent', async () => {
    const {
      getAnalyticsConsent,
      isAnalyticsConsented,
      readCookieConsent,
      writeCookieConsent,
    } = await import('./cookieConsent.js');
    writeCookieConsent('accepted');
    expect(getAnalyticsConsent()).toBe('accepted');
    expect(isAnalyticsConsented()).toBe(true);
    expect(readCookieConsent()?.updatedAt).toBeTruthy();
  });

  it('persists rejected consent', async () => {
    const {
      getAnalyticsConsent,
      isAnalyticsConsented,
      writeCookieConsent,
    } = await import('./cookieConsent.js');
    writeCookieConsent('rejected');
    expect(getAnalyticsConsent()).toBe('rejected');
    expect(isAnalyticsConsented()).toBe(false);
  });

  it('ignores invalid stored values', async () => {
    localStorage.setItem('yarntrails-cookie-consent', '{"analytics":"maybe"}');
    const { readCookieConsent } = await import('./cookieConsent.js');
    expect(readCookieConsent()).toBeNull();
  });
});
