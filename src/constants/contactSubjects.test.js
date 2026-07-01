import { describe, it, expect } from 'vitest';
import { contactSubjectLabel, CONTACT_SUBJECT_OPTIONS } from '../constants/contactSubjects';

describe('contactSubjectLabel', () => {
  it('maps known subject values to labels', () => {
    for (const { value, label } of CONTACT_SUBJECT_OPTIONS) {
      expect(contactSubjectLabel(value)).toBe(label);
    }
  });

  it('returns em dash for empty values', () => {
    expect(contactSubjectLabel(null)).toBe('—');
    expect(contactSubjectLabel('')).toBe('—');
  });

  it('falls back to raw value for unknown subjects', () => {
    expect(contactSubjectLabel('custom')).toBe('custom');
  });
});
