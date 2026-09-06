/**
 * Vercel serverless: Stripe webhook → update Supabase memberships.
 * Requires STRIPE_WEBHOOK_SECRET, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from '@supabase/supabase-js';
import { applyStripeEvent, verifyStripeSignature } from '../src/utils/stripeWebhook.js';

export const config = {
  api: { bodyParser: false },
};

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function readRawBody(req) {
  if (typeof req.body === 'string') return Promise.resolve(req.body);
  if (Buffer.isBuffer(req.body)) return Promise.resolve(req.body.toString('utf8'));
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (c) => chunks.push(c));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
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

  const supabase = getSupabaseAdmin();
  if (!supabase) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }

  let rawBody;
  try {
    rawBody = await readRawBody(req);
  } catch {
    res.status(400).json({ error: 'Invalid body' });
    return;
  }

  let event;
  try {
    event = verifyStripeSignature(rawBody, req.headers['stripe-signature'], webhookSecret);
  } catch {
    res.status(400).json({ error: 'Invalid signature' });
    return;
  }

  try {
    await applyStripeEvent(supabase, event);
  } catch (err) {
    res.status(500).json({ error: err.message || 'Webhook error' });
    return;
  }

  res.status(200).json({ received: true });
}
