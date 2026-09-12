"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Coins,
  Flame,
  HeartPulse,
  MessageCircle,
  Shield,
  Skull,
  Sparkles,
  Swords,
  Wind,
} from "lucide-react";

import type { Character } from "@/types/game";
import { ShadowFamiliar } from "./shadow-familiar";

interface CharacterCardProps {
  character: Character;
  onSoulSacrifice?: () => void;
}

const attributeConfig = {
  STR: {
    label: "Strength",
    icon: Swords,
    color: "text-rose-400",
    bar: "bg-rose-400",
  },
  INT: {
    label: "Intelligence",
    icon: Brain,
    color: "text-cyan-400",
    bar: "bg-cyan-400",
  },
  VIT: {
    label: "Vitality",
    icon: HeartPulse,
    color: "text-emerald-400",
    bar: "bg-emerald-400",
  },
  AGI: {
    label: "Agility",
    icon: Wind,
    color: "text-amber-400",
    bar: "bg-amber-400",
  },
  CHA: {
    label: "Charisma",
    icon: MessageCircle,
    color: "text-pink-400",
    bar: "bg-pink-400",
  },
} as const;

function getProgress(current: number, required: number) {
  if (required <= 0) return 0;

  return Math.min(100, Math.round((current / required) * 100));
}

export function CharacterCard({
  character,
  onSoulSacrifice,
}: CharacterCardProps) {
  const xpProgress = getProgress(
    character.currentXp,
    character.requiredXp
  );

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-[#111827]/90 p-5 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-6"
    >
      {/* Ambient background effects */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* Header */}
      <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Hunter crest */}
          <motion.div
            whileHover={{
              scale: 1.06,
              rotate: 2,
            }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 15,
            }}
            className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-violet-400/30 bg-violet-500/10 shadow-lg shadow-violet-900/20"
          >
            <div className="absolute inset-1 rounded-xl border border-violet-400/10" />

            <Skull className="h-7 w-7 text-violet-300" />

            <span className="absolute -bottom-2 rounded-full border border-violet-400/30 bg-[#111827] px-2 py-0.5 text-[9px] font-bold tracking-[0.18em] text-violet-300">
              HUNTER
            </span>
          </motion.div>

          <div>
            <div className="mb-1 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-violet-300">
                Hunter Profile
              </span>

              <span className="inline-flex items-center gap-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                <Sparkles className="h-3 w-3" />
                System Online
              </span>
            </div>

            <h2 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
              {character.name}
            </h2>

            <p className="mt-0.5 text-sm text-slate-400">
              {character.title}
            </p>
          </div>

          {/* Shadow Drake Familiar Companion */}
          <div className="hidden md:block pl-2">
            <ShadowFamiliar level={character.level} />
          </div>
        </div>

        {/* Gold + Streak */}
        <div className="flex items-center gap-2 self-start">
          {/* Gold */}
          <motion.div
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 rounded-xl border border-amber-400/15 bg-amber-400/5 px-3 py-2"
          >
            <Coins className="h-4 w-4 text-amber-300" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Gold
              </p>

              <motion.p
                key={character.gold}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                className="font-mono text-sm font-bold text-amber-200"
              >
                {character.gold.toLocaleString()}
              </motion.p>
            </div>
          </motion.div>

          {/* Streak */}
          <motion.div
            whileHover={{ y: -2 }}
            className="flex items-center gap-2 rounded-xl border border-orange-400/15 bg-orange-400/5 px-3 py-2"
          >
            <Flame className="h-4 w-4 text-orange-400" />

            <div>
              <p className="text-[9px] font-bold uppercase tracking-wider text-slate-500">
                Streak
              </p>

              <p className="font-mono text-sm font-bold text-orange-300">
                {character.streakCount}d
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Level + XP */}
      <div className="relative mt-7 rounded-2xl border border-slate-800/80 bg-black/20 p-4">
        <div className="flex items-end justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Level */}
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 0 rgba(139,92,246,0)",
                  "0 0 25px rgba(139,92,246,0.25)",
                  "0 0 0 rgba(139,92,246,0)",
                ],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
              }}
              className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/30 bg-violet-500/10"
            >
              <span className="font-mono text-xl font-black text-violet-300">
                {character.level}
              </span>
            </motion.div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Current Level
              </p>

              <p className="text-sm font-semibold text-white">
                Hunter Level {character.level}
              </p>
            </div>
          </div>

          {/* XP numbers */}
          <div className="text-right">
            <p className="font-mono text-sm font-semibold text-white">
              {character.currentXp.toLocaleString()}
              <span className="text-slate-600">
                {" "}
                / {character.requiredXp.toLocaleString()}
              </span>
            </p>

            <p className="text-[10px] uppercase tracking-wider text-slate-500">
              Experience
            </p>
          </div>
        </div>

        {/* XP bar */}
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-slate-800">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{
                duration: 1,
                ease: "easeOut",
              }}
              className="relative h-full rounded-full bg-gradient-to-r from-violet-600 via-purple-400 to-cyan-400"
            >
              <div className="absolute inset-0 animate-pulse bg-white/20" />
            </motion.div>
          </div>

          <div className="mt-2 flex justify-between text-[9px] font-medium uppercase tracking-wider text-slate-600">
            <span>Current</span>

            <span>{xpProgress}%</span>

            <span>Next Level</span>
          </div>
        </div>
      </div>

      {/* Attributes */}
      <div className="relative mt-6">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-violet-300">
              Hunter Attributes
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Your real-world actions shape these stats.
            </p>
          </div>

          <Shield className="h-4 w-4 text-slate-600" />
        </div>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {Object.entries(attributeConfig).map(
            ([key, config], index) => {
              const Icon = config.icon;

              const attribute =
                character.attributes[
                  key as keyof typeof character.attributes
                ];

              const progress = getProgress(
                attribute.currentXp,
                attribute.requiredXp
              );

              return (
                <motion.div
                  key={key}
                  initial={{
                    opacity: 0,
                    y: 10,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    delay: index * 0.06,
                  }}
                  whileHover={{
                    y: -3,
                  }}
                  className="rounded-xl border border-slate-800 bg-slate-950/30 p-3 transition-colors duration-300 hover:border-slate-700"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon
                        className={`h-4 w-4 ${config.color}`}
                      />

                      <span className="text-xs font-bold text-white">
                        {key}
                      </span>
                    </div>

                    <span
                      className={`font-mono text-xs ${config.color}`}
                    >
                      {attribute.level}
                    </span>
                  </div>

                  {/* Attribute XP */}
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${progress}%`,
                      }}
                      transition={{
                        duration: 0.8,
                        delay: index * 0.06,
                      }}
                      className={`h-full rounded-full ${config.bar}`}
                    />
                  </div>

                  <p className="mt-1.5 text-[9px] text-slate-600">
                    {attribute.currentXp} /{" "}
                    {attribute.requiredXp} XP
                  </p>
                </motion.div>
              );
            }
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="relative mt-6 flex flex-col gap-3 border-t border-slate-800/70 pt-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />

          Hunter System Online
        </div>

        <div className="flex flex-col gap-2 sm:flex-row">
          {/* Last active */}
          <div className="rounded-lg border border-slate-800 bg-slate-950/30 px-3 py-1.5">
            <span className="text-[9px] uppercase tracking-wider text-slate-600">
              Last Active{" "}
            </span>

            <span className="text-[10px] text-slate-400">
              {character.lastActiveDate}
            </span>
          </div>

          {/* Soul Sacrifice */}
          {onSoulSacrifice && (
            <button
              type="button"
              onClick={onSoulSacrifice}
              className="group inline-flex items-center justify-center gap-2 rounded-xl border border-rose-500/20 bg-rose-500/5 px-4 py-2 text-xs font-semibold text-rose-300 transition-all hover:border-rose-400/40 hover:bg-rose-500/10"
            >
              <Flame className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />

              Soul Sacrifice

              <span className="text-[9px] text-rose-400/60">
                {character.sacrificesThisMonth}/2
              </span>
            </button>
          )}
        </div>
      </div>
    </motion.section>
  );
}