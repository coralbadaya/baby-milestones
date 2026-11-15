/** Completed months of age. The birthday is the month boundary, matching the website. */

export function monthAge(onDate: Date, dob: string): number | null {
  const birth = new Date(`${dob}T12:00:00`);
  if (Number.isNaN(birth.getTime())) return null;
  let months =
    (onDate.getFullYear() - birth.getFullYear()) * 12 + (onDate.getMonth() - birth.getMonth());
  if (onDate.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

export function monthLabel(month: number): string {
  if (month <= 0) return 'Month 0';
  return `Month ${month}`;
}

const DOB = /^\d{4}-\d{2}-\d{2}$/;

export function isBirthDate(value: string): boolean {
  if (!DOB.test(value)) return false;
  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) return false;
  const [year, month, day] = value.split('-').map(Number);
  return parsed.getFullYear() === year && parsed.getMonth() + 1 === month && parsed.getDate() === day;
}
