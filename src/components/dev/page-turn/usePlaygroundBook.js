import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  FOLD_MS,
  createAnimationDriver,
  createTurnController,
  getReelPose,
  getSheetPose,
  planTurn,
} from '../../../book/engine/index.js';
import { applyWebPose } from '../../../book/renderers/web/webTransform.js';
import { composeSpread, previousSpreadIndex } from '../../../book/pageLayouts.js';

function stepForward(pages, index, reel) {
  if (reel) return index + 1;
  return index + composeSpread(pages, index).take;
}

function stepBack(pages, index, reel) {
  if (reel) return index - 1;
  return previousSpreadIndex(pages, index);
}

export function usePlaygroundBook(pages, options) {
  const {
    mode = 'open-book',
    reducedMotion = false,
    rtl = false,
    onMetrics,
  } = options;

  const [index, setIndex] = useState(0);
  const [landing, setLanding] = useState(null);
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState('idle');
  const [gesture, setGesture] = useState(null);
  const [perf, setPerf] = useState({ frames: 0, completed: 0, cancelled: 0, longGaps: 0 });

  const flapRef = useRef(null);
  const indexRef = useRef(0);
  const modeRef = useRef(mode);
  const reducedRef = useRef(reduced);
  const ctrlRef = useRef(null);
  const frameTimesRef = useRef([]);
  const lastFrameRef = useRef(0);
  const commitCountRef = useRef(0);

  indexRef.current = index;
  modeRef.current = options.mode ?? 'open-book';
  reducedRef.current = reducedMotion;

  const spread = useMemo(() => composeSpread(pages, index), [pages, index]);
  const destSpread = useMemo(
    () => composeSpread(pages, landing ?? index),
    [pages, landing, index],
  );

  const applyProgress = useCallback((p, forward) => {
    const el = flapRef.current;
    if (!el) return;
    const pose = modeRef.current === 'reel' ? getReelPose(p, forward) : getSheetPose(p);
    applyWebPose(el, pose, modeRef.current === 'reel' ? 'reel' : 'open-book');
    setProgress(p);
    if (onMetrics) onMetrics({ progress: p, pose });
  }, [onMetrics]);

  const flatten = useCallback(() => {
    const el = flapRef.current;
    if (!el) return;
    el.style.transform = 'none';
    el.style.setProperty('--shade', '0');
    setProgress(0);
  }, []);

  useEffect(() => {
    const driver = createAnimationDriver({
      now: () => performance.now(),
      requestFrame: (fn) => requestAnimationFrame(fn),
      cancelFrame: (id) => cancelAnimationFrame(id),
    });
    const ctrl = createTurnController({
      index: 0,
      pageCount: () => pages.length,
      reducedMotion: () => reducedRef.current,
      mode: () => (modeRef.current === 'reel' ? 'reel' : 'open-book'),
      driver,
      stepForward: (i) => stepForward(pages, i, modeRef.current === 'reel'),
      stepBack: (i) => stepBack(pages, i, modeRef.current === 'reel'),
      prepare: ({ next, direction }) => {
        setLanding(next);
        setPhase('preparing');
        if (direction === 'backward' && modeRef.current !== 'reel') {
          applyProgress(1, true);
        }
      },
      onProgress: (p, direction) => {
        const now = performance.now();
        if (lastFrameRef.current) {
          const gap = now - lastFrameRef.current;
          if (gap > 24) {
            setPerf((prev) => ({ ...prev, longGaps: prev.longGaps + 1 }));
          }
        }
        lastFrameRef.current = now;
        frameTimesRef.current.push(now);
        setPerf((prev) => ({ ...prev, frames: prev.frames + 1 }));
        setPhase('turning');
        applyProgress(p, direction !== 'backward');
      },
      commit: (next) => {
        commitCountRef.current += 1;
        indexRef.current = next;
        setIndex(next);
        setLanding(null);
        flatten();
        setPhase('idle');
        setPerf((prev) => ({ ...prev, completed: prev.completed + 1 }));
      },
      showCurrent: () => {
        flatten();
        setLanding(null);
        setPhase('idle');
      },
    });
    ctrlRef.current = ctrl;
    return () => {
      ctrl.destroy();
      ctrlRef.current = null;
    };
  }, [pages, applyProgress, flatten]);

  const plan = useCallback((next) => planTurn({
    busy: phase === 'preparing' || phase === 'turning',
    index: indexRef.current,
    next,
    pageCount: pages.length,
    reducedMotion,
    mode: mode === 'reel' ? 'reel' : 'open-book',
  }), [pages.length, phase, reducedMotion, mode]);

  const turnTo = useCallback(async (next) => {
    const p = plan(next);
    if (p.action === 'show') {
      flatten();
      setLanding(null);
      return { plan: p, committed: false };
    }
    if (p.action === 'ignore') return { plan: p, committed: false };
    await ctrlRef.current?.goTo(next);
    return { plan: p, committed: p.action === 'settle' || p.action === 'animate' };
  }, [plan, flatten]);

  const turnNext = useCallback(() => turnTo(stepForward(pages, indexRef.current, mode === 'reel')), [pages, mode, turnTo]);
  const turnPrev = useCallback(() => turnTo(stepBack(pages, indexRef.current, mode === 'reel')), [pages, mode, turnTo]);

  const scrubMs = useCallback((ms) => {
    const p = Math.max(0, Math.min(1, ms / FOLD_MS));
    applyProgress(p, true);
    setPhase('turning');
  }, [applyProgress]);

  const playOnce = useCallback(() => {
    const driver = createAnimationDriver({
      now: () => performance.now(),
      requestFrame: (fn) => requestAnimationFrame(fn),
      cancelFrame: (id) => cancelAnimationFrame(id),
    });
    setPhase('turning');
 	return new Promise((resolve) => {
      driver.start({
        from: progress,
        to: 1,
        duration: FOLD_MS * (1 - progress),
        onUpdate: (p) => applyProgress(p, true),
        onComplete: () => {
          setPhase('idle');
          resolve();
        },
      });
    });
  }, [applyProgress, progress]);

  const playHello = useCallback(() => {
    const t0 = performance.now();
    let frame = 0;
    setPhase('turning');
    function step(now) {
      const u = Math.min(1, (now - t0) / 900);
      const p = u < 0.5 ? (u / 0.5) * 0.16 : 0.16 * (1 - (u - 0.5) / 0.5);
      if (u >= 1) {
        cancelAnimationFrame(frame);
        flatten();
        setPhase('idle');
        return;
      }
      applyProgress(p, true);
      frame = requestAnimationFrame(step);
    }
    frame = requestAnimationFrame(step);
  }, [applyProgress, flatten]);

  const cancel = useCallback(() => {
    ctrlRef.current?.cancel();
    flatten();
    setLanding(null);
    setPhase('idle');
    setPerf((prev) => ({ ...prev, cancelled: prev.cancelled + 1 }));
  }, [flatten]);

  const reset = useCallback(() => {
    cancel();
    indexRef.current = 0;
    setIndex(0);
    commitCountRef.current = 0;
    frameTimesRef.current = [];
    lastFrameRef.current = 0;
    setPerf({ frames: 0, completed: 0, cancelled: 0, longGaps: 0 });
    flatten();
  }, [cancel, flatten]);

  const fpsEstimate = useMemo(() => {
    const frames = frameTimesRef.current;
    if (frames.length < 2) return null;
    const start = frames[0];
    const end = frames[frames.length - 1];
    const sec = (end - start) / 1000;
    if (sec <= 0) return null;
    return Math.round((frames.length - 1) / sec);
  }, [perf.frames, phase]);

  const setLandingIndex = useCallback((next) => {
    setLanding(typeof next === 'number' ? next : null);
  }, []);

  return {
    index,
    spread,
    destSpread,
    landing,
    setLanding: setLandingIndex,
    progress,
    phase,
    gesture,
    setGesture,
    flapRef,
    turnNext,
    turnPrev,
    turnTo,
    scrubMs,
    playOnce,
    playHello,
    cancel,
    reset,
    plan,
    perf: { ...perf, fpsEstimate, commitCount: commitCountRef.current },
    flatten,
    applyProgress,
  };
}