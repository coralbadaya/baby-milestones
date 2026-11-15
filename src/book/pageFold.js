/**
 * Page-fold engine. The downloaded album bends one sheet into strips
 * (curlAngles). The rigid poses stay for the reel and the in-app book.
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

/** Enough slices that the bend reads as a curve, not a straight crease. */
export const CURL_STRIPS = 36;

export function curlAngles(progress) {
  const p = Math.min(1, Math.max(0, progress));
  const flat = p >= 1 ? 180 : 0;
  if (p <= 0 || p >= 1) return Array.from({ length: CURL_STRIPS }, () => flat);
  const eased = p * p * (3 - 2 * p);
  const bow = Math.sin(eased * Math.PI);
  const angles = [];
  for (let i = 0; i < CURL_STRIPS; i += 1) {
    const across = i / (CURL_STRIPS - 1);
    angles.push(eased * 180 + bow * 58 * across * across);
  }
  return angles;
}

export function curlLift(progress) {
  const p = Math.min(1, Math.max(0, progress));
  return Math.sin(p * Math.PI) * 42;
}

/** Each strip starts where the previous one ends, so the sheet stays one piece. */
export function curlPose(progress, pageWidth) {
  const angles = curlAngles(progress);
  const width = pageWidth > 0 ? pageWidth : 1;
  const seg = 100 / angles.length;
  const segPx = width / angles.length;
  let x = 0;
  let z = 0;
  return angles.map((angle) => {
    const pose = { angle, x, z };
    const rad = (angle * Math.PI) / 180;
    x += Math.cos(rad) * seg;
    z += Math.sin(rad) * segPx;
    return pose;
  });
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
    'const CURL_STRIPS = ' + CURL_STRIPS + ';',
    'function curlAngles(progress) {',
    '  const p = Math.min(1, Math.max(0, progress));',
    '  const angles = [];',
    '  const flat = p >= 1 ? 180 : 0;',
    '  if (p <= 0 || p >= 1) {',
    '    for (let i = 0; i < CURL_STRIPS; i += 1) angles.push(flat);',
    '    return angles;',
    '  }',
    '  const eased = p * p * (3 - 2 * p);',
    '  const bow = Math.sin(eased * Math.PI);',
    '  for (let i = 0; i < CURL_STRIPS; i += 1) {',
    '    const across = i / (CURL_STRIPS - 1);',
    '    angles.push(eased * 180 + bow * 58 * across * across);',
    '  }',
    '  return angles;',
    '}',
    'function curlLift(progress) {',
    '  const p = Math.min(1, Math.max(0, progress));',
    '  return Math.sin(p * Math.PI) * 42;',
    '}',
    'function curlPose(progress, pageWidth) {',
    '  const angles = curlAngles(progress);',
    '  const width = pageWidth > 0 ? pageWidth : 1;',
    '  const seg = 100 / angles.length;',
    '  const segPx = width / angles.length;',
    '  let x = 0;',
    '  let z = 0;',
    '  const poses = [];',
    '  for (let i = 0; i < angles.length; i += 1) {',
    '    const angle = angles[i];',
    '    const rad = (angle * Math.PI) / 180;',
    '    poses.push({ angle: angle, x: x, z: z });',
    '    x += Math.cos(rad) * seg;',
    '    z += Math.sin(rad) * segPx;',
    '  }',
    '  return poses;',
    '}',
  ].join('\n');
}
