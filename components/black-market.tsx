"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Coins,
  Sparkles,
  Shield,
  Zap,
  Coffee,
  Gamepad2,
  Moon,
  Utensils,
  Store,
  Check,
} from "lucide-react";

import type { ShopItem } from "@/types/game";

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

export function BlackMarket({
  items,
  userGold,
  onPurchaseItem,
}: BlackMarketProps) {
  const [filter, setFilter] = useState<"ALL" | "RELIC" | "REAL_WORLD">("ALL");
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const filteredItems = items.filter((item) => {
    if (filter === "RELIC" && item.type !== "RELIC") return false;
    if (filter === "REAL_WORLD" && item.type !== "REAL_WORLD") return false;
    return true;
  });

  const handleBuy = (item: ShopItem) => {
    if (userGold < item.cost || purchasingId) return;

    setPurchasingId(item.id);
    onPurchaseItem(item);
    setTimeout(() => setPurchasingId(null), 800);
  };

  return (
    <div className="space-y-6">
      {/* Shopkeeper Header Card */}
      <div className="card-duo-light p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 shadow-sm">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-700">
                Guild Merchant
              </span>
              <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[9px] font-black text-amber-800">
                Open 24/7
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Guild Black Market
            </h2>
            <p className="text-xs font-bold text-slate-600">
              Exchange your quest gold for streak shields, focus scrolls, and real-world perks.
            </p>
          </div>
        </div>

        {/* Current Gold Purse */}
        <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-amber-50 border-2 border-amber-200 shadow-sm shrink-0">
          <Coins className="w-5 h-5 text-amber-500 fill-amber-500" />
          <div>
            <span className="block text-[9px] font-black uppercase tracking-wider text-amber-700">
              Your Gold Purse
            </span>
            <span className="font-mono text-sm font-black text-amber-900">
              {userGold.toLocaleString()} 🪙
            </span>
          </div>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-2xl w-fit">
        {(
          [
            ["ALL", "All Goods"],
            ["RELIC", "Hunter Relics"],
            ["REAL_WORLD", "Real-World Perks"],
          ] as const
        ).map(([key, label]) => {
          const isActive = filter === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setFilter(key)}
              className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
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

      {/* Item Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const Icon = iconMap[item.iconSlug] || iconMap.default;
          const canAfford = userGold >= item.cost;
          const isBuying = purchasingId === item.id;
          const isRelic = item.type === "RELIC";

          return (
            <motion.div
              key={item.id}
              whileHover={{ y: -3 }}
              className="card-duo-light p-5 bg-white flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 ${
                      isRelic
                        ? "bg-purple-50 text-purple-600 border-purple-200"
                        : "bg-emerald-50 text-emerald-600 border-emerald-200"
                    }`}
                  >
                    <Icon className="h-6 w-6" />
                  </div>

                  <span
                    className={`rounded-lg px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      isRelic
                        ? "bg-purple-100 text-purple-800"
                        : "bg-emerald-100 text-emerald-800"
                    }`}
                  >
                    {isRelic ? "Relic" : "Perk"}
                  </span>
                </div>

                <h3 className="font-black text-base text-slate-900 leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Price & 3D Buy Button */}
              <div className="mt-5 pt-3 border-t-2 border-slate-100 flex items-center justify-between gap-3">
                <div className="flex items-center gap-1 font-mono font-black text-sm text-amber-700">
                  <Coins className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span>{item.cost}</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleBuy(item)}
                  disabled={!canAfford || isBuying}
                  className={`px-4 py-2 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all ${
                    isBuying
                      ? "btn-duo-green"
                      : canAfford
                      ? "btn-duo-amber shadow-sm"
                      : "bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed"
                  }`}
                >
                  {isBuying ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      Acquired!
                    </>
                  ) : canAfford ? (
                    `Buy Item`
                  ) : (
                    `Need ${item.cost - userGold} more`
                  )}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}