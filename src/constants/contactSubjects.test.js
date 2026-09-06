import { describe, it, expect } from 'vitest';
import { contactSubjectLabel, CONTACT_SUBJECT_OPTIONS } from './contactSubjects';
import { FEEDBACK_TOPIC_OPTIONS } from './feedbackTopics';

describe('contactSubjectLabel', () => {
  it('maps known contact subjects to labels', () => {
    for (const { value, label } of CONTACT_SUBJECT_OPTIONS) {
      expect(contactSubjectLabel(value)).toBe(label);
    }
  });

  it('maps feedback topics to labels for the inbox', () => {
    for (const { value, label } of FEEDBACK_TOPIC_OPTIONS) {
      expect(contactSubjectLabel(value)).toBe(label);
    }
  });

  it('keeps the legacy feedback subject label', () => {
    expect(contactSubjectLabel('feedback')).toBe('Feedback');
  });

  it('does not offer feedback as a Contact dropdown option', () => {
    expect(CONTACT_SUBJECT_OPTIONS.map((option) => option.value)).not.toContain('feedback');
  });

  it('returns em dash for empty values', () => {
    expect(contactSubjectLabel(null)).toBe('—');
    expect(contactSubjectLabel('')).toBe('—');
  });

  it('falls back to raw value for unknown subjects', () => {
    expect(contactSubjectLabel('custom')).toBe('custom');
  });
});
