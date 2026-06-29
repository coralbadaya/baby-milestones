/** Soothing UI sounds — see public/sounds/ and scripts/generate-sounds.mjs */

const SOUND_FILES = {
  tap: '/sounds/tap.wav',
  check: '/sounds/check.wav',
  uncheck: '/sounds/uncheck.wav',
  navigate: '/sounds/navigate.wav',
  celebrate: '/sounds/celebrate.wav',
  swoosh: '/sounds/swoosh.wav',
};

/** @type {Record<string, HTMLAudioElement>} */
const cache = {};

function playFile(key, volume = 0.35) {
  try {
    const src = SOUND_FILES[key];
    if (!src) return;
    if (!cache[key]) {
      const audio = new Audio(src);
      audio.preload = 'auto';
      cache[key] = audio;
    }
    const audio = cache[key].cloneNode();
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch (_) {}
}

export const sounds = {
  check() {
    playFile('check', 0.32);
  },

  uncheck() {
    playFile('uncheck', 0.28);
  },

  navigate() {
    playFile('navigate', 0.22);
  },

  tap() {
    playFile('tap', 0.25);
  },

  celebrate() {
    playFile('celebrate', 0.3);
  },

  swoosh() {
    playFile('swoosh', 0.24);
  },
};

export const haptics = {
  light() {
    if (navigator.vibrate) navigator.vibrate(10);
  },

  medium() {
    if (navigator.vibrate) navigator.vibrate(25);
  },

  heavy() {
    if (navigator.vibrate) navigator.vibrate(50);
  },

  success() {
    if (navigator.vibrate) navigator.vibrate([10, 50, 20]);
  },

  error() {
    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
  },

  selection() {
    if (navigator.vibrate) navigator.vibrate(8);
  },

  pattern(pattern) {
    if (navigator.vibrate) navigator.vibrate(pattern);
  },
};

export function interact(soundName, hapticName = 'light') {
  if (sounds[soundName]) sounds[soundName]();
  if (haptics[hapticName]) haptics[hapticName]();
}
