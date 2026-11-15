export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function clamp01(value) {
  return clamp(value, 0, 1);
}

export function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

/** Smoothstep used by the open-book sheet. Clamps first. */
export function smoothstep(progress) {
  const p = clamp01(progress);
  return p * p * (3 - 2 * p);
}

/**
 * Matches React Native Easing.inOut(Easing.cubic):
 * t < 0.5 ? cubic(t * 2) / 2 : 1 - cubic((1 - t) * 2) / 2
 */
export function cubicInOut(progress) {
  const p = clamp01(progress);
  if (p < 0.5) return 4 * p * p * p;
  const u = (1 - p) * 2;
  return 1 - (u * u * u) / 2;
}
