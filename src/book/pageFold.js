/**
 * Page-fold engine. Four poses — pick up, fold, carry, lay down —
 * shared by the in-app book and the downloaded album.
 * A later driver can import these poses; do not copy the numbers.
 */

export const FOLD_MS = 1900;

export const FOLD_POSES = [
  { t: 0, y: 0, z: 0, x: 0, roll: 0 },
  { t: 0.24, y: 16, z: 34, x: 18, roll: 8 },
  { t: 0.5, y: 74, z: 70, x: 8, roll: 3 },
  { t: 0.76, y: 146, z: 32, x: -7, roll: -4 },
  { t: 1, y: 180, z: 0, x: 0, roll: 0 },
];

export const BOOK_MODES = [
  { id: 'parallax', label: 'Parallax' },
  { id: 'popup', label: 'Pop-up' },
  { id: 'snowglobe', label: 'Snow-globe' },
];

function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

export function poseAt(progress) {
  const p = Math.min(1, Math.max(0, progress));
  let index = 0;
  while (index < FOLD_POSES.length - 2 && FOLD_POSES[index + 1].t < p) index += 1;
  const from = FOLD_POSES[index];
  const to = FOLD_POSES[index + 1];
  const amount = (p - from.t) / ((to.t - from.t) || 1);
  return {
    y: lerp(from.y, to.y, amount),
    z: lerp(from.z, to.z, amount),
    x: lerp(from.x, to.x, amount),
    roll: lerp(from.roll, to.roll, amount),
  };
}

export function poseTransform(pose, forward = true) {
  const sign = forward ? -1 : 1;
  return 'rotateY(' + (sign * pose.y) + 'deg) translateZ(' + pose.z + 'px) rotateX(' + (sign * pose.x) + 'deg) rotateZ(' + (sign * pose.roll) + 'deg)';
}

/** Plain script for the standalone album. No imports, so the file still opens offline. */
export function foldPlayerScript() {
  return [
    'const FOLD_POSES = ' + JSON.stringify(FOLD_POSES) + ';',
    'const FOLD_MS = ' + FOLD_MS + ';',
    'const BOOK_MODES = ' + JSON.stringify(BOOK_MODES) + ';',
    'function foldLerp(a, b, t) { return a + (b - a) * t; }',
    'function poseAt(progress) {',
    '  const p = Math.min(1, Math.max(0, progress));',
    '  let i = 0;',
    '  while (i < FOLD_POSES.length - 2 && FOLD_POSES[i + 1].t < p) i += 1;',
    '  const a = FOLD_POSES[i];',
    '  const b = FOLD_POSES[i + 1];',
    '  const u = (p - a.t) / ((b.t - a.t) || 1);',
    '  return { y: foldLerp(a.y, b.y, u), z: foldLerp(a.z, b.z, u), x: foldLerp(a.x, b.x, u), roll: foldLerp(a.roll, b.roll, u) };',
    '}',
    'function poseTransform(pose, forward) {',
    '  const sign = forward ? -1 : 1;',
    '  return "rotateY(" + (sign * pose.y) + "deg) translateZ(" + pose.z + "px) rotateX(" + (sign * pose.x) + "deg) rotateZ(" + (sign * pose.roll) + "deg)";',
    '}',
  ].join('\n');
}
