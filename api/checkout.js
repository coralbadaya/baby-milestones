/**
 * Vercel serverless: create Stripe Checkout session for Nestbean Plus SKUs.
 * Requires STRIPE_SECRET_KEY and price IDs in env.
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    res.status(503).json({ error: 'Stripe not configured — use a promo code during early access.' });
    return;
  }

  const { sku, userId, email, trialDays } = req.body || {};
  const priceMap = {
    plus_monthly: process.env.STRIPE_PRICE_PLUS_MONTHLY,
    plus_annual: process.env.STRIPE_PRICE_PLUS_ANNUAL,
    first_year_bundle: process.env.STRIPE_PRICE_FIRST_YEAR_BUNDLE,
    gift_subscription: process.env.STRIPE_PRICE_GIFT,
  };

  const priceId = priceMap[sku];
  if (!priceId) {
    res.status(400).json({ error: 'Invalid SKU' });
    return;
  }

  const origin = req.headers.origin || process.env.SITE_URL || 'https://nestbean.app';
  const mode = sku === 'gift_subscription' || sku === 'first_year_bundle' ? 'payment' : 'subscription';

  const params = new URLSearchParams();
  params.set('mode', mode);
  params.set('line_items[0][price]', priceId);
  params.set('line_items[0][quantity]', '1');
  params.set('success_url', `${origin}/account?checkout=success`);
  params.set('cancel_url', `${origin}/premium?checkout=cancel`);
  if (email) params.set('customer_email', email);
  if (userId) params.set('client_reference_id', userId);
  params.set('metadata[sku]', sku);
  if (userId) params.set('metadata[user_id]', userId);

  if (mode === 'subscription' && sku === 'plus_annual' && trialDays) {
    params.set('subscription_data[trial_period_days]', String(trialDays));
  }

  const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${stripeKey}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  const session = await stripeRes.json();
  if (!stripeRes.ok) {
    res.status(500).json({ error: session.error?.message || 'Stripe error' });
    return;
  }

  res.status(200).json({ url: session.url, id: session.id });
}
