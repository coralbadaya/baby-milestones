import { MOBILE_INPUT, MOBILE_ROTATE_X, MOBILE_ROTATE_Y } from './constants.js';
import { clamp01 } from './easing.js';
import { interpolate } from './interpolation.js';

/**
 * Phone pose along the existing stops.
 * Cubic easing stays on the Animated clock, so this sample is linear in progress.
 * There is no Z lift and no roll. Backward uses the same curve, progress 0 → 1.
 */
export function getMobilePose(progress) {
  const p = clamp01(progress);
  return {
    progress: p,
    rotateY: interpolate(p, MOBILE_INPUT, MOBILE_ROTATE_Y),
    rotateX: interpolate(p, MOBILE_INPUT, MOBILE_ROTATE_X),
    rotateZ: 0,
    translateZ: 0,
    shadow: 0,
  };
}
