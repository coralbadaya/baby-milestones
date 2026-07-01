import { describe, it, expect } from 'vitest';
import {
  applyMergeTags,
  buildMergeContext,
  htmlToPlainText,
  canEditCampaign,
  canScheduleCampaign,
} from './newsletter';

describe('applyMergeTags', () => {
  it('replaces known merge tags', () => {
    const ctx = buildMergeContext({ site_url: 'https://nestbean.app' });
    expect(applyMergeTags('Visit {{site_url}} in {{year}}', ctx)).toBe(
      'Visit https://nestbean.app in 2026',
    );
  });

  it('leaves unknown tags intact', () => {
    expect(applyMergeTags('Hello {{unknown}}', {})).toBe('Hello {{unknown}}');
  });
});

describe('htmlToPlainText', () => {
  it('strips tags and converts paragraphs', () => {
    const html = '<p>Hello</p><p>World</p>';
    expect(htmlToPlainText(html)).toContain('Hello');
    expect(htmlToPlainText(html)).toContain('World');
  });

  it('converts list items', () => {
    const html = '<ul><li>One</li><li>Two</li></ul>';
    const text = htmlToPlainText(html);
    expect(text).toContain('• One');
    expect(text).toContain('• Two');
  });
});

describe('campaign status helpers', () => {
  it('allows edit for draft and cancelled', () => {
    expect(canEditCampaign('draft')).toBe(true);
    expect(canEditCampaign('cancelled')).toBe(true);
    expect(canEditCampaign('sent')).toBe(false);
  });

  it('allows schedule only for draft', () => {
    expect(canScheduleCampaign('draft')).toBe(true);
    expect(canScheduleCampaign('scheduled')).toBe(false);
  });
});
