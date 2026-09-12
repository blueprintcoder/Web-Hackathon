"use client";

import { motion } from "framer-motion";
import {
  Brain,
  Crown,
  HeartPulse,
  MessageCircle,
  Sparkles,
  Swords,
  Wind,
  Zap,
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
    text: string;
    border: string;
    background: string;
    iconBackground: string;
    bar: string;
    glow: string;
  }
> = {
  STR: {
    label: "STR",
    subtitle: "Strength",
    icon: Swords,
    text: "text-rose-300",
    border: "border-rose-500/25",
    background: "bg-rose-500/[0.045]",
    iconBackground: "bg-rose-500/10",
    bar: "bg-rose-400",
    glow: "bg-rose-500/10",
  },

  INT: {
    label: "INT",
    subtitle: "Intellect",
    icon: Brain,
    text: "text-cyan-300",
    border: "border-cyan-500/25",
    background: "bg-cyan-500/[0.045]",
    iconBackground: "bg-cyan-500/10",
    bar: "bg-cyan-400",
    glow: "bg-cyan-500/10",
  },

  VIT: {
    label: "VIT",
    subtitle: "Vitality",
    icon: HeartPulse,
    text: "text-emerald-300",
    border: "border-emerald-500/25",
    background: "bg-emerald-500/[0.045]",
    iconBackground: "bg-emerald-500/10",
    bar: "bg-emerald-400",
    glow: "bg-emerald-500/10",
  },

  AGI: {
    label: "AGI",
    subtitle: "Agility",
    icon: Wind,
    text: "text-amber-300",
    border: "border-amber-500/25",
    background: "bg-amber-500/[0.045]",
    iconBackground: "bg-amber-500/10",
    bar: "bg-amber-400",
    glow: "bg-amber-500/10",
  },

  CHA: {
    label: "CHA",
    subtitle: "Charisma",
    icon: MessageCircle,
    text: "text-violet-300",
    border: "border-violet-500/25",
    background: "bg-violet-500/[0.045]",
    iconBackground: "bg-violet-500/10",
    bar: "bg-violet-400",
    glow: "bg-violet-500/10",
  },
};

function getProgress(currentXp: number, requiredXp: number) {
  if (requiredXp <= 0) return 0;

  return Math.min(
    100,
    Math.round((currentXp / requiredXp) * 100)
  );
}

export function FeatTranslationBar({
  attributes,
}: FeatTranslationBarProps) {
  const attributeEntries = Object.entries(
    attributes
  ) as [AttributeKey, CharacterAttributes[AttributeKey]][];

  return (
    <motion.section
      id="real-world-feats"
      initial={{
        opacity: 0,
        y: 28,
        scale: 0.985,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        scale: 1,
      }}
      viewport={{
        once: true,
        amount: 0.15,
      }}
      transition={{
        duration: 0.65,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="scroll-mt-24 relative overflow-hidden rounded-3xl border border-slate-800/80 bg-[#0d1320]/95 p-4 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-5 lg:p-6"
    >
      {/* ============================================================
          BACKGROUND EFFECTS
      ============================================================ */}

      <motion.div
        animate={{
          opacity: [0.25, 0.45, 0.25],
          scale: [1, 1.08, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -right-40 -top-40 h-96 w-96 rounded-full bg-violet-600/[0.08] blur-3xl"
      />

      <motion.div
        animate={{
          opacity: [0.15, 0.3, 0.15],
          scale: [1.08, 1, 1.08],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-cyan-500/[0.05] blur-3xl"
      />

      {/* ============================================================
          HEADER
      ============================================================ */}

      <div className="relative mb-5 border-b border-slate-800/80 pb-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.22em] text-amber-300"
              >
                <Zap className="h-3.5 w-3.5" />

                Real-World Feats & Power Translation
              </motion.span>

              <span className="rounded-md border border-slate-700/80 bg-slate-900/60 px-2 py-1 text-[8px] font-black uppercase tracking-[0.14em] text-slate-500">
                Section 9.3 Protocol
              </span>
            </div>

            <h2 className="flex items-center gap-2 text-lg font-black tracking-tight text-white sm:text-xl">
              <Sparkles className="h-5 w-5 text-violet-400" />

              Translate Your Power
            </h2>

            <p className="mt-1 max-w-3xl text-xs leading-relaxed text-slate-500">
              Your virtual attributes are translated into tangible
              real-world accomplishments. Every quest changes the
              Hunter you are becoming.
            </p>
          </div>

          <motion.div
            animate={{
              boxShadow: [
                "0 0 0 rgba(139,92,246,0)",
                "0 0 24px rgba(139,92,246,0.12)",
                "0 0 0 rgba(139,92,246,0)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
            }}
            className="hidden shrink-0 items-center gap-2 rounded-xl border border-violet-500/15 bg-violet-500/[0.04] px-3 py-2 sm:flex"
          >
            <Crown className="h-4 w-4 text-violet-300" />

            <div>
              <p className="text-[8px] font-black uppercase tracking-[0.18em] text-slate-600">
                Hunter Evolution
              </p>

              <p className="font-mono text-[10px] font-bold text-violet-300">
                LIVE TRANSLATION
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ============================================================
          ATTRIBUTE CARDS
      ============================================================ */}

      <div className="relative grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {attributeEntries.map(
          ([attributeKey, attribute], index) => {
            const config =
              ATTRIBUTE_CONFIG[attributeKey];

            const Icon = config.icon;

            const progress = getProgress(
              attribute.currentXp,
              attribute.requiredXp
            );

            return (
              <motion.article
                key={attributeKey}
                initial={{
                  opacity: 0,
                  y: 22,
                  scale: 0.96,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                viewport={{
                  once: true,
                  amount: 0.2,
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -5,
                  scale: 1.015,
                }}
                className={`group relative overflow-hidden rounded-2xl border ${config.border} ${config.background} p-3.5 transition-shadow duration-300 hover:shadow-xl`}
              >
                {/* Card glow */}

                <motion.div
                  animate={{
                    opacity: [0.15, 0.3, 0.15],
                    scale: [1, 1.12, 1],
                  }}
                  transition={{
                    duration: 4 + index * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className={`pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full ${config.glow} blur-2xl`}
                />

                {/* Top line */}

                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <motion.div
                      whileHover={{
                        rotate: 8,
                        scale: 1.08,
                      }}
                      className={`flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.06] ${config.iconBackground}`}
                    >
                      <Icon
                        className={`h-4 w-4 ${config.text}`}
                      />
                    </motion.div>

                    <div>
                      <p
                        className={`text-xs font-black ${config.text}`}
                      >
                        {config.label}
                      </p>

                      <p className="text-[8px] font-bold uppercase tracking-wider text-slate-600">
                        {config.subtitle}
                      </p>
                    </div>
                  </div>

                  <motion.span
                    key={attribute.level}
                    initial={{
                      scale: 1.25,
                      opacity: 0.5,
                    }}
                    animate={{
                      scale: 1,
                      opacity: 1,
                    }}
                    className={`font-mono text-sm font-black ${config.text}`}
                  >
                    Lv {attribute.level}
                  </motion.span>
                </div>

                {/* XP bar */}

                <div className="relative mt-3">
                  <div className="h-1.5 overflow-hidden rounded-full bg-slate-900/90">
                    <motion.div
                      initial={{
                        width: 0,
                      }}
                      whileInView={{
                        width: `${progress}%`,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 1,
                        delay:
                          0.25 +
                          index * 0.08,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                      className={`relative h-full rounded-full ${config.bar}`}
                    >
                      <motion.div
                        animate={{
                          x: [
                            "-100%",
                            "200%",
                          ],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-transparent via-white/35 to-transparent"
                      />
                    </motion.div>
                  </div>

                  <div className="mt-1.5 flex justify-between">
                    <span className="font-mono text-[8px] text-slate-700">
                      {attribute.currentXp} XP
                    </span>

                    <span
                      className={`font-mono text-[8px] ${config.text} opacity-70`}
                    >
                      {progress}%
                    </span>
                  </div>
                </div>

                {/* Feat */}

                <div className="relative mt-3 border-t border-white/[0.05] pt-3">
                  <p className="text-[9px] italic leading-[1.55] text-slate-400">
                    "{attribute.featDescription}"
                  </p>
                </div>

                {/* Bottom status */}

                <div className="relative mt-3 flex items-center gap-1.5">
                  <motion.span
                    animate={{
                      opacity: [0.4, 1, 0.4],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                    }}
                    className={`h-1.5 w-1.5 rounded-full ${config.bar}`}
                  />

                  <span className="text-[8px] font-bold uppercase tracking-[0.14em] text-slate-600">
                    Power Translation Active
                  </span>
                </div>
              </motion.article>
            );
          }
        )}
      </div>
    </motion.section>
  );
}