"use client";

import React from "react";
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
  Award,
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
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    bar: "bg-[#ff4b4b]",
  },
  INT: {
    label: "Intelligence",
    icon: Brain,
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    bar: "bg-[#1cb0f6]",
  },
  VIT: {
    label: "Vitality",
    icon: HeartPulse,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    bar: "bg-[#58cc02]",
  },
  AGI: {
    label: "Agility",
    icon: Wind,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-[#ffc800]",
  },
  CHA: {
    label: "Charisma",
    icon: MessageCircle,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    bar: "bg-[#ce82ff]",
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
  const xpProgress = getProgress(character.currentXp, character.requiredXp);

  return (
    <div className="space-y-6">
      {/* Top Hunter Profile Card */}
      <div className="card-duo-light p-6 sm:p-8 bg-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            {/* Hunter Avatar Badge */}
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-purple-500 text-white shadow-[0_4px_0_#7c3aed] text-2xl font-black shrink-0">
              {character.name.charAt(0)}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-purple-700 bg-purple-100 px-2 py-0.5 rounded-md">
                  Hunter Protocol
                </span>
                <span className="text-[10px] font-bold text-slate-600">
                  Level {character.level} Hunter
                </span>
              </div>
              <h2 className="text-2xl font-black text-slate-900 mt-1">
                {character.name}
              </h2>
              <p className="text-xs font-bold text-slate-600">
                {character.title}
              </p>
            </div>
          </div>

          {/* Quick Stats Pill Group */}
          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            {/* Streak */}
            <div className="flex-1 sm:flex-none flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-50/80 border border-amber-200/70 shadow-xs">
              <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
              <div>
                <span className="block text-[9px] font-black uppercase tracking-wider text-amber-700">
                  Streak
                </span>
                <span className="font-mono text-sm font-black text-amber-900">
                  {character.streakCount} Days
                </span>
              </div>
            </div>

            {/* Gold */}
            <div className="flex-1 sm:flex-none flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-yellow-50/80 border border-yellow-200/70 shadow-xs">
              <Coins className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              <div>
                <span className="block text-[9px] font-black uppercase tracking-wider text-yellow-700">
                  Gold
                </span>
                <span className="font-mono text-sm font-black text-yellow-900">
                  {character.gold.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Global XP Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
          <div className="flex justify-between items-center text-xs font-black">
            <span className="text-slate-700">Hunter Level {character.level} Progression</span>
            <span className="font-mono text-slate-600">
              {character.currentXp.toLocaleString()} / {character.requiredXp.toLocaleString()} XP ({xpProgress}%)
            </span>
          </div>

          <div className="h-4 w-full bg-slate-100 rounded-full border-2 border-slate-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${xpProgress}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-[#1cb0f6] bar-juicy rounded-full"
            />
          </div>
        </div>
      </div>

      {/* Attributes Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h3 className="font-black text-slate-900 text-base uppercase tracking-wider">
            Hunter Attributes
          </h3>
          <span className="text-xs text-slate-600 font-bold">
            Shaped by daily real-world activities
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {Object.entries(attributeConfig).map(([key, config]) => {
            const Icon = config.icon;
            const attr = character.attributes[key as keyof typeof character.attributes];
            const progress = getProgress(attr.currentXp, attr.requiredXp);

            return (
              <div
                key={key}
                className={`card-duo-light p-4 bg-white flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-xl ${config.bg} ${config.color} border ${config.border}`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="font-black text-xs text-slate-800">
                        {key}
                      </span>
                    </div>

                    <span className="font-mono font-black text-sm text-slate-900">
                      Lv {attr.level}
                    </span>
                  </div>

                  <p className="text-[11px] font-bold text-slate-600">
                    {config.label}
                  </p>
                </div>

                {/* Mini progress bar */}
                <div className="mt-3">
                  <div className="h-2 w-full bg-slate-100 rounded-full border border-slate-200 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6 }}
                      className={`h-full ${config.bar} rounded-full`}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[9px] font-mono text-slate-600 mt-1">
                    <span>{attr.currentXp} XP</span>
                    <span>{attr.requiredXp} XP</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Soul Sacrifice Section (Section 9 Feature) */}
      <div className="card-duo-light p-6 bg-white border-rose-200">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm shrink-0">
              <Skull className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 bg-rose-100 px-2 py-0.5 rounded-md">
                  High-Stakes Mechanism
                </span>
                <span className="text-[10px] font-black text-slate-600">
                  {character.sacrificesThisMonth}/2 Used this month
                </span>
              </div>
              <h3 className="text-lg font-black text-slate-900 mt-0.5">
                Soul Sacrifice (Streak Protector)
              </h3>
              <p className="text-xs text-slate-600 font-medium">
                Sacrifice 1 full Character Level to restore a broken streak back to its full glory. Maximum 2 per calendar month.
              </p>
            </div>
          </div>

          {onSoulSacrifice && (
            <button
              type="button"
              onClick={onSoulSacrifice}
              className="btn-duo-red px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center"
            >
              <Flame className="w-4 h-4" />
              Execute Soul Sacrifice
            </button>
          )}
        </div>
      </div>
    </div>
  );
}