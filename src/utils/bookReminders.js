/**
 * Monthly chapter reminder for the baby book home tab.
 * @param {string|null} birthDate ISO date string
 * @param {string} [babyName]
 */
export function getMonthlyChapterReminder(birthDate, babyName = 'Your baby') {
  if (!birthDate) {
    return {
      message: 'Add your baby\'s birth date on Today to unlock monthly chapter reminders.',
      monthTurn: null,
      dayName: null,
    };
  }

  const birth = new Date(birthDate);
  const now = new Date();
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  const currentMonth = Math.max(1, Math.min(36, months + 1));

  const nextMonthDate = new Date(birth);
  nextMonthDate.setMonth(birth.getMonth() + currentMonth);
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = dayNames[nextMonthDate.getDay()];

  const name = babyName === 'Your baby' ? babyName : babyName.split(' ')[0];

  return {
    message: `${name} turns ${currentMonth + 1} months ${dayName} — add this chapter.`,
    monthTurn: currentMonth + 1,
    dayName,
    currentMonth,
  };
}

/**
 * Unlock year for time capsule (18th birthday).
 * @param {string} birthDate
 */
export function getTimeCapsuleUnlockYear(birthDate) {
  if (!birthDate) return new Date().getFullYear() + 18;
  const birth = new Date(birthDate);
  return birth.getFullYear() + 18;
}

export default getMonthlyChapterReminder;
