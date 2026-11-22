import { describe, expect, it } from 'vitest';
import { isValidElement } from 'react';
import { guideRichText, stripGuideMarks } from './guideRichText';

function flatten(node) {
  if (node == null || typeof node === 'string' || typeof node === 'number') return String(node ?? '');
  if (Array.isArray(node)) return node.map(flatten).join('');
  if (isValidElement(node)) {
    const kids = node.props?.children;
    if (node.type === 'strong') return `<strong>${flatten(kids)}</strong>`;
    return flatten(kids);
  }
  return '';
}

describe('guideRichText', () => {
  it('returns plain strings unchanged', () => {
    expect(guideRichText('No marks here.')).toBe('No marks here.');
    expect(guideRichText('')).toBe('');
    expect(guideRichText(null)).toBe(null);
  });

  it('wraps **facts** in strong', () => {
    const html = flatten(guideRichText('Log **BCG** at **birth**.'));
    expect(html).toBe('Log <strong>BCG</strong> at <strong>birth</strong>.');
  });

  it('strips marks for JSON-LD', () => {
    expect(stripGuideMarks('Log **BCG** at **birth**.')).toBe('Log BCG at birth.');
  });

  it('leaves unmatched markers as text', () => {
    const html = flatten(guideRichText('Half **bold and trailing'));
    expect(html).toBe('Half **bold and trailing');
    expect(html).not.toContain('<strong>');
  });
});
