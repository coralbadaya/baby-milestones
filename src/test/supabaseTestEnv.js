/** Shared env for Supabase integration tests — see .env.test.example */

export function getSupabaseUrl() {
  return process.env.VITE_SUPABASE_URL
    || process.env.SUPABASE_URL
    || process.env.NEXT_PUBLIC_SUPABASE_URL
    || '';
}

export function getAnonKey() {
  return process.env.VITE_SUPABASE_ANON_KEY
    || process.env.SUPABASE_PUBLISHABLE_KEY
    || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
    || '';
}

export function getServiceKey() {
  return process.env.SUPABASE_SECRET_KEY
    || process.env.SUPABASE_SERVICE_ROLE_KEY
    || '';
}

export function getTestUserCreds() {
  return {
    email: process.env.SUPABASE_TEST_USER_EMAIL || '',
    password: process.env.SUPABASE_TEST_USER_PASSWORD || '',
  };
}

export function getTestAdminCreds() {
  return {
    email: process.env.SUPABASE_TEST_ADMIN_EMAIL || '',
    password: process.env.SUPABASE_TEST_ADMIN_PASSWORD || '',
  };
}

export function integrationTestsEnabled() {
  return process.env.SUPABASE_IT === '1'
    && Boolean(getSupabaseUrl())
    && Boolean(getAnonKey());
}

export function seedScriptEnabled() {
  return Boolean(getSupabaseUrl()) && Boolean(getServiceKey());
}
