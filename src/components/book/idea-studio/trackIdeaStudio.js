import { trackEvent } from '../../../utils/analytics';

/**
 * Idea Studio analytics (allowlisted event + sanitized props).
 * @param {'studio_view' | 'card_view' | 'select' | 'photo_start' | 'photo_done' | 'create_start' | 'create_fail' | 'preview' | 'saved'} step
 * @param {{ ideaId?: string, creationType?: string }} [meta]
 */
export function trackIdeaStudio(step, meta = {}) {
  const feature = [step, meta.ideaId].filter(Boolean).join(':').slice(0, 80);
  trackEvent('baby_book_idea', {
    tab: step,
    feature: meta.creationType
      ? `${feature}|${meta.creationType}`.slice(0, 80)
      : feature,
  });
}