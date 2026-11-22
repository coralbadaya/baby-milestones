import { describe, it, expect } from 'vitest';
import {
  defaultTagsForGuide,
  groupGuidesByCategory,
  isMonthMilestoneGuide,
  listGuidesForTag,
  orderTags,
  parseGuideTag,
  sanitizeTags,
  tagsForGuide,
} from './guideTags';

const fixtures = [
  { slug: 'baby-monthly-milestones', title: 'Baby Monthly Milestones', category: 'Baby Development' },
  { slug: '7-month-old-milestones', title: '7-Month-Old', category: 'Baby Development', milestoneMonth: 7 },
  { slug: '1-month-old-milestones', title: '1-Month-Old', category: 'Baby Development', milestoneMonth: 1 },
  { slug: 'vaccination-tracker-india', title: 'Vaccination India', category: 'Health & Safety' },
  { slug: 'starting-solids-guide', title: 'Starting Solids', category: 'Health & Safety' },
  { slug: 'diy-baby-activities', title: 'DIY', category: 'Baby Development' },
  { slug: 'postpartum-recovery-week-by-week', title: 'Postpartum', category: 'Mom Care' },
  { slug: 'digital-baby-book-guide', title: 'Baby book', category: 'Baby Book' },
  { slug: 'yarntrails-vs-qeepsake', title: 'Vs Qeepsake', category: 'Compare' },
];

describe('tagsForGuide', () => {
  it('tags month guides as milestones', () => {
    expect(tagsForGuide(fixtures[1])).toEqual(['milestones']);
  });

  it('allows several job tags on a pillar slug', () => {
    expect(tagsForGuide(fixtures.find((g) => g.slug === 'vaccination-tracker-india'))).toEqual(['vaccines', 'care']);
    expect(tagsForGuide(fixtures.find((g) => g.slug === 'starting-solids-guide'))).toEqual(['food', 'care']);
  });

  it('prefers staff overrides over bundled defaults', () => {
    const guide = fixtures.find((g) => g.slug === 'diy-baby-activities');
    expect(defaultTagsForGuide(guide)).toEqual(['play', 'care']);
    expect(tagsForGuide(guide, { 'diy-baby-activities': ['play', 'memories'] })).toEqual(['play', 'memories']);
  });
});

describe('sanitizeTags and orderTags', () => {
  it('drops unknown ids and All', () => {
    expect(sanitizeTags(['all', 'food', 'nope', 'food', 'care'])).toEqual(['food', 'care']);
  });

  it('puts the primary tag first', () => {
    expect(orderTags(['care', 'food', 'vaccines'], 'food')).toEqual(['food', 'vaccines', 'care']);
  });
});

describe('listGuidesForTag', () => {
  it('All hides month clones and keeps the milestones hub', () => {
    const listed = listGuidesForTag(fixtures, 'all');
    expect(listed.some(isMonthMilestoneGuide)).toBe(false);
    expect(listed[0].slug).toBe('baby-monthly-milestones');
  });

  it('Milestones puts the current month first after the hub', () => {
    const listed = listGuidesForTag(fixtures, 'milestones', { currentMonth: 7 });
    expect(listed[0].slug).toBe('baby-monthly-milestones');
    expect(listed[1].slug).toBe('7-month-old-milestones');
  });

  it('Food lists every guide with that tag, including care-tagged food pillars', () => {
    const listed = listGuidesForTag(fixtures, 'food');
    expect(listed.map((g) => g.slug)).toEqual(['starting-solids-guide']);
  });

  it('Care includes multi-tagged pillars', () => {
    const slugs = listGuidesForTag(fixtures, 'care').map((g) => g.slug);
    expect(slugs).toContain('vaccination-tracker-india');
    expect(slugs).toContain('starting-solids-guide');
    expect(slugs).toContain('diy-baby-activities');
  });

  it('includes a month guide in another tag when staff adds that tag', () => {
    const listed = listGuidesForTag(fixtures, 'play', {
      overrides: { '7-month-old-milestones': ['milestones', 'play'] },
    });
    expect(listed.map((g) => g.slug)).toEqual(['diy-baby-activities', '7-month-old-milestones']);
  });
});

describe('groupGuidesByCategory', () => {
  it('keeps the original hub section order and appends leftovers', () => {
    const groups = groupGuidesByCategory(listGuidesForTag(fixtures, 'all'));
    expect(groups.map((g) => g.category)).toEqual([
      'Baby Development',
      'Mom Care',
      'Health & Safety',
      'Compare',
      'Baby Book',
    ]);
  });
});

describe('parseGuideTag', () => {
  it('falls back to all for unknown tags', () => {
    expect(parseGuideTag('nope')).toBe('all');
    expect(parseGuideTag('play')).toBe('play');
  });
});
