"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Heart } from "lucide-react";
import { playSfx } from "@/lib/audio";

interface ShadowFamiliarProps {
  level: number;
}

export function ShadowFamiliar({ level }: ShadowFamiliarProps) {
  const [isHappy, setIsHappy] = useState(false);
  const [petCount, setPetCount] = useState(0);

  const handlePet = () => {
    playSfx("familiar");
    setIsHappy(true);
    setPetCount((prev) => prev + 1);
    setTimeout(() => setIsHappy(false), 800);
  };

  return (
    <div
      onClick={handlePet}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-2xl border border-cyan-500/20 bg-cyan-950/20 hover:bg-cyan-900/30 transition-all cursor-pointer select-none group shadow-md shadow-cyan-950/30"
      title={`Kage (Shadow Drake Familiar) • Level ${level} • Click to pet!`}
    >
      {/* Ambient Familiar Aura */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.45, 0.2] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        className="absolute inset-0 rounded-2xl bg-cyan-500/10 blur-md pointer-events-none"
      />

      {/* Mini Animated Shadow Drake Creature */}
      <motion.div
        animate={
          isHappy
            ? {
                rotate: [0, 360],
                y: [0, -12, 0],
                scale: [1, 1.25, 1],
              }
            : {
                y: [0, -4, 0],
              }
        }
        transition={
          isHappy
            ? { duration: 0.65, ease: "easeInOut" }
            : { duration: 2.2, repeat: Infinity, ease: "easeInOut" }
        }
        className="relative w-9 h-9 flex items-center justify-center shrink-0"
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="familiarBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="60%" stopColor="#0f172a" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <filter id="cyanGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Left Wing */}
          <motion.path
            animate={{
              rotate: isHappy ? [-25, 35, -25] : [-12, 18, -12],
              transformOrigin: "42px 48px",
            }}
            transition={{ duration: isHappy ? 0.3 : 1.4, repeat: Infinity, ease: "easeInOut" }}
            d="M 42 48 C 22 32 10 18 6 8 C 16 22 28 36 42 42 Z"
            fill="#38bdf8"
            opacity="0.8"
          />

          {/* Right Wing */}
          <motion.path
            animate={{
              rotate: isHappy ? [25, -35, 25] : [12, -18, 12],
              transformOrigin: "58px 48px",
            }}
            transition={{ duration: isHappy ? 0.3 : 1.4, repeat: Infinity, ease: "easeInOut" }}
            d="M 58 48 C 78 32 90 18 94 8 C 84 22 72 36 58 42 Z"
            fill="#38bdf8"
            opacity="0.8"
          />

          {/* Drake Tail */}
          <motion.path
            animate={{
              rotate: [-10, 14, -10],
              transformOrigin: "50px 72px",
            }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            d="M 50 72 Q 40 86 52 94 Q 46 84 50 72 Z"
            fill="#0284c7"
          />

          {/* Drake Body */}
          <ellipse cx="50" cy="56" rx="16" ry="18" fill="url(#familiarBodyGrad)" stroke="#0ea5e9" strokeWidth="1.5" />

          {/* Drake Head */}
          <circle cx="50" cy="40" r="14" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Tiny Horns */}
          <polygon points="40,32 35,18 45,28" fill="#38bdf8" />
          <polygon points="60,32 65,18 55,28" fill="#38bdf8" />

          {/* Glowing Eyes */}
          <ellipse
            cx="44"
            cy="39"
            rx="3.5"
            ry={isHappy ? "1" : "4"}
            fill="#38bdf8"
            filter="url(#cyanGlow)"
          />
          <ellipse
            cx="56"
            cy="39"
            rx="3.5"
            ry={isHappy ? "1" : "4"}
            fill="#38bdf8"
            filter="url(#cyanGlow)"
          />
        </svg>
      </motion.div>

      {/* Companion Stats & Details */}
      <div className="flex flex-col min-w-0 pr-1">
        <div className="flex items-center gap-1">
          <span className="text-[11px] font-black text-cyan-300 tracking-wide flex items-center gap-0.5">
            Kage
            <Sparkles className="w-2.5 h-2.5 text-cyan-400 group-hover:animate-spin" />
          </span>
          <span className="text-[9px] font-mono px-1 rounded bg-cyan-500/20 text-cyan-200 border border-cyan-500/30">
            Familiar Lvl {level}
          </span>
        </div>
        <p className="text-[9px] text-slate-400 truncate group-hover:text-cyan-200 transition-colors">
          {isHappy ? "✨ +Mana Resonance!" : "Tap to pet familiar"}
        </p>
      </div>

      {/* Floating Heart / Sparkle Burst on Pet */}
      <AnimatePresence>
        {isHappy && (
          <motion.div
            initial={{ opacity: 0, y: 0, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], y: -28, scale: [0.5, 1.2, 0.8] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="absolute -top-3 left-6 pointer-events-none flex items-center gap-1 text-cyan-300 font-bold text-[10px]"
          >
            <Heart className="w-3.5 h-3.5 fill-cyan-400 text-cyan-300 animate-bounce" />
            <span className="font-mono text-[9px]">Loyalty +1</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
