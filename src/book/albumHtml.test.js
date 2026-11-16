import { describe, expect, it } from 'vitest';
import { buildAlbumHtml } from './albumHtml';

const album = {
  title: 'First year',
  babyName: 'A',
  dob: '2026-01-22',
  pages: [{
    ending: true,
    file: 'close.jpg',
    src: '/api/personal-album/file/close.jpg',
    monthLabel: 'The close',
    title: 'First year',
    caption: 'Done.',
    when: 'A',
  }],
};

describe('buildAlbumHtml', () => {
  it('embeds the same player and points photos at the app when asked', () => {
    const html = buildAlbumHtml(album, { embedded: true, inlinePhotos: true });
    expect(html).toContain('class="embedded"');
    expect(html).toContain('html:has(body.embedded)');
    expect(html).toContain('/api/personal-album/file/close.jpg');
    expect(html).not.toContain('keep this file beside the photos');
    expect(html).toContain('const FOLD_MS = 1900');
    expect(html).toContain('Linen hardcover');
    expect(html).toContain('"index":true');
    expect(html).toContain('classList.toggle(\'closed\'');
    expect(html.slice(html.indexOf('<script>'))).not.toContain('`');
  });

  it('keeps photo file names for the downloaded copy', () => {
    const html = buildAlbumHtml(album);
    expect(html).toContain('"file":"close.jpg"');
    expect(html).not.toContain('class="embedded"');
    expect(html).toContain('keep this file beside the photos');
    expect(html).toContain('height: 100dvh');
  });
});
