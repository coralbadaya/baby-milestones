import {
  BOOK_MODES,
  CURL_STRIPS,
  DRAG_ARM_DEG,
  DRAG_COMMIT_DEG,
  FOLD_MS,
  FOLD_POSES,
} from './constants.js';

/**
 * Offline copy of the engine for the downloaded album.
 * That file opens with no imports. Node 20 cannot load TypeScript, and a
 * production bundle would rename function bodies, so this text is the
 * projection. engine.test.js checks it against the modules above.
 * The curl helpers stay here and stay unused by the turn.
 */
const BODY = `
function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}
function clamp01(value) {
  return clamp(value, 0, 1);
}
function lerp(start, end, amount) {
  return start + (end - start) * amount;
}
function smoothstep(progress) {
  var p = clamp01(progress);
  return p * p * (3 - 2 * p);
}
function poseAt(progress) {
  var p = clamp01(progress);
  var index = 0;
  while (index < FOLD_POSES.length - 2 && FOLD_POSES[index + 1].t < p) index += 1;
  var from = FOLD_POSES[index];
  var to = FOLD_POSES[index + 1];
  var amount = (p - from.t) / ((to.t - from.t) || 1);
  return {
    y: lerp(from.y, to.y, amount),
    z: lerp(from.z, to.z, amount),
    x: lerp(from.x, to.x, amount),
    roll: lerp(from.roll, to.roll, amount)
  };
}
function poseTransform(pose, forward) {
  var sign = forward === false ? 1 : -1;
  return 'rotateY(' + (sign * pose.y) + 'deg) translateZ(' + pose.z + 'px) rotateX(' + (sign * pose.x) + 'deg) rotateZ(' + (sign * pose.roll) + 'deg)';
}
function curlAngles(progress) {
  var p = Math.min(1, Math.max(0, progress));
  var angles = [];
  var flat = p >= 1 ? 180 : 0;
  if (p <= 0 || p >= 1) {
    for (var i = 0; i < CURL_STRIPS; i += 1) angles.push(flat);
    return angles;
  }
  var eased = p * p * (3 - 2 * p);
  var bow = Math.sin(eased * Math.PI);
  for (var n = 0; n < CURL_STRIPS; n += 1) {
    var across = n / (CURL_STRIPS - 1);
    angles.push(eased * 180 + bow * 58 * across * across);
  }
  return angles;
}
function curlLift(progress) {
  var p = Math.min(1, Math.max(0, progress));
  return Math.sin(p * Math.PI) * 42;
}
function curlPose(progress, pageWidth) {
  var angles = curlAngles(progress);
  var width = pageWidth > 0 ? pageWidth : 1;
  var seg = 100 / angles.length;
  var segPx = width / angles.length;
  var x = 0;
  var z = 0;
  var poses = [];
  for (var i = 0; i < angles.length; i += 1) {
    var angle = angles[i];
    var rad = (angle * Math.PI) / 180;
    poses.push({ angle: angle, x: x, z: z });
    x += Math.cos(rad) * seg;
    z += Math.sin(rad) * segPx;
  }
  return poses;
}
function getSheetPose(progress) {
  var p = clamp01(progress);
  var eased = smoothstep(p);
  var lift = Math.sin(p * Math.PI);
  return {
    progress: p,
    rotateY: -eased * 180,
    rotateX: lift * 7,
    rotateZ: 0,
    translateZ: lift * 22,
    shadow: lift
  };
}
function getReelPose(progress, forward) {
  var raw = poseAt(progress);
  var sign = forward === false ? 1 : -1;
  return {
    progress: clamp01(progress),
    rotateY: sign * raw.y,
    rotateX: sign * raw.x,
    rotateZ: sign * raw.roll,
    translateZ: raw.z,
    shadow: Math.sin((raw.y * Math.PI) / 180)
  };
}
function sheetCss(pose) {
  return 'rotateX(' + pose.rotateX.toFixed(2) + 'deg) rotateY(' + pose.rotateY.toFixed(2) + 'deg) translateZ(' + pose.translateZ.toFixed(1) + 'px)';
}
function reelCss(pose) {
  return 'rotateY(' + pose.rotateY + 'deg) translateZ(' + pose.translateZ + 'px) rotateX(' + pose.rotateX + 'deg) rotateZ(' + pose.rotateZ + 'deg)';
}
function planTurn(state) {
  if (state.busy) return { action: 'ignore' };
  if (!Number.isFinite(state.next) || state.next === state.index || state.next < 0 || state.next >= state.pageCount) {
    return { action: 'show' };
  }
  var direction = state.next > state.index ? 'forward' : 'backward';
  if (state.reducedMotion) return { action: 'settle', next: state.next, direction: direction };
  var from = 0;
  var to = 1;
  if (state.mode === 'open-book' && direction === 'backward') {
    from = 1;
    to = 0;
  }
  return { action: 'animate', next: state.next, direction: direction, from: from, to: to, mode: state.mode };
}
function pointerAngle(deltaX, width, rtl) {
  var w = width > 0 ? width : 320;
  var dx = rtl ? -deltaX : deltaX;
  return Math.max(-180, Math.min(180, (dx / w) * 180));
}
function armDirection(angle) {
  if (angle < -DRAG_ARM_DEG) return 'next';
  if (angle > DRAG_ARM_DEG) return 'prev';
  return '';
}
function releaseAction(angle, prepared) {
  if (prepared === 'prev' && angle > DRAG_COMMIT_DEG) return 'back';
  if (angle < -DRAG_COMMIT_DEG) return 'next';
  return 'cancel';
}
function dragSample(angle, prepared, mode) {
  if (prepared === 'prev' && mode !== 'reel') {
    return { progress: Math.max(0, 1 - angle / 180), forward: true };
  }
  return { progress: Math.min(1, Math.abs(angle) / 180), forward: angle <= 0 };
}
function createAnimationDriver(clock) {
  var frameId = 0;
  var generation = 0;
  function cancel() {
    generation += 1;
    if (frameId) {
      clock.cancelFrame(frameId);
      frameId = 0;
    }
  }
  function start(options) {
    cancel();
    var token = generation;
    var finished = false;
    function complete() {
      if (finished || token !== generation) return;
      finished = true;
      frameId = 0;
      options.onComplete();
    }
    var from = options.from;
    var to = options.to;
    var duration = options.duration;
    if (!(duration > 0)) {
      options.onUpdate(to);
      complete();
      return;
    }
    var t0 = clock.now();
    function step(now) {
      if (finished || token !== generation) return;
      var stamp = typeof now === 'number' ? now : clock.now();
      var u = Math.min(1, (stamp - t0) / duration);
      options.onUpdate(from + (to - from) * u);
      if (finished || token !== generation) return;
      if (u < 1) frameId = clock.requestFrame(step);
      else complete();
    }
    frameId = clock.requestFrame(step);
  }
  return { start: start, cancel: cancel, destroy: cancel };
}
`;

export function foldPlayerScript() {
  return [
    'const FOLD_POSES = ' + JSON.stringify(FOLD_POSES) + ';',
    'const FOLD_MS = ' + FOLD_MS + ';',
    'const BOOK_MODES = ' + JSON.stringify(BOOK_MODES) + ';',
    'const CURL_STRIPS = ' + CURL_STRIPS + ';',
    'const DRAG_COMMIT_DEG = ' + DRAG_COMMIT_DEG + ';',
    'const DRAG_ARM_DEG = ' + DRAG_ARM_DEG + ';',
    BODY.trim(),
  ].join('\n');
}
