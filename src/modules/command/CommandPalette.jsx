/**
 * CommandPalette.jsx
 * ──────────────────────────────────────────────────────────────
 * Module 7 — Ctrl+K / Cmd+K Power Command Palette
 *
 * Provides a Raycast/Linear-style keyboard-driven command palette
 * with instant search across quick actions and live events, arrow-key
 * navigation, Enter-to-execute, and ESC-to-dismiss.
 *
 * @module  modules/command/CommandPalette
 * @see     PROMPTS.md — PROMPT 8
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Terminal,
  Calendar,
  Sparkles,
  Trophy,
  ScanLine,
  Shield,
  Download,
  Flame,
  ArrowRight,
  CornerDownLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CommandPalette({
  isOpen,
  onClose,
  events,
  onNavigate,
  onSelectEvent,
  onOpenRegister,
  onExportCsv,
}) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  const quickActions = useMemo(
    () => [
      {
        id: 'act-events',
        label: 'Explore All Kitchen Events',
        category: 'Navigation',
        icon: Calendar,
        action: () => {
          onNavigate('events');
          onClose();
        },
      },
      {
        id: 'act-ai',
        label: 'Ask Head Chef AI: Recommend Event',
        category: 'AI Concierge',
        icon: Sparkles,
        action: () => {
          onNavigate('ai-finder');
          onClose();
        },
      },
      {
        id: 'act-battle',
        label: 'Live Branch Participation Battle',
        category: 'Leaderboard',
        icon: Trophy,
        action: () => {
          onNavigate('leaderboard');
          onClose();
        },
      },
      {
        id: 'act-scanner',
        label: 'Open Admin QR Gate Scanner',
        category: 'Admin Ops',
        icon: ScanLine,
        action: () => {
          onNavigate('admin-scanner');
          onClose();
        },
      },
      {
        id: 'act-admin',
        label: 'Open Admin Command Center',
        category: 'Admin Ops',
        icon: Shield,
        action: () => {
          onNavigate('admin');
          onClose();
        },
      },
      {
        id: 'act-csv',
        label: 'Export Registrations to CSV',
        category: 'Data Export',
        icon: Download,
        action: () => {
          onExportCsv();
          onClose();
        },
      },
    ],
    [onNavigate, onExportCsv, onClose]
  );

  const filteredActions = useMemo(() => {
    if (!query.trim()) return quickActions;
    const q = query.toLowerCase();
    return quickActions.filter(
      (a) =>
        a.label.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [quickActions, query]);

  const filteredEvents = useMemo(() => {
    if (!query.trim()) return events;
    const q = query.toLowerCase();
    return events.filter((e) => {
      const text = [e.title, e.category, e.venue, ...(e.tags || [])]
        .join(' ')
        .toLowerCase();
      return text.includes(q);
    });
  }, [events, query]);

  const totalItems = filteredActions.length + filteredEvents.length;

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((prev) => (totalItems > 0 ? (prev + 1) % totalItems : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((prev) =>
          totalItems > 0 ? (prev - 1 + totalItems) % totalItems : 0
        );
      } else if (e.key === 'Enter' && totalItems > 0) {
        e.preventDefault();
        if (activeIndex < filteredActions.length) {
          filteredActions[activeIndex].action();
        } else {
          const ev = filteredEvents[activeIndex - filteredActions.length];
          if (ev) {
            onSelectEvent?.(ev);
            onClose();
          }
        }
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, totalItems, activeIndex, filteredActions, filteredEvents, onSelectEvent, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex justify-center items-start pt-16 sm:pt-24 px-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Command Palette"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-w-2xl w-full bg-[#0c1018] border border-amber-500/30 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.15)] overflow-hidden flex flex-col max-h-[75vh]">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 gap-3 border-b border-slate-800/80 bg-slate-900/40">
          <Terminal className="w-4 h-4 text-amber-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Type a command, search events, or jump to Admin..."
            className="flex-1 bg-transparent text-sm text-white font-mono placeholder-slate-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="cursor-pointer px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-400 hover:text-white text-[10px] font-mono transition"
          >
            ESC
          </button>
        </div>

        {/* Scrollable Results */}
        <div className="flex-1 overflow-y-auto py-2">
          {totalItems === 0 && (
            <div className="py-12 text-center text-sm text-slate-500 font-mono">
              No matching commands or events found for "{query}"
            </div>
          )}

          {/* Quick Actions */}
          {filteredActions.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider px-4 py-1.5">
                Quick Actions
              </p>
              {filteredActions.map((act, idx) => {
                const Icon = act.icon;
                const isSelected = activeIndex === idx;
                return (
                  <button
                    key={act.id}
                    onClick={act.action}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={cn(
                      'cursor-pointer w-[calc(100%-16px)] mx-2 px-3.5 py-2.5 flex items-center gap-3 rounded-xl text-left transition group',
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/30'
                        : 'hover:bg-slate-800/60 border border-transparent'
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-4 h-4 shrink-0 transition-colors',
                        isSelected
                          ? 'text-amber-400'
                          : 'text-slate-400 group-hover:text-amber-400'
                      )}
                    />
                    <span className="text-sm text-slate-200 font-medium flex-1 truncate">
                      {act.label}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 bg-slate-800/90 border border-slate-700/70 px-2 py-0.5 rounded-md shrink-0">
                      {act.category}
                    </span>
                    <ArrowRight
                      className={cn(
                        'w-3.5 h-3.5 shrink-0 transition-opacity',
                        isSelected
                          ? 'text-amber-400 opacity-100'
                          : 'text-slate-500 opacity-0 group-hover:opacity-100'
                      )}
                    />
                  </button>
                );
              })}
            </div>
          )}

          {/* Events */}
          {filteredEvents.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase text-slate-500 tracking-wider px-4 py-1.5">
                Kitchen Events
              </p>
              {filteredEvents.map((event, idx) => {
                const globalIdx = filteredActions.length + idx;
                const isSelected = activeIndex === globalIdx;
                return (
                  <div
                    key={event.id}
                    onMouseEnter={() => setActiveIndex(globalIdx)}
                    onClick={() => {
                      if (onSelectEvent) onSelectEvent(event);
                      else onNavigate('events');
                      onClose();
                    }}
                    className={cn(
                      'cursor-pointer w-[calc(100%-16px)] mx-2 px-3.5 py-2.5 flex items-center gap-3 rounded-xl transition group',
                      isSelected
                        ? 'bg-amber-500/15 border border-amber-500/30'
                        : 'hover:bg-slate-800/60 border border-transparent'
                    )}
                  >
                    <Flame
                      className={cn(
                        'w-4 h-4 shrink-0',
                        isSelected ? 'text-amber-400' : 'text-orange-400/80'
                      )}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-slate-200 font-medium truncate">
                        {event.title}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono truncate">
                        {event.category} · {event.date} · {event.venue}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRegister(event);
                        onClose();
                      }}
                      className="cursor-pointer px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-[10px] font-semibold border border-amber-500/30 transition shrink-0"
                    >
                      Book Seat
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-800/80 px-4 py-2.5 bg-slate-950/60 flex items-center justify-between text-[10px] font-mono text-slate-500">
          <span>CodeChef ABESEC // Command Palette v2.6</span>
          <span className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1">
              <CornerDownLeft className="w-3 h-3" /> Select
            </span>
            <span>·</span>
            <span>ESC to close</span>
          </span>
        </div>
      </div>
    </div>
  );
}
