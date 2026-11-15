/**
 * Local-only album for the private `personal/` folder.
 * Photos never leave this machine: no bundle, no commit, no remote upload.
 */
import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { monthAge, monthLabel } from '../src/utils/albumAge.js';
import { buildAlbumHtml } from '../src/book/albumHtml.js';
import { BOOKS_ROOT, createLocalAlbumStore } from '../src/book/albumStore.js';

export const PERSONAL_DIR = path.resolve(process.cwd(), 'personal');
export const ALBUM_FILE = path.join(PERSONAL_DIR, 'album.json');
export const HTML_FILE = path.join(PERSONAL_DIR, 'first-year-3d-album.html');

const PHOTO_NAME = /^[\w.-]+\.(jpe?g|png|webp)$/i;

export function photoPath(name) {
  if (!name || name !== path.basename(name) || !PHOTO_NAME.test(name)) return null;
  const full = path.resolve(PERSONAL_DIR, name);
  if (!full.startsWith(PERSONAL_DIR + path.sep)) return null;
  if (!existsSync(full)) return null;
  return full;
}

function formatWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const day = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = date.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${day} · ${time}`;
}

export function loadAlbum() {
  if (!existsSync(ALBUM_FILE)) return null;
  const raw = JSON.parse(readFileSync(ALBUM_FILE, 'utf8'));
  const dob = raw.dob;
  const pages = (raw.pages || [])
    .filter((page) => photoPath(page.file))
    .map((page) => {
      const month = monthAge(page.capturedAt, dob);
      return {
        file: page.file,
        capturedAt: page.capturedAt,
        month,
        monthLabel: monthLabel(month),
        title: page.title,
        caption: page.caption,
        when: formatWhen(page.capturedAt),
        src: `/api/personal-album/file/${encodeURIComponent(page.file)}`,
      };
    })
    .sort((a, b) => String(a.capturedAt).localeCompare(String(b.capturedAt)));

  if (pages.length) {
    const first = pages[0];
    const last = pages[pages.length - 1];
    const from = first.when.split(' · ')[0];
    const to = last.when.split(' · ')[0];
    pages.push({
      ending: true,
      file: null,
      capturedAt: last.capturedAt,
      month: last.month,
      monthLabel: 'The close',
      title: raw.title || 'The close',
      caption: `${pages.length} photographs, from ${from} to ${to}. This chapter closes here. The next one is still being lived.`,
      when: raw.babyName || '',
      src: null,
    });
  }

  return {
    dob,
    babyName: raw.babyName || 'Your little one',
    title: raw.title || 'First year',
    pages,
  };
}

export function writeAlbumHtml(album = loadAlbum()) {
  if (!album) return null;
  for (const name of readdirSync(PERSONAL_DIR)) {
    if (/^\d{2}-.+\.html$/i.test(name)) unlinkSync(path.join(PERSONAL_DIR, name));
  }
  const full = buildAlbumHtml(album);
  writeFileSync(HTML_FILE, full);
  createLocalAlbumStore(BOOKS_ROOT).save('local-preview', {
    title: album.title,
    babyName: album.babyName,
    style: 'parallax',
    pages: album.pages,
    htmlPath: 'personal/first-year-3d-album.html',
  });
  return { full, pages: [] };
}

export function publishBook(accountId, album, store = createLocalAlbumStore(BOOKS_ROOT)) {
  return store.save(accountId, {
    title: album.title,
    babyName: album.babyName,
    style: album.style || 'parallax',
    pages: album.pages,
    html: buildAlbumHtml(album),
  });
}
