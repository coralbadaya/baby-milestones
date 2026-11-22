import { supabase } from './supabaseClient';

/** @returns {Promise<{ headers: Record<string, string>, userId?: string, email?: string }>} */
export async function checkoutRequestInit() {
  const { data: { session } } = await supabase.auth.getSession();
  const headers = { 'Content-Type': 'application/json' };
  if (session?.access_token) {
    headers.Authorization = `Bearer ${session.access_token}`;
  }
  return {
    headers,
    userId: session?.user?.id,
    email: session?.user?.email,
  };
}