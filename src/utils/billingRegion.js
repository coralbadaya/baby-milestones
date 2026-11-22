import { BILLING_REGIONS } from '../constants/premium';

/** @typedef {'IN' | 'ROW'} BillingRegion */

/**
 * @param {string | null | undefined} countryCode ISO 3166-1 alpha-2 from edge headers
 * @returns {BillingRegion}
 */
export function countryToBillingRegion(countryCode) {
  if (countryCode === 'IN') return 'IN';
  return 'ROW';
}

/**
 * Profile override wins when set to IN or ROW.
 * @param {{ ipCountry?: string | null, profileBillingCountry?: string | null }} input
 * @returns {{ region: BillingRegion, country: string | null, source: 'profile' | 'ip' | 'default' }}
 */
export function resolveBillingRegion({ ipCountry, profileBillingCountry }) {
  const override = profileBillingCountry?.trim().toUpperCase();
  if (override === 'IN' || override === 'ROW') {
    return { region: override, country: override === 'IN' ? 'IN' : ipCountry || null, source: 'profile' };
  }
  if (ipCountry) {
    return {
      region: countryToBillingRegion(ipCountry),
      country: ipCountry,
      source: 'ip',
    };
  }
  return { region: 'IN', country: null, source: 'default' };
}

/**
 * @param {BillingRegion} region
 */
export function billingRegionMeta(region) {
  const meta = BILLING_REGIONS[region] ?? BILLING_REGIONS.IN;
  return {
    region,
    currency: meta.currency,
    provider: meta.provider,
    label: meta.label,
  };
}