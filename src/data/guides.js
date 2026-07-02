/**
 * Evergreen long-form guides — the SEO/GEO content hub.
 * See guidesBase.js, milestoneGuides.js, comparisonGuides.js.
 */

import guidesBase from './guidesBase.js';
import { allMilestoneGuides } from './milestoneGuides.js';
import comparisonGuides from './comparisonGuides.js';

const guides = [
  ...guidesBase,
  ...allMilestoneGuides(),
  ...comparisonGuides,
];

export default guides;

/** @param {string} slug */
export function getGuideBySlug(slug) {
  return guides.find((g) => g.slug === slug) || null;
}

export { guides };
