/**
 * QA scenario definitions. Logic scenarios run without DOM.
 * Visual / gesture / race scenarios return instructions for the live stage.
 */
import {
  DRAG_ARM_DEG,
  DRAG_COMMIT_DEG,
  FOLD_MS,
  FOLD_POSES,
  MOBILE_INPUT,
  MOBILE_ROTATE_X,
  MOBILE_ROTATE_Y,
  armDirection,
  createAnimationDriver,
  createTurnController,
  dragSample,
  getMobilePose,
  getReelPose,
  getSheetPose,
  planTurn,
  pointerAngle,
  releaseAction,
  smoothstep,
} from '../../../book/engine/index.js';
import { sheetCss, reelCss } from '../../../book/renderers/web/webTransform.js';
import { composeSpread, previousSpreadIndex, walkSpreads } from '../../../book/pageLayouts.js';
import { foldPlayerScript } from '../../../book/engine/playerScript.js';
import { PROGRESS_SAMPLE_MS } from '../../../data/pageTurnPlaygroundAlbum.js';

function manual(id, name, platform, expected, notes = '') {
  return {
    id,
    name,
    platform,
    kind: 'manual',
    expected,
    notes,
  };
}

function logic(id, name, platform, run) {
  return { id, name, platform, kind: 'logic', run };
}

function stage(id, name, platform, expected, action) {
  return { id, name, platform, kind: 'stage', expected, action };
}

function helloProgress(u) {
  return u < 0.5 ? (u / 0.5) * 0.16 : 0.16 * (1 - (u - 0.5) / 0.5);
}

function manualClock() {
  let time = 0;
  let queued = null;
  let nextId = 1;
  return {
    now: () => time,
    requestFrame(fn) {
      const id = nextId;
      nextId += 1;
      queued = { id, fn };
      return id;
    },
    cancelFrame(id) {
      if (queued?.id === id) queued = null;
    },
    advance(ms) {
      time += ms;
      if (queued) {
        const job = queued;
        queued = null;
        job.fn(time);
      }
    },
    pending: () => Boolean(queued),
  };
}

export function buildScenarioCatalog(pages) {
  const pageCount = pages.length;

  const logicScenarios = [
    logic('sheet-pose-samples', 'Sheet pose at 0/450/950/1450/1900 ms', 'Web', () => {
      const notes = PROGRESS_SAMPLE_MS.map((ms) => {
        const p = ms / FOLD_MS;
        const pose = getSheetPose(p);
        return { ms, progress: p, pose, css: sheetCss(pose) };
      });
      const mid = notes.find((n) => n.ms === 950);
      if (!mid || mid.pose.rotateY !== -90 || mid.pose.translateZ !== 22) {
        return { pass: false, actual: mid, expected: 'rotateY -90, translateZ 22 at 950ms' };
      }
      return { pass: true, actual: notes, expected: 'Keyframes match engine' };
    }),
    logic('reel-keyframes', 'Reel five keyframes and signs', 'Reel', () => {
      const rows = FOLD_POSES.map((stop) => ({
        t: stop.t,
        forward: getReelPose(stop.t, true),
        backward: getReelPose(stop.t, false),
      }));
      const mid = rows.find((r) => r.t === 0.5);
      if (mid.forward.rotateY !== -74 || mid.backward.rotateY !== 74) {
        return { pass: false, actual: mid, expected: '±74° Y at t=0.5' };
      }
      return { pass: true, actual: rows, expected: 'Signed reel poses at each stop' };
    }),
    logic('mobile-stops', 'Mobile interpolation stops', 'Mobile', () => {
      const rows = MOBILE_INPUT.map((t, i) => ({
        t,
        pose: getMobilePose(t),
        y: MOBILE_ROTATE_Y[i],
        x: MOBILE_ROTATE_X[i],
      }));
      const bad = rows.find((r) => r.pose.rotateY !== r.y || r.pose.rotateX !== r.x);
      if (bad) return { pass: false, actual: bad, expected: 'Stops match constants' };
      return { pass: true, actual: rows, expected: 'MOBILE_INPUT poses' };
    }),
    logic('gesture-thresholds', 'Arm 8° and release 50°', 'Web', () => {
      if (armDirection(-DRAG_ARM_DEG - 1) !== 'next') return fail('arm next');
      if (armDirection(DRAG_ARM_DEG + 1) !== 'prev') return fail('arm prev');
      if (releaseAction(-DRAG_COMMIT_DEG - 1, 'next') !== 'next') return fail('release next');
      if (releaseAction(DRAG_COMMIT_DEG + 1, 'prev') !== 'back') return fail('release back');
      if (releaseAction(20, 'prev') !== 'cancel') return fail('release cancel');
      return { pass: true, actual: { DRAG_ARM_DEG, DRAG_COMMIT_DEG }, expected: 'Engine thresholds' };
    }),
    logic('rtl-pointer', 'RTL pointer angle flip', 'Web', () => {
      const ltr = pointerAngle(-100, 200, false);
      const rtl = pointerAngle(-100, 200, true);
      if (ltr !== -90 || rtl !== 90) {
        return { pass: false, actual: { ltr, rtl }, expected: 'LTR -90, RTL +90 for same dx' };
      }
      return { pass: true, actual: { ltr, rtl }, expected: 'RTL negates drag mapping' };
    }),
    logic('plan-boundaries', 'First/last/busy boundaries', 'Web', () => {
      const busy = planTurn({ busy: true, index: 0, next: 1, pageCount, reducedMotion: false, mode: 'open-book' });
      const show = planTurn({ busy: false, index: 0, next: 0, pageCount, reducedMotion: false, mode: 'open-book' });
      const last = planTurn({ busy: false, index: pageCount - 1, next: pageCount, pageCount, reducedMotion: false, mode: 'open-book' });
      if (busy.action !== 'ignore' || show.action !== 'show' || last.action !== 'show') {
        return { pass: false, actual: { busy, show, last }, expected: 'ignore/show/show' };
      }
      return { pass: true, actual: { busy, show, last }, expected: 'Boundary plans' };
    }),
    logic('spread-take-1', 'One-page spread step', 'Web', () => {
      const at = 1;
      const spread = composeSpread(pages, at);
      if (spread.take !== 1) return fail(`take=${spread.take}`);
      const next = at + spread.take;
      return { pass: true, actual: { index: at, next, layout: spread.id }, expected: 'take 1' };
    }),
    logic('spread-take-2', 'Two-page spread step', 'Web', () => {
      const at = 2;
      const spread = composeSpread(pages, at);
      if (spread.take !== 2) return fail(`take=${spread.take}`);
      return { pass: true, actual: { index: at, next: at + 2, layout: spread.id }, expected: 'take 2 facing' };
    }),
    logic('reduced-motion-plan', 'Reduced motion settles', 'Web', () => {
      const plan = planTurn({ busy: false, index: 0, next: 2, pageCount, reducedMotion: true, mode: 'open-book' });
      if (plan.action !== 'settle' || plan.next !== 2) return fail(JSON.stringify(plan));
      return { pass: true, actual: plan, expected: 'settle without animate' };
    }),
    logic('backward-open-progress', 'Open-book backward 1→0', 'Web', () => {
      const plan = planTurn({ busy: false, index: 4, next: 2, pageCount, reducedMotion: false, mode: 'open-book' });
      if (plan.action !== 'animate' || plan.from !== 1 || plan.to !== 0) return fail(JSON.stringify(plan));
      return { pass: true, actual: plan, expected: 'from 1 to 0' };
    }),
    logic('reel-backward-progress', 'Reel backward still 0→1', 'Reel', () => {
      const plan = planTurn({ busy: false, index: 2, next: 1, pageCount, reducedMotion: false, mode: 'reel' });
      if (plan.action !== 'animate' || plan.from !== 0 || plan.to !== 1) return fail(JSON.stringify(plan));
      return { pass: true, actual: plan, expected: 'from 0 to 1, sign on pose' };
    }),
    logic('hello-progress-curve', 'Hello animation peak 0.16', 'Web', () => {
      const peak = helloProgress(0.5);
      if (Math.abs(peak - 0.16) > 0.001) return fail(String(peak));
      const pose = getSheetPose(helloProgress(0.25));
      if (pose.progress > 0.16) return fail('too high early');
      return { pass: true, actual: { peak, sample: pose }, expected: '900ms hello peaks at 0.16 progress' };
    }),
    logic('standalone-parity', 'foldPlayerScript parity markers', 'Standalone', () => {
      const script = foldPlayerScript();
      const required = ['function getSheetPose', 'function planTurn', 'function createAnimationDriver', 'function sheetCss'];
      const missing = required.filter((fn) => !script.includes(fn));
      if (missing.length) return { pass: false, actual: missing, expected: 'Offline script includes engine fns' };
      return { pass: true, actual: { bytes: script.length }, expected: 'Embedded engine present' };
    }),
    logic('drag-sample-prev', 'Backward drag sample progress', 'Web', () => {
      const s = dragSample(90, 'prev', 'open-book');
      if (Math.abs(s.progress - 0.5) > 0.01 || s.forward !== true) return fail(JSON.stringify(s));
      return { pass: true, actual: s, expected: '1 - angle/180 when armed prev' };
    }),
    logic('controller-commit-once', 'Single commit after full turn', 'Web', async () => {
      const clock = manualClock();
      const commits = [];
      const ctrl = createTurnController({
        index: 0,
        pageCount: () => pageCount,
        reducedMotion: () => false,
        mode: () => 'open-book',
        driver: createAnimationDriver(clock),
        stepForward: (i) => i + composeSpread(pages, i).take,
        stepBack: (i) => previousSpreadIndex(pages, i),
        prepare: () => {},
        commit: (n) => commits.push(n),
      });
      const p = ctrl.goTo(1);
      while (clock.pending()) clock.advance(50);
      await p;
      if (commits.length !== 1 || commits[0] !== 1) {
        return { pass: false, actual: commits, expected: 'one commit to index 1' };
      }
      return { pass: true, actual: commits, expected: 'Single commit' };
    }),
    logic('controller-cancel', 'Cancel does not commit', 'Web', async () => {
      const clock = manualClock();
      const commits = [];
      const ctrl = createTurnController({
        index: 0,
        pageCount: () => pageCount,
        reducedMotion: () => false,
        mode: () => 'open-book',
        driver: createAnimationDriver(clock),
        stepForward: (i) => i + 1,
        prepare: () => {},
        commit: (n) => commits.push(n),
      });
      ctrl.goTo(1);
      clock.advance(200);
      ctrl.cancel();
      while (clock.pending()) clock.advance(50);
      if (commits.length !== 0) return { pass: false, actual: commits, expected: 'no commit' };
      return { pass: true, actual: commits, expected: 'Cancelled turn' };
    }),
    logic('rapid-ignore', 'Second turn while busy is ignored', 'Web', () => {
      const plan1 = planTurn({ busy: false, index: 0, next: 1, pageCount, reducedMotion: false, mode: 'open-book' });
      const plan2 = planTurn({ busy: true, index: 0, next: 2, pageCount, reducedMotion: false, mode: 'open-book' });
      if (plan1.action !== 'animate' || plan2.action !== 'ignore') return fail(JSON.stringify({ plan1, plan2 }));
      return { pass: true, actual: { plan1, plan2 }, expected: 'busy → ignore' };
    }),
    logic('walk-spreads', 'Spread walk covers all pages', 'Web', () => {
      const starts = walkSpreads(pages);
      if (starts.length < 4) return fail(String(starts.length));
      return { pass: true, actual: starts, expected: 'Multiple spread starts' };
    }),
    logic('reel-css-mid', 'Reel CSS at t=0.5 forward', 'Reel', () => {
      const css = reelCss(getReelPose(0.5, true));
      if (!css.includes('rotateY(-74deg)')) return fail(css);
      return { pass: true, actual: css, expected: 'Mid reel css' };
    }),
    logic('smoothstep-mid', 'Smoothstep 0.5 → 0.5', 'Web', () => {
      const v = smoothstep(0.5);
      if (v !== 0.5) return fail(String(v));
      return { pass: true, actual: v, expected: '0.5' };
    }),
  ].filter(Boolean);

  const stageScenarios = [
    stage('sheet-forward', 'Forward sheet turn', 'Web', 'Index advances, leaf rests flat', { type: 'turn-next' }),
    stage('sheet-back', 'Backward sheet turn', 'Web', 'Index retreats, unfold 1→0', { type: 'turn-prev' }),
    stage('sheet-round-trip', 'Forward then backward', 'Web', 'Returns to start index', { type: 'round-trip' }),
    stage('multi-forward', 'Three forward turns', 'Web', 'Index moves by spread.take each time', { type: 'multi-forward', count: 3 }),
    stage('multi-back', 'Three backward turns', 'Web', 'Index walks spread starts', { type: 'multi-back', count: 3 }),
    stage('boundary-first', 'Previous at index 0', 'Web', 'Stays at 0, plan show', { type: 'turn-prev' }),
    stage('boundary-last', 'Next at last spread', 'Web', 'Stays on ending', { type: 'turn-last' }),
    stage('progress-scrub', 'Scrub to sample ms', 'Web', 'Pose matches engine at ms', { type: 'scrub' }),
    stage('continuous-play', 'Continuous 0→1 playback', 'Web', 'Runs full FOLD_MS once', { type: 'play-once' }),
    stage('gesture-drag', 'Interactive drag', 'Web', 'Arm/release uses engine', { type: 'gesture' }),
    stage('race-reverse', 'Forward then immediate backward request', 'Web', 'Second request ignored while busy', { type: 'race-reverse' }),
    stage('race-spam-next', 'Spam next during turn', 'Web', 'Only one commit', { type: 'race-spam-next' }),
    stage('reel-forward', 'Reel forward turn', 'Reel', 'Signed forward pose path', { type: 'reel-turn', forward: true }),
    stage('reel-back', 'Reel backward turn', 'Reel', 'Signed backward pose path', { type: 'reel-turn', forward: false }),
    stage('hello-play', 'Hello animation sample', 'Web', 'Peak progress 0.16', { type: 'hello' }),
    stage('keyboard-right', 'Arrow right', 'Web', 'Same as next', { type: 'key', key: 'ArrowRight' }),
    stage('keyboard-left', 'Arrow left', 'Web', 'Same as prev', { type: 'key', key: 'ArrowLeft' }),
    stage('autoplay-cycle', 'Autoplay two steps', 'Web', 'Timer fires turnTo', { type: 'autoplay', steps: 2 }),
    manual('visual-faces', 'Front/back face preparation', 'Web', 'Destination left on back before forward turn', 'Compare FRONT/BACK labels during drag'),
    manual('visual-orientation', 'Edge-on orientation', 'Web', 'No mirrored text; back upright at 950ms', 'Screenshot at 950ms'),
    manual('gesture-outside', 'Drag outside book', 'Web', 'No crash; pointer capture rules', 'Drag from control panel'),
    manual('mobile-openbook', 'Native OpenBook turn', 'Mobile', 'Animated native driver, 1900ms', 'Run mobile/app/dev/page-turn-playground'),
    manual('standalone-offline', 'Downloaded HTML offline', 'Standalone', 'Opens without network', 'Download sample, disable network, reload'),
    manual('audio-rustle', 'Rustle on turn', 'Standalone', 'Sound when enabled', 'Only in downloaded album iframe'),
    manual('haptics', 'Vibration patterns', 'Standalone', 'navigator.vibrate when supported', 'Not auto-fired in playground'),
    manual('screenshot-grid', 'Visual regression grid', 'Web', 'Same viewport at 5 ms samples', 'See docs/page-turn-qa.md'),
    manual('perf-device', 'iOS/Android FPS', 'Mobile', 'Smooth 60 FPS', 'Physical device not automated here'),
  ];

  return [...logicScenarios, ...stageScenarios];
}

function fail(actual) {
  return { pass: false, actual, expected: 'see scenario' };
}

export async function runLogicScenario(scenario) {
  if (scenario.kind !== 'logic' || !scenario.run) {
    return {
      scenario: scenario.id,
      platform: scenario.platform,
      status: 'not_supported',
      expected: scenario.expected,
      actual: null,
      durationMs: 0,
      notes: 'Not a logic scenario',
    };
  }
  const start = performance.now();
  try {
    const result = await scenario.run();
    const durationMs = Math.round(performance.now() - start);
    return {
      scenario: scenario.id,
      name: scenario.name,
      platform: scenario.platform,
      status: result.pass ? 'pass' : 'fail',
      expected: scenario.expected || result.expected,
      actual: result.actual,
      durationMs,
      notes: result.pass ? '' : 'Assertion failed',
    };
  } catch (error) {
    return {
      scenario: scenario.id,
      name: scenario.name,
      platform: scenario.platform,
      status: 'fail',
      expected: scenario.expected,
      actual: String(error),
      durationMs: Math.round(performance.now() - start),
      notes: error.stack || '',
    };
  }
}

export function reportToJson(rows) {
  return JSON.stringify(
    {
      generatedAt: new Date().toISOString(),
      summary: {
        pass: rows.filter((r) => r.status === 'pass').length,
        fail: rows.filter((r) => r.status === 'fail').length,
        manual: rows.filter((r) => r.status === 'manual' || r.status === 'not_supported').length,
      },
      results: rows,
    },
    null,
    2,
  );
}

export function reportToCsv(rows) {
  const header = 'scenario,platform,status,expected,durationMs,notes';
  const lines = rows.map((r) => [
    r.scenario,
    r.platform,
    r.status,
    JSON.stringify(r.expected || '').replaceAll('"', '""'),
    r.durationMs ?? '',
    JSON.stringify(r.notes || '').replaceAll('"', '""'),
  ].map((c) => `"${c}"`).join(','));
  return [header, ...lines].join('\n');
}