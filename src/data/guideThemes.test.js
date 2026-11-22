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

  it('uses the primary tag from a staff override', () => {
    const guide = getGuideBySlug('postpartum-recovery-week-by-week');
    const theme = resolveGuideTheme(guide, {
      'postpartum-recovery-week-by-week': ['care', 'mom'],
    });
    expect(theme.id).toBe('care');
  });
});