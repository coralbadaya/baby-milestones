import { STRIPE_PRICE_ENV } from '../constants/premium';

/**
 * Resolve Stripe Price ID from process.env (Vercel) or import.meta.env (Vite dev).
 * @param {keyof typeof STRIPE_PRICE_ENV} currency
 * @param {string} sku
 */
export function resolveStripePriceId(currency, sku, env = process.env) {
  const keys = STRIPE_PRICE_ENV[currency]?.[sku] ?? STRIPE_PRICE_ENV.USD?.[sku];
  if (!keys) return null;
  for (const key of keys) {
    const value = env[key];
    if (value) return value;
  }
  return null;
}