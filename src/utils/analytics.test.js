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

  it('enables third-party analytics when GTM container is configured', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    vi.stubEnv('VITE_GTM_CONTAINER_ID', 'GTM-TEST');
    vi.resetModules();
    const { isAnalyticsEnabled, isGtmEnabled } = await import('./analytics.js');
    expect(isGtmEnabled()).toBe(true);
    expect(isAnalyticsEnabled()).toBe(true);
  });

  it('still ingests when GA is unset (GTM container may still load)', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    vi.stubEnv('VITE_GTM_CONTAINER_ID', '');
    vi.resetModules();
    const { trackPageView } = await import('./analytics.js');
    const { ingestAnalyticsEvent } = await import('./analyticsIngest.js');
    globalThis.window = globalThis.window || {};
    globalThis.window.dataLayer = [];
    expect(() => trackPageView('/')).not.toThrow();
    expect(ingestAnalyticsEvent).toHaveBeenCalledWith('page_view', {}, { path: '/' });
    expect(globalThis.window.dataLayer.some((row) => row?.event === 'page_view')).toBe(true);
  });

  it('resolves GA4 id from GTM default constant', async () => {
    vi.stubEnv('VITE_GA_MEASUREMENT_ID', '');
    vi.stubEnv('VITE_GTM_CONTAINER_ID', 'GTM-TEST');
    vi.resetModules();
    const { getGaMeasurementId } = await import('./analytics.js');
    expect(getGaMeasurementId()).toBe('G-7E22FF9EJN');
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
