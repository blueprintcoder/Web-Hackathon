"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Backpack,
  Check,
  Coins,
  Gem,
  Shield,
  Sparkles,
  Sword,
  Zap,
  Coffee,
  Gamepad2,
  Moon,
  Utensils,
  ScrollText,
  FlaskConical,
} from "lucide-react";

import type { InventoryItem } from "@/types/game";
import { playSfx } from "@/lib/audio";

interface InventoryProps {
  items: InventoryItem[];
  onToggleEquip: (inventoryId: string) => void;
}

function getItemIcon(iconSlug: string) {
  const icons: Record<string, React.ElementType> = {
    shield: Shield,
    sword: Sword,
    sparkles: Sparkles,
    gem: Gem,
    zap: Zap,
    scroll: ScrollText,
    potion: FlaskConical,
    coffee: Coffee,
    utensils: Utensils,
    gamepad: Gamepad2,
    moon: Moon,
  };
  return icons[iconSlug] || Gem;
}

export function Inventory({ items, onToggleEquip }: InventoryProps) {
  const [filter, setFilter] = useState<"ALL" | "EQUIPPED" | "RELIC">("ALL");

  const filteredItems = items.filter((inv) => {
    if (filter === "EQUIPPED" && !inv.equipped) return false;
    if (filter === "RELIC" && inv.item.type !== "RELIC") return false;
    return true;
  });

  const handleEquipClick = (id: string) => {
    playSfx("complete");
    onToggleEquip(id);
  };

  return (
    <div className="space-y-6">
      {/* Vault Header */}
      <div className="card-duo-light p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-100 text-sky-700 shadow-sm">
            <Backpack className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-sky-700">
                Hunter Gear
              </span>
              <span className="rounded-full bg-sky-100 px-2 py-0.5 text-[9px] font-black text-sky-800">
                {items.length} Items Total
              </span>
            </div>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              Hunter Vault & Backpack
            </h2>
            <p className="text-xs font-bold text-slate-600">
              Equip passive artifacts to amplify XP, preserve streaks, and empower attributes.
            </p>
          </div>
        </div>

        {/* Quick Filter */}
        <div className="flex items-center gap-2 bg-slate-200/70 p-1 rounded-2xl">
          {(
            [
              ["ALL", "All Items"],
              ["EQUIPPED", "Equipped Only"],
              ["RELIC", "Relics"],
            ] as const
          ).map(([key, label]) => {
            const isActive = filter === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setFilter(key)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
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
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="card-duo-light p-12 text-center bg-white">
          <Backpack className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="font-black text-slate-700 text-base">
            No items in this category
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            {items.length === 0
              ? "Your vault is currently empty. Visit the Black Market tab to purchase your first relic or perk with gold!"
              : "Try switching the filter above to view all items."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((invItem) => {
              const item = invItem.item;
              const Icon = getItemIcon(item.iconSlug);
              const isRelic = item.type === "RELIC";

              return (
                <motion.div
                  key={invItem.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`card-duo-light p-5 bg-white flex flex-col justify-between transition-all ${
                    invItem.equipped
                      ? "border-emerald-500 ring-2 ring-emerald-400/30"
                      : ""
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl border-2 ${
                          invItem.equipped
                            ? "bg-emerald-50 text-emerald-600 border-emerald-300"
                            : "bg-slate-50 text-slate-600 border-slate-200"
                        }`}
                      >
                        <Icon className="h-6 w-6" />
                      </div>

                      {invItem.equipped ? (
                        <span className="rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" />
                          Equipped
                        </span>
                      ) : (
                        <span className="rounded-full bg-slate-100 text-slate-600 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider">
                          {isRelic ? "Relic" : "Perk"}
                        </span>
                      )}
                    </div>

                    <h3 className="font-black text-base text-slate-900 leading-snug">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-600 font-medium mt-1 leading-relaxed">
                      {item.description}
                    </p>

                    {invItem.charges !== undefined && (
                      <p className="mt-2 text-[11px] font-black text-purple-700 bg-purple-50 border border-purple-200 rounded-lg px-2 py-1 inline-block">
                        Charges: {invItem.charges} remaining
                      </p>
                    )}
                  </div>

                  {/* Action button */}
                  <div className="mt-5 pt-3 border-t-2 border-slate-100">
                    {isRelic ? (
                      <button
                        type="button"
                        onClick={() => handleEquipClick(invItem.id)}
                        className={`w-full py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all ${
                          invItem.equipped
                            ? "btn-duo-white text-rose-600 border-rose-200 hover:bg-rose-50"
                            : "btn-duo-blue"
                        }`}
                      >
                        {invItem.equipped ? "Unequip Relic" : "Equip Relic"}
                      </button>
                    ) : (
                      <div className="text-center py-2 text-xs font-black text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                        Ready to Enjoy in Real Life!
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}