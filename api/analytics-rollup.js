/**
 * Nightly rollup + 30-day IP scrub + 90-day purge.
 * Vercel cron: GET/POST /api/analytics-rollup
 */
import { createClient } from '@supabase/supabase-js';

function authorized(req) {
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.authorization || '';
  if (secret && auth === `Bearer ${secret}`) return true;
  if (req.headers['x-vercel-cron'] === '1') return true;
  return false;
}

export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  if (!authorized(req)) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }

  const options = {
    auth: { persistSession: false, autoRefreshToken: false },
  };
  if (typeof WebSocket === 'undefined') {
    const { default: ws } = await import('ws');
    options.realtime = { transport: ws };
  }
  const supabase = createClient(url, key, options);
  const { data, error } = await supabase.rpc('analytics_rollup_and_scrub');
  if (error) {
    res.status(500).json({ error: error.message });
    return;
  }
  res.status(200).json(data || { ok: true });
}
