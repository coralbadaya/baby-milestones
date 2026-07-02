/** Festival dates for auto-detection (approximate; year-adjusted at runtime) */

export const FESTIVAL_CALENDAR = [
  { id: 'diwali', name: 'Diwali', month: 10, dayRange: [28, 35], regions: ['IN'] },
  { id: 'christmas', name: 'Christmas', month: 12, day: 25, regions: ['global'] },
  { id: 'eid', name: 'Eid', month: 4, dayRange: [10, 20], regions: ['global'], lunar: true },
  { id: 'holi', name: 'Holi', month: 3, dayRange: [10, 20], regions: ['IN'] },
  { id: 'thanksgiving', name: 'Thanksgiving', month: 11, day: 28, regions: ['US'] },
];

export function detectFestivalFromDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const month = d.getMonth() + 1;
  const day = d.getDate();

  for (const fest of FESTIVAL_CALENDAR) {
    if (fest.dayRange) {
      const [start, end] = fest.dayRange;
      if (month === fest.month && day >= start && day <= end) return fest;
    } else if (fest.month === month && fest.day === day) {
      return fest;
    }
  }
  return null;
}

export default FESTIVAL_CALENDAR;
