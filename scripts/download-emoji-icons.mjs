/**
 * Scan the codebase for emoji usage, download Twemoji PNG alternates, write manifest.
 * Run: node scripts/download-emoji-icons.mjs
 *
 * Images: public/images/emojis/{codepoint}.png
 * Manifest: src/data/emojiManifest.json + docs/emoji-icons.md
 */
import {
  writeFileSync,
  mkdirSync,
  existsSync,
  readdirSync,
  statSync,
  readFileSync,
} from 'fs';
import { dirname, join, relative } from 'path';
import { fileURLToPath } from 'url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const outDir = join(root, 'public/images/emojis');
const TWEMOJI_BASE = 'https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/72x72';

/** Human-readable slug for common UI emojis (fallback: codepoint) */
const SLUGS = {
  '👶': 'baby',
  '🏠': 'home',
  '🛒': 'shopping-cart',
  '🧳': 'luggage',
  '💬': 'speech-bubble',
  '📊': 'bar-chart',
  '📚': 'books',
  '🔊': 'speaker-loud',
  '🔇': 'speaker-muted',
  '🍼': 'baby-bottle',
  '💡': 'light-bulb',
  '✨': 'sparkles',
  '❤️': 'heart',
  '🎉': 'party',
  '🤝': 'handshake',
  '👍': 'thumbs-up',
  '🌟': 'star-glow',
  '🍽️': 'plate',
  '💕': 'two-hearts',
  '🩺': 'stethoscope',
  '🌙': 'crescent-moon',
  '🎈': 'balloon',
  '🚗': 'car',
  '✈️': 'airplane',
  '🚆': 'train',
  '🌳': 'tree',
  '🏨': 'hotel',
  '🛁': 'bathtub',
  '✋': 'raised-hand',
  '🤲': 'palms-up',
  '👕': 't-shirt',
  '🎯': 'target',
  '🧠': 'brain',
  '🤸': 'cartwheel',
  '🤗': 'hugging',
  '💪': 'flexed-bicep',
  '🧴': 'lotion',
  '🧼': 'soap',
  '🎒': 'backpack',
  '⚠️': 'warning',
  '✅': 'check-mark',
  '📎': 'paperclip',
  '📋': 'clipboard',
  '⏱': 'stopwatch',
  '▶': 'play',
  '⭐': 'star',
  '✓': 'check',
  '✕': 'close',
  '⚕️': 'medical',
};

function walk(dir, files = []) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    try {
      const st = statSync(p);
      if (st.isDirectory()) {
        if (!['node_modules', 'dist'].includes(f)) walk(p, files);
      } else if (/\.(jsx?|css|html)$/.test(f)) {
        files.push(p);
      }
    } catch {
      /* skip */
    }
  }
  return files;
}

function emojiToCodepoints(emoji) {
  const parts = [];
  for (const char of emoji) {
    const cp = char.codePointAt(0);
    if (cp === 0xfe0f) continue;
    parts.push(cp.toString(16));
  }
  return parts.join('-');
}

function scanEmojis() {
  const emojiRe = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}][\uFE0F\u{1F3FB}-\u{1F3FF}\u{200D}\u{1F1E6}-\u{1F1FF}\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]*/gu;
  const extraRe = /[▶⏱⭐♪♫]/g;
  const found = new Map();

  const scanFile = (file) => {
    const text = readFileSync(file, 'utf8');
    const rel = relative(root, file);
    for (const m of text.match(emojiRe) ?? []) {
      if (!m.trim()) continue;
      const key = emojiToCodepoints(m);
      if (!found.has(key)) {
        found.set(key, { emoji: m, codepoints: key, files: new Set() });
      }
      found.get(key).files.add(rel);
    }
    for (const m of text.match(extraRe) ?? []) {
      const key = emojiToCodepoints(m);
      if (!found.has(key)) {
        found.set(key, { emoji: m, codepoints: key, files: new Set() });
      }
      found.get(key).files.add(rel);
    }
  };

  walk(join(root, 'src')).forEach(scanFile);
  if (existsSync(join(root, 'index.html'))) scanFile(join(root, 'index.html'));

  return [...found.values()].sort((a, b) => a.codepoints.localeCompare(b.codepoints));
}

async function downloadEmoji(entry) {
  const fallbacks = {
    '2713': '2705',
    '2715': '274c',
    '266a': null,
    '266b': null,
    '1f468-200d-2695': '1f9d1-200d-2695-fe0f',
  };

  let codepoints = entry.codepoints;
  let url = `${TWEMOJI_BASE}/${codepoints}.png`;
  let res = await fetch(url, { redirect: 'follow' });

  if (!res.ok && fallbacks[codepoints]) {
    codepoints = fallbacks[codepoints];
    url = `${TWEMOJI_BASE}/${codepoints}.png`;
    res = await fetch(url, { redirect: 'follow' });
  }

  if (!res.ok && (entry.codepoints === '266a' || entry.codepoints === '266b')) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72"><text x="36" y="48" text-anchor="middle" font-size="40">${entry.emoji}</text></svg>`;
    const filename = `${entry.codepoints}.svg`;
    writeFileSync(join(outDir, filename), svg);
    const slug = SLUGS[entry.emoji] ?? entry.codepoints;
    return {
      ...entry,
      ok: true,
      url: 'local-svg-fallback',
      imagePath: `/images/emojis/${filename}`,
      slug,
      slugPath: undefined,
      files: [...entry.files].sort(),
      note: 'SVG fallback (Twemoji N/A)',
    };
  }

  if (!res.ok) {
    return { ...entry, ok: false, error: `HTTP ${res.status}`, url, files: [...entry.files].sort() };
  }

  const buf = Buffer.from(await res.arrayBuffer());
  const filename = `${entry.codepoints}.png`;
  writeFileSync(join(outDir, filename), buf);

  const slug = SLUGS[entry.emoji] ?? entry.codepoints;
  const slugPath = slug !== entry.codepoints ? `/images/emojis/${slug}.png` : undefined;
  if (slugPath) {
    writeFileSync(join(outDir, `${slug}.png`), buf);
  }

  return {
    ...entry,
    ok: true,
    url,
    imagePath: `/images/emojis/${filename}`,
    slugPath,
    slug,
    files: [...entry.files].sort(),
    fetchedAs: codepoints !== entry.codepoints ? codepoints : undefined,
  };
}

function suggestAlternate(entry) {
  const slug = SLUGS[entry.emoji];
  if (slug) {
    return `Twemoji PNG — slug \`${slug}\` (Lucide/Feather equivalent: ${slug.replace(/-/g, ' ')})`;
  }
  return 'Twemoji PNG (open-source; replace with custom SVG or icon font if desired)';
}

function buildMarkdown(entries) {
  const lines = [
    '# Emoji inventory & image alternates',
    '',
    'All emoticons used in Yarn Trails, with downloaded **Twemoji** PNG alternates in [`public/images/emojis/`](../public/images/emojis/).',
    '',
    'Regenerate: `npm run download:emojis`',
    '',
    `**Total:** ${entries.length} unique characters`,
    '',
    '| Emoji | Codepoint | Image file | Slug alias | Primary use |',
    '|-------|-----------|------------|------------|-------------|',
  ];

  for (const e of entries) {
    const files = Array.isArray(e.files) ? e.files : [];
    const sample = files.slice(0, 2).join(', ') + (files.length > 2 ? '…' : '');
    const img = e.downloaded ? `\`${e.codepoints}.png\`` : '*(failed)*';
    const slug = e.slugPath ? `\`${e.slug}.png\`` : '—';
    lines.push(`| ${e.emoji} | \`${e.codepoints}\` | ${img} | ${slug} | ${sample} |`);
  }

  lines.push('', '## Navigation & Community (main UI)', '');
  const uiSlugs = new Set([
    'baby', 'home', 'shopping-cart', 'luggage', 'speech-bubble', 'bar-chart', 'books',
    'speaker-loud', 'speaker-muted', 'baby-bottle', 'light-bulb', 'sparkles', 'heart',
    'party', 'handshake', 'thumbs-up', 'stethoscope', 'crescent-moon', 'balloon',
  ]);
  for (const e of entries.filter((x) => uiSlugs.has(x.slug))) {
    lines.push(`- ${e.emoji} → \`${e.imagePath}\` (${e.alternate})`);
  }

  return lines.join('\n');
}

mkdirSync(outDir, { recursive: true });
const scanned = scanEmojis();
console.log(`Found ${scanned.length} unique emoji/symbols`);

const results = [];
let failed = 0;
for (const entry of scanned) {
  const result = await downloadEmoji(entry);
  const files = result.files ?? [...entry.files];
  results.push({
    emoji: result.emoji,
    codepoints: result.codepoints,
    slug: result.slug ?? SLUGS[result.emoji] ?? result.codepoints,
    imagePath: result.imagePath ?? null,
    slugPath: result.slugPath ?? null,
    twemojiUrl: result.url ?? `${TWEMOJI_BASE}/${result.codepoints}.png`,
    alternate: suggestAlternate({ emoji: result.emoji }),
    files,
    downloaded: result.ok ?? false,
    error: result.error,
  });
  if (result.ok) {
    process.stdout.write('.');
  } else {
    failed++;
    console.warn(`\nFailed ${result.emoji} (${result.codepoints}): ${result.error}`);
  }
}
console.log(`\nDownloaded ${results.length - failed}/${results.length}`);

const manifest = {
  generatedAt: new Date().toISOString(),
  source: 'Twemoji 14.0.2 (CDN → local PNG)',
  imageDir: '/images/emojis/',
  count: results.length,
  entries: results,
};

writeFileSync(join(root, 'src/data/emojiManifest.json'), JSON.stringify(manifest, null, 2));
writeFileSync(join(root, 'docs/emoji-icons.md'), buildMarkdown(results));
console.log('Wrote src/data/emojiManifest.json');
console.log('Wrote docs/emoji-icons.md');
