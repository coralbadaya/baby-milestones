import { describe, it, expect } from 'vitest';
import {
  isMonthMilestoneGuide,
  listGuidesForTag,
  parseGuideTag,
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

  it('maps pillar slugs to a job tag', () => {
    expect(tagsForGuide(fixtures.find((g) => g.slug === 'vaccination-tracker-india'))).toEqual(['vaccines']);
    expect(tagsForGuide(fixtures.find((g) => g.slug === 'starting-solids-guide'))).toEqual(['food']);
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

  it('Food does not include month guides', () => {
    const listed = listGuidesForTag(fixtures, 'food');
    expect(listed.map((g) => g.slug)).toEqual(['starting-solids-guide']);
  });
});

describe('parseGuideTag', () => {
  it('falls back to all for unknown tags', () => {
    expect(parseGuideTag('nope')).toBe('all');
    expect(parseGuideTag('play')).toBe('play');
  });
});
