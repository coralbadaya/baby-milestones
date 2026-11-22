/**
 * Shared helpers for Vercel API routes (Node).
 */

export function bearerToken(req) {
  const header = req.headers?.authorization || req.headers?.Authorization;
  if (typeof header !== 'string' || !header.startsWith('Bearer ')) return null;
  return header.slice(7).trim() || null;
}

export function clientCountry(req) {
  const vercel = req.headers?.['x-vercel-ip-country'];
  if (typeof vercel === 'string' && vercel.trim()) return vercel.trim().slice(0, 8).toUpperCase();
  const cf = req.headers?.['cf-ipcountry'];
  if (typeof cf === 'string' && cf.trim() && cf !== 'XX') return cf.trim().slice(0, 8).toUpperCase();
  return null;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {import('http').IncomingMessage | { headers?: Record<string, string> }} req
 */
export async function getUserFromRequest(supabase, req) {
  const token = bearerToken(req);
  if (!token || !supabase) return null;
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data?.user) return null;
  return data.user;
}