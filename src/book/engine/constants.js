/**
 * Turn timing and keyframes. The open book, the reel, and the phone
 * all read these values. Do not retune them here without a visual check.
 */

export const FOLD_MS = 1900;

export const FOLD_POSES = Object.freeze([
  Object.freeze({ t: 0, y: 0, z: 0, x: 0, roll: 0 }),
  Object.freeze({ t: 0.24, y: 16, z: 34, x: 18, roll: 8 }),
  Object.freeze({ t: 0.5, y: 74, z: 70, x: 8, roll: 3 }),
  Object.freeze({ t: 0.76, y: 146, z: 32, x: -7, roll: -4 }),
  Object.freeze({ t: 1, y: 180, z: 0, x: 0, roll: 0 }),
]);

export const BOOK_MODES = Object.freeze([
  Object.freeze({ id: 'parallax', label: 'Parallax' }),
  Object.freeze({ id: 'popup', label: 'Pop-up' }),
  Object.freeze({ id: 'snowglobe', label: 'Snow-globe' }),
]);

/** Enough slices that a curl would read as a curve. The turn does not use it. */
export const CURL_STRIPS = 36;

/** Phone curve. Same Y stops as the reel. X is the phone's own curve. */
export const MOBILE_INPUT = Object.freeze([0, 0.24, 0.5, 0.76, 1]);
export const MOBILE_ROTATE_Y = Object.freeze([0, -16, -74, -146, -180]);
export const MOBILE_ROTATE_X = Object.freeze([0, -14, -8, 6, 0]);

/** Drag past this angle arms the next or previous spread. */
export const DRAG_ARM_DEG = 8;

/** Release past this angle finishes the turn. */
export const DRAG_COMMIT_DEG = 50;
