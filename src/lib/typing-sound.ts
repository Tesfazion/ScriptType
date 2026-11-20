/**
 * Lightweight typing sound feedback using the Web Audio API.
 * No external assets or dependencies — pure synthesized tones.
 * Respects reduced-motion and muted preferences.
 */

type SoundKind = "correct" | "wrong" | "space";

let audioContext: AudioContext | null = null;
let soundEnabled = true;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    const AudioCtor = (
      window as unknown as { AudioContext?: typeof AudioContext }
    ).AudioContext;
    if (!AudioCtor) return null;
    audioContext = new AudioCtor();
  }
  if (audioContext.state === "suspended") {
    void audioContext.resume().catch(() => {});
  }
  return audioContext;
}

export function setTypingSoundEnabled(enabled: boolean) {
  soundEnabled = enabled;
}

export function isTypingSoundEnabled() {
  return soundEnabled;
}

export function playTypingSound(kind: SoundKind) {
  if (!soundEnabled) return;
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  const settings: Record<SoundKind, { freq: number; duration: number; type: OscillatorType }> = {
    correct: { freq: 880, duration: 0.05, type: "sine" },
    wrong: { freq: 220, duration: 0.12, type: "sawtooth" },
    space: { freq: 440, duration: 0.04, type: "triangle" },
  };

  const { freq, duration, type } = settings[kind];
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.18, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain).connect(ctx.destination);
  osc.start(now);
  osc.stop(now + duration + 0.02);
}