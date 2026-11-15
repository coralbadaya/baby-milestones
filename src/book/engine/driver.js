/**
 * Time source only. The caller supplies the clock so this file never
 * touches requestAnimationFrame, React, or the DOM.
 *
 * @param {{ now: () => number, requestFrame: (cb: (time: number) => void) => number, cancelFrame: (id: number) => void }} clock
 */
export function createAnimationDriver(clock) {
  let frameId = 0;
  let generation = 0;

  function cancel() {
    generation += 1;
    if (frameId) {
      clock.cancelFrame(frameId);
      frameId = 0;
    }
  }

  function start(options) {
    cancel();
    const token = generation;
    let finished = false;

    function complete() {
      if (finished || token !== generation) return;
      finished = true;
      frameId = 0;
      options.onComplete();
    }

    const from = options.from;
    const to = options.to;
    const duration = options.duration;
    if (!(duration > 0)) {
      options.onUpdate(to);
      complete();
      return;
    }

    const t0 = clock.now();
    function step(now) {
      if (finished || token !== generation) return;
      const stamp = typeof now === 'number' ? now : clock.now();
      const u = Math.min(1, (stamp - t0) / duration);
      options.onUpdate(from + (to - from) * u);
      if (finished || token !== generation) return;
      if (u < 1) frameId = clock.requestFrame(step);
      else complete();
    }

    frameId = clock.requestFrame(step);
  }

  return {
    start,
    cancel,
    destroy: cancel,
  };
}
