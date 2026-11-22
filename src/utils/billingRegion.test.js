import { describe, it, expect } from 'vitest';
import {
  billingRegionMeta,
  countryToBillingRegion,
  resolveBillingRegion,
} from './billingRegion';

describe('countryToBillingRegion', () => {
  it('maps IN to India billing', () => {
    expect(countryToBillingRegion('IN')).toBe('IN');
  });

  it('maps other countries to ROW', () => {
    expect(countryToBillingRegion('US')).toBe('ROW');
    expect(countryToBillingRegion('GB')).toBe('ROW');
  });
});

describe('resolveBillingRegion', () => {
  it('prefers profile override over IP', () => {
    expect(resolveBillingRegion({ ipCountry: 'IN', profileBillingCountry: 'ROW' })).toEqual({
      region: 'ROW',
      country: 'IN',
      source: 'profile',
    });
    expect(resolveBillingRegion({ ipCountry: 'US', profileBillingCountry: 'IN' })).toEqual({
      region: 'IN',
      country: 'IN',
      source: 'profile',
    });
  });

  it('uses IP when profile unset', () => {
    expect(resolveBillingRegion({ ipCountry: 'IN', profileBillingCountry: null })).toMatchObject({
      region: 'IN',
      source: 'ip',
    });
    expect(resolveBillingRegion({ ipCountry: 'DE', profileBillingCountry: '' })).toMatchObject({
      region: 'ROW',
      source: 'ip',
    });
  });

  it('defaults to IN when unknown', () => {
    expect(resolveBillingRegion({})).toEqual({
      region: 'IN',
      country: null,
      source: 'default',
    });
  });
});

describe('billingRegionMeta', () => {
  it('returns Razorpay for IN and Stripe for ROW', () => {
    expect(billingRegionMeta('IN').provider).toBe('razorpay');
    expect(billingRegionMeta('ROW').provider).toBe('stripe');
    expect(billingRegionMeta('ROW').currency).toBe('USD');
  });
});