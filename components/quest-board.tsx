'use client';

import React, { useState } from 'react';
import { Quest, QuestRank, AttributeKey } from '@/types/game';
import { CheckCircle2, Circle, Plus, Filter, Flame, Award, Dumbbell, Brain, Heart, Zap, Crown } from 'lucide-react';
import { playSfx } from './audio-controller';

interface QuestBoardProps {
  quests: Quest[];
  onCompleteQuest: (questId: string) => void;
  onCreateQuest: (newQuest: Partial<Quest>) => void;
}

const rankColors: Record<QuestRank, { text: string; bg: string; border: string }> = {
  E: { text: 'text-slate-300', bg: 'bg-slate-800/80', border: 'border-slate-700' },
  D: { text: 'text-emerald-400', bg: 'bg-emerald-950/60', border: 'border-emerald-700/50' },
  C: { text: 'text-cyan-400', bg: 'bg-cyan-950/60', border: 'border-cyan-700/50' },
  B: { text: 'text-indigo-400', bg: 'bg-indigo-950/60', border: 'border-indigo-700/50' },
  A: { text: 'text-amber-400', bg: 'bg-amber-950/60', border: 'border-amber-700/50' },
  S: { text: 'text-purple-400', bg: 'bg-purple-950/60', border: 'border-purple-700/60' },
};

const categoryIcons: Record<AttributeKey, React.ElementType> = {
  STR: Dumbbell,
  INT: Brain,
  VIT: Heart,
  AGI: Zap,
  CHA: Crown,
};

export function QuestBoard({ quests, onCompleteQuest, onCreateQuest }: QuestBoardProps) {
  const [activeTab, setActiveTab] = useState<'ALL' | 'DAILY' | 'BOUNTY'>('ALL');
  const [selectedRank, setSelectedRank] = useState<QuestRank | 'ALL'>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState<AttributeKey>('INT');
  const [newRank, setNewRank] = useState<QuestRank>('C');
  const [newIsDaily, setNewIsDaily] = useState(false);

  const filteredQuests = quests.filter((q) => {
    if (activeTab === 'DAILY' && !q.isDaily) return false;
    if (activeTab === 'BOUNTY' && q.isDaily) return false;
    if (selectedRank !== 'ALL' && q.rank !== selectedRank) return false;
    return true;
  });

  const handleCheck = (quest: Quest) => {
    if (quest.status === 'COMPLETED') return;
    playSfx('complete');
    playSfx('attack');
    onCompleteQuest(quest.id);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onCreateQuest({
      title: newTitle,
      description: newDesc,
      category: newCategory,
      rank: newRank,
      isDaily: newIsDaily,
    });

    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl text-white">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-black tracking-tight flex items-center gap-2">
            <span>⚔️ Guild Quest Board</span>
            <span className="text-xs px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-normal">
              {filteredQuests.length} Active
            </span>
          </h2>
          <p className="text-xs text-slate-400">Complete bounties to level up stats, earn gold, and strike the raid boss.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Post Bounty</span>
          </button>
        </div>
      </div>

      {/* Tabs & Rank Filter */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        {/* Type Tabs */}
        <div className="flex items-center rounded-lg bg-slate-950 p-1 border border-slate-800 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'ALL' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            All Quests
          </button>
          <button
            onClick={() => setActiveTab('DAILY')}
            className={`flex items-center gap-1 px-3 py-1 rounded-md transition-all ${
              activeTab === 'DAILY' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Flame className="w-3 h-3 text-rose-400" />
            Daily Rites
          </button>
          <button
            onClick={() => setActiveTab('BOUNTY')}
            className={`px-3 py-1 rounded-md transition-all ${
              activeTab === 'BOUNTY' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hunter Bounties
          </button>
        </div>

        {/* Rank Filter Pills */}
        <div className="flex items-center gap-1 text-[11px] font-mono">
          <span className="text-slate-400 mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" />
            Rank:
          </span>
          {(['ALL', 'E', 'D', 'C', 'B', 'A', 'S'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRank(r)}
              className={`px-2 py-0.5 rounded transition-all ${
                selectedRank === r
                  ? 'bg-slate-200 text-slate-900 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Quest List */}
      <div className="space-y-2.5">
        {filteredQuests.length === 0 ? (
          <div className="text-center py-10 rounded-lg border border-dashed border-slate-800 bg-slate-950/40">
            <Award className="w-8 h-8 text-slate-600 mx-auto mb-2" />
            <p className="text-sm text-slate-400 font-bold">No quests in this classification.</p>
            <p className="text-xs text-slate-500">Post a new bounty to continue advancing.</p>
          </div>
        ) : (
          filteredQuests.map((quest) => {
            const rank = rankColors[quest.rank];
            const CategoryIcon = categoryIcons[quest.category] || Brain;
            const isDone = quest.status === 'COMPLETED';

            return (
              <div
                key={quest.id}
                className={`rounded-lg border p-3 flex items-start justify-between gap-3 transition-all ${
                  isDone
                    ? 'border-slate-800/50 bg-slate-950/40 opacity-60'
                    : 'border-slate-800 bg-slate-950/80 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => handleCheck(quest)}
                    disabled={isDone}
                    className="mt-0.5 focus:outline-none transition-transform active:scale-90"
                    title={isDone ? "Quest already completed" : "Mark quest completed"}
                  >
                    {isDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-500 hover:text-indigo-400" />
                    )}
                  </button>

                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[10px] font-mono font-black px-1.5 py-0.5 rounded border ${rank.border} ${rank.bg} ${rank.text}`}>
                        {quest.rank}-RANK
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                        <CategoryIcon className="w-3.5 h-3.5 text-cyan-400" />
                        {quest.category}
                      </span>
                      {quest.isDaily && (
                        <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 font-semibold border border-rose-500/30">
                          <Flame className="w-2.5 h-2.5 text-rose-400" />
                          Daily Rite
                        </span>
                      )}
                    </div>
                    <h4 className={`text-sm font-bold ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                      {quest.title}
                    </h4>
                    {quest.description && (
                      <p className="text-xs text-slate-400 mt-0.5">{quest.description}</p>
                    )}
                  </div>
                </div>

                {/* Reward pill */}
                <div className="text-right whitespace-nowrap font-mono text-xs flex flex-col items-end">
                  <span className="text-cyan-300 font-bold">+{quest.xpReward} XP</span>
                  <span className="text-amber-400">+{quest.goldReward} Gold</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* New Quest Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-white">
            <h3 className="text-lg font-black mb-1">Post New Hunter Bounty</h3>
            <p className="text-xs text-slate-400 mb-4">Add a real-world task to your quest log.</p>

            <form onSubmit={handleFormSubmit} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Bounty Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Implement PostgreSQL Database"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Description (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Details and victory conditions..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Attribute Stat</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as AttributeKey)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="INT">Intellect (Coding/Study)</option>
                    <option value="STR">Strength (Gym/Workout)</option>
                    <option value="VIT">Vitality (Health/Sleep)</option>
                    <option value="AGI">Agility (Speed/Chores)</option>
                    <option value="CHA">Charisma (Social/Meetings)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300 block mb-1">Hunter Rank</label>
                  <select
                    value={newRank}
                    onChange={(e) => setNewRank(e.target.value as QuestRank)}
                    className="w-full rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                  >
                    <option value="E">E-Rank (Quick - 15 XP)</option>
                    <option value="D">D-Rank (Light - 25 XP)</option>
                    <option value="C">C-Rank (Medium - 40 XP)</option>
                    <option value="B">B-Rank (Solid - 75 XP)</option>
                    <option value="A">A-Rank (High - 120 XP)</option>
                    <option value="S">S-Rank (Major Milestone - 250 XP)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isDailyCheck"
                  checked={newIsDaily}
                  onChange={(e) => setNewIsDaily(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <label htmlFor="isDailyCheck" className="text-xs text-slate-300 font-medium">
                  This is a Daily Rite (Recurring daily habit)
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white shadow-md"
                >
                  Publish Bounty
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
