#!/usr/bin/env node
/**
 * Creates integration-test users in Supabase Auth + sets admin role.
 * Requires SUPABASE_SECRET_KEY (service role) in .env
 *
 * Usage: npm run seed:test-users
 */
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { createClient } from '@supabase/supabase-js';
import ws from 'ws';

function loadDotEnv() {
  const path = resolve(process.cwd(), '.env');
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^["']|["']$/g, '');
    if (!process.env[key]) process.env[key] = val;
  }
}

loadDotEnv();

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

const TEST_USER = {
  email: process.env.SUPABASE_TEST_USER_EMAIL || 'nestbean-test-user@mailinator.com',
  password: process.env.SUPABASE_TEST_USER_PASSWORD || 'NestbeanTestUser1!',
  displayName: 'Test User',
  role: 'user',
};

const TEST_ADMIN = {
  email: process.env.SUPABASE_TEST_ADMIN_EMAIL || 'nestbean-test-admin@mailinator.com',
  password: process.env.SUPABASE_TEST_ADMIN_PASSWORD || 'NestbeanTestAdmin1!',
  displayName: 'Test Admin',
  role: 'admin',
};

if (!url || !serviceKey) {
  console.error('Missing VITE_SUPABASE_URL and SUPABASE_SECRET_KEY in .env');
  process.exit(1);
}

const admin = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
  realtime: { transport: ws },
});

async function ensureUser({ email, password, displayName, role }) {
  const { data: list } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const existing = list?.users?.find((u) => u.email === email);

  let userId = existing?.id;

  if (!userId) {
    const { data, error } = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { display_name: displayName },
    });
    if (error) throw new Error(`createUser ${email}: ${error.message}`);
    userId = data.user.id;
    console.log(`Created auth user: ${email}`);
  } else {
    console.log(`Auth user exists: ${email}`);
  }

  // Trigger may have created profile; ensure role
  const { error: roleError } = await admin
    .from('profiles')
    .update({ role, display_name: displayName, updated_at: new Date().toISOString() })
    .eq('id', userId);

  if (roleError) {
    // Profile might not exist yet if trigger failed (migration not applied)
    const { error: insertError } = await admin.from('profiles').upsert({
      id: userId,
      display_name: displayName,
      role,
    });
    if (insertError) throw new Error(`profile ${email}: ${insertError.message}`);
  }

  console.log(`  role=${role} id=${userId}`);
  return userId;
}

async function main() {
  console.log('Seeding Nestbean test users…\n');
  await ensureUser(TEST_USER);
  await ensureUser(TEST_ADMIN);
  console.log('\nDone. Credentials (also in .env.test.example):');
  console.log(`  User:  ${TEST_USER.email} / ${TEST_USER.password}`);
  console.log(`  Admin: ${TEST_ADMIN.email} / ${TEST_ADMIN.password}`);
  console.log('\nRun integration tests: SUPABASE_IT=1 npm run test:it');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
