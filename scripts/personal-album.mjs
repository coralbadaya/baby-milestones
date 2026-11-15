/**
 * Local-only album for the private `personal/` folder.
 * Photos never leave this machine: no bundle, no commit, no remote upload.
 */
import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { monthAge, monthLabel } from '../src/utils/albumAge.js';
import { BOOKS_ROOT, createLocalAlbumStore } from '../src/book/albumStore.js';
import { BOOK_MODES, foldPlayerScript } from '../src/book/pageFold.js';

export const PERSONAL_DIR = path.resolve(process.cwd(), 'personal');
export const ALBUM_FILE = path.join(PERSONAL_DIR, 'album.json');
export const HTML_FILE = path.join(PERSONAL_DIR, 'first-year-3d-album.html');

const PHOTO_NAME = /^[\w.-]+\.(jpe?g|png|webp)$/i;

export function photoPath(name) {
  if (!name || name !== path.basename(name) || !PHOTO_NAME.test(name)) return null;
  const full = path.resolve(PERSONAL_DIR, name);
  if (!full.startsWith(PERSONAL_DIR + path.sep)) return null;
  if (!existsSync(full)) return null;
  return full;
}

function formatWhen(iso) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const day = date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const time = date.toLocaleTimeString('en-GB', {
    hour: 'numeric',
    minute: '2-digit',
  });
  return `${day} · ${time}`;
}

export function loadAlbum() {
  if (!existsSync(ALBUM_FILE)) return null;
  const raw = JSON.parse(readFileSync(ALBUM_FILE, 'utf8'));
  const dob = raw.dob;
  const pages = (raw.pages || [])
    .filter((page) => photoPath(page.file))
    .map((page) => {
      const month = monthAge(page.capturedAt, dob);
      return {
        file: page.file,
        capturedAt: page.capturedAt,
        month,
        monthLabel: monthLabel(month),
        title: page.title,
        caption: page.caption,
        when: formatWhen(page.capturedAt),
        src: `/api/personal-album/file/${encodeURIComponent(page.file)}`,
      };
    })
    .sort((a, b) => String(a.capturedAt).localeCompare(String(b.capturedAt)));

  if (pages.length) {
    const first = pages[0];
    const last = pages[pages.length - 1];
    const from = first.when.split(' · ')[0];
    const to = last.when.split(' · ')[0];
    pages.push({
      ending: true,
      file: null,
      capturedAt: last.capturedAt,
      month: last.month,
      monthLabel: 'The close',
      title: raw.title || 'The close',
      caption: `${pages.length} photographs, from ${from} to ${to}. This chapter closes here. The next one is still being lived.`,
      when: raw.babyName || '',
      src: null,
    });
  }

  return {
    dob,
    babyName: raw.babyName || 'Your little one',
    title: raw.title || 'First year',
    pages,
  };
}

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildAlbumHtml(album) {
  const born = new Date(`${album.dob}T12:00:00`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const payload = {
    title: album.title,
    baby: album.babyName,
    pages: album.pages.map((page) => ({
      ending: Boolean(page.ending),
      file: page.file || '',
      monthLabel: page.monthLabel,
      title: page.title,
      caption: page.caption,
      when: page.when,
    })),
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<title>${htmlEscape(album.title)}</title>
<style>
  :root { color-scheme: dark; }
  * { box-sizing: border-box; }
  body {
    margin: 0; height: 100dvh; display: flex; flex-direction: column; overflow: hidden; position: relative;
    font-family: "Iowan Old Style", Palatino, Georgia, serif;
    color: #f5f0eb;
    background: radial-gradient(1200px 600px at 50% -10%, #3a2a62, transparent 50%),
      linear-gradient(165deg, #1a1432 0%, #120c22 100%);
  }
  header { text-align: center; padding: 0.7rem 1rem 0; }
  header .brand { font: 700 0.68rem/1 system-ui, sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: #c9a24b; margin: 0; }
  h1 { font-weight: 500; font-style: italic; font-size: clamp(1.7rem, 6vw, 2.5rem); margin: 0.35rem 0; }
  .born { font: 0.9rem/1.4 system-ui, sans-serif; color: rgba(245,240,235,0.78); margin: 0; }
  .tools, .hint { display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: center; align-items: center; padding: 0.75rem 1rem; }
  .hint { display: block; text-align: center; font: 0.78rem/1.45 system-ui, sans-serif; color: rgba(245,240,235,0.68); max-width: 36rem; margin: 0 auto; }
  button, .speed {
    min-height: 48px; border-radius: 999px; border: 1px solid rgba(201,162,75,0.5);
    background: transparent; color: #f5f0eb; font: 600 0.9rem/1 system-ui, sans-serif; padding: 0 0.95rem;
  }
  button.on, button.primary { background: #c9a24b; color: #1a1432; }
  .speed { display: inline-flex; gap: 0.45rem; align-items: center; padding: 0 0.8rem; }
  input[type="range"] { width: 92px; accent-color: #c9a24b; }
  .stage { perspective: 1800px; flex: 1; min-height: 0; display: grid; place-items: center; padding: 0.2rem 1rem 0.4rem; touch-action: none; }
  .sheet { width: min(92vw, 420px); height: min(100%, 680px); position: relative; transform-style: preserve-3d; }
  .under, .flap { position: absolute; inset: 0; border-radius: 16px; }
  .under { background: #efe6d6; box-shadow: 0 18px 40px rgba(0,0,0,0.35); overflow: hidden; }
  .flap { transform-origin: left center; transform-style: preserve-3d; }
  .face { position: absolute; inset: 0; backface-visibility: hidden; background: #f7f1e6; color: #1e2a26; overflow: hidden; border-radius: 16px;
    box-shadow: 8px 16px 28px rgba(0,0,0,calc(var(--shade, 0) * 0.35)); }
  .face.front::after {
    content: ""; position: absolute; inset: 0; pointer-events: none;
    background: linear-gradient(90deg, rgba(28,18,8,calc(var(--shade, 0) * 0.42)), transparent 32%);
  }
  .face.back { transform: rotateY(180deg); }
  .art { position: relative; height: 58%; overflow: hidden; background: #efe6d6; }
  .art .layer { width: 100%; height: 100%; object-fit: cover; display: block; }
  .art .back { display: none; }
  body.style-parallax .art .back { display: block; position: absolute; inset: -8%; width: 116%; height: 116%; filter: brightness(0.55); }
  body.style-parallax .art .front { position: absolute; left: 8%; top: 7%; width: 76%; height: 82%; box-shadow: 0 16px 26px rgba(0,0,0,0.38); }
  body.style-popup .art .back { display: block; position: absolute; inset: 0; filter: brightness(0.42); transform: scale(1.06); }
  body.style-popup .art .front { position: absolute; left: 9%; top: 6%; width: 82%; height: 86%; box-shadow: 0 22px 28px rgba(0,0,0,0.48); }
  body.style-snowglobe .art { background: radial-gradient(circle at 35% 28%, #4a3578, #241838 72%); }
  body.style-snowglobe .art .front { position: absolute; left: 50%; top: 50%; width: auto; height: 88%; max-width: 78%; aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 50%; box-shadow: inset -8px -12px 18px rgba(0,0,0,0.35), inset 6px 8px 14px rgba(255,255,255,0.4); }
  body.style-snowglobe .art::after { content: ""; position: absolute; left: 50%; top: 50%; width: auto; height: 88%; max-width: 78%; aspect-ratio: 1; transform: translate(-50%, -50%); border-radius: 50%; pointer-events: none; background: linear-gradient(140deg, rgba(255,255,255,0.48), transparent 46%); }
  body.reel .art { height: 100%; background: #000; }
  body.reel .art .back, body.reel .art::after { display: none !important; }
  body.reel .art .front { position: absolute; inset: 0; width: 100%; height: 100%; max-width: none; aspect-ratio: auto; transform: none; border-radius: 0; box-shadow: none; filter: none; }
  .ghost, .who { position: absolute; pointer-events: none; }
  .ghost {
    top: 34%; right: 0.7rem; font-size: 5.2rem; font-style: italic; line-height: 0.8;
    color: rgba(255,255,255,0.28); text-shadow: 0 8px 24px rgba(0,0,0,0.25);
  }
  .who {
    top: calc(58% - 1.4rem); left: 0.9rem; letter-spacing: 0.2em; text-transform: uppercase;
    font: 700 0.62rem/1 system-ui, sans-serif; color: rgba(255,255,255,0.88);
  }
  .words { padding: 0.85rem 1rem 1rem; }
  .kicker { margin: 0; font: 700 0.68rem/1 system-ui, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #8a6a22; }
  .face h2 { font-style: italic; font-weight: 500; font-size: 1.65rem; line-height: 1.1; margin: 0.3rem 0; }
  .cap { margin: 0; font: 0.95rem/1.45 system-ui, sans-serif; }
  .when { margin: 0.55rem 0 0; font: 0.78rem/1.3 system-ui, sans-serif; color: #4a564f; }
  .ending { height: 100%; display: flex; flex-direction: column; justify-content: center; text-align: center; padding: 1.6rem;
    background: radial-gradient(circle at 50% 20%, #fffaf2, #f0e4cc 70%); }
  .ending h2 { font-size: 2rem; }
  .bars { display: none; gap: 4px; position: absolute; top: 0.55rem; left: 0.6rem; right: 0.6rem; z-index: 3; }
  .bars i { flex: 1; height: 3px; border-radius: 99px; background: rgba(255,255,255,0.35); overflow: hidden; }
  .bars i.done { background: #fff; }
  .bars i.now { background: rgba(255,255,255,0.35); }
  .bars i.now::after { content: ""; display: block; height: 100%; width: 0; background: #fff; animation: fill var(--ms, 4s) linear forwards; }
  @keyframes fill { to { width: 100%; } }
  body.reel header, body.reel .tools, body.reel .hint { display: none; }
  body.reel { background: #000; }
  body.reel .stage { position: fixed; inset: 0; padding: 0; }
  body.reel .sheet { width: min(100vw, calc(100dvh * 9 / 16)); height: min(100dvh, calc(100vw * 16 / 9)); }
  body.reel .under, body.reel .face { border-radius: 0; }
  body.reel .bars { display: flex; }
  body.reel .face img { height: 100%; }
  body.reel .words {
    position: absolute; left: 0; right: 0; bottom: 0; color: #f5f0eb;
    background: linear-gradient(transparent, rgba(8,5,16,0.82)); padding: 3.2rem 1rem 1.3rem;
  }
  body.reel .kicker, body.reel .when { color: rgba(245,240,235,0.8); }
  body.reel .ghost { top: auto; bottom: 7.2rem; color: rgba(255,255,255,0.2); }
  .status { text-align: center; font: 0.8rem/1.4 system-ui, sans-serif; color: rgba(245,240,235,0.75); min-height: 1.2rem; padding-bottom: 0.4rem; }
  @media (max-width: 800px) {
    header { padding: 0.45rem 0.8rem 0; }
    h1 { font-size: 1.45rem; margin: 0.1rem 0; }
    .born, .hint { display: none; }
    .status { position: absolute; top: 0.55rem; right: 0.75rem; min-height: 0; padding: 0; }
    .tools {
      position: fixed; left: 0; right: 0; bottom: 0; z-index: 5;
      padding: 1.4rem 0.55rem calc(0.45rem + env(safe-area-inset-bottom));
      background: linear-gradient(transparent, rgba(12,8,22,0.94) 42%);
    }
    .stage { padding: 0.15rem 0.7rem 10.5rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .flap { transition: none !important; }
    .bars i.now::after { animation: none; width: 100%; }
  }
</style>
</head>
<body class="style-parallax">
<header>
  <p class="brand">Yarn Trails</p>
  <h1>${htmlEscape(album.title)}</h1>
  <p class="born">Born ${htmlEscape(born)} · keep this file beside the photos</p>
</header>
<div class="tools">
  <button type="button" id="prev" aria-label="Previous page">‹</button>
  <button type="button" id="play">Play</button>
  <button type="button" id="next" aria-label="Next page">›</button>
  <label class="speed">Each page <input id="speed" type="range" min="2" max="8" step="1" value="4"> <span id="speedOut">4s</span></label>
  ${BOOK_MODES.map((mode) => `<button type="button" data-style="${mode.id}"${mode.id === 'parallax' ? ' class="on"' : ''}>${htmlEscape(mode.label)}</button>`).join('\n  ')}
  <button type="button" id="reel">Reel</button>
  <button type="button" id="save" class="primary">Save reel video</button>
</div>
<p class="hint">The page is picked up, folded, carried, and laid down. Parallax, Pop-up, and Snow-globe restyle the same pages. Play sets the pause between turns. Reel saves a vertical video for an Instagram Reel, a WhatsApp Status, or a Facebook Story.</p>
<div class="stage" id="stage">
  <div class="sheet">
    <div class="bars" id="bars"></div>
    <div class="under face" id="under"></div>
    <div class="flap" id="flap">
      <div class="face front" id="front"></div>
      <div class="face back" id="back"></div>
    </div>
  </div>
</div>
<p class="status" id="status"></p>
<script>
const DATA = ${JSON.stringify(payload)};
const PAGES = DATA.pages;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage = document.getElementById('stage');
const flap = document.getElementById('flap');
const front = document.getElementById('front');
const back = document.getElementById('back');
const under = document.getElementById('under');
let index = 0;
let busy = false;
let playing = false;
let timer = 0;
let speed = 4;
let drag = null;
let foldTimer = 0;
let helloTimer = 0;
${foldPlayerScript()}

function fill(node, page) {
  node.replaceChildren();
  if (!page) return;
  if (page.ending) {
    const wrap = document.createElement('div');
    wrap.className = 'ending';
    const kicker = document.createElement('p');
    kicker.className = 'kicker';
    kicker.textContent = 'The close';
    const title = document.createElement('h2');
    title.textContent = page.title;
    const caption = document.createElement('p');
    caption.className = 'cap';
    caption.textContent = page.caption;
    const who = document.createElement('p');
    who.className = 'when';
    who.textContent = page.when;
    wrap.append(kicker, title, caption, who);
    node.append(wrap);
    return;
  }
  const art = document.createElement('div');
  art.className = 'art';
  const back = document.createElement('img');
  back.className = 'layer back';
  back.src = page.file;
  back.alt = '';
  const img = document.createElement('img');
  img.className = 'layer front';
  img.src = page.file;
  img.alt = page.title;
  art.append(back, img);
  const ghost = document.createElement('span');
  ghost.className = 'ghost';
  ghost.textContent = page.monthLabel.replace('Month ', '');
  const who = document.createElement('span');
  who.className = 'who';
  who.textContent = DATA.baby;
  const words = document.createElement('div');
  words.className = 'words';
  const kicker = document.createElement('p');
  kicker.className = 'kicker';
  kicker.textContent = page.monthLabel;
  const title = document.createElement('h2');
  title.textContent = page.title;
  const caption = document.createElement('p');
  caption.className = 'cap';
  caption.textContent = page.caption;
  const when = document.createElement('p');
  when.className = 'when';
  when.textContent = page.when;
  words.append(kicker, title, caption, when);
  node.append(art, ghost, who, words);
}
function audioCtx() {
  const Ctx = window.AudioContext || window.webkitAudioContext;
  if (!Ctx) return null;
  if (!audioCtx.current) audioCtx.current = new Ctx();
  if (audioCtx.current.state === 'suspended') audioCtx.current.resume();
  return audioCtx.current;
}
function tone(freq, duration, type, gainValue, delay) {
  const ctx = audioCtx();
  if (!ctx) return;
  const start = ctx.currentTime + (delay || 0);
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(start); osc.stop(start + duration + 0.02);
}
function rustle(duration, gainValue) {
  const ctx = audioCtx();
  if (!ctx) return;
  const length = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i += 1) data[i] = (Math.random() * 2 - 1) * (1 - i / length);
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  source.buffer = buffer;
  filter.type = 'bandpass';
  filter.frequency.value = 1200;
  gain.gain.value = gainValue;
  source.connect(filter); filter.connect(gain); gain.connect(ctx.destination);
  source.start();
}
const VOICES = {
  'button-next': function () { rustle(0.18, 0.09); tone(340, 0.2, 'triangle', 0.045); },
  'button-back': function () { rustle(0.12, 0.06); tone(640, 0.14, 'sine', 0.035); },
  'swipe-next': function () { rustle(0.32, 0.11); tone(260, 0.26, 'triangle', 0.04); },
  'swipe-back': function () { rustle(0.22, 0.08); tone(520, 0.18, 'sine', 0.035); },
  'key-next': function () { tone(880, 0.07, 'sine', 0.04); rustle(0.08, 0.04); },
  'key-back': function () { tone(520, 0.08, 'sine', 0.035); },
  auto: function () { rustle(0.2, 0.07); tone(420, 0.22, 'sine', 0.03); },
  hello: function () { tone(520, 0.28, 'sine', 0.04); tone(780, 0.36, 'sine', 0.028, 0.08); },
  'style-parallax': function () { tone(520, 0.22, 'sine', 0.04); tone(780, 0.28, 'sine', 0.025, 0.06); },
  'style-popup': function () { tone(160, 0.07, 'triangle', 0.04); tone(320, 0.12, 'triangle', 0.045, 0.05); },
  'style-globe': function () { tone(1040, 0.28, 'sine', 0.03); tone(1560, 0.36, 'sine', 0.02, 0.07); }
};
const HAPTIC = {
  'button-next': [14, 30, 20],
  'button-back': [8, 20, 10],
  'swipe-next': [18, 36, 24],
  'swipe-back': [10, 24, 14],
  'key-next': 10,
  'key-back': 8,
  auto: [8, 24, 12],
  hello: [10, 40, 18]
};
function feel(kind) {
  if (navigator.vibrate) navigator.vibrate(HAPTIC[kind] || 10);
  (VOICES[kind] || VOICES.auto)();
}
function bars() {
  const row = document.getElementById('bars');
  row.replaceChildren();
  PAGES.forEach(function (_, i) {
    const mark = document.createElement('i');
    if (i < index) mark.className = 'done';
    if (i === index && playing) {
      mark.className = 'now';
      mark.style.setProperty('--ms', speed + 's');
    }
    row.append(mark);
  });
}
function paintChrome() {
  document.getElementById('status').textContent = (index + 1) + ' of ' + PAGES.length;
  document.getElementById('play').textContent = playing ? 'Pause' : 'Play';
  bars();
}
function renderProgress(progress, forward, animate) {
  const pose = poseAt(progress);
  const step = Math.round(FOLD_MS / 4);
  flap.style.transition = animate && !reduced ? 'transform ' + step + 'ms ease-in-out' : 'none';
  flap.style.transform = poseTransform(pose, forward);
  flap.style.setProperty('--shade', Math.sin((pose.y * Math.PI) / 180).toFixed(3));
}
function renderAngle(deg, animate) {
  renderProgress(Math.min(1, Math.abs(deg) / 180), deg <= 0, animate);
}
function playFold(forward, done) {
  const marks = FOLD_POSES.filter(function (pose) { return pose.t > 0; });
  const gap = Math.round(FOLD_MS / marks.length);
  let step = 0;
  const tick = function () {
    renderProgress(marks[step].t, forward, true);
    step += 1;
    if (step < marks.length) foldTimer = window.setTimeout(tick, gap);
    else foldTimer = window.setTimeout(done, gap);
  };
  tick();
}
function settle(next) {
  index = next;
  fill(front, PAGES[index]);
  fill(back, PAGES[index + 1] || PAGES[index]);
  fill(under, PAGES[index + 1] || PAGES[index]);
  renderAngle(0, false);
  busy = false;
  paintChrome();
  if (playing) arm();
}
function turnTo(next, kind) {
  if (busy) return;
  if (next === index || next < 0 || next >= PAGES.length) {
    renderAngle(0, true);
    return;
  }
  clearTimeout(timer);
  clearTimeout(foldTimer);
  clearTimeout(helloTimer);
  busy = true;
  feel(kind);
  const forward = next > index;
  fill(back, PAGES[next]);
  fill(under, PAGES[next]);
  if (reduced) { settle(next); return; }
  playFold(forward, function () { settle(next); });
}
function arm() {
  clearTimeout(timer);
  if (!playing) return;
  if (index >= PAGES.length - 1) { playing = false; paintChrome(); return; }
  timer = window.setTimeout(function () { turnTo(index + 1, 'auto'); }, speed * 1000);
}
document.getElementById('prev').onclick = function () { turnTo(index - 1, 'button-back'); };
document.getElementById('next').onclick = function () { turnTo(index + 1, 'button-next'); };
document.getElementById('play').onclick = function () {
  playing = !playing;
  paintChrome();
  if (playing) arm(); else clearTimeout(timer);
};
document.getElementById('speed').oninput = function (event) {
  speed = Number(event.target.value);
  document.getElementById('speedOut').textContent = speed + 's';
  if (playing) arm();
};
document.querySelectorAll('[data-style]').forEach(function (button) {
  button.onclick = function () {
    const next = button.getAttribute('data-style');
    document.body.classList.remove('style-parallax', 'style-popup', 'style-snowglobe');
    document.body.classList.add('style-' + next);
    document.querySelectorAll('[data-style]').forEach(function (other) {
      other.classList.toggle('on', other === button);
    });
    fill(front, PAGES[index]);
    fill(back, PAGES[index + 1] || PAGES[index]);
    fill(under, PAGES[index + 1] || PAGES[index]);
    feel(next === 'snowglobe' ? 'style-globe' : 'style-' + next);
  };
});
document.getElementById('reel').onclick = function () {
  document.body.classList.toggle('reel');
  this.classList.toggle('on', document.body.classList.contains('reel'));
  if (document.body.classList.contains('reel') && !playing) {
    playing = true;
    paintChrome();
    arm();
  }
};
stage.addEventListener('pointerdown', function (event) {
  if (busy || event.target.closest('button')) return;
  drag = { x: event.clientX, y: event.clientY, angle: 0, moved: false, held: false };
  drag.hold = window.setTimeout(function () {
    if (!drag || drag.moved) return;
    drag.held = true;
    clearTimeout(timer);
  }, 180);
  stage.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointermove', function (event) {
  if (!drag || busy) return;
  const dx = event.clientX - drag.x;
  const dy = event.clientY - drag.y;
  if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
  drag.moved = true;
  const width = stage.getBoundingClientRect().width || 320;
  drag.angle = Math.max(-180, Math.min(180, (dx / width) * 180));
  if (drag.angle < -8) { fill(back, PAGES[index + 1] || PAGES[index]); fill(under, PAGES[index + 1] || PAGES[index]); }
  if (drag.angle > 8) { fill(back, PAGES[index - 1] || PAGES[index]); fill(under, PAGES[index - 1] || PAGES[index]); }
  renderAngle(drag.angle, false);
});
stage.addEventListener('pointerup', function (event) {
  if (!drag) return;
  clearTimeout(drag.hold);
  const info = drag;
  drag = null;
  if (info.held && !info.moved) { if (playing) arm(); return; }
  if (!info.moved && document.body.classList.contains('reel')) {
    const box = stage.getBoundingClientRect();
    const left = event.clientX - box.left < box.width * 0.35;
    turnTo(index + (left ? -1 : 1), left ? 'swipe-back' : 'swipe-next');
    return;
  }
  if (info.angle < -50) turnTo(index + 1, 'swipe-next');
  else if (info.angle > 50) turnTo(index - 1, 'swipe-back');
  else renderAngle(0, true);
});
document.addEventListener('keydown', function (event) {
  if (event.key === 'ArrowRight') turnTo(index + 1, 'key-next');
  if (event.key === 'ArrowLeft') turnTo(index - 1, 'key-back');
});

function loadImage(src) {
  return new Promise(function (resolve) {
    if (!src) { resolve(null); return; }
    const img = new Image();
    img.onload = function () { resolve(img); };
    img.onerror = function () { resolve(null); };
    img.src = src;
  });
}
function cover(ctx, img, x, y, w, h) {
  if (!img) { ctx.fillStyle = '#1a1432'; ctx.fillRect(x, y, w, h); return; }
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
}
function drawCard(ctx, img, page, w, h) {
  ctx.fillStyle = '#f4ead8';
  ctx.fillRect(0, 0, w, h);
  if (page.ending) {
    ctx.fillStyle = '#1e2a26';
    ctx.font = '600 42px Georgia';
    ctx.textAlign = 'center';
    ctx.fillText('The close', w / 2, h * 0.38);
    ctx.font = 'italic 86px Georgia';
    wrapText(ctx, page.title, w / 2, h * 0.48, w - 140, 92);
    ctx.font = '40px system-ui, sans-serif';
    wrapText(ctx, page.caption, w / 2, h * 0.68, w - 160, 52);
    return;
  }
  cover(ctx, img, 0, 0, w, h);
  const fade = ctx.createLinearGradient(0, h * 0.52, 0, h);
  fade.addColorStop(0, 'rgba(8,5,16,0)');
  fade.addColorStop(1, 'rgba(8,5,16,0.88)');
  ctx.fillStyle = fade;
  ctx.fillRect(0, h * 0.5, w, h * 0.5);
  ctx.fillStyle = 'rgba(255,255,255,0.22)';
  ctx.font = 'italic 180px Georgia';
  ctx.textAlign = 'right';
  ctx.fillText(page.monthLabel.replace('Month ', ''), w - 60, h * 0.62);
  ctx.textAlign = 'left';
  ctx.fillStyle = '#c9a24b';
  ctx.font = '700 36px system-ui, sans-serif';
  ctx.fillText(page.monthLabel.toUpperCase(), 64, h * 0.7);
  ctx.fillStyle = '#f5f0eb';
  ctx.font = 'italic 78px Georgia';
  wrapText(ctx, page.title, 64, h * 0.77, w - 128, 84);
  ctx.font = '40px system-ui, sans-serif';
  wrapText(ctx, page.caption, 64, h * 0.88, w - 128, 50);
}
function wrapText(ctx, text, x, y, max, line) {
  const words = String(text || '').split(' ');
  let row = '';
  let top = y;
  words.forEach(function (word) {
    const trial = row ? row + ' ' + word : word;
    if (ctx.measureText(trial).width > max) {
      ctx.fillText(row, x, top);
      row = word;
      top += line;
    } else row = trial;
  });
  if (row) ctx.fillText(row, x, top);
}
function wait(ms) { return new Promise(function (resolve) { setTimeout(resolve, ms); }); }
document.getElementById('save').onclick = async function () {
  const button = this;
  button.disabled = true;
  button.textContent = 'Recording…';
  playing = false;
  clearTimeout(timer);
  try {
    const images = [];
    for (let i = 0; i < PAGES.length; i += 1) images.push(await loadImage(PAGES[i].file));
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1920;
    const ctx = canvas.getContext('2d');
    const mime = (window.MediaRecorder && MediaRecorder.isTypeSupported('video/mp4'))
      ? 'video/mp4'
      : (window.MediaRecorder && MediaRecorder.isTypeSupported('video/webm;codecs=vp9'))
        ? 'video/webm;codecs=vp9'
        : 'video/webm';
    const stream = canvas.captureStream(30);
    const rec = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 5000000 });
    const chunks = [];
    rec.ondataavailable = function (event) { if (event.data.size) chunks.push(event.data); };
    const stopped = new Promise(function (resolve) { rec.onstop = resolve; });
    rec.start();
    const frame = function (img, page) { drawCard(ctx, img, page, 1080, 1920); };
    for (let i = 0; i < PAGES.length; i += 1) {
      const steps = Math.max(8, speed * 12);
      for (let s = 0; s < steps; s += 1) {
        frame(images[i], PAGES[i]);
        await wait(1000 / 30);
      }
      if (i === PAGES.length - 1) break;
      const flips = 18;
      for (let s = 0; s < flips; s += 1) {
        frame(images[i + 1], PAGES[i + 1]);
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, 0, 1080 * (1 - s / flips), 1920);
        ctx.clip();
        frame(images[i], PAGES[i]);
        ctx.restore();
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillRect(1080 * (1 - s / flips) - 8, 0, 16, 1920);
        await wait(1000 / 30);
      }
    }
    rec.stop();
    await stopped;
    const blob = new Blob(chunks, { type: mime.split(';')[0] });
    const ext = blob.type.indexOf('mp4') >= 0 ? 'mp4' : 'webm';
    const file = new File([blob], 'shravya-first-year-reel.' + ext, { type: blob.type });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: DATA.title,
        text: 'A reel of ' + DATA.baby + ' — for Instagram, WhatsApp Status, or a Facebook Story.',
      });
    } else {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      link.click();
      URL.revokeObjectURL(url);
    }
    document.getElementById('status').textContent = ext === 'mp4'
      ? 'Video saved. Post it as a Reel, Status, or Story.'
      : 'Video saved as WebM. WhatsApp can post it. Instagram prefers the MP4 from Safari on iPhone.';
  } catch (error) {
    document.getElementById('status').textContent = 'Could not record the reel in this browser.';
  }
  button.disabled = false;
  button.textContent = 'Save reel video';
  paintChrome();
};

fill(front, PAGES[0]);
fill(back, PAGES[1] || PAGES[0]);
fill(under, PAGES[1] || PAGES[0]);
paintChrome();
if (!reduced && !sessionStorage.getItem('yt-album-hello')) {
  sessionStorage.setItem('yt-album-hello', '1');
  feel('hello');
  renderProgress(0.24, true, true);
  helloTimer = window.setTimeout(function () { renderProgress(0, true, true); }, 700);
}
</script>
</body>
</html>
`;
}

export function writeAlbumHtml(album = loadAlbum()) {
  if (!album) return null;
  for (const name of readdirSync(PERSONAL_DIR)) {
    if (/^\d{2}-.+\.html$/i.test(name)) unlinkSync(path.join(PERSONAL_DIR, name));
  }
  const full = buildAlbumHtml(album);
  writeFileSync(HTML_FILE, full);
  createLocalAlbumStore(BOOKS_ROOT).save('local-preview', {
    title: album.title,
    babyName: album.babyName,
    style: 'parallax',
    pages: album.pages,
    htmlPath: 'personal/first-year-3d-album.html',
  });
  return { full, pages: [] };
}

export function publishBook(accountId, album, store = createLocalAlbumStore(BOOKS_ROOT)) {
  return store.save(accountId, {
    title: album.title,
    babyName: album.babyName,
    style: album.style || 'parallax',
    pages: album.pages,
    html: buildAlbumHtml(album),
  });
}
