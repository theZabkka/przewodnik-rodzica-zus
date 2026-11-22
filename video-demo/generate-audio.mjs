import fs from "node:fs";
import path from "node:path";

const SAMPLE_RATE = 48000;
const DURATION = 60.0;
const TOTAL_SAMPLES = Math.floor(SAMPLE_RATE * DURATION);

const left = new Float32Array(TOTAL_SAMPLES);
const right = new Float32Array(TOTAL_SAMPLES);

// 1. Warm ambient editorial chord pad + gentle pluck pulse (96 BPM)
// Progression: Cmaj7 -> Am7 -> Fmaj7 -> G6 (each 4s, looping smoothly)
const chords = [
  [261.63, 329.63, 392.0, 493.88], // Cmaj7
  [220.0, 261.63, 329.63, 392.0],  // Am7
  [174.61, 220.0, 261.63, 329.63], // Fmaj7
  [196.0, 246.94, 293.66, 329.63], // G6
];

for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const t = i / SAMPLE_RATE;
  const chordIdx = Math.floor(t / 4.0) % chords.length;
  const localT = t % 4.0;
  const chord = chords[chordIdx];

  // Smooth per-chord swell envelope
  const chordEnv =
    Math.min(1, localT / 0.45) * Math.min(1, (4.0 - localT) / 0.45);

  let padL = 0;
  let padR = 0;
  for (let n = 0; n < chord.length; n++) {
    const f = chord[n];
    // Warm fundamental + gentle 2nd harmonic + slight stereo detune
    const sL =
      Math.sin(2 * Math.PI * (f * 0.9992) * t) * 0.72 +
      Math.sin(2 * Math.PI * (f * 1.9984) * t) * 0.14;
    const sR =
      Math.sin(2 * Math.PI * (f * 1.0008) * t) * 0.72 +
      Math.sin(2 * Math.PI * (f * 2.0016) * t) * 0.14;
    padL += sL;
    padR += sR;
  }

  // Gentle warm sub-bass root
  const bassFreq = chord[0] * 0.5;
  const bass = Math.sin(2 * Math.PI * bassFreq * t) * 0.22 * chordEnv;

  // Soft muted Rhodes/marimba arpeggio pluck every 0.625s (96 BPM)
  const beatDur = 0.625;
  const beatIdx = Math.floor(t / beatDur);
  const beatT = t % beatDur;
  const noteFreq = chord[beatIdx % chord.length] * 2.0;
  const pluckEnv = Math.exp(-beatT * 9.5) * Math.min(1, beatT / 0.008);
  const pluck =
    (Math.sin(2 * Math.PI * noteFreq * t) * 0.7 +
      Math.sin(2 * Math.PI * noteFreq * 2 * t) * 0.12) *
    pluckEnv *
    0.075;

  // Master fade-in (1.2s) and fade-out (2.5s)
  const masterFade =
    Math.min(1, t / 1.2) * Math.min(1, Math.max(0, (DURATION - t) / 2.5));

  const pan = (beatIdx % 2 === 0 ? -0.25 : 0.25);
  left[i] += (padL * 0.042 * chordEnv + bass * 0.35 + pluck * (1 - pan)) * masterFade;
  right[i] += (padR * 0.042 * chordEnv + bass * 0.35 + pluck * (1 + pan)) * masterFade;
}

// Deterministic PRNG for clean filtered whoosh noise
let seed = 133742;
function rand() {
  seed = (seed * 1664525 + 1013904223) >>> 0;
  return (seed / 0xffffffff) * 2 - 1;
}

// 2. Soft UI Whoosh on 3D scene transitions
function addWhoosh(startSec, durSec = 0.55, amp = 0.16) {
  const startIdx = Math.floor(startSec * SAMPLE_RATE);
  const len = Math.floor(durSec * SAMPLE_RATE);
  let lp = 0;
  let lp2 = 0;
  for (let k = 0; k < len; k++) {
    const idx = startIdx + k;
    if (idx < 0 || idx >= TOTAL_SAMPLES) continue;
    const u = k / len;
    const env = Math.sin(Math.PI * u) ** 1.6;
    // Sweep cutoff up then down
    const cutoff = 0.03 + 0.14 * Math.sin(Math.PI * u);
    const n = rand();
    lp += cutoff * (n - lp);
    lp2 += cutoff * (lp - lp2);
    const tone = Math.sin(2 * Math.PI * (140 + 180 * u) * (k / SAMPLE_RATE)) * 0.08;
    const sample = (lp2 * 2.2 + tone) * env * amp;
    // Slight stereo sweep left -> right
    left[idx] += sample * (1.0 - 0.35 * u);
    right[idx] += sample * (0.65 + 0.35 * u);
  }
}

// 3. Crisp pleasant Chat-Bubble Pop
function addBubblePop(startSec, pan = 0, pitchMul = 1.0, amp = 0.24) {
  const startIdx = Math.floor(startSec * SAMPLE_RATE);
  const durSec = 0.095;
  const len = Math.floor(durSec * SAMPLE_RATE);
  let phase = 0;
  for (let k = 0; k < len; k++) {
    const idx = startIdx + k;
    if (idx < 0 || idx >= TOTAL_SAMPLES) continue;
    const u = k / len;
    const t = k / SAMPLE_RATE;
    // Upward pitch bend like a soft glassy bubble pop
    const freq = (420 + 440 * Math.pow(u, 0.55)) * pitchMul;
    phase += (2 * Math.PI * freq) / SAMPLE_RATE;
    const env = Math.min(1, t / 0.004) * Math.exp(-u * 5.2);
    const sample =
      (Math.sin(phase) * 0.85 + Math.sin(phase * 2) * 0.15) * env * amp;
    left[idx] += sample * (1 - pan * 0.35);
    right[idx] += sample * (1 + pan * 0.35);
  }
}

// 4. Tactile Mouse Click
function addClick(startSec, amp = 0.22) {
  const startIdx = Math.floor(startSec * SAMPLE_RATE);
  const durSec = 0.024;
  const len = Math.floor(durSec * SAMPLE_RATE);
  for (let k = 0; k < len; k++) {
    const idx = startIdx + k;
    if (idx < 0 || idx >= TOTAL_SAMPLES) continue;
    const u = k / len;
    const env = Math.exp(-u * 11.0);
    const body = Math.sin(2 * Math.PI * 1650 * (k / SAMPLE_RATE)) * 0.6;
    const snap = rand() * 0.35;
    const sample = (body + snap) * env * amp;
    left[idx] += sample;
    right[idx] += sample;
  }
}

// 5. Warm Ending Chime (C5 + E5 + G5 + B5)
function addEndingChime(startSec) {
  const notes = [523.25, 659.25, 783.99, 987.77];
  notes.forEach((f, idx) => {
    const startIdx = Math.floor((startSec + idx * 0.09) * SAMPLE_RATE);
    const len = Math.floor(1.8 * SAMPLE_RATE);
    for (let k = 0; k < len; k++) {
      const i = startIdx + k;
      if (i < 0 || i >= TOTAL_SAMPLES) continue;
      const t = k / SAMPLE_RATE;
      const env = Math.min(1, t / 0.01) * Math.exp(-t * 2.4);
      const s = Math.sin(2 * Math.PI * f * t) * env * 0.09;
      left[i] += s;
      right[i] += s;
    }
  });
}

// Trigger scene transition whooshes (matching index.html GSAP timestamps)
[0.05, 10.15, 17.65, 25.65, 34.15, 41.15, 47.65, 53.65].forEach((t) =>
  addWhoosh(t, 0.55, 0.16)
);

// Trigger chat bubble pops (matching all 19 popBubble timestamps + left/right pan)
const bubbles = [
  [0.7, 0.5, 1.0],
  [3.4, -0.5, 1.06],
  [6.5, 0.5, 1.12],
  [11.1, -0.5, 1.0],
  [13.8, 0.5, 1.08],
  [18.6, 0.5, 1.0],
  [20.6, -0.5, 1.06],
  [22.8, 0.5, 1.14],
  [26.6, -0.5, 1.0],
  [29.0, 0.5, 1.06],
  [31.3, 0.5, 1.12],
  [35.1, -0.5, 0.94],
  [37.8, 0.5, 1.0],
  [42.1, 0.5, 1.04],
  [44.5, -0.5, 1.1],
  [48.6, -0.5, 1.0],
  [50.9, 0.5, 1.08],
  [54.6, 0.5, 1.04],
  [56.8, -0.5, 1.15],
];
bubbles.forEach(([t, pan, pitch]) => addBubblePop(t, pan, pitch, 0.22));

// Trigger cursor clicks (0.62s after cursor glide starts)
[1.92, 4.92, 12.82, 20.22, 28.32, 36.82, 43.82, 50.22].forEach((t) =>
  addClick(t, 0.2)
);

// Warm final chime
addEndingChime(57.1);

// Soft limiter + encode 16-bit stereo WAV
const numChannels = 2;
const bytesPerSample = 2;
const dataSize = TOTAL_SAMPLES * numChannels * bytesPerSample;
const buffer = Buffer.alloc(44 + dataSize);

buffer.write("RIFF", 0);
buffer.writeUInt32LE(36 + dataSize, 4);
buffer.write("WAVE", 8);
buffer.write("fmt ", 12);
buffer.writeUInt32LE(16, 16);
buffer.writeUInt16LE(1, 20); // PCM
buffer.writeUInt16LE(numChannels, 22);
buffer.writeUInt32LE(SAMPLE_RATE, 24);
buffer.writeUInt32LE(SAMPLE_RATE * numChannels * bytesPerSample, 28);
buffer.writeUInt16LE(numChannels * bytesPerSample, 32);
buffer.writeUInt16LE(16, 34);
buffer.write("data", 36);
buffer.writeUInt32LE(dataSize, 40);

let offset = 44;
for (let i = 0; i < TOTAL_SAMPLES; i++) {
  const sL = Math.tanh(left[i] * 1.15);
  const sR = Math.tanh(right[i] * 1.15);
  buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(sL * 32767))), offset);
  offset += 2;
  buffer.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(sR * 32767))), offset);
  offset += 2;
}

const outPath = path.resolve("assets/soundtrack-60s.wav");
fs.writeFileSync(outPath, buffer);
console.log(`Generated ${outPath} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
