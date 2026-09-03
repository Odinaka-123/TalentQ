let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    audioCtx = new Ctx();
  }
  return audioCtx;
}

/**
 * Plays a short two-note chime for incoming notifications. Synthesized via
 * Web Audio rather than an audio file — no asset to host or load.
 * Browsers block audio before any user interaction on the page, so this is
 * a no-op until the user has clicked/tapped something at least once —
 * expected behavior, not a bug.
 */
export function playNotificationSound(): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const now = ctx.currentTime;
  const notes = [
    { freq: 880, start: 0, duration: 0.12 },
    { freq: 1174.66, start: 0.1, duration: 0.18 },
  ];

  notes.forEach(({ freq, start, duration }) => {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(freq, now + start);

    gain.gain.setValueAtTime(0, now + start);
    gain.gain.linearRampToValueAtTime(0.15, now + start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + start + duration);

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    oscillator.start(now + start);
    oscillator.stop(now + start + duration);
  });
}
