import { createClient } from '@supabase/supabase-js';
import ws from 'ws';
import { getSupabaseUrl, getAnonKey } from './supabaseTestEnv.js';

/** @param {string} [anonKey] */
export function createTestClient(anonKey = getAnonKey()) {
  return createClient(getSupabaseUrl(), anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
    realtime: { transport: ws },
  });
}
