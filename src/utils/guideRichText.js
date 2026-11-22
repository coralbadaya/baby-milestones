import { createElement, Fragment } from 'react';

/**
 * Render a guide string with **facts** as <strong>. No HTML.
 * Unmatched markers stay as text. Nested ** is not supported.
 * @param {string | null | undefined} text
 * @returns {import('react').ReactNode}
 */
/** Strip **marks** for JSON-LD and plain strings. */
export function stripGuideMarks(text) {
  if (text == null || text === '') return text;
  return String(text).replace(/\*\*([^*]+)\*\*/g, '$1');
}

export function guideRichText(text) {
  if (text == null || text === '') return text;
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  if (parts.length === 1) return text;

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return createElement('strong', { key: index }, part.slice(2, -2));
    }
    return createElement(Fragment, { key: index }, part);
  });
}
