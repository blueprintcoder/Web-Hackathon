'use client';

import React from 'react';
import { ShopItem } from '@/types/game';
import { Coins, Sparkles, Coffee, Shield, Zap, Gamepad2, Utensils, Moon } from 'lucide-react';
import { playSfx } from './audio-controller';

interface BlackMarketProps {
  items: ShopItem[];
  userGold: number;
  onPurchaseItem: (item: ShopItem) => void;
}

const iconMap: Record<string, React.ElementType> = {
  scroll: Sparkles,
  shield: Shield,
  potion: Zap,
  gamepad: Gamepad2,
  pizza: Utensils,
  moon: Moon,
  default: Coffee,
};

export function BlackMarket({ items, userGold, onPurchaseItem }: BlackMarketProps) {
  const relics = items.filter((i) => i.type === 'RELIC');
  const realWorld = items.filter((i) => i.type === 'REAL_WORLD');

  const handleBuy = (item: ShopItem) => {
    if (userGold < item.cost) {
      alert(`Insufficient Gold! You need ${item.cost} Gold, but only have ${userGold}.`);
      return;
    }
    playSfx('coin');
    onPurchaseItem(item);
  };

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-xl text-white">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-2.5">
        <div>
          <h3 className="text-base font-black tracking-tight flex items-center gap-2">
            <span>🛒 Guild Black Market</span>
            <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-normal">
              Dual Economy
            </span>
          </h3>
          <p className="text-xs text-slate-400">
            Exchange your earned bounty gold for in-game relics and real-world permissions.
          </p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold">
          <Coins className="w-3.5 h-3.5 text-amber-400" />
          <span>{userGold} Gold Available</span>
        </div>
      </div>

      {/* Section A: Virtual Relics */}
      <div className="mb-4">
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Virtual Relics & Artifacts</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {relics.map((item) => {
            const Icon = iconMap[item.iconSlug] || iconMap.default;
            const canAfford = userGold >= item.cost;
            return (
              <div
                key={item.id}
                className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-md bg-indigo-950/80 border border-indigo-700/50 flex items-center justify-center text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    {item.statBoost && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        {item.statBoost}
                      </span>
                    )}
                  </div>
                  <h5 className="font-bold text-xs text-white mb-0.5">{item.name}</h5>
                  <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-amber-400 flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-500" />
                    {item.cost}
                  </span>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      canAfford
                        ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    Acquire
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section B: Real-World Rewards */}
      <div>
        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <Coffee className="w-3.5 h-3.5" />
          <span>Real-World Custom Rewards (Section 9.4)</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {realWorld.map((item) => {
            const Icon = iconMap[item.iconSlug] || iconMap.default;
            const canAfford = userGold >= item.cost;
            return (
              <div
                key={item.id}
                className="rounded-lg border border-slate-800 bg-slate-950/70 p-3 flex flex-col justify-between hover:border-slate-700 transition-all"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div className="w-8 h-8 rounded-md bg-emerald-950/80 border border-emerald-700/50 flex items-center justify-center text-emerald-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Real Life
                    </span>
                  </div>
                  <h5 className="font-bold text-xs text-white mb-0.5">{item.name}</h5>
                  <p className="text-[11px] text-slate-400 leading-snug">{item.description}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800 flex items-center justify-between">
                  <span className="font-mono text-xs font-black text-amber-400 flex items-center gap-1">
                    <Coins className="w-3 h-3 text-amber-500" />
                    {item.cost}
                  </span>
                  <button
                    onClick={() => handleBuy(item)}
                    disabled={!canAfford}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition-all ${
                      canAfford
                        ? 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                    }`}
                  >
                    Redeem
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
