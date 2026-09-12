"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Swords, Trophy, Flame } from "lucide-react";
import { playSfx } from "@/lib/audio";

interface DemonCreatureProps {
  isDefeated: boolean;
  showDamage: boolean;
  damageTaken: number;
  hpPercent: number;
  onAttack?: () => void;
}

export function DemonCreature({
  isDefeated,
  showDamage,
  damageTaken,
  hpPercent,
  onAttack,
}: DemonCreatureProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [manualHit, setManualHit] = useState(false);
  const isEnraged = !isDefeated && hpPercent <= 30;

  const handleCreatureClick = () => {
    if (isDefeated) return;
    playSfx("attack");
    playSfx("roar");
    setManualHit(true);
    setTimeout(() => setManualHit(false), 450);
    if (onAttack) {
      onAttack();
    }
  };

  const isTakingDamage = showDamage || manualHit;

  return (
    <div className="relative flex flex-col items-center justify-center py-4 select-none">
      {/* Dynamic Status Pill */}
      <motion.div
        animate={{ y: [0, -3, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="mb-2 z-20"
      >
        {isDefeated ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-lg shadow-emerald-950/50">
            <Trophy className="w-3.5 h-3.5 text-amber-400" />
            Victory Spoils Unlocked
          </span>
        ) : isEnraged ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-rose-600/30 text-rose-200 border border-rose-500/50 shadow-lg shadow-rose-950/60 animate-pulse">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
            Phase 2: Berserk Hellfire Active
          </span>
        ) : isHovered ? (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black tracking-widest uppercase bg-purple-600/20 text-purple-300 border border-purple-500/30 shadow-md">
            <Swords className="w-3.5 h-3.5 text-rose-400" />
            Click Demon to Strike!
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-slate-900/80 text-slate-400 border border-slate-800">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
            Abyssal Entity Chained
          </span>
        )}
      </motion.div>

      {/* Creature Stage */}
      <div
        className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center cursor-pointer group"
        onClick={handleCreatureClick}
        onMouseEnter={() => {
          setIsHovered(true);
          if (!isDefeated) playSfx("roar");
        }}
        onMouseLeave={() => setIsHovered(false)}
        title={isDefeated ? "Boss Defeated" : "Click to attack Malakor the Procrastination Demon"}
      >
        {/* Arcane Magic Glyphs Circle (Background) */}
        <motion.div
          animate={{ rotate: isDefeated ? 0 : 360 }}
          transition={{ duration: isEnraged ? 12 : 28, repeat: Infinity, ease: "linear" }}
          className="absolute inset-2 pointer-events-none opacity-40"
        >
          <svg viewBox="0 0 200 200" className="w-full h-full">
            <circle
              cx="100"
              cy="100"
              r="92"
              fill="none"
              stroke={isDefeated ? "#10b981" : isEnraged ? "#f43f5e" : "#8b5cf6"}
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />
            <circle
              cx="100"
              cy="100"
              r="78"
              fill="none"
              stroke={isDefeated ? "#059669" : isEnraged ? "#e11d48" : "#6366f1"}
              strokeWidth="1"
            />
            {/* Hexagram Runes */}
            <polygon
              points="100,28 162,136 38,136"
              fill="none"
              stroke={isEnraged ? "rgba(244,63,94,0.3)" : "rgba(168,85,247,0.25)"}
              strokeWidth="1"
            />
            <polygon
              points="100,172 162,64 38,64"
              fill="none"
              stroke={isEnraged ? "rgba(244,63,94,0.3)" : "rgba(168,85,247,0.25)"}
              strokeWidth="1"
            />
          </svg>
        </motion.div>

        {/* Ambient Hellfire / Shadow Aura */}
        <motion.div
          animate={
            isDefeated
              ? { scale: 0, opacity: 0 }
              : isEnraged
              ? { scale: [1, 1.25, 1], opacity: [0.35, 0.65, 0.35] }
              : isHovered
              ? { scale: 1.15, opacity: 0.45 }
              : { scale: [1, 1.08, 1], opacity: [0.15, 0.3, 0.15] }
          }
          transition={{ duration: isEnraged ? 1.2 : 3, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute inset-4 rounded-full blur-2xl pointer-events-none ${
            isDefeated
              ? "bg-transparent"
              : isEnraged
              ? "bg-gradient-to-tr from-rose-600 via-red-500 to-amber-500"
              : "bg-gradient-to-tr from-purple-700 via-rose-700 to-indigo-900"
          }`}
        />

        {/* Floating Chains on Sides */}
        {!isDefeated && (
          <>
            <motion.div
              animate={{ rotate: [-3, 3, -3], y: [0, 4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 z-10"
            >
              <svg width="36" height="120" viewBox="0 0 36 120" fill="none">
                <ellipse cx="18" cy="18" rx="8" ry="14" stroke="#64748b" strokeWidth="3" />
                <ellipse cx="18" cy="46" rx="8" ry="14" stroke="#94a3b8" strokeWidth="3" />
                <ellipse cx="18" cy="74" rx="8" ry="14" stroke="#64748b" strokeWidth="3" />
                <ellipse cx="18" cy="102" rx="8" ry="14" stroke="#475569" strokeWidth="3" />
              </svg>
            </motion.div>
            <motion.div
              animate={{ rotate: [3, -3, 3], y: [0, -4, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50 z-10"
            >
              <svg width="36" height="120" viewBox="0 0 36 120" fill="none">
                <ellipse cx="18" cy="18" rx="8" ry="14" stroke="#64748b" strokeWidth="3" />
                <ellipse cx="18" cy="46" rx="8" ry="14" stroke="#94a3b8" strokeWidth="3" />
                <ellipse cx="18" cy="74" rx="8" ry="14" stroke="#64748b" strokeWidth="3" />
                <ellipse cx="18" cy="102" rx="8" ry="14" stroke="#475569" strokeWidth="3" />
              </svg>
            </motion.div>
          </>
        )}

        {/* Defeated Treasure Chest or Living Demon */}
        <AnimatePresence mode="wait">
          {isDefeated ? (
            /* ================= VICTORY SPOILS CHEST ================= */
            <motion.div
              key="victory-chest"
              initial={{ scale: 0, rotate: -20, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              transition={{ type: "spring", stiffness: 260, damping: 18 }}
              className="relative z-10 flex flex-col items-center justify-center text-center"
            >
              {/* Spinning Light Beams */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-10 pointer-events-none opacity-40"
              >
                <div className="w-full h-full bg-[conic-gradient(from_0deg,transparent_0_30deg,rgba(250,204,21,0.2)_40deg,transparent_60deg_90deg,rgba(250,204,21,0.2)_100deg,transparent_120deg_180deg,rgba(250,204,21,0.2)_190deg,transparent_210deg_270deg,rgba(250,204,21,0.2)_280deg,transparent_300deg)] rounded-full" />
              </motion.div>

              {/* Golden Chest SVG */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <svg width="140" height="130" viewBox="0 0 140 130" fill="none">
                  {/* Chest Body */}
                  <rect x="25" y="55" width="90" height="60" rx="8" fill="#78350f" stroke="#f59e0b" strokeWidth="4" />
                  <rect x="35" y="65" width="70" height="40" rx="4" fill="#451a03" />
                  {/* Gold Bands */}
                  <rect x="42" y="55" width="12" height="60" fill="#d97706" />
                  <rect x="86" y="55" width="12" height="60" fill="#d97706" />
                  {/* Open Lid */}
                  <path d="M 20 55 C 20 25 120 25 120 55 Z" fill="#92400e" stroke="#fbbf24" strokeWidth="4" />
                  {/* Golden Glowing Core */}
                  <ellipse cx="70" cy="55" rx="36" ry="12" fill="#fef08a" filter="drop-shadow(0 0 16px #facc15)" />
                  {/* Demon Slayer Crest Gem */}
                  <circle cx="70" cy="78" r="9" fill="#9333ea" stroke="#fbbf24" strokeWidth="3" />
                  <polygon points="70,72 74,78 70,84 66,78" fill="#facc15" />
                </svg>
              </motion.div>

              <div className="mt-2 text-center">
                <span className="text-xs font-black tracking-widest text-amber-300 uppercase block">
                  Demon Vanquished!
                </span>
                <span className="text-[10px] text-emerald-400 font-mono">
                  +250 Gold &bull; Demon Slayer Title
                </span>
              </div>
            </motion.div>
          ) : (
            /* ================= THE LIVING DEMON CREATURE ================= */
            <motion.div
              key="living-demon"
              animate={
                isTakingDamage
                  ? {
                      scale: [1, 0.88, 1.08, 0.95, 1],
                      x: [0, -16, 16, -10, 8, -4, 0],
                      y: [0, 8, -6, 4, 0],
                      filter: [
                        "brightness(1) drop-shadow(0 0 10px rgba(244,63,94,0.4))",
                        "brightness(2.2) drop-shadow(0 0 35px #f43f5e)",
                        "brightness(1) drop-shadow(0 0 15px rgba(244,63,94,0.6))",
                      ],
                    }
                  : isEnraged
                  ? {
                      y: [0, -10, 0],
                      scale: [1, 1.05, 1],
                      filter: [
                        "drop-shadow(0 0 15px rgba(225,29,72,0.6))",
                        "drop-shadow(0 0 28px rgba(244,63,94,0.9))",
                        "drop-shadow(0 0 15px rgba(225,29,72,0.6))",
                      ],
                    }
                  : {
                      y: [0, -8, 0],
                      scale: isHovered ? 1.06 : [1, 1.02, 1],
                      filter: isHovered
                        ? "drop-shadow(0 0 22px rgba(168,85,247,0.7))"
                        : "drop-shadow(0 0 12px rgba(139,92,246,0.4))",
                    }
              }
              transition={
                isTakingDamage
                  ? { duration: 0.45, ease: "easeOut" }
                  : {
                      duration: isEnraged ? 1.4 : 3.5,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }
              }
              className="relative z-10 w-full h-full flex items-center justify-center"
            >
              <svg viewBox="0 0 240 240" className="w-56 h-56 sm:w-64 sm:h-64 overflow-visible">
                <defs>
                  {/* Horn Gradients */}
                  <linearGradient id="hornGradLeft" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#0f0717" />
                    <stop offset="60%" stopColor="#4c0519" />
                    <stop offset="100%" stopColor={isEnraged ? "#f43f5e" : "#8b5cf6"} />
                  </linearGradient>
                  <linearGradient id="hornGradRight" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#0f0717" />
                    <stop offset="60%" stopColor="#4c0519" />
                    <stop offset="100%" stopColor={isEnraged ? "#f43f5e" : "#8b5cf6"} />
                  </linearGradient>

                  {/* Demon Wing Gradient */}
                  <linearGradient id="wingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#1e102d" />
                    <stop offset="50%" stopColor="#0a0510" />
                    <stop offset="100%" stopColor={isEnraged ? "#881337" : "#2e1065"} />
                  </linearGradient>

                  {/* Eye Glow Filter */}
                  <filter id="eyeGlow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="4" />
                    <feMerge>
                      <feMergeNode />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                {/* Left Demon Wing */}
                <motion.path
                  animate={{
                    rotate: isEnraged ? [-3, 8, -3] : [-2, 5, -2],
                    transformOrigin: "65px 125px",
                  }}
                  transition={{ duration: isEnraged ? 1.4 : 3, repeat: Infinity, ease: "easeInOut" }}
                  d="M 65 125 C 25 105 -5 65 5 25 C 18 55 35 75 48 85 C 38 65 42 45 60 40 C 65 65 65 95 65 125 Z"
                  fill="url(#wingGrad)"
                  stroke={isEnraged ? "#f43f5e" : "#7c3aed"}
                  strokeWidth="1.5"
                  opacity="0.85"
                />

                {/* Right Demon Wing */}
                <motion.path
                  animate={{
                    rotate: isEnraged ? [3, -8, 3] : [2, -5, 2],
                    transformOrigin: "175px 125px",
                  }}
                  transition={{ duration: isEnraged ? 1.4 : 3, repeat: Infinity, ease: "easeInOut" }}
                  d="M 175 125 C 215 105 245 65 235 25 C 222 55 205 75 192 85 C 202 65 198 45 180 40 C 175 65 175 95 175 125 Z"
                  fill="url(#wingGrad)"
                  stroke={isEnraged ? "#f43f5e" : "#7c3aed"}
                  strokeWidth="1.5"
                  opacity="0.85"
                />

                {/* Left Horn */}
                <motion.path
                  animate={{ rotate: isTakingDamage ? [-4, 6, 0] : [0, -2, 0], transformOrigin: "85px 95px" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  d="M 85 95 C 65 70 30 50 15 15 C 38 32 62 60 88 80 Z"
                  fill="url(#hornGradLeft)"
                  stroke={isEnraged ? "#fb7185" : "#a855f7"}
                  strokeWidth="2"
                />

                {/* Right Horn */}
                <motion.path
                  animate={{ rotate: isTakingDamage ? [4, -6, 0] : [0, 2, 0], transformOrigin: "155px 95px" }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  d="M 155 95 C 175 70 210 50 225 15 C 202 32 178 60 152 80 Z"
                  fill="url(#hornGradRight)"
                  stroke={isEnraged ? "#fb7185" : "#a855f7"}
                  strokeWidth="2"
                />

                {/* Demon Body & Shoulder Armor */}
                <path
                  d="M 70 150 L 50 170 L 60 195 L 120 220 L 180 195 L 190 170 L 170 150 L 120 165 Z"
                  fill="#0c0714"
                  stroke={isEnraged ? "#e11d48" : "#4c1d95"}
                  strokeWidth="2.5"
                />

                {/* Magma Heart Core (Breathing in Chest) */}
                <motion.circle
                  cx="120"
                  cy="188"
                  r={isEnraged ? "14" : "10"}
                  animate={{
                    scale: isEnraged ? [1, 1.35, 1] : [1, 1.15, 1],
                    opacity: [0.7, 1, 0.7],
                  }}
                  transition={{ duration: isEnraged ? 0.7 : 1.8, repeat: Infinity, ease: "easeInOut" }}
                  fill={isEnraged ? "#ef4444" : "#a855f7"}
                  filter="url(#eyeGlow)"
                />

                {/* Demon Face Mask / Skull Visage */}
                <path
                  d="M 82 85 C 80 125 90 155 120 162 C 150 155 160 125 158 85 C 145 92 133 90 120 85 C 107 90 95 92 82 85 Z"
                  fill="#150b24"
                  stroke={isEnraged ? "#f43f5e" : "#8b5cf6"}
                  strokeWidth="2"
                />

                {/* Forehead Runic Crest */}
                <polygon
                  points="120,92 125,102 120,112 115,102"
                  fill={isEnraged ? "#facc15" : "#c084fc"}
                  filter="url(#eyeGlow)"
                />

                {/* Piercing Demon Eyes */}
                {/* Left Eye */}
                <motion.g
                  animate={{
                    scale: isTakingDamage ? 1.4 : isHovered ? 1.25 : [1, 1.1, 1],
                    transformOrigin: "102px 118px",
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <polygon
                    points="90,116 112,112 110,122 92,122"
                    fill={isEnraged ? "#facc15" : "#f43f5e"}
                    filter="url(#eyeGlow)"
                  />
                  {/* Slit Pupil */}
                  <line x1="102" y1="114" x2="102" y2="122" stroke="#450a0a" strokeWidth="2.5" />
                </motion.g>

                {/* Right Eye */}
                <motion.g
                  animate={{
                    scale: isTakingDamage ? 1.4 : isHovered ? 1.25 : [1, 1.1, 1],
                    transformOrigin: "138px 118px",
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <polygon
                    points="150,116 128,112 130,122 148,122"
                    fill={isEnraged ? "#facc15" : "#f43f5e"}
                    filter="url(#eyeGlow)"
                  />
                  {/* Slit Pupil */}
                  <line x1="138" y1="114" x2="138" y2="122" stroke="#450a0a" strokeWidth="2.5" />
                </motion.g>

                {/* Fanged Mouth */}
                <path
                  d="M 104 138 Q 120 148 136 138 Q 120 144 104 138 Z"
                  fill="#030005"
                  stroke={isEnraged ? "#ef4444" : "#7c3aed"}
                  strokeWidth="1.5"
                />
                {/* Upper Fangs */}
                <polygon points="109,138 112,144 114,138" fill="#f8fafc" />
                <polygon points="126,138 128,144 131,138" fill="#f8fafc" />
              </svg>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Floating Combat Damage Numbers */}
        <AnimatePresence>
          {isTakingDamage && !isDefeated && (
            <motion.div
              initial={{ opacity: 0, y: 0, scale: 0.6, rotate: -8 }}
              animate={{ opacity: [0, 1, 1, 0], y: -70, scale: [0.6, 1.4, 1.1], rotate: [0, 6, -3] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.85, ease: "easeOut" }}
              className="pointer-events-none absolute z-40 text-center font-mono font-black"
            >
              <div className="text-3xl sm:text-4xl text-rose-400 drop-shadow-[0_0_18px_rgba(244,63,94,0.9)] flex items-center gap-1 justify-center">
                <span>💥 -{damageTaken || 75}</span>
              </div>
              <span className="text-[10px] tracking-widest text-amber-300 uppercase bg-black/60 px-2 py-0.5 rounded-md border border-amber-400/40">
                Critical Strike!
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
