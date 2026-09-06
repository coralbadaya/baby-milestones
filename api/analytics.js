/**
 * Vercel serverless: first-party analytics ingest.
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY. Optional ANALYTICS_IP_SALT.
 */
import { createHmac } from 'node:crypto';
import { createClient } from '@supabase/supabase-js';
import { validateAnalyticsPayload } from '../src/utils/analyticsEvents.js';

async function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) return null;
  const options = {
    auth: { persistSession: false, autoRefreshToken: false },
  };
  if (typeof WebSocket === 'undefined') {
    const { default: ws } = await import('ws');
    options.realtime = { transport: ws };
  }
  return createClient(url, key, options);
}

function parseInet(ip) {
  if (!ip || typeof ip !== 'string') return null;
  const trimmed = ip.trim();
  if (/^(\d{1,3}\.){3}\d{1,3}$/.test(trimmed)) return trimmed;
  if (/^[0-9a-f:]+$/i.test(trimmed) && trimmed.includes(':')) return trimmed;
  return null;
}

function clientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.trim()) {
    return parseInet(forwarded.split(',')[0].trim());
  }
  const real = req.headers['x-real-ip'];
  if (typeof real === 'string' && real.trim()) return parseInet(real.trim());
  return parseInet(req.socket?.remoteAddress || '');
}

function clientCountry(req) {
  const vercel = req.headers['x-vercel-ip-country'];
  if (typeof vercel === 'string' && vercel.trim()) return vercel.trim().slice(0, 8);
  const cf = req.headers['cf-ipcountry'];
  if (typeof cf === 'string' && cf.trim() && cf !== 'XX') return cf.trim().slice(0, 8);
  return null;
}

function clientDevice(ua) {
  if (!ua) return 'desktop';
  return /Mobi|Android|iPhone|iPad/i.test(ua) ? 'mobile' : 'desktop';
}

function hashIp(ip, salt) {
  if (!ip || !salt) return null;
  const day = new Date().toISOString().slice(0, 10);
  return createHmac('sha256', salt).update(`${day}:${ip}`).digest('hex').slice(0, 32);
}

function bearerToken(req) {
  const header = req.headers.authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const supabase = await getSupabaseAdmin();
  if (!supabase) {
    res.status(503).json({ error: 'Database not configured' });
    return;
  }

  const parsed = validateAnalyticsPayload(req.body);
  if (!parsed.ok) {
    const status = parsed.error === 'Skipped' ? 204 : 400;
    if (status === 204) {
      res.status(204).end();
      return;
    }
    res.status(400).json({ error: parsed.error });
    return;
  }

  const ip = clientIp(req);
  const salt = process.env.ANALYTICS_IP_SALT || process.env.SUPABASE_SERVICE_ROLE_KEY || 'yarntrails-analytics';
  let userId = null;
  const token = bearerToken(req);
  if (token) {
    const { data } = await supabase.auth.getUser(token);
    userId = data?.user?.id || null;
  }

  const { count } = await supabase
    .from('analytics_events')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', parsed.payload.session_id)
    .gte('occurred_at', new Date(Date.now() - 60_000).toISOString());
  if ((count || 0) > 60) {
    res.status(429).json({ error: 'Rate limited' });
    return;
  }

  const { error } = await supabase.from('analytics_events').insert({
    session_id: parsed.payload.session_id,
    user_id: userId,
    event_name: parsed.payload.event_name,
    path: parsed.payload.path,
    route_key: parsed.payload.route_key,
    referrer_host: parsed.payload.referrer_host,
    utm_source: parsed.payload.utm_source,
    utm_medium: parsed.payload.utm_medium,
    utm_campaign: parsed.payload.utm_campaign,
    country: clientCountry(req),
    device: clientDevice(req.headers['user-agent']),
    ip,
    ip_hash: hashIp(ip, salt),
    props: parsed.payload.props,
  });

  if (error) {
    console.error('analytics ingest failed', error.message || error);
    res.status(500).json({ error: 'Ingest failed' });
    return;
  }

  res.status(204).end();
}
