import { trackEvent } from './analytics';
import { checkoutRequestInit } from './checkoutAuth';

/**
 * Stripe Checkout — rest of world (USD).
 * @param {'plus_monthly'|'plus_annual'|'first_year_bundle'|'gift_subscription'} sku
 */
export async function startStripeCheckout(sku) {
  trackEvent('begin_checkout', {
    sku,
    billing_region: 'ROW',
    provider: 'stripe',
    feature: 'stripe',
    tab: 'ROW',
  });

  const { headers } = await checkoutRequestInit();
  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers,
    credentials: 'include',
    body: JSON.stringify({ sku, billing_region: 'ROW' }),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || 'Checkout unavailable');
  }

  if (data.url) {
    window.location.href = data.url;
    return;
  }

  throw new Error('No checkout URL returned');
}

/** @deprecated use startPlusCheckout */
export const startCheckout = startStripeCheckout;

/** Plus extras UI calls this; full 4K pipeline is not wired yet. */
export async function request4kExport(_storyId) {
  throw new Error('4K export is not ready yet.');
}