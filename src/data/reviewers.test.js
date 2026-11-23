import { describe, expect, it } from 'vitest';
import { guideCreditLine, isNamedReviewer, reviewers } from './reviewers';

describe('reviewers', () => {
  it('starts with no invented names', () => {
    expect(reviewers).toEqual([]);
  });

  it('treats pending labels as unnamed', () => {
    expect(isNamedReviewer('Pending medical review')).toBe(false);
    expect(isNamedReviewer('Pending review')).toBe(false);
    expect(isNamedReviewer('')).toBe(false);
  });

  it('shows sources checked until a real reviewer exists', () => {
    expect(guideCreditLine({
      reviewedBy: 'Pending medical review',
      updated: '2026-06-29',
    })).toBe('Sources checked 2026-06-29');
    expect(guideCreditLine({
      reviewedBy: 'Dr Example, MBBS',
      updated: '2026-06-29',
    })).toBe('Reviewed by Dr Example, MBBS');
  });
});
