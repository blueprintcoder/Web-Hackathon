"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Sparkles, X, LogIn, UserPlus, Zap } from "lucide-react";
import { playSfx } from "@/lib/audio";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  onRegister: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  onDemoLogin: () => Promise<void>;
}

export function AuthModal({
  isOpen,
  onClose,
  onLogin,
  onRegister,
  onDemoLogin,
}: AuthModalProps) {
  const [tab, setTab] = useState<"LOGIN" | "REGISTER">("LOGIN");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [hunterName, setHunterName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);

    if (tab === "LOGIN") {
      const res = await onLogin(email, password);
      setLoading(false);
      if (res.success) {
        playSfx("levelup");
        onClose();
      } else {
        setErrorMessage(res.error || "Login failed. Check your credentials.");
      }
    } else {
      const res = await onRegister(email, password, hunterName);
      setLoading(false);
      if (res.success) {
        playSfx("levelup");
        onClose();
      } else {
        setErrorMessage(res.error || "Registration failed. Please try again.");
      }
    }
  };

  const handleDemoClick = async () => {
    setLoading(true);
    await onDemoLogin();
    setLoading(false);
    playSfx("levelup");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 15 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 15 }}
        className="card-duo-light w-full max-w-md p-6 bg-white shadow-2xl relative"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 p-1 rounded-xl hover:bg-slate-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-emerald-500 text-white shadow-[0_4px_0_#059669] mb-3">
            <Shield className="h-6 w-6 fill-white/20" />
          </div>
          <h2 className="text-2xl font-black text-slate-900">
            Hunter Protocol Auth
          </h2>
          <p className="text-xs font-bold text-slate-600 mt-0.5">
            Log in to preserve streaks, quests, and vault inventory
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1 rounded-2xl mb-4 border border-slate-200/60">
          <button
            type="button"
            onClick={() => {
              setTab("LOGIN");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              tab === "LOGIN"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("REGISTER");
              setErrorMessage("");
            }}
            className={`flex-1 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              tab === "REGISTER"
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs font-black text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {tab === "REGISTER" && (
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
                Hunter Name
              </label>
              <input
                type="text"
                required
                value={hunterName}
                onChange={(e) => setHunterName(e.target.value)}
                placeholder="e.g. Jin-Woo or Sung"
                className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hunter@aetheria.rpg"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-800 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20 focus:outline-none transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-duo-green w-full py-3 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 mt-2 shadow-sm"
          >
            {tab === "LOGIN" ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>{loading ? "Signing In..." : "Sign In to Aetheria"}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{loading ? "Awakening..." : "Awaken Hunter Account"}</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200" />
          </div>
          <span className="relative bg-white px-3 text-[10px] font-black uppercase text-slate-600 tracking-wider">
            Or Test Instantly
          </span>
        </div>

        {/* 1-Click Judge Demo Button */}
        <button
          type="button"
          onClick={handleDemoClick}
          disabled={loading}
          className="btn-duo-amber w-full py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2"
        >
          <Zap className="w-4 h-4 text-amber-900 fill-amber-900" />
          <span>Quick Judge Demo Login (Jin-Woo)</span>
        </button>
      </motion.div>
    </div>
  );
}
