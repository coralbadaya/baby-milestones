import {
  BILLING_REGIONS,
  DEFAULT_PREMIUM_CURRENCY,
  PREMIUM_CHECKOUT_NOTE_INR,
  PREMIUM_CHECKOUT_NOTE_USD,
  PREMIUM_CURRENCIES,
} from '../constants/premium';

/** @typedef {import('../constants/premium').BillingRegion} BillingRegion */

/**
 * @param {BillingRegion} region
 * @returns {keyof typeof PREMIUM_CURRENCIES}
 */
export function currencyForBillingRegion(region) {
  return BILLING_REGIONS[region]?.currency ?? DEFAULT_PREMIUM_CURRENCY;
}

/**
 * @param {keyof typeof PREMIUM_CURRENCIES} currencyCode
 */
export function getPremiumPrices(currencyCode) {
  return PREMIUM_CURRENCIES[currencyCode] ?? PREMIUM_CURRENCIES[DEFAULT_PREMIUM_CURRENCY];
}

/**
 * @param {number} amount
 * @param {string} currencyCode
 */
export function formatPremiumAmount(amount, currencyCode) {
  const locale = currencyCode === 'INR' ? 'en-IN' : currencyCode === 'GBP' ? 'en-GB' : undefined;
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/**
 * @param {BillingRegion} [region]
 */
export function formatPremiumRateLineForRegion(region = 'IN') {
  const currencyCode = currencyForBillingRegion(region);
  const prices = getPremiumPrices(currencyCode);
  const provider = BILLING_REGIONS[region]?.provider ?? 'razorpay';
  const monthly = formatPremiumAmount(prices.priceMonthly, currencyCode);
  const annual = formatPremiumAmount(prices.priceAnnual, currencyCode);
  const monthlyEquiv = formatPremiumAmount(prices.priceAnnual / 12, currencyCode);
  return {
    region,
    currencyCode,
    provider,
    monthly,
    annual,
    monthlyEquiv,
    bundle: formatPremiumAmount(prices.priceBundle, currencyCode),
    gift: formatPremiumAmount(prices.priceGift, currencyCode),
    line: `${annual}/yr First Year Plan (~${monthlyEquiv}/mo) or ${monthly}/mo`,
    regionNote: region === 'IN' ? PREMIUM_CHECKOUT_NOTE_INR : PREMIUM_CHECKOUT_NOTE_USD,
    savingsPct: Math.round((1 - (prices.priceAnnual / 12) / prices.priceMonthly) * 100),
  };
}

/** @deprecated use formatPremiumRateLineForRegion */
export function formatPremiumRateLine(currencyCode = DEFAULT_PREMIUM_CURRENCY) {
  const region = currencyCode === 'USD' ? 'ROW' : 'IN';
  return formatPremiumRateLineForRegion(region);
}

/** @deprecated billing region API replaces browser heuristics */
export function detectPremiumCurrency() {
  return DEFAULT_PREMIUM_CURRENCY;
}