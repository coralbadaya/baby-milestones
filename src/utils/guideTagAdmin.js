import { JOB_TAG_IDS, orderTags, sanitizeTags } from '../data/guideTags';

/**
 * @param {Array<{ slug?: string, tags?: string[] }>} rows
 * @returns {Record<string, string[]>}
 */
export function buildGuideTagOverrideMap(rows) {
  const map = {};
  for (const row of rows || []) {
    if (!row?.slug) continue;
    map[row.slug] = sanitizeTags(row.tags);
  }
  return map;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export async function fetchGuideTagOverrides(supabase) {
  const { data, error } = await supabase
    .from('guide_tag_overrides')
    .select('slug, tags');
  if (error) throw error;
  return buildGuideTagOverrideMap(data);
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} slug
 * @param {string[]} tags
 * @param {string} [primary]
 * @param {string} [userId]
 */
export async function upsertGuideTags(supabase, slug, tags, primary, userId) {
  const ordered = orderTags(tags, primary);
  const unknown = (tags || []).filter((id) => id && !JOB_TAG_IDS.includes(id));
  if (unknown.length) {
    throw new Error(`Unknown tag: ${unknown[0]}`);
  }
  const { error } = await supabase.from('guide_tag_overrides').upsert({
    slug,
    tags: ordered,
    updated_at: new Date().toISOString(),
    updated_by: userId || null,
  });
  if (error) throw error;
  return ordered;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} slug
 */
export async function resetGuideTags(supabase, slug) {
  const { error } = await supabase
    .from('guide_tag_overrides')
    .delete()
    .eq('slug', slug);
  if (error) throw error;
}
