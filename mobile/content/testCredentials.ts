/**
 * Seeded QA accounts (`npm run seed:test-users`).
 * Login uses password (no OTP). Signup OTP fetch uses Mailinator dev API.
 */

export const WEB_LOGIN_URL = 'https://yarntrails.com/login';

export const TEST_USER = {
  email: process.env.EXPO_PUBLIC_TEST_USER_EMAIL ?? 'nestbean-test-user@mailinator.com',
  password: process.env.EXPO_PUBLIC_TEST_USER_PASSWORD ?? 'NestbeanTestUser1!',
  displayName: 'Test User',
  label: 'Test parent',
};

export const TEST_ADMIN = {
  email: process.env.EXPO_PUBLIC_TEST_ADMIN_EMAIL ?? 'nestbean-test-admin@mailinator.com',
  password: process.env.EXPO_PUBLIC_TEST_ADMIN_PASSWORD ?? 'NestbeanTestAdmin1!',
  displayName: 'Test Admin',
  label: 'Test admin',
};

export function isMailinatorAddress(email: string) {
  return /@mailinator\.com$/i.test(email.trim());
}