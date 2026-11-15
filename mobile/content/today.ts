export const JOBS = [
  { href: '/baby', label: 'My Baby', detail: 'Milestones' },
  { href: '/book', label: 'Baby book', detail: 'Stories and photos' },
  { href: '/care', label: 'My Care', detail: 'Postpartum' },
  { href: '/vaccination', label: 'Vaccination tracker', detail: 'Schedule and log' },
  { href: '/guides', label: 'Guides & Articles', detail: 'Read by month' },
  { href: '/progress', label: 'Progress', detail: 'What you have checked' },
  { href: '/plus', label: 'Plus', detail: 'The book and the membership' },
] as const;

export function dailyLines(month: number): { baby: string; mother: string } {
  if (month <= 0) {
    return {
      baby: 'The first weeks are for feeding, sleep, and being held.',
      mother: 'Rest is the work. Pain that worsens, or bleeding that soaks a pad in an hour, needs your obstetrician or emergency care.',
    };
  }
  if (month < 6) {
    return {
      baby: 'Watch the month you are in. Skills arrive as a range, not a deadline.',
      mother: 'Your recovery is still part of Today. Sleep and food count as care.',
    };
  }
  if (month < 12) {
    return {
      baby: 'This half-year is for sitting, tasting, and the first distances across a room.',
      mother: 'You are past the earliest weeks. A low mood that stays needs a clinician, not a quieter app.',
    };
  }
  return {
    baby: 'The second and third years are for words, walking, and a wider day.',
    mother: 'You are still in this. Care for yourself stays on Today beside the milestones.',
  };
}
