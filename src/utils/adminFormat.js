/** Format a timestamptz for admin tables (date + time). Empty values render as an em dash. */
export function formatAdminDateTime(value) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleString();
}
