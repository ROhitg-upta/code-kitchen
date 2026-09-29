import React, { useState, useEffect, useMemo } from "react";
import {
  Zap,
  Calendar,
  MapPin,
  Clock,
  ArrowRight,
  Shield,
  Ticket,
  Activity,
  ChevronRight,
  Terminal,
  Sparkles,
  Trophy,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import CrowdCanvas from "@/components/ui/CrowdCanvas";
import AgentTrace from "@/components/ui/AgentTrace";
import SpotlightCard from "@/components/ui/SpotlightCard";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";

const EVENT_POSTERS = [
  "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=800&h=800&fit=crop&q=80",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=800&fit=crop&q=80",
];

const STATIONS = [
  {
    code: "STN-01",
    name: "Development Station",
    tag: "1st Preference · Full-Stack",
    metric: "99.9% Uptime",
    desc: "Production web portals, interactive dashboards, real-time telemetry, and edge deployments.",
  },
  {
    code: "STN-02",
    name: "Events & Operations",
    tag: "2nd Preference · Ground Ops",
    metric: "< 2.4s Gate Scan",
    desc: "High-throughput QR gate check-ins, venue logistics, run-of-show orchestration, and zero-fire execution.",
  },
  {
    code: "STN-03",
    name: "Competitive Programming",
    tag: "Algorithmic Core · ICPC",
    metric: "1400+ Rated Chefs",
    desc: "CodeChef Starters, ICPC regionals prep, live rating battles, and crushing TLEs under pressure.",
  },
  {
    code: "STN-04",
    name: "Graphics & Production",
    tag: "Brand & Design Systems",
    metric: "60fps Motion UI",
    desc: "High-voltage design systems, 3D motion promos, holographic passes, and campus-wide visual identity.",
  },
];

function useCountdown(targetDateStr) {
  const [timeLeft, setTimeLeft] = useState({
    days: 16,
    hours: 11,
    minutes: 42,
    seconds: 19,
  });

  useEffect(() => {
    if (!targetDateStr) return;
    const computeDelta = () => {
      const now = Date.now();
      const target = new Date(targetDateStr).getTime();
      const diff = Math.max(0, target - now);
      return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      };
    };
    setTimeLeft(computeDelta());
    const id = setInterval(() => setTimeLeft(computeDelta()), 1000);
    return () => clearInterval(id);
  }, [targetDateStr]);

  return timeLeft;
}

export default function HomeModule({
  events,
  registrations,
  broadcastMsg,
  onNavigate,
  onOpenRegister,
  onSelectEvent,
}) {
  const featuredEvent = events.find((e) => e.featured) || events[0];
  const countdown = useCountdown(featuredEvent?.date);
  const [homeSearch, setHomeSearch] = useState("");
  const [homeCategory, setHomeCategory] = useState("All");

  const filteredHomeEvents = useMemo(() => {
    return events.filter((ev) => {
      const matchCat = homeCategory === "All" || ev.category === homeCategory;
      const q = homeSearch.trim().toLowerCase();
      const matchName =
        !q ||
        [ev.title, ev.subtitle, ev.category, ev.venue, ...(ev.tags || [])]
          .join(" ")
          .toLowerCase()
          .includes(q);
      return matchCat && matchName;
    });
  }, [events, homeSearch, homeCategory]);

  // Convert featured event agenda into 21st.dev AgentTrace spans
  const traceSpans = useMemo(() => {
    const agenda = featuredEvent?.agenda || [];
    const kinds = ["tool", "model", "agent", "io", "model", "agent"];
    return agenda.map((item, idx) => ({
      id: `stage-${idx}`,
      label: item.stage,
      timeLabel: item.time,
      owner: item.owner,
      kind: kinds[idx % kinds.length],
      start: idx * 1400,
      end: (idx + 1) * 1400 - 150,
      depth: idx === 2 || idx === 3 ? 1 : 0,
      detail: `${item.time} · Managed by ${item.owner}`,
    }));
  }, [featuredEvent]);

  const totalEvents = events.length;
  const totalChefs = registrations.length;
  const gateVerified = registrations.filter((r) => r.checkedIn).length;
  const regCount = featuredEvent
    ? registrations.filter((r) => r.eventId === featuredEvent.id).length
    : 0;
  const capacity = featuredEvent?.capacity ?? 120;
  const liveRegistered = Math.max(featuredEvent?.registeredCount ?? 0, regCount);
  const occupancy = Math.min(1, liveRegistered / capacity);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      {/* ───────── 1. Monochrome Broadcast Ticker Bar ───────── */}
      {broadcastMsg && (
        <div className="relative w-full overflow-hidden bg-black text-white h-9 flex items-center border-b border-zinc-800">
          <div className="flex items-center whitespace-nowrap animate-[marquee_24s_linear_infinite]">
            {[0, 1, 2].map((idx) => (
              <span
                key={idx}
                className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-widest text-zinc-200 font-medium px-8"
              >
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                {broadcastMsg}
                <span className="mx-6 text-zinc-600">///</span>
              </span>
            ))}
          </div>
          <style>{`
            @keyframes marquee {
              0% { transform: translateX(0); }
              100% { transform: translateX(-33.333%); }
            }
          `}</style>
        </div>
      )}

      {/* ───────── 2. FULL-VIEWPORT BLACK & WHITE SKIPER39 CROWD HERO ───────── */}
      <section className="relative h-[92vh] min-h-[700px] w-full bg-[#f6f6f4] text-black overflow-hidden bg-light-grid border-b border-zinc-300">
        {/* Subtle Corner Architectural Coordinates */}
        <div className="hidden sm:flex items-center justify-between px-8 pt-5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500 relative z-20">
          <span>CODECHEF ABESEC // CHAPTER 2026–27</span>
          <span>28.6341° N, 77.4456° E · GHAZIABAD</span>
          <span>CHEFOPS ENGINE v2.6</span>
        </div>

        {/* Centered Editorial Landing Text integrated directly above & with the Giant Crowd */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 pt-6 sm:pt-10 flex flex-col items-center text-center">
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-1.5 text-[11px] font-mono uppercase tracking-widest shadow-xl">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            The Code Kitchen · Official Event Portal
          </div>

          {/* Massive Editorial Monochrome Headline */}
          <h1 className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[82px] font-bold tracking-[-0.04em] text-black leading-[0.95] mt-5 max-w-4xl">
            WHERE CODE MEETS <br />
            <span className="italic font-light underline decoration-2 underline-offset-8">
              THE KITCHEN.
            </span>
          </h1>

          {/* Subtitle */}
          <p className="mt-4 text-sm sm:text-base md:text-lg text-zinc-700 max-w-xl font-medium leading-relaxed">
            Engineered for CodeChef ABESEC. Real-time seat heatmaps,
            holographic QR entry passes, AI event concierge, and live
            run-of-show execution traces.
          </p>

          {/* High-Contrast Black & White Action Buttons */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => onNavigate("events")}
              className="cursor-pointer group flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-black text-white font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-[0_14px_35px_rgba(0,0,0,0.35)] hover:bg-zinc-800 transition-all active:scale-95"
            >
              Explore Kitchen Menu
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            {featuredEvent && (
              <button
                onClick={() => onOpenRegister(featuredEvent)}
                className="cursor-pointer flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/95 hover:bg-white text-black border-2 border-black font-semibold text-xs sm:text-sm uppercase tracking-wider shadow-lg transition-all active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                Get Instant QR Pass
              </button>
            )}

            <button
              onClick={() => onNavigate("ai-finder")}
              className="cursor-pointer flex items-center gap-2 px-5 py-3.5 rounded-full bg-zinc-200/90 hover:bg-zinc-300 text-black font-mono text-xs uppercase tracking-wider transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Ask Head Chef AI
            </button>
          </div>

          {/* Vertical Skiper39 Hairline Pointer into the Crowd */}
          <div className="mt-4 flex flex-col items-center">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-500">
              {totalChefs + 140}+ Active ABESEC Chefs Walking In
            </span>
            <div className="w-px h-10 bg-gradient-to-b from-black/60 to-transparent mt-1" />
          </div>
        </div>

        {/* ── GIANT 21ST.DEV SKIPER39 CROWD CANVAS (Spans 82vh of the Hero!) ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[78vh] sm:h-[82vh] w-full z-10 pointer-events-none">
          <CrowdCanvas
            src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/175711/open-peeps-sheet.png"
            rows={15}
            cols={7}
          />
        </div>

        {/* Floating Monochrome Glass Telemetry Bar Overlaid at Bottom of Crowd */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 w-[calc(100%-2rem)] max-w-4xl">
          <div className="rounded-2xl bg-black/90 backdrop-blur-xl border border-white/20 px-5 py-3.5 text-white shadow-[0_20px_60px_rgba(0,0,0,0.65)] grid grid-cols-2 sm:grid-cols-4 gap-4 items-center">
            {[
              { label: "Kitchen Events", val: `0${totalEvents}`, tag: "LIVE" },
              { label: "Registered Chefs", val: totalChefs + 142, tag: "+24%" },
              { label: "QR Gate Verified", val: gateVerified + 89, tag: "PASS" },
              { label: "Command Shortcut", val: "Ctrl + K", tag: "CLI" },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between border-r last:border-r-0 border-zinc-800 pr-3 last:pr-0"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                    {item.label}
                  </p>
                  <p className="font-display text-lg sm:text-xl font-bold text-white tabular-nums">
                    {item.val}
                  </p>
                </div>
                <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-white/10 text-zinc-200 border border-white/15">
                  {item.tag}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ───────── 2.5. Search Events by Name + 3D Coverflow Event Stage ───────── */}
      <section className="max-w-6xl mx-auto px-4 pt-20 pb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-6 mb-8">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
              01 // SEARCH & SWIPE THE EVENT LINEUP
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1 tracking-tight">
              Search Events by Name
            </h2>
          </div>
          <button
            onClick={() => onNavigate("events")}
            className="cursor-pointer inline-flex items-center gap-1.5 font-mono text-xs text-white hover:text-zinc-300 border border-zinc-800 rounded-full px-4 py-2 bg-zinc-900/80"
          >
            Open Full Explorer ({events.length}) <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Prominent Live Search Events by Name Bar + Quick Filter Chips */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                value={homeSearch}
                onChange={(e) => setHomeSearch(e.target.value)}
                placeholder="🔍 Search events by name (e.g., Cook-Off 7.0, ICPC Lockout, Next.js, GenAI, GSoC)..."
                className="w-full bg-zinc-950 border-2 border-zinc-800 focus:border-white rounded-2xl px-5 py-3.5 text-sm text-white placeholder-zinc-500 focus:outline-none transition shadow-[0_10px_40px_rgba(0,0,0,0.6)]"
              />
              {homeSearch && (
                <button
                  type="button"
                  onClick={() => setHomeSearch("")}
                  className="cursor-pointer absolute right-3.5 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-white text-zinc-300 hover:text-black font-mono text-[10px] uppercase font-bold transition"
                >
                  CLEAR
                </button>
              )}
            </div>
          </div>

          {/* Quick Event Name & Category Chips */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mr-1">
              Filter by Category:
            </span>
            {[
              "All",
              "Hackathon",
              "Competitive Programming",
              "Development",
              "Workshop",
              "Tech Talk",
            ].map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setHomeCategory(cat)}
                className={cn(
                  "cursor-pointer px-3.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider border transition",
                  homeCategory === cat
                    ? "bg-white text-black border-white font-bold"
                    : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filteredHomeEvents.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-zinc-800 bg-zinc-950/50 py-16 px-4 text-center">
            <p className="font-display text-lg text-white font-bold">
              No events found matching "{homeSearch}"
            </p>
            <p className="text-xs text-zinc-500 font-mono mt-1">
              Try searching for Cook-Off, ICPC, Next.js, GenAI, or GSoC
            </p>
            <button
              type="button"
              onClick={() => {
                setHomeSearch("");
                setHomeCategory("All");
              }}
              className="cursor-pointer mt-4 px-5 py-2 rounded-full bg-white text-black font-mono text-xs uppercase font-bold"
            >
              Reset Search
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-zinc-800/90 bg-[#070709]/95 py-8 px-2 sm:px-6 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
            <CoverflowCarousel
              key={`${homeCategory}-${homeSearch}`}
              slides={filteredHomeEvents.map((ev, idx) => ({
                id: ev.id,
                src: EVENT_POSTERS[idx % EVENT_POSTERS.length],
                alt: ev.title,
                title: ev.title,
                subtitle: ev.subtitle || ev.description,
                badge: ev.category,
                dateLabel: ev.date,
                prizePool: ev.prizePool,
                featured: ev.featured,
                rawEvent: ev,
                meta: [
                  { label: "Date & Time", value: `${ev.date} · ${ev.time}` },
                  { label: "Campus Venue", value: ev.venue },
                  {
                    label: "Seat Occupancy",
                    value: `${ev.registeredCount || 0} / ${ev.capacity} Booked`,
                  },
                  {
                    label: "Prize Pool",
                    value: ev.prizePool || "Certificates + Swag",
                  },
                ],
              }))}
              showCaption
              showNavigation
              showPagination
              onBookEvent={onOpenRegister}
              onInspectEvent={onSelectEvent}
            />
          </div>
        )}
      </section>

      {/* ───────── 3. Monochrome Bento Grid: Flagship + Live AgentTrace ───────── */}
      <section className="max-w-6xl mx-auto px-4 py-20 space-y-10 bg-cyber-grid">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800 pb-6">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
              01 // FLAGSHIP TELEMETRY & EXECUTION
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white mt-1 tracking-tight">
              Flagship Spotlight & Run-of-Show Trace
            </h2>
          </div>
          <button
            onClick={() => onNavigate("events")}
            className="cursor-pointer inline-flex items-center gap-1.5 font-mono text-xs text-white hover:text-zinc-300 border border-zinc-800 rounded-full px-4 py-2 bg-zinc-900/80"
          >
            View All {events.length} Events <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {featuredEvent && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            {/* Left Bento (7 cols): 3D Monochrome Flagship Card */}
            <SpotlightCard
              enableTilt
              className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between"
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono uppercase tracking-wider bg-white text-black font-bold">
                    ★ FLAGSHIP EVENT
                  </span>
                  <span className="font-mono text-xs text-zinc-200 bg-zinc-900 border border-zinc-700 px-3 py-1 rounded-full">
                    Prize Pool: {featuredEvent.prizePool || "₹25,000"}
                  </span>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {featuredEvent.title}
                </h3>
                <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                  {featuredEvent.subtitle || featuredEvent.description}
                </p>

                <div className="flex flex-wrap items-center gap-4 mt-5 text-xs font-mono text-zinc-300">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-white" />
                    {featuredEvent.venue}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-white" />
                    {featuredEvent.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-white" />
                    {featuredEvent.time}
                  </span>
                </div>

                {/* Live Monochrome Countdown */}
                <div className="grid grid-cols-4 gap-3 mt-6">
                  {[
                    { val: countdown.days, unit: "DAYS" },
                    { val: countdown.hours, unit: "HOURS" },
                    { val: countdown.minutes, unit: "MINS" },
                    { val: countdown.seconds, unit: "SECS" },
                  ].map((b) => (
                    <div
                      key={b.unit}
                      className="rounded-xl bg-zinc-950 border border-zinc-800 p-3.5 text-center"
                    >
                      <span className="block font-mono text-2xl sm:text-3xl font-bold text-white tabular-nums">
                        {String(b.val).padStart(2, "0")}
                      </span>
                      <span className="block font-mono text-[9px] tracking-widest text-zinc-500 mt-1">
                        {b.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Seat Occupancy + CTAs */}
              <div className="mt-6 pt-5 border-t border-zinc-800/80 space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-1.5">
                    <span className="text-zinc-400">LIVE SEAT OCCUPANCY</span>
                    <span className="text-white font-semibold">
                      {liveRegistered}/{capacity} Seats Booked (
                      {Math.round(occupancy * 100)}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800">
                    <div
                      className="h-full rounded-full bg-white transition-all duration-700"
                      style={{ width: `${Math.min(100, occupancy * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => onOpenRegister(featuredEvent)}
                    className="cursor-pointer flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200 transition"
                  >
                    <Ticket className="w-4 h-4" />
                    Book Holographic Chef Pass
                  </button>
                  <button
                    onClick={() => onSelectEvent(featuredEvent)}
                    className="cursor-pointer flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-800 text-sm font-semibold transition"
                  >
                    <Activity className="w-4 h-4 text-white" />
                    Full Run-of-Show
                  </button>
                </div>
              </div>
            </SpotlightCard>

            {/* Right Bento (5 cols): 21st.dev AgentTrace */}
            <div className="lg:col-span-5 flex flex-col justify-between">
              <AgentTrace
                title={`run_of_show // ${featuredEvent.id}`}
                spans={traceSpans}
                totalDuration={traceSpans.length * 1400}
                className="h-full"
              />
            </div>
          </div>
        )}
      </section>

      {/* ───────── 4. Monochrome Swiss-Grid Stations ───────── */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="mb-8 border-b border-zinc-800 pb-5 flex items-end justify-between">
          <div>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
              02 // CHAPTER ARCHITECTURE
            </span>
            <h2 className="font-display text-3xl font-bold text-white mt-1">
              Core Kitchen Stations
            </h2>
          </div>
          <span className="font-mono text-xs text-zinc-500 hidden sm:inline">
            ABESEC RECRUITMENTS 2026–27
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATIONS.map((station) => (
            <SpotlightCard
              key={station.name}
              enableTilt
              className="p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-5">
                  <span className="font-mono text-xs font-bold text-zinc-400">
                    {station.code}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full font-mono text-[10px] font-semibold bg-white/10 text-white border border-white/20">
                    {station.metric}
                  </span>
                </div>
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-1">
                  {station.tag}
                </p>
                <h3 className="font-display text-lg font-bold text-white">
                  {station.name}
                </h3>
                <p className="text-xs text-zinc-400 mt-2.5 leading-relaxed">
                  {station.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-300">
                <span>Station Active</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </SpotlightCard>
          ))}
        </div>
      </section>
    </div>
  );
}
