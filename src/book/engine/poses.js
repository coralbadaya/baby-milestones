import { getMobilePose } from './mobileMotion.js';
import { getReelPose } from './reelMotion.js';
import { getSheetPose } from './sheetMotion.js';

/**
 * @param {number} progress
 * @param {{ mode: 'open-book' | 'reel' | 'mobile', direction: 'forward' | 'backward', reducedMotion?: boolean }} config
 */
export function getPose(progress, config) {
  if (config.reducedMotion) {
    return { progress: 0, rotateY: 0, rotateX: 0, rotateZ: 0, translateZ: 0, shadow: 0 };
  }
  if (config.mode === 'reel') return getReelPose(progress, config.direction !== 'backward');
  if (config.mode === 'mobile') return getMobilePose(progress);
  return getSheetPose(progress);
}
