import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  LayoutGrid,
  List,
  X,
  Flame,
  Trophy,
  Users,
  BookOpen,
  ChefHat,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SpotlightCard from "@/components/ui/SpotlightCard";
import AgentTrace from "@/components/ui/AgentTrace";

const CATEGORIES = [
  "All",
  "Hackathon",
  "Competitive Programming",
  "Development",
  "Workshop",
  "Tech Talk",
];

function CapacityBar({ registered, capacity }) {
  const occupancy = capacity > 0 ? registered / capacity : 0;
  const pct = Math.min(100, occupancy * 100);
  const barColor =
    occupancy > 0.85
      ? "bg-rose-500 animate-pulse"
      : occupancy > 0.65
      ? "bg-amber-500"
      : "bg-emerald-500";
  const label =
    occupancy > 0.85
      ? "Almost Full!"
      : occupancy > 0.65
      ? "Filling Fast 🔥"
      : "Open";
  const labelColor =
    occupancy > 0.85
      ? "text-rose-400"
      : occupancy > 0.65
      ? "text-amber-400"
      : "text-emerald-400";

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[11px] font-mono text-slate-400">
          {registered}/{capacity} Seats
        </span>
        <span className={cn("text-[11px] font-mono font-semibold", labelColor)}>
          {label}
        </span>
      </div>
      <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-700", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function RunOfShowModal({ event, onClose, onOpenRegister }) {
  if (!event) return null;

  const kinds = ["tool", "model", "agent", "io", "model", "agent"];
  const traceSpans = (event.agenda || []).map((item, idx) => ({
    id: `modal-stage-${idx}`,
    label: item.stage,
    timeLabel: item.time,
    owner: item.owner,
    kind: kinds[idx % kinds.length],
    start: idx * 1500,
    end: (idx + 1) * 1500 - 120,
    depth: idx % 2 === 1 ? 1 : 0,
    detail: `${item.time} · Lead Station: ${item.owner}`,
  }));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-card max-w-3xl w-full max-h-[88vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-[0_0_60px_rgba(245,158,11,0.18)] animate-fadeIn relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
            {event.category}
          </span>
          {event.featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/25">
              <Flame className="w-3 h-3" /> Featured
            </span>
          )}
        </div>

        <h2 className="font-display text-2xl font-bold text-white leading-snug pr-10">
          {event.title}
        </h2>
        {event.subtitle && (
          <p className="text-slate-400 text-sm mt-1.5">{event.subtitle}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          {[
            { icon: MapPin, label: "Venue", value: event.venue },
            { icon: Trophy, label: "Prize Pool", value: event.prizePool || "—" },
            { icon: Users, label: "Team Size", value: event.teamSize || "—" },
            { icon: BookOpen, label: "Difficulty", value: event.difficulty || "—" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-3"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-amber-400/70" />
                  <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider">
                    {item.label}
                  </span>
                </div>
                <p className="text-sm text-white font-medium truncate">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        {/* 21st.dev AgentTrace Interactive Timeline */}
        {traceSpans.length > 0 && (
          <div className="mt-6">
            <h3 className="font-display font-semibold text-white text-sm mb-3 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Interactive Run-of-Show Trace (Press Play to Replay)
            </h3>
            <AgentTrace
              title={`agenda_trace // ${event.id}`}
              spans={traceSpans}
              totalDuration={traceSpans.length * 1500}
            />
          </div>
        )}

        {/* Mentors */}
        {event.mentors && event.mentors.length > 0 && (
          <div className="mt-5">
            <h3 className="font-display font-semibold text-white text-sm mb-3">
              Mentors & Judges
            </h3>
            <div className="flex flex-wrap gap-2">
              {event.mentors.map((mentor, idx) => (
                <div
                  key={idx}
                  className="bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 flex items-center gap-2"
                >
                  <div>
                    <p className="text-sm text-white font-medium">{mentor.name}</p>
                    <p className="text-[11px] text-slate-400">{mentor.role}</p>
                  </div>
                  {mentor.badge && (
                    <span className="px-1.5 py-0.5 rounded-md text-[10px] font-mono bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 shrink-0">
                      {mentor.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              onOpenRegister(event);
              onClose();
            }}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition-all"
          >
            <Ticket className="w-4 h-4" />
            Book Your Seat 🎫
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EventsExplorerModule({
  events,
  registrations,
  onOpenRegister,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortMode, setSortMode] = useState("date");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedEvent, setSelectedEvent] = useState(null);

  const regCountMap = useMemo(() => {
    const map = {};
    registrations.forEach((r) => {
      map[r.eventId] = (map[r.eventId] || 0) + 1;
    });
    return map;
  }, [registrations]);

  const filteredEvents = useMemo(() => {
    let result = [...events];
    if (activeCategory !== "All") {
      result = result.filter((e) => e.category === activeCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) =>
        [e.title, e.venue, e.description, ...(e.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(q)
      );
    }
    if (sortMode === "date") {
      result.sort((a, b) => new Date(a.date) - new Date(b.date));
    } else if (sortMode === "filling") {
      result.sort((a, b) => {
        const occA = (a.registeredCount || 0) / (a.capacity || 1);
        const occB = (b.registeredCount || 0) / (b.capacity || 1);
        return occB - occA;
      });
    } else if (sortMode === "capacity") {
      result.sort((a, b) => (b.capacity || 0) - (a.capacity || 0));
    }
    return result;
  }, [events, activeCategory, searchQuery, sortMode]);

  return (
    <div className="px-4 py-10 sm:py-14 max-w-6xl mx-auto">
      <div className="mb-8">
        <span className="font-mono text-xs uppercase tracking-widest text-amber-400">
          // Interactive Event Catalog
        </span>
        <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mt-1">
          ⚡ The Kitchen Menu
        </h1>
        <p className="text-slate-400 mt-1.5">
          Hover any card for real-time spotlight telemetry, inspect the
          AgentTrace run-of-show, or book your holographic QR pass.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, venues, tags..."
            className="w-full bg-slate-900/90 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none transition"
          />
        </div>

        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value)}
          className="bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-slate-300 cursor-pointer"
        >
          <option value="date">Sort: Upcoming Date</option>
          <option value="filling">Sort: Filling Fast 🔥</option>
          <option value="capacity">Sort: Max Capacity</option>
        </select>

        <div className="flex items-center gap-1 bg-slate-900/90 border border-slate-800 rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "cursor-pointer p-2 rounded-lg transition",
              viewMode === "grid"
                ? "bg-amber-500/20 text-amber-400"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("compact")}
            className={cn(
              "cursor-pointer p-2 rounded-lg transition",
              viewMode === "compact"
                ? "bg-amber-500/20 text-amber-400"
                : "text-slate-500 hover:text-slate-300"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-semibold border transition-all shrink-0",
              activeCategory === cat
                ? "bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.18)]"
                : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <ChefHat className="w-10 h-10 text-slate-600 mb-3" />
          <p className="text-slate-400 font-medium">
            No events match your search
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map((event) => {
            const liveCount = Math.max(
              regCountMap[event.id] ?? 0,
              event.registeredCount ?? 0
            );
            return (
              <SpotlightCard
                key={event.id}
                enableTilt
                className="p-5 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                      {event.category}
                    </span>
                    {event.prizePool && (
                      <span className="font-mono text-[11px] text-emerald-400">
                        {event.prizePool}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-lg text-white mt-3 line-clamp-2">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-amber-400/80" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-400/80" />
                      {event.venue}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-2 mt-2.5">
                    {event.description}
                  </p>

                  {event.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {event.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-900 text-slate-300 border border-slate-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-4 border-t border-slate-800/70">
                  <CapacityBar
                    registered={liveCount}
                    capacity={event.capacity}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 text-xs font-semibold transition"
                    >
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      Run-of-Show
                    </button>
                    <button
                      onClick={() => onOpenRegister(event)}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-600 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/20 hover:from-amber-300 hover:to-orange-500 transition"
                    >
                      Book Pass 🎫
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      )}

      {selectedEvent && (
        <RunOfShowModal
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
          onOpenRegister={onOpenRegister}
        />
      )}
    </div>
  );
}
