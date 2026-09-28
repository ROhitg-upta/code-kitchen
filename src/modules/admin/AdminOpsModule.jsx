import React, { useState, useMemo, useRef, useEffect } from "react";
import {
  Shield,
  Zap,
  Calendar,
  Users,
  ShieldCheck,
  TrendingUp,
  Pencil,
  Trash2,
  Plus,
  X,
  Search,
  ScanLine,
  Download,
  Radio,
  BarChart3,
  ChefHat,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  MapPin,
  Database,
} from "lucide-react";
import { cn } from "@/lib/utils";
import SpotlightCard from "@/components/ui/SpotlightCard";

const TABS = [
  { id: "overview", label: "01 // OVERVIEW", icon: BarChart3 },
  { id: "crud", label: "02 // EVENTS CRUD", icon: Calendar },
  { id: "scanner", label: "03 // GATE SCANNER", icon: ScanLine },
  { id: "roster", label: "04 // ROSTER & CSV", icon: Users },
  { id: "broadcast", label: "05 // BROADCAST", icon: Radio },
];

const ADMIN_PIN = "2026";

const CATEGORIES = [
  "Hackathon",
  "Competitive Programming",
  "Development",
  "Workshop",
  "Tech Talk",
];

function AuthGate({ onAdminLogin }) {
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      onAdminLogin();
    } else {
      setPinError(true);
      setTimeout(() => setPinError(false), 1500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[75vh] px-4 bg-cyber-grid">
      <SpotlightCard
        enableTilt
        className="max-w-md w-full p-8 text-center border-white/25"
      >
        <div className="w-14 h-14 mx-auto mb-5 rounded-2xl bg-white text-black flex items-center justify-center">
          <Shield className="w-7 h-7" />
        </div>

        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-400">
          // RESTRICTED COMMAND CONSOLE
        </span>
        <h2 className="font-display text-2xl font-bold text-white mt-1">
          ADMIN & GATE OPS
        </h2>
        <p className="text-zinc-400 text-xs mt-2">
          Authenticate via 1-Click Evaluator Bypass or enter Chapter PIN (2026).
        </p>

        <button
          onClick={onAdminLogin}
          className="cursor-pointer w-full mt-6 flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-zinc-200 text-black font-bold text-xs font-mono uppercase tracking-wider transition active:scale-[0.98]"
        >
          <Zap className="w-4 h-4" />
          1-Click Evaluator Login
        </button>

        <div className="flex items-center gap-3 my-5">
          <span className="flex-1 h-px bg-zinc-800" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            OR PIN (2026)
          </span>
          <span className="flex-1 h-px bg-zinc-800" />
        </div>

        <form onSubmit={handlePinSubmit} className="flex gap-2">
          <input
            type="password"
            value={pin}
            onChange={(e) =>
              setPin(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="PIN: 2026"
            inputMode="numeric"
            className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-zinc-600 focus:border-white focus:outline-none"
          />
          <button
            type="submit"
            className="cursor-pointer px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-mono uppercase font-bold border border-zinc-800 transition"
          >
            Verify
          </button>
        </form>
        {pinError && (
          <p className="text-zinc-300 text-xs mt-2 font-mono">
            ! Invalid PIN. Use 2026.
          </p>
        )}
      </SpotlightCard>
    </div>
  );
}

function EventFormModal({ editingEvent, onSave, onCancel }) {
  const [form, setForm] = useState(() => {
    if (editingEvent) {
      return {
        title: editingEvent.title || "",
        subtitle: editingEvent.subtitle || "",
        category: editingEvent.category || "Hackathon",
        date: editingEvent.date || "",
        time: editingEvent.time || "",
        venue: editingEvent.venue || "",
        capacity: editingEvent.capacity || 100,
        prizePool: editingEvent.prizePool || "",
        description: editingEvent.description || "",
        featured: editingEvent.featured || false,
      };
    }
    return {
      title: "",
      subtitle: "",
      category: "Hackathon",
      date: "",
      time: "",
      venue: "",
      capacity: 100,
      prizePool: "",
      description: "",
      featured: false,
    };
  });

  const inputBase =
    "w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-white focus:outline-none transition";

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.venue.trim() || !form.date) return;

    const eventObj = {
      ...(editingEvent || {}),
      id: editingEvent?.id || `evt-${Date.now()}`,
      ...form,
      capacity: Number(form.capacity) || 100,
      registeredCount: editingEvent?.registeredCount || 0,
      tags: editingEvent?.tags || [form.category],
      agenda: editingEvent?.agenda || [],
      mentors: editingEvent?.mentors || [],
    };
    onSave(eventObj);
  };

  const update = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onCancel();
      }}
    >
      <form
        onSubmit={handleSubmit}
        className="glass-card max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-white/25 max-h-[90vh] overflow-y-auto relative"
      >
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer absolute top-4 right-4 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-xl font-bold text-white mb-5">
          {editingEvent ? "EDIT EVENT" : "CREATE NEW EVENT"}
        </h3>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Event title"
              className={inputBase}
              required
            />
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">
              Subtitle
            </label>
            <input
              value={form.subtitle}
              onChange={(e) => update("subtitle", e.target.value)}
              placeholder="Short tagline"
              className={inputBase}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">
                Category *
              </label>
              <select
                value={form.category}
                onChange={(e) => update("category", e.target.value)}
                className={cn(inputBase, "cursor-pointer")}
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">
                Date *
              </label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => update("date", e.target.value)}
                className={inputBase}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">
                Time
              </label>
              <input
                value={form.time}
                onChange={(e) => update("time", e.target.value)}
                placeholder="09:00 AM – 05:00 PM"
                className={inputBase}
              />
            </div>
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">
                Venue *
              </label>
              <input
                value={form.venue}
                onChange={(e) => update("venue", e.target.value)}
                placeholder="ABESEC Auditorium"
                className={inputBase}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">
                Capacity *
              </label>
              <input
                type="number"
                min={1}
                value={form.capacity}
                onChange={(e) => update("capacity", e.target.value)}
                className={inputBase}
              />
            </div>
            <div>
              <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">
                Prize Pool
              </label>
              <input
                value={form.prizePool}
                onChange={(e) => update("prizePool", e.target.value)}
                placeholder="₹25,000"
                className={inputBase}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-zinc-400 uppercase mb-1 block">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={3}
              placeholder="Event description..."
              className={cn(inputBase, "resize-none")}
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="cursor-pointer flex-1 px-5 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-mono uppercase font-bold transition"
          >
            {editingEvent ? "Save Changes" : "Create Event"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer flex-1 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono uppercase font-bold border border-zinc-800 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AdminOpsModule({
  events,
  registrations,
  broadcastMsg,
  adminAuth,
  onAdminLogin,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onToggleCheckIn,
  onSetBroadcast,
  onResetData,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [scanInput, setScanInput] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState("idle");
  const [rosterSearch, setRosterSearch] = useState("");
  const [draftBroadcast, setDraftBroadcast] = useState("");

  if (!adminAuth) {
    return <AuthGate onAdminLogin={onAdminLogin} />;
  }

  const totalRegs = registrations.length;
  const checkedIn = registrations.filter((r) => r.checkedIn).length;
  const checkInRate =
    totalRegs > 0 ? ((checkedIn / totalRegs) * 100).toFixed(1) : "0.0";

  const handleScan = () => {
    const raw = scanInput.trim();
    if (!raw) return;
    const ticketId = /^\d{4}$/.test(raw)
      ? `CC-ABES-${raw}`
      : raw.toUpperCase();
    const found = registrations.find((r) => r.ticketId === ticketId);
    if (!found) {
      setScanResult(null);
      setScanStatus("notfound");
      return;
    }
    setScanResult(found);
    setScanStatus(found.checkedIn ? "already" : "found");
  };

  const handleExportCsv = () => {
    const headers = [
      "Ticket ID",
      "Name",
      "Email",
      "Branch",
      "Year",
      "Phone",
      "Event",
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
    a.download = `registrations_export_${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredRoster = registrations.filter((r) =>
    [r.name, r.email, r.ticketId, r.branch, r.eventTitle]
      .join(" ")
      .toLowerCase()
      .includes(rosterSearch.toLowerCase())
  );

  return (
    <div className="px-4 py-10 sm:py-14 max-w-6xl mx-auto min-h-screen bg-cyber-grid">
      {/* Header */}
      <div className="mb-8 border-b border-zinc-800 pb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
            04 // OPERATIONS & TELEMETRY
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-white mt-1">
            ADMIN COMMAND CENTER.
          </h1>
        </div>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 font-mono text-[11px] text-zinc-300">
          <Database className="w-3.5 h-3.5 text-white" />
          API + LOCAL PERSISTENCE SYNCED
        </div>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "cursor-pointer whitespace-nowrap px-4 py-2 rounded-full text-xs font-mono uppercase tracking-wider border transition",
              activeTab === tab.id
                ? "bg-white text-black border-white font-bold"
                : "bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === "overview" && (
        <div className="space-y-6 animate-fadeIn">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "Total Events", val: events.length, icon: Calendar },
              { label: "Registrations", val: totalRegs, icon: Users },
              { label: "Gate Verified", val: checkedIn, icon: ShieldCheck },
              { label: "Check-In Rate", val: `${checkInRate}%`, icon: TrendingUp },
            ].map((k) => {
              const Icon = k.icon;
              return (
                <SpotlightCard key={k.label} className="p-5">
                  <Icon className="w-4 h-4 text-white mb-2" />
                  <p className="text-[10px] font-mono uppercase text-zinc-400">
                    {k.label}
                  </p>
                  <p className="text-3xl font-display font-bold text-white mt-1 tabular-nums">
                    {k.val}
                  </p>
                </SpotlightCard>
              );
            })}
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between">
              <h3 className="font-mono text-xs uppercase tracking-wider text-white font-bold">
                LIVE SEAT HEATMAP TABLE
              </h3>
              <button
                onClick={() => {
                  setEditing(null);
                  setShowForm(true);
                }}
                className="cursor-pointer px-3 py-1.5 rounded-lg bg-white text-black font-mono text-[11px] font-bold"
              >
                + ADD EVENT
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-mono uppercase text-zinc-500 border-b border-zinc-800">
                    <th className="text-left px-5 py-3">Event</th>
                    <th className="text-left px-3 py-3">Category</th>
                    <th className="text-left px-3 py-3">Date</th>
                    <th className="text-left px-3 py-3">Occupancy</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {events.map((ev) => {
                    const c = Math.max(
                      registrations.filter((r) => r.eventId === ev.id).length,
                      ev.registeredCount || 0
                    );
                    const pct = Math.min(100, (c / (ev.capacity || 1)) * 100);
                    return (
                      <tr key={ev.id} className="hover:bg-zinc-900/50">
                        <td className="px-5 py-3.5 text-white font-medium">
                          {ev.title}
                        </td>
                        <td className="px-3 py-3.5 font-mono text-xs text-zinc-400">
                          {ev.category}
                        </td>
                        <td className="px-3 py-3.5 font-mono text-xs text-zinc-400">
                          {ev.date}
                        </td>
                        <td className="px-3 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-zinc-900 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-white"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                            <span className="font-mono text-xs text-white">
                              {c}/{ev.capacity}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <button
                            onClick={() => {
                              setEditing(ev);
                              setShowForm(true);
                            }}
                            className="cursor-pointer p-1.5 text-zinc-400 hover:text-white mr-1"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDeleteEvent(ev.id)}
                            className="cursor-pointer p-1.5 text-zinc-400 hover:text-white"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CRUD */}
      {activeTab === "crud" && (
        <div className="space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setEditing(null);
                setShowForm(true);
              }}
              className="cursor-pointer flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-black text-xs font-mono uppercase font-bold"
            >
              <Plus className="w-4 h-4" /> Create New Event
            </button>
            <button
              onClick={onResetData}
              className="cursor-pointer px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 text-xs font-mono border border-zinc-800"
            >
              Reset Seed Data
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {events.map((ev) => (
              <SpotlightCard
                key={ev.id}
                className="p-5 flex items-center justify-between gap-4"
              >
                <div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-white text-black font-bold">
                    {ev.category}
                  </span>
                  <h4 className="font-display font-bold text-white text-base mt-2">
                    {ev.title}
                  </h4>
                  <p className="font-mono text-xs text-zinc-400 mt-1">
                    {ev.date} · {ev.venue}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditing(ev);
                      setShowForm(true);
                    }}
                    className="cursor-pointer p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-800"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => onDeleteEvent(ev.id)}
                    className="cursor-pointer p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </SpotlightCard>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: SCANNER */}
      {activeTab === "scanner" && (
        <div className="max-w-md mx-auto animate-fadeIn">
          <SpotlightCard className="p-6 sm:p-8">
            <h3 className="font-display font-bold text-white text-xl flex items-center gap-2 mb-4">
              <ScanLine className="w-5 h-5" /> QR Gate Check-In Scanner
            </h3>
            <div className="flex gap-2">
              <input
                value={scanInput}
                onChange={(e) => {
                  setScanInput(e.target.value);
                  setScanStatus("idle");
                }}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                placeholder="Ticket ID (e.g. 9041 or CC-ABES-9041)"
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:border-white focus:outline-none"
              />
              <button
                onClick={handleScan}
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase"
              >
                Scan
              </button>
            </div>

            {scanStatus === "notfound" && (
              <div className="mt-5 p-4 rounded-xl bg-zinc-950 border border-zinc-700 text-xs font-mono text-zinc-300">
                ! No pass found matching "{scanInput}". Try 9041.
              </div>
            )}

            {scanResult && (scanStatus === "found" || scanStatus === "already") && (
              <div className="mt-5 p-4 rounded-2xl bg-zinc-950 border border-white/30 space-y-2">
                <p className="font-mono text-xs text-white font-bold">
                  {scanResult.ticketId} —{" "}
                  {scanResult.checkedIn ? "ALREADY VERIFIED" : "VALID PASS"}
                </p>
                <p className="text-sm text-white font-semibold">
                  {scanResult.name} ({scanResult.branch})
                </p>
                <p className="text-xs text-zinc-400">{scanResult.eventTitle}</p>
                {!scanResult.checkedIn && (
                  <button
                    onClick={() => {
                      onToggleCheckIn(scanResult.id);
                      setScanResult({ ...scanResult, checkedIn: true });
                      setScanStatus("already");
                    }}
                    className="cursor-pointer w-full mt-3 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase"
                  >
                    Mark Gate Verified ✓
                  </button>
                )}
              </div>
            )}
          </SpotlightCard>
        </div>
      )}

      {/* TAB 4: ROSTER */}
      {activeTab === "roster" && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <input
              value={rosterSearch}
              onChange={(e) => setRosterSearch(e.target.value)}
              placeholder="Search student roster..."
              className="bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2 text-sm text-white flex-1 min-w-[220px]"
            />
            <button
              onClick={handleExportCsv}
              className="cursor-pointer flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase"
            >
              <Download className="w-3.5 h-3.5" /> Export CSV
            </button>
          </div>

          <div className="glass-card rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-[10px] font-mono uppercase text-zinc-500 border-b border-zinc-800">
                    <th className="text-left px-4 py-3">Ticket</th>
                    <th className="text-left px-4 py-3">Student</th>
                    <th className="text-left px-4 py-3">Branch</th>
                    <th className="text-left px-4 py-3">Event</th>
                    <th className="text-right px-4 py-3">Gate Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredRoster.map((reg) => (
                    <tr key={reg.id} className="hover:bg-zinc-900/50">
                      <td className="px-4 py-3 font-mono text-xs text-white font-bold">
                        {reg.ticketId}
                      </td>
                      <td className="px-4 py-3 text-white font-medium">
                        {reg.name}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-zinc-400">
                        {reg.branch}
                      </td>
                      <td className="px-4 py-3 text-xs text-zinc-400">
                        {reg.eventTitle}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => onToggleCheckIn(reg.id)}
                          className={cn(
                            "cursor-pointer px-3 py-1 rounded-full font-mono text-[10px] font-bold uppercase border",
                            reg.checkedIn
                              ? "bg-white text-black border-white"
                              : "bg-zinc-950 text-zinc-400 border-zinc-800"
                          )}
                        >
                          {reg.checkedIn ? "Verified ✓" : "Pending"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: BROADCAST */}
      {activeTab === "broadcast" && (
        <div className="max-w-xl mx-auto space-y-4 animate-fadeIn">
          <SpotlightCard className="p-6">
            <h3 className="font-display font-bold text-white text-lg mb-3">
              Live Kitchen Broadcast Ticker
            </h3>
            <div className="flex gap-2">
              <input
                value={draftBroadcast}
                onChange={(e) => setDraftBroadcast(e.target.value)}
                placeholder="Enter live campus announcement..."
                className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-white"
              />
              <button
                onClick={() => {
                  if (draftBroadcast.trim()) {
                    onSetBroadcast(draftBroadcast.trim());
                    setDraftBroadcast("");
                  }
                }}
                className="cursor-pointer px-5 py-2.5 rounded-xl bg-white text-black font-mono text-xs font-bold uppercase"
              >
                Push Live
              </button>
            </div>
            {broadcastMsg && (
              <div className="mt-4 p-3.5 rounded-xl bg-zinc-950 border border-zinc-800 flex items-center justify-between gap-3">
                <span className="font-mono text-xs text-zinc-300 truncate">
                  {broadcastMsg}
                </span>
                <button
                  onClick={() => onSetBroadcast("")}
                  className="cursor-pointer text-xs font-mono text-zinc-500 hover:text-white"
                >
                  Clear
                </button>
              </div>
            )}
          </SpotlightCard>
        </div>
      )}

      {showForm && (
        <EventFormModal
          editingEvent={editing}
          onSave={(obj) => {
            if (editing) onEditEvent(obj);
            else onAddEvent(obj);
            setShowForm(false);
            setEditing(null);
          }}
          onCancel={() => {
            setShowForm(false);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}
