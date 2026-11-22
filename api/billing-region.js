/**
 * GET /api/billing-region — resolve India vs ROW for pricing and checkout.
 */
import { createClient } from '@supabase/supabase-js';
import { billingRegionMeta, resolveBillingRegion } from '../src/utils/billingRegion.js';
import { bearerToken, clientCountry, getUserFromRequest } from '../src/utils/apiAuth.js';

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

function devOverride(req) {
  if (process.env.VERCEL_ENV === 'production') return null;
  const forced = process.env.VITE_BILLING_REGION || process.env.BILLING_REGION_OVERRIDE;
  if (forced === 'IN' || forced === 'ROW') return forced;
  const url = req.url || '';
  const q = url.includes('?') ? new URL(url, 'http://localhost').searchParams : null;
  const param = q?.get('billing_region');
  if (param === 'IN' || param === 'ROW') return param;
  return null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const override = devOverride(req);
  if (override) {
    res.status(200).json({ ...billingRegionMeta(override), source: 'dev_override', country: null });
    return;
  }

  const ipCountry = clientCountry(req);
  let profileBillingCountry = null;

  const supabase = await getSupabaseAdmin();
  if (supabase && bearerToken(req)) {
    const user = await getUserFromRequest(supabase, req);
    if (user?.id) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('billing_country')
        .eq('id', user.id)
        .maybeSingle();
      profileBillingCountry = profile?.billing_country ?? null;
    }
  }

  const resolved = resolveBillingRegion({ ipCountry, profileBillingCountry });
  res.status(200).json({
    ...billingRegionMeta(resolved.region),
    country: resolved.country,
    source: resolved.source,
  });
}