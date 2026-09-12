"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Crown,
  Flame,
  Heart,
  Skull,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";

import type { BossRaid } from "@/types/game";
import { DemonCreature } from "./demon-creature";

interface BossRaidProps {
  boss: BossRaid;
  onAttackBoss?: () => void;
}

export function BossRaidCard({ boss, onAttackBoss }: BossRaidProps) {
  const [showDamage, setShowDamage] = useState(false);
  const [previousHp, setPreviousHp] = useState(boss.currentHp);
  const [damageTaken, setDamageTaken] = useState(0);

  const hpPercent =
    boss.maxHp > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((boss.currentHp / boss.maxHp) * 100))
        )
      : 0;

  const isDefeated = boss.defeated || boss.currentHp <= 0;

  useEffect(() => {
    if (boss.currentHp < previousHp) {
      const dmg = previousHp - boss.currentHp;
      setDamageTaken(dmg);
      setShowDamage(true);
      const timer = setTimeout(() => setShowDamage(false), 900);
      setPreviousHp(boss.currentHp);
      return () => clearTimeout(timer);
    }
    setPreviousHp(boss.currentHp);
  }, [boss.currentHp, previousHp]);

  const hpLabel = useMemo(() => {
    if (isDefeated) return "DEFEATED";
    if (hpPercent <= 20) return "CRITICAL";
    if (hpPercent <= 50) return "WOUNDED";
    return "ACTIVE";
  }, [hpPercent, isDefeated]);

  return (
    <div className="card-duo-light p-6 sm:p-8 bg-white relative overflow-hidden">
      {/* Top Raid Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-100 pb-5">
        <div className="flex items-center gap-3.5">
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-2xl ${
              isDefeated
                ? "bg-emerald-100 text-emerald-600"
                : "bg-rose-100 text-rose-600"
            }`}
          >
            {isDefeated ? (
              <Trophy className="h-6 w-6" />
            ) : (
              <Skull className="h-6 w-6" />
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-rose-600">
                Weekly Guild Dungeon Raid
              </span>
              <span
                className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                  isDefeated
                    ? "bg-emerald-100 text-emerald-800"
                    : hpPercent <= 20
                    ? "bg-rose-500 text-white animate-pulse"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {hpLabel}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5">
              {boss.name}
            </h2>
            <p className="text-xs font-bold text-slate-600 italic">
              &ldquo;{boss.title}&rdquo;
            </p>
          </div>
        </div>

        {/* Reset Countdown */}
        <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-50 border-2 border-slate-200">
          <Clock className="w-4 h-4 text-slate-600" />
          <div className="text-right">
            <span className="block text-[9px] font-black uppercase tracking-wider text-slate-600">
              Raid Reset
            </span>
            <span className="font-mono text-xs font-black text-slate-800">
              {boss.deadline}
            </span>
          </div>
        </div>
      </div>

      {/* Center Arena: Animated Demon Creature */}
      <div className="my-6 rounded-3xl bg-slate-50/80 border-2 border-slate-100 p-4 sm:p-6 flex flex-col items-center justify-center relative">
        <DemonCreature
          isDefeated={isDefeated}
          showDamage={showDamage}
          damageTaken={damageTaken}
          hpPercent={hpPercent}
          onAttack={onAttackBoss}
        />
      </div>

      {/* Health Bar Section */}
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs font-black">
          <span className="flex items-center gap-1.5 text-slate-700">
            <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
            Boss Health Pool
          </span>
          <span className="font-mono font-black text-rose-600">
            {boss.currentHp.toLocaleString()} / {boss.maxHp.toLocaleString()} HP ({hpPercent}%)
          </span>
        </div>

        {/* Glossy Juicy Red Health Bar */}
        <div className="h-5 w-full bg-slate-100 rounded-full border-2 border-slate-200 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${hpPercent}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className={`h-full bar-juicy rounded-full ${
              isDefeated ? "bg-emerald-500" : "bg-[#ff4b4b]"
            }`}
          />
        </div>
      </div>

      {/* Attack Action Bar */}
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
        {!isDefeated ? (
          <button
            type="button"
            onClick={onAttackBoss}
            className="btn-duo-red w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm"
          >
            <Swords className="w-5 h-5" />
            Strike Malakor Now
          </button>
        ) : (
          <div className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-emerald-100 border-2 border-emerald-300 text-emerald-800 font-black text-xs uppercase tracking-wider flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-500" />
            Demon Vanquished! Weekly Spoils Claimed!
          </div>
        )}

        <p className="text-xs font-medium text-slate-600 text-center sm:text-left">
          💡 Pro-tip: Completing your real-world daily quests automatically channels damage directly to Malakor!
        </p>
      </div>
    </div>
  );
}