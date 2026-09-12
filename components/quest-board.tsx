"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Brain,
  Check,
  Circle,
  Crown,
  Dumbbell,
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
import { ShadowFamiliar } from "@/components/shadow-familiar";

interface QuestBoardProps {
  quests: Quest[];
  characterLevel?: number;
  onCompleteQuest: (questId: string) => void;
  onCreateQuest: (newQuest: Partial<Quest>) => void;
}

const rankStyles: Record<
  QuestRank,
  {
    text: string;
    bg: string;
    border: string;
  }
> = {
  E: { text: "text-slate-600", bg: "bg-slate-100", border: "border-slate-300" },
  D: { text: "text-emerald-700", bg: "bg-emerald-100", border: "border-emerald-300" },
  C: { text: "text-sky-700", bg: "bg-sky-100", border: "border-sky-300" },
  B: { text: "text-indigo-700", bg: "bg-indigo-100", border: "border-indigo-300" },
  A: { text: "text-amber-700", bg: "bg-amber-100", border: "border-amber-300" },
  S: { text: "text-purple-700", bg: "bg-purple-100", border: "border-purple-300" },
};

const categoryIcons: Record<AttributeKey, React.ElementType> = {
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
  STR: { color: "text-rose-700", bg: "bg-rose-50", border: "border-rose-200" },
  INT: { color: "text-sky-700", bg: "bg-sky-50", border: "border-sky-200" },
  VIT: { color: "text-emerald-700", bg: "bg-emerald-50", border: "border-emerald-200" },
  AGI: { color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200" },
  CHA: { color: "text-pink-700", bg: "bg-pink-50", border: "border-pink-200" },
};

export function QuestBoard({
  quests,
  characterLevel = 1,
  onCompleteQuest,
  onCreateQuest,
}: QuestBoardProps) {
  const [activeTab, setActiveTab] = useState<"ALL" | "DAILY" | "BOUNTY">("ALL");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [rewardBurst, setRewardBurst] = useState<string | null>(null);

  // Form state
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [newCategory, setNewCategory] = useState<AttributeKey>("INT");
  const [newRank, setNewRank] = useState<QuestRank>("C");
  const [newIsDaily, setNewIsDaily] = useState(false);

  // Daily statistics
  const dailyQuests = quests.filter((q) => q.isDaily);
  const completedDailyCount = dailyQuests.filter((q) => q.status === "COMPLETED").length;
  const totalDailyCount = dailyQuests.length;
  const dailyProgressPercent =
    totalDailyCount > 0
      ? Math.round((completedDailyCount / totalDailyCount) * 100)
      : 100;

  // Filtered Quests
  const filteredQuests = quests.filter((quest) => {
    if (activeTab === "DAILY" && !quest.isDaily) return false;
    if (activeTab === "BOUNTY" && quest.isDaily) return false;
    return true;
  });

  const handleCheck = (quest: Quest) => {
    if (quest.status === "COMPLETED" || completingId !== null) return;

    setCompletingId(quest.id);
    setRewardBurst(quest.id);

    window.setTimeout(() => {
      onCompleteQuest(quest.id);
    }, 200);

    window.setTimeout(() => {
      setCompletingId(null);
    }, 600);

    window.setTimeout(() => {
      setRewardBurst(null);
    }, 900);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

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

  return (
    <div className="space-y-6">
      {/* ============================================================
          DUOLINGO CHEER & DAILY HABIT GOAL HERO CARD
      ============================================================ */}
      <div className="card-duo-light p-5 sm:p-6 bg-white relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Mascot Companion */}
            <div className="shrink-0">
              <ShadowFamiliar level={characterLevel} />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-emerald-700">
                  Kage • Shadow Familiar
                </span>
                <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-black text-emerald-800">
                  Lv {characterLevel}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                {dailyProgressPercent === 100
                  ? "All Daily Rites Complete! You are legendary! 🔥"
                  : `Clear your habits to charge boss attacks!`}
              </h2>
              <p className="text-xs font-bold text-slate-600 mt-0.5">
                {completedDailyCount} of {totalDailyCount} daily goals done today • Click Kage to pet!
              </p>
            </div>
          </div>

          {/* Quick Post Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="btn-duo-green px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-2 shrink-0 self-stretch sm:self-auto justify-center"
          >
            <Plus className="w-4 h-4" />
            Post Bounty
          </button>
        </div>

        {/* Glossy Juicy Progress Bar */}
        <div className="mt-5">
          <div className="flex justify-between items-center text-xs font-black text-slate-600 mb-1.5">
            <span>Daily Rite Progress</span>
            <span className="text-emerald-700">{dailyProgressPercent}% Complete</span>
          </div>

          <div className="h-4 w-full bg-slate-100 rounded-full border-2 border-slate-200 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${dailyProgressPercent}%` }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="h-full bg-[#58cc02] bar-juicy rounded-full"
            />
          </div>
        </div>
      </div>

      {/* ============================================================
          FILTER PILLS & STATS ROW
      ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Tactile Tab Buttons */}
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-2xl">
          {(
            [
              ["ALL", `All Quests (${quests.length})`],
              ["DAILY", `Daily Habits (${dailyQuests.length})`],
              ["BOUNTY", `Bounties (${quests.length - dailyQuests.length})`],
            ] as const
          ).map(([tab, label]) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  isActive
                    ? "bg-white text-slate-900 shadow-sm border border-slate-200/80"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <p className="text-xs font-bold text-slate-600">
          Showing {filteredQuests.length} objective{filteredQuests.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ============================================================
          QUEST CARDS LIST
      ============================================================ */}
      <div className="space-y-3">
        <AnimatePresence mode="popLayout">
          {filteredQuests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="card-duo-light p-10 text-center"
            >
              <Swords className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <p className="text-sm font-black text-slate-700">
                No quests in this view.
              </p>
              <p className="text-xs text-slate-600 mt-1">
                Post a new bounty using the button above to begin training!
              </p>
            </motion.div>
          ) : (
            filteredQuests.map((quest) => {
              const isDone = quest.status === "COMPLETED";
              const isCompleting = completingId === quest.id;
              const isBursting = rewardBurst === quest.id;
              const CategoryIcon = categoryIcons[quest.category] || Brain;
              const catStyle = categoryStyles[quest.category];
              const rankStyle = rankStyles[quest.rank];

              return (
                <motion.div
                  key={quest.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{
                    opacity: isDone ? 0.6 : 1,
                    y: 0,
                  }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`card-duo-light p-4 flex items-center gap-3.5 sm:gap-4 relative overflow-hidden transition-all ${
                    isDone
                      ? "bg-slate-50/80 border-slate-200"
                      : "bg-white hover:border-slate-300"
                  }`}
                >
                  {/* Floating Reward Burst Animation */}
                  <AnimatePresence>
                    {isBursting && (
                      <motion.div
                        initial={{ opacity: 0, y: 0, scale: 0.8 }}
                        animate={{ opacity: 1, y: -45, scale: 1.15 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.75, ease: "easeOut" }}
                        className="absolute right-8 top-1/2 -translate-y-1/2 z-30 pointer-events-none flex flex-col items-end"
                      >
                        <span className="font-black text-sm text-sky-600 drop-shadow-sm">
                          +{quest.xpReward} XP
                        </span>
                        <span className="font-black text-xs text-amber-600 drop-shadow-sm">
                          +{quest.goldReward} GOLD
                        </span>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Tactile Checkbox Button */}
                  <button
                    type="button"
                    onClick={() => handleCheck(quest)}
                    disabled={isDone || completingId !== null}
                    aria-label={isDone ? "Completed" : "Complete Quest"}
                    className={`h-9 w-9 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
                      isDone
                        ? "bg-[#58cc02] border-[#46a302] text-white cursor-default"
                        : "border-slate-300 bg-white hover:border-[#58cc02] hover:bg-emerald-50 text-transparent active:scale-90"
                    }`}
                  >
                    {isDone ? (
                      <Check className="w-5 h-5 stroke-[3]" />
                    ) : isCompleting ? (
                      <Check className="w-5 h-5 text-emerald-600 stroke-[3] animate-pulse" />
                    ) : (
                      <Circle className="w-4 h-4 text-transparent" />
                    )}
                  </button>

                  {/* Quest Details */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-1.5 mb-1">
                      {/* Category Pill */}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider ${catStyle.bg} ${catStyle.color} border ${catStyle.border}`}
                      >
                        <CategoryIcon className="w-3 h-3" />
                        {quest.category}
                      </span>

                      {/* Rank Pill */}
                      <span
                        className={`px-1.5 py-0.5 rounded-lg text-[10px] font-black uppercase font-mono ${rankStyle.bg} ${rankStyle.text} border ${rankStyle.border}`}
                      >
                        Rank {quest.rank}
                      </span>

                      {/* Daily Pill */}
                      {quest.isDaily && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-200">
                          <Flame className="w-3 h-3 text-orange-600 fill-orange-500" />
                          Daily Rite
                        </span>
                      )}
                    </div>

                    <h3
                      className={`text-sm sm:text-base font-black leading-snug transition-all ${
                        isDone
                          ? "line-through text-slate-400"
                          : "text-slate-900"
                      }`}
                    >
                      {quest.title}
                    </h3>

                    {quest.description && (
                      <p className="text-xs text-slate-600 font-medium mt-0.5 line-clamp-2">
                        {quest.description}
                      </p>
                    )}
                  </div>

                  {/* Rewards Pills (Right) */}
                  <div className="shrink-0 flex sm:flex-col items-end gap-1.5">
                    <span className="px-2.5 py-1 rounded-xl bg-sky-50 border border-sky-200 text-sky-800 font-black font-mono text-xs">
                      +{quest.xpReward} XP
                    </span>
                    <span className="px-2.5 py-1 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-black font-mono text-xs">
                      +{quest.goldReward} 🪙
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* ============================================================
          DUOLINGO-STYLE CREATE QUEST MODAL
      ============================================================ */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm"
            onClick={(e) => {
              if (e.target === e.currentTarget) setIsModalOpen(false);
            }}
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="card-duo-light w-full max-w-lg p-6 bg-white shadow-2xl relative"
            >
              <div className="flex items-center justify-between border-b-2 border-slate-100 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900">
                      Post New Bounty
                    </h3>
                    <p className="text-[11px] font-bold text-slate-600">
                      Convert a real habit into RPG progression
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Quest Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="e.g. 45-minute Deep Coding Session"
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm font-bold text-slate-800 focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="What specific victory conditions must you achieve?"
                    className="w-full rounded-xl border-2 border-slate-200 px-3 py-2 text-sm text-slate-800 font-medium focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                {/* Category Selector */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Target Attribute
                  </label>
                  <div className="grid grid-cols-5 gap-2">
                    {(["INT", "STR", "VIT", "AGI", "CHA"] as AttributeKey[]).map(
                      (cat) => {
                        const Icon = categoryIcons[cat];
                        const isSelected = newCategory === cat;
                        return (
                          <button
                            key={cat}
                            type="button"
                            onClick={() => setNewCategory(cat)}
                            className={`p-2 rounded-xl border-2 flex flex-col items-center gap-1 font-black text-[11px] transition-all ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm"
                                : "border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                            {cat}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Rank Selector */}
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5">
                    Quest Rank
                  </label>
                  <div className="flex gap-1.5">
                    {(["E", "D", "C", "B", "A", "S"] as QuestRank[]).map(
                      (rk) => {
                        const isSelected = newRank === rk;
                        return (
                          <button
                            key={rk}
                            type="button"
                            onClick={() => setNewRank(rk)}
                            className={`flex-1 py-1.5 rounded-xl border-2 font-black font-mono text-xs transition-all ${
                              isSelected
                                ? "border-sky-500 bg-sky-50 text-sky-800"
                                : "border-slate-200 text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {rk}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Daily Rite Checkbox */}
                <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-slate-200 hover:bg-slate-50 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newIsDaily}
                    onChange={(e) => setNewIsDaily(e.target.checked)}
                    className="h-4 w-4 rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <div>
                    <span className="text-xs font-black text-slate-800">
                      Mark as Recurring Daily Rite
                    </span>
                    <p className="text-[11px] text-slate-600 font-medium">
                      Strengthens your daily habit streak counter every day
                    </p>
                  </div>
                </label>

                {/* Action Buttons */}
                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="btn-duo-white flex-1 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn-duo-green flex-1 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider"
                  >
                    Post Quest
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}