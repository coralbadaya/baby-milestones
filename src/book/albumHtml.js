/**
 * The 3D album document. The Baby Book tab and the downloaded file share this player.
 */
import { BOOK_MODES, foldPlayerScript } from './pageFold.js';
import { PAGE_LAYOUTS, assignLayouts, layoutPlayerScript } from './pageLayouts.js';

function htmlEscape(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function buildAlbumHtml(album, options = {}) {
  const embedded = Boolean(options.embedded);
  const bornDate = album.dob ? new Date(`${album.dob}T12:00:00`) : null;
  const born = bornDate && !Number.isNaN(bornDate.getTime())
    ? bornDate.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
    : '';
  const bornLine = born
    ? `Born ${htmlEscape(born)}${embedded ? '' : ' · keep this file beside the photos'}`
    : 'Turn the pages of this year.';
  const laidOut = assignLayouts(album.pages || []);
  const payload = {
    title: album.title,
    baby: album.babyName,
    pages: laidOut.map((page) => ({
      ending: Boolean(page.ending),
      file: (options.inlinePhotos ? (page.src || page.file) : page.file) || '',
      monthLabel: page.monthLabel,
      title: page.title,
      caption: page.caption,
      when: page.when,
      layout: page.layout || '',
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
  header { text-align: center; padding: 0.35rem 1rem 0; }
  header .brand { font: 700 0.68rem/1 system-ui, sans-serif; letter-spacing: 0.16em; text-transform: uppercase; color: #c9a24b; margin: 0; }
  h1 { font-weight: 500; font-style: italic; font-size: clamp(1.45rem, 4vw, 2.1rem); margin: 0.15rem 0; }
  .born { font: 0.9rem/1.4 system-ui, sans-serif; color: rgba(245,240,235,0.78); margin: 0; }
  .tools { display: flex; gap: 0.7rem; align-items: stretch; padding: 0.3rem 0.7rem 0.15rem; overflow-x: auto; }
  .group { flex: 0 0 auto; display: flex; flex-direction: column; gap: 0.15rem; padding-right: 0.7rem; border-right: 1px solid rgba(201,162,75,0.28); }
  .group:last-child { border-right: 0; padding-right: 0; }
  .group-name { margin: 0; font: 700 0.62rem/1.2 system-ui, sans-serif; letter-spacing: 0.14em; text-transform: uppercase; color: #c9a24b; }
  .group-note { margin: 0; max-width: 26rem; font: 0.72rem/1.35 system-ui, sans-serif; color: rgba(245,240,235,0.72); }
  .group-row { display: flex; gap: 0.4rem; align-items: center; }
  .hint { display: block; text-align: center; font: 0.78rem/1.4 system-ui, sans-serif; color: rgba(245,240,235,0.68); margin: 0; padding: 0.15rem 0.8rem 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  button, .speed {
    min-height: 48px; border-radius: 999px; border: 1px solid rgba(201,162,75,0.5);
    background: transparent; color: #f5f0eb; font: 600 0.9rem/1 system-ui, sans-serif; padding: 0 0.95rem;
  }
  button.on, button.primary { background: #c9a24b; color: #1a1432; }
  .speed { display: inline-flex; gap: 0.45rem; align-items: center; padding: 0 0.8rem; }
  input[type="range"] { width: 92px; accent-color: #c9a24b; }
  .stage { perspective: 1800px; flex: 1; min-height: 0; display: grid; place-items: center; padding: 0.2rem 1rem 0.4rem; touch-action: none; }
  .book {
    width: min(100%, 1040px); height: 100%; max-height: 100%; position: relative;
    transform: rotateX(6deg); transform-style: preserve-3d;
  }
  .cover {
    position: absolute; inset: -8px -12px -14px -12px; z-index: 0; border-radius: 8px;
    background: linear-gradient(165deg, #4a3824, #1c140e 70%);
    box-shadow: 0 28px 40px rgba(0,0,0,0.45);
  }
  .book::before, .book::after {
    content: ""; position: absolute; top: 3px; bottom: 3px; width: 7px; z-index: 2; pointer-events: none;
    background: repeating-linear-gradient(#f6f0e4, #f6f0e4 1px, #e2d3bc 2px);
  }
  .book::before { left: -7px; border-radius: 3px 0 0 3px; }
  .book::after { right: -7px; border-radius: 0 3px 3px 0; }
  .board, .leaf { position: absolute; top: 0; bottom: 0; width: 50%; }
  .board { z-index: 1; overflow: hidden; background: #f6f0e4; }
  .board.left { left: 0; border-radius: 5px 0 0 5px; box-shadow: inset -16px 0 22px rgba(48,28,10,0.14); }
  .board.right { left: 50%; border-radius: 0 5px 5px 0; box-shadow: inset 14px 0 20px rgba(48,28,10,0.1); }
  .leaf { left: 50%; z-index: 3; transform-origin: left center; transform-style: preserve-3d; }
  .curl { position: absolute; inset: 0; transform-style: preserve-3d; pointer-events: none; display: none; }
  .leaf.curling .curl { display: block; }
  .leaf.curling > .face { visibility: hidden; }
  .hinge { position: absolute; top: 0; bottom: 0; left: 0; transform-style: preserve-3d; will-change: transform; }
  .strip {
    position: absolute; top: 0; bottom: 0; left: 0; right: -1px; overflow: hidden;
    transform-origin: left center; transform-style: preserve-3d; will-change: transform;
  }
  .pane {
    position: absolute; top: 0; height: 100%; overflow: hidden;
    backface-visibility: hidden; transform-style: preserve-3d;
  }
  .pane.back { transform: rotateY(180deg); }
  .pane .face { position: absolute; inset: 0; border-radius: 0; box-shadow: none; transform: none; }
  .pane.back .face { transform: scaleX(-1); }
  .gutter {
    position: absolute; top: 0; bottom: 0; left: 50%; width: 26px; transform: translateX(-50%); z-index: 4; pointer-events: none;
    background: linear-gradient(90deg, rgba(40,22,8,0.22), rgba(255,250,240,0.35) 46%, rgba(40,22,8,0.32));
  }
  .face { position: absolute; inset: 0; backface-visibility: hidden; overflow: hidden; background: #f6f0e4; color: #1e2a26;
    background-image: linear-gradient(180deg, rgba(255,255,255,0.45), transparent 28%); }
  .leaf .face { border-radius: 0 5px 5px 0; box-shadow: 10px 16px 24px rgba(0,0,0,calc(var(--shade, 0) * 0.38)); }
  .leaf .face.front::after, .leaf .face.back::after {
    content: ""; position: absolute; inset: 0; pointer-events: none; z-index: 2;
    background: rgba(28,18,8,calc(var(--shade, 0) * 0.55));
  }
  .folio {
    position: absolute; top: 0.55rem; z-index: 5; pointer-events: none;
    font: 600 0.72rem/1 system-ui, sans-serif; letter-spacing: 0.14em; color: rgba(30,42,38,0.55);
  }
  .folio-left { left: 0.7rem; }
  .folio-right { right: 0.7rem; }
  .face[data-role="photo"] .folio, .face[data-role="pair"] .folio { color: rgba(245,240,235,0.86); }
  body.no-numbers .folio { display: none; }
  .face.back { transform: rotateY(180deg); }
  .art { position: relative; height: 58%; overflow: hidden; background: #efe6d6; }
  .art .layer { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; display: block; }
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
  .face[data-role="photo"] .art { position: absolute; inset: 0; height: auto; }
  .face[data-role="photo"] .words {
    position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; color: #f5f0eb;
    background: linear-gradient(transparent, rgba(16,10,6,0.82)); padding: 2rem 0.75rem 0.7rem;
  }
  .face[data-role="photo"] .kicker, .face[data-role="photo"] .when { color: rgba(245,240,235,0.82); }
  .face[data-role="photo"] h2, .face[data-role="photo"] .cap { color: #f5f0eb; }
  .face[data-role="story"], .face[data-role="chapter"] { display: flex; flex-direction: column; justify-content: center; padding: 1rem 0.95rem 1.05rem; }
  .face[data-role="story"] .words, .face[data-role="chapter"] .words, .face[data-role="pair"] .words { padding: 0; }
  .face[data-role="story"] h2, .face[data-role="chapter"] h2 { font-size: clamp(1.35rem, 3vw, 2.05rem); }
  .rule { width: 42px; height: 1px; background: #8a6a22; margin: 0.15rem 0 0.65rem; }
  .face[data-role="chapter"] { background: radial-gradient(circle at 28% 18%, #fffaf2, #f0e4cc 72%); }
  .face[data-role="chapter"] .ghost { position: static; color: rgba(30,42,38,0.16); text-shadow: none; font-size: clamp(4.2rem, 12vw, 7.2rem); }
  .face[data-role="chapter"] .who { position: static; display: block; margin: 0.35rem 0 0.7rem; color: #8a6a22; }
  .face[data-role="pair"] { display: flex; flex-direction: column; }
  .stack { flex: 1; min-height: 0; display: grid; grid-template-rows: 1fr 1fr; gap: 6px; padding: 6px 6px 0; }
  .frame { overflow: hidden; background: #e7dcc8; min-height: 0; }
  .frame img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .face[data-role="pair"] .words { padding: 0.4rem 0.65rem 0.55rem; }
  .face[data-role="pair"] h2 { font-size: 1.05rem; }
  .face[data-role="pair"] .cap { font-size: 0.78rem; }
  .face[data-role="pair"] .when { display: none; }
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
  body.reel .book { width: min(100vw, calc(100dvh * 9 / 16)); height: min(100dvh, calc(100vw * 16 / 9)); transform: none; }
  body.reel .cover, body.reel .left, body.reel .gutter, body.reel .book::before, body.reel .book::after { display: none; }
  body.reel .right, body.reel .leaf { left: 0; width: 100%; }
  body.reel .face { border-radius: 0; }
  body.reel .bars { display: flex; }
  body.reel .face img { height: 100%; }
  body.reel .words {
    position: absolute; left: 0; right: 0; bottom: 0; color: #f5f0eb;
    background: linear-gradient(transparent, rgba(8,5,16,0.82)); padding: 3.2rem 1rem 1.3rem;
  }
  body.reel .kicker, body.reel .when { color: rgba(245,240,235,0.8); }
  body.reel .ghost { top: auto; bottom: 7.2rem; color: rgba(255,255,255,0.2); }
  .status { text-align: center; font: 0.8rem/1.4 system-ui, sans-serif; color: rgba(245,240,235,0.75); min-height: 1.2rem; padding-bottom: 0.4rem; }
  body.editing .piece { outline: 1px dashed rgba(63, 94, 82, 0.9); cursor: grab; }
  body.editing .piece.on { outline: 2px solid #3f5e52; }
  body.editing .ghost, body.editing .who { pointer-events: auto; }
  .grip {
    display: none; position: absolute; right: 6px; bottom: 6px; width: 28px; height: 28px; z-index: 6;
    background: #3f5e52; border: 2px solid #f6f0e4; border-radius: 4px; cursor: nwse-resize; touch-action: none;
  }
  body.editing .face { overflow: visible; }
  body.editing .grip { display: block; }
  .note {
    position: absolute; z-index: 5; padding: 0.35rem 0.55rem; overflow: hidden;
    color: #1e2a26; font: italic 1.2rem/1.25 Georgia, "Times New Roman", serif;
    background: rgba(255, 250, 242, 0.82); border-radius: 4px; min-width: 2.5rem; min-height: 1.6rem;
  }
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
    .book { transform: none; }
    .group-note { display: none; }
    .stage { padding: 0.15rem 0.7rem 6.6rem; }
  }
  @media (prefers-reduced-motion: reduce) {
    .leaf { transition: none !important; }
    .bars i.now::after { animation: none; width: 100%; }
  }
  html:has(body.embedded) { height: 100%; }
  body.embedded { height: 100%; }
  body.embedded header { display: flex; align-items: baseline; justify-content: center; gap: 0.7rem; padding: 0.15rem 0.7rem 0; }
  body.embedded .brand { display: none; }
  body.embedded h1 { font-size: 1.2rem; margin: 0; }
  body.embedded .born { margin: 0; }
  body.embedded .group-note, body.embedded .hint { display: none; }
  body.embedded button, body.embedded .speed { min-height: 40px; }
  body.embedded .tools { padding: 0.15rem 0.45rem 0; }
  @media (max-width: 800px) {
    body.embedded header { order: 1; }
    body.embedded .status { order: 2; position: static; text-align: center; padding: 0.1rem 0.6rem 0; }
    body.embedded .stage { order: 3; }
  }
  body.embedded.reel .stage { position: absolute; }
  body.embedded.reel .book { width: min(100%, calc(100% * 9 / 16)); height: 100%; }
</style>
</head>
<body${embedded ? ' class="embedded"' : ''}>
<header>
  <p class="brand">Yarn Trails</p>
  <h1>${htmlEscape(album.title)}</h1>
  <p class="born">${bornLine}</p>
</header>
<div class="tools">
  <section class="group">
    <p class="group-name">Turn</p>
    <p class="group-note">Previous, next, or play. The seconds are how long each spread rests before the next turn.</p>
    <div class="group-row">
      <button type="button" id="prev" aria-label="Previous page">‹</button>
      <button type="button" id="play">Play</button>
      <button type="button" id="next" aria-label="Next page">›</button>
      <label class="speed">Each page <input id="speed" type="range" min="2" max="8" step="1" value="4"> <span id="speedOut">4s</span></label>
    </div>
  </section>
  <section class="group">
    <p class="group-name">Look</p>
    <p class="group-note">Printed keeps the photograph flat on the paper. The others lift that same photograph off the page.</p>
    <div class="group-row">
      <button type="button" data-style="plain" class="on">Printed</button>
      ${BOOK_MODES.map((mode) => `<button type="button" data-style="${mode.id}">${htmlEscape(mode.label)}</button>`).join('\n      ')}
    </div>
  </section>
  <section class="group">
    <p class="group-name">Layout</p>
    <p class="group-note">What the left page holds, and what the right page holds.</p>
    <div class="group-row">
      ${PAGE_LAYOUTS.map((layout) => `<button type="button" data-layout="${layout.id}"${layout.id === 'chapter' ? ' class="on"' : ''}>${htmlEscape(layout.label)}</button>`).join('\n      ')}
    </div>
  </section>
  <section class="group">
    <p class="group-name">Page</p>
    <p class="group-note">Numbers mark each page. Sound is the turn. Edit lets you drag a photograph or the words, resize them, or add a line.</p>
    <div class="group-row">
      <button type="button" id="numbers" class="on">Numbers</button>
      <button type="button" id="sound" class="on">Sound on</button>
      <button type="button" id="edit">Edit page</button>
      <button type="button" id="addText">Add text</button>
      <button type="button" id="removeNote">Remove text</button>
      <button type="button" id="resetPage">Reset page</button>
    </div>
  </section>
  <section class="group">
    <p class="group-name">Share</p>
    <p class="group-note">A tall story for an Instagram reel, a WhatsApp status, or a Facebook story.</p>
    <div class="group-row">
      <button type="button" id="reel">Reel</button>
      <button type="button" id="save" class="primary">Save reel video</button>
    </div>
  </section>
</div>
<p class="hint">The right page turns on the spine. Until it is edge-on you see that page. After that you see its back, the next left page, right-reading.</p>
<div class="stage" id="stage">
  <div class="book" id="book">
    <div class="cover"></div>
    <div class="bars" id="bars"></div>
    <div class="board left"><div class="face" id="leftRest"></div></div>
    <div class="board right"><div class="face" id="rightRest"></div></div>
    <div class="leaf" id="flap">
      <div class="face front" id="front"></div>
      <div class="face back" id="back"></div>
      <div class="curl" id="curl"></div>
    </div>
    <div class="gutter"></div>
  </div>
</div>
<p class="status" id="status"></p>
<script>
const DATA = ${JSON.stringify(payload).replace(/</g, '\\u003c')};
const PAGES = DATA.pages;
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const stage = document.getElementById('stage');
const flap = document.getElementById('flap');
const front = document.getElementById('front');
const back = document.getElementById('back');
const rightRest = document.getElementById('rightRest');
const leftRest = document.getElementById('leftRest');
let index = 0;
let busy = false;
let playing = false;
let timer = 0;
let speed = 4;
let drag = null;
let foldTimer = 0;
let foldFrame = 0;
let hinges = [];
let helloTimer = 0;
let editDrag = null;
let selectedPiece = null;
let soundOn = true;
${foldPlayerScript()}
${layoutPlayerScript()}

function textEl(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  node.textContent = text || '';
  return node;
}
function photoArt(page) {
  const art = document.createElement('div');
  art.className = 'art';
  if (!page || !page.file) return art;
  const dim = document.createElement('img');
  dim.className = 'layer back';
  dim.alt = '';
  dim.src = page.file;
  const img = document.createElement('img');
  img.className = 'layer front';
  img.alt = page.title || '';
  img.src = page.file;
  art.append(dim, img);
  return art;
}
function wordsBlock(page) {
  const words = document.createElement('div');
  words.className = 'words';
  const rule = document.createElement('div');
  rule.className = 'rule';
  words.append(
    textEl('p', 'kicker', page.monthLabel || ''),
    rule,
    textEl('h2', '', page.title || ''),
    textEl('p', 'cap', page.caption || ''),
    textEl('p', 'when', page.when || '')
  );
  return words;
}
function mark(node, name) {
  node.classList.add('piece');
  node.dataset.piece = name;
  return node;
}
function faceKey(slot, side) {
  const page = slot && slot.page;
  const extra = slot && slot.extra;
  const id = page ? (page.file || page.title || 'page') : 'blank';
  const more = extra && extra.file ? extra.file : '';
  return side + '|' + (slot && slot.role ? slot.role : 'blank') + '|' + id + '|' + more;
}
function sideOf(node) {
  if (node === leftRest || node === back) return 'L';
  return 'R';
}
function readPieces() {
  try { return JSON.parse(localStorage.getItem('yt-album-pieces') || '{}'); }
  catch (error) { return {}; }
}
function writePieces(data) {
  localStorage.setItem('yt-album-pieces', JSON.stringify(data));
}
function round1(n) { return Math.round(n * 10) / 10; }
function boxOf(el, face) {
  const a = el.getBoundingClientRect();
  const b = face.getBoundingClientRect();
  return {
    x: (a.left - b.left) / (b.width || 1) * 100,
    y: (a.top - b.top) / (b.height || 1) * 100,
    w: a.width / (b.width || 1) * 100,
    h: a.height / (b.height || 1) * 100,
    z: Number(el.style.zIndex) || 3
  };
}
function place(el, box) {
  el.style.position = 'absolute';
  el.style.inset = 'auto';
  el.style.right = 'auto';
  el.style.bottom = 'auto';
  el.style.margin = '0';
  el.style.left = round1(box.x) + '%';
  el.style.top = round1(box.y) + '%';
  el.style.width = round1(box.w) + '%';
  el.style.height = round1(Math.max(8, box.h)) + '%';
  el.style.zIndex = String(box.z || 3);
}
function noteText(el) {
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.grip').forEach(function (grip) { grip.remove(); });
  return (clone.textContent || '').trim() || 'A line';
}
function ensureGrips(face) {
  if (!face) return;
  face.querySelectorAll('.piece').forEach(function (el) {
    if (window.getComputedStyle(el).position === 'static') el.style.position = 'relative';
    let hasGrip = false;
    for (let i = 0; i < el.children.length; i += 1) {
      if (el.children[i].classList.contains('grip')) hasGrip = true;
    }
    if (!hasGrip) {
      const grip = document.createElement('span');
      grip.className = 'grip';
      grip.setAttribute('aria-hidden', 'true');
      el.append(grip);
    }
  });
}
function saveFace(face) {
  if (!face || !face.dataset.key) return;
  const all = readPieces();
  const boxes = {};
  const notes = [];
  face.querySelectorAll('.piece').forEach(function (el) {
    if (el.classList.contains('note')) {
      const box = boxOf(el, face);
      box.text = noteText(el);
      notes.push(box);
      return;
    }
    if (el.dataset.piece) boxes[el.dataset.piece] = boxOf(el, face);
  });
  all[face.dataset.key] = { boxes: boxes, notes: notes };
  writePieces(all);
}
function makeNote(note) {
  const el = document.createElement('div');
  el.className = 'piece note';
  el.dataset.piece = 'note';
  el.contentEditable = 'true';
  el.textContent = note.text || 'A line';
  place(el, { x: note.x, y: note.y, w: note.w, h: note.h, z: note.z || 5 });
  el.addEventListener('blur', function () {
    const face = el.closest('.face');
    ensureGrips(face);
    saveFace(face);
  });
  return el;
}
function applyPieces(node) {
  const saved = readPieces()[node.dataset.key];
  if (!saved) return;
  const boxes = saved.boxes || {};
  Object.keys(boxes).forEach(function (name) {
    const el = node.querySelector('[data-piece="' + name + '"]');
    if (el && !el.classList.contains('note')) place(el, boxes[name]);
  });
  (saved.notes || []).forEach(function (note) { node.append(makeNote(note)); });
}
function fill(node, slot, folioAt) {
  if (selectedPiece && node.contains(selectedPiece)) selectedPiece = null;
  node.replaceChildren();
  const role = slot && slot.role ? slot.role : 'blank';
  node.setAttribute('data-role', role);
  node.dataset.key = faceKey(slot, sideOf(node));
  const page = slot && slot.page;
  if (role !== 'blank' && page) {
    if (role === 'ending') {
      const wrap = document.createElement('div');
      wrap.className = 'ending';
      wrap.append(
        textEl('p', 'kicker', 'The close'),
        textEl('h2', '', page.title),
        textEl('p', 'cap', page.caption),
        textEl('p', 'when', page.when)
      );
      node.append(mark(wrap, 'words'));
    } else if (role === 'pair') {
      const stack = document.createElement('div');
      stack.className = 'stack';
      [page, slot.extra].forEach(function (item) {
        const frame = document.createElement('div');
        frame.className = 'frame';
        if (item && item.file) {
          const img = document.createElement('img');
          img.alt = item.title || '';
          img.src = item.file;
          frame.append(img);
        }
        stack.append(frame);
      });
      node.append(mark(stack, 'photo'), mark(wordsBlock(page), 'words'));
    } else if (role === 'story') {
      node.append(mark(wordsBlock(page), 'words'));
    } else if (role === 'chapter') {
      node.append(
        mark(textEl('span', 'ghost', String(page.monthLabel || '').replace('Month ', '')), 'month'),
        mark(textEl('span', 'who', DATA.baby), 'name'),
        mark(wordsBlock(page), 'words')
      );
    } else {
      node.append(
        mark(photoArt(page), 'photo'),
        mark(textEl('span', 'ghost', String(page.monthLabel || '').replace('Month ', '')), 'month'),
        mark(textEl('span', 'who', DATA.baby), 'name'),
        mark(wordsBlock(page), 'words')
      );
    }
  }
  applyPieces(node);
  if (typeof folioAt === 'number') {
    const nums = bookPages(folioAt);
    const onLeft = sideOf(node) === 'L';
    const folio = document.createElement('span');
    folio.className = 'folio ' + (onLeft ? 'folio-left' : 'folio-right');
    folio.textContent = String(document.body.classList.contains('reel') ? folioAt + 1 : (onLeft ? nums.left : nums.right));
    node.append(folio);
  }
  if (document.body.classList.contains('editing')) ensureGrips(node);
}
function bookPages(at) {
  let cursor = 0;
  let n = 1;
  let guard = 0;
  const target = at < 0 ? 0 : at;
  while (cursor < PAGES.length && guard <= PAGES.length) {
    if (cursor === target) return { left: n, right: n + 1 };
    const step = cursor + (composeSpread(PAGES, cursor).take || 1);
    n += 2;
    if (step <= cursor) break;
    cursor = step;
    guard += 1;
  }
  return { left: n, right: n + 1 };
}
function spreadNow() {
  return composeSpread(PAGES, index);
}
function stepForward() {
  if (document.body.classList.contains('reel')) return index + 1;
  return index + spreadNow().take;
}
function stepBack() {
  if (document.body.classList.contains('reel')) return index - 1;
  return previousSpreadIndex(PAGES, index);
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
  if (!soundOn) return;
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
function layoutLabel(id) {
  for (let i = 0; i < PAGE_LAYOUTS.length; i += 1) {
    if (PAGE_LAYOUTS[i].id === id) return PAGE_LAYOUTS[i].label;
  }
  return '';
}
function markLayouts() {
  const id = spreadNow().id;
  document.querySelectorAll('[data-layout]').forEach(function (button) {
    button.classList.toggle('on', button.getAttribute('data-layout') === id);
  });
}
function showSpread() {
  const reel = document.body.classList.contains('reel');
  if (reel) {
    const page = PAGES[index];
    fill(front, page && page.ending ? { role: 'ending', page: page } : { role: 'photo', page: page }, index);
  } else {
    const spread = spreadNow();
    fill(leftRest, spread.left, index);
    fill(front, spread.right, index);
    fill(rightRest, spread.right, index);
  }
  renderAngle(0, false);
  markLayouts();
}
function paintChrome() {
  const reel = document.body.classList.contains('reel');
  const spread = spreadNow();
  const nums = bookPages(index);
  const label = reel ? String(index + 1) : nums.left + '–' + nums.right;
  const name = reel ? '' : ' · ' + layoutLabel(spread.id);
  document.getElementById('status').textContent = 'Pages ' + label + ' · ' + (index + 1) + ' of ' + PAGES.length + name;
  document.getElementById('play').textContent = playing ? 'Pause' : 'Play';
  bars();
}
function cancelFold() {
  if (foldFrame) cancelAnimationFrame(foldFrame);
  foldFrame = 0;
  clearTimeout(foldTimer);
  clearTimeout(helloTimer);
}
function clearCurl() {
  hinges = [];
  const curl = document.getElementById('curl');
  if (curl) curl.replaceChildren();
}
function paneFrom(source, i, n, isBack) {
  const pane = document.createElement('div');
  pane.className = isBack ? 'pane back' : 'pane front';
  pane.style.width = (n * 100) + '%';
  pane.style.left = ((isBack ? -(n - 1 - i) : -i) * 100) + '%';
  const clone = source.cloneNode(true);
  clone.removeAttribute('id');
  clone.classList.remove('back');
  clone.style.transform = isBack ? 'scaleX(-1)' : 'none';
  pane.append(clone);
  return pane;
}
function buildCurl() {
  const curl = document.getElementById('curl');
  curl.replaceChildren();
  hinges = [];
  const n = CURL_STRIPS;
  const span = (100 / n) + '%';
  for (let i = 0; i < n; i += 1) {
    const hinge = document.createElement('div');
    hinge.className = 'hinge';
    hinge.style.width = span;
    hinge.style.zIndex = String(i + 1);
    const strip = document.createElement('div');
    strip.className = 'strip';
    strip.append(paneFrom(front, i, n, false), paneFrom(back, i, n, true));
    hinge.append(strip);
    curl.append(hinge);
    hinges.push({ hinge: hinge, strip: strip });
  }
  flap.dataset.pageWidth = String(flap.offsetWidth || 1);
}
function restLeaf() {
  cancelFold();
  flap.classList.remove('curling');
  flap.style.transition = 'none';
  flap.style.transform = 'none';
  flap.style.setProperty('--shade', '0');
  clearCurl();
}
function applyCurl(progress) {
  const p = Math.min(1, Math.max(0, progress));
  const pagePx = Number(flap.dataset.pageWidth) || 1;
  const poses = curlPose(p, pagePx);
  const bow = Math.sin(p * Math.PI);
  flap.style.transition = 'none';
  flap.style.transform = 'rotateX(' + (bow * 14).toFixed(2) + 'deg) rotateZ(' + (bow * 6).toFixed(2) + 'deg)';
  for (let i = 0; i < hinges.length; i += 1) {
    const pose = poses[i] || poses[0];
    const x = (pose.x / 100) * pagePx;
    hinges[i].hinge.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,' + pose.z.toFixed(2) + 'px)';
    hinges[i].strip.style.transform = 'rotateY(' + (-pose.angle).toFixed(2) + 'deg)';
  }
}
function renderProgress(progress, forward, animate) {
  if (document.body.classList.contains('reel')) {
    const pose = poseAt(progress);
    flap.style.transition = animate && !reduced ? 'transform 70ms linear' : 'none';
    flap.style.transform = poseTransform(pose, forward);
    flap.style.setProperty('--shade', Math.sin((pose.y * Math.PI) / 180).toFixed(3));
    return;
  }
  if (progress <= 0.001) {
    restLeaf();
    return;
  }
  sheetTransform(progress);
}
function sheetTransform(progress) {
  const p = Math.min(1, Math.max(0, progress));
  const eased = p * p * (3 - 2 * p);
  const lift = Math.sin(p * Math.PI);
  flap.classList.remove('curling');
  flap.style.transition = 'none';
  flap.style.transform = 'rotateX(' + (lift * 7).toFixed(2) + 'deg) rotateY(' + (-eased * 180).toFixed(2) + 'deg) translateZ(' + (lift * 22).toFixed(1) + 'px)';
  flap.style.setProperty('--shade', lift.toFixed(3));
}
function renderAngle(deg, animate) {
  renderProgress(Math.min(1, Math.abs(deg) / 180), deg <= 0, animate);
}
function runRigid(from, to, forward, done) {
  const t0 = performance.now();
  const step = function (now) {
    const u = Math.min(1, (now - t0) / FOLD_MS);
    renderProgress(from + (to - from) * u, forward, false);
    if (u < 1) foldFrame = requestAnimationFrame(step);
    else done();
  };
  foldFrame = requestAnimationFrame(step);
}
function runCurl(from, to, done) {
  buildCurl();
  applyCurl(from);
  flap.classList.add('curling');
  const t0 = performance.now();
  const step = function (now) {
    const u = Math.min(1, (now - t0) / FOLD_MS);
    applyCurl(from + (to - from) * u);
    if (u < 1) foldFrame = requestAnimationFrame(step);
    else done();
  };
  foldFrame = requestAnimationFrame(step);
}
function runSheet(from, to, done) {
  sheetTransform(from);
  const t0 = performance.now();
  const step = function (now) {
    const u = Math.min(1, (now - t0) / FOLD_MS);
    const p = from + (to - from) * u;
    if (p <= 0.001) restLeaf();
    else sheetTransform(p);
    if (u < 1) foldFrame = requestAnimationFrame(step);
    else done();
  };
  foldFrame = requestAnimationFrame(step);
}
function playFold(forward, done) {
  if (document.body.classList.contains('reel')) runRigid(0, 1, forward, done);
  else runSheet(0, 1, done);
}
function playUnfold(done) {
  runSheet(1, 0, done);
}
function settle(next) {
  index = next;
  showSpread();
  busy = false;
  paintChrome();
  if (playing) arm();
}
function turnTo(next, kind) {
  if (busy) return;
  if (next === index || next < 0 || next >= PAGES.length) {
    showSpread();
    return;
  }
  clearTimeout(timer);
  cancelFold();
  busy = true;
  feel(kind);
  const forward = next > index;
  const reel = document.body.classList.contains('reel');
  if (reduced) { settle(next); return; }
  if (reel) {
    const page = PAGES[next];
    fill(back, page && page.ending ? { role: 'ending', page: page } : { role: 'photo', page: page }, next);
    playFold(forward, function () { settle(next); });
    return;
  }
  const dest = composeSpread(PAGES, next);
  if (forward) {
    fill(back, dest.left, next);
    fill(rightRest, dest.right, next);
    playFold(true, function () { settle(next); });
    return;
  }
  const here = spreadNow();
  fill(leftRest, dest.left, next);
  fill(front, dest.right, next);
  fill(back, here.left, index);
  fill(rightRest, here.right, index);
  renderProgress(1, true, false);
  playUnfold(function () { settle(next); });
}
function arm() {
  clearTimeout(timer);
  if (!playing) return;
  if (stepForward() >= PAGES.length) { playing = false; paintChrome(); return; }
  timer = window.setTimeout(function () { turnTo(stepForward(), 'auto'); }, speed * 1000);
}
document.getElementById('prev').onclick = function () { turnTo(stepBack(), 'button-back'); };
document.getElementById('next').onclick = function () { turnTo(stepForward(), 'button-next'); };
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
    if (next !== 'plain') document.body.classList.add('style-' + next);
    document.querySelectorAll('[data-style]').forEach(function (other) {
      other.classList.toggle('on', other === button);
    });
    showSpread();
    if (next !== 'plain') feel(next === 'snowglobe' ? 'style-globe' : 'style-' + next);
  };
});
document.querySelectorAll('[data-layout]').forEach(function (button) {
  button.onclick = function () {
    const chosen = button.getAttribute('data-layout');
    if (PAGES[index]) PAGES[index].layout = chosen;
    showSpread();
    paintChrome();
    feel('style-parallax');
  };
});
document.getElementById('numbers').onclick = function () {
  document.body.classList.toggle('no-numbers');
  this.classList.toggle('on', !document.body.classList.contains('no-numbers'));
};
document.getElementById('sound').onclick = function () {
  soundOn = !soundOn;
  this.classList.toggle('on', soundOn);
  this.textContent = soundOn ? 'Sound on' : 'Sound off';
};
document.getElementById('edit').onclick = function () {
  const on = document.body.classList.toggle('editing');
  this.classList.toggle('on', on);
  if (on) {
    ensureGrips(leftRest);
    ensureGrips(front);
  }
};
document.getElementById('addText').onclick = function () {
  document.body.classList.add('editing');
  document.getElementById('edit').classList.add('on');
  const face = (selectedPiece && selectedPiece.closest('.face')) || front;
  const note = makeNote({ x: 14, y: 36, w: 50, h: 16, text: 'A line', z: 6 });
  face.append(note);
  ensureGrips(face);
  document.querySelectorAll('.piece.on').forEach(function (el) { el.classList.remove('on'); });
  note.classList.add('on');
  selectedPiece = note;
  note.focus();
  saveFace(face);
};
document.getElementById('removeNote').onclick = function () {
  if (!selectedPiece || !selectedPiece.classList.contains('note')) return;
  const face = selectedPiece.closest('.face');
  selectedPiece.remove();
  selectedPiece = null;
  saveFace(face);
};
document.getElementById('resetPage').onclick = function () {
  const all = readPieces();
  delete all[leftRest.dataset.key];
  delete all[front.dataset.key];
  writePieces(all);
  selectedPiece = null;
  showSpread();
};
document.getElementById('reel').onclick = function () {
  document.body.classList.toggle('reel');
  this.classList.toggle('on', document.body.classList.contains('reel'));
  showSpread();
  if (document.body.classList.contains('reel') && !playing) {
    playing = true;
    paintChrome();
    arm();
  }
};
stage.addEventListener('pointerdown', function (event) {
  if (event.target.closest('button')) return;
  if (document.body.classList.contains('editing')) {
    const grip = event.target.closest('.grip');
    const pieceEl = event.target.closest('.piece');
    document.querySelectorAll('.piece.on').forEach(function (el) { el.classList.remove('on'); });
    if (!pieceEl) { selectedPiece = null; return; }
    pieceEl.classList.add('on');
    selectedPiece = pieceEl;
    const face = pieceEl.closest('.face');
    const rect = pieceEl.getBoundingClientRect();
    editDrag = {
      piece: pieceEl,
      face: face,
      mode: grip ? 'resize' : 'move',
      startX: event.clientX,
      startY: event.clientY,
      dx: event.clientX - rect.left,
      dy: event.clientY - rect.top,
      w: rect.width,
      h: rect.height,
      moved: false,
      placed: false
    };
    pieceEl.setPointerCapture(event.pointerId);
    return;
  }
  if (busy) return;
  drag = { x: event.clientX, y: event.clientY, angle: 0, moved: false, held: false };
  drag.hold = window.setTimeout(function () {
    if (!drag || drag.moved) return;
    drag.held = true;
    clearTimeout(timer);
  }, 180);
  stage.setPointerCapture(event.pointerId);
});
stage.addEventListener('pointermove', function (event) {
  if (editDrag) {
    const travel = Math.abs(event.clientX - editDrag.startX) + Math.abs(event.clientY - editDrag.startY);
    if (travel < 4) return;
    editDrag.moved = true;
    if (!editDrag.placed) {
      place(editDrag.piece, boxOf(editDrag.piece, editDrag.face));
      const box = editDrag.piece.getBoundingClientRect();
      editDrag.dx = editDrag.startX - box.left;
      editDrag.dy = editDrag.startY - box.top;
      editDrag.w = box.width;
      editDrag.h = box.height;
      editDrag.placed = true;
    }
    const b = editDrag.face.getBoundingClientRect();
    if (editDrag.mode === 'move') {
      const x = (event.clientX - editDrag.dx - b.left) / (b.width || 1) * 100;
      const y = (event.clientY - editDrag.dy - b.top) / (b.height || 1) * 100;
      editDrag.piece.style.left = round1(Math.max(-8, Math.min(92, x))) + '%';
      editDrag.piece.style.top = round1(Math.max(-8, Math.min(88, y))) + '%';
    } else {
      const w = (editDrag.w + (event.clientX - editDrag.startX)) / (b.width || 1) * 100;
      const h = (editDrag.h + (event.clientY - editDrag.startY)) / (b.height || 1) * 100;
      editDrag.piece.style.width = round1(Math.max(12, Math.min(120, w))) + '%';
      editDrag.piece.style.height = round1(Math.max(8, Math.min(120, h))) + '%';
    }
    return;
  }
  if (!drag || busy) return;
  const dx = event.clientX - drag.x;
  const dy = event.clientY - drag.y;
  if (Math.abs(dx) < 8 && Math.abs(dy) < 8) return;
  drag.moved = true;
  const width = stage.getBoundingClientRect().width || 320;
  drag.angle = Math.max(-180, Math.min(180, (dx / width) * 180));
  if (drag.angle < -8 && drag.prepared !== 'next') {
    drag.prepared = 'next';
    clearCurl();
    if (document.body.classList.contains('reel')) {
      const page = PAGES[index + 1] || PAGES[index];
      fill(back, page && page.ending ? { role: 'ending', page: page } : { role: 'photo', page: page }, index + 1);
    } else {
      const destAt = stepForward();
      const dest = composeSpread(PAGES, destAt);
      fill(back, dest.left, destAt);
      fill(rightRest, dest.right, destAt);
    }
  }
  if (drag.angle > 8 && drag.prepared !== 'prev') {
    drag.prepared = 'prev';
    clearCurl();
    if (document.body.classList.contains('reel')) {
      const page = PAGES[index - 1] || PAGES[index];
      fill(back, page && page.ending ? { role: 'ending', page: page } : { role: 'photo', page: page }, index - 1);
    } else {
      const destAt = stepBack();
      const dest = composeSpread(PAGES, destAt);
      const here = spreadNow();
      fill(leftRest, dest.left, destAt);
      fill(front, dest.right, destAt);
      fill(back, here.left, index);
      fill(rightRest, here.right, index);
    }
  }
  if (drag.prepared === 'prev' && !document.body.classList.contains('reel')) renderProgress(Math.max(0, 1 - drag.angle / 180), true, false);
  else renderAngle(drag.angle, false);
});
stage.addEventListener('pointerup', function (event) {
  if (editDrag) {
    const info = editDrag;
    editDrag = null;
    if (info.moved) saveFace(info.face);
    else if (info.piece.classList.contains('note')) info.piece.focus();
    return;
  }
  if (!drag) return;
  clearTimeout(drag.hold);
  const info = drag;
  drag = null;
  if (info.held && !info.moved) { if (playing) arm(); return; }
  if (!info.moved && document.body.classList.contains('reel')) {
    const box = stage.getBoundingClientRect();
    const left = event.clientX - box.left < box.width * 0.35;
    turnTo(left ? stepBack() : stepForward(), left ? 'swipe-back' : 'swipe-next');
    return;
  }
  if (info.prepared === 'prev' && info.angle > 50) turnTo(stepBack(), 'swipe-back');
  else if (info.angle < -50) turnTo(stepForward(), 'swipe-next');
  else showSpread();
});
document.addEventListener('keydown', function (event) {
  const typing = document.activeElement && document.activeElement.isContentEditable;
  if (document.body.classList.contains('editing') && selectedPiece && !typing) {
    if (event.key === 'Backspace' || event.key === 'Delete') {
      if (!selectedPiece.classList.contains('note')) return;
      event.preventDefault();
      const face = selectedPiece.closest('.face');
      selectedPiece.remove();
      selectedPiece = null;
      saveFace(face);
      return;
    }
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft' || event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault();
      const face = selectedPiece.closest('.face');
      if (window.getComputedStyle(selectedPiece).position === 'static') place(selectedPiece, boxOf(selectedPiece, face));
      const box = boxOf(selectedPiece, face);
      const step = event.shiftKey ? 4 : 1;
      if (event.key === 'ArrowRight') box.x += step;
      if (event.key === 'ArrowLeft') box.x -= step;
      if (event.key === 'ArrowDown') box.y += step;
      if (event.key === 'ArrowUp') box.y -= step;
      place(selectedPiece, box);
      saveFace(face);
      return;
    }
  }
  if (typing) return;
  if (event.key === 'ArrowRight') turnTo(stepForward(), 'key-next');
  if (event.key === 'ArrowLeft') turnTo(stepBack(), 'key-back');
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
    const file = new File([blob], 'first-year-reel.' + ext, { type: blob.type });
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

showSpread();
paintChrome();
if (!reduced && !sessionStorage.getItem('yt-album-hello')) {
  sessionStorage.setItem('yt-album-hello', '1');
  feel('hello');
  const helloStart = performance.now();
  const hello = function (now) {
    const u = Math.min(1, (now - helloStart) / 900);
    const p = u < 0.5 ? (u / 0.5) * 0.16 : 0.16 * (1 - (u - 0.5) / 0.5);
    if (u >= 1) { restLeaf(); return; }
    sheetTransform(p);
    foldFrame = requestAnimationFrame(hello);
  };
  foldFrame = requestAnimationFrame(hello);
}
</script>
</body>
</html>
`;
}

