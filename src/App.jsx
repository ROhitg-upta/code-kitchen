import React, { useState, useEffect, useCallback } from "react";
import confetti from "canvas-confetti";
import {
  Home,
  Calendar,
  Sparkles,
  Trophy,
  Shield,
  Ticket,
  Terminal,
  Menu,
  X,
  Clock,
  MapPin,
  Users,
  BookOpen,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { INITIAL_EVENTS, INITIAL_REGISTRATIONS } from "./data/initialData";

import HomeModule from "./modules/home/HomeModule";
import EventsExplorerModule from "./modules/events/EventsExplorerModule";
import RegistrationModal from "./modules/registration/RegistrationModal";
import QrPassModal from "./modules/registration/QrPassModal";
import AdminOpsModule from "./modules/admin/AdminOpsModule";
import AiChefFinderModule from "./modules/concierge/AiChefFinderModule";
import BranchBattleModule from "./modules/leaderboard/BranchBattleModule";
import CommandPalette from "./modules/command/CommandPalette";
import AgentTrace from "./components/ui/AgentTrace";
import CinematicFooter from "./components/ui/CinematicFooter";
import { chefApi } from "./lib/api";

const NAV_ITEMS = [
  { id: "home", label: "Home", icon: Home },
  { id: "events", label: "Events", icon: Calendar },
  { id: "ai-finder", label: "AI Chef", icon: Sparkles },
  { id: "leaderboard", label: "Battle", icon: Trophy },
  { id: "admin", label: "Admin", icon: Shield },
];

export default function App() {
  const [events, setEvents] = useState(() => {
    try {
      const saved = localStorage.getItem("chefops-events");
      return saved ? JSON.parse(saved) : INITIAL_EVENTS;
    } catch {
      return INITIAL_EVENTS;
    }
  });

  const [registrations, setRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem("chefops-registrations");
      return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
    } catch {
      return INITIAL_REGISTRATIONS;
    }
  });

  const [activeView, setActiveView] = useState("home");
  const [adminAuth, setAdminAuth] = useState(false);
  const [backendLive, setBackendLive] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState(
    "CODECHEF ABESEC COOK-OFF 7.0 REGISTRATIONS CLOSING SOON — BOOK YOUR VERIFIED HOLOGRAPHIC QR CHEF PASS NOW"
  );
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState(false);
  const [registerEvent, setRegisterEvent] = useState(null);
  const [viewTicket, setViewTicket] = useState(null);
  const [selectedEventDetail, setSelectedEventDetail] = useState(null);
  const [myPassesOpen, setMyPassesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Hydrate from Express + MongoDB/JSON Backend on mount
  useEffect(() => {
    let mounted = true;
    async function syncFromBackend() {
      const health = await chefApi.getHealth();
      if (!health?.success || !mounted) return;
      setBackendLive(true);

      const [evRes, regRes, bcastRes] = await Promise.all([
        chefApi.getEvents(),
        chefApi.getRegistrations(),
        chefApi.getBroadcast(),
      ]);
      if (!mounted) return;
      if (evRes?.success && Array.isArray(evRes.data)) setEvents(evRes.data);
      if (regRes?.success && Array.isArray(regRes.data))
        setRegistrations(regRes.data);
      if (bcastRes?.success && typeof bcastRes.message === "string")
        setBroadcastMsg(bcastRes.message);
    }
    syncFromBackend();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("chefops-events", JSON.stringify(events));
    } catch {}
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(
        "chefops-registrations",
        JSON.stringify(registrations)
      );
    } catch {}
  }, [registrations]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCmdPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = useCallback((view) => {
    setCmdPaletteOpen(false);
    setMobileMenuOpen(false);
    if (view === "__toggle_cmd__" || view === "toggle_cmd") {
      setCmdPaletteOpen((prev) => !prev);
      return;
    }
    if (view === "admin-scanner") {
      setAdminAuth(true);
      setActiveView("admin");
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleAddEvent = useCallback((newEvent) => {
    setEvents((prev) => [...prev, newEvent]);
    chefApi.createEvent(newEvent);
  }, []);

  const handleEditEvent = useCallback((updated) => {
    setEvents((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
    chefApi.updateEvent(updated.id, updated);
  }, []);

  const handleDeleteEvent = useCallback((eventId) => {
    setEvents((prev) => prev.filter((e) => e.id !== eventId));
    setRegistrations((prev) => prev.filter((r) => r.eventId !== eventId));
    chefApi.deleteEvent(eventId);
  }, []);

  const handleRegister = useCallback((newReg) => {
    setRegistrations((prev) => [newReg, ...prev]);
    setEvents((prev) =>
      prev.map((e) =>
        e.id === newReg.eventId
          ? { ...e, registeredCount: (e.registeredCount || 0) + 1 }
          : e
      )
    );
    setRegisterEvent(null);
    setViewTicket(newReg);
    chefApi.createRegistration(newReg);

    try {
      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
        colors: ["#ffffff", "#d4d4d8", "#71717a", "#18181b"],
      });
    } catch {}
  }, []);

  const handleToggleCheckIn = useCallback((regId) => {
    setRegistrations((prev) =>
      prev.map((r) =>
        r.id === regId ? { ...r, checkedIn: !r.checkedIn } : r
      )
    );
    chefApi.toggleCheckIn(regId);
  }, []);

  const handleSetBroadcast = useCallback((msg) => {
    setBroadcastMsg(msg);
    chefApi.setBroadcast(msg);
  }, []);

  const handleResetData = useCallback(() => {
    setEvents(INITIAL_EVENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setBroadcastMsg(
      "CODECHEF ABESEC COOK-OFF 7.0 REGISTRATIONS CLOSING SOON — BOOK YOUR VERIFIED HOLOGRAPHIC QR CHEF PASS NOW"
    );
    chefApi.resetData();
  }, []);

  const handleExportCsv = useCallback(() => {
    const headers = [
      "Ticket ID",
      "Name",
      "Email",
      "Branch",
      "Year",
      "Phone",
      "Event",
      "Station",
      "Check-In",
      "Registered At",
    ];
    const rows = registrations.map((r) => [
      r.ticketId,
      r.name,
      r.email,
      r.branch,
      r.year,
      r.phone,
      r.eventTitle,
      r.stationInterest,
      r.checkedIn ? "Yes" : "No",
      r.registeredAt,
    ]);
    const csv = [headers, ...rows]
      .map((row) =>
        row.map((c) => `"${String(c ?? "").replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `chefops_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [registrations]);

  const handleJumpToScanner = useCallback(() => {
    setViewTicket(null);
    setAdminAuth(true);
    setActiveView("admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 flex flex-col">
      {/* ───────── Monochrome Top Navigation Bar ───────── */}
      <header className="sticky top-0 z-40 bg-black/90 backdrop-blur-xl border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo with Custom Chef + Code Web Icon */}
          <button
            onClick={() => handleNavigate("home")}
            className="cursor-pointer flex items-center gap-3 text-left group"
          >
            <div className="w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center shadow-[0_0_25px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform overflow-hidden p-1.5">
              <svg
                viewBox="0 0 64 64"
                fill="none"
                className="w-full h-full"
                aria-hidden="true"
              >
                <path
                  d="M22 26C18.6863 26 16 23.3137 16 20C16 16.6863 18.6863 14 22 14C23.31 14 24.52 14.42 25.5 15.13C27.05 12.66 29.83 11 33 11C36.17 11 38.95 12.66 40.5 15.13C41.48 14.42 42.69 14 44 14C47.3137 14 50 16.6863 50 20C50 23.3137 47.3137 26 44 26H22Z"
                  fill="#050505"
                />
                <rect x="21" y="28" width="24" height="4" rx="1.5" fill="#050505" />
                <path
                  d="M24 38L17 44L24 50"
                  stroke="#050505"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M42 38L49 44L42 50"
                  stroke="#050505"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M35.5 36L30.5 52"
                  stroke="#3f3f46"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div>
              <span className="font-display font-bold text-white text-base tracking-tight block leading-none">
                THE CODE KITCHEN
              </span>
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-widest block mt-0.5">
                CodeChef ABESEC · v2.6
              </span>
            </div>
          </button>

          {/* Center Nav Pills */}
          <nav className="hidden md:flex items-center gap-1 bg-zinc-950 border border-zinc-800 rounded-full p-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={cn(
                    "cursor-pointer flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200",
                    isActive
                      ? "bg-white text-black shadow-sm"
                      : "text-zinc-400 hover:text-white"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <span
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-950 border border-zinc-800 text-[10px] font-mono text-zinc-400"
              title={
                backendLive
                  ? "Connected to Express + MongoDB/JSON Backend API"
                  : "Using LocalStorage Persistence Mode"
              }
            >
              <span
                className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  backendLive ? "bg-white animate-pulse" : "bg-zinc-500"
                )}
              />
              {backendLive ? "API LIVE" : "LOCAL DB"}
            </span>

            <button
              onClick={() => setMyPassesOpen(true)}
              className="cursor-pointer flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-semibold text-white transition"
              title="View Registered Passes"
            >
              <Ticket className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">My Passes</span>
              {registrations.length > 0 && (
                <span className="px-1.5 py-0.2 rounded-full bg-white text-black font-mono text-[10px] font-bold">
                  {registrations.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setCmdPaletteOpen(true)}
              className="cursor-pointer flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-xs font-mono text-zinc-300 hover:text-white transition"
              title="Open Command Palette (Ctrl+K)"
            >
              <Terminal className="w-3.5 h-3.5" />
              <kbd className="text-[10px]">⌘K</kbd>
            </button>

            <button
              onClick={() => setMobileMenuOpen(true)}
              className="cursor-pointer md:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
              aria-label="Open menu"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* ───────── Mobile Drawer ───────── */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md md:hidden animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileMenuOpen(false);
          }}
        >
          <div className="absolute right-0 top-0 h-full w-64 bg-[#09090b] border-l border-zinc-800 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <span className="font-display font-bold text-white text-sm">
                NAVIGATION
              </span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="cursor-pointer p-1.5 rounded-lg bg-zinc-900 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.id)}
                    className={cn(
                      "cursor-pointer w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition",
                      isActive
                        ? "bg-white text-black font-semibold"
                        : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ───────── Main Content (Curtain Stage z-10) ───────── */}
      <main className="relative z-10 flex-1 bg-[#050505] rounded-b-[2.5rem] border-b border-zinc-800/90 shadow-[0_35px_100px_rgba(0,0,0,0.98)] overflow-hidden">
        {activeView === "home" && (
          <HomeModule
            events={events}
            registrations={registrations}
            broadcastMsg={broadcastMsg}
            onNavigate={handleNavigate}
            onOpenRegister={setRegisterEvent}
            onSelectEvent={(evt) => setSelectedEventDetail(evt)}
          />
        )}
        {activeView === "events" && (
          <EventsExplorerModule
            events={events}
            registrations={registrations}
            onOpenRegister={setRegisterEvent}
          />
        )}
        {activeView === "ai-finder" && (
          <AiChefFinderModule
            events={events}
            registrations={registrations}
            onOpenRegister={setRegisterEvent}
          />
        )}
        {activeView === "leaderboard" && (
          <BranchBattleModule registrations={registrations} />
        )}
        {activeView === "admin" && (
          <AdminOpsModule
            events={events}
            registrations={registrations}
            broadcastMsg={broadcastMsg}
            adminAuth={adminAuth}
            onAdminLogin={() => setAdminAuth(true)}
            onAddEvent={handleAddEvent}
            onEditEvent={handleEditEvent}
            onDeleteEvent={handleDeleteEvent}
            onToggleCheckIn={handleToggleCheckIn}
            onSetBroadcast={handleSetBroadcast}
            onResetData={handleResetData}
            onNavigate={handleNavigate}
          />
        )}
      </main>

      {/* ───────── Cinematic Scroll-Reveal Sticky Footer (z-0 Curtain Reveal) ───────── */}
      <CinematicFooter
        onNavigate={handleNavigate}
        onOpenRegister={setRegisterEvent}
        onExportCsv={handleExportCsv}
        featuredEvent={events.find((e) => e.featured) || events[0]}
      />

      {/* ───────── My Passes Drawer ───────── */}
      {myPassesOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMyPassesOpen(false);
          }}
        >
          <div className="glass-card max-w-lg w-full max-h-[80vh] rounded-3xl p-6 border border-white/20 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
                <Ticket className="w-5 h-5 text-white" />
                Issued Chef Passes ({registrations.length})
              </h3>
              <button
                onClick={() => setMyPassesOpen(false)}
                className="cursor-pointer p-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
              {registrations.map((reg) => (
                <div
                  key={reg.id}
                  onClick={() => {
                    setMyPassesOpen(false);
                    setViewTicket(reg);
                  }}
                  className="cursor-pointer bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-white/40 rounded-2xl p-3.5 flex items-center justify-between gap-3 transition"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-white font-semibold">
                      {reg.ticketId}
                    </p>
                    <p className="text-sm text-zinc-200 font-medium truncate">
                      {reg.name} · {reg.branch}
                    </p>
                    <p className="text-xs text-zinc-500 truncate">
                      {reg.eventTitle}
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase bg-white/10 text-white border border-white/20 shrink-0">
                    {reg.checkedIn ? "Verified ✓" : "View QR →"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ───────── Run-of-Show Detail Modal ───────── */}
      {selectedEventDetail && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedEventDetail(null);
          }}
        >
          <div className="glass-card max-w-2xl w-full max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8 border border-white/20 relative">
            <button
              onClick={() => setSelectedEventDetail(null)}
              className="cursor-pointer absolute top-5 right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono uppercase bg-white text-black font-bold">
              {selectedEventDetail.category}
            </span>
            <h2 className="font-display text-2xl font-bold text-white pr-10 mt-3">
              {selectedEventDetail.title}
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              {selectedEventDetail.subtitle}
            </p>
            {selectedEventDetail.agenda?.length > 0 && (
              <div className="mt-6">
                <AgentTrace
                  title={`agenda_trace // ${selectedEventDetail.id}`}
                  spans={selectedEventDetail.agenda.map((item, idx) => ({
                    id: `det-${idx}`,
                    label: item.stage,
                    timeLabel: item.time,
                    owner: item.owner,
                    kind: idx % 2 === 0 ? "agent" : "model",
                    start: idx * 1400,
                    end: (idx + 1) * 1400 - 100,
                    depth: 0,
                  }))}
                  totalDuration={selectedEventDetail.agenda.length * 1400}
                />
              </div>
            )}
            <div className="flex gap-3 mt-6 pt-4 border-t border-zinc-800">
              <button
                onClick={() => {
                  const ev = selectedEventDetail;
                  setSelectedEventDetail(null);
                  setRegisterEvent(ev);
                }}
                className="cursor-pointer flex-1 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-zinc-200"
              >
                Book Your Seat 🎫
              </button>
              <button
                onClick={() => setSelectedEventDetail(null)}
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-zinc-900 text-zinc-300 text-sm font-semibold border border-zinc-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {registerEvent && (
        <RegistrationModal
          event={registerEvent}
          registrations={registrations}
          onClose={() => setRegisterEvent(null)}
          onRegister={handleRegister}
        />
      )}

      {viewTicket && (
        <QrPassModal
          ticket={viewTicket}
          onClose={() => setViewTicket(null)}
          onJumpToScanner={handleJumpToScanner}
        />
      )}

      <CommandPalette
        isOpen={cmdPaletteOpen}
        onClose={() => setCmdPaletteOpen(false)}
        events={events}
        onNavigate={handleNavigate}
        onSelectEvent={(evt) => setSelectedEventDetail(evt)}
        onOpenRegister={(evt) => setRegisterEvent(evt)}
        onExportCsv={handleExportCsv}
      />
    </div>
  );
}
