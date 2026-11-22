const DIFFICULTY_RANK = { Easy: 0, Medium: 1, Hard: 2 };

/** First number in a duration string (`5–10 min` → 5). Missing → last. */
export function durationMinutes(duration) {
  if (!duration) return Number.POSITIVE_INFINITY;
  const match = String(duration).match(/(\d+)/);
  return match ? Number(match[1]) : Number.POSITIVE_INFINITY;
}

export function difficultyRank(difficulty) {
  if (difficulty == null || difficulty === '') return 1;
  return DIFFICULTY_RANK[difficulty] ?? 1;
}

/**
 * Order items for a snap carousel: start on the easiest, then shortest,
 * and avoid the same category twice in a row when another category remains.
 *
 * @template T
 * @param {T[]} items
 * @param {{
 *   getCategory?: (item: T) => string,
 *   getDifficulty?: (item: T) => string | null | undefined,
 *   getDuration?: (item: T) => string | null | undefined,
 * }} [accessors]
 * @returns {T[]}
 */
export function orderForCarousel(items, {
  getCategory = (item) => item.category,
  getDifficulty = (item) => item.difficulty,
  getDuration = (item) => item.duration,
} = {}) {
  const remaining = items.slice();
  if (remaining.length <= 1) return remaining;

  const better = (a, b) => {
    const diff = difficultyRank(getDifficulty(a)) - difficultyRank(getDifficulty(b));
    if (diff !== 0) return diff;
    return durationMinutes(getDuration(a)) - durationMinutes(getDuration(b));
  };

  const pickFrom = (pool) => {
    let pick = pool[0];
    for (let i = 1; i < pool.length; i += 1) {
      if (better(pool[i], pick) < 0) pick = pool[i];
    }
    return pick;
  };

  const ordered = [];
  const first = pickFrom(remaining);
  remaining.splice(remaining.indexOf(first), 1);
  ordered.push(first);

  while (remaining.length) {
    const lastCat = getCategory(ordered[ordered.length - 1]);
    const mixed = remaining.filter((item) => getCategory(item) !== lastCat);
    const pick = pickFrom(mixed.length ? mixed : remaining);
    remaining.splice(remaining.indexOf(pick), 1);
    ordered.push(pick);
  }

  return ordered;
}

/** Holding games added in this month's range (not earlier months). */
export function currentRangeItems(currentItems, previousItems) {
  if (!previousItems?.length) return currentItems.slice();
  const prevIds = new Set(previousItems.map((item) => item.id));
  const fresh = currentItems.filter((item) => !prevIds.has(item.id));
  return fresh.length ? fresh : currentItems.slice();
}
