import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('./supabaseClient', () => ({
  supabase: {
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
    },
  },
}));

vi.mock('./cookieConsent', () => ({
  isAnalyticsConsented: vi.fn(() => true),
}));

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

describe('analyticsIngest', () => {
  beforeEach(() => {
    vi.stubGlobal('sessionStorage', createStorage());
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true }));
    globalThis.window = globalThis.window || {};
    Object.defineProperty(globalThis.window, 'location', {
      value: { pathname: '/baby', search: '', href: 'http://localhost/baby' },
      configurable: true,
    });
    Object.defineProperty(globalThis, 'document', {
      value: { referrer: '' },
      configurable: true,
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.resetModules();
  });

  it('posts allowlisted events and skips admin paths', async () => {
    const { ingestAnalyticsEvent } = await import('./analyticsIngest.js');
    await ingestAnalyticsEvent('page_view');
    expect(fetch).toHaveBeenCalled();
    const first = fetch.mock.calls[0];
    expect(first[0]).toBe('/api/analytics');
    const body = JSON.parse(first[1].body);
    expect(body.event_name).toBe('session_start');

    fetch.mockClear();
    await ingestAnalyticsEvent('page_view', {}, { path: '/admin/users' });
    expect(fetch).not.toHaveBeenCalled();
  });
});
