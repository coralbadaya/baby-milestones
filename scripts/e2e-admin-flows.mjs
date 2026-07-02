/**
 * End-to-end smoke for admin-backed features (DIY content + community).
 * Requires .env with Supabase + test admin creds.
 *
 * Run: node scripts/e2e-admin-flows.mjs
 */
import ws from 'ws';
import { createClient } from '@supabase/supabase-js';
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function loadEnv() {
  const path = resolve(process.cwd(), '.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;
const adminEmail = process.env.SUPABASE_TEST_ADMIN_EMAIL || 'nestbean-test-admin@mailinator.com';
const adminPassword = process.env.SUPABASE_TEST_ADMIN_PASSWORD || 'NestbeanTestAdmin1!';

if (!url || !anonKey) {
  console.error('Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY in .env');
  process.exit(1);
}

const client = createClient(url, anonKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

const ACTIVITY_ID = 'm1-1';
const TEST_TITLE = `E2E DIY ${Date.now()}`;
const TEST_VIDEO = 'https://www.youtube.com/results?search_query=e2e+diy+test';

function ok(label) {
  console.log(`  ✓ ${label}`);
}

function fail(label, err) {
  console.error(`  ✗ ${label}:`, err?.message || err);
  process.exitCode = 1;
}

async function signInAdmin() {
  const { error } = await client.auth.signInWithPassword({
    email: adminEmail,
    password: adminPassword,
  });
  if (error) throw new Error(`Admin sign-in failed: ${error.message}`);
  ok('Admin signed in');
}

async function testDiyContentRoundTrip() {
  console.log('\nDIY content (diy_activity_content)');

  const { data: staticCheck } = await client.from('diy_activity_content').select('activity_id').limit(1);
  if (!staticCheck && (await client.from('diy_activity_content').select('activity_id').limit(1)).error?.code === 'PGRST205') {
    fail('Schema', new Error('Run migration 20250701170000_diy_activity_content.sql'));
    return;
  }

  const upsertPayload = {
    activity_id: ACTIVITY_ID,
    name: TEST_TITLE,
    category: 'sensory',
    duration: '5–10 min',
    difficulty: 'Easy',
    materials: ['E2E paper'],
    steps: ['E2E step one'],
    benefits: ['E2E benefit'],
    why_it_works: 'E2E science copy.',
    video_search: TEST_VIDEO,
    illustration: 'vision_cards',
    updated_at: new Date().toISOString(),
  };

  const { error: upsertError } = await client.from('diy_activity_content').upsert(upsertPayload);
  if (upsertError) {
    fail('Upsert DIY content', upsertError);
    return;
  }
  ok('Admin upserted DIY content');

  const publicClient = createClient(url, anonKey, {
    auth: { persistSession: false },
    realtime: { transport: ws },
  });

  const { data: publicRow, error: publicError } = await publicClient
    .from('diy_activity_content')
    .select('name, video_search')
    .eq('activity_id', ACTIVITY_ID)
    .single();

  if (publicError) {
    fail('Public read DIY content', publicError);
    return;
  }
  if (publicRow.name !== TEST_TITLE) {
    fail('Public read title', new Error(`Expected "${TEST_TITLE}", got "${publicRow.name}"`));
    return;
  }
  if (publicRow.video_search !== TEST_VIDEO) {
    fail('Public read YouTube URL', new Error('video_search mismatch'));
    return;
  }
  ok('Anonymous client reads saved DIY content + YouTube URL');

  const { error: deleteError } = await client.from('diy_activity_content').delete().eq('activity_id', ACTIVITY_ID);
  if (deleteError) {
    fail('Cleanup DIY content', deleteError);
    return;
  }
  ok('Reset DIY content override (cleanup)');
}

async function testCommunityModeration() {
  console.log('\nCommunity feed');

  const { data: memories, error: memError } = await client
    .from('community_memories')
    .select('id, title, status')
    .eq('status', 'published')
    .limit(1);

  if (memError) {
    fail('Read published memories', memError);
    return;
  }
  ok(`Staff reads memories (${memories?.length ?? 0} published sample)`);

  if (!memories?.length) {
    console.log('  ⚠ No published memories — run npm run seed:community');
    return;
  }

  const memoryId = memories[0].id;
  const { data: comments, error: commentError } = await client
    .from('community_memory_comments')
    .select('id, text')
    .eq('memory_id', memoryId);

  if (commentError) {
    fail('Read memory comments', commentError);
    return;
  }
  ok(`Staff reads comments for post (${comments?.length ?? 0})`);

  const before = memories[0].reactions?.heart ?? 0;
  const { error: reactError } = await client.rpc('react_to_community_memory', {
    p_memory_id: memoryId,
    p_reaction: 'heart',
  });
  if (reactError) {
    fail('Reaction RPC', reactError);
    return;
  }

  const { data: updated } = await client
    .from('community_memories')
    .select('reactions')
    .eq('id', memoryId)
    .single();

  if ((updated?.reactions?.heart ?? 0) <= before) {
    fail('Reaction increment', new Error('heart count did not increase'));
    return;
  }
  ok('Reaction RPC increments heart count');
}

async function main() {
  console.log('E2E admin flows smoke test');
  console.log(`Supabase: ${url}`);

  try {
    await signInAdmin();
    await testDiyContentRoundTrip();
    await testCommunityModeration();
  } catch (err) {
    console.error('\nFatal:', err.message);
    process.exitCode = 1;
  } finally {
    await client.auth.signOut();
  }

  console.log(process.exitCode ? '\nSome checks failed.' : '\nAll E2E checks passed.');
  process.exit(process.exitCode || 0);
}

main();
