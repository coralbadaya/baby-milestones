/**
 * Vercel serverless: Stripe webhook → update Supabase memberships.
 * Requires STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from '@supabase/supabase-js';

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function upsertPlusMembership(userId, payload) {
  const supabase = getSupabaseAdmin();
  if (!supabase || !userId) return;

  await supabase.from('memberships').upsert({
    user_id: userId,
    plan: 'plus',
    ...payload,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    res.status(503).json({ error: 'Webhook not configured' });
    return;
  }

  let event = req.body;
  if (typeof event === 'string') {
    try {
      event = JSON.parse(event);
    } catch {
      res.status(400).json({ error: 'Invalid JSON' });
      return;
    }
  }

  const type = event.type;
  const obj = event.data?.object || {};

  if (type === 'checkout.session.completed') {
    const userId = obj.client_reference_id || obj.metadata?.user_id;
    const sku = obj.metadata?.sku;

    if (obj.mode === 'subscription') {
      const trialEnd = obj.subscription
        ? null
        : null;
      await upsertPlusMembership(userId, {
        status: 'active',
        source: 'stripe',
        billing_interval: sku === 'plus_monthly' ? 'monthly' : 'annual',
        stripe_customer_id: obj.customer,
        stripe_subscription_id: obj.subscription,
        premium_until: null,
      });
    } else if (sku === 'gift_subscription') {
      await upsertPlusMembership(userId, {
        status: 'active',
        source: 'stripe',
        billing_interval: 'gift',
        premium_until: new Date(Date.now() + 365 * 86400000).toISOString(),
      });
    } else if (sku === 'first_year_bundle') {
      await upsertPlusMembership(userId, {
        status: 'active',
        source: 'stripe',
        billing_interval: 'bundle',
        premium_until: new Date(Date.now() + 365 * 86400000).toISOString(),
      });
      const supabase = getSupabaseAdmin();
      if (supabase && userId) {
        await supabase.from('print_coupons').insert({
          user_id: userId,
          code: `BUNDLE-${obj.id?.slice(-8)?.toUpperCase() || Date.now()}`,
          discount_pct: 20,
          free_shipping: true,
          bundle_type: 'first_year_linen',
        });
      }
    }
  }

  if (type === 'customer.subscription.deleted') {
    const userId = obj.metadata?.user_id;
    if (userId) {
      await upsertPlusMembership(userId, {
        status: 'expired',
        plan: 'free',
      });
    }
  }

  res.status(200).json({ received: true });
}
