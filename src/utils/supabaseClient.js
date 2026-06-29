import { createClient } from '@supabase/supabase-js';

// Load Supabase URL and Anon Key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || import.meta.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Check your environment variables (.env).');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
