/**
 * POST /api/razorpay-checkout — India only (INR, Razorpay).
 */
import { createClient } from '@supabase/supabase-js';
import { INR_PRICE_ANCHOR, PLUS_SKUS } from '../src/constants/premium.js';
import { getUserFromRequest } from '../src/utils/apiAuth.js';
import { isRazorpaySubscriptionSku, resolveRazorpayPlanId } from '../src/utils/razorpayPlanEnv.js';

async function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  if (typeof WebSocket === 'undefined') {
    const { default: ws } = await import('ws');
    return createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
      realtime: { transport: ws },
    });
  }
  return createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
}

function skuAmountPaise(sku) {
  const map = {
    plus_monthly: INR_PRICE_ANCHOR.priceMonthly,
    plus_annual: INR_PRICE_ANCHOR.priceAnnual,
    first_year_bundle: INR_PRICE_ANCHOR.priceBundle,
    gift_subscription: INR_PRICE_ANCHOR.priceGift,
  };
  const inr = map[sku];
  return inr ? inr * 100 : null;
}

async function razorpayPost(path, body, keyId, keySecret) {
  const auth = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  const res = await fetch(`https://api.razorpay.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error?.description || data.error?.reason || 'Razorpay API error');
  }
  return data;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keyId || !keySecret) {
    res.status(503).json({ error: 'Razorpay not configured — use a promo code during early access.' });
    return;
  }

  const { sku, billing_region: billingRegion } = req.body || {};
  if (billingRegion && billingRegion !== 'IN') {
    res.status(400).json({ error: 'Use Stripe checkout outside India.' });
    return;
  }
  if (!PLUS_SKUS.includes(sku)) {
    res.status(400).json({ error: 'Invalid SKU' });
    return;
  }

  const supabase = await getSupabaseAdmin();
  const user = supabase ? await getUserFromRequest(supabase, req) : null;
  if (!user) {
    res.status(401).json({ error: 'Sign in required' });
    return;
  }

  const notes = { sku, user_id: user.id };
  const origin = req.headers.origin || process.env.SITE_URL || 'https://yarntrails.com';

  try {
    if (isRazorpaySubscriptionSku(sku)) {
      const planId = resolveRazorpayPlanId(sku);
      if (!planId) {
        res.status(503).json({ error: 'Razorpay plan not configured for this SKU.' });
        return;
      }
      const sub = await razorpayPost('/subscriptions', {
        plan_id: planId,
        total_count: sku === 'plus_monthly' ? 120 : 1,
        customer_notify: 1,
        notes,
      }, keyId, keySecret);

      res.status(200).json({
        keyId,
        subscriptionId: sub.id,
        sku,
        provider: 'razorpay',
        callbackUrl: `${origin}/account?checkout=success`,
      });
      return;
    }

    const amount = skuAmountPaise(sku);
    if (!amount) {
      res.status(400).json({ error: 'Invalid SKU amount' });
      return;
    }
    const order = await razorpayPost('/orders', {
      amount,
      currency: 'INR',
      notes,
    }, keyId, keySecret);

    res.status(200).json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      sku,
      provider: 'razorpay',
      callbackUrl: `${origin}/account?checkout=success`,
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Razorpay checkout failed' });
  }
}