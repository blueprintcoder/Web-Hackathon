'use client';

import React from 'react';
import { BossRaid } from '@/types/game';
import { Skull, Shield, Swords, Clock, Award } from 'lucide-react';

interface BossRaidProps {
  boss: BossRaid;
  onAttackBoss?: () => void;
}

export function BossRaidCard({ boss }: BossRaidProps) {
  const hpPercent = Math.max(0, Math.min(100, Math.round((boss.currentHp / boss.maxHp) * 100)));

  return (
    <div className="rounded-xl border border-rose-900/40 bg-gradient-to-br from-slate-950 via-[#1a0c14] to-slate-950 p-4 shadow-xl text-white relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-rose-600/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-lg bg-rose-950/80 border border-rose-700/50 flex items-center justify-center text-rose-400">
            <Skull className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-rose-500/20 text-rose-400 border border-rose-500/30">
                Weekly Dungeon Boss
              </span>
              <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3 text-slate-500" />
                Resets: {boss.deadline}
              </span>
            </div>
            <h3 className="text-base font-black text-white mt-0.5">{boss.name}</h3>
            <p className="text-xs text-rose-300/70 italic">{boss.title}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-400 block font-mono">Boss HP</span>
          <span className="text-sm font-black text-rose-400 font-mono">
            {boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Boss Health Bar */}
      <div className="mb-3">
        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-rose-950 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${hpPercent}%` }}
          />
        </div>
        <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1 font-mono">
          <span>Damage is dealt automatically upon completing any quest.</span>
          <span>{hpPercent}% HP remaining</span>
        </div>
      </div>

      {/* Reward Bounty */}
      <div className="flex items-center justify-between pt-2 border-t border-rose-950/60 text-xs">
        <div className="flex items-center gap-1.5 text-amber-300">
          <Award className="w-4 h-4 text-amber-400" />
          <span className="font-bold">Victory Spoils:</span>
          <span className="font-mono">+{boss.rewardGold} Gold & Title "{boss.rewardTitle}"</span>
        </div>
        <div className="flex items-center gap-1 text-slate-400 text-[11px]">
          <Swords className="w-3.5 h-3.5 text-rose-400" />
          <span>Active Raid</span>
        </div>
      </div>
    </div>
  );
}
