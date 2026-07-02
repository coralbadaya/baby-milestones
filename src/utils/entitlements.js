import { ENTITLEMENT_LIMITS, PREMIUM_FEATURES } from '../constants/premium';
import { isPlusActive, isPremiumActive } from './membership';

/**
 * @typedef {{
 *   photos_used_this_month?: number,
 *   photos_month_key?: string,
 *   stories_generated_total?: number,
 *   voice_notes_stored_count?: number,
 *   first_story_generated_at?: string|null,
 *   annual_trial_offered_at?: string|null,
 *   annual_trial_started_at?: string|null,
 * }|null} UsageEntitlements
 */

/**
 * @param {{ plan?: string, status?: string, trial_ends_at?: string|null, premium_until?: string|null }|null} membership
 * @param {UsageEntitlements} usage
 */
export function buildEntitlementState(membership, usage) {
  const plus = isPlusActive(membership) || isPremiumActive(membership);
  const photosUsed = usage?.photos_used_this_month ?? 0;
  const storiesUsed = usage?.stories_generated_total ?? 0;
  const voiceUsed = usage?.voice_notes_stored_count ?? 0;

  return {
    isPlus: plus,
    photos: {
      used: photosUsed,
      limit: plus ? Infinity : ENTITLEMENT_LIMITS.photosPerMonth,
      remaining: plus ? Infinity : Math.max(0, ENTITLEMENT_LIMITS.photosPerMonth - photosUsed),
      canUpload: plus || photosUsed < ENTITLEMENT_LIMITS.photosPerMonth,
    },
    stories: {
      used: storiesUsed,
      limit: plus ? Infinity : ENTITLEMENT_LIMITS.storiesTotal,
      remaining: plus ? Infinity : Math.max(0, ENTITLEMENT_LIMITS.storiesTotal - storiesUsed),
      canGenerate: plus || storiesUsed < ENTITLEMENT_LIMITS.storiesTotal,
    },
    voiceNotes: {
      used: voiceUsed,
      limit: plus ? Infinity : ENTITLEMENT_LIMITS.voiceNotesStored,
      remaining: plus ? Infinity : Math.max(0, ENTITLEMENT_LIMITS.voiceNotesStored - voiceUsed),
      canRecord: plus || voiceUsed < ENTITLEMENT_LIMITS.voiceNotesStored,
      maxSeconds: ENTITLEMENT_LIMITS.voiceNoteMaxSeconds,
    },
    flipBookFull: plus,
    voiceClone: plus,
    hdPhotos: plus,
    export4k: plus,
    printDiscount: plus,
    viewerSeats: plus,
    editorialFocus: plus,
    travelLongHaul: plus,
    shoppingPremiumEdit: plus,
    vaccinationExport: plus,
    assistantAdvanced: plus,
    annualTrialOffered: Boolean(usage?.annual_trial_offered_at),
    firstStoryAt: usage?.first_story_generated_at ?? null,
  };
}

/**
 * @param {ReturnType<typeof buildEntitlementState>} state
 * @param {string} feature
 */
export function canUseFeature(state, feature) {
  if (!state) return false;
  if (feature === PREMIUM_FEATURES.aiStory) return state.stories.canGenerate;
  if (feature === PREMIUM_FEATURES.voiceNotes) return state.voiceNotes.canRecord;
  if (feature === PREMIUM_FEATURES.hdPhotos) return state.hdPhotos;
  return Boolean(state[feature]);
}

/**
 * @param {ReturnType<typeof buildEntitlementState>} state
 * @param {string} feature
 */
export function entitlementBlockedMessage(state, feature) {
  if (canUseFeature(state, feature)) return null;
  if (feature === PREMIUM_FEATURES.aiStory) {
    return 'You\'ve used your free AI story. Upgrade to Plus for unlimited stories.';
  }
  if (feature === PREMIUM_FEATURES.hdPhotos) {
    return `Basic includes ${ENTITLEMENT_LIMITS.photosPerMonth} photos per month. Upgrade for unlimited HD uploads.`;
  }
  if (feature === PREMIUM_FEATURES.voiceNotes) {
    return `Basic includes ${ENTITLEMENT_LIMITS.voiceNotesStored} voice notes. Upgrade for unlimited storage.`;
  }
  return 'Available on Nestbean Plus.';
}
