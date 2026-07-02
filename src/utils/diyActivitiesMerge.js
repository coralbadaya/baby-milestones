import staticDiyActivities from '../data/diyActivities';

/**
 * @param {string} activityId
 * @returns {import('../data/diyActivities').default[number]['activities'][number] | null}
 */
export function getStaticActivityById(activityId) {
  for (const monthData of staticDiyActivities) {
    const found = monthData.activities.find((a) => a.id === activityId);
    if (found) return { ...found, month: monthData.month };
  }
  return null;
}

/**
 * @param {ReturnType<typeof getStaticActivityById>} staticActivity
 * @param {Record<string, unknown> | null | undefined} contentRow
 */
export function mergeActivityWithContent(staticActivity, contentRow) {
  if (!staticActivity) return null;
  if (!contentRow) return { ...staticActivity };

  return {
    ...staticActivity,
    name: contentRow.name,
    category: contentRow.category,
    duration: contentRow.duration,
    difficulty: contentRow.difficulty,
    materials: contentRow.materials ?? [],
    steps: contentRow.steps ?? [],
    benefits: contentRow.benefits ?? [],
    whyItWorks: contentRow.why_it_works,
    videoSearch: contentRow.video_search,
    illustration: contentRow.illustration,
  };
}

/**
 * @param {Record<string, Record<string, unknown>>} contentById
 */
export function mergeDiyActivitiesByMonth(contentById = {}) {
  return staticDiyActivities.map((monthData) => ({
    month: monthData.month,
    activities: monthData.activities.map((activity) => (
      mergeActivityWithContent(activity, contentById[activity.id])
    )),
  }));
}

/**
 * @param {ReturnType<typeof getStaticActivityById>} activity
 */
export function activityToContentRow(activity, userId) {
  return {
    activity_id: activity.id,
    name: activity.name,
    category: activity.category,
    duration: activity.duration,
    difficulty: activity.difficulty || 'Easy',
    materials: activity.materials ?? [],
    steps: activity.steps ?? [],
    benefits: activity.benefits ?? [],
    why_it_works: activity.whyItWorks,
    video_search: activity.videoSearch,
    illustration: activity.illustration,
    updated_by: userId || null,
    updated_at: new Date().toISOString(),
  };
}

/**
 * @param {ReturnType<typeof getStaticActivityById>} staticActivity
 * @param {Record<string, unknown> | null | undefined} contentRow
 */
export function activityFormFromSources(staticActivity, contentRow) {
  const merged = mergeActivityWithContent(staticActivity, contentRow);
  if (!merged) return null;
  return {
    name: merged.name,
    category: merged.category,
    duration: merged.duration,
    difficulty: merged.difficulty || 'Easy',
    materials: (merged.materials ?? []).join('\n'),
    steps: (merged.steps ?? []).join('\n'),
    benefits: (merged.benefits ?? []).join('\n'),
    whyItWorks: merged.whyItWorks,
    videoSearch: merged.videoSearch,
    illustration: merged.illustration,
  };
}

export function splitLines(value) {
  return value.split('\n').map((s) => s.trim()).filter(Boolean);
}

/**
 * @param {NonNullable<ReturnType<typeof activityFormFromSources>>} form
 * @param {string} activityId
 */
export function formToPreviewActivity(form, activityId) {
  return {
    id: activityId,
    name: form.name.trim(),
    category: form.category,
    duration: form.duration.trim(),
    difficulty: form.difficulty,
    materials: splitLines(form.materials),
    steps: splitLines(form.steps),
    benefits: splitLines(form.benefits),
    whyItWorks: form.whyItWorks.trim(),
    videoSearch: form.videoSearch.trim(),
    illustration: form.illustration.trim(),
  };
}
