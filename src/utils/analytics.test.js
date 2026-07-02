import { afterEach, describe, expect, it, vi } from 'vitest';

describe('analytics', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    delete globalThis.window?.gtag;
    delete globalThis.window?.dataLayer;
  });

  it('is disabled when measurement ID is unset', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    vi.resetModules();
    const { isAnalyticsEnabled, trackPageView } = await import('./analytics.js');
    expect(isAnalyticsEnabled()).toBe(false);
    expect(() => trackPageView('/')).not.toThrow();
  });

  it('tracks page views when enabled', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    vi.resetModules();
    const { trackPageView } = await import('./analytics.js');

    globalThis.window = globalThis.window || {};
    const calls = [];
    globalThis.window.gtag = (...args) => { calls.push(args); };
    Object.defineProperty(globalThis.window, 'document', {
      value: { title: 'Nestbean' },
      configurable: true,
    });

    trackPageView('/today', 'Today');
    expect(calls).toContainEqual(['event', 'page_view', {
      page_path: '/today',
      page_title: 'Today',
    }]);
  });

  it('skips admin routes', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    vi.resetModules();
    const { trackPageView } = await import('./analytics.js');

    globalThis.window = globalThis.window || {};
    const calls = [];
    globalThis.window.gtag = (...args) => { calls.push(args); };

    trackPageView('/admin/inbox');
    expect(calls).toHaveLength(0);
  });
});
