import { createHmac, timingSafeEqual } from 'node:crypto';
import { Buffer } from 'node:buffer';

const DEFAULT_TOLERANCE_SEC = 300;

/**
 * Verify Stripe-Signature header against the raw request body.
 * @param {string} rawBody
 * @param {string} sigHeader
 * @param {string} secret
 * @param {number} [toleranceSec]
 */
export function verifyStripeSignature(rawBody, sigHeader, secret, toleranceSec = DEFAULT_TOLERANCE_SEC) {
  if (!rawBody || !sigHeader || !secret) {
    throw new Error('Missing Stripe signature inputs');
  }

  const pairs = {};
  for (const part of String(sigHeader).split(',')) {
    const idx = part.indexOf('=');
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (!pairs[key]) pairs[key] = [];
    pairs[key].push(value);
  }

  const timestamp = pairs.t?.[0];
  const signatures = pairs.v1 || [];
  if (!timestamp || signatures.length === 0) {
    throw new Error('Invalid Stripe signature header');
  }

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (Number.isNaN(Number(timestamp)) || age > toleranceSec) {
    throw new Error('Stripe timestamp too old');
  }

  const expected = createHmac('sha256', secret).update(`${timestamp}.${rawBody}`, 'utf8').digest('hex');
  const expectedBuf = Buffer.from(expected, 'hex');
  const ok = signatures.some((sig) => {
    try {
      const got = Buffer.from(sig, 'hex');
      return got.length === expectedBuf.length && timingSafeEqual(got, expectedBuf);
    } catch {
      return false;
    }
  });
  if (!ok) throw new Error('Stripe signature mismatch');

  return JSON.parse(rawBody);
}

export function plusUntilFromUnix(unix) {
  if (!unix) return null;
  return new Date(Number(unix) * 1000).toISOString();
}

export function skuToInterval(sku) {
  if (sku === 'plus_monthly') return 'monthly';
  if (sku === 'plus_annual') return 'annual';
  if (sku === 'gift_subscription') return 'gift';
  if (sku === 'first_year_bundle') return 'bundle';
  return null;
}

/**
 * @param {{ from: Function }} supabase
 * @param {string} userId
 * @param {object} payload
 */
export async function upsertPlusMembership(supabase, userId, payload) {
  if (!supabase || !userId) return;
  await supabase.from('memberships').upsert({
    user_id: userId,
    plan: payload.plan ?? 'plus',
    ...payload,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id' });
}

async function resolveUserId(supabase, obj) {
  const direct = obj.client_reference_id || obj.metadata?.user_id;
  if (direct) return direct;
  const customerId = typeof obj.customer === 'string' ? obj.customer : obj.customer?.id;
  if (!customerId || !supabase) return null;
  const { data } = await supabase
    .from('memberships')
    .select('user_id')
    .eq('stripe_customer_id', customerId)
    .maybeSingle();
  return data?.user_id || null;
}

/**
 * Apply a verified Stripe event. Returns whether it was newly processed.
 */
export async function applyStripeEvent(supabase, event) {
  const { data: inserted, error } = await supabase
    .from('stripe_events')
    .insert({ id: event.id, type: event.type })
    .select('id')
    .maybeSingle();

  if (error && (error.code === '23505' || /duplicate/i.test(error.message || ''))) {
    return { processed: false, reason: 'duplicate' };
  }
  if (error) throw error;
  if (!inserted && error) return { processed: false };

  const obj = event.data?.object || {};
  const type = event.type;
  const sku = obj.metadata?.sku;
  const userId = await resolveUserId(supabase, obj);

  if (type === 'checkout.session.completed') {
    if (obj.mode === 'subscription') {
      await upsertPlusMembership(supabase, userId, {
        status: 'active',
        source: 'stripe',
        billing_interval: skuToInterval(sku) || 'annual',
        stripe_customer_id: obj.customer,
        stripe_subscription_id: obj.subscription,
        premium_until: null,
        plan: 'plus',
      });
    } else if (sku === 'gift_subscription') {
      await upsertPlusMembership(supabase, userId, {
        status: 'active',
        source: 'stripe',
        billing_interval: 'gift',
        premium_until: new Date(Date.now() + 365 * 86400000).toISOString(),
        plan: 'plus',
      });
    } else if (sku === 'first_year_bundle') {
      await upsertPlusMembership(supabase, userId, {
        status: 'active',
        source: 'stripe',
        billing_interval: 'bundle',
        premium_until: new Date(Date.now() + 365 * 86400000).toISOString(),
        plan: 'plus',
      });
      if (userId) {
        const { error: couponErr } = await supabase.from('print_coupons').insert({
          user_id: userId,
          code: `BUNDLE-${String(obj.id || '').slice(-8).toUpperCase() || Date.now()}`,
          discount_pct: 20,
          free_shipping: true,
          bundle_type: 'first_year_linen',
          stripe_session_id: obj.id || null,
        });
        if (couponErr && couponErr.code !== '23505') throw couponErr;
      }
    }
  }

  if (type === 'invoice.paid' || type === 'customer.subscription.updated') {
    const status = obj.status;
    const periodEnd = plusUntilFromUnix(obj.current_period_end);
    if (status === 'past_due') {
      await upsertPlusMembership(supabase, userId, {
        status: 'expired',
        plan: 'free',
        premium_until: periodEnd,
        stripe_customer_id: obj.customer,
        stripe_subscription_id: obj.id || obj.subscription,
      });
    } else if (status === 'active' || status === 'trialing' || type === 'invoice.paid') {
      await upsertPlusMembership(supabase, userId, {
        status: status === 'trialing' ? 'trial' : 'active',
        plan: 'plus',
        source: 'stripe',
        premium_until: periodEnd,
        trial_ends_at: status === 'trialing' ? periodEnd : undefined,
        stripe_customer_id: obj.customer,
        stripe_subscription_id: obj.id && String(obj.id).startsWith('sub_') ? obj.id : obj.subscription,
      });
    }
  }

  if (type === 'customer.subscription.deleted') {
    await upsertPlusMembership(supabase, userId, {
      status: 'expired',
      plan: 'free',
      premium_until: plusUntilFromUnix(obj.current_period_end) || new Date().toISOString(),
      stripe_customer_id: obj.customer,
      stripe_subscription_id: obj.id,
    });
  }

  return { processed: true, userId };
}
