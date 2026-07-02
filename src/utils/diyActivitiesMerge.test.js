import { describe, it, expect } from 'vitest';
import {
  activityFormFromSources,
  activityToContentRow,
  formToPreviewActivity,
  getStaticActivityById,
  mergeActivityWithContent,
  mergeDiyActivitiesByMonth,
  splitLines,
} from './diyActivitiesMerge';

describe('diyActivitiesMerge', () => {
  const staticActivity = {
    id: 'm1-1',
    name: 'Black & White Vision Cards',
    category: 'sensory',
    duration: '5–10 min',
    difficulty: 'Easy',
    materials: ['White paper'],
    steps: ['Draw patterns'],
    benefits: ['Visual stimulation'],
    whyItWorks: 'High contrast helps vision.',
    videoSearch: 'https://youtube.com/example',
    illustration: 'vision_cards',
    month: 1,
  };

  it('finds bundled activity by id with month', () => {
    const found = getStaticActivityById('m1-1');
    expect(found?.name).toBe('Black & White Vision Cards');
    expect(found?.month).toBe(1);
  });

  it('merges db content over bundled fields', () => {
    const merged = mergeActivityWithContent(staticActivity, {
      name: 'Updated name',
      category: 'motor',
      duration: '15 min',
      difficulty: 'Medium',
      materials: ['Paper'],
      steps: ['Step one'],
      benefits: ['Benefit'],
      why_it_works: 'Because science.',
      video_search: 'https://youtube.com/new',
      illustration: 'tummy_time',
    });
    expect(merged.name).toBe('Updated name');
    expect(merged.illustration).toBe('tummy_time');
    expect(merged.whyItWorks).toBe('Because science.');
  });

  it('returns bundled activity when no override row exists', () => {
    expect(mergeActivityWithContent(staticActivity, null)).toEqual(staticActivity);
  });

  it('builds admin form from static and override sources', () => {
    const form = activityFormFromSources(staticActivity, {
      name: 'DB name',
      category: 'motor',
      duration: '15 min',
      difficulty: 'Medium',
      materials: ['A', 'B'],
      steps: ['One'],
      benefits: ['X'],
      why_it_works: 'Why',
      video_search: 'https://youtube.com/x',
      illustration: 'wave',
    });
    expect(form?.name).toBe('DB name');
    expect(form?.materials).toBe('A\nB');
  });

  it('maps activity to database row shape', () => {
    const row = activityToContentRow(staticActivity, 'user-1');
    expect(row.activity_id).toBe('m1-1');
    expect(row.why_it_works).toBe(staticActivity.whyItWorks);
    expect(row.updated_by).toBe('user-1');
  });

  it('merges all months with override map', () => {
    const months = mergeDiyActivitiesByMonth({
      'm1-1': {
        name: 'Override',
        category: 'sensory',
        duration: '5 min',
        difficulty: 'Easy',
        materials: [],
        steps: [],
        benefits: [],
        why_it_works: 'Why',
        video_search: 'https://youtube.com/x',
        illustration: 'vision_cards',
      },
    });
    const month1 = months.find((m) => m.month === 1);
    expect(month1?.activities[0].name).toBe('Override');
  });

  it('splitLines trims blank lines', () => {
    expect(splitLines(' one \n\n two ')).toEqual(['one', 'two']);
  });

  it('formToPreviewActivity maps admin form to modal activity', () => {
    const activity = formToPreviewActivity({
      name: 'Test',
      category: 'motor',
      duration: '5 min',
      difficulty: 'Easy',
      materials: 'Paper\nPen',
      steps: 'Step one',
      benefits: 'Fun',
      whyItWorks: 'Science',
      videoSearch: 'https://www.youtube.com/results?search_query=test',
      illustration: 'wave',
    }, 'm1-1');
    expect(activity.materials).toEqual(['Paper', 'Pen']);
    expect(activity.videoSearch).toContain('youtube.com');
  });
});
