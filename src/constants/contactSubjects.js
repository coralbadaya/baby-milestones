/** Contact form subject values — shared by Contact page and admin inbox */
export const CONTACT_SUBJECT_OPTIONS = [
  { value: 'general', label: 'General enquiry' },
  { value: 'feedback', label: 'Feedback' },
  { value: 'press', label: 'Press' },
  { value: 'partnership', label: 'Partnership' },
];

const SUBJECT_LABELS = Object.fromEntries(
  CONTACT_SUBJECT_OPTIONS.map(({ value, label }) => [value, label]),
);

/** @param {string | null | undefined} value */
export function contactSubjectLabel(value) {
  if (!value) return '—';
  return SUBJECT_LABELS[value] || value;
}
