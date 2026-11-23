/**
 * Named clinical reviewers. Leave empty until a real person consents.
 * TODO(Mohit): add only real, consenting reviewers.
 *
 * @typedef {object} Reviewer
 * @property {string} slug
 * @property {string} name
 * @property {string} credentials
 * @property {string} [registration]
 * @property {string} role
 * @property {string} [affiliation]
 * @property {string} [photo]
 * @property {string} bio
 * @property {string} reviewedSince ISO date
 * @property {{ label: string, url: string }[]} [links]
 */

/** @type {Reviewer[]} */
export const reviewers = [];

/** @param {string | undefined} value */
export function isNamedReviewer(value) {
  const text = String(value || '').trim();
  return text.length > 0 && !/^pending/i.test(text);
}

/**
 * Public byline credit. Pending labels never appear as a named review.
 * @param {{ reviewedBy?: string, updated?: string }} guide
 */
export function guideCreditLine(guide) {
  if (isNamedReviewer(guide?.reviewedBy)) {
    return `Reviewed by ${guide.reviewedBy}`;
  }
  if (guide?.updated) return `Sources checked ${guide.updated}`;
  return 'Sources listed on this page';
}
