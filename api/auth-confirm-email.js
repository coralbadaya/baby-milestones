/**
 * After a correct password, mark the Auth user confirmed so they can use
 * Yarn Trails immediately. The email code stays optional verification.
 * Requires SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_SECRET_KEY)
 * and VITE_SUPABASE_ANON_KEY.
 */
import { createClient } from '@supabase/supabase-js';

function adminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY;
  if (!url || !service) return null;
  return createClient(url, service, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function anonClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const anon = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createClient(url, anon, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function isNotConfirmed(error) {
  const msg = error?.message?.toLowerCase() || '';
  return msg.includes('email not confirmed') || msg.includes('not confirmed');
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password || password.length < 8) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  const anon = anonClient();
  const admin = adminClient();
  if (!anon || !admin) {
    return res.status(503).json({ error: 'Auth is not configured' });
  }

  const { error: signInError } = await anon.auth.signInWithPassword({ email, password });
  if (!signInError) {
    return res.status(200).json({ ok: true, already: true });
  }
  if (!isNotConfirmed(signInError)) {
    return res.status(401).json({ error: 'Could not open this account' });
  }

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });
  const userId = linkData?.user?.id;
  if (linkError || !userId) {
    return res.status(401).json({ error: 'Could not open this account' });
  }

  const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
    email_confirm: true,
  });
  if (updateError) {
    return res.status(400).json({ error: updateError.message });
  }

  return res.status(200).json({ ok: true });
}
