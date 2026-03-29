// sfx.js — Web Audio API sound effects (no external files needed)
// All sounds are generated programmatically.
import * as game from "./game.js"
const ctx = new (window.AudioContext || window.webkitAudioContext)();

// Resume context on first user interaction (browser autoplay policy)
function resume() {
  if (ctx.state === "suspended") ctx.resume();
}

/**
 * Low-level helper: plays an oscillator with an envelope.
 * @param {number} freq       - Frequency in Hz
 * @param {string} type       - Oscillator type: "sine"|"square"|"sawtooth"|"triangle"
 * @param {number} gainPeak   - Peak gain (0–1)
 * @param {number} attackTime - Attack duration in seconds
 * @param {number} decayTime  - Decay duration in seconds
 * @param {number} startTime  - ctx.currentTime offset
 */
function tone(freq, type, gainPeak, attackTime, decayTime, startTime = 0) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + startTime);

  gain.gain.setValueAtTime(0, ctx.currentTime + startTime);
  gain.gain.linearRampToValueAtTime(gainPeak, ctx.currentTime + startTime + attackTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + attackTime + decayTime);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(ctx.currentTime + startTime);
  osc.stop(ctx.currentTime + startTime + attackTime + decayTime + 0.05);
}

/**
 * Noise burst helper (for wrong-match "buzz").
 */
function noise(gainPeak, duration, startTime = 0) {
  const bufferSize = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  // Band-pass filter to make it sound like a buzzer
  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.value = 300;
  filter.Q.value = 0.5;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(gainPeak, ctx.currentTime + startTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + startTime + duration);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  source.start(ctx.currentTime + startTime);
  source.stop(ctx.currentTime + startTime + duration);
}

// ─── Public SFX ────────────────────────────────────────────────────────────────

/** Card flip — crisp "whoosh" tick */
export function playFlip() {
  if(!game.soundEnabled()) return ;
  resume();
  tone(800,  "sine", 0.15, 0.005, 0.08);
  tone(400,  "sine", 0.08, 0.005, 0.10, 0.03);
}

/** Correct match — bright coin collect (Mario-style) */
export function playMatch() {
    if(!game.soundEnabled()) return ;

  resume();
  // Quick rising two-tone "bling" characteristic of coin pickups
  const osc1 = ctx.createOscillator();
  const osc2 = ctx.createOscillator();
  const gain1 = ctx.createGain();
  const gain2 = ctx.createGain();

  // First tone: short high square wave attack
  osc1.type = "square";
  osc1.frequency.setValueAtTime(988.0, ctx.currentTime);       // B5
  gain1.gain.setValueAtTime(0.18, ctx.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
  osc1.connect(gain1); gain1.connect(ctx.destination);
  osc1.start(ctx.currentTime);
  osc1.stop(ctx.currentTime + 0.1);

  // Second tone: brighter higher note, slightly delayed — the "bling" top
  osc2.type = "square";
  osc2.frequency.setValueAtTime(1318.5, ctx.currentTime + 0.07); // E6
  gain2.gain.setValueAtTime(0, ctx.currentTime + 0.07);
  gain2.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 0.09);
  gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.28);
  osc2.connect(gain2); gain2.connect(ctx.destination);
  osc2.start(ctx.currentTime + 0.07);
  osc2.stop(ctx.currentTime + 0.3);
}

/** Wrong match — deep woomp drop */
export function playWrong() {
  if(!game.soundEnabled()) return ;
  resume();
  // Layer 1: deep sine that drops fast — the "woomp" body
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(280, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + 0.35);
  gain.gain.setValueAtTime(0.35, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
  osc.connect(gain); gain.connect(ctx.destination);
  osc.start(); osc.stop(ctx.currentTime + 0.5);

  // Layer 2: sub-bass thud punch at the start
  const sub = ctx.createOscillator();
  const subGain = ctx.createGain();
  sub.type = "triangle";
  sub.frequency.setValueAtTime(120, ctx.currentTime);
  sub.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
  subGain.gain.setValueAtTime(0.28, ctx.currentTime);
  subGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
  sub.connect(subGain); subGain.connect(ctx.destination);
  sub.start(); sub.stop(ctx.currentTime + 0.25);
}

/** Triple bonus — sparkly ascending arpeggio */
export function playBonus() {
  if(!game.soundEnabled()) return ;

  resume();
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => tone(freq, "sine", 0.2, 0.01, 0.2, i * 0.09));
}

/** Button click — subtle soft tick */
export function playClick() {
  if(!game.soundEnabled()) return ;
  resume();
  tone(600, "triangle", 0.12, 0.005, 0.07);
}

/** Level complete — triumphant fanfare */
export function playWin() {
  if(!game.soundEnabled()) return ;
  resume();
  const fanfare = [
    [523.25, 0],    // C5
    [523.25, 0.1],
    [523.25, 0.2],
    [415.30, 0.3],  // Ab4
    [466.16, 0.38], // Bb4
    [523.25, 0.5],  // C5
    [415.30, 0.6],  // Ab4
    [466.16, 0.68], // Bb4
    [523.25, 0.8],  // C5
  ];
  fanfare.forEach(([freq, t]) => tone(freq, "sine", 0.22, 0.01, 0.18, t));
}

/** Game over — descending failure tone */
export function playGameOver() {
  if(!game.soundEnabled()) return ;
  resume();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.setValueAtTime(440, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.8);
  gain.gain.setValueAtTime(0.2, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.9);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 1);
}


export function playMusic(firstclick){
  if(firstclick){
  if(!game.musicEnabled()) return
  let traks = ["../audio/music/track1.mp3" ,"../audio/music/track2.mp3" ,"../audio/music/track3.mp3" ] ;
  let currentTrack = 0 ;
  let audio = new Audio(traks[currentTrack]) ;

document.querySelector("header .btn-save").addEventListener("click",function(){
  let setings = JSON.parse(localStorage.getItem("setings")) ;
  if (!setings.music){audio.pause() }else{audio.play()} ;
})
  if(game.musicEnabled()) audio.play() ;
  audio.volume = 0.3 ;
  audio.addEventListener("ended" , function(){
    currentTrack = (currentTrack+ 1) % traks.length ;
    audio.src = traks[currentTrack] ;
  audio.play() ;
  audio.volume = 0.3 ;
  })}
}