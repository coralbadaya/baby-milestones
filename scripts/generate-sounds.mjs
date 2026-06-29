#!/usr/bin/env node
/**
 * Generates soft, soothing UI sounds as WAV files.
 * Replace files in public/sounds/ with your own curated audio anytime.
 */
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dirname, '../public/sounds');
const SAMPLE_RATE = 44100;

function writeWav(filename, samples) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = SAMPLE_RATE * numChannels * (bitsPerSample / 8);
  const blockAlign = numChannels * (bitsPerSample / 8);
  const dataSize = samples.length * 2;
  const buffer = Buffer.alloc(44 + dataSize);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + dataSize, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20);
  buffer.writeUInt16LE(numChannels, 22);
  buffer.writeUInt32LE(SAMPLE_RATE, 24);
  buffer.writeUInt32LE(byteRate, 28);
  buffer.writeUInt16LE(blockAlign, 32);
  buffer.writeUInt16LE(bitsPerSample, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(dataSize, 40);

  for (let i = 0; i < samples.length; i++) {
    const clamped = Math.max(-1, Math.min(1, samples[i]));
    buffer.writeInt16LE(Math.round(clamped * 32767), 44 + i * 2);
  }

  writeFileSync(join(OUT_DIR, filename), buffer);
}

function envelope(t, attack, release, duration) {
  if (t < attack) return t / attack;
  if (t > duration - release) return Math.max(0, (duration - t) / release);
  return 1;
}

function tone(freq, duration, { volume = 0.08, attack = 0.02, release = 0.08, type = 'sine' } = {}) {
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, attack, release, duration);
    let sample;
    if (type === 'sine') {
      sample = Math.sin(2 * Math.PI * freq * t);
    } else {
      sample = Math.sin(2 * Math.PI * freq * t) * 0.6 + Math.sin(2 * Math.PI * freq * 2 * t) * 0.2;
    }
    samples[i] = sample * volume * env;
  }
  return samples;
}

function merge(...arrays) {
  const len = Math.max(...arrays.map((a) => a.length));
  const out = new Float32Array(len);
  for (const arr of arrays) {
    for (let i = 0; i < arr.length; i++) out[i] += arr[i];
  }
  return out;
}

function pad(samples, offsetSec) {
  const offset = Math.floor(offsetSec * SAMPLE_RATE);
  const out = new Float32Array(offset + samples.length);
  out.set(samples, offset);
  return out;
}

function swoosh(duration = 0.18, volume = 0.04) {
  const len = Math.floor(SAMPLE_RATE * duration);
  const samples = new Float32Array(len);
  for (let i = 0; i < len; i++) {
    const t = i / SAMPLE_RATE;
    const env = envelope(t, 0.01, 0.06, duration);
    const freq = 280 + (520 * t) / duration;
    samples[i] = Math.sin(2 * Math.PI * freq * t) * volume * env;
  }
  return samples;
}

mkdirSync(OUT_DIR, { recursive: true });

// Soft water-drop tap
writeWav('tap.wav', tone(392, 0.12, { volume: 0.05, attack: 0.005, release: 0.06 }));

// Gentle ascending chime (check)
writeWav('check.wav', merge(
  tone(523.25, 0.22, { volume: 0.045, release: 0.1 }),
  pad(tone(659.25, 0.28, { volume: 0.04, release: 0.12 }), 0.08),
));

// Soft descending note (uncheck)
writeWav('uncheck.wav', tone(440, 0.2, { volume: 0.035, attack: 0.01, release: 0.12 }));

// Subtle navigation
writeWav('navigate.wav', swoosh(0.14, 0.035));

// Celebration — soft harp-like arpeggio
writeWav('celebrate.wav', merge(
  tone(392, 0.25, { volume: 0.04, release: 0.14 }),
  pad(tone(494, 0.25, { volume: 0.038, release: 0.14 }), 0.07),
  pad(tone(587, 0.25, { volume: 0.036, release: 0.14 }), 0.14),
  pad(tone(784, 0.35, { volume: 0.034, release: 0.18 }), 0.21),
));

writeWav('swoosh.wav', swoosh(0.2, 0.04));

console.log('Generated soothing sounds in public/sounds/');
