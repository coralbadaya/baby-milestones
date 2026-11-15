/**
 * Page-turn timing and decisions. Keep in step with:
 * - src/book/engine/constants.js
 * - src/book/engine/controller.js (planTurn)
 * The phone app does not import the website bundle; Metro cannot resolve ../../src.
 */

export const FOLD_MS = 1900;

export const MOBILE_INPUT = Object.freeze([0, 0.24, 0.5, 0.76, 1] as const);
export const MOBILE_ROTATE_Y = Object.freeze([0, -16, -74, -146, -180] as const);
export const MOBILE_ROTATE_X = Object.freeze([0, -14, -8, 6, 0] as const);

export type PlanTurnState = {
  busy: boolean;
  index: number;
  next: number;
  pageCount: number;
  reducedMotion: boolean;
  mode: 'open-book' | 'reel' | 'mobile';
};

export type PlanTurnResult =
  | { action: 'ignore' }
  | { action: 'show' }
  | { action: 'settle'; next: number; direction: 'forward' | 'backward' }
  | {
      action: 'animate';
      next: number;
      direction: 'forward' | 'backward';
      from: number;
      to: number;
      mode: 'open-book' | 'reel' | 'mobile';
    };

export function planTurn(state: PlanTurnState): PlanTurnResult {
  if (state.busy) return { action: 'ignore' };
  if (
    !Number.isFinite(state.next)
    || state.next === state.index
    || state.next < 0
    || state.next >= state.pageCount
  ) {
    return { action: 'show' };
  }
  const direction = state.next > state.index ? 'forward' : 'backward';
  if (state.reducedMotion) {
    return { action: 'settle', next: state.next, direction };
  }
  let from = 0;
  let to = 1;
  if (state.mode === 'open-book' && direction === 'backward') {
    from = 1;
    to = 0;
  }
  return {
    action: 'animate',
    next: state.next,
    direction,
    from,
    to,
    mode: state.mode,
  };
}