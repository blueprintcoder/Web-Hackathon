'use client';

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

export function AudioController() {
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('aetheria_audio_muted');
    if (stored !== null) {
      setMuted(stored === 'true');
    }
  }, []);

  const toggleAudio = () => {
    const next = !muted;
    setMuted(next);
    localStorage.setItem('aetheria_audio_muted', String(next));
  };

  return (
    <button
      onClick={toggleAudio}
      title={muted ? "Unmute sound effects" : "Mute sound effects"}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs transition-colors"
    >
      {muted ? (
        <>
          <VolumeX className="w-4 h-4 text-rose-400" />
          <span className="hidden sm:inline">Sound: Off</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4 text-emerald-400" />
          <span className="hidden sm:inline">Sound: On</span>
        </>
      )}
    </button>
  );
}

// Utility function to play web audio synthesized sounds
export function playSfx(type: 'complete' | 'levelUp' | 'coin' | 'attack') {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem('aetheria_audio_muted') === 'true') return;

  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'complete') {
      // Blade slash / high chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.15); // G5
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (type === 'coin') {
      // Gold coin chime
      osc.type = 'sine';
      osc.frequency.setValueAtTime(987.77, now); // B5
      osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.start(now);
      osc.stop(now + 0.25);
    } else if (type === 'levelUp') {
      // Fanfare sequence
      osc.type = 'square';
      osc.frequency.setValueAtTime(440, now); // A4
      osc.frequency.setValueAtTime(554.37, now + 0.1); // C#5
      osc.frequency.setValueAtTime(659.25, now + 0.2); // E5
      osc.frequency.setValueAtTime(880, now + 0.3); // A5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
      osc.start(now);
      osc.stop(now + 0.6);
    } else if (type === 'attack') {
      // Low punch / boss hit
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(120, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
      osc.start(now);
      osc.stop(now + 0.2);
    }
  } catch (err) {
    // AudioContext blocked by browser policy
  }
}
