import { PLUS_SKUS } from '../constants/premium';

const SKU_ENV_KEYS = {
  plus_monthly: ['RAZORPAY_PLAN_PLUS_MONTHLY', 'RAZORPAY_PLAN_MONTHLY'],
  plus_annual: ['RAZORPAY_PLAN_PLUS_ANNUAL', 'RAZORPAY_PLAN_ANNUAL'],
  first_year_bundle: ['RAZORPAY_PLAN_FIRST_YEAR_BUNDLE', 'RAZORPAY_PLAN_BUNDLE'],
  gift_subscription: ['RAZORPAY_PLAN_GIFT', 'RAZORPAY_PLAN_GIFT_SUBSCRIPTION'],
};

/**
 * Razorpay Plan ID (subscriptions) or amount config key for orders.
 * @param {typeof PLUS_SKUS[number]} sku
 * @param {NodeJS.ProcessEnv} [env]
 */
export function resolveRazorpayPlanId(sku, env = process.env) {
  const keys = SKU_ENV_KEYS[sku];
  if (!keys) return null;
  for (const key of keys) {
    if (env[key]) return env[key];
  }
  return null;
}

export function isRazorpaySubscriptionSku(sku) {
  return sku === 'plus_monthly' || sku === 'plus_annual';
}