/** CSS for the legacy unsigned reel pose `{ y, z, x, roll }`. */
export function poseTransform(pose, forward = true) {
  const sign = forward ? -1 : 1;
  return 'rotateY(' + (sign * pose.y) + 'deg) translateZ(' + pose.z + 'px) rotateX(' + (sign * pose.x) + 'deg) rotateZ(' + (sign * pose.roll) + 'deg)';
}

/** CSS for an open-book PagePose. Angle digits match the original sheet string. */
export function sheetCss(pose) {
  return 'rotateX(' + pose.rotateX.toFixed(2) + 'deg) rotateY(' + pose.rotateY.toFixed(2) + 'deg) translateZ(' + pose.translateZ.toFixed(1) + 'px)';
}

/** CSS for a signed reel PagePose. */
export function reelCss(pose) {
  return 'rotateY(' + pose.rotateY + 'deg) translateZ(' + pose.translateZ + 'px) rotateX(' + pose.rotateX + 'deg) rotateZ(' + pose.rotateZ + 'deg)';
}

/**
 * Writes a pose onto an element that looks like the album leaf.
 * The downloaded album cannot import this; it carries the same two CSS builders.
 */
export function applyWebPose(element, pose, mode) {
  element.style.transition = 'none';
  element.style.transform = mode === 'reel' ? reelCss(pose) : sheetCss(pose);
  element.style.setProperty('--shade', pose.shadow.toFixed(3));
}
