/**
 * Evergreen long-form guides — the SEO/GEO content hub.
 * See guidesBase.js, milestoneGuides.js, comparisonGuides.js.
 */

import guidesBase from './guidesBase.js';
import { allMilestoneGuides } from './milestoneGuides.js';
import comparisonGuides from './comparisonGuides.js';
import contentGapGuides from './contentGapGuides.js';
import { applyGuideSeo } from './guideSeoEnrichment.js';
import { applyContentGapExpansion } from './contentGapGuideExpansions.js';

const guides = [
  ...guidesBase,
  ...allMilestoneGuides(),
  ...comparisonGuides,
  ...contentGapGuides.map(applyContentGapExpansion),
].map(applyGuideSeo);

export default guides;

/** @param {string} slug */
export function getGuideBySlug(slug) {
  return guides.find((g) => g.slug === slug) || null;
}

export { guides };
