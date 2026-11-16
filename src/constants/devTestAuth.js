/**
 * Seeded QA accounts (`npm run seed:test-users`). Dev assist only — never used in production UI.
 */

export const DEV_AUTH_ASSIST_ENABLED =
  import.meta.env.DEV || import.meta.env.VITE_DEV_AUTH_ASSIST === '1';

export const TEST_USER = {
  email: import.meta.env.VITE_TEST_USER_EMAIL || 'nestbean-test-user@mailinator.com',
  password: import.meta.env.VITE_TEST_USER_PASSWORD || 'NestbeanTestUser1!',
  displayName: 'Test User',
  label: 'Test parent',
};

export const TEST_ADMIN = {
  email: import.meta.env.VITE_TEST_ADMIN_EMAIL || 'nestbean-test-admin@mailinator.com',
  password: import.meta.env.VITE_TEST_ADMIN_PASSWORD || 'NestbeanTestAdmin1!',
  displayName: 'Test Admin',
  label: 'Test admin',
};

export function isMailinatorAddress(email) {
  return /@mailinator\.com$/i.test(String(email || '').trim());
}