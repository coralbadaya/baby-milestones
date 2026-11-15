import { describe, expect, it } from 'vitest';
import { foldPlayerScript } from './playerScript';
import {
  CURL_STRIPS,
  FOLD_MS,
  FOLD_POSES,
  MOBILE_INPUT,
  MOBILE_ROTATE_X,
  MOBILE_ROTATE_Y,
  armDirection,
  clamp,
  createAnimationDriver,
  cubicInOut,
  curlAngles,
  curlLift,
  curlPose,
  dragSample,
  getMobilePose,
  getPose,
  getReelPose,
  getSheetPose,
  interpolate,
  interpolatePose,
  planTurn,
  pointerAngle,
  poseAt,
  releaseAction,
  smoothstep,
} from './index';
import { mobileTransform } from '../renderers/mobile/mobileTransform';
import { applyWebPose, poseTransform, reelCss, sheetCss } from '../renderers/web/webTransform';

function albumApi() {
  const script = foldPlayerScript();
  return new Function(
    script + '\nreturn { getSheetPose, getReelPose, poseAt, poseTransform, sheetCss, reelCss, curlAngles, curlPose, curlLift, planTurn, pointerAngle, releaseAction, dragSample, armDirection, smoothstep, createAnimationDriver };',
  )();
}

function manualClock() {
  let time = 0;
  let queued = null;
  let nextId = 1;
  return {
    now() {
      return time;
    },
    requestFrame(fn) {
      const id = nextId;
      nextId += 1;
      queued = { id, fn };
      return id;
    },
    cancelFrame(id) {
      if (queued && queued.id === id) queued = null;
    },
    get queued() {
      return queued;
    },
    fire() {
      const job = queued;
      queued = null;
      if (job) job.fn(time);
    },
    advance(ms) {
      time += ms;
      this.fire();
    },
  };
}

function legacySheet(progress) {
  const p = Math.min(1, Math.max(0, progress));
  const eased = p * p * (3 - 2 * p);
  const lift = Math.sin(p * Math.PI);
  return 'rotateX(' + (lift * 7).toFixed(2) + 'deg) rotateY(' + (-eased * 180).toFixed(2) + 'deg) translateZ(' + (lift * 22).toFixed(1) + 'px)';
}

describe('sheet pose', () => {
  it('rests flat, stands edge-on at the middle, and finishes turned over', () => {
    const start = getSheetPose(0);
    expect(start.rotateY).toBeCloseTo(0, 10);
    expect(start.rotateX).toBeCloseTo(0, 10);
    expect(start.translateZ).toBeCloseTo(0, 10);
    expect(start.shadow).toBeCloseTo(0, 10);
    expect(getSheetPose(0.5)).toMatchObject({ rotateY: -90, rotateX: 7, translateZ: 22, shadow: 1 });
    const end = getSheetPose(1);
    expect(end.rotateY).toBe(-180);
    expect(end.rotateX).toBeCloseTo(0, 10);
    expect(end.translateZ).toBeCloseTo(0, 10);
    expect(end.shadow).toBeCloseTo(0, 10);
  });

  it('keeps the original CSS string at the sampled times', () => {
    [0, 450, 950, 1450, 1900].forEach((ms) => {
      const progress = ms / FOLD_MS;
      expect(sheetCss(getSheetPose(progress))).toBe(legacySheet(progress));
    });
    expect(sheetCss(getSheetPose(950 / FOLD_MS))).toContain('rotateY(-90.00deg)');
  });

  it('clamps progress outside 0 to 1', () => {
    expect(getSheetPose(-2).rotateY).toBeCloseTo(0, 10);
    expect(getSheetPose(4).rotateY).toBe(-180);
  });
});

describe('reel pose', () => {
  it('hits every keyframe and the forward and backward signs', () => {
    FOLD_POSES.forEach((stop) => {
      const raw = poseAt(stop.t);
      expect(raw.y).toBe(stop.y);
      expect(raw.z).toBe(stop.z);
      expect(raw.x).toBe(stop.x);
      expect(raw.roll).toBe(stop.roll);
      const forward = getReelPose(stop.t, true);
      const backward = getReelPose(stop.t, false);
      expect(forward.rotateY).toBe(-stop.y);
      expect(forward.rotateX).toBe(-stop.x);
      expect(forward.rotateZ).toBe(-stop.roll);
      expect(forward.translateZ).toBe(stop.z);
      expect(backward.rotateY).toBe(stop.y);
      expect(backward.rotateX).toBe(stop.x);
      expect(backward.rotateZ).toBe(stop.roll);
      expect(reelCss(forward)).toBe(poseTransform(raw, true));
      expect(reelCss(backward)).toBe(poseTransform(raw, false));
    });
  });

  it('lerps halfway between the first two stops', () => {
    expect(poseAt(0.12).y).toBe(8);
    expect(getReelPose(0.12, true).rotateY).toBe(-8);
  });
});

describe('mobile pose', () => {
  it('keeps the phone X and Y stops and leaves lift and roll at zero', () => {
    expect(FOLD_MS).toBe(1900);
    MOBILE_INPUT.forEach((stop, index) => {
      const pose = getMobilePose(stop);
      expect(pose.rotateY).toBe(MOBILE_ROTATE_Y[index]);
      expect(pose.rotateX).toBe(MOBILE_ROTATE_X[index]);
      expect(pose.translateZ).toBe(0);
      expect(pose.rotateZ).toBe(0);
      expect(pose.shadow).toBe(0);
    });
    expect(getMobilePose(0.12)).toMatchObject({ rotateY: -8, rotateX: -7 });
    expect(mobileTransform(getMobilePose(0.5))).toEqual([
      { perspective: 1200 },
      { rotateY: '-74deg' },
      { rotateX: '-8deg' },
    ]);
  });

  it('matches React Native cubic in-out', () => {
    expect(cubicInOut(0)).toBe(0);
    expect(cubicInOut(1)).toBe(1);
    expect(cubicInOut(0.5)).toBe(0.5);
    expect(cubicInOut(0.25)).toBeCloseTo(0.0625, 10);
    const eased = cubicInOut(0.25);
    expect(getMobilePose(eased).rotateY).toBeCloseTo(interpolate(eased, MOBILE_INPUT, MOBILE_ROTATE_Y), 10);
  });
});

describe('pose dispatch', () => {
  it('selects the sheet, the reel, the phone, and a flat reduced-motion pose', () => {
    expect(getPose(0.5, { mode: 'open-book', direction: 'forward' }).rotateY).toBe(-90);
    expect(getPose(0.5, { mode: 'reel', direction: 'forward' }).rotateY).toBe(-74);
    expect(getPose(0.5, { mode: 'reel', direction: 'backward' }).rotateY).toBe(74);
    expect(getPose(0.5, { mode: 'mobile', direction: 'forward' }).rotateX).toBe(-8);
    expect(getPose(0.5, { mode: 'open-book', direction: 'forward', reducedMotion: true })).toMatchObject({
      rotateY: 0,
      shadow: 0,
    });
  });

  it('lerps two poses', () => {
    const mid = interpolatePose(getSheetPose(0), getSheetPose(1), 0.5);
    expect(mid.rotateY).toBe(-90);
    expect(smoothstep(0.5)).toBe(0.5);
    expect(clamp(2, 0, 1)).toBe(1);
  });
});

describe('driver', () => {
  it('runs a 1900ms turn once and clamps a zero-length turn to the end', () => {
    const clock = manualClock();
    const driver = createAnimationDriver(clock);
    const seen = [];
    let done = 0;
    driver.start({
      from: 0,
      to: 1,
      duration: FOLD_MS,
      onUpdate: (value) => seen.push(value),
      onComplete: () => {
        done += 1;
      },
    });
    clock.fire();
    expect(seen[0]).toBe(0);
    while (done === 0) clock.advance(50);
    expect(done).toBe(1);
    expect(seen[seen.length - 1]).toBe(1);
    clock.advance(500);
    expect(done).toBe(1);

    const jumped = [];
    let jumps = 0;
    driver.start({
      from: 0,
      to: 1,
      duration: 0,
      onUpdate: (value) => jumped.push(value),
      onComplete: () => {
        jumps += 1;
      },
    });
    expect(jumped).toEqual([1]);
    expect(jumps).toBe(1);
    expect(clock.queued).toBeNull();
  });

  it('cancels an in-flight turn and does not finish it', () => {
    const clock = manualClock();
    const driver = createAnimationDriver(clock);
    let done = 0;
    driver.start({
      from: 0,
      to: 1,
      duration: FOLD_MS,
      onUpdate: () => {},
      onComplete: () => {
        done += 1;
      },
    });
    clock.advance(450);
    driver.cancel();
    clock.advance(FOLD_MS);
    expect(done).toBe(0);
  });
});

describe('gestures and plans', () => {
  it('keeps the drag thresholds and the rtl flip', () => {
    expect(pointerAngle(-100, 200)).toBe(-90);
    expect(pointerAngle(-100, 200, true)).toBe(90);
    expect(pointerAngle(-400, 0)).toBe(-180);
    expect(armDirection(-9)).toBe('next');
    expect(armDirection(9)).toBe('prev');
    expect(armDirection(3)).toBe('');
    expect(releaseAction(-51, 'next')).toBe('next');
    expect(releaseAction(51, 'prev')).toBe('back');
    expect(releaseAction(20, 'prev')).toBe('cancel');
    expect(dragSample(90, 'prev', 'open-book').progress).toBe(0.5);
    expect(dragSample(-90, 'next', 'open-book')).toMatchObject({ progress: 0.5, forward: true });
    expect(dragSample(90, 'prev', 'reel').forward).toBe(false);
  });

  it('plans forward, backward, boundaries, and reduced motion', () => {
    expect(planTurn({ busy: true, index: 0, next: 1, pageCount: 3, reducedMotion: false, mode: 'open-book' }).action).toBe('ignore');
    expect(planTurn({ busy: false, index: 0, next: 0, pageCount: 3, reducedMotion: false, mode: 'open-book' }).action).toBe('show');
    expect(planTurn({ busy: false, index: 0, next: -1, pageCount: 3, reducedMotion: false, mode: 'open-book' }).action).toBe('show');
    expect(planTurn({ busy: false, index: 2, next: 3, pageCount: 3, reducedMotion: false, mode: 'open-book' }).action).toBe('show');
    expect(planTurn({ busy: false, index: 0, next: Number.NaN, pageCount: 3, reducedMotion: false, mode: 'open-book' }).action).toBe('show');
    expect(planTurn({ busy: false, index: 0, next: 1, pageCount: 4, reducedMotion: false, mode: 'open-book' })).toMatchObject({
      action: 'animate',
      from: 0,
      to: 1,
      direction: 'forward',
    });
    expect(planTurn({ busy: false, index: 2, next: 0, pageCount: 4, reducedMotion: false, mode: 'open-book' })).toMatchObject({
      action: 'animate',
      from: 1,
      to: 0,
      direction: 'backward',
    });
    expect(planTurn({ busy: false, index: 2, next: 0, pageCount: 4, reducedMotion: false, mode: 'reel' })).toMatchObject({
      from: 0,
      to: 1,
    });
    expect(planTurn({ busy: false, index: 2, next: 0, pageCount: 4, reducedMotion: false, mode: 'mobile' })).toMatchObject({
      from: 0,
      to: 1,
    });
    expect(planTurn({ busy: false, index: 0, next: 2, pageCount: 4, reducedMotion: true, mode: 'open-book' })).toMatchObject({
      action: 'settle',
      next: 2,
    });
  });
});

describe('offline album script', () => {
  it('matches the module on the sheet, the reel, and the unused curl', () => {
    const script = foldPlayerScript();
    expect(script).toContain('const FOLD_MS = 1900');
    expect(script).toContain('function curlPose');
    expect(script).toContain('function sheetCss');
    expect(script).not.toContain('`');
    const api = albumApi();
    for (let step = 0; step <= 20; step += 1) {
      const progress = step / 20;
      expect(api.getSheetPose(progress)).toEqual(getSheetPose(progress));
      expect(api.sheetCss(api.getSheetPose(progress))).toBe(sheetCss(getSheetPose(progress)));
      expect(api.getReelPose(progress, true)).toEqual(getReelPose(progress, true));
      expect(api.getReelPose(progress, false)).toEqual(getReelPose(progress, false));
      expect(api.reelCss(api.getReelPose(progress, true))).toBe(reelCss(getReelPose(progress, true)));
      expect(api.poseTransform(api.poseAt(progress), true)).toBe(poseTransform(poseAt(progress), true));
      expect(api.curlAngles(progress)).toEqual(curlAngles(progress));
      expect(api.curlLift(progress)).toBe(curlLift(progress));
    }
    expect(api.curlPose(0.5, 400)).toEqual(curlPose(0.5, 400));
    expect(api.curlAngles(0)).toHaveLength(CURL_STRIPS);
    const state = { busy: false, index: 1, next: 0, pageCount: 4, reducedMotion: false, mode: 'open-book' };
    expect(api.planTurn(state)).toEqual(planTurn(state));
    expect(api.pointerAngle(-80, 160, true)).toBe(pointerAngle(-80, 160, true));
    expect(api.releaseAction(60, 'prev')).toBe(releaseAction(60, 'prev'));
    expect(api.dragSample(40, 'prev', 'open-book')).toEqual(dragSample(40, 'prev', 'open-book'));
    expect(api.armDirection(-3)).toBe(armDirection(-3));
    expect(api.smoothstep(0.25)).toBe(smoothstep(0.25));
  });
});

describe('web leaf writer', () => {
  it('writes the sheet transform and the shade variable', () => {
    const style = { transition: '', transform: '', setProperty: (name, value) => { style[name] = value; } };
    applyWebPose({ style }, getSheetPose(0.5), 'open-book');
    expect(style.transform).toContain('rotateY(-90.00deg)');
    expect(style['--shade']).toBe('1.000');
    applyWebPose({ style }, getReelPose(0.5, true), 'reel');
    expect(style.transform).toContain('rotateY(-74deg)');
  });
});
