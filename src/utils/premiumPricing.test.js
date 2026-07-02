import { describe, it, expect } from 'vitest';
import {
  detectPremiumCurrency,
  formatPremiumAmount,
  formatPremiumRateLine,
  getPremiumPrices,
} from './premiumPricing';

describe('detectPremiumCurrency', () => {
  it('returns INR for India locale or timezone', () => {
    expect(detectPremiumCurrency({ language: 'en-IN', timeZone: 'Europe/London' })).toBe('INR');
    expect(detectPremiumCurrency({ language: 'en-GB', timeZone: 'Asia/Kolkata' })).toBe('INR');
  });

  it('returns USD for US locale or Americas timezone', () => {
    expect(detectPremiumCurrency({ language: 'en-US', timeZone: 'Europe/London' })).toBe('USD');
    expect(detectPremiumCurrency({ language: 'en-GB', timeZone: 'America/New_York' })).toBe('USD');
  });

  it('returns USD for Gulf timezone', () => {
    expect(detectPremiumCurrency({ language: 'en-AE', timeZone: 'Asia/Dubai' })).toBe('USD');
  });

  it('returns GBP for UK', () => {
    expect(detectPremiumCurrency({ language: 'en-GB', timeZone: 'Europe/London' })).toBe('GBP');
  });

  it('defaults to USD for non-UK non-IN regions', () => {
    expect(detectPremiumCurrency({ language: 'fr-FR', timeZone: 'Asia/Tokyo' })).toBe('USD');
  });
});

describe('getPremiumPrices', () => {
  it('falls back to USD for unknown currency', () => {
    expect(getPremiumPrices('ZZZ').priceMonthly).toBe(7.99);
  });

  it('has Plus annual anchor price', () => {
    expect(getPremiumPrices('USD').priceAnnual).toBe(49.99);
  });
});

describe('formatPremiumRateLine', () => {
  it('formats USD First Year Plan line', () => {
    const result = formatPremiumRateLine('USD');
    expect(result.currencyCode).toBe('USD');
    expect(result.line).toMatch(/\/yr First Year Plan/);
    expect(result.savingsPct).toBeGreaterThan(40);
    expect(result.regionNote).toMatch(/USD/);
  });

  it('formats USD amounts', () => {
    const monthly = formatPremiumAmount(7.99, 'USD');
    expect(monthly).toMatch(/\$/);
  });
});
