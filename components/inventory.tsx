'use client';

import React, {
  useMemo,
  useState,
} from 'react';

import {
  AnimatePresence,
  motion,
} from 'framer-motion';

import {
  Backpack,
  Check,
  Coins,
  Crown,
  Gem,
  Shield,
  Sparkles,
  Sword,
  Zap,
  Utensils,
  Coffee,
  Gamepad2,
  Moon,
  Lock,
  RotateCcw,
  ScrollText,
  FlaskConical,
} from 'lucide-react';

import {
  InventoryItem,
  ItemType,
} from '@/types/game';

import { playSfx } from '@/lib/audio';

interface InventoryProps {
  items: InventoryItem[];

  onToggleEquip:
    (
      inventoryId: string
    ) => void;
}

// ============================================================
// ITEM ICONS
// ============================================================

function getItemIcon(
  iconSlug: string
) {
  const icons:
    Record<
      string,
      React.ElementType
    > = {
      shield: Shield,

      sword: Sword,

      sparkles:
        Sparkles,

      gem: Gem,

      zap: Zap,

      crown: Crown,

      // Existing shop items
      scroll: ScrollText,

      potion:
        FlaskConical,

      coffee: Coffee,

      utensils:
        Utensils,

      gamepad:
        Gamepad2,

      moon: Moon,
    };

  return (
    icons[iconSlug] ||
    Gem
  );
}

// ============================================================
// ITEM TYPE LABEL
// ============================================================

function getItemTypeLabel(
  type: ItemType
) {
  return type ===
    'RELIC'
    ? 'VIRTUAL RELIC'
    : 'REAL-WORLD REWARD';
}

// ============================================================
// INVENTORY COMPONENT
// ============================================================

export function Inventory({
  items,
  onToggleEquip,
}: InventoryProps) {
  const [
    activeTab,
    setActiveTab,
  ] = useState<
    'ALL' |
    'RELIC' |
    'REAL_WORLD'
  >('ALL');

  const [
    selectedId,
    setSelectedId,
  ] = useState<
    string | null
  >(null);

  // ==========================================================
  // FILTER ITEMS
  // ==========================================================

  const filteredItems =
    useMemo(() => {
      if (
        activeTab ===
        'ALL'
      ) {
        return items;
      }

      return items.filter(
        (item) =>
          item.item.type ===
          activeTab
      );
    }, [
      items,
      activeTab,
    ]);

  // ==========================================================
  // COUNTS
  // ==========================================================

  const equippedCount =
    items.filter(
      (item) =>
        item.equipped
    ).length;

  // ==========================================================
  // EQUIP / UNEQUIP
  // ==========================================================

  const handleToggle = (
    item: InventoryItem
  ) => {
    setSelectedId(
      item.id
    );

    playSfx('coin');

    setTimeout(() => {
      onToggleEquip(
        item.id
      );

      setSelectedId(
        null
      );
    }, 150);
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <section
      id="inventory"
      className="relative overflow-hidden rounded-2xl border border-[#252B3D] bg-[#101421] shadow-2xl"
    >
      {/* ======================================================
          AMBIENT BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-violet-600/10 blur-3xl" />

      <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/5 blur-3xl" />

      {/* ======================================================
          HEADER
      ====================================================== */}

      <div className="relative border-b border-[#252B3D] px-5 py-5 sm:px-6">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          {/* Title */}
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10">
              <Backpack className="h-5 w-5 text-violet-400" />
            </div>

            <div>

              <div className="flex items-center gap-2">

                <h2 className="text-lg font-black tracking-tight text-white">
                  Hunter Inventory
                </h2>

                <span className="rounded-md border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-widest text-violet-300">
                  Arsenal
                </span>

              </div>

              <p className="mt-0.5 text-xs text-slate-500">
                Manage your acquired relics and real-world rewards.
              </p>

            </div>

          </div>

          {/* Stats */}
          <div className="flex items-center gap-2">

            <div className="rounded-lg border border-[#252B3D] bg-[#0B0E17] px-3 py-2">

              <div className="flex items-center gap-2">

                <Sparkles className="h-3.5 w-3.5 text-violet-400" />

                <span className="font-mono text-xs font-bold text-slate-300">
                  {items.length} Items
                </span>

              </div>

            </div>

            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">

              <div className="flex items-center gap-2">

                <Check className="h-3.5 w-3.5 text-emerald-400" />

                <span className="font-mono text-xs font-bold text-emerald-300">
                  {equippedCount} Equipped
                </span>

              </div>

            </div>

          </div>

        </div>

        {/* ====================================================
            TABS
        ==================================================== */}

        <div className="mt-5 flex gap-1 overflow-x-auto rounded-xl border border-[#252B3D] bg-[#0B0E17] p-1">

          {[
            {
              key: 'ALL',
              label: 'All Items',
            },
            {
              key: 'RELIC',
              label: 'Virtual Relics',
            },
            {
              key: 'REAL_WORLD',
              label: 'Real-World Rewards',
            },
          ].map((tab) => {

            const active =
              activeTab ===
              tab.key;

            return (
              <button
                key={
                  tab.key
                }
                onClick={() =>
                  setActiveTab(
                    tab.key as
                      typeof activeTab
                  )
                }
                className={`relative whitespace-nowrap rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition ${
                  active
                    ? 'bg-violet-500/15 text-violet-300'
                    : 'text-slate-500 hover:bg-white/[0.03] hover:text-slate-300'
                }`}
              >

                {active && (
                  <motion.div
                    layoutId="inventory-tab"
                    className="absolute inset-0 rounded-lg border border-violet-500/20"
                  />
                )}

                <span className="relative z-10">
                  {tab.label}
                </span>

              </button>
            );
          })}

        </div>

      </div>

      {/* ======================================================
          INVENTORY CONTENT
      ====================================================== */}

      <div className="relative p-5 sm:p-6">

        {filteredItems.length ===
        0 ? (

          <motion.div
            initial={{
              opacity: 0,
              y: 8,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            className="flex min-h-[220px] flex-col items-center justify-center rounded-xl border border-dashed border-[#252B3D] bg-[#0B0E17]"
          >

            <Backpack className="mb-3 h-9 w-9 text-slate-700" />

            <p className="text-sm font-bold text-slate-400">
              Inventory is empty
            </p>

            <p className="mt-1 text-xs text-slate-600">
              Visit the Black Market to acquire your first item.
            </p>

          </motion.div>

        ) : (

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">

            <AnimatePresence mode="popLayout">

              {filteredItems.map(
                (
                  inventoryItem,
                  index
                ) => {

                  const item =
                    inventoryItem.item;

                  const Icon =
                    getItemIcon(
                      item.iconSlug
                    );

                  const isRelic =
                    item.type ===
                    'RELIC';

                  const isSelected =
                    selectedId ===
                    inventoryItem.id;

                  return (
                    <motion.div
                      key={
                        inventoryItem.id
                      }
                      layout
                      initial={{
                        opacity: 0,
                        y: 14,
                      }}
                      animate={{
                        opacity: 1,
                        y: 0,
                      }}
                      exit={{
                        opacity: 0,
                        scale: 0.96,
                      }}
                      transition={{
                        duration: 0.25,
                        delay:
                          index *
                          0.04,
                      }}
                      className={`group relative overflow-hidden rounded-xl border p-4 transition-all ${
                        inventoryItem.equipped
                          ? 'border-violet-500/40 bg-violet-500/[0.07] shadow-lg shadow-violet-950/20'
                          : 'border-[#252B3D] bg-[#151A2B] hover:border-[#353D55]'
                      }`}
                    >

                      {/* Equipped glow */}
                      {inventoryItem.equipped && (
                        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-violet-500/[0.06] via-transparent to-cyan-500/[0.03]" />
                      )}

                      <div className="relative">

                        {/* ==================================================
                            TOP ROW
                        ================================================== */}

                        <div className="flex items-start justify-between gap-3">

                          <div
                            className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                              isRelic
                                ? 'border-violet-500/25 bg-violet-500/10 text-violet-300'
                                : 'border-amber-500/25 bg-amber-500/10 text-amber-300'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>

                          {/* Status */}
                          {isRelic ? (

                            inventoryItem.equipped ? (

                              <span className="flex items-center gap-1 rounded-md border border-emerald-500/25 bg-emerald-500/10 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-emerald-300">

                                <Check className="h-3 w-3" />

                                Equipped

                              </span>

                            ) : (

                              <span className="rounded-md border border-slate-700/60 bg-slate-900/60 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-slate-500">
                                Stored
                              </span>

                            )

                          ) : (

                            <span className="rounded-md border border-amber-500/20 bg-amber-500/5 px-2 py-1 text-[9px] font-black uppercase tracking-wider text-amber-400">
                              Redeemable
                            </span>

                          )}

                        </div>

                        {/* ==================================================
                            NAME
                        ================================================== */}

                        <div className="mt-4">

                          <p
                            className={`text-[9px] font-black uppercase tracking-[0.18em] ${
                              isRelic
                                ? 'text-violet-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {getItemTypeLabel(
                              item.type
                            )}
                          </p>

                          <h3 className="mt-1 text-sm font-black text-white">
                            {item.name}
                          </h3>

                          <p className="mt-1.5 min-h-[40px] text-xs leading-relaxed text-slate-500">
                            {item.description}
                          </p>

                        </div>

                        {/* ==================================================
                            STAT / EFFECT
                        ================================================== */}

                        {item.statBoost && (

                          <div className="mt-3 flex items-center gap-2 rounded-lg border border-cyan-500/15 bg-cyan-500/5 px-3 py-2">

                            <Zap className="h-3.5 w-3.5 shrink-0 text-cyan-400" />

                            <span className="text-[10px] font-bold text-cyan-300">
                              {item.statBoost}
                            </span>

                          </div>

                        )}

                        {/* ==================================================
                            XP SURGE CHARGES
                        ================================================== */}

                        {item.id ===
                          'item-3' &&
                          typeof inventoryItem.charges ===
                            'number' && (

                            <div className="mt-2 flex items-center justify-between rounded-lg border border-violet-500/15 bg-violet-500/5 px-3 py-2">

                              <span className="text-[10px] font-bold uppercase tracking-wider text-violet-300">
                                Charges
                              </span>

                              <span className="font-mono text-xs font-black text-violet-200">
                                {
                                  inventoryItem.charges
                                }{' '}
                                / 3
                              </span>

                            </div>

                          )}

                        {/* ==================================================
                            FOOTER
                        ================================================== */}

                        <div className="mt-4 flex items-center justify-between gap-3 border-t border-[#252B3D] pt-3">

                          <div className="flex items-center gap-1.5 text-[10px] text-slate-600">

                            <Coins className="h-3 w-3" />

                            <span className="font-mono">
                              Acquired{' '}
                              {new Date(
                                inventoryItem.acquiredAt
                              ).toLocaleDateString()}
                            </span>

                          </div>

                          {/* ==================================================
                              RELIC ACTION
                          ================================================== */}

                          {isRelic ? (

                            <button
                              onClick={() =>
                                handleToggle(
                                  inventoryItem
                                )
                              }
                              disabled={
                                isSelected
                              }
                              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-[10px] font-black uppercase tracking-wider transition ${
                                inventoryItem.equipped
                                  ? 'border border-slate-700 bg-slate-900 text-slate-400 hover:border-rose-500/30 hover:text-rose-300'
                                  : 'border border-violet-500/30 bg-violet-500/10 text-violet-300 hover:bg-violet-500/20'
                              }`}
                            >

                              {isSelected ? (

                                <RotateCcw className="h-3 w-3 animate-spin" />

                              ) : inventoryItem.equipped ? (

                                <>

                                  <Lock className="h-3 w-3" />

                                  Unequip

                                </>

                              ) : (

                                <>

                                  <Sparkles className="h-3 w-3" />

                                  Equip

                                </>

                              )}

                            </button>

                          ) : (

                            /* ==================================================
                               REAL WORLD REWARD
                            ================================================== */

                            <button
                              type="button"
                              onClick={() =>
                                playSfx(
                                  'coin'
                                )
                              }
                              className="flex items-center gap-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-amber-300 transition hover:bg-amber-500/20"
                            >

                              <Crown className="h-3 w-3" />

                              Redeem

                            </button>

                          )}

                        </div>

                      </div>

                    </motion.div>
                  );
                }
              )}

            </AnimatePresence>

          </div>

        )}

      </div>

    </section>
  );
}