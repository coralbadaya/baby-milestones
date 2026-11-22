import { describe, it, expect } from 'vitest';
import { resolveStripePriceId } from './stripePriceEnv';

describe('resolveStripePriceId', () => {
  it('prefers USD-suffixed env key', () => {
    const env = {
      STRIPE_PRICE_PLUS_ANNUAL_USD: 'price_usd_annual',
      STRIPE_PRICE_PLUS_ANNUAL: 'price_fallback',
    };
    expect(resolveStripePriceId('USD', 'plus_annual', env)).toBe('price_usd_annual');
  });

  it('falls back to unprefixed env when USD suffix missing', () => {
    const env = { STRIPE_PRICE_PLUS_MONTHLY: 'price_monthly_usd' };
    expect(resolveStripePriceId('USD', 'plus_monthly', env)).toBe('price_monthly_usd');
  });
});