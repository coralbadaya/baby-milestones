const MAX_BYTES = 2 * 1024 * 1024;
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png'];

/**
 * @param {string} activityId
 * @param {string} [ext='jpg']
 */
export function diyStoragePath(activityId, ext = 'jpg') {
  return `activities/${activityId}.${ext}`;
}

/**
 * @param {File} file
 * @returns {{ ok: true, ext: string } | { ok: false, error: string }}
 */
export function validateDiyImageFile(file) {
  if (!file) return { ok: false, error: 'No file selected' };
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { ok: false, error: 'Use JPEG, WebP, or PNG' };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: 'Image must be under 2 MB' };
  }
  const ext = file.type === 'image/png' ? 'png' : file.type === 'image/webp' ? 'webp' : 'jpg';
  return { ok: true, ext };
}

/**
 * Resize large images client-side before upload (max 800px wide).
 * @param {File} file
 * @returns {Promise<{ blob: Blob, ext: string, contentType: string }>}
 */
export async function prepareDiyImageFile(file) {
  const validated = validateDiyImageFile(file);
  if (!validated.ok) throw new Error(validated.error);

  if (file.size <= 200 * 1024 && validated.ext === 'jpg') {
    return { blob: file, ext: validated.ext, contentType: file.type };
  }

  const bitmap = await createImageBitmap(file);
  const maxWidth = 800;
  const scale = Math.min(1, maxWidth / bitmap.width);
  const width = Math.round(bitmap.width * scale);
  const height = Math.round(bitmap.height * scale);

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  const contentType = validated.ext === 'png' ? 'image/png' : validated.ext === 'webp' ? 'image/webp' : 'image/jpeg';
  const blob = await new Promise((resolve, reject) => {
    canvas.toBlob(
      (result) => (result ? resolve(result) : reject(new Error('Could not process image'))),
      contentType,
      0.85,
    );
  });

  return { blob, ext: validated.ext, contentType };
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} activityId
 * @param {Blob} blob
 * @param {string} contentType
 * @param {string} ext
 */
export async function uploadDiyImageBlob(supabase, activityId, blob, contentType, ext) {
  const path = diyStoragePath(activityId, ext);
  const { error: uploadError } = await supabase.storage
    .from('diy-images')
    .upload(path, blob, { upsert: true, contentType });
  if (uploadError) throw uploadError;
  return path;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} activityId
 * @param {string} storagePath
 * @param {{ altText: string, source: string, attribution?: string, userId?: string }} meta
 */
export async function upsertDiyImageRow(supabase, activityId, storagePath, meta) {
  const { error } = await supabase.from('diy_activity_images').upsert({
    activity_id: activityId,
    storage_path: storagePath,
    alt_text: meta.altText,
    source: meta.source,
    attribution: meta.attribution || null,
    updated_by: meta.userId || null,
    updated_at: new Date().toISOString(),
  });
  if (error) throw error;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} activityId
 * @param {string} [storagePath]
 */
export async function resetDiyActivityImage(supabase, activityId, storagePath) {
  if (storagePath) {
    await supabase.storage.from('diy-images').remove([storagePath]);
  }
  const { error } = await supabase.from('diy_activity_images').delete().eq('activity_id', activityId);
  if (error) throw error;
}

const BLOCKED_URL_PATTERNS = [/pinterest\./i, /pinimg\./i];

/**
 * @param {string} url
 */
export function validateDiyImageUrl(url) {
  try {
    const parsed = new URL(url.trim());
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return { ok: false, error: 'URL must use http or https' };
    }
    if (BLOCKED_URL_PATTERNS.some((re) => re.test(parsed.hostname))) {
      return { ok: false, error: 'That source is not allowed' };
    }
    return { ok: true, url: parsed.href };
  } catch {
    return { ok: false, error: 'Invalid URL' };
  }
}

/**
 * @param {string} url
 * @returns {Promise<{ blob: Blob, contentType: string, ext: string }>}
 */
export async function fetchDiyImageFromUrl(url) {
  const validated = validateDiyImageUrl(url);
  if (!validated.ok) throw new Error(validated.error);

  const response = await fetch(validated.url);
  if (!response.ok) throw new Error(`Download failed (${response.status})`);

  const contentType = response.headers.get('content-type')?.split(';')[0]?.trim() || '';
  if (!ALLOWED_TYPES.includes(contentType)) {
    throw new Error('URL must point to a JPEG, WebP, or PNG image');
  }

  const blob = await response.blob();
  if (blob.size > MAX_BYTES) throw new Error('Downloaded image exceeds 2 MB');

  const ext = contentType === 'image/png' ? 'png' : contentType === 'image/webp' ? 'webp' : 'jpg';
  return { blob, contentType, ext };
}

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';

/**
 * @param {string} storagePath
 */
export function publicDiyImageUrl(storagePath) {
  if (!supabaseUrl || !storagePath) return '';
  return `${supabaseUrl.replace(/\/$/, '')}/storage/v1/object/public/diy-images/${storagePath}`;
}
