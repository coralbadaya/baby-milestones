import { mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { createLocalAlbumStore } from './albumStore';
import { publishBook } from '../../scripts/personal-album.mjs';

describe('local album store', () => {
  it('keeps one book per account and rejects a path-like id', () => {
    const store = createLocalAlbumStore(mkdtempSync(path.join(tmpdir(), 'yt-books-')));
    const saved = store.save('account_1', {
      title: 'First year',
      babyName: 'A',
      pages: [{ title: 'One' }],
      html: '<html>book</html>',
    });
    expect(saved.storage).toBe('local');
    expect(saved.pageCount).toBe(1);
    expect(store.read('account_1').title).toBe('First year');
    expect(readFileSync(path.join(store.root, 'account_1', 'book.html'), 'utf8')).toContain('book');
    expect(store.read('missing')).toBeNull();
    expect(() => store.save('../etc', { pages: [] })).toThrow(/Account id/);
  });

  it('publishes a foldable album with the three modes into that account folder', () => {
    const store = createLocalAlbumStore(mkdtempSync(path.join(tmpdir(), 'yt-books-')));
    publishBook('plus-user', {
      title: 'First year',
      babyName: 'A',
      dob: '2026-01-22',
      pages: [{
        ending: true,
        file: '',
        monthLabel: 'The close',
        title: 'First year',
        caption: 'Done.',
        when: 'A',
      }],
    }, store);
    const html = readFileSync(path.join(store.root, 'plus-user', 'book.html'), 'utf8');
    expect(html).toContain('data-style="parallax"');
    expect(html).toContain('data-style="popup"');
    expect(html).toContain('data-style="snowglobe"');
    expect(html).toContain('const FOLD_MS = 1900');
    expect(store.read('plus-user').pageCount).toBe(1);
  });
});
