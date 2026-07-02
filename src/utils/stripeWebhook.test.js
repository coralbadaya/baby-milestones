import { describe, it, expect } from 'vitest';

/** Mirrors api/stripe-webhook.js upsert payload for Plus checkout */
function buildPlusMembershipFromCheckout(session) {
  const userId = session.client_reference_id || session.metadata?.user_id;
  const sku = session.metadata?.sku;

  if (session.mode === 'subscription') {
    return {
      user_id: userId,
      plan: 'plus',
      status: 'active',
      source: 'stripe',
      billing_interval: sku === 'plus_monthly' ? 'monthly' : 'annual',
      stripe_customer_id: session.customer,
      stripe_subscription_id: session.subscription,
      premium_until: null,
    };
  }

  if (sku === 'gift_subscription' || sku === 'first_year_bundle') {
    return {
      user_id: userId,
      plan: 'plus',
      status: 'active',
      source: 'stripe',
      billing_interval: sku === 'gift_subscription' ? 'gift' : 'bundle',
      premium_until: new Date(Date.now() + 365 * 86400000).toISOString(),
    };
  }

  return null;
}

describe('stripe webhook membership payload', () => {
  it('sets plan=plus on subscription checkout', () => {
    const row = buildPlusMembershipFromCheckout({
      mode: 'subscription',
      client_reference_id: 'user-123',
      metadata: { sku: 'plus_annual' },
      customer: 'cus_1',
      subscription: 'sub_1',
    });
    expect(row?.plan).toBe('plus');
    expect(row?.billing_interval).toBe('annual');
  });

  it('sets plan=plus on gift SKU', () => {
    const row = buildPlusMembershipFromCheckout({
      mode: 'payment',
      client_reference_id: 'user-456',
      metadata: { sku: 'gift_subscription' },
    });
    expect(row?.plan).toBe('plus');
    expect(row?.billing_interval).toBe('gift');
  });
});
