"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Brain,
  Crown,
  HeartPulse,
  MessageCircle,
  Sparkles,
  Swords,
  Wind,
  Award,
} from "lucide-react";

import type { CharacterAttributes, AttributeKey } from "@/types/game";

interface FeatTranslationBarProps {
  attributes: CharacterAttributes;
}

const ATTRIBUTE_CONFIG: Record<
  AttributeKey,
  {
    label: string;
    subtitle: string;
    icon: React.ElementType;
    color: string;
    bg: string;
    border: string;
    bar: string;
  }
> = {
  STR: {
    label: "STR",
    subtitle: "Physical Might",
    icon: Swords,
    color: "text-rose-700",
    bg: "bg-rose-50",
    border: "border-rose-200",
    bar: "bg-[#ff4b4b]",
  },
  INT: {
    label: "INT",
    subtitle: "Deep Intellect",
    icon: Brain,
    color: "text-sky-700",
    bg: "bg-sky-50",
    border: "border-sky-200",
    bar: "bg-[#1cb0f6]",
  },
  VIT: {
    label: "VIT",
    subtitle: "Endurance & Sleep",
    icon: HeartPulse,
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    bar: "bg-[#58cc02]",
  },
  AGI: {
    label: "AGI",
    subtitle: "Speed & Execution",
    icon: Wind,
    color: "text-amber-700",
    bg: "bg-amber-50",
    border: "border-amber-200",
    bar: "bg-[#ffc800]",
  },
  CHA: {
    label: "CHA",
    subtitle: "Leadership & Social",
    icon: MessageCircle,
    color: "text-purple-700",
    bg: "bg-purple-50",
    border: "border-purple-200",
    bar: "bg-[#ce82ff]",
  },
};

export function FeatTranslationBar({ attributes }: FeatTranslationBarProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <div>
          <h3 className="text-base font-black text-slate-900 uppercase tracking-wider">
            Real-World Feat Translations
          </h3>
          <p className="text-xs text-slate-600 font-bold">
            Real-world capabilities mathematically translated from your RPG level
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {Object.entries(attributes).map(([key, attr]) => {
          const config = ATTRIBUTE_CONFIG[key as AttributeKey] || ATTRIBUTE_CONFIG.STR;
          const Icon = config.icon;

          return (
            <motion.div
              key={key}
              whileHover={{ y: -2 }}
              className="card-duo-light p-4 bg-white flex items-start gap-3.5"
            >
              <div
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${config.bg} ${config.color} border-2 ${config.border}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-black text-xs text-slate-800">
                    {config.subtitle} ({key})
                  </span>
                  <span className="font-mono font-black text-xs text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                    Level {attr.level}
                  </span>
                </div>

                <p className="mt-1 text-xs font-bold text-slate-700 leading-snug">
                  &ldquo;{attr.featDescription || `Achieved Level ${attr.level} mastery.`}&rdquo;
                </p>

                <p className="mt-1 text-[10px] text-slate-600 font-medium">
                  Next tier unlocks at Level {attr.level + 1}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}