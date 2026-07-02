import { PREMIUM_CURRENCIES } from '../constants/premium';

/**
 * Detect display currency from browser locale and timezone heuristics.
 * Display-only until Stripe checkout — no geo-IP.
 * @param {{ language?: string, timeZone?: string }} [overrides] — for tests
 * @returns {keyof typeof PREMIUM_CURRENCIES}
 */
export function detectPremiumCurrency(overrides = {}) {
  const language = (overrides.language ?? (typeof navigator !== 'undefined' ? navigator.language : 'en-US') ?? 'en-US').toLowerCase();
  const timeZone = overrides.timeZone ?? (typeof Intl !== 'undefined'
    ? Intl.DateTimeFormat().resolvedOptions().timeZone
    : 'America/New_York');

  if (language.startsWith('en-in') || language === 'hi-in' || timeZone === 'Asia/Kolkata') {
    return 'INR';
  }

  if (
    language.startsWith('en-gb')
    || timeZone.startsWith('Europe/London')
    || timeZone.startsWith('Europe/')
  ) {
    if (!language.startsWith('en-us') && !timeZone.startsWith('America/')) {
      return 'GBP';
    }
  }

  if (
    language.startsWith('en-us')
    || language.startsWith('en-ca')
    || timeZone.startsWith('America/')
    || language.startsWith('en-ae')
    || language.startsWith('ar-ae')
    || timeZone.startsWith('Asia/Dubai')
    || timeZone.startsWith('Asia/Muscat')
  ) {
    return 'USD';
  }

  return 'USD';
}

/**
 * @param {keyof typeof PREMIUM_CURRENCIES} currencyCode
 */
export function getPremiumPrices(currencyCode) {
  return PREMIUM_CURRENCIES[currencyCode] ?? PREMIUM_CURRENCIES.USD;
}

/**
 * @param {number} amount
 * @param {string} currencyCode
 */
export function formatPremiumAmount(amount, currencyCode) {
  return new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}

/**
 * @param {keyof typeof PREMIUM_CURRENCIES} [currencyCode]
 */
export function formatPremiumRateLine(currencyCode = detectPremiumCurrency()) {
  const prices = getPremiumPrices(currencyCode);
  const monthly = formatPremiumAmount(prices.priceMonthly, currencyCode);
  const annual = formatPremiumAmount(prices.priceAnnual, currencyCode);
  const monthlyEquiv = formatPremiumAmount(prices.priceAnnual / 12, currencyCode);
  return {
    currencyCode,
    monthly,
    annual,
    monthlyEquiv,
    bundle: formatPremiumAmount(prices.priceBundle, currencyCode),
    gift: formatPremiumAmount(prices.priceGift, currencyCode),
    line: `${annual}/yr First Year Plan (~${monthlyEquiv}/mo) or ${monthly}/mo`,
    regionNote: `Prices shown in ${currencyCode} for your region`,
    savingsPct: Math.round((1 - (prices.priceAnnual / 12) / prices.priceMonthly) * 100),
  };
}
