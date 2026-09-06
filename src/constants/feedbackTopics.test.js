import { describe, it, expect } from 'vitest';
import {
  FEEDBACK_TOPIC_OPTIONS,
  feedbackTopicLabel,
  feedbackMessage,
} from './feedbackTopics';

describe('feedbackTopicLabel', () => {
  it('maps known topics to labels', () => {
    for (const { value, label } of FEEDBACK_TOPIC_OPTIONS) {
      expect(feedbackTopicLabel(value)).toBe(label);
    }
  });

  it('returns empty for unknown or missing values', () => {
    expect(feedbackTopicLabel(null)).toBe('');
    expect(feedbackTopicLabel('')).toBe('');
    expect(feedbackTopicLabel('custom')).toBe('');
  });
});

describe('feedbackMessage', () => {
  it('uses the trimmed description when present', () => {
    expect(feedbackMessage('love', '  The journal is calm.  ')).toBe('The journal is calm.');
  });

  it('falls back to the topic label when the note is empty', () => {
    expect(feedbackMessage('suggestion', '')).toBe('A suggestion');
    expect(feedbackMessage('bug', '   ')).toBe("Something's not working");
  });

  it('falls back to Feedback when the topic is unknown and there is no note', () => {
    expect(feedbackMessage('nope', '')).toBe('Feedback');
  });
});
