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
    const unique = `it-${Date.now()}@yarntrails.test`;
    const { data, error } = await anonClient.rpc('submit_contact_form', {
      p_email: unique,
      p_name: 'IT Test',
      p_subject: 'feedback',
      p_message: 'Integration test message — safe to archive.',
    });

    expect(error).toBeNull();
    expect(data).toBeTruthy();
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
    expect(membership?.plan).toBe('plus');
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

describeIt('Supabase community feed (integration)', () => {
  let adminClient;
  let schemaReady = false;

  beforeAll(async () => {
    const adminCreds = getTestAdminCreds();
    if (!adminCreds.email || !adminCreds.password) return;

    adminClient = createTestClient();
    const { error: signInError } = await adminClient.auth.signInWithPassword(adminCreds);
    if (signInError) return;

    const { error } = await adminClient.from('community_memories').select('id').limit(1);
    schemaReady = !isSchemaMissing(error);
    if (!schemaReady) {
      console.warn('Skipping community IT — apply supabase/migrations/20250701160000_community.sql first');
    }
  });

  afterAll(async () => {
    if (adminClient) await adminClient.auth.signOut();
  });

  it('reads published memories for the public feed', async () => {
    if (!schemaReady) return;

    const { data, error } = await adminClient
      .from('community_memories')
      .select('id, title, status, reactions, created_at')
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      expect(data[0].status).toBe('published');
      expect(data[0].reactions).toBeTruthy();
      expect(data[0].created_at).toMatch(/^\d{4}-/);
    }
  });

  it('reads memory comments linked to published posts', async () => {
    if (!schemaReady) return;

    const { data: memories } = await adminClient
      .from('community_memories')
      .select('id')
      .eq('status', 'published')
      .limit(1);

    if (!memories?.length) return;

    const { data: comments, error } = await adminClient
      .from('community_memory_comments')
      .select('id, text, author_name, created_at, memory_id')
      .eq('memory_id', memories[0].id);

    expect(error).toBeNull();
    expect(Array.isArray(comments)).toBe(true);
    if (comments.length > 0) {
      expect(comments[0].text).toBeTruthy();
      expect(comments[0].created_at).toMatch(/^\d{4}-/);
    }
  });

  it('increments reactions via react_to_community_memory RPC', async () => {
    if (!schemaReady) return;

    const { data: memories } = await adminClient
      .from('community_memories')
      .select('id, reactions')
      .eq('status', 'published')
      .limit(1);

    if (!memories?.length) return;

    const before = memories[0].reactions?.heart ?? 0;
    const { error } = await adminClient.rpc('react_to_community_memory', {
      p_memory_id: memories[0].id,
      p_reaction: 'heart',
    });
    expect(error).toBeNull();

    const { data: updated } = await adminClient
      .from('community_memories')
      .select('reactions')
      .eq('id', memories[0].id)
      .single();

    expect(updated.reactions.heart).toBeGreaterThanOrEqual(before + 1);
  });
});

describeIt('Supabase DIY activity content (integration)', () => {
  let adminClient;
  let anonClient;
  let schemaReady = false;
  const activityId = 'm1-1';
  const testTitle = `IT DIY ${Date.now()}`;

  beforeAll(async () => {
    const adminCreds = getTestAdminCreds();
    if (!adminCreds.email || !adminCreds.password) return;

    adminClient = createTestClient();
    anonClient = createTestClient();
    const { error: signInError } = await adminClient.auth.signInWithPassword(adminCreds);
    if (signInError) return;

    const { error } = await adminClient.from('diy_activity_content').select('activity_id').limit(1);
    schemaReady = !isSchemaMissing(error);
    if (!schemaReady) {
      console.warn('Skipping DIY content IT — apply supabase/migrations/20250701170000_diy_activity_content.sql first');
    }
  });

  afterAll(async () => {
    if (adminClient && schemaReady) {
      await adminClient.from('diy_activity_content').delete().eq('activity_id', activityId);
      await adminClient.auth.signOut();
    }
  });

  it('admin upserts content and anon can read YouTube URL', async () => {
    if (!schemaReady) return;

    const videoUrl = 'https://www.youtube.com/results?search_query=it+diy+test';
    const { error: upsertError } = await adminClient.from('diy_activity_content').upsert({
      activity_id: activityId,
      name: testTitle,
      category: 'sensory',
      duration: '5–10 min',
      difficulty: 'Easy',
      materials: ['Paper'],
      steps: ['Step one'],
      benefits: ['Benefit'],
      why_it_works: 'Because.',
      video_search: videoUrl,
      illustration: 'vision_cards',
      updated_at: new Date().toISOString(),
    });
    expect(upsertError).toBeNull();

    const { data, error } = await anonClient
      .from('diy_activity_content')
      .select('name, video_search')
      .eq('activity_id', activityId)
      .single();

    expect(error).toBeNull();
    expect(data.name).toBe(testTitle);
    expect(data.video_search).toBe(videoUrl);
  });
});

if (!enabled) {
  describe('Supabase integration (skipped)', () => {
    it('set SUPABASE_IT=1 and test creds in .env — see .env.test.example', () => {
      expect(true).toBe(true);
    });
  });
}
