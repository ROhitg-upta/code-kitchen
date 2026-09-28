import React, { useState, useEffect, useMemo } from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import SpotlightCard from "@/components/ui/SpotlightCard";

export default function BranchBattleModule({ registrations }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(id);
  }, []);

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

  const recentActivity = useMemo(() => {
    return [...registrations].slice(0, 6);
  }, [registrations]);

  return (
    <div className="px-4 py-12 sm:py-16 max-w-4xl mx-auto min-h-screen bg-cyber-grid">
      {/* Header */}
      <div className="mb-10 border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
            03 // LIVE CAMPUS TELEMETRY
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-white mt-1 tracking-tight">
            ABESEC BRANCH BATTLE.
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-lg">
            Real-time department rankings computed from verified event
            registrations across the Code Kitchen.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white text-black font-mono text-xs font-bold">
          <Trophy className="w-3.5 h-3.5" />
          {registrations.length} TOTAL REGISTRATIONS
        </div>
      </div>

      {/* Leaderboard Rows */}
      <div className="space-y-3">
        {leaderboard.map((entry, idx) => {
          const rank = idx + 1;
          const barWidth = mounted ? (entry.count / maxCount) * 100 : 0;

          return (
            <SpotlightCard
              key={entry.branch}
              className="px-5 py-4 flex items-center gap-4"
            >
              {/* Rank Number */}
              <div
                className={cn(
                  "w-9 h-9 rounded-xl flex items-center justify-center font-mono text-xs font-bold shrink-0 border",
                  rank === 1
                    ? "bg-white text-black border-white"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800"
                )}
              >
                #{rank}
              </div>

              {/* Branch Name */}
              <div className="w-24 sm:w-32 shrink-0">
                <p className="font-display font-bold text-white text-base">
                  {entry.branch}
                </p>
                <p className="font-mono text-[10px] text-zinc-500 uppercase">
                  {Math.round((entry.count / registrations.length) * 100)}% SHARE
                </p>
              </div>

              {/* Monochrome Bar */}
              <div className="flex-1 h-8 bg-zinc-950 border border-zinc-800 rounded-xl overflow-hidden relative">
                <div
                  className={cn(
                    "h-full transition-all duration-1000 ease-out",
                    rank === 1
                      ? "bg-white"
                      : rank === 2
                      ? "bg-zinc-300"
                      : "bg-zinc-600"
                  )}
                  style={{ width: `${barWidth}%` }}
                />
                <span
                  className={cn(
                    "absolute right-3 top-1/2 -translate-y-1/2 font-mono font-bold text-xs",
                    barWidth > 18 && rank <= 2 ? "text-black" : "text-white"
                  )}
                >
                  {entry.count} CHEFS
                </span>
              </div>

              {rank === 1 && (
                <span className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[10px] font-mono uppercase font-bold bg-white text-black shrink-0">
                  ★ LEADER
                </span>
              )}
            </SpotlightCard>
          );
        })}
      </div>

      {/* Live Feed */}
      {recentActivity.length > 0 && (
        <div className="mt-12">
          <h2 className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400 mb-4">
            // LIVE REGISTRATION STREAM
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {recentActivity.map((reg, idx) => (
              <div
                key={reg.id || idx}
                className="glass-card px-4 py-3.5 rounded-xl flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm text-white font-semibold truncate">
                    {reg.name}{" "}
                    <span className="font-mono text-xs text-zinc-400">
                      [{reg.branch}]
                    </span>
                  </p>
                  <p className="text-xs text-zinc-400 truncate mt-0.5">
                    {reg.eventTitle}
                  </p>
                </div>
                <span className="font-mono text-[10px] text-zinc-500 shrink-0">
                  {reg.ticketId}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
