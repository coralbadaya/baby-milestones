/**
 * Job tags for the /guides hub. Curated — not one chip per month or keyword.
 * A guide can carry several tags; the first is primary (article theme).
 */

/** @typedef {{ id: string, label: string }} GuideTag */

/** @type {GuideTag[]} */
export const GUIDE_TAGS = [
  { id: 'all', label: 'All' },
  { id: 'milestones', label: 'Milestones' },
  { id: 'vaccines', label: 'Vaccines' },
  { id: 'food', label: 'Food' },
  { id: 'play', label: 'Play' },
  { id: 'care', label: 'Care' },
  { id: 'mom', label: 'Mom' },
  { id: 'memories', label: 'Memories' },
  { id: 'compare', label: 'Compare' },
];

export const JOB_TAGS = GUIDE_TAGS.filter((tag) => tag.id !== 'all');
export const JOB_TAG_IDS = JOB_TAGS.map((tag) => tag.id);

/** Library sections on /guides — original hub groups, then leftover categories. */
export const GUIDE_CATEGORY_ORDER = [
  'Early Years',
  'Memories',
  'Baby Development',
  'Mom Care',
  'Health & Safety',
  'Compare',
];

/** Head-term / pillar guides first inside a section. Month clones stay behind Milestones. */
export const HUB_GUIDE_SLUGS = [
  'baby-monthly-milestones',
  'vaccination-tracker-india',
  'first-year-vaccination-schedule',
  'postpartum-recovery-week-by-week',
  'starting-solids-guide',
  'indian-baby-food-recipes',
  'nursery-rhymes-for-babies',
  'lullabies-for-babies',
  'best-books-for-babies-by-age',
  'baby-photoshoot-ideas-at-home',
  'newborn-dos-and-donts',
  'diy-baby-activities',
  'baby-care-first-year',
  'newborn-essentials-checklist',
  'digital-baby-book-guide',
];

const SLUG_TAGS = {
  'baby-monthly-milestones': ['milestones'],
  'first-year-vaccination-schedule': ['vaccines', 'care'],
  'vaccination-tracker-india': ['vaccines', 'care'],
  'starting-solids-guide': ['food', 'care'],
  'indian-baby-food-recipes': ['food'],
  'diy-baby-activities': ['play', 'care'],
  'nursery-rhymes-for-babies': ['play'],
  'lullabies-for-babies': ['play', 'care'],
  'best-books-for-babies-by-age': ['play'],
  'baby-care-first-year': ['care'],
  'newborn-dos-and-donts': ['care'],
  'newborn-essentials-checklist': ['care'],
  'postpartum-recovery-week-by-week': ['mom', 'care'],
  'baby-photoshoot-ideas-at-home': ['memories'],
  'digital-baby-book-guide': ['memories', 'compare'],
  'baby-memory-book-alternatives': ['memories'],
  'milestone-cards-printable': ['memories', 'milestones'],
  'new-grandparent-gifts': ['memories'],
  'yarntrails-vs-qeepsake': ['compare'],
  'best-baby-book-apps-2026': ['compare', 'memories'],
  'tinybeans-vs-qeepsake': ['compare', 'memories'],
};

const CATEGORY_TAGS = {
  Compare: ['compare'],
  Memories: ['memories'],
  'Baby Book': ['memories'],
  Gifts: ['memories'],
  Tools: ['memories'],
  'Mom Care': ['mom'],
};

export function isMonthMilestoneGuide(guide) {
  return Number.isFinite(guide?.milestoneMonth);
}

export function isJobTag(id) {
  return JOB_TAG_IDS.includes(id);
}

/** Drop unknown ids; keep first occurrence. */
export function sanitizeTags(list) {
  if (!Array.isArray(list)) return [];
  const seen = new Set();
  const out = [];
  for (const raw of list) {
    if (!isJobTag(raw) || seen.has(raw)) continue;
    seen.add(raw);
    out.push(raw);
  }
  return out;
}

/**
 * Primary first, remaining job tags in catalog order.
 * @param {string[]} list
 * @param {string} [primary]
 */
export function orderTags(list, primary) {
  const unique = sanitizeTags(list);
  const head = unique.includes(primary) ? primary : unique[0];
  if (!head) return [];
  return [head, ...JOB_TAG_IDS.filter((id) => id !== head && unique.includes(id))];
}

export function defaultTagsForGuide(guide) {
  if (!guide) return [];
  const fromSlug = SLUG_TAGS[guide.slug];
  if (fromSlug) return fromSlug;
  if (isMonthMilestoneGuide(guide)) return ['milestones'];
  return CATEGORY_TAGS[guide.category] || [];
}

/**
 * @param {{ slug?: string, category?: string, milestoneMonth?: number }} guide
 * @param {Record<string, string[]> | null} [overrides]
 */
export function tagsForGuide(guide, overrides = null) {
  if (!guide) return [];
  const override = overrides?.[guide.slug];
  if (override !== undefined) return sanitizeTags(override);
  return defaultTagsForGuide(guide);
}

export function primaryTag(guide, overrides = null) {
  return tagsForGuide(guide, overrides)[0] || null;
}

export function tagLabel(id) {
  return GUIDE_TAGS.find((tag) => tag.id === id)?.label || id;
}

export function parseGuideTag(raw) {
  if (!raw || raw === 'all') return 'all';
  return GUIDE_TAGS.some((tag) => tag.id === raw) ? raw : 'all';
}

/**
 * @param {Array<{ slug: string, title?: string, category?: string, milestoneMonth?: number }>} list
 */
export function groupGuidesByCategory(list) {
  const extras = [];
  const seen = new Set();
  for (const guide of list) {
    const category = guide.category || 'Other';
    if (!GUIDE_CATEGORY_ORDER.includes(category) && !seen.has(category)) {
      seen.add(category);
      extras.push(category);
    }
  }
  extras.sort((a, b) => a.localeCompare(b));

  return [...GUIDE_CATEGORY_ORDER, ...extras]
    .map((category) => ({
      category,
      items: list.filter((guide) => (guide.category || 'Other') === category),
    }))
    .filter((group) => group.items.length > 0);
}

/**
 * @param {Array<{ slug: string, milestoneMonth?: number }>} guides
 * @param {string} tag
 * @param {{ currentMonth?: number | null, overrides?: Record<string, string[]> | null }} [opts]
 */
export function listGuidesForTag(guides, tag, { currentMonth = null, overrides = null } = {}) {
  const id = parseGuideTag(tag);

  if (id === 'all') {
    return sortHubFirst(guides.filter((guide) => !isMonthMilestoneGuide(guide)));
  }

  const tagged = guides.filter((guide) => tagsForGuide(guide, overrides).includes(id));
  if (id === 'milestones') return sortMilestones(tagged, currentMonth);
  return sortHubFirst(tagged);
}

function sortHubFirst(list) {
  const rank = new Map(HUB_GUIDE_SLUGS.map((slug, index) => [slug, index]));
  return list.slice().sort((a, b) => {
    const aRank = rank.has(a.slug) ? rank.get(a.slug) : HUB_GUIDE_SLUGS.length;
    const bRank = rank.has(b.slug) ? rank.get(b.slug) : HUB_GUIDE_SLUGS.length;
    if (aRank !== bRank) return aRank - bRank;
    return (a.title || a.slug).localeCompare(b.title || b.slug);
  });
}

function sortMilestones(list, currentMonth) {
  const hub = list.filter((guide) => !isMonthMilestoneGuide(guide));
  const months = list.filter(isMonthMilestoneGuide).slice().sort((a, b) => {
    if (currentMonth) {
      const aDist = Math.abs(a.milestoneMonth - currentMonth);
      const bDist = Math.abs(b.milestoneMonth - currentMonth);
      if (aDist !== bDist) return aDist - bDist;
    }
    return a.milestoneMonth - b.milestoneMonth;
  });
  return [...sortHubFirst(hub), ...months];
}
