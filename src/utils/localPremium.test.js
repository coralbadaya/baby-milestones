import { describe, it, expect } from 'vitest';
import { parseLocalPremium, readLocalPremium } from './localPremium';

describe('parseLocalPremium', () => {
  const now = new Date('2026-06-01T12:00:00Z').getTime();

  it('returns inactive for empty input', () => {
    expect(parseLocalPremium(null, now)).toEqual({
      active: false, trialEndsAt: null, tier: 'free',
    });
  });

  it('returns active for permanent premium tier', () => {
    const raw = JSON.stringify({ tier: 'premium', trialEndsAt: null });
    expect(parseLocalPremium(raw, now)).toEqual({
      active: true, trialEndsAt: null, tier: 'premium',
    });
  });

  it('returns active for future trial', () => {
    const ends = '2026-06-15T12:00:00Z';
    const raw = JSON.stringify({ tier: 'premium', trialEndsAt: ends });
    expect(parseLocalPremium(raw, now)).toEqual({
      active: true, trialEndsAt: ends, tier: 'premium',
    });
  });

  it('returns inactive for expired trial', () => {
    const ends = '2026-05-01T12:00:00Z';
    const raw = JSON.stringify({ tier: 'premium', trialEndsAt: ends });
    expect(parseLocalPremium(raw, now)).toEqual({
      active: false, trialEndsAt: ends, tier: 'free',
    });
  });

  it('handles invalid JSON', () => {
    expect(parseLocalPremium('{bad', now).active).toBe(false);
  });
});

describe('readLocalPremium', () => {
  it('reads via injected getItem', () => {
    const ends = '2026-12-01T00:00:00Z';
    const result = readLocalPremium(() => JSON.stringify({ tier: 'premium', trialEndsAt: ends }));
    expect(result.trialEndsAt).toBe(ends);
    expect(result.active).toBe(true);
  });
});
