import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('./analyticsIngest.js', () => ({
  ingestAnalyticsEvent: vi.fn(),
}));

describe('analytics', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.clearAllMocks();
    delete globalThis.window?.gtag;
    delete globalThis.window?.dataLayer;
  });

  it('is disabled for GA when measurement ID is unset but still ingests', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    vi.resetModules();
    const { isAnalyticsEnabled, trackPageView } = await import('./analytics.js');
    const { ingestAnalyticsEvent } = await import('./analyticsIngest.js');
    globalThis.window = globalThis.window || {};
    expect(isAnalyticsEnabled()).toBe(false);
    expect(() => trackPageView('/')).not.toThrow();
    expect(ingestAnalyticsEvent).toHaveBeenCalledWith('page_view', {}, { path: '/' });
  });

  it('tracks page views when GA is enabled', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    vi.resetModules();
    const { trackPageView } = await import('./analytics.js');

    globalThis.window = globalThis.window || {};
    const calls = [];
    globalThis.window.gtag = (...args) => { calls.push(args); };
    Object.defineProperty(globalThis.window, 'document', {
      value: { title: 'Yarn Trails' },
      configurable: true,
    });

    trackPageView('/today', 'Today');
    expect(calls).toContainEqual(['event', 'page_view', {
      page_path: '/today',
      page_title: 'Today',
    }]);
  });

  it('skips admin routes for GA and ingest', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', 'G-TEST123');
    vi.resetModules();
    const { trackPageView } = await import('./analytics.js');
    const { ingestAnalyticsEvent } = await import('./analyticsIngest.js');

    globalThis.window = globalThis.window || {};
    const calls = [];
    globalThis.window.gtag = (...args) => { calls.push(args); };

    trackPageView('/admin/inbox');
    expect(calls).toHaveLength(0);
    expect(ingestAnalyticsEvent).not.toHaveBeenCalled();
  });
});
