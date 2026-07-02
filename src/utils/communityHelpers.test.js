import { describe, it, expect } from 'vitest';
import {
  formatRelativeTime,
  getMemoryTypeConfig,
  MEMORY_TYPES,
} from './communityHelpers';

describe('formatRelativeTime', () => {
  const now = new Date('2026-07-01T12:00:00.000Z');

  it('returns just now for timestamps under one minute', () => {
    expect(formatRelativeTime('2026-07-01T11:59:30.000Z', now)).toBe('just now');
  });

  it('returns minutes ago under one hour', () => {
    expect(formatRelativeTime('2026-07-01T11:45:00.000Z', now)).toBe('15m ago');
  });

  it('returns hours ago under one day', () => {
    expect(formatRelativeTime('2026-07-01T08:00:00.000Z', now)).toBe('4h ago');
  });

  it('returns yesterday for prior calendar day', () => {
    expect(formatRelativeTime('2026-06-30T08:00:00.000Z', now)).toBe('yesterday');
  });

  it('returns days ago within the same week', () => {
    expect(formatRelativeTime('2026-06-28T12:00:00.000Z', now)).toBe('3d ago');
  });

  it('returns month and day for older posts in the same year', () => {
    const label = formatRelativeTime('2026-05-28T10:00:00.000Z', now);
    expect(label).toMatch(/May\s+28/);
    expect(label).not.toMatch(/2026/);
  });

  it('includes year when post is from a previous year', () => {
    const label = formatRelativeTime('2025-05-28T10:00:00.000Z', now);
    expect(label).toMatch(/May\s+28/);
    expect(label).toMatch(/2025/);
  });
});

describe('getMemoryTypeConfig', () => {
  it('returns config for each memory type', () => {
    for (const type of MEMORY_TYPES) {
      expect(getMemoryTypeConfig(type.id).label).toBe(type.label);
    }
  });

  it('falls back to Sweet Moment for unknown types', () => {
    expect(getMemoryTypeConfig('unknown').label).toBe('Sweet Moment');
  });
});
