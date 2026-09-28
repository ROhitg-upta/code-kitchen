/**
 * BranchBattleModule.jsx
 * ──────────────────────────────────────────────────────────────
 * Module 6 — Live ABESEC Branch Participation Battle
 *
 * Aggregates registrations by branch, renders animated horizontal
 * bar chart with rank badges (🥇🥈🥉), and a recent activity feed
 * showing the last 5 registrations.
 *
 * @module  modules/leaderboard/BranchBattleModule
 * @see     PROMPTS.md — PROMPT 7
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

/* ================================================================
   Constants
   ================================================================ */

const RANK_MEDALS = ['🥇', '🥈', '🥉'];

const BAR_GRADIENTS = [
  'bg-gradient-to-r from-amber-500 to-amber-400',   // 1st
  'bg-gradient-to-r from-slate-400 to-slate-300',    // 2nd
  'bg-gradient-to-r from-amber-700 to-amber-600',    // 3rd
];

/* ================================================================
   BranchBattleModule — Main exported component
   ================================================================ */

export default function BranchBattleModule({ registrations }) {
  // Animation trigger: bars animate from 0 → full width on mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 100);
    return () => clearTimeout(id);
  }, []);

  // Aggregate by branch
  const leaderboard = useMemo(() => {
    const map = registrations.reduce((acc, r) => {
      if (!r.branch) return acc;
      acc[r.branch] = (acc[r.branch] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(map)
      .map(([branch, count]) => ({ branch, count }))
      .sort((a, b) => b.count - a.count);
  }, [registrations]);

  const maxCount = leaderboard.length > 0 ? leaderboard[0].count : 1;

  // Recent activity: last 5 registrations
  const recentActivity = useMemo(() => {
    return [...registrations]
      .sort((a, b) => {
        // Sort by registeredAt descending — handle string dates
        if (a.registeredAt > b.registeredAt) return -1;
        if (a.registeredAt < b.registeredAt) return 1;
        return 0;
      })
      .slice(0, 5);
  }, [registrations]);

  // Empty state
  if (registrations.length === 0) {
    return (
      <div className="px-4 py-20 max-w-3xl mx-auto text-center">
        <Trophy className="w-12 h-12 text-slate-600 mx-auto mb-4" />
        <p className="text-slate-400 font-medium">No registrations yet</p>
        <p className="text-slate-500 text-sm mt-1">
          Be the first chef to register and claim the top spot!
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-10 sm:py-14 max-w-3xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/25 mb-4">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span className="font-mono text-xs text-amber-300 tracking-wider uppercase">
            Live Rankings
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white">
          🏆 ABESEC Branch Battle
        </h1>
        <p className="text-slate-400 mt-2">
          Which branch is dominating the Code Kitchen? Live rankings based on
          event registrations.
        </p>
      </div>

      {/* Leaderboard */}
      <div className="space-y-3">
        {leaderboard.map((entry, idx) => {
          const rank = idx + 1;
          const barWidth = mounted ? (entry.count / maxCount) * 100 : 0;
          const barGradient = BAR_GRADIENTS[idx] || 'bg-slate-600';
          const textInBar = rank <= 3 ? 'text-slate-950' : 'text-slate-300';

          return (
            <div
              key={entry.branch}
              className="glass-card px-4 sm:px-5 py-4 rounded-2xl flex items-center gap-3 sm:gap-4 animate-slideUp"
              style={{
                animationDelay: `${idx * 0.08}s`,
                animationFillMode: 'both',
              }}
            >
              {/* Rank Badge */}
              <div className="shrink-0 w-8 text-center">
                {rank <= 3 ? (
                  <span className="text-2xl">{RANK_MEDALS[idx]}</span>
                ) : (
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-800 text-slate-400 text-sm font-bold font-mono">
                    {rank}
                  </span>
                )}
              </div>

              {/* Branch Name */}
              <span className="font-display font-semibold text-white text-sm sm:text-base w-20 sm:w-28 shrink-0 truncate">
                {entry.branch}
              </span>

              {/* Bar */}
              <div className="flex-1 h-8 bg-slate-800/50 rounded-lg overflow-hidden relative">
                <div
                  className={cn(
                    'h-full rounded-lg transition-all duration-1000 ease-out',
                    barGradient
                  )}
                  style={{ width: `${barWidth}%` }}
                />
                <span
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 font-mono font-bold text-sm',
                    barWidth > 15 ? textInBar : 'text-slate-300'
                  )}
                  style={{
                    // If bar is small, position count outside
                    ...(barWidth <= 15 ? { right: '-2.5rem' } : {}),
                  }}
                >
                  {entry.count}
                </span>
              </div>

              {/* Leader tag (1st place only) */}
              {rank === 1 && (
                <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25 shrink-0 whitespace-nowrap">
                  👑 Leading
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent Activity Feed */}
      {recentActivity.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-display font-semibold text-white mb-4 flex items-center gap-2">
            ⚡ Recent Kitchen Activity
          </h2>
          <div className="space-y-2">
            {recentActivity.map((reg, idx) => (
              <div
                key={reg.id || idx}
                className="glass-card px-4 py-3 rounded-xl flex items-center justify-between gap-3 animate-slideUp"
                style={{
                  animationDelay: `${0.4 + idx * 0.06}s`,
                  animationFillMode: 'both',
                }}
              >
                <p className="text-sm min-w-0 truncate">
                  <span className="text-white font-medium">{reg.name}</span>
                  <span className="text-slate-400"> from </span>
                  <span className="text-amber-400">{reg.branch}</span>
                  <span className="text-slate-400"> joined </span>
                  <span className="text-slate-300">{reg.eventTitle}</span>
                </p>
                <span className="text-[11px] font-mono text-slate-500 shrink-0 whitespace-nowrap">
                  {reg.registeredAt}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
