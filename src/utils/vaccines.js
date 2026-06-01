const DAYS_PER_MONTH = 30.4375;

export function getCurrentMonthFromBirthDate(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  const days = now.getDate() - birth.getDate();
  const adjusted = days < 0 ? months - 1 : months;
  return Math.max(0, Math.min(36, adjusted + 1));
}

export function monthToDate(birthDate, monthValue) {
  if (!birthDate || monthValue == null) return null;
  const birth = new Date(birthDate);
  const d = new Date(birth);
  d.setDate(d.getDate() + Math.round(monthValue * DAYS_PER_MONTH));
  return d;
}

export function formatMonthLabel(monthValue) {
  if (monthValue === 0) return 'Birth';
  if (Number.isInteger(monthValue)) return `Month ${monthValue}`;
  return `Month ${monthValue}`;
}

export function getVaccineDueState(vaccine, currentMonth, record) {
  const status = record?.status ?? 'pending';
  if (status === 'done') return 'done';
  if (status === 'skipped') return 'skipped';
  if (currentMonth == null) return 'upcoming';

  const due = vaccine?.dueMonth ?? 0;
  const max = vaccine?.maxMonth ?? due;
  if (currentMonth > max) return 'overdue';
  if (currentMonth >= due && currentMonth <= max) return 'due';
  return 'upcoming';
}

export function groupVaccinesByMonth(vaccines) {
  const grouped = new Map();
  vaccines
    .slice()
    .sort((a, b) => (a.dueMonth - b.dueMonth) || a.name.localeCompare(b.name))
    .forEach((v) => {
      const key = String(v.dueMonth);
      if (!grouped.has(key)) grouped.set(key, { month: v.dueMonth, items: [] });
      grouped.get(key).items.push(v);
    });

  return [...grouped.values()];
}

export function computeVaccineStats(vaccines, records, currentMonth) {
  const stats = { total: vaccines.length, done: 0, due: 0, upcoming: 0, overdue: 0, skipped: 0 };
  vaccines.forEach((v) => {
    const state = getVaccineDueState(v, currentMonth, records?.[v.id]);
    if (state === 'done') stats.done += 1;
    else if (state === 'due') stats.due += 1;
    else if (state === 'upcoming') stats.upcoming += 1;
    else if (state === 'overdue') stats.overdue += 1;
    else if (state === 'skipped') stats.skipped += 1;
  });
  return stats;
}

export function formatDateInputValue(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return d.toISOString().split('T')[0];
}

export function toCsv(rows) {
  const esc = (v) => {
    const s = v == null ? '' : String(v);
    if (/[,"\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  };
  return rows.map((row) => row.map(esc).join(',')).join('\n');
}

export function downloadTextFile(filename, mimeType, content) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

