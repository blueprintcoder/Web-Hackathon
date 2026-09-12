"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Award,
  Brain,
  Check,
  CheckCircle2,
  Circle,
  Crown,
  Dumbbell,
  Filter,
  Flame,
  Heart,
  Plus,
  Sparkles,
  Swords,
  X,
  Zap,
} from "lucide-react";

import type {
  AttributeKey,
  Quest,
  QuestRank,
} from "@/types/game";

import { playSfx } from "./audio-controller";

interface QuestBoardProps {
  quests: Quest[];
  onCompleteQuest: (questId: string) => void;
  onCreateQuest: (newQuest: Partial<Quest>) => void;
}

const rankColors: Record<
  QuestRank,
  {
    text: string;
    bg: string;
    border: string;
    glow: string;
  }
> = {
  E: {
    text: "text-slate-300",
    bg: "bg-slate-800/80",
    border: "border-slate-700",
    glow: "shadow-slate-900/20",
  },
  D: {
    text: "text-emerald-400",
    bg: "bg-emerald-950/60",
    border: "border-emerald-700/50",
    glow: "shadow-emerald-900/20",
  },
  C: {
    text: "text-cyan-400",
    bg: "bg-cyan-950/60",
    border: "border-cyan-700/50",
    glow: "shadow-cyan-900/20",
  },
  B: {
    text: "text-indigo-400",
    bg: "bg-indigo-950/60",
    border: "border-indigo-700/50",
    glow: "shadow-indigo-900/20",
  },
  A: {
    text: "text-amber-400",
    bg: "bg-amber-950/60",
    border: "border-amber-700/50",
    glow: "shadow-amber-900/20",
  },
  S: {
    text: "text-purple-400",
    bg: "bg-purple-950/60",
    border: "border-purple-700/60",
    glow: "shadow-purple-900/30",
  },
};

const categoryIcons: Record<
  AttributeKey,
  React.ElementType
> = {
  STR: Dumbbell,
  INT: Brain,
  VIT: Heart,
  AGI: Zap,
  CHA: Crown,
};

const categoryStyles: Record<
  AttributeKey,
  {
    color: string;
    bg: string;
    border: string;
  }
> = {
  STR: {
    color: "text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20",
  },
  INT: {
    color: "text-cyan-400",
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
  },
  VIT: {
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  AGI: {
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
  },
  CHA: {
    color: "text-pink-400",
    bg: "bg-pink-500/10",
    border: "border-pink-500/20",
  },
};

export function QuestBoard({
  quests,
  onCompleteQuest,
  onCreateQuest,
}: QuestBoardProps) {
  const [activeTab, setActiveTab] = useState<
    "ALL" | "DAILY" | "BOUNTY"
  >("ALL");

  const [selectedRank, setSelectedRank] = useState<
    QuestRank | "ALL"
  >("ALL");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [completingId, setCompletingId] = useState<string | null>(
    null
  );

  const [rewardBurst, setRewardBurst] = useState<string | null>(
    null
  );

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] =
    useState<AttributeKey>("INT");
  const [newRank, setNewRank] = useState<QuestRank>("C");
  const [newIsDaily, setNewIsDaily] = useState(false);

  const filteredQuests = quests.filter((quest) => {
    if (activeTab === "DAILY" && !quest.isDaily) {
      return false;
    }

    if (activeTab === "BOUNTY" && quest.isDaily) {
      return false;
    }

    if (
      selectedRank !== "ALL" &&
      quest.rank !== selectedRank
    ) {
      return false;
    }

    return true;
  });

  const pendingCount = filteredQuests.filter(
    (quest) => quest.status !== "COMPLETED"
  ).length;

  const completedCount = filteredQuests.filter(
    (quest) => quest.status === "COMPLETED"
  ).length;

  const handleCheck = (quest: Quest) => {
    if (
      quest.status === "COMPLETED" ||
      completingId !== null
    ) {
      return;
    }

    setCompletingId(quest.id);
    setRewardBurst(quest.id);

    playSfx("complete");
    playSfx("attack");

    // Small delay makes the completion interaction feel physical
    // before the parent state updates.
    window.setTimeout(() => {
      onCompleteQuest(quest.id);
    }, 250);

    window.setTimeout(() => {
      setCompletingId(null);
    }, 650);

    window.setTimeout(() => {
      setRewardBurst(null);
    }, 900);
  };

  const handleFormSubmit = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!newTitle.trim()) {
      return;
    }

    onCreateQuest({
      title: newTitle.trim(),
      description: newDesc.trim(),
      category: newCategory,
      rank: newRank,
      isDaily: newIsDaily,
    });

    setNewTitle("");
    setNewDesc("");
    setNewCategory("INT");
    setNewRank("C");
    setNewIsDaily(false);
    setIsModalOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <motion.section
        id="quests"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="relative overflow-hidden rounded-3xl border border-indigo-500/15 bg-[#111827]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5 lg:p-6"
      >
        {/* Ambient effects */}
        <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-violet-600/10 blur-3xl" />

        <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />

        {/* Header */}
        <div className="relative mb-5 flex flex-col gap-4 border-b border-slate-800/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-violet-300">
                Hunter Operations
              </span>

              <span className="rounded-full border border-emerald-400/15 bg-emerald-400/5 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                {pendingCount} Active
              </span>
            </div>

            <h2 className="flex items-center gap-2 text-xl font-black tracking-tight text-white sm:text-2xl">
              <Swords className="h-5 w-5 text-violet-400" />

              Guild Quest Board
            </h2>

            <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
              Complete real-world objectives to gain experience,
              strengthen your attributes, earn gold, and damage the
              weekly raid boss.
            </p>
          </div>

          <motion.button
            type="button"
            onClick={() => setIsModalOpen(true)}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="group inline-flex items-center justify-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-4 py-2.5 text-xs font-bold text-violet-200 shadow-lg shadow-violet-950/10 transition-colors hover:border-violet-400/40 hover:bg-violet-500/15"
          >
            <Plus className="h-4 w-4 transition-transform duration-300 group-hover:rotate-90" />

            Post Bounty
          </motion.button>
        </div>

        {/* Controls */}
        <div className="relative mb-5 flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
          {/* Tabs */}
          <div className="flex w-full overflow-x-auto rounded-xl border border-slate-800 bg-black/20 p-1 sm:w-fit">
            {(
              [
                ["ALL", "All Quests"],
                ["DAILY", "Daily Rites"],
                ["BOUNTY", "Hunter Bounties"],
              ] as const
            ).map(([value, label]) => {
              const active = activeTab === value;

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActiveTab(value)}
                  className="relative shrink-0 rounded-lg px-3 py-2 text-[10px] font-bold uppercase tracking-wider transition-colors sm:px-4"
                >
                  {active && (
                    <motion.div
                      layoutId="quest-tab"
                      className="absolute inset-0 rounded-lg bg-violet-600 shadow-lg shadow-violet-900/20"
                      transition={{
                        type: "spring",
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}

                  <span
                    className={`relative z-10 flex items-center gap-1.5 ${
                      active
                        ? "text-white"
                        : "text-slate-500 hover:text-slate-300"
                    }`}
                  >
                    {value === "DAILY" && (
                      <Flame
                        className={`h-3 w-3 ${
                          active
                            ? "text-rose-300"
                            : "text-rose-400/70"
                        }`}
                      />
                    )}

                    {label}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Rank filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="mr-1 flex shrink-0 items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-600">
              <Filter className="h-3 w-3" />
              Rank
            </span>

            {(
              ["ALL", "E", "D", "C", "B", "A", "S"] as const
            ).map((rank) => {
              const active = selectedRank === rank;

              return (
                <motion.button
                  key={rank}
                  type="button"
                  onClick={() => setSelectedRank(rank)}
                  whileTap={{ scale: 0.9 }}
                  className={`flex h-7 min-w-7 shrink-0 items-center justify-center rounded-lg border px-2 font-mono text-[10px] font-bold transition-all ${
                    active
                      ? "border-violet-400/40 bg-violet-500/15 text-violet-200 shadow-lg shadow-violet-950/20"
                      : "border-slate-800 bg-slate-950/50 text-slate-600 hover:border-slate-700 hover:text-slate-300"
                  }`}
                >
                  {rank}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quest summary */}
        <div className="relative mb-4 flex items-center justify-between text-[10px]">
          <div className="flex items-center gap-3 text-slate-600">
            <span>
              {filteredQuests.length} total
            </span>

            {completedCount > 0 && (
              <span className="flex items-center gap-1 text-emerald-400/70">
                <CheckCircle2 className="h-3 w-3" />

                {completedCount} completed
              </span>
            )}
          </div>

          <span className="font-mono text-slate-700">
            HUNTER_PROTOCOL // QUEST_LOG
          </span>
        </div>

        {/* Quest list */}
        <motion.div
          layout
          className="relative space-y-2.5"
        >
          <AnimatePresence mode="popLayout">
            {filteredQuests.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="rounded-2xl border border-dashed border-slate-800 bg-black/20 px-5 py-14 text-center"
              >
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-slate-800 bg-slate-950">
                  <Award className="h-6 w-6 text-slate-700" />
                </div>

                <p className="text-sm font-bold text-slate-400">
                  No quests in this classification.
                </p>

                <p className="mx-auto mt-1 max-w-sm text-xs leading-relaxed text-slate-600">
                  The quest log is silent. Post a new bounty to
                  continue your advancement.
                </p>
              </motion.div>
            ) : (
              filteredQuests.map((quest, index) => {
                const rank = rankColors[quest.rank];
                const CategoryIcon =
                  categoryIcons[quest.category] || Brain;
                const category =
                  categoryStyles[quest.category];
                const isDone =
                  quest.status === "COMPLETED";
                const isCompleting =
                  completingId === quest.id;
                const showReward =
                  rewardBurst === quest.id;

                return (
                  <motion.div
                    layout
                    key={quest.id}
                    initial={{
                      opacity: 0,
                      y: 12,
                    }}
                    animate={{
                      opacity: isDone ? 0.55 : 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.97,
                    }}
                    transition={{
                      duration: 0.25,
                      delay: Math.min(index * 0.035, 0.2),
                    }}
                    whileHover={
                      !isDone
                        ? {
                            y: -2,
                          }
                        : undefined
                    }
                    className={`group relative overflow-hidden rounded-2xl border p-3.5 transition-all duration-300 sm:p-4 ${
                      isDone
                        ? "border-slate-800/50 bg-slate-950/30"
                        : `border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950/80 hover:shadow-xl ${rank.glow}`
                    }`}
                  >
                    {/* Completion sweep */}
                    <AnimatePresence>
                      {isCompleting && (
                        <motion.div
                          initial={{
                            x: "-100%",
                            opacity: 0,
                          }}
                          animate={{
                            x: "100%",
                            opacity: [0, 0.35, 0],
                          }}
                          exit={{ opacity: 0 }}
                          transition={{
                            duration: 0.65,
                            ease: "easeInOut",
                          }}
                          className="pointer-events-none absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-violet-400/30 to-transparent"
                        />
                      )}
                    </AnimatePresence>

                    {/* Reward burst */}
                    <AnimatePresence>
                      {showReward && (
                        <div className="pointer-events-none absolute right-5 top-1/2 z-20 -translate-y-1/2">
                          <motion.div
                            initial={{
                              opacity: 0,
                              y: 10,
                              scale: 0.7,
                            }}
                            animate={{
                              opacity: [0, 1, 1, 0],
                              y: -55,
                              scale: [0.7, 1.1, 1],
                            }}
                            transition={{
                              duration: 0.85,
                              ease: "easeOut",
                            }}
                            className="flex flex-col items-end font-mono font-black"
                          >
                            <span className="text-sm text-cyan-300 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]">
                              +{quest.xpReward} XP
                            </span>

                            <span className="text-xs text-amber-300 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]">
                              +{quest.goldReward} GOLD
                            </span>
                          </motion.div>
                        </div>
                      )}
                    </AnimatePresence>

                    <div className="flex items-start gap-3">
                      {/* Completion button */}
                      <motion.button
                        type="button"
                        onClick={() => handleCheck(quest)}
                        disabled={
                          isDone || completingId !== null
                        }
                        whileTap={
                          !isDone
                            ? {
                                scale: 0.82,
                              }
                            : undefined
                        }
                        className="relative mt-0.5 shrink-0 rounded-full focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400/60 disabled:cursor-default"
                        title={
                          isDone
                            ? "Quest already completed"
                            : "Complete quest"
                        }
                      >
                        {isDone ? (
                          <motion.div
                            initial={{ scale: 0.7 }}
                            animate={{ scale: 1 }}
                            className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500/10"
                          >
                            <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                          </motion.div>
                        ) : (
                          <motion.div
                            animate={
                              isCompleting
                                ? {
                                    scale: [1, 1.2, 0.9, 1],
                                    rotate: [0, 8, -8, 0],
                                  }
                                : {}
                            }
                            transition={{
                              duration: 0.4,
                            }}
                            className="flex h-7 w-7 items-center justify-center rounded-full border border-slate-700 bg-slate-900 transition-colors group-hover:border-violet-400/50 group-hover:bg-violet-500/10"
                          >
                            {isCompleting ? (
                              <Check className="h-4 w-4 text-violet-300" />
                            ) : (
                              <Circle className="h-5 w-5 text-slate-600 transition-colors group-hover:text-violet-400" />
                            )}
                          </motion.div>
                        )}

                        {/* completion pulse */}
                        {isCompleting && (
                          <motion.div
                            initial={{
                              scale: 0.8,
                              opacity: 0.6,
                            }}
                            animate={{
                              scale: 2,
                              opacity: 0,
                            }}
                            transition={{
                              duration: 0.6,
                            }}
                            className="pointer-events-none absolute inset-0 rounded-full border border-violet-400"
                          />
                        )}
                      </motion.button>

                      {/* Quest content */}
                      <div className="min-w-0 flex-1">
                        {/* Badges */}
                        <div className="mb-2 flex flex-wrap items-center gap-1.5">
                          <span
                            className={`rounded-md border px-2 py-0.5 font-mono text-[9px] font-black tracking-wider ${rank.border} ${rank.bg} ${rank.text}`}
                          >
                            {quest.rank}-RANK
                          </span>

                          <span
                            className={`flex items-center gap-1 rounded-md border px-2 py-0.5 text-[9px] font-bold ${category.border} ${category.bg} ${category.color}`}
                          >
                            <CategoryIcon className="h-3 w-3" />

                            {quest.category}
                          </span>

                          {quest.isDaily && (
                            <span className="flex items-center gap-1 rounded-md border border-rose-500/20 bg-rose-500/10 px-2 py-0.5 text-[9px] font-bold text-rose-300">
                              <Flame className="h-3 w-3" />

                              Daily Rite
                            </span>
                          )}
                        </div>

                        {/* Title */}
                        <h4
                          className={`text-sm font-bold leading-snug transition-colors ${
                            isDone
                              ? "text-slate-500 line-through"
                              : "text-slate-100 group-hover:text-white"
                          }`}
                        >
                          {quest.title}
                        </h4>

                        {/* Description */}
                        {quest.description && (
                          <p
                            className={`mt-1 line-clamp-2 text-xs leading-relaxed ${
                              isDone
                                ? "text-slate-700"
                                : "text-slate-500"
                            }`}
                          >
                            {quest.description}
                          </p>
                        )}

                        {/* Mobile rewards */}
                        <div className="mt-3 flex items-center gap-3 sm:hidden">
                          <span className="font-mono text-[10px] font-bold text-cyan-400">
                            +{quest.xpReward} XP
                          </span>

                          <span className="font-mono text-[10px] font-bold text-amber-400">
                            +{quest.goldReward} GOLD
                          </span>
                        </div>
                      </div>

                      {/* Desktop rewards */}
                      <div className="hidden shrink-0 flex-col items-end gap-1 text-right sm:flex">
                        <span className="rounded-lg border border-cyan-400/10 bg-cyan-400/5 px-2.5 py-1 font-mono text-[10px] font-bold text-cyan-300">
                          +{quest.xpReward} XP
                        </span>

                        <span className="font-mono text-[10px] text-amber-400/80">
                          +{quest.goldReward} GOLD
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </motion.div>
      </motion.section>

      {/* Create Quest Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                closeModal();
              }
            }}
          >
            <motion.div
              initial={{
                opacity: 0,
                y: 25,
                scale: 0.96,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
              exit={{
                opacity: 0,
                y: 15,
                scale: 0.97,
              }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-violet-400/15 bg-[#111827] p-5 shadow-2xl shadow-black/60 sm:p-6"
            >
              {/* Modal glow */}
              <div className="pointer-events-none absolute -right-24 -top-24 h-48 w-48 rounded-full bg-violet-600/10 blur-3xl" />

              {/* Header */}
              <div className="relative flex items-start justify-between gap-4 border-b border-slate-800 pb-4">
                <div>
                  <div className="mb-1 flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-violet-400" />

                    <span className="text-[9px] font-black uppercase tracking-[0.25em] text-violet-300">
                      Hunter Protocol
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-white">
                    Post New Bounty
                  </h3>

                  <p className="mt-1 text-xs text-slate-500">
                    Convert a real-world objective into an
                    executable quest.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-800 bg-slate-950 p-2 text-slate-500 transition-colors hover:border-slate-700 hover:text-white"
                  aria-label="Close modal"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <form
                onSubmit={handleFormSubmit}
                className="relative mt-5 space-y-4"
              >
                {/* Title */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Bounty Title
                  </label>

                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(event) =>
                      setNewTitle(event.target.value)
                    }
                    placeholder="e.g. Finish today's DSA practice"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-700 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Description
                  </label>

                  <textarea
                    rows={3}
                    value={newDesc}
                    onChange={(event) =>
                      setNewDesc(event.target.value)
                    }
                    placeholder="Define the victory condition..."
                    className="w-full resize-none rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-3 text-sm text-white outline-none transition-colors placeholder:text-slate-700 focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/10"
                  />
                </div>

                {/* Category + Rank */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Attribute
                    </label>

                    <select
                      value={newCategory}
                      onChange={(event) =>
                        setNewCategory(
                          event.target.value as AttributeKey
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-xs font-medium text-white outline-none focus:border-violet-500/50"
                    >
                      <option value="INT">
                        INT — Coding / Study
                      </option>

                      <option value="STR">
                        STR — Gym / Workout
                      </option>

                      <option value="VIT">
                        VIT — Health / Sleep
                      </option>

                      <option value="AGI">
                        AGI — Speed / Chores
                      </option>

                      <option value="CHA">
                        CHA — Social / Meetings
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      Hunter Rank
                    </label>

                    <select
                      value={newRank}
                      onChange={(event) =>
                        setNewRank(
                          event.target.value as QuestRank
                        )
                      }
                      className="w-full appearance-none rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-3 text-xs font-medium text-white outline-none focus:border-violet-500/50"
                    >
                      <option value="E">
                        E — Quick
                      </option>

                      <option value="D">
                        D — Light
                      </option>

                      <option value="C">
                        C — Medium
                      </option>

                      <option value="B">
                        B — Solid
                      </option>

                      <option value="A">
                        A — High
                      </option>

                      <option value="S">
                        S — Major Milestone
                      </option>
                    </select>
                  </div>
                </div>

                {/* Daily toggle */}
                <label className="group flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-3.5 transition-colors hover:border-slate-700">
                  <input
                    type="checkbox"
                    checked={newIsDaily}
                    onChange={(event) =>
                      setNewIsDaily(event.target.checked)
                    }
                    className="h-4 w-4 rounded border-slate-700 bg-slate-950 text-violet-600 focus:ring-violet-500"
                  />

                  <div>
                    <p className="flex items-center gap-1.5 text-xs font-bold text-slate-300">
                      <Flame className="h-3.5 w-3.5 text-rose-400" />

                      Daily Rite
                    </p>

                    <p className="mt-0.5 text-[10px] text-slate-600">
                      Mark this as a recurring daily habit.
                    </p>
                  </div>
                </label>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 border-t border-slate-800 pt-4">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-xs font-bold text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
                  >
                    Cancel
                  </button>

                  <motion.button
                    type="submit"
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-900/20 transition-colors hover:bg-violet-500"
                  >
                    <Swords className="h-3.5 w-3.5" />

                    Publish Bounty
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}