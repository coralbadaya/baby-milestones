/** @typedef {import('../types/community').Recipe} Recipe */
/** @typedef {import('../types/community').ParentingTip} ParentingTip */
/** @typedef {import('../types/community').Memory} Memory */

/**
 * @param {Record<string, unknown>} row
 * @returns {Recipe}
 */
export function rowToRecipe(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description ?? undefined,
    videoUrl: row.video_url ?? undefined,
    aiVideoUrl: row.ai_video_url ?? undefined,
    thumbnail: row.thumbnail ?? undefined,
    prepTime: row.prep_time ?? '',
    ageRange: row.age_range ?? '',
    ageMinMonths: row.age_min_months ?? undefined,
    ingredients: row.ingredients ?? [],
    steps: row.steps ?? [],
    nutritionTip: row.nutrition_tip ?? undefined,
    tags: row.tags ?? [],
    mealType: row.meal_type ?? undefined,
  };
}

/**
 * @param {Partial<Recipe> & { id: string }} recipe
 * @returns {Record<string, unknown>}
 */
export function recipeToRow(recipe) {
  return {
    id: recipe.id,
    title: recipe.title,
    description: recipe.description ?? null,
    video_url: recipe.videoUrl ?? null,
    ai_video_url: recipe.aiVideoUrl ?? null,
    thumbnail: recipe.thumbnail ?? null,
    prep_time: recipe.prepTime ?? '',
    age_range: recipe.ageRange ?? '',
    age_min_months: recipe.ageMinMonths ?? null,
    ingredients: recipe.ingredients ?? [],
    steps: recipe.steps ?? [],
    nutrition_tip: recipe.nutritionTip ?? null,
    tags: recipe.tags ?? [],
    meal_type: recipe.mealType ?? null,
    updated_at: new Date().toISOString(),
  };
}

/**
 * @param {Record<string, unknown>} row
 * @returns {ParentingTip}
 */
export function rowToTip(row) {
  return {
    id: row.id,
    title: row.title,
    tagline: row.tagline ?? '',
    preview: row.preview ?? '',
    content: row.content ?? '',
    ageRange: row.age_range ?? '',
    ageMinMonths: row.age_min_months ?? undefined,
    ageMaxMonths: row.age_max_months ?? undefined,
    category: row.category,
    tags: row.tags ?? [],
  };
}

/**
 * @param {Partial<ParentingTip> & { id: string, category: string }} tip
 * @returns {Record<string, unknown>}
 */
export function tipToRow(tip) {
  return {
    id: tip.id,
    title: tip.title,
    tagline: tip.tagline ?? null,
    preview: tip.preview ?? '',
    content: tip.content ?? '',
    age_range: tip.ageRange ?? '',
    age_min_months: tip.ageMinMonths ?? null,
    age_max_months: tip.ageMaxMonths ?? null,
    category: tip.category,
    tags: tip.tags ?? [],
    updated_at: new Date().toISOString(),
  };
}

/**
 * @param {Record<string, unknown>} row
 * @param {import('../types/community').MemoryComment[]} [comments]
 * @returns {Memory}
 */
export function rowToMemory(row, comments = []) {
  const reactions = row.reactions && typeof row.reactions === 'object'
    ? row.reactions
    : { heart: 0, celebrate: 0, support: 0 };

  return {
    id: row.legacy_id || row.id,
    type: row.type,
    title: row.title,
    content: row.content,
    babyAge: row.baby_age ?? undefined,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    reactions: {
      heart: Number(reactions.heart) || 0,
      celebrate: Number(reactions.celebrate) || 0,
      support: Number(reactions.support) || 0,
    },
    comments: comments.map((c, i) => ({
      id: c.id ?? i,
      text: c.text,
      author: c.author ?? c.author_name ?? 'Anonymous',
      timestamp: c.timestamp ?? c.created_at,
    })),
  };
}

/**
 * @param {string} status
 * @returns {string}
 */
export function memoryStatusLabel(status) {
  const labels = {
    pending: 'Pending',
    published: 'Published',
    hidden: 'Hidden',
  };
  return labels[status] || status;
}
