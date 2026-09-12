'use client';

import React from 'react';
import { CharacterAttributes, AttributeKey } from '@/types/game';
import { Dumbbell, Brain, Heart, Zap, Crown } from 'lucide-react';

interface FeatTranslationBarProps {
  attributes: CharacterAttributes;
}

const attrIcons: Record<AttributeKey, React.ElementType> = {
  STR: Dumbbell,
  INT: Brain,
  VIT: Heart,
  AGI: Zap,
  CHA: Crown,
};

const attrColors: Record<AttributeKey, { text: string; bg: string; bar: string; border: string }> = {
  STR: { text: 'text-rose-400', bg: 'bg-rose-500/10', bar: 'bg-rose-500', border: 'border-rose-500/30' },
  INT: { text: 'text-cyan-400', bg: 'bg-cyan-500/10', bar: 'bg-cyan-500', border: 'border-cyan-500/30' },
  VIT: { text: 'text-emerald-400', bg: 'bg-emerald-500/10', bar: 'bg-emerald-500', border: 'border-emerald-500/30' },
  AGI: { text: 'text-amber-400', bg: 'bg-amber-500/10', bar: 'bg-amber-500', border: 'border-amber-500/30' },
  CHA: { text: 'text-purple-400', bg: 'bg-purple-500/10', bar: 'bg-purple-500', border: 'border-purple-500/30' },
};

export function FeatTranslationBar({ attributes }: FeatTranslationBarProps) {
  const keys: AttributeKey[] = ['STR', 'INT', 'VIT', 'AGI', 'CHA'];

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4 shadow-lg backdrop-blur">
      <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
        <h3 className="text-sm font-bold tracking-wide uppercase text-slate-200 flex items-center gap-2">
          <span>⚡ Real-World Feats & Power Translation</span>
        </h3>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          Section 9.3 Protocol
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {keys.map((key) => {
          const attr = attributes[key];
          const Icon = attrIcons[key];
          const color = attrColors[key];
          const pct = Math.min(100, Math.round((attr.currentXp / attr.requiredXp) * 100));

          return (
            <div
              key={key}
              className={`rounded-lg border ${color.border} ${color.bg} p-3 flex flex-col justify-between transition-all hover:scale-[1.02]`}
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Icon className={`w-4 h-4 ${color.text}`} />
                    <span className="font-bold text-xs text-white">{key}</span>
                  </div>
                  <span className="text-[11px] font-mono font-bold text-white">Lvl {attr.level}</span>
                </div>

                <div className="w-full bg-slate-950/80 rounded-full h-1.5 mb-2 overflow-hidden border border-slate-800">
                  <div
                    className={`h-full ${color.bar} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>

              <div className="mt-1 pt-1.5 border-t border-white/5">
                <p className="text-[11px] leading-relaxed text-slate-300 italic">
                  "{attr.featDescription}"
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
