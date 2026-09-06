import { supabase } from './supabaseClient';

/** @type {Map<string, Promise<object|null>>} */
const inflight = new Map();

/** @param {unknown} error */
export function isUniqueViolation(error) {
  const code = error?.code;
  const message = String(error?.message || '');
  return code === '23505' || /duplicate key|unique constraint/i.test(message);
}

/**
 * Fill empty cloud name/DOB from local seed without overwriting real cloud values.
 * @param {object|null} profile
 * @param {{ name?: string, birthDate?: string }} seed
 */
export function seedPatchForEmptyProfile(profile, seed = {}) {
  if (!profile) return null;
  const patch = {};
  const seedName = (seed.name || '').trim();
  const cloudName = (profile.name || '').trim();
  if (seedName && seedName !== 'Baby' && (!cloudName || cloudName === 'Baby')) {
    patch.name = seedName;
  }
  if (seed.birthDate && !profile.birth_date) {
    patch.birth_date = seed.birthDate;
  }
  return Object.keys(patch).length ? patch : null;
}

/** Test-only: clear the in-flight lock. */
export function resetEnsurePrimaryInflight() {
  inflight.clear();
}

/**
 * @param {string} userId
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 */
async function selectPrimary(userId, client) {
  const { data, error } = await client
    .from('baby_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_primary', true)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * @param {object} profile
 * @param {{ name?: string, birthDate?: string }} seed
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 */
async function applySeedIfEmpty(profile, seed, client) {
  const patch = seedPatchForEmptyProfile(profile, seed);
  if (!patch) return profile;
  const next = { ...patch, updated_at: new Date().toISOString() };
  const { error } = await client.from('baby_profiles').update(next).eq('id', profile.id);
  if (error) throw error;
  return { ...profile, ...next };
}

/**
 * @param {string} userId
 * @param {{ name?: string, birthDate?: string }} seed
 * @param {import('@supabase/supabase-js').SupabaseClient} client
 */
async function loadOrCreatePrimary(userId, seed, client) {
  const existing = await selectPrimary(userId, client);
  if (existing) return applySeedIfEmpty(existing, seed, client);

  const { data: anyRow } = await client
    .from('baby_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (anyRow) {
    if (!anyRow.is_primary) {
      await client
        .from('baby_profiles')
        .update({ is_primary: true, updated_at: new Date().toISOString() })
        .eq('id', anyRow.id);
    }
    return applySeedIfEmpty({ ...anyRow, is_primary: true }, seed, client);
  }

  const { data: created, error: insertErr } = await client
    .from('baby_profiles')
    .insert({
      user_id: userId,
      name: (seed.name || '').trim() || 'Baby',
      birth_date: seed.birthDate || null,
      is_primary: true,
    })
    .select()
    .single();

  if (insertErr && isUniqueViolation(insertErr)) {
    const raced = await selectPrimary(userId, client);
    if (raced) return applySeedIfEmpty(raced, seed, client);
  }
  if (insertErr) throw insertErr;
  return created;
}

/**
 * Ensure the signed-in user has a primary baby_profiles row.
 * Parallel callers share one in-flight request so a second insert cannot
 * trip baby_profiles_one_primary and leave babyProfileId unset.
 *
 * @param {string} userId
 * @param {{ name?: string, birthDate?: string }} [seed]
 * @param {import('@supabase/supabase-js').SupabaseClient} [client]
 */
export async function ensurePrimaryBabyProfile(userId, seed = {}, client = supabase) {
  if (!userId) return null;

  let pending = inflight.get(userId);
  if (!pending) {
    pending = loadOrCreatePrimary(userId, seed, client).finally(() => {
      inflight.delete(userId);
    });
    inflight.set(userId, pending);
  }

  const profile = await pending;
  return applySeedIfEmpty(profile, seed, client);
}
