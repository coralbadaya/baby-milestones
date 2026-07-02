import { supabase } from './supabaseClient';
import { memoryPatchToRow, recipeToRow, tipToRow } from './community';

export async function fetchCommunityStats() {
  const [recipes, tips, pendingMemories, publishedMemories] = await Promise.all([
    supabase.from('community_recipes').select('id', { count: 'exact', head: true }),
    supabase.from('community_tips').select('id', { count: 'exact', head: true }),
    supabase.from('community_memories').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('community_memories').select('id', { count: 'exact', head: true }).eq('status', 'published'),
  ]);

  if (recipes.error) throw recipes.error;
  if (tips.error) throw tips.error;
  if (pendingMemories.error) throw pendingMemories.error;
  if (publishedMemories.error) throw publishedMemories.error;

  return {
    recipeCount: recipes.count ?? 0,
    tipCount: tips.count ?? 0,
    pendingMemories: pendingMemories.count ?? 0,
    publishedMemories: publishedMemories.count ?? 0,
  };
}

export async function fetchAdminRecipes() {
  const { data, error } = await supabase
    .from('community_recipes')
    .select('*')
    .order('sort_order')
    .order('title');
  if (error) throw error;
  return data || [];
}

export async function upsertRecipe(recipe, { published = true, featured = false, sortOrder = 0 } = {}) {
  const { data, error } = await supabase
    .from('community_recipes')
    .upsert({
      ...recipeToRow(recipe),
      published,
      featured,
      sort_order: sortOrder,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteRecipe(id) {
  const { error } = await supabase.from('community_recipes').delete().eq('id', id);
  if (error) throw error;
}

export async function updateRecipeFlags(id, patch) {
  const { data, error } = await supabase
    .from('community_recipes')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchAdminTips() {
  const { data, error } = await supabase
    .from('community_tips')
    .select('*')
    .order('sort_order')
    .order('title');
  if (error) throw error;
  return data || [];
}

export async function upsertTip(tip, { published = true, featured = false, sortOrder = 0 } = {}) {
  const { data, error } = await supabase
    .from('community_tips')
    .upsert({
      ...tipToRow(tip),
      published,
      featured,
      sort_order: sortOrder,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTip(id) {
  const { error } = await supabase.from('community_tips').delete().eq('id', id);
  if (error) throw error;
}

export async function updateTipFlags(id, patch) {
  const { data, error } = await supabase
    .from('community_tips')
    .update({ ...patch, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchAdminMemories(status = 'all') {
  let query = supabase
    .from('community_memories')
    .select('*, community_memory_comments(count)')
    .order('created_at', { ascending: false });
  if (status !== 'all') query = query.eq('status', status);
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map((row) => ({
    ...row,
    comment_count: row.community_memory_comments?.[0]?.count ?? 0,
  }));
}

export async function fetchAdminMemory(id) {
  const { data, error } = await supabase
    .from('community_memories')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
}

/**
 * @param {string} id
 * @param {Parameters<typeof memoryPatchToRow>[0]} patch
 */
export async function updateMemory(id, patch) {
  const { data, error } = await supabase
    .from('community_memories')
    .update(memoryPatchToRow(patch))
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchMemoryComments(memoryId) {
  const { data, error } = await supabase
    .from('community_memory_comments')
    .select('*')
    .eq('memory_id', memoryId)
    .order('created_at');
  if (error) throw error;
  return data || [];
}

export async function updateMemoryStatus(id, status) {
  const { data, error } = await supabase
    .from('community_memories')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateMemoryFeatured(id, featured) {
  const { data, error } = await supabase
    .from('community_memories')
    .update({ featured, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteMemory(id) {
  const { error } = await supabase.from('community_memories').delete().eq('id', id);
  if (error) throw error;
}

export async function deleteMemoryComment(id) {
  const { error } = await supabase.from('community_memory_comments').delete().eq('id', id);
  if (error) throw error;
}

/**
 * @param {string} id
 * @param {{ text?: string, author_name?: string }} patch
 */
export async function updateMemoryComment(id, patch) {
  const { data, error } = await supabase
    .from('community_memory_comments')
    .update({
      ...(patch.text !== undefined ? { text: patch.text } : {}),
      ...(patch.author_name !== undefined ? { author_name: patch.author_name } : {}),
    })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function approveAllPendingMemories() {
  const { error } = await supabase
    .from('community_memories')
    .update({ status: 'published', updated_at: new Date().toISOString() })
    .eq('status', 'pending');
  if (error) throw error;
}
