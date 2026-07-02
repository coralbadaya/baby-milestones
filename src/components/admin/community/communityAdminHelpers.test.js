import { describe, it, expect } from 'vitest';
import {
  formatDateTime,
  formatReactions,
  memoryBadgeVariant,
  memoryStatusLabel,
  memoryTypeLabel,
  splitLines,
} from './communityAdminHelpers.jsx';

describe('community admin helpers', () => {
  it('maps memory status to badge variants', () => {
    expect(memoryBadgeVariant('published')).toBe('active');
    expect(memoryBadgeVariant('pending')).toBe('warning');
    expect(memoryBadgeVariant('hidden')).toBe('neutral');
  });

  it('labels memory types for admin table', () => {
    expect(memoryTypeLabel('milestone')).toBe('Milestone');
    expect(memoryTypeLabel('struggle')).toBe('Real talk');
  });

  it('sums reaction totals for engagement column', () => {
    expect(formatReactions({ heart: 5, celebrate: 2, support: 3 })).toEqual({
      heart: 5,
      celebrate: 2,
      support: 3,
      total: 10,
    });
    expect(formatReactions(null).total).toBe(0);
  });

  it('formatDateTime includes year and time', () => {
    const label = formatDateTime('2026-05-28T10:00:00.000Z');
    expect(label).toMatch(/2026/);
    expect(label).toMatch(/May/);
    expect(label).toMatch(/28/);
  });

  it('formatDateTime returns em dash for empty input', () => {
    expect(formatDateTime(null)).toBe('—');
  });

  it('splitLines trims blank lines for recipe ingredients', () => {
    expect(splitLines('rice\n\ndal\n')).toEqual(['rice', 'dal']);
  });

  it('memoryStatusLabel matches moderation states', () => {
    expect(memoryStatusLabel('pending')).toBe('Pending');
    expect(memoryStatusLabel('published')).toBe('Published');
  });
});
