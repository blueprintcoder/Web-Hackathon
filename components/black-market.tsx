"use client";

import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Coins,
  Coffee,
  Gamepad2,
  Moon,
  Package,
  Shield,
  Sparkles,
  Utensils,
  X,
  Zap,
} from "lucide-react";

import type { ShopItem } from "@/types/game";
import { playSfx } from "./audio-controller";

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

const rarityStyles = {
  RELIC: {
    card: "border-violet-500/15 hover:border-violet-400/35",
    icon: "border-violet-400/20 bg-violet-500/10 text-violet-300",
    badge: "border-violet-400/20 bg-violet-400/5 text-violet-300",
    button:
      "border-violet-400/25 bg-violet-500/10 text-violet-200 hover:bg-violet-500/20",
  },
  REAL_WORLD: {
    card: "border-emerald-500/15 hover:border-emerald-400/30",
    icon: "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    badge: "border-emerald-400/20 bg-emerald-400/5 text-emerald-300",
    button:
      "border-emerald-400/25 bg-emerald-500/10 text-emerald-200 hover:bg-emerald-500/20",
  },
};

export function BlackMarket({
  items,
  userGold,
  onPurchaseItem,
}: BlackMarketProps) {
  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
    item?: ShopItem;
  } | null>(null);

  const [buyingId, setBuyingId] = useState<string | null>(null);

  const relics = items.filter((item) => item.type === "RELIC");
  const realWorld = items.filter(
    (item) => item.type === "REAL_WORLD"
  );

  const showNotice = (
    type: "success" | "error",
    message: string,
    item?: ShopItem
  ) => {
    setNotice({
      type,
      message,
      item,
    });

    window.setTimeout(() => {
      setNotice(null);
    }, 2600);
  };

  const handleBuy = (item: ShopItem) => {
    if (buyingId) return;

    if (userGold < item.cost) {
      playSfx("attack");

      showNotice(
        "error",
        `Insufficient Gold — you need ${item.cost - userGold} more.`,
        item
      );

      return;
    }

    setBuyingId(item.id);

    playSfx("coin");

    window.setTimeout(() => {
      onPurchaseItem(item);

      showNotice(
        "success",
        `${item.name} acquired successfully.`,
        item
      );

      setBuyingId(null);
    }, 250);
  };

  const renderItem = (item: ShopItem) => {
    const Icon = iconMap[item.iconSlug] || iconMap.default;
    const canAfford = userGold >= item.cost;
    const isBuying = buyingId === item.id;
    const style =
      item.type === "RELIC"
        ? rarityStyles.RELIC
        : rarityStyles.REAL_WORLD;

    return (
      <motion.article
        key={item.id}
        layout
        initial={{
          opacity: 0,
          y: 15,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        whileHover={
          !isBuying
            ? {
                y: -4,
              }
            : undefined
        }
        transition={{
          duration: 0.3,
        }}
        className={`group relative overflow-hidden rounded-2xl border bg-slate-950/50 p-4 transition-all duration-300 hover:bg-slate-950/80 ${style.card}`}
      >
        {/* Card glow */}
        <div
          className={`pointer-events-none absolute -right-12 -top-12 h-28 w-28 rounded-full blur-3xl ${
            item.type === "RELIC"
              ? "bg-violet-500/10"
              : "bg-emerald-500/10"
          }`}
        />

        {/* Item */}
        <div className="relative">
          <div className="flex items-start justify-between gap-3">
            <motion.div
              whileHover={{
                rotate: 5,
                scale: 1.05,
              }}
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${style.icon}`}
            >
              <Icon className="h-5 w-5" />
            </motion.div>

            <div className="flex flex-col items-end gap-1">
              <span
                className={`rounded-md border px-2 py-1 text-[8px] font-black uppercase tracking-[0.15em] ${style.badge}`}
              >
                {item.type === "RELIC"
                  ? "Virtual Relic"
                  : "Real World"}
              </span>

              {item.statBoost && (
                <span className="rounded-md border border-amber-400/15 bg-amber-400/5 px-2 py-1 font-mono text-[8px] font-bold text-amber-300">
                  {item.statBoost}
                </span>
              )}
            </div>
          </div>

          <h4 className="mt-4 text-sm font-black text-white transition-colors group-hover:text-slate-100">
            {item.name}
          </h4>

          <p className="mt-1.5 min-h-[38px] text-[11px] leading-relaxed text-slate-500">
            {item.description}
          </p>

          {/* Purchase area */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <div>
              <p className="text-[8px] font-bold uppercase tracking-wider text-slate-700">
                Acquisition Cost
              </p>

              <div className="mt-0.5 flex items-center gap-1.5">
                <Coins className="h-3.5 w-3.5 text-amber-400" />

                <span
                  className={`font-mono text-sm font-black ${
                    canAfford
                      ? "text-amber-300"
                      : "text-rose-400"
                  }`}
                >
                  {item.cost}
                </span>

                <span className="text-[9px] text-slate-700">
                  GOLD
                </span>
              </div>
            </div>

            <motion.button
              type="button"
              disabled={!canAfford || buyingId !== null}
              onClick={() => handleBuy(item)}
              whileHover={
                canAfford && !buyingId
                  ? {
                      scale: 1.03,
                    }
                  : undefined
              }
              whileTap={
                canAfford
                  ? {
                      scale: 0.96,
                    }
                  : undefined
              }
              className={`inline-flex min-w-[82px] items-center justify-center gap-1.5 rounded-xl border px-3 py-2 text-[10px] font-bold transition-all ${
                !canAfford
                  ? "cursor-not-allowed border-slate-800 bg-slate-900 text-slate-600"
                  : style.button
              }`}
            >
              {isBuying ? (
                <>
                  <motion.div
                    animate={{
                      rotate: 360,
                    }}
                    transition={{
                      duration: 0.7,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="h-3 w-3 rounded-full border border-current border-t-transparent"
                  />

                  Acquiring
                </>
              ) : !canAfford ? (
                "Locked"
              ) : (
                <>
                  <Package className="h-3 w-3" />

                  {item.type === "RELIC"
                    ? "Acquire"
                    : "Redeem"}
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Insufficient gold indicator */}
        {!canAfford && (
          <div className="relative mt-3 rounded-lg border border-rose-500/10 bg-rose-500/[0.03] px-2.5 py-2">
            <p className="text-[9px] text-rose-400/70">
              Insufficient gold — earn more through quests.
            </p>
          </div>
        )}
      </motion.article>
    );
  };

  return (
    <motion.section
      id="black-market"
      initial={{
        opacity: 0,
        y: 20,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      className="relative overflow-hidden rounded-3xl border border-amber-500/10 bg-[#111827]/90 p-4 shadow-2xl shadow-black/30 backdrop-blur-xl sm:p-5 lg:p-6"
    >
      {/* Ambient effects */}
      <div className="pointer-events-none absolute -right-32 -top-32 h-72 w-72 rounded-full bg-amber-500/5 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-violet-600/5 blur-3xl" />

      {/* Purchase notification */}
      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{
              opacity: 0,
              y: -15,
              scale: 0.96,
            }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              y: -10,
              scale: 0.97,
            }}
            className={`fixed right-4 top-4 z-[120] flex max-w-sm items-center gap-3 rounded-2xl border px-4 py-3 shadow-2xl backdrop-blur-xl ${
              notice.type === "success"
                ? "border-emerald-400/20 bg-[#0b1a16]/95"
                : "border-rose-400/20 bg-[#1a0b10]/95"
            }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                notice.type === "success"
                  ? "bg-emerald-400/10 text-emerald-300"
                  : "bg-rose-400/10 text-rose-300"
              }`}
            >
              {notice.type === "success" ? (
                <Check className="h-4 w-4" />
              ) : (
                <X className="h-4 w-4" />
              )}
            </div>

            <div className="min-w-0">
              <p
                className={`text-[9px] font-black uppercase tracking-[0.18em] ${
                  notice.type === "success"
                    ? "text-emerald-300"
                    : "text-rose-300"
                }`}
              >
                {notice.type === "success"
                  ? "Acquisition Complete"
                  : "Transaction Denied"}
              </p>

              <p className="mt-0.5 text-xs text-slate-400">
                {notice.message}
              </p>
            </div>

            {notice.item && (
              <div className="hidden text-right sm:block">
                <Coins className="ml-auto h-3.5 w-3.5 text-amber-400" />

                <span className="font-mono text-[9px] text-amber-300">
                  {notice.item.cost} G
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative mb-6 flex flex-col gap-4 border-b border-slate-800/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="mb-1.5 flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-amber-300">
              Guild Economy
            </span>

            <span className="rounded-full border border-amber-400/15 bg-amber-400/5 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider text-amber-300/80">
              Dual Economy
            </span>
          </div>

          <h3 className="flex items-center gap-2 text-xl font-black tracking-tight text-white sm:text-2xl">
            <span className="text-amber-400">◆</span>
            Black Market
          </h3>

          <p className="mt-1 max-w-2xl text-xs leading-relaxed text-slate-500">
            Exchange earned bounty gold for relics, artifacts,
            and real-world rewards.
          </p>
        </div>

        {/* Wallet */}
        <motion.div
          key={userGold}
          initial={{
            scale: 1.04,
          }}
          animate={{
            scale: 1,
          }}
          className="flex items-center gap-3 self-start rounded-2xl border border-amber-400/15 bg-amber-400/[0.04] px-4 py-3"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-amber-400/15 bg-amber-400/5">
            <Coins className="h-4 w-4 text-amber-300" />
          </div>

          <div>
            <p className="text-[8px] font-bold uppercase tracking-[0.18em] text-slate-600">
              Hunter Treasury
            </p>

            <p className="font-mono text-base font-black text-amber-200">
              {userGold.toLocaleString()}
              <span className="ml-1 text-[9px] text-amber-400/50">
                GOLD
              </span>
            </p>
          </div>
        </motion.div>
      </div>

      {/* Relics */}
      <div className="relative mb-7">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-violet-400/15 bg-violet-400/5">
              <Sparkles className="h-3.5 w-3.5 text-violet-300" />
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.16em] text-violet-300">
                Virtual Relics
              </h4>

              <p className="text-[9px] text-slate-600">
                Artifacts that enhance the Hunter.
              </p>
            </div>
          </div>

          <span className="font-mono text-[9px] text-slate-700">
            {relics.length} ITEMS
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {relics.map(renderItem)}
        </div>
      </div>

      {/* Real world */}
      <div className="relative">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-emerald-400/15 bg-emerald-400/5">
              <Coffee className="h-3.5 w-3.5 text-emerald-300" />
            </div>

            <div>
              <h4 className="text-xs font-black uppercase tracking-[0.16em] text-emerald-300">
                Real-World Rewards
              </h4>

              <p className="text-[9px] text-slate-600">
                Convert progression into real-life permissions.
              </p>
            </div>
          </div>

          <span className="font-mono text-[9px] text-slate-700">
            {realWorld.length} ITEMS
          </span>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {realWorld.map(renderItem)}
        </div>
      </div>
    </motion.section>
  );
}