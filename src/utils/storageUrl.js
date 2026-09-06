/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} bucket
 * @param {string|null|undefined} path
 * @param {number} [expires]
 */
export async function createSignedUrl(supabase, bucket, path, expires = 3600) {
  if (!path) return null;
  const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expires);
  if (error) return null;
  return data?.signedUrl || null;
}

/**
 * @param {import('@supabase/supabase-js').SupabaseClient} supabase
 * @param {string} bucket
 * @param {string} path
 * @param {Blob|File} file
 * @param {string} [contentType]
 */
export async function uploadPrivateObject(supabase, bucket, path, file, contentType) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType: contentType || file.type || undefined,
    upsert: true,
  });
  if (error) throw error;
  return path;
}
