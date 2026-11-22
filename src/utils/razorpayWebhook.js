import { createHmac, timingSafeEqual } from 'node:crypto';
import { skuToInterval, upsertPlusMembership, recordSubscribeSuccess } from './stripeWebhook.js';

/**
 * @param {string} body raw JSON string
 * @param {string} signature header value
 * @param {string} secret
 */
export function verifyRazorpaySignature(body, signature, secret) {
  if (!body || !signature || !secret) {
    throw new Error('Missing Razorpay signature inputs');
  }
  const expected = createHmac('sha256', secret).update(body).digest('hex');
  const a = Buffer.from(expected, 'utf8');
  const b = Buffer.from(signature, 'utf8');
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    throw new Error('Razorpay signature mismatch');
  }
  return JSON.parse(body);
}

function skuFromNotes(notes) {
  if (!notes || typeof notes !== 'object') return null;
  return notes.sku || notes.SKU || null;
}

function userIdFromNotes(notes) {
  if (!notes || typeof notes !== 'object') return null;
  return notes.user_id || notes.userId || null;
}

/**
 * @param {{ from: Function }} supabase
 * @param {object} event
 */
export async function applyRazorpayEvent(supabase, event) {
  const eventId = event?.event;
  if (!eventId) throw new Error('Missing event id');

  const { error: insErr } = await supabase.from('razorpay_events').insert({
    id: eventId,
    type: eventId,
  });
  if (insErr && (insErr.code === '23505' || /duplicate/i.test(insErr.message || ''))) {
    return { processed: false, reason: 'duplicate' };
  }
  if (insErr) throw insErr;

  const payload = event.payload || {};
  const entity = payload.subscription?.entity
    || payload.payment?.entity
    || payload.order?.entity
    || {};
  const notes = entity.notes || {};
  const userId = userIdFromNotes(notes);
  const sku = skuFromNotes(notes);

  if (eventId === 'subscription.activated' || eventId === 'subscription.charged') {
    await upsertPlusMembership(supabase, userId, {
      status: 'active',
      plan: 'plus',
      source: 'razorpay',
      billing_interval: skuToInterval(sku) || 'annual',
      razorpay_subscription_id: entity.id,
      razorpay_customer_id: entity.customer_id || null,
      premium_until: entity.current_end
        ? new Date(Number(entity.current_end) * 1000).toISOString()
        : null,
    });
    if (eventId === 'subscription.activated') {
      await recordSubscribeSuccess(supabase, { userId, sku });
    }
  }

  if (eventId === 'payment.captured' && sku && !entity.subscription_id) {
    const interval = skuToInterval(sku);
    if (sku === 'gift_subscription' || sku === 'first_year_bundle') {
      await upsertPlusMembership(supabase, userId, {
        status: 'active',
        plan: 'plus',
        source: 'razorpay',
        billing_interval: interval || 'gift',
        premium_until: new Date(Date.now() + 365 * 86400000).toISOString(),
      });
      if (sku === 'first_year_bundle' && userId) {
        await supabase.from('print_coupons').insert({
          user_id: userId,
          code: `BUNDLE-${String(entity.id || '').slice(-8).toUpperCase() || Date.now()}`,
          discount_pct: 20,
          free_shipping: true,
          bundle_type: 'first_year_linen',
        });
      }
      await recordSubscribeSuccess(supabase, { userId, sku });
    }
  }

  if (eventId === 'subscription.cancelled' || eventId === 'subscription.halted') {
    await upsertPlusMembership(supabase, userId, {
      status: 'expired',
      plan: 'free',
      source: 'razorpay',
      razorpay_subscription_id: entity.id,
    });
  }

  await supabase
    .from('billing_webhook_health')
    .upsert({ provider: 'razorpay', last_success_at: new Date().toISOString() }, { onConflict: 'provider' });

  return { processed: true, userId };
}