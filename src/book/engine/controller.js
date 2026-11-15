import { FOLD_MS } from './constants.js';

/**
 * Turn decisions, separate from drawing.
 * The album still fills the front and back faces itself, then asks
 * planTurn whether to ignore, reset, jump, or animate.
 */

/**
 * @param {{
 *   busy: boolean,
 *   index: number,
 *   next: number,
 *   pageCount: number,
 *   reducedMotion: boolean,
 *   mode: 'open-book' | 'reel' | 'mobile',
 * }} state
 */
export function planTurn(state) {
  if (state.busy) return { action: 'ignore' };
  if (!Number.isFinite(state.next) || state.next === state.index || state.next < 0 || state.next >= state.pageCount) {
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

/**
 * Lifecycle for a host that can prepare, draw, and commit through hooks.
 * The downloaded album keeps its own index and uses planTurn directly,
 * because that document cannot import this module.
 */
export function createTurnController(hooks) {
  let index = hooks.index || 0;
  let phase = 'idle';
  let progress = 0;
  let direction = 'forward';
  let token = 0;
  let pendingResolve = null;
  let pendingReject = null;

  function getState() {
    return { index, progress, direction, phase };
  }

  function clearPending() {
    pendingResolve = null;
    pendingReject = null;
  }

  function goTo(next) {
    const plan = planTurn({
      busy: phase === 'preparing' || phase === 'turning' || phase === 'settling',
      index,
      next,
      pageCount: hooks.pageCount(),
      reducedMotion: Boolean(hooks.reducedMotion && hooks.reducedMotion()),
      mode: hooks.mode(),
    });
    if (plan.action === 'ignore') return Promise.resolve();
    if (plan.action === 'show') {
      if (hooks.showCurrent) hooks.showCurrent();
      return Promise.resolve();
    }
    direction = plan.direction;
    if (plan.action === 'settle') {
      phase = 'settling';
      index = plan.next;
      progress = 0;
      try {
        hooks.commit(plan.next);
        phase = 'idle';
        return Promise.resolve();
      } catch (error) {
        phase = 'idle';
        return Promise.reject(error);
      }
    }

    phase = 'preparing';
    try {
      hooks.prepare({ index, next: plan.next, direction, mode: plan.mode });
    } catch (error) {
      phase = 'idle';
      return Promise.reject(error);
    }

    phase = 'turning';
    const run = ++token;
    return new Promise((resolve, reject) => {
      pendingResolve = resolve;
      pendingReject = reject;
      hooks.driver.start({
        from: plan.from,
        to: plan.to,
        duration: hooks.duration == null ? FOLD_MS : hooks.duration,
        onUpdate: (value) => {
          if (run !== token) return;
          progress = value;
          if (hooks.onProgress) hooks.onProgress(value, direction, plan.mode);
        },
        onComplete: () => {
          if (run !== token) return;
          phase = 'settling';
          index = plan.next;
          progress = 0;
          const finish = pendingResolve;
          const fail = pendingReject;
          clearPending();
          try {
            hooks.commit(plan.next);
            phase = 'idle';
            if (finish) finish();
          } catch (error) {
            phase = 'idle';
            if (fail) fail(error);
          }
        },
      });
    });
  }

  function cancel() {
    token += 1;
    phase = 'idle';
    progress = 0;
    hooks.driver.cancel();
    if (pendingResolve) {
      const resolve = pendingResolve;
      clearPending();
      resolve();
    }
  }

  return {
    next() {
      const step = hooks.stepForward ? hooks.stepForward(index) : index + 1;
      return goTo(step);
    },
    previous() {
      const step = hooks.stepBack ? hooks.stepBack(index) : index - 1;
      return goTo(step);
    },
    goTo,
    beginDrag() {
      if (phase === 'turning' || phase === 'preparing' || phase === 'settling') return false;
      phase = 'preparing';
      return true;
    },
    updateDrag(value) {
      progress = value;
      phase = 'turning';
    },
    endDrag() {
      phase = 'idle';
      progress = 0;
      return Promise.resolve();
    },
    cancel,
    destroy() {
      cancel();
      hooks.driver.destroy();
    },
    getState,
  };
}
