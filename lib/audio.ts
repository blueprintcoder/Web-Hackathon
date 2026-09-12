export type SfxType =
  | 'complete'
  | 'attack'
  | 'coin'
  | 'levelup';

export function playSfx(type: SfxType) {
  if (typeof window === 'undefined') return;

  try {
    const AudioContextClass =
      window.AudioContext ||
      (
        window as typeof window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextClass) return;

    const ctx = new AudioContextClass();

    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();

    oscillator.connect(gain);
    gain.connect(ctx.destination);

    const frequencies: Record<SfxType, number> = {
      complete: 660,
      attack: 180,
      coin: 880,
      levelup: 520,
    };

    oscillator.frequency.setValueAtTime(
      frequencies[type],
      ctx.currentTime
    );

    oscillator.type =
      type === 'attack' ? 'sawtooth' : 'sine';

    gain.gain.setValueAtTime(
      0.0001,
      ctx.currentTime
    );

    gain.gain.exponentialRampToValueAtTime(
      0.08,
      ctx.currentTime + 0.01
    );

    gain.gain.exponentialRampToValueAtTime(
      0.0001,
      ctx.currentTime + 0.12
    );

    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.12);
  } catch {
    // Audio errors should never break the application.
  }
}