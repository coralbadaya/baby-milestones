import { clamp01, lerp } from './easing.js';

/**
 * Piecewise linear sample. An exact stop returns that stop's value.
 * The walk matches poseAt: the segment is the one whose end is still ahead.
 */
export function interpolate(progress, stops, values) {
  const p = clamp01(progress);
  let index = 0;
  while (index < stops.length - 2 && stops[index + 1] < p) index += 1;
  const amount = (p - stops[index]) / ((stops[index + 1] - stops[index]) || 1);
  return lerp(values[index], values[index + 1], amount);
}

export function interpolatePose(from, to, amount) {
  return {
    progress: lerp(from.progress, to.progress, amount),
    rotateY: lerp(from.rotateY, to.rotateY, amount),
    rotateX: lerp(from.rotateX, to.rotateX, amount),
    rotateZ: lerp(from.rotateZ, to.rotateZ, amount),
    translateZ: lerp(from.translateZ, to.translateZ, amount),
    shadow: lerp(from.shadow, to.shadow, amount),
  };
}
