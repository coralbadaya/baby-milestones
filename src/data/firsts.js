/**
 * Curated life-first moments — photo journal layer (separate from month milestones).
 * @see docs/first-moments-ui-design.md
 */

/** @typedef {{ id: string, sort: number, label: string, monthHint?: number, linkedMilestoneIds?: string[] }} FirstMomentDef */

/** @type {FirstMomentDef[]} */
export const FIRSTS = [
  { id: 'birth', sort: 1, label: 'Birth', monthHint: 1 },
  { id: 'homecoming', sort: 2, label: 'Homecoming', monthHint: 1 },
  { id: 'first-smile', sort: 3, label: 'First Smile', monthHint: 2, linkedMilestoneIds: ['e2-1'] },
  { id: 'first-laugh', sort: 4, label: 'First Laugh', monthHint: 3, linkedMilestoneIds: ['e3-1'] },
  { id: 'crawling', sort: 5, label: 'Crawling', monthHint: 8 },
  { id: 'clapping', sort: 6, label: 'Clapping', monthHint: 9, linkedMilestoneIds: ['e4-2'] },
  { id: 'sitting-up', sort: 7, label: 'Sitting Up', monthHint: 6, linkedMilestoneIds: ['p6-2'] },
  { id: 'standing', sort: 8, label: 'Standing', monthHint: 10 },
  { id: 'first-tooth', sort: 9, label: 'First Tooth', monthHint: 6 },
  { id: 'bath-time', sort: 10, label: 'Bath Time', monthHint: 2 },
  { id: 'first-birthday', sort: 11, label: 'First Birthday', monthHint: 12 },
  { id: 'first-words', sort: 12, label: 'First Words', monthHint: 12, linkedMilestoneIds: ['e12-1'] },
  { id: 'rolling-over', sort: 13, label: 'Rolling Over', monthHint: 4, linkedMilestoneIds: ['p4-1', 'p5-1'] },
  { id: 'waving-bye', sort: 14, label: 'Waving Bye Bye', monthHint: 9 },
  { id: 'first-walk', sort: 15, label: 'First Walk', monthHint: 12, linkedMilestoneIds: ['p12-1'] },
  { id: 'first-food', sort: 16, label: 'First Taste Of Food', monthHint: 6 },
  { id: 'first-haircut', sort: 17, label: 'First Haircut', monthHint: 18 },
];

/** @param {string} id */
export function getFirstById(id) {
  return FIRSTS.find((f) => f.id === id);
}

/**
 * Suggest a first to highlight: next uncaptured near current month, else first uncaptured.
 * @param {number|null} currentMonth
 * @param {Record<string, unknown>} moments
 */
export function getSuggestedFirst(currentMonth, moments = {}) {
  const hasMedia = (f) => moments[f.id]?.photoDataUrl || moments[f.id]?.videoDataUrl;
  const uncaptured = FIRSTS.filter((f) => !hasMedia(f));
  if (uncaptured.length === 0) return FIRSTS[FIRSTS.length - 1].id;

  if (currentMonth) {
    const near = uncaptured.find((f) => f.monthHint != null && Math.abs(f.monthHint - currentMonth) <= 2);
    if (near) return near.id;
  }

  return uncaptured[0].id;
}

/** @param {Record<string, unknown>} moments */
export function countCapturedMoments(moments = {}) {
  return FIRSTS.filter((f) => moments[f.id]?.photoDataUrl || moments[f.id]?.videoDataUrl).length;
}
