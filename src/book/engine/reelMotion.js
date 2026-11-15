import { FOLD_POSES } from './constants.js';
import { clamp01, lerp } from './easing.js';

/** Unsigned reel keyframe. `y` `x` and `roll` are degrees. `z` is pixels. */
export function poseAt(progress) {
  const p = clamp01(progress);
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

/**
 * Signed reel pose. Forward turns toward the camera's left (negative Y).
 * Backward uses the positive sign. Both play progress 0 → 1.
 */
export function getReelPose(progress, forward = true) {
  const raw = poseAt(progress);
  const sign = forward ? -1 : 1;
  return {
    progress: clamp01(progress),
    rotateY: sign * raw.y,
    rotateX: sign * raw.x,
    rotateZ: sign * raw.roll,
    translateZ: raw.z,
    shadow: Math.sin((raw.y * Math.PI) / 180),
  };
}
