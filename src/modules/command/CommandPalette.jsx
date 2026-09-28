import React, { useState, useEffect, useRef, useMemo } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function CommandPalette({
  isOpen,
  onClose,
  events,
  onNavigate,
  onSelectEvent,
  onOpenRegister,
  onExportCsv,
}) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 20);
    }
  }, [isOpen]);

  const quickActions = useMemo(
    () => [
      {
        id: "act-events",
        label: "Explore All Kitchen Events",
        category: "NAVIGATION",
        icon: Calendar,
        action: () => {
          onNavigate("events");
          onClose();
        },
      },
      {
        id: "act-ai",
        label: "Ask Head Chef AI: Recommend Event",
        category: "AI CONCIERGE",
        icon: Sparkles,
        action: () => {
          onNavigate("ai-finder");
          onClose();
        },
      },
      {
        id: "act-battle",
        label: "Live Branch Participation Battle",
        category: "LEADERBOARD",
        icon: Trophy,
        action: () => {
          onNavigate("leaderboard");
          onClose();
        },
      },
      {
        id: "act-scanner",
        label: "Open Admin QR Gate Scanner",
        category: "ADMIN OPS",
        icon: ScanLine,
        action: () => {
          onNavigate("admin-scanner");
          onClose();
        },
      },
      {
        id: "act-admin",
        label: "Open Admin Command Center",
        category: "ADMIN OPS",
        icon: Shield,
        action: () => {
          onNavigate("admin");
          onClose();
        },
      },
      {
        id: "act-csv",
        label: "Export Registrations to CSV",
        category: "DATA EXPORT",
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
    return events.filter((e) =>
      [e.title, e.category, e.venue, ...(e.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [events, query]);

  const totalItems = filteredActions.length + filteredEvents.length;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex justify-center items-start pt-16 sm:pt-24 px-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-w-2xl w-full bg-[#09090b] border border-white/25 rounded-2xl shadow-[0_25px_90px_rgba(0,0,0,0.95)] overflow-hidden flex flex-col max-h-[75vh]">
        <div className="flex items-center px-4 py-3.5 gap-3 border-b border-zinc-800 bg-zinc-950">
          <Terminal className="w-4 h-4 text-white shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Type a command, search events, or jump to Admin..."
            className="flex-1 bg-transparent text-sm text-white font-mono placeholder-zinc-500 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="cursor-pointer px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white text-[10px] font-mono transition"
          >
            ESC
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-2">
          {totalItems === 0 && (
            <div className="py-12 text-center text-sm text-zinc-500 font-mono">
              No matching commands or events found for "{query}"
            </div>
          )}

          {filteredActions.length > 0 && (
            <div className="mb-2">
              <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider px-4 py-1.5">
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
                      "cursor-pointer w-[calc(100%-16px)] mx-2 px-3.5 py-2.5 flex items-center gap-3 rounded-xl text-left transition",
                      isSelected ? "bg-white text-black" : "hover:bg-zinc-900 text-zinc-200"
                    )}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="text-sm font-medium flex-1 truncate">
                      {act.label}
                    </span>
                    <span
                      className={cn(
                        "text-[10px] font-mono px-2 py-0.5 rounded shrink-0",
                        isSelected
                          ? "bg-black/15 text-black font-bold"
                          : "bg-zinc-900 text-zinc-400 border border-zinc-800"
                      )}
                    >
                      {act.category}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                );
              })}
            </div>
          )}

          {filteredEvents.length > 0 && (
            <div>
              <p className="text-[10px] font-mono uppercase text-zinc-500 tracking-wider px-4 py-1.5">
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
                      else onNavigate("events");
                      onClose();
                    }}
                    className={cn(
                      "cursor-pointer w-[calc(100%-16px)] mx-2 px-3.5 py-2.5 flex items-center gap-3 rounded-xl transition",
                      isSelected ? "bg-white/15" : "hover:bg-zinc-900"
                    )}
                  >
                    <Flame className="w-4 h-4 text-white shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white font-medium truncate">
                        {event.title}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-mono truncate">
                        {event.category} · {event.date} · {event.venue}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenRegister(event);
                        onClose();
                      }}
                      className="cursor-pointer px-2.5 py-1 rounded-lg bg-white text-black text-[10px] font-mono uppercase font-bold shrink-0"
                    >
                      Book Seat
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="border-t border-zinc-800 px-4 py-2.5 bg-zinc-950 flex items-center justify-between text-[10px] font-mono text-zinc-500">
          <span>CodeChef ABESEC // Command Palette v2.6</span>
          <span className="flex items-center gap-2">
            <CornerDownLeft className="w-3 h-3" /> Select · ESC to close
          </span>
        </div>
      </div>
    </div>
  );
}
