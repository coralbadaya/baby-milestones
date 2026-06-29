import manifest from '../data/emojiManifest.json';

const IMAGE_DIR = '/images/emojis/';

/**
 * Legacy Twemoji PNG resolver — used by migration scripts and ActivityIllustration SVGs.
 * UI chrome uses Phosphor via src/components/Icon.jsx + phosphorIconMap.js.
 */
const EMOJI_TO_KEY = {};

/** @type {Record<string, string>} icon key → public URL */
const KEY_TO_SRC = {};

for (const entry of manifest.entries) {
  if (!entry.downloaded || !entry.imagePath) continue;
  const key = entry.slug && entry.slug !== entry.codepoints ? entry.slug : entry.codepoints;
  KEY_TO_SRC[key] = entry.imagePath;
  KEY_TO_SRC[entry.codepoints] = entry.imagePath;
  EMOJI_TO_KEY[entry.emoji] = key;
}

/** Semantic aliases used in configs */
const ALIASES = {
  'speech-bubble': 'speech-bubble',
  'baby-bottle': 'baby-bottle',
  'light-bulb': 'light-bulb',
  'star-glow': 'star-glow',
  'shopping-cart': 'shopping-cart',
  'speaker-loud': 'speaker-loud',
  'speaker-muted': 'speaker-muted',
  'flexed-bicep': 'flexed-bicep',
  'check-mark': 'check-mark',
  'crescent-moon': 'crescent-moon',
  'two-hearts': 'two-hearts',
  'raised-hand': 'raised-hand',
  't-shirt': 't-shirt',
  check: 'check-mark',
  close: 'close',
  play: 'play',
  star: 'star',
  stopwatch: 'stopwatch',
  medical: 'medical',
  warning: 'warning',
  all: 'target',
  printer: '1f5a8',
  calendar: '1f4c5',
  link: '1f517',
  globe: '1f30d',
  clipboard: 'clipboard',
  microscope: '1f52c',
  airplane: 'airplane',
  train: '1f686',
  car: 'car',
  hotel: 'hotel',
  tree: 'tree',
};

for (const [alias, key] of Object.entries(ALIASES)) {
  if (KEY_TO_SRC[key]) KEY_TO_SRC[alias] = KEY_TO_SRC[key];
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

/**
 * Normalize icon prop: emoji char, slug, or codepoint key → image src path.
 * @param {string | null | undefined} name
 * @returns {string | null}
 */
export function resolveIconSrc(name) {
  if (!name) return null;
  if (name.startsWith('/')) return name;

  if (EMOJI_TO_KEY[name]) {
    return KEY_TO_SRC[EMOJI_TO_KEY[name]] ?? null;
  }

  if (KEY_TO_SRC[name]) return KEY_TO_SRC[name];

  const asCode = emojiToCodepoints(name);
  if (KEY_TO_SRC[asCode]) return KEY_TO_SRC[asCode];

  return `${IMAGE_DIR}${name}.png`;
}

/**
 * @param {string} emoji
 * @returns {string}
 */
export function emojiToIconKey(emoji) {
  if (EMOJI_TO_KEY[emoji]) return EMOJI_TO_KEY[emoji];
  return emojiToCodepoints(emoji);
}

export { KEY_TO_SRC };
