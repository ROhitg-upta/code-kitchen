import React, { useState, useMemo } from "react";
import {
  Search,
  Calendar,
  Clock,
  MapPin,
  LayoutGrid,
  List,
  X,
  Trophy,
  Users,
  BookOpen,
  ChefHat,
  Ticket,
  ArrowUpRight,
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
  const label =
    occupancy > 0.85
      ? "CRITICAL CAPACITY"
      : occupancy > 0.65
      ? "FILLING FAST"
      : "OPEN";

  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-[11px] font-mono text-zinc-400">
          {registered}/{capacity} SEATS
        </span>
        <span className="text-[10px] font-mono font-bold tracking-wider text-white bg-zinc-900 border border-zinc-700 px-2 py-0.5 rounded">
          {label} · {Math.round(pct)}%
        </span>
      </div>
      <div className="h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
        <div
          className="h-full rounded-full bg-white transition-all duration-700"
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
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="glass-card max-w-3xl w-full max-h-[88vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-white/25 shadow-[0_25px_80px_rgba(0,0,0,0.9)] animate-fadeIn relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-mono uppercase font-bold bg-white text-black">
            {event.category}
          </span>
          {event.featured && (
            <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full text-[11px] font-mono uppercase font-semibold bg-zinc-900 text-white border border-zinc-700">
              ★ FLAGSHIP
            </span>
          )}
        </div>

        <h2 className="font-display text-2xl sm:text-3xl font-bold text-white leading-snug pr-10">
          {event.title}
        </h2>
        {event.subtitle && (
          <p className="text-zinc-400 text-sm mt-1.5">{event.subtitle}</p>
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
                className="bg-zinc-950 border border-zinc-800 rounded-xl p-3"
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <Icon className="w-3.5 h-3.5 text-white" />
                  <span className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider">
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
              <Clock className="w-4 h-4 text-white" />
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
                  className="bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2 flex items-center gap-2.5"
                >
                  <div>
                    <p className="text-sm text-white font-medium">{mentor.name}</p>
                    <p className="text-[11px] text-zinc-400">{mentor.role}</p>
                  </div>
                  {mentor.badge && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white/10 text-white border border-white/20 shrink-0">
                      {mentor.badge}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-4 border-t border-zinc-800">
          <button
            onClick={() => {
              onOpenRegister(event);
              onClose();
            }}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all"
          >
            <Ticket className="w-4 h-4" />
            Book Holographic Chef Pass
          </button>
          <button
            onClick={onClose}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-sm font-semibold border border-zinc-800 transition"
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
    <div className="px-4 py-12 sm:py-16 max-w-6xl mx-auto min-h-screen bg-cyber-grid">
      {/* Editorial Header */}
      <div className="mb-10 border-b border-zinc-800 pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
            01 // INTERACTIVE EVENT CATALOG
          </span>
          <h1 className="text-3xl sm:text-5xl font-display font-bold text-white mt-1 tracking-tight">
            THE KITCHEN MENU.
          </h1>
          <p className="text-zinc-400 mt-2 text-sm max-w-xl">
            Hover any card for 3D spotlight telemetry, inspect the live
            AgentTrace run-of-show, or book your holographic QR pass.
          </p>
        </div>
        <div className="font-mono text-xs text-zinc-500">
          SHOWING <strong className="text-white">{filteredEvents.length}</strong>{" "}
          OF {events.length} EVENTS
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search events, venues, tags..."
            className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-white/50 focus:outline-none transition"
          />
        </div>

        <select
          value={sortMode}
          onChange={(e) => setSortMode(e.target.value)}
          className="bg-zinc-950 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs font-mono text-zinc-200 cursor-pointer focus:outline-none"
        >
          <option value="date">SORT: UPCOMING DATE</option>
          <option value="filling">SORT: FILLING FAST</option>
          <option value="capacity">SORT: MAX CAPACITY</option>
        </select>

        <div className="flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-xl p-1">
          <button
            onClick={() => setViewMode("grid")}
            className={cn(
              "cursor-pointer p-2 rounded-lg transition",
              viewMode === "grid"
                ? "bg-white text-black"
                : "text-zinc-500 hover:text-zinc-200"
            )}
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode("compact")}
            className={cn(
              "cursor-pointer p-2 rounded-lg transition",
              viewMode === "compact"
                ? "bg-white text-black"
                : "text-zinc-500 hover:text-zinc-200"
            )}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              "cursor-pointer whitespace-nowrap rounded-full px-4 py-1.5 text-xs font-mono uppercase tracking-wider border transition-all shrink-0",
              activeCategory === cat
                ? "bg-white text-black border-white font-bold shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-600"
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Cards */}
      {filteredEvents.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-zinc-800 rounded-3xl">
          <ChefHat className="w-10 h-10 text-zinc-600 mb-3" />
          <p className="text-zinc-300 font-medium">
            No events match your search
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("All");
            }}
            className="cursor-pointer mt-4 px-4 py-2 rounded-full bg-white text-black text-xs font-mono uppercase font-bold"
          >
            Reset Filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
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
                className="p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-white text-black">
                      {event.category}
                    </span>
                    {event.prizePool && (
                      <span className="font-mono text-[11px] text-zinc-300 bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded">
                        {event.prizePool}
                      </span>
                    )}
                  </div>

                  <h3 className="font-display font-bold text-xl text-white mt-3.5 line-clamp-2 leading-snug">
                    {event.title}
                  </h3>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs font-mono text-zinc-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-white" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-white" />
                      {event.venue}
                    </span>
                  </div>

                  <p className="text-xs text-zinc-400 line-clamp-2 mt-3 leading-relaxed">
                    {event.description}
                  </p>

                  {event.tags && (
                    <div className="flex flex-wrap gap-1.5 mt-3.5">
                      {event.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-950 text-zinc-300 border border-zinc-800"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-4 mt-5 border-t border-zinc-800/80">
                  <CapacityBar
                    registered={liveCount}
                    capacity={event.capacity}
                  />
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => setSelectedEvent(event)}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-xs font-semibold transition"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      Run-of-Show
                    </button>
                    <button
                      onClick={() => onOpenRegister(event)}
                      className="cursor-pointer flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold transition"
                    >
                      Book Pass
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </SpotlightCard>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredEvents.map((event) => {
            const liveCount = Math.max(
              regCountMap[event.id] ?? 0,
              event.registeredCount ?? 0
            );
            return (
              <div
                key={event.id}
                className="glass-card rounded-2xl px-5 py-4 flex flex-wrap items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-white text-black font-bold">
                      {event.category}
                    </span>
                    <h4 className="font-display font-bold text-white text-base truncate">
                      {event.title}
                    </h4>
                  </div>
                  <p className="text-xs font-mono text-zinc-400 mt-1">
                    {event.date} · {event.venue} · {liveCount}/{event.capacity}{" "}
                    Seats
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedEvent(event)}
                    className="cursor-pointer px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-semibold border border-zinc-800"
                  >
                    Run-of-Show
                  </button>
                  <button
                    onClick={() => onOpenRegister(event)}
                    className="cursor-pointer px-4 py-2 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-bold"
                  >
                    Book Seat
                  </button>
                </div>
              </div>
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
