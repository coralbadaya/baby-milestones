import { CURL_STRIPS } from './constants.js';

/**
 * Strip curl. Kept so the album file still contains it.
 * The page turn does not call these.
 */

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
