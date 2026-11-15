/** Completed months of age on a capture date, using the birthday as the month boundary. */
export function monthAge(capturedAt, dob) {
  const captured = new Date(capturedAt);
  const birth = new Date(`${dob}T12:00:00`);
  if (Number.isNaN(captured.getTime()) || Number.isNaN(birth.getTime())) return 0;
  let months = (captured.getFullYear() - birth.getFullYear()) * 12
    + (captured.getMonth() - birth.getMonth());
  if (captured.getDate() < birth.getDate()) months -= 1;
  return Math.max(0, months);
}

export function monthLabel(month) {
  if (month <= 0) return 'Month 0';
  return `Month ${month}`;
}
