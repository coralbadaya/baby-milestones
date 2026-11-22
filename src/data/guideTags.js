/**
 * Job tags for the /guides hub. Curated — not one chip per month or keyword.
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

/** Head-term / pillar guides first on All. Month clones stay behind Milestones. */
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
  'first-year-vaccination-schedule': ['vaccines'],
  'vaccination-tracker-india': ['vaccines'],
  'starting-solids-guide': ['food'],
  'indian-baby-food-recipes': ['food'],
  'diy-baby-activities': ['play'],
  'nursery-rhymes-for-babies': ['play'],
  'lullabies-for-babies': ['play'],
  'best-books-for-babies-by-age': ['play'],
  'baby-care-first-year': ['care'],
  'newborn-dos-and-donts': ['care'],
  'newborn-essentials-checklist': ['care'],
  'postpartum-recovery-week-by-week': ['mom'],
  'baby-photoshoot-ideas-at-home': ['memories'],
  'digital-baby-book-guide': ['memories'],
  'baby-memory-book-alternatives': ['memories'],
  'milestone-cards-printable': ['memories'],
  'new-grandparent-gifts': ['memories'],
  'yarntrails-vs-qeepsake': ['compare'],
  'best-baby-book-apps-2026': ['compare'],
  'tinybeans-vs-qeepsake': ['compare'],
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

/** @param {{ slug?: string, category?: string, milestoneMonth?: number }} guide */
export function tagsForGuide(guide) {
  if (!guide) return [];
  const fromSlug = SLUG_TAGS[guide.slug];
  if (fromSlug) return fromSlug;
  if (isMonthMilestoneGuide(guide)) return ['milestones'];
  return CATEGORY_TAGS[guide.category] || [];
}

export function primaryTag(guide) {
  return tagsForGuide(guide)[0] || null;
}

export function tagLabel(id) {
  return GUIDE_TAGS.find((tag) => tag.id === id)?.label || id;
}

export function parseGuideTag(raw) {
  if (!raw || raw === 'all') return 'all';
  return GUIDE_TAGS.some((tag) => tag.id === raw) ? raw : 'all';
}

/**
 * @param {Array<{ slug: string, milestoneMonth?: number }>} guides
 * @param {string} tag
 * @param {{ currentMonth?: number | null }} [opts]
 */
export function listGuidesForTag(guides, tag, { currentMonth = null } = {}) {
  const id = parseGuideTag(tag);

  if (id === 'all') {
    const hub = guides.filter((guide) => !isMonthMilestoneGuide(guide));
    return sortHubFirst(hub);
  }

  const tagged = guides.filter((guide) => tagsForGuide(guide).includes(id));
  if (id === 'milestones') return sortMilestones(tagged, currentMonth);
  return sortHubFirst(tagged.filter((guide) => !isMonthMilestoneGuide(guide)));
}

function sortHubFirst(list) {
  const rank = new Map(HUB_GUIDE_SLUGS.map((slug, index) => [slug, index]));
  return list.slice().sort((a, b) => {
    const aRank = rank.has(a.slug) ? rank.get(a.slug) : HUB_GUIDE_SLUGS.length;
    const bRank = rank.has(b.slug) ? rank.get(b.slug) : HUB_GUIDE_SLUGS.length;
    if (aRank !== bRank) return aRank - bRank;
    return a.title.localeCompare(b.title);
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
