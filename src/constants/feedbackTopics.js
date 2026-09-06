/** Product feedback topics — /feedback page and admin inbox labels */

export const FEEDBACK_TOPIC_OPTIONS = [
  { value: 'love', label: 'Something I love', icon: 'heart' },
  { value: 'suggestion', label: 'A suggestion', icon: 'light-bulb' },
  { value: 'bug', label: "Something's not working", icon: 'bug' },
  { value: 'content', label: 'Content or guides', icon: 'book-open' },
  { value: 'billing', label: 'Membership or billing', icon: 'ticket' },
  { value: 'other', label: 'Something else', icon: 'speech-bubble' },
];

const TOPIC_LABELS = Object.fromEntries(
  FEEDBACK_TOPIC_OPTIONS.map(({ value, label }) => [value, label]),
);

/** @param {string | null | undefined} value */
export function feedbackTopicLabel(value) {
  if (!value) return '';
  return TOPIC_LABELS[value] || '';
}

/**
 * RPC requires a non-empty message. Use the note when present, otherwise the topic label.
 * @param {string} topic
 * @param {string} [description]
 */
export function feedbackMessage(topic, description) {
  const note = String(description || '').trim();
  if (note) return note;
  return feedbackTopicLabel(topic) || 'Feedback';
}
