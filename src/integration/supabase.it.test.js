/**
 * Supabase integration tests — require migration applied + seeded test users.
 * Run: npm run test:it
 * @see docs/auth-membership-admin.md#testing
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import {
  getTestUserCreds,
  getTestAdminCreds,
  integrationTestsEnabled,
} from '../test/supabaseTestEnv.js';
import { createTestClient } from '../test/createTestClient.js';
import { isPremiumActive } from '../utils/membership.js';

const enabled = integrationTestsEnabled();
const describeIt = enabled ? describe : describe.skip;

/** @param {{ message?: string, code?: string } | null} error */
function isSchemaMissing(error) {
  return error?.code === 'PGRST205' || /schema cache/i.test(error?.message || '');
}

describeIt('Supabase contact (integration)', () => {
  let anonClient;
  let schemaReady = false;

  beforeAll(async () => {
    anonClient = createTestClient();
    const { error } = await anonClient.from('contact_submissions').select('id').limit(1);
    schemaReady = !isSchemaMissing(error);
    if (!schemaReady) {
      console.warn('Skipping IT — apply supabase/migrations/20250629120000_membership_and_contact.sql first');
    }
  });

  it('allows anonymous contact form insert', async () => {
    if (!schemaReady) return;
    const unique = `it-${Date.now()}@nestbean.test`;
    const { data, error } = await anonClient
      .from('contact_submissions')
      .insert({
        email: unique,
        name: 'IT Test',
        subject: 'feedback',
        message: 'Integration test message — safe to archive.',
      })
      .select('id, status')
      .single();

    expect(error).toBeNull();
    expect(data?.status).toBe('new');
    expect(data?.id).toBeTruthy();
  });
});

describeIt('Supabase auth & membership (integration)', () => {
  const userCreds = getTestUserCreds();
  const adminCreds = getTestAdminCreds();

  let userClient;
  let signedIn = false;
  let schemaReady = false;

  beforeAll(async () => {
    userClient = createTestClient();
    const { error: schemaError } = await userClient.from('profiles').select('id').limit(1);
    schemaReady = !isSchemaMissing(schemaError);
    if (!schemaReady) {
      console.warn('Skipping auth IT — migration not applied');
      return;
    }
    const { error } = await userClient.auth.signInWithPassword(userCreds);
    signedIn = !error;
  });

  afterAll(async () => {
    if (signedIn) await userClient?.auth.signOut();
  });

  it('signs in test user when seeded', async () => {
    if (!schemaReady) return;
    if (!signedIn) {
      console.warn('Skipping auth tests — run: npm run seed:test-users');
    }
    expect(signedIn).toBe(true);
  });

  it('returns profile and trial membership for test user', async () => {
    if (!schemaReady || !signedIn) return;

    const { data: { user } } = await userClient.auth.getUser();
    expect(user?.email).toBe(userCreds.email);

    const { data: profile, error: profileError } = await userClient
      .from('profiles')
      .select('id, role, display_name')
      .eq('id', user.id)
      .single();

    expect(profileError).toBeNull();
    expect(profile?.role).toBe('user');

    const { data: membership, error: memError } = await userClient
      .from('memberships')
      .select('status, plan, trial_ends_at, premium_until')
      .eq('user_id', user.id)
      .single();

    expect(memError).toBeNull();
    expect(membership?.plan).toBe('premium');
    expect(['trial', 'active', 'comp', 'free', 'expired']).toContain(membership?.status);
  });

  it('redeem_promo_code applies FOUNDING30 or reports already redeemed', async () => {
    if (!schemaReady || !signedIn) return;

    const { data, error } = await userClient.rpc('redeem_promo_code', { p_code: 'FOUNDING30' });

    if (error) {
      expect(error.message).toMatch(/already redeemed|Invalid|inactive/i);
      return;
    }

    expect(data?.success).toBe(true);
    expect(['trial', 'active', 'comp']).toContain(data?.status);
  });

  it('reflects premium after promo via membership read', async () => {
    if (!schemaReady || !signedIn) return;

    const { data: { user } } = await userClient.auth.getUser();
    const { data: membership } = await userClient
      .from('memberships')
      .select('status, trial_ends_at, premium_until')
      .eq('user_id', user.id)
      .single();

    expect(membership).toBeTruthy();
    if (membership.status === 'trial' || membership.status === 'active' || membership.status === 'comp') {
      expect(isPremiumActive(membership)).toBe(true);
    }
  });

  it('admin user can sign in and read contact inbox', async () => {
    if (!schemaReady || !adminCreds.email || !adminCreds.password) return;

    const adminClient = createTestClient();
    const { error: signInError } = await adminClient.auth.signInWithPassword(adminCreds);

    if (signInError) {
      console.warn('Admin not seeded — run: npm run seed:test-users');
      return;
    }

    const { data: profile } = await adminClient
      .from('profiles')
      .select('role')
      .single();

    expect(['admin', 'support']).toContain(profile?.role);

    const { data: inbox, error: inboxError } = await adminClient
      .from('contact_submissions')
      .select('id')
      .limit(1);

    expect(inboxError).toBeNull();
    expect(Array.isArray(inbox)).toBe(true);

    await adminClient.auth.signOut();
  });
});

if (!enabled) {
  describe('Supabase integration (skipped)', () => {
    it('set SUPABASE_IT=1 and test creds in .env — see .env.test.example', () => {
      expect(true).toBe(true);
    });
  });
}
