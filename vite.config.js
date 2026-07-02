import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
    },
    test: {
      environment: 'node',
      include: ['src/**/*.test.js', 'src/**/*.it.test.js'],
      env: {
        VITE_SUPABASE_URL: env.VITE_SUPABASE_URL || env.SUPABASE_URL || '',
        VITE_SUPABASE_ANON_KEY: env.VITE_SUPABASE_ANON_KEY || env.SUPABASE_PUBLISHABLE_KEY || '',
        SUPABASE_SECRET_KEY: env.SUPABASE_SECRET_KEY || env.SUPABASE_SERVICE_ROLE_KEY || '',
        SUPABASE_IT: env.SUPABASE_IT || '',
        SUPABASE_TEST_USER_EMAIL: env.SUPABASE_TEST_USER_EMAIL || '',
        SUPABASE_TEST_USER_PASSWORD: env.SUPABASE_TEST_USER_PASSWORD || '',
        SUPABASE_TEST_ADMIN_EMAIL: env.SUPABASE_TEST_ADMIN_EMAIL || '',
        SUPABASE_TEST_ADMIN_PASSWORD: env.SUPABASE_TEST_ADMIN_PASSWORD || '',
      },
    },
  };
});
