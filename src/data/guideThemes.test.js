import { describe, expect, it } from 'vitest';
import { getGuideBySlug } from './guides';
import { resolveGuideTheme, GUIDE_THEMES } from './guideThemes';

describe('resolveGuideTheme', () => {
  it('maps postpartum hub guide to mom theme', () => {
    const guide = getGuideBySlug('postpartum-recovery-week-by-week');
    expect(guide).toBeTruthy();
    const theme = resolveGuideTheme(guide);
    expect(theme.id).toBe('mom');
    expect(theme).toBe(GUIDE_THEMES.mom);
  });

  it('falls back to trail default for unknown tagging', () => {
    const theme = resolveGuideTheme({ slug: 'unknown-slug', category: 'Misc' });
    expect(theme.id).toBe('default');
  });
});