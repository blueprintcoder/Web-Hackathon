'use client';

import { motion } from 'framer-motion';
import {
  Flame,
  Shield,
  ShieldCheck,
  Trophy,
  AlertTriangle,
} from 'lucide-react';

import type {
  Character,
} from '@/types/game';

interface StreakStatusProps {
  character: Character;
  hasAegis: boolean;
}

export function StreakStatus({
  character,
  hasAegis,
}: StreakStatusProps) {
  const isBroken =
    character.streakBroken;

  return (
    <motion.section
      initial={{
        opacity: 0,
        y: 12,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className={`relative overflow-hidden rounded-2xl border p-5 ${
        isBroken
          ? 'border-rose-500/25 bg-rose-500/[0.04]'
          : 'border-orange-500/20 bg-orange-500/[0.035]'
      }`}
    >
      {/* Ambient glow */}
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full blur-3xl ${
          isBroken
            ? 'bg-rose-500/10'
            : 'bg-orange-500/10'
        }`}
      />

      <div className="relative flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        {/* Main streak */}
        <div className="flex items-center gap-4">
          <motion.div
            animate={
              isBroken
                ? {}
                : {
                    scale: [1, 1.06, 1],
                  }
            }
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border ${
              isBroken
                ? 'border-rose-500/30 bg-rose-500/10'
                : 'border-orange-500/30 bg-orange-500/10'
            }`}
          >
            {isBroken ? (
              <AlertTriangle className="h-6 w-6 text-rose-400" />
            ) : (
              <Flame className="h-6 w-6 text-orange-400" />
            )}
          </motion.div>

          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-500">
              Hunter Streak Protocol
            </p>

            <div className="mt-1 flex items-baseline gap-2">
              <span
                className={`font-mono text-2xl font-black ${
                  isBroken
                    ? 'text-rose-300'
                    : 'text-orange-300'
                }`}
              >
                {character.streakCount}
              </span>

              <span className="text-xs font-bold text-slate-500">
                consecutive days
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {isBroken
                ? 'Your streak has been broken. Restore it through the Soul Sacrifice protocol.'
                : 'Complete at least one quest each active day to maintain your streak.'}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {/* Best streak */}
          <div className="rounded-xl border border-slate-800 bg-black/20 px-4 py-3">
            <div className="flex items-center gap-2">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />

              <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                Best
              </span>
            </div>

            <p className="mt-1 font-mono text-sm font-black text-white">
              {character.bestStreak}d
            </p>
          </div>

          {/* Aegis */}
          <div
            className={`rounded-xl border px-4 py-3 ${
              hasAegis
                ? 'border-cyan-500/20 bg-cyan-500/5'
                : 'border-slate-800 bg-black/20'
            }`}
          >
            <div className="flex items-center gap-2">
              {hasAegis ? (
                <ShieldCheck className="h-3.5 w-3.5 text-cyan-400" />
              ) : (
                <Shield className="h-3.5 w-3.5 text-slate-600" />
              )}

              <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                Aegis
              </span>
            </div>

            <p
              className={`mt-1 text-[10px] font-black uppercase ${
                hasAegis
                  ? 'text-cyan-300'
                  : 'text-slate-600'
              }`}
            >
              {hasAegis
                ? 'Equipped'
                : 'Inactive'}
            </p>
          </div>

          {/* Status */}
          <div
            className={`col-span-2 rounded-xl border px-4 py-3 sm:col-span-1 ${
              isBroken
                ? 'border-rose-500/20 bg-rose-500/5'
                : 'border-emerald-500/20 bg-emerald-500/5'
            }`}
          >
            <div className="flex items-center gap-2">
              <div
                className={`h-1.5 w-1.5 rounded-full ${
                  isBroken
                    ? 'bg-rose-400'
                    : 'bg-emerald-400'
                }`}
              />

              <span className="text-[9px] font-black uppercase tracking-wider text-slate-600">
                Status
              </span>
            </div>

            <p
              className={`mt-1 text-[10px] font-black uppercase ${
                isBroken
                  ? 'text-rose-300'
                  : 'text-emerald-300'
              }`}
            >
              {isBroken
                ? 'Broken'
                : 'Active'}
            </p>
          </div>
        </div>
      </div>
    </motion.section>
  );
}