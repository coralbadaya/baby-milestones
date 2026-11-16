/** Human-readable baby age line for dashboards and account. */

export function formatBabyAgeLine(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  const days = now.getDate() - birth.getDate();
  const adjustedMonths = days < 0 ? months - 1 : months;

  if (adjustedMonths < 0) return "Baby hasn't arrived yet";
  if (adjustedMonths === 0) return 'Newborn — under 1 month';
  if (adjustedMonths === 1) return '1 month old';
  if (adjustedMonths <= 36) return `${adjustedMonths} months old`;
  const years = Math.floor(adjustedMonths / 12);
  const rem = adjustedMonths % 12;
  return `${years} year${years === 1 ? '' : 's'}${rem ? `, ${rem} mo` : ''}`;
}