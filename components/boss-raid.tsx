"use client";

import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  CheckCircle2,
  Clock,
  Coins,
  Crown,
  Heart,
  Skull,
  Sparkles,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";

import type { BossRaid } from "@/types/game";

interface BossRaidProps {
  boss: BossRaid;
  onAttackBoss?: () => void;
}

export function BossRaidCard({ boss }: BossRaidProps) {
  const [showDamage, setShowDamage] = useState(false);
  const [previousHp, setPreviousHp] = useState(boss.currentHp);
  const [damageTaken, setDamageTaken] = useState(0);

  const hpPercent =
    boss.maxHp > 0
      ? Math.max(
          0,
          Math.min(
            100,
            Math.round((boss.currentHp / boss.maxHp) * 100)
          )
        )
      : 0;

  const isDefeated = boss.defeated || boss.currentHp <= 0;

  /*
   * Detect HP changes coming from page.tsx.
   *
   * This means completing a quest can automatically trigger
   * the visual boss reaction without needing a second button.
   */
  useEffect(() => {
    if (boss.currentHp < previousHp) {
      const damage = previousHp - boss.currentHp;

      setDamageTaken(damage);
      setShowDamage(true);

      const timer = window.setTimeout(() => {
        setShowDamage(false);
      }, 1000);

      setPreviousHp(boss.currentHp);

      return () => {
        window.clearTimeout(timer);
      };
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
    <motion.section
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
        delay: 0.15,
      }}
      className={`relative overflow-hidden rounded-3xl border bg-[#111827]/90 p-4 shadow-2xl backdrop-blur-xl sm:p-5 lg:p-6 ${
        isDefeated
          ? "border-emerald-500/20 shadow-emerald-950/20"
          : "border-rose-500/15 shadow-black/30"
      }`}
    >
      {/* Ambient background */}
      <div
        className={`pointer-events-none absolute -right-32 -top-32 h-80 w-80 rounded-full blur-3xl ${
          isDefeated
            ? "bg-emerald-500/10"
            : "bg-rose-600/10"
        }`}
      />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-violet-600/5 blur-3xl" />

      {/* Decorative scan lines */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.025]">
        <div
          className="h-full w-full"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "100% 5px",
          }}
        />
      </div>

      {/* Header */}
      <div className="relative flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-3">
          {/* Boss icon */}
          <motion.div
            animate={
              isDefeated
                ? {}
                : {
                    boxShadow: [
                      "0 0 0 rgba(244,63,94,0)",
                      "0 0 28px rgba(244,63,94,0.18)",
                      "0 0 0 rgba(244,63,94,0)",
                    ],
                  }
            }
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className={`relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
              isDefeated
                ? "border-emerald-400/20 bg-emerald-500/10"
                : "border-rose-500/25 bg-rose-500/10"
            }`}
          >
            <motion.div
              animate={
                showDamage
                  ? {
                      scale: [1, 1.25, 0.9, 1],
                      rotate: [0, -8, 8, -4, 0],
                    }
                  : {}
              }
              transition={{
                duration: 0.45,
              }}
            >
              {isDefeated ? (
                <Trophy className="h-7 w-7 text-emerald-300" />
              ) : (
                <Skull className="h-7 w-7 text-rose-400" />
              )}
            </motion.div>

            {/* Boss ring */}
            {!isDefeated && (
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 12,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-1 rounded-xl border border-dashed border-rose-400/10"
              />
            )}
          </motion.div>

          <div className="min-w-0">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span
                className={`rounded-md border px-2 py-0.5 text-[9px] font-black uppercase tracking-[0.16em] ${
                  isDefeated
                    ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                    : "border-rose-500/20 bg-rose-500/5 text-rose-300"
                }`}
              >
                Weekly Dungeon Boss
              </span>

              <span
                className={`rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                  isDefeated
                    ? "bg-emerald-500/10 text-emerald-300"
                    : hpPercent <= 20
                      ? "bg-rose-500/10 text-rose-300"
                      : "bg-slate-800 text-slate-500"
                }`}
              >
                {hpLabel}
              </span>
            </div>

            <h3 className="truncate text-lg font-black tracking-tight text-white sm:text-xl">
              {boss.name}
            </h3>

            <p className="mt-0.5 text-xs italic text-rose-300/70">
              {boss.title}
            </p>
          </div>
        </div>

        {/* Reset */}
        <div className="flex items-center gap-2 self-start rounded-xl border border-slate-800 bg-black/20 px-3 py-2">
          <Clock className="h-4 w-4 text-slate-500" />

          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Raid Reset
            </p>

            <p className="font-mono text-[10px] font-semibold text-slate-400">
              {boss.deadline}
            </p>
          </div>
        </div>
      </div>

      {/* Boss battlefield */}
      <motion.div
        animate={
          showDamage
            ? {
                x: [0, -7, 7, -5, 5, 0],
              }
            : {}
        }
        transition={{
          duration: 0.45,
        }}
        className="relative mt-6 overflow-hidden rounded-2xl border border-rose-500/10 bg-black/25 p-4 sm:p-5"
      >
        {/* Damage number */}
        <AnimatePresence>
          {showDamage && !isDefeated && (
            <motion.div
              initial={{
                opacity: 0,
                y: 15,
                scale: 0.7,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                y: -55,
                scale: [0.7, 1.15, 1],
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.9,
                ease: "easeOut",
              }}
              className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 font-mono text-2xl font-black text-rose-400 drop-shadow-[0_0_12px_rgba(244,63,94,0.7)]"
            >
              -{damageTaken}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Defeat overlay */}
        <AnimatePresence>
          {isDefeated && (
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.95,
              }}
              animate={{
                opacity: 1,
                scale: 1,
              }}
              className="absolute inset-0 z-10 flex items-center justify-center bg-emerald-950/20 backdrop-blur-[1px]"
            >
              <div className="text-center">
                <motion.div
                  initial={{
                    scale: 0,
                    rotate: -20,
                  }}
                  animate={{
                    scale: 1,
                    rotate: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 15,
                  }}
                  className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-500/10"
                >
                  <CheckCircle2 className="h-6 w-6 text-emerald-300" />
                </motion.div>

                <p className="text-sm font-black uppercase tracking-[0.25em] text-emerald-300">
                  Boss Defeated
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Boss status */}
        <div className="relative flex items-end justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-rose-400" />

              <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Boss Vitality
              </span>
            </div>

            <p className="mt-1 font-mono text-xl font-black text-white sm:text-2xl">
              {boss.currentHp.toLocaleString()}
              <span className="text-sm text-slate-600">
                {" "}
                / {boss.maxHp.toLocaleString()}
              </span>
            </p>
          </div>

          <div className="text-right">
            <p
              className={`font-mono text-lg font-black ${
                isDefeated
                  ? "text-emerald-300"
                  : hpPercent <= 20
                    ? "text-rose-300"
                    : "text-rose-400"
              }`}
            >
              {hpPercent}%
            </p>

            <p className="text-[8px] font-bold uppercase tracking-wider text-slate-600">
              Remaining
            </p>
          </div>
        </div>

        {/* HP bar */}
        <div className="relative mt-4">
          <div className="h-3 overflow-hidden rounded-full border border-slate-800 bg-slate-950 p-0.5">
            <motion.div
              initial={false}
              animate={{
                width: `${hpPercent}%`,
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
              className={`relative h-full overflow-hidden rounded-full ${
                isDefeated
                  ? "bg-emerald-500"
                  : "bg-gradient-to-r from-rose-700 via-red-500 to-amber-400"
              }`}
            >
              <motion.div
                animate={{
                  x: ["-100%", "200%"],
                }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent"
              />
            </motion.div>
          </div>

          {/* HP markers */}
          <div className="mt-2 flex justify-between font-mono text-[8px] text-slate-700">
            <span>0</span>
            <span>25%</span>
            <span>50%</span>
            <span>75%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Combat message */}
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-slate-800/70 bg-slate-950/30 px-3 py-2.5">
          <Swords className="h-3.5 w-3.5 shrink-0 text-rose-400" />

          <p className="text-[10px] leading-relaxed text-slate-500">
            {isDefeated
              ? "The dungeon boss has fallen. Victory spoils have been secured."
              : "Complete quests to automatically deal damage to the raid boss."}
          </p>
        </div>
      </motion.div>

      {/* Rewards */}
      <div className="relative mt-5 grid gap-3 sm:grid-cols-2">
        {/* Gold reward */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-amber-400/10 bg-amber-400/[0.03] p-3.5"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/5">
              <Coins className="h-4 w-4 text-amber-300" />
            </div>

            <div>
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Victory Spoils
              </p>

              <p className="font-mono text-sm font-black text-amber-200">
                +{boss.rewardGold.toLocaleString()} Gold
              </p>
            </div>
          </div>
        </motion.div>

        {/* Title reward */}
        <motion.div
          whileHover={{ y: -2 }}
          className="rounded-2xl border border-violet-400/10 bg-violet-400/[0.03] p-3.5"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-400/15 bg-violet-400/5">
              <Crown className="h-4 w-4 text-violet-300" />
            </div>

            <div className="min-w-0">
              <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">
                Title Reward
              </p>

              <p className="truncate text-sm font-black text-violet-200">
                {boss.rewardTitle}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom status */}
      <div className="relative mt-4 flex flex-col gap-2 border-t border-slate-800/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-[10px] text-slate-600">
          <div
            className={`h-1.5 w-1.5 rounded-full ${
              isDefeated
                ? "bg-emerald-400"
                : "animate-pulse bg-rose-400"
            }`}
          />

          {isDefeated
            ? "Raid Complete"
            : "Raid Protocol Active"}
        </div>

        <div className="flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-700">
          <Zap className="h-3 w-3" />

          Quest Damage System
        </div>
      </div>
    </motion.section>
  );
}