import { momMilestonePeriods, getAllMomMilestoneItemIds } from '../data/momMilestones.js';
import { MOM_CARE_CATEGORIES } from '../data/momCareTips.js';

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function getPostpartumDays(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const now = new Date();
  if (Number.isNaN(birth.getTime())) return null;
  return Math.max(0, Math.floor((now - birth) / MS_PER_DAY));
}

/** 0-based week index (week 0 = first 7 days after birth) */
export function getPostpartumWeek(birthDate) {
  const days = getPostpartumDays(birthDate);
  if (days == null) return null;
  return Math.floor(days / 7);
}

/** 1-based month since birth, aligned with baby timeline month logic */
export function getPostpartumMonth(birthDate) {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  const now = new Date();
  if (Number.isNaN(birth.getTime())) return null;
  const months = (now.getFullYear() - birth.getFullYear()) * 12 + (now.getMonth() - birth.getMonth());
  const days = now.getDate() - birth.getDate();
  const adjusted = days < 0 ? months - 1 : months;
  return Math.max(1, Math.min(12, adjusted + 1));
}

export function formatPostpartumAge(birthDate) {
  const week = getPostpartumWeek(birthDate);
  const month = getPostpartumMonth(birthDate);
  if (week == null || month == null) return null;
  if (week <= 12) {
    const label = week === 0 ? 'first week' : `week ${week}`;
    return `about ${label} postpartum`;
  }
  return `about month ${month} postpartum`;
}

export function isCurrentPeriod(period, birthDate) {
  const week = getPostpartumWeek(birthDate);
  const month = getPostpartumMonth(birthDate);
  if (week == null || month == null) return false;
  if (period.periodType === 'week') {
    return week >= period.periodStart && week <= period.periodEnd;
  }
  return month >= period.periodStart && month <= period.periodEnd;
}

export function getPeriodProgress(period, checks) {
  const ids = period.items.map((i) => i.id);
  const done = ids.filter((id) => checks[id]).length;
  return { done, total: ids.length };
}

export function getOverallMomMilestoneProgress(checks) {
  const allIds = getAllMomMilestoneItemIds();
  const done = allIds.filter((id) => checks[id]).length;
  return { done, total: allIds.length };
}

export function isValidMomCareTopic(topic) {
  return topic == null || MOM_CARE_CATEGORIES.includes(topic);
}

export function validateMomMilestoneData() {
  const errors = [];
  const itemIds = [];
  for (const period of momMilestonePeriods) {
    if (period.periodStart > period.periodEnd) {
      errors.push(`Period ${period.id}: periodStart > periodEnd`);
    }
    if (!isValidMomCareTopic(period.relatedTopic)) {
      errors.push(`Period ${period.id}: invalid relatedTopic ${period.relatedTopic}`);
    }
    for (const item of period.items) {
      if (!item.id) errors.push(`Period ${period.id}: item missing id`);
      itemIds.push(item.id);
    }
  }
  if (new Set(itemIds).size !== itemIds.length) {
    errors.push('Duplicate mom milestone item ids');
  }
  return errors;
}
