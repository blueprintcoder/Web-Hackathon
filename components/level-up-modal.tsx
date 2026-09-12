"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { playSfx } from "@/lib/audio";
import { Award, Sparkles, X } from "lucide-react";

interface LevelUpModalProps {
  newLevel: number;
  isOpen: boolean;
  onClose: () => void;
}

export function LevelUpModal({ newLevel, isOpen, onClose }: LevelUpModalProps) {
  useEffect(() => {
    if (isOpen) {
      playSfx("levelup");

      // Celebratory confetti
      const end = Date.now() + 1500;
      const colors = ["#58cc02", "#1cb0f6", "#ffc800", "#ff4b4b", "#af52de"];

      (function frame() {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors,
        });
        confetti({
          particleCount: 5,
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
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm rounded-3xl border-2 border-amber-300 bg-white p-6 shadow-2xl text-center relative overflow-hidden animate-in fade-in zoom-in duration-200">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Big Golden Trophy Emblem */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 mb-3 flex items-center justify-center shadow-sm">
          <Award className="w-10 h-10 text-amber-600 animate-bounce" />
        </div>

        <span className="text-[10px] tracking-widest font-black uppercase text-amber-800 px-3 py-1 rounded-full bg-amber-100 border border-amber-300">
          Rank Advancement
        </span>

        <h2 className="text-2xl font-black tracking-tight mt-2 text-slate-900">
          LEVEL UP!
        </h2>

        <p className="text-slate-600 font-bold text-sm mb-4">
          You have ascended to <strong className="text-amber-700">Level {newLevel} Hunter</strong>!
        </p>

        {/* Buff Breakdown */}
        <div className="rounded-2xl border-2 border-slate-100 bg-slate-50 p-3 mb-5 text-left text-xs space-y-1.5 font-bold">
          <div className="flex items-center justify-between text-sky-700">
            <span>Attributes Surge:</span>
            <span>+1 All Attributes</span>
          </div>
          <div className="flex items-center justify-between text-rose-700">
            <span>Boss Strike Power:</span>
            <span>+15 Boss Damage</span>
          </div>
          <div className="flex items-center justify-between text-purple-700">
            <span>Guild Feats:</span>
            <span>Higher Tier Feats Unlocked</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="btn-duo-amber w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
        >
          <Sparkles className="w-4 h-4" />
          <span>Claim Awakening</span>
        </button>
      </div>
    </div>
  );
}
