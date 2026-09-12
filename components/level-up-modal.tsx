'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { playSfx } from './audio-controller';
import { Award, Sparkles, X } from 'lucide-react';

interface LevelUpModalProps {
  newLevel: number;
  isOpen: boolean;
  onClose: () => void;
}

export function LevelUpModal({ newLevel, isOpen, onClose }: LevelUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      playSfx('levelUp');

      // Trigger multi-angle celebratory confetti
      const end = Date.now() + 1500;
      const colors = ['#f59e0b', '#06b6d4', '#8b5cf6', '#10b981'];

      (function frame() {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      })();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl border-2 border-amber-500/60 bg-gradient-to-b from-slate-900 via-[#131127] to-slate-950 p-6 shadow-2xl text-white text-center relative overflow-hidden animate-in fade-in zoom-in duration-300">
        {/* Glow halo */}
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-slate-400 hover:text-white p-1"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-600 to-yellow-400 p-0.5 shadow-lg shadow-amber-500/20 mb-4 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <Award className="w-8 h-8 text-amber-400 animate-bounce" />
          </div>
        </div>

        <span className="text-[10px] font-mono tracking-widest font-black uppercase text-amber-400 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
          Rank Advancement
        </span>

        <h2 className="text-3xl font-black tracking-tight mt-2 mb-1 text-white">
          LEVEL UP!
        </h2>

        <p className="text-slate-300 text-sm mb-4">
          You have ascended to <strong className="text-amber-300">Level {newLevel} Hunter</strong>!
        </p>

        <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 mb-5 text-left text-xs space-y-1.5 font-mono">
          <div className="flex items-center justify-between text-cyan-300">
            <span>Attributes Surge:</span>
            <span className="font-bold">+1 All Attributes</span>
          </div>
          <div className="flex items-center justify-between text-amber-300">
            <span>Raid Attack Power:</span>
            <span className="font-bold">+5% Boss Damage</span>
          </div>
          <div className="flex items-center justify-between text-purple-300">
            <span>Guild Prestige:</span>
            <span className="font-bold">Next Rank Unlocked</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-1.5"
        >
          <Sparkles className="w-4 h-4" />
          <span>Claim Awakening</span>
        </button>
      </div>
    </div>
  );
}
