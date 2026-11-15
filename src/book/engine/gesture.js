import { DRAG_ARM_DEG, DRAG_COMMIT_DEG } from './constants.js';

/**
 * Horizontal drag to a spine angle, in degrees.
 * LTR: dragging toward the left is negative (next page).
 * RTL flips that mapping. A missing width uses the old 320px fallback.
 */
export function pointerAngle(deltaX, width, rtl = false) {
  const w = width > 0 ? width : 320;
  const dx = rtl ? -deltaX : deltaX;
  return Math.max(-180, Math.min(180, (dx / w) * 180));
}

/** Which spread to prepare once the finger has moved past the arm angle. */
export function armDirection(angle) {
  if (angle < -DRAG_ARM_DEG) return 'next';
  if (angle > DRAG_ARM_DEG) return 'prev';
  return '';
}

/**
 * Release decision. A rightward release finishes the previous page only
 * after that side was armed. A leftward release past the commit angle
 * finishes the next page.
 */
export function releaseAction(angle, prepared) {
  if (prepared === 'prev' && angle > DRAG_COMMIT_DEG) return 'back';
  if (angle < -DRAG_COMMIT_DEG) return 'next';
  return 'cancel';
}

/**
 * Progress sample while the finger is down.
 * Going back on the open book peels from a folded sheet (progress near 1)
 * toward flat. Every other drag maps |angle| / 180, and the sign picks
 * which face is considered forward.
 */
export function dragSample(angle, prepared, mode) {
  if (prepared === 'prev' && mode !== 'reel') {
    return { progress: Math.max(0, 1 - angle / 180), forward: true };
  }
  return {
    progress: Math.min(1, Math.abs(angle) / 180),
    forward: angle <= 0,
  };
}
