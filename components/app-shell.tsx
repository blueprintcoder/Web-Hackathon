"use client";

import React, { useState } from "react";
import {
  LayoutDashboard,
  Swords,
  Skull,
  Backpack,
  Store,
  Trophy,
  Menu,
  X,
  Command,
  ChevronRight,
  Shield,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AudioController } from "@/components/audio-controller";

interface AppShellProps {
  children: React.ReactNode;
}

const navigation = [
  {
    label: "Overview",
    icon: LayoutDashboard,
    href: "#overview",
  },
  {
    label: "Quests",
    icon: Swords,
    href: "#quests",
  },
  {
    label: "Weekly Boss",
    icon: Skull,
    href: "#boss",
  },
  {
    label: "Inventory",
    icon: Backpack,
    href: "#inventory",
  },
  {
    label: "Black Market",
    icon: Store,
    href: "#market",
  },
  {
    label: "Hunter Honors",
    icon: Trophy,
    href: "#honors",
  },
];

export function AppShell({ children }: AppShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const navigate = (href: string) => {
    setMobileOpen(false);

    document.querySelector(href)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="min-h-screen text-slate-100">
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="aether-grid absolute inset-0 opacity-60" />

        <motion.div
          animate={{
            opacity: [0.2, 0.35, 0.2],
            scale: [1, 1.08, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[20%] top-[-180px] h-[500px] w-[500px] rounded-full bg-purple-600/10 blur-[120px]"
        />

        <motion.div
          animate={{
            opacity: [0.08, 0.18, 0.08],
            scale: [1, 1.12, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute right-[-120px] top-[20%] h-[420px] w-[420px] rounded-full bg-cyan-500/10 blur-[110px]"
        />
      </div>

      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[238px] border-r border-slate-800/70 bg-[#080b14]/80 backdrop-blur-2xl lg:block">
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-[78px] items-center border-b border-slate-800/70 px-5">
            <div className="flex items-center gap-3">
              <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 via-purple-600 to-amber-500 p-[1px] shadow-lg shadow-purple-900/30">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#090c15]">
                  <Shield className="h-5 w-5 text-amber-300" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black tracking-[0.18em] text-white">
                    AETHERIA
                  </span>

                  <span className="rounded border border-purple-500/30 bg-purple-500/10 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-purple-300">
                    RPG
                  </span>
                </div>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Hunter Protocol
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-5">
            <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-600">
              Guild Interface
            </p>

            {navigation.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.button
                  key={item.label}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.04 }}
                  onClick={() => navigate(item.href)}
                  className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-slate-400 transition-all hover:bg-white/[0.045] hover:text-white"
                >
                  <Icon className="h-[17px] w-[17px] transition-transform group-hover:scale-110 group-hover:text-purple-400" />

                  <span className="flex-1">{item.label}</span>

                  <ChevronRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-40" />
                </motion.button>
              );
            })}
          </nav>

          {/* Command hint */}
          <div className="px-4 pb-4">
            <div className="rounded-xl border border-slate-800/80 bg-slate-950/60 p-3">
              <div className="flex items-center gap-2 text-[10px] text-slate-500">
                <Command className="h-3.5 w-3.5" />

                <span>Quick actions</span>

                <kbd className="ml-auto rounded border border-slate-700 bg-slate-900 px-1.5 py-0.5 font-mono text-[9px] text-slate-400">
                  Ctrl K
                </kbd>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main application area */}
      <div className="lg:pl-[238px]">
        {/* Header */}
        <header className="sticky top-0 z-30 border-b border-slate-800/70 bg-[#080b14]/75 backdrop-blur-2xl">
          <div className="mx-auto flex h-[68px] max-w-[1500px] items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 lg:hidden">
              <button
                onClick={() => setMobileOpen(true)}
                className="rounded-xl border border-slate-800 bg-slate-900/70 p-2 text-slate-300"
                aria-label="Open navigation"
              >
                <Menu className="h-5 w-5" />
              </button>

              <span className="font-black tracking-[0.16em] text-white">
                AETHERIA
              </span>
            </div>

            <div className="hidden lg:block">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-600">
                Hunter Command Center
              </p>

              <p className="text-sm font-semibold text-slate-300">
                Your progression. Your protocol.
              </p>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <div className="hidden items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/60 px-3 py-2 sm:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]" />

                <span className="text-[10px] font-medium text-slate-400">
                  Guild Online
                </span>
              </div>

              <AudioController />
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>

      {/* Mobile navigation */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm lg:hidden"
            />

            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{
                type: "spring",
                stiffness: 320,
                damping: 30,
              }}
              className="fixed inset-y-0 left-0 z-[60] w-[285px] border-r border-slate-800 bg-[#090c15] shadow-2xl lg:hidden"
            >
              <div className="flex h-full flex-col">
                <div className="flex h-[76px] items-center justify-between border-b border-slate-800 px-5">
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-amber-300" />
                    <span className="font-black tracking-[0.18em]">
                      AETHERIA
                    </span>
                  </div>

                  <button
                    onClick={() => setMobileOpen(false)}
                    className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <nav className="flex-1 space-y-1 p-4">
                  {navigation.map((item) => {
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.label}
                        onClick={() => navigate(item.href)}
                        className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-300 transition-colors hover:bg-purple-500/10 hover:text-white"
                      >
                        <Icon className="h-5 w-5 text-slate-500" />
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}