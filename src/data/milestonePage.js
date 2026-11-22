/** My Baby Monthly Milestones: 4 recent + current + next = 6. */

export const MILESTONE_PAGE_SIZE = 6;
export const MILESTONE_MONTH_COUNT = 36;

export function milestonePageStart(currentMonth, pageSize = MILESTONE_PAGE_SIZE) {
  const total = MILESTONE_MONTH_COUNT;
  const cur = Math.min(total, Math.max(1, Number(currentMonth) || 1));
  let start = cur - (pageSize - 2);
  if (start < 1) start = 1;
  let end = start + pageSize - 1;
  if (end > total) {
    start = Math.max(1, total - pageSize + 1);
  }
  return start;
}

export function shiftMilestonePage(start, delta, pageSize = MILESTONE_PAGE_SIZE) {
  const maxStart = MILESTONE_MONTH_COUNT - pageSize + 1;
  return Math.min(maxStart, Math.max(1, start + delta * pageSize));
}

export function milestonePageEnd(start, pageSize = MILESTONE_PAGE_SIZE) {
  return Math.min(MILESTONE_MONTH_COUNT, start + pageSize - 1);
}
