import { describe, it, expect } from 'vitest';
import { deriveUsdAmountFromInr, PREMIUM_CURRENCIES } from '../constants/premium';
import {
  formatPremiumAmount,
  formatPremiumRateLine,
  formatPremiumRateLineForRegion,
  getPremiumPrices,
} from './premiumPricing';

describe('USD derivation from INR anchor', () => {
  it('divides whole rupees by 100', () => {
    expect(deriveUsdAmountFromInr(399)).toBe(3.99);
    expect(deriveUsdAmountFromInr(2499)).toBe(24.99);
  });

  it('builds USD price table from INR', () => {
    expect(PREMIUM_CURRENCIES.USD.priceMonthly).toBe(3.99);
    expect(PREMIUM_CURRENCIES.USD.priceAnnual).toBe(24.99);
    expect(PREMIUM_CURRENCIES.USD.priceBundle).toBe(39.99);
    expect(PREMIUM_CURRENCIES.USD.priceGift).toBe(29.99);
  });
});

describe('getPremiumPrices', () => {
  it('falls back to INR for unknown currency', () => {
    expect(getPremiumPrices('ZZZ').priceMonthly).toBe(399);
  });

  it('returns derived USD amounts', () => {
    expect(getPremiumPrices('USD').priceAnnual).toBe(24.99);
  });
});

describe('formatPremiumRateLineForRegion', () => {
  it('formats India (INR · Razorpay)', () => {
    const result = formatPremiumRateLineForRegion('IN');
    expect(result.currencyCode).toBe('INR');
    expect(result.annual).toMatch(/2,?499/);
    expect(result.monthly).toMatch(/399/);
    expect(result.regionNote).toMatch(/Razorpay|UPI/i);
    expect(result.savingsPct).toBeGreaterThan(40);
  });

  it('formats ROW (USD · Stripe)', () => {
    const result = formatPremiumRateLineForRegion('ROW');
    expect(result.currencyCode).toBe('USD');
    expect(result.annual).toMatch(/24\.99/);
    expect(result.regionNote).toMatch(/Stripe|USD/i);
  });
});

describe('formatPremiumAmount', () => {
  it('formats USD amounts', () => {
    const monthly = formatPremiumAmount(3.99, 'USD');
    expect(monthly).toMatch(/\$/);
  });

  it('formats INR amounts with rupee symbol', () => {
    const annual = formatPremiumAmount(2499, 'INR');
    expect(annual).toMatch(/₹|INR/);
  });
});

describe('formatPremiumRateLine (legacy)', () => {
  it('defaults to INR without overrides', () => {
    expect(formatPremiumRateLine().currencyCode).toBe('INR');
    expect(formatPremiumRateLine().annual).toMatch(/2,?499/);
  });
});