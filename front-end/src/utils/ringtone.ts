/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Tiny Web Audio helper for in-call sounds:
 *  - two-tone WhatsApp-style ringtone (incoming/outgoing)
 *  - short descending "call ended" beep
 *
 * Note: browsers require a user gesture before AudioContext can
 * produce sound. For outgoing calls the ringtone is started from a
 * click handler (allowed). For incoming calls it is best-effort —
 * some browsers suspend it until the user interacts with the page.
 */

let audioCtx: AudioContext | null = null;
let ringOscillator: OscillatorNode | null = null;
let ringGain: GainNode | null = null;
let ringInterval: ReturnType<typeof setInterval> | null = null;

const ensureAudioCtx = (): AudioContext | null => {
  try {
    if (!audioCtx) {
      const Ctor =
        window.AudioContext ||
        (window as any).webkitAudioContext ||
        (window as any).webkitAudioContext?.prototype?.constructor;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }
    return audioCtx;
  } catch {
    return null;
  }
};

export function startRingtone() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  try {
    stopRingtone();
    ringGain = ctx.createGain();
    ringGain.gain.value = 0.045;
    ringGain.connect(ctx.destination);

    ringOscillator = ctx.createOscillator();
    ringOscillator.type = "sine";
    ringOscillator.frequency.value = 425;
    ringOscillator.connect(ringGain);
    ringOscillator.start();

    let high = false;
    ringInterval = setInterval(() => {
      if (!ringOscillator) return;
      high = !high;
      ringOscillator.frequency.setValueAtTime(high ? 550 : 425, ctx.currentTime);
    }, 550);
  } catch {
    stopRingtone();
  }
}

export function stopRingtone() {
  if (ringInterval) {
    clearInterval(ringInterval);
    ringInterval = null;
  }
  try {
    if (ringOscillator) {
      ringOscillator.stop();
      ringOscillator.disconnect();
      ringOscillator = null;
    }
    if (ringGain) {
      ringGain.disconnect();
      ringGain = null;
    }
  } catch {
    ringOscillator = null;
    ringGain = null;
  }
}

/** Short beep for "call ended / rejected / missed". */
export function playCallEndedBeep() {
  const ctx = ensureAudioCtx();
  if (!ctx) return;
  try {
    const now = ctx.currentTime;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.9);
    gain.connect(ctx.destination);

    const notes = [523.25, 392, 329.63]; // C5, G4, E4
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      osc.type = "sine";
      osc.frequency.value = freq;
      const start = now + index * 0.18;
      osc.connect(gain);
      osc.start(start);
      osc.stop(start + 0.2);
      void osc; // keep ref till stop
    });
  } catch {
    // non-fatal
  }
}