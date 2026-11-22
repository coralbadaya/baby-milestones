import { describe, expect, it } from 'vitest';
import { buildGuideTagOverrideMap } from './guideTagAdmin';

describe('buildGuideTagOverrideMap', () => {
  it('keeps valid tags and drops junk', () => {
    expect(buildGuideTagOverrideMap([
      { slug: 'starting-solids-guide', tags: ['food', 'all', 'care'] },
      { slug: '', tags: ['play'] },
    ])).toEqual({
      'starting-solids-guide': ['food', 'care'],
    });
  });
});
