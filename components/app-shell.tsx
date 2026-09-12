"use client";

import React, { useState } from "react";
import {
  Swords,
  Skull,
  Backpack,
  Store,
  UserCheck,
  Menu,
  X,
  Flame,
  Coins,
  Sparkles,
  Shield,
  Moon,
  LogOut,
  LogIn,
  User,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioController } from "@/components/audio-controller";
import { useGame, GameViewTab } from "@/lib/game-context";
import { AuthModal } from "@/components/auth-modal";

interface AppShellProps {
  children: React.ReactNode;
}

const navItems: {
  id: GameViewTab;
  label: string;
  icon: React.ElementType;
  activeColor: string;
  activeBg: string;
  activeBorder: string;
  badge?: string;
}[] = [
  {
    id: "quests",
    label: "Daily Quests",
    icon: Swords,
    activeColor: "text-emerald-700",
    activeBg: "bg-emerald-50",
    activeBorder: "border-emerald-500",
  },
  {
    id: "boss",
    label: "Boss Arena",
    icon: Skull,
    activeColor: "text-rose-700",
    activeBg: "bg-rose-50",
    activeBorder: "border-rose-500",
    badge: "LIVE",
  },
  {
    id: "shop",
    label: "Black Market",
    icon: Store,
    activeColor: "text-amber-700",
    activeBg: "bg-amber-50",
    activeBorder: "border-amber-500",
  },
  {
    id: "inventory",
    label: "Hunter Vault",
    icon: Backpack,
    activeColor: "text-sky-700",
    activeBg: "bg-sky-50",
    activeBorder: "border-sky-500",
  },
  {
    id: "profile",
    label: "Hunter Stats",
    icon: UserCheck,
    activeColor: "text-purple-700",
    activeBg: "bg-purple-50",
    activeBorder: "border-purple-500",
  },
];

export function AppShell({ children }: AppShellProps) {
  const {
    currentUser,
    character,
    activeTab,
    setActiveTab,
    solitude,
    loading,
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleLogin,
    handleRegister,
    handleLogout,
    handleQuickDemoLogin,
  } = useGame();

  const [mobileOpen, setMobileOpen] = useState(false);

  const handleSelectTab = (tab: GameViewTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#f7f9fa] text-slate-800 antialiased flex flex-col lg:flex-row">
      {/* ============================================================
          DESKTOP SIDEBAR (DUOLINGO STYLE: CRISP WHITE, 3D BUTTONS)
      ============================================================ */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col bg-white border-r-2 border-slate-200 select-none shadow-[2px_0_12px_rgba(0,0,0,0.02)]">
        {/* Brand Header */}
        <div className="flex h-20 items-center gap-3 px-6 border-b-2 border-slate-100">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_4px_0_#059669] transform -rotate-3 hover:rotate-0 transition-transform">
            <Shield className="h-6 w-6 fill-white/20" />
          </div>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xl tracking-tight text-slate-900">
                AETHERIA
              </span>
              <span className="rounded-md bg-emerald-100 px-1.5 py-0.5 text-[10px] font-black text-emerald-700">
                RPG
              </span>
            </div>
            <p className="text-[11px] font-bold text-slate-600">
              The Hunter&apos;s Protocol
            </p>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 space-y-2 p-4">
          <p className="px-3 text-[10px] font-black uppercase tracking-wider text-slate-600 mb-2">
            Game Menu
          </p>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectTab(item.id)}
                className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-100 text-left ${
                  isActive
                    ? `${item.activeBg} ${item.activeColor} border-2 ${item.activeBorder} shadow-[0_3px_0_rgba(0,0,0,0.06)] translate-y-0`
                    : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 border-2 border-transparent"
                }`}
              >
                <Icon
                  className={`h-5 w-5 shrink-0 ${
                    isActive ? item.activeColor : "text-slate-600"
                  }`}
                />
                <span className="flex-1">{item.label}</span>

                {item.badge && (
                  <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black text-white animate-pulse">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Hunter Quick Account Card Footer */}
        <div className="p-4 border-t-2 border-slate-100">
          <div className="rounded-2xl border-2 border-slate-100 bg-slate-50 p-3">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-700 font-black text-xs shrink-0">
                {character.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-black text-slate-900 truncate">
                  {character.name}
                </p>
                <p className="text-[10px] font-bold text-slate-600 truncate">
                  {currentUser?.email || "Guest Hunter"}
                </p>
              </div>
            </div>

            {/* Log in / Log out button */}
            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-[11px] font-bold text-slate-600 transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-xl btn-duo-green text-[11px] font-black uppercase tracking-wider"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* ============================================================
          MAIN CONTENT WRAPPER
      ============================================================ */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* TOP GAME HUD HEADER */}
        <header className="sticky top-0 z-30 flex h-18 items-center justify-between border-b-2 border-slate-200 bg-white/95 backdrop-blur-md px-4 sm:px-6 lg:px-8">
          {/* Mobile hamburger & brand */}
          <div className="flex items-center gap-3 lg:hidden">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="rounded-xl border-2 border-slate-200 bg-white p-2 text-slate-700 shadow-sm active:translate-y-0.5"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            <span className="font-black tracking-tight text-lg text-slate-900">
              AETHERIA
            </span>
          </div>

          {/* Current view indicator (Desktop) */}
          <div className="hidden lg:flex items-center gap-2">
            <span className="text-sm font-black uppercase tracking-wider text-slate-600">
              Current View:
            </span>
            <span className="rounded-xl bg-slate-100 px-3 py-1 text-xs font-black text-slate-800 border border-slate-200">
              {navItems.find((n) => n.id === activeTab)?.label}
            </span>

            {loading && (
              <span className="flex items-center gap-1.5 text-xs text-cyan-600 font-bold ml-2">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                Syncing...
              </span>
            )}
          </div>

          {/* DUOLINGO-STYLE GAME STATS HUD (RIGHT) */}
          <div className="flex items-center gap-2 sm:gap-3 ml-auto">
            {/* Streak Flame Pill */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-amber-200 bg-amber-50 text-amber-900 shadow-sm"
              title={`${character.streakCount} Day Streak active!`}
            >
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500 animate-bounce" />
              <span className="font-black text-xs font-mono">
                {character.streakCount}
              </span>
            </div>

            {/* Gold Pill */}
            <div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-yellow-200 bg-yellow-50 text-yellow-900 shadow-sm"
              title={`${character.gold.toLocaleString()} Gold available`}
            >
              <Coins className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-black text-xs font-mono">
                {character.gold.toLocaleString()}
              </span>
            </div>

            {/* Level Pill */}
            <div
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-sky-200 bg-sky-50 text-sky-900 shadow-sm"
              title={`Hunter Level ${character.level} • ${character.currentXp}/${character.requiredXp} XP`}
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-lg bg-sky-500 text-[10px] font-black text-white">
                ★
              </span>
              <span className="font-black text-xs font-mono">
                LVL {character.level}
              </span>
            </div>

            {/* Solitude Multiplier Pill */}
            {solitude.isActive && (
              <div
                className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-2xl border-2 border-purple-200 bg-purple-50 text-purple-900 shadow-sm text-xs font-black"
                title="Off-peak night grind active! +50% XP multiplier"
              >
                <Moon className="w-3.5 h-3.5 text-purple-600 fill-purple-200" />
                <span>{solitude.multiplier}x XP</span>
              </div>
            )}

            {/* Auth Account Button */}
            {currentUser ? (
              <button
                type="button"
                onClick={handleLogout}
                title={`Logged in as ${currentUser.email}. Click to sign out.`}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border-2 border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-black shadow-sm active:translate-y-0.5"
              >
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Sign Out</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsAuthModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl btn-duo-green text-xs font-black uppercase tracking-wider shadow-sm"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* SFX Audio Controller */}
            <AudioController />
          </div>
        </header>

        {/* MAIN BODY VIEW */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* ============================================================
          MOBILE DRAWER MODAL
      ============================================================ */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed inset-y-0 left-0 z-[60] w-72 bg-white border-r-2 border-slate-200 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex h-18 items-center justify-between border-b-2 border-slate-100 px-5">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
                    <Shield className="h-5 w-5 fill-white/20" />
                  </div>
                  <span className="font-black text-lg tracking-tight text-slate-900">
                    AETHERIA
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-2 p-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectTab(item.id)}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl font-black text-sm uppercase tracking-wider ${
                        isActive
                          ? `${item.activeBg} ${item.activeColor} border-2 ${item.activeBorder}`
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[9px] font-black text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>

              <div className="p-4 border-t-2 border-slate-100">
                <p className="text-xs font-black text-slate-800">
                  {character.name} (Lvl {character.level})
                </p>
                <p className="text-[10px] text-slate-500 font-medium mb-3">
                  {currentUser?.email || "Guest"}
                </p>
                {currentUser ? (
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setMobileOpen(false);
                    }}
                    className="w-full py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600"
                  >
                    Sign Out
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsAuthModalOpen(true);
                      setMobileOpen(false);
                    }}
                    className="w-full py-2 rounded-xl btn-duo-green text-xs font-black uppercase"
                  >
                    Sign In / Register
                  </button>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ============================================================
          GLOBAL AUTH MODAL
      ============================================================ */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onDemoLogin={handleQuickDemoLogin}
      />
    </div>
  );
}