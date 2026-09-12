'use client';

import React from 'react';
import { Character, SolitudeStatus } from '@/types/game';
import { Flame, Coins, ShieldAlert, Sparkles } from 'lucide-react';

interface CharacterCardProps {
  character: Character;
  solitude: SolitudeStatus;
  onSoulSacrifice?: () => void;
}

export function CharacterCard({ character, solitude, onSoulSacrifice }: CharacterCardProps) {
  const xpPercentage = Math.min(
    100,
    Math.round((character.currentXp / character.requiredXp) * 100)
  );

  return (
    <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900 via-[#0E1526] to-slate-950 p-5 shadow-xl text-white relative overflow-hidden">
      {/* Glow background accent */}
      <div className="absolute -top-24 -right-24 w-60 h-60 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
              Rank Hunter
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {character.name}</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-white flex items-center gap-2">
            {character.title}
          </h1>
        </div>

        {/* Stats Pills: Level, Gold, Streak */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/80">
            <span className="text-xs text-slate-400 font-bold uppercase">Level</span>
            <span className="text-lg font-black text-amber-400 font-mono">{character.level}</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
            <Coins className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-black text-amber-300 font-mono">{character.gold} Gold</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30">
            <Flame className="w-4 h-4 text-rose-500 animate-pulse" />
            <span className="text-sm font-black text-rose-400 font-mono">{character.streakCount}d Streak</span>
          </div>
        </div>
      </div>

      {/* Level XP Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between items-center text-xs mb-1.5 font-mono">
          <span className="text-slate-400">
            XP Progression ({xpPercentage}%)
          </span>
          <span className="text-slate-300">
            <strong className="text-cyan-400">{character.currentXp}</strong> / {character.requiredXp} XP
          </span>
        </div>
        <div className="w-full bg-slate-950 rounded-full h-2.5 overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-indigo-500 to-purple-500 transition-all duration-700 ease-out"
            style={{ width: `${xpPercentage}%` }}
          />
        </div>
      </div>

      {/* Badges & Section 9 Innovations Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-800/80 text-xs">
        <div className="flex items-center gap-2">
          {solitude.isActive ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              {solitude.label}
            </span>
          ) : (
            <span className="text-[11px] text-slate-400 font-mono">
              {solitude.label}
            </span>
          )}
        </div>

        {/* Section 9.1 Soul Sacrifice Button */}
        {onSoulSacrifice && (
          <button
            onClick={onSoulSacrifice}
            className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 text-[11px] font-bold transition-all"
            title="Sacrifice 1 Character Level to instantly reclaim a broken streak (Max 2/mo)"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            <span>Soul Sacrifice Streak Lifeline</span>
          </button>
        )}
      </div>
    </div>
  );
}
