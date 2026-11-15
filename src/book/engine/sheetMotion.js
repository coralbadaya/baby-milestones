import { clamp01, smoothstep } from './easing.js';

/**
 * Open-book sheet. Progress 0 is the right page, flat.
 * Progress 1 is turned onto the left. Backward playback runs 1 → 0.
 * The sign does not flip: the clock direction is the turn direction.
 */
export function getSheetPose(progress) {
  const p = clamp01(progress);
  const eased = smoothstep(p);
  const lift = Math.sin(p * Math.PI);
  return {
    progress: p,
    rotateY: -eased * 180,
    rotateX: lift * 7,
    rotateZ: 0,
    translateZ: lift * 22,
    shadow: lift,
  };
}
