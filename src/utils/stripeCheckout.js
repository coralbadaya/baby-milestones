import { trackEvent } from './analytics';

/**
 * Start Stripe Checkout for a Plus SKU.
 * @param {'plus_monthly'|'plus_annual'|'first_year_bundle'|'gift_subscription'} sku
 */
export async function startCheckout(sku) {
  trackEvent('begin_checkout', { sku });

  const res = await fetch('/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sku }),
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

/**
 * Request 4K export (Plus only) — queues server job when configured.
 * @param {string} storyId
 */
export async function request4kExport(storyId) {
  trackEvent('export_4k_requested', { story_id: storyId });
  const res = await fetch('/api/export-4k', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ storyId }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || 'Export unavailable');
  return data;
}
