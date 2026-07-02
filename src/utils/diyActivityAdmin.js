import { activityToContentRow, splitLines } from './diyActivitiesMerge';

/**
 * @param {string} url
 * @returns {{ ok: true, url: string } | { ok: false, error: string }}
 */
export function validateDiyVideoUrl(url) {
  const trimmed = url.trim();
  if (!trimmed) return { ok: false, error: 'YouTube link is required for the modal button' };

  try {
    const parsed = new URL(trimmed);
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { ok: false, error: 'URL must use http or https' };
    }
    const host = parsed.hostname.replace(/^www\./, '').toLowerCase();
    const allowed = host === 'youtube.com'
      || host === 'youtu.be'
      || host === 'm.youtube.com'
      || host.endsWith('.youtube.com');
    if (!allowed) {
      return { ok: false, error: 'Use a youtube.com or youtu.be link (search or watch URL)' };
    }
    return { ok: true, url: parsed.href };
  } catch {
    return { ok: false, error: 'Invalid YouTube URL' };
  }
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 */
export async function fetchAllDiyContentRows(supabase) {
  const { data, error } = await supabase
    .from('diy_activity_content')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} activityId
 */
export async function fetchDiyContentRow(supabase, activityId) {
  const { data, error } = await supabase
    .from('diy_activity_content')
    .select('*')
    .eq('activity_id', activityId)
    .maybeSingle();
  if (error) throw error;
  return data;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {ReturnType<import('./diyActivitiesMerge').getStaticActivityById>} staticActivity
 * @param {{
 *   name: string,
 *   category: string,
 *   duration: string,
 *   difficulty: string,
 *   materials: string,
 *   steps: string,
 *   benefits: string,
 *   whyItWorks: string,
 *   videoSearch: string,
 *   illustration: string,
 * }} form
 * @param {string} [userId]
 */
export async function upsertDiyContentFromForm(supabase, staticActivity, form, userId) {
  const videoCheck = validateDiyVideoUrl(form.videoSearch);
  if (!videoCheck.ok) throw new Error(videoCheck.error);

  const payload = activityToContentRow(
    {
      ...staticActivity,
      name: form.name.trim(),
      category: form.category,
      duration: form.duration.trim(),
      difficulty: form.difficulty,
      materials: splitLines(form.materials),
      steps: splitLines(form.steps),
      benefits: splitLines(form.benefits),
      whyItWorks: form.whyItWorks.trim(),
      videoSearch: videoCheck.url,
      illustration: form.illustration.trim(),
    },
    userId,
  );

  const { data, error } = await supabase
    .from('diy_activity_content')
    .upsert(payload)
    .select()
    .single();
  if (error) throw error;
  return data;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} activityId
 */
export async function deleteDiyContentRow(supabase, activityId) {
  const { error } = await supabase
    .from('diy_activity_content')
    .delete()
    .eq('activity_id', activityId);
  if (error) throw error;
}
