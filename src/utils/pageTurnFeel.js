/** Distinct paper, key, and style sounds plus a short vibration for each way a page moves. */

const HAPTIC = {
  'button-next': [12, 28, 18],
  'button-back': [8, 18, 8],
  'swipe-next': [16, 36, 22],
  'swipe-back': [10, 24, 14],
  'key-next': 10,
  'key-back': 8,
  'style-parallax': [6, 36, 10],
  'style-popup': [18, 16, 18],
  'style-globe': [8, 28, 8, 28, 12],
  hello: [10, 40, 16, 40, 24],
};

let audioContext;

function context() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!audioContext) audioContext = new AudioCtx();
  if (audioContext.state === 'suspended') audioContext.resume();
  return audioContext;
}

function tone(freq, duration, type, gainValue, delay = 0) {
  const ctx = context();
  if (!ctx) return;
  const start = ctx.currentTime + delay;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(start);
  osc.stop(start + duration + 0.02);
}

function rustle(duration, gainValue) {
  const ctx = context();
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
  filter.frequency.value = 1400;
  gain.gain.value = gainValue;
  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);
  source.start();
}

const VOICES = {
  'button-next': () => { rustle(0.16, 0.08); tone(380, 0.18, 'triangle', 0.04); },
  'button-back': () => { rustle(0.12, 0.06); tone(620, 0.14, 'sine', 0.035); },
  'swipe-next': () => { rustle(0.28, 0.1); tone(280, 0.24, 'triangle', 0.04); },
  'swipe-back': () => { rustle(0.2, 0.07); tone(540, 0.18, 'sine', 0.035); },
  'key-next': () => { tone(880, 0.07, 'sine', 0.04); rustle(0.08, 0.04); },
  'key-back': () => { tone(520, 0.08, 'sine', 0.035); },
  'style-parallax': () => { tone(520, 0.22, 'sine', 0.04); tone(780, 0.28, 'sine', 0.025, 0.06); },
  'style-popup': () => { tone(160, 0.07, 'triangle', 0.04); tone(320, 0.12, 'triangle', 0.045, 0.05); },
  'style-globe': () => { tone(1040, 0.28, 'sine', 0.03); tone(1560, 0.36, 'sine', 0.02, 0.07); },
  hello: () => { tone(520, 0.3, 'sine', 0.04); tone(780, 0.4, 'sine', 0.03, 0.08); rustle(0.2, 0.05); },
};

export function playTurn(kind) {
  const pattern = HAPTIC[kind] || 10;
  if (navigator.vibrate) navigator.vibrate(pattern);
  (VOICES[kind] || VOICES['button-next'])();
}
