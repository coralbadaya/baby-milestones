import { supabase } from './supabaseClient';

/**
 * Ensure the signed-in user has a primary baby_profiles row.
 * @param {string} userId
 * @param {{ name?: string, birthDate?: string }} [seed]
 */
export async function ensurePrimaryBabyProfile(userId, seed = {}) {
  if (!userId) return null;

  const { data: existing, error } = await supabase
    .from('baby_profiles')
    .select('*')
    .eq('user_id', userId)
    .eq('is_primary', true)
    .maybeSingle();

  if (error) throw error;
  if (existing) return existing;

  const { data: anyRow } = await supabase
    .from('baby_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (anyRow) {
    if (!anyRow.is_primary) {
      await supabase.from('baby_profiles').update({ is_primary: true, updated_at: new Date().toISOString() }).eq('id', anyRow.id);
    }
    return { ...anyRow, is_primary: true };
  }

  const { data: created, error: insertErr } = await supabase
    .from('baby_profiles')
    .insert({
      user_id: userId,
      name: seed.name || 'Baby',
      birth_date: seed.birthDate || null,
      is_primary: true,
    })
    .select()
    .single();

  if (insertErr) throw insertErr;
  return created;
}
