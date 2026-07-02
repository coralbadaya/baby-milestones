import { describe, it, expect } from 'vitest';
import { buildEntitlementState, canUseFeature } from './entitlements';
import { PREMIUM_FEATURES } from '../constants/premium';

describe('buildEntitlementState', () => {
  it('allows unlimited uploads for Plus', () => {
    const state = buildEntitlementState(
      { status: 'active', plan: 'plus' },
      { photos_used_this_month: 50, stories_generated_total: 10 },
    );
    expect(state.isPlus).toBe(true);
    expect(state.photos.canUpload).toBe(true);
    expect(state.stories.canGenerate).toBe(true);
  });

  it('caps Basic photos and stories', () => {
    const state = buildEntitlementState(
      { status: 'free', plan: 'free' },
      { photos_used_this_month: 2, stories_generated_total: 1, voice_notes_stored_count: 3 },
    );
    expect(state.photos.canUpload).toBe(false);
    expect(state.stories.canGenerate).toBe(false);
    expect(state.voiceNotes.canRecord).toBe(false);
    expect(state.flipBookFull).toBe(false);
  });

  it('allows first story on Basic', () => {
    const state = buildEntitlementState(
      { status: 'free', plan: 'free' },
      { stories_generated_total: 0 },
    );
    expect(canUseFeature(state, PREMIUM_FEATURES.aiStory)).toBe(true);
  });
});
