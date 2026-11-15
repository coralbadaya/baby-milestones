/**
 * Per-account 3D book store.
 *
 * The local driver writes one folder per login under data/books/{accountId}/.
 * A Supabase or Vercel Blob driver can replace it later if it keeps this shape:
 *   save(accountId, book) -> manifest
 *   read(accountId) -> manifest | null
 *
 * Photos are not uploaded here. The caller places image files beside book.html
 * and sets each page.file to that file's name. The personal preview keeps its
 * HTML next to the photos and only records a manifest.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const ACCOUNT_ID = /^[a-zA-Z0-9_-]{1,80}$/;

export const BOOKS_ROOT = path.resolve(process.cwd(), 'data', 'books');

export function assertAccountId(accountId) {
  if (!ACCOUNT_ID.test(String(accountId || ''))) {
    throw new Error('Account id must be letters, numbers, _ or -');
  }
  return String(accountId);
}

export function createLocalAlbumStore(root = BOOKS_ROOT) {
  return {
    driver: 'local',
    root,
    save(accountId, book) {
      const id = assertAccountId(accountId);
      const folder = path.join(root, id);
      mkdirSync(folder, { recursive: true });
      const manifest = {
        accountId: id,
        title: book.title || '',
        babyName: book.babyName || '',
        style: book.style || 'parallax',
        pageCount: Array.isArray(book.pages) ? book.pages.length : 0,
        storage: 'local',
        updatedAt: new Date().toISOString(),
      };
      if (book.htmlPath) manifest.htmlPath = book.htmlPath;
      writeFileSync(path.join(folder, 'book.json'), JSON.stringify(manifest, null, 2));
      if (typeof book.html === 'string') {
        writeFileSync(path.join(folder, 'book.html'), book.html);
        manifest.htmlFile = 'book.html';
      }
      return manifest;
    },
    read(accountId) {
      const id = assertAccountId(accountId);
      const file = path.join(root, id, 'book.json');
      if (!existsSync(file)) return null;
      return JSON.parse(readFileSync(file, 'utf8'));
    },
  };
}
