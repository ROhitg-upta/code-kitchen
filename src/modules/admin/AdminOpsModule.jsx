/**
 * AdminOpsModule.jsx
 * ──────────────────────────────────────────────────────────────
 * Module 4 — Admin & Event Operations Command Center
 *
 * The most complex module in ChefOps v2.6. Provides:
 *   • 1-click demo auth gate (PIN: 2026)
 *   • 5-tab dashboard: Overview · Events CRUD · QR Scanner ·
 *     Student Roster (with CSV export) · Live Broadcast
 *   • Full CRUD with modal form for events
 *   • Ticket-based gate check-in simulator with visual feedback
 *   • Filterable student roster with inline status toggle
 *
 * @module  modules/admin/AdminOpsModule
 * @see     PROMPTS.md — PROMPT 5
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
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
  Flame,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ================================================================
   Constants
   ================================================================ */

const TABS = [
  { id: 'overview', label: '📊 Overview', icon: BarChart3 },
  { id: 'crud', label: '📅 Events', icon: Calendar },
  { id: 'scanner', label: '📷 Scanner', icon: ScanLine },
  { id: 'roster', label: '👥 Roster', icon: Users },
  { id: 'broadcast', label: '📡 Broadcast', icon: Radio },
];

const ADMIN_PIN = '2026';

const CATEGORIES = [
  'Hackathon',
  'Competitive Programming',
  'Development',
  'Workshop',
  'Tech Talk',
];

/* ================================================================
   Utility: Capacity color logic (reused across tabs)
   ================================================================ */

function getCapacityMeta(registered, capacity) {
  const ratio = capacity > 0 ? registered / capacity : 0;
  const pct = Math.min(100, ratio * 100);
  if (ratio > 0.85)
    return { pct, bar: 'bg-rose-500 animate-pulse', text: 'text-rose-400', label: 'Critical' };
  if (ratio > 0.65)
    return { pct, bar: 'bg-amber-500', text: 'text-amber-400', label: 'Filling' };
  return { pct, bar: 'bg-emerald-500', text: 'text-emerald-400', label: 'Open' };
}

/* ================================================================
   Sub-component: AuthGate
   ================================================================ */

function AuthGate({ onAdminLogin }) {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
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
    <div className="flex items-center justify-center min-h-[70vh] px-4">
      <div className="glass-card max-w-md w-full p-8 rounded-3xl text-center animate-fadeIn">
        <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
          <Shield className="w-8 h-8 text-amber-400" />
        </div>

        <h2 className="font-display text-2xl font-bold text-white">
          🛡️ Admin & Ops Console
        </h2>
        <p className="text-slate-400 text-sm mt-2">
          Enter the kitchen's back door.
        </p>

        {/* 1-Click Login */}
        <button
          onClick={onAdminLogin}
          className="cursor-pointer w-full mt-6 flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition-all duration-200 active:scale-[0.98]"
        >
          <Zap className="w-4 h-4" />
          1-Click Evaluator Login
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-5">
          <span className="flex-1 h-px bg-slate-800" />
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
            Or enter PIN
          </span>
          <span className="flex-1 h-px bg-slate-800" />
        </div>

        {/* PIN Input */}
        <form onSubmit={handlePinSubmit} className="flex gap-2">
          <input
            type={showPin ? 'text' : 'password'}
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="Enter PIN"
            inputMode="numeric"
            className={cn(
              'flex-1 bg-slate-900/80 border rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:outline-none focus:ring-2 transition',
              pinError
                ? 'border-rose-500 focus:ring-rose-500/20 animate-[shake_0.3s_ease-in-out]'
                : 'border-slate-800 focus:border-amber-500/50 focus:ring-amber-500/20'
            )}
          />
          <button
            type="submit"
            className="cursor-pointer px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
          >
            Enter
          </button>
        </form>
        {pinError && (
          <p className="text-rose-400 text-xs mt-2 font-mono">
            Incorrect PIN. Try 2026.
          </p>
        )}

        <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-6px); }
            50% { transform: translateX(6px); }
            75% { transform: translateX(-4px); }
          }
        `}</style>
      </div>
    </div>
  );
}

/* ================================================================
   Sub-component: KpiCard
   ================================================================ */

function KpiCard({ icon: Icon, label, value, accent = 'text-amber-400' }) {
  return (
    <div className="glass-card p-4 sm:p-5 rounded-2xl">
      <Icon className={cn('w-5 h-5 mb-2', accent)} />
      <p className="text-[10px] sm:text-xs uppercase font-mono text-slate-400 tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl sm:text-3xl font-bold font-display text-white tabular-nums">
        {value}
      </p>
    </div>
  );
}

/* ================================================================
   Sub-component: EventFormModal
   ================================================================ */

function EventFormModal({ editingEvent, onSave, onCancel }) {
  const [form, setForm] = useState(() => {
    if (editingEvent) {
      return {
        title: editingEvent.title || '',
        subtitle: editingEvent.subtitle || '',
        category: editingEvent.category || 'Hackathon',
        date: editingEvent.date || '',
        time: editingEvent.time || '',
        venue: editingEvent.venue || '',
        capacity: editingEvent.capacity || 100,
        prizePool: editingEvent.prizePool || '',
        description: editingEvent.description || '',
        featured: editingEvent.featured || false,
      };
    }
    return {
      title: '', subtitle: '', category: 'Hackathon', date: '', time: '',
      venue: '', capacity: 100, prizePool: '', description: '', featured: false,
    };
  });

  const inputBase =
    'w-full bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition';

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

  const update = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}
    >
      <form
        onSubmit={handleSubmit}
        className="glass-card max-w-2xl w-full rounded-3xl p-6 sm:p-8 border border-amber-500/30 shadow-[0_0_50px_rgba(245,158,11,0.15)] animate-fadeIn max-h-[90vh] overflow-y-auto relative"
      >
        <button
          type="button"
          onClick={onCancel}
          className="cursor-pointer absolute top-4 right-4 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display text-xl font-bold text-white mb-5">
          {editingEvent ? '✏️ Edit Event' : '➕ Create New Event'}
        </h3>

        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">Title *</label>
            <input value={form.title} onChange={(e) => update('title', e.target.value)} placeholder="Event title" className={inputBase} required />
          </div>

          {/* Subtitle */}
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">Subtitle</label>
            <input value={form.subtitle} onChange={(e) => update('subtitle', e.target.value)} placeholder="Short tagline" className={inputBase} />
          </div>

          {/* Category + Date row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">Category *</label>
              <select value={form.category} onChange={(e) => update('category', e.target.value)} className={cn(inputBase, 'cursor-pointer')}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">Date *</label>
              <input type="date" value={form.date} onChange={(e) => update('date', e.target.value)} className={inputBase} required />
            </div>
          </div>

          {/* Time + Venue row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">Time</label>
              <input value={form.time} onChange={(e) => update('time', e.target.value)} placeholder="09:00 AM – 05:00 PM" className={inputBase} />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">Venue *</label>
              <input value={form.venue} onChange={(e) => update('venue', e.target.value)} placeholder="Block-9, Auditorium" className={inputBase} required />
            </div>
          </div>

          {/* Capacity + Prize Pool row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">Capacity *</label>
              <input type="number" min={1} value={form.capacity} onChange={(e) => update('capacity', e.target.value)} className={inputBase} />
            </div>
            <div>
              <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">Prize Pool</label>
              <input value={form.prizePool} onChange={(e) => update('prizePool', e.target.value)} placeholder="₹25,000" className={inputBase} />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-1.5 block">Description</label>
            <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3} placeholder="Event description..." className={cn(inputBase, 'resize-none')} />
          </div>

          {/* Featured toggle */}
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              onClick={() => update('featured', !form.featured)}
              className={cn(
                'w-10 h-6 rounded-full relative transition-colors duration-200 cursor-pointer',
                form.featured ? 'bg-amber-500' : 'bg-slate-700'
              )}
            >
              <div className={cn(
                'absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200',
                form.featured ? 'translate-x-4.5' : 'translate-x-0.5'
              )} />
            </div>
            <span className="text-sm text-slate-300">Featured / Flagship Event</span>
          </label>
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            type="submit"
            className="cursor-pointer flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition-all active:scale-[0.98]"
          >
            {editingEvent ? 'Save Changes' : 'Create Event'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer flex-1 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

/* ================================================================
   Tab: Overview
   ================================================================ */

function TabOverview({ events, registrations, onEdit, onDelete }) {
  const totalRegs = registrations.length;
  const checkedIn = registrations.filter((r) => r.checkedIn).length;
  const checkInRate = totalRegs > 0 ? ((checkedIn / totalRegs) * 100).toFixed(1) : '0.0';

  return (
    <div className="space-y-6">
      {/* KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KpiCard icon={Calendar} label="Total Events" value={events.length} />
        <KpiCard icon={Users} label="Total Registrations" value={totalRegs} />
        <KpiCard icon={ShieldCheck} label="Checked-In" value={checkedIn} accent="text-emerald-400" />
        <KpiCard icon={TrendingUp} label="Check-In Rate" value={`${checkInRate}%`} accent="text-cyan-400" />
      </div>

      {/* Seat Heatmap Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-800/60">
          <h3 className="font-display font-semibold text-white text-sm">
            Seat Heatmap — All Events
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                <th className="text-left px-5 py-3">Event</th>
                <th className="text-left px-3 py-3 hidden sm:table-cell">Category</th>
                <th className="text-left px-3 py-3 hidden md:table-cell">Date</th>
                <th className="text-left px-3 py-3">Occupancy</th>
                <th className="text-right px-5 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {events.map((event) => {
                const regCount = registrations.filter((r) => r.eventId === event.id).length;
                const liveCount = event.registeredCount ?? regCount;
                const meta = getCapacityMeta(liveCount, event.capacity);

                return (
                  <tr key={event.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-5 py-3">
                      <p className="text-white font-medium truncate max-w-[200px]">{event.title}</p>
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                        {event.category}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-400 text-xs font-mono hidden md:table-cell">
                      {event.date}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={cn('h-full rounded-full transition-all duration-700', meta.bar)}
                            style={{ width: `${meta.pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-mono text-slate-300 whitespace-nowrap">
                          {liveCount}/{event.capacity}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => onEdit(event)}
                          className="cursor-pointer p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition"
                          title="Edit event"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onDelete(event.id)}
                          className="cursor-pointer p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                          title="Delete event"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Tab: Event CRUD
   ================================================================ */

function TabCrud({ events, registrations, onAddEvent, onEditEvent, onDeleteEvent, onResetData }) {
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const handleSave = (eventObj) => {
    if (editing) {
      onEditEvent(eventObj);
    } else {
      onAddEvent(eventObj);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Delete this event and all associated registrations?')) {
      onDeleteEvent(eventId);
    }
  };

  return (
    <div className="space-y-5">
      {/* Top actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="cursor-pointer flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          Add New Event
        </button>

        {/* Reset */}
        <button
          onClick={() => {
            if (confirmReset) { onResetData(); setConfirmReset(false); }
            else setConfirmReset(true);
          }}
          className={cn(
            'cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition',
            confirmReset
              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
              : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-rose-400'
          )}
        >
          {confirmReset ? '⚠️ Confirm Reset?' : '🔄 Reset Demo Data'}
        </button>
      </div>

      {/* Event list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {events.map((event) => {
          const regCount = registrations.filter((r) => r.eventId === event.id).length;
          return (
            <div key={event.id} className="glass-card p-4 rounded-2xl">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/25">
                      {event.category}
                    </span>
                    {event.featured && (
                      <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-rose-500/15 text-rose-300 border border-rose-500/25">
                        <Flame className="w-2.5 h-2.5 inline" /> Featured
                      </span>
                    )}
                  </div>
                  <h4 className="font-display font-semibold text-white text-sm truncate">{event.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" /> {event.date}
                    <span className="mx-1">·</span>
                    <MapPin className="w-3 h-3" /> {event.venue}
                  </p>
                  <p className="text-xs font-mono text-slate-500 mt-1">{regCount}/{event.capacity} registered</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => { setEditing(event); setShowForm(true); }}
                    className="cursor-pointer p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="cursor-pointer p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-rose-400 transition"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Event Form Modal */}
      {showForm && (
        <EventFormModal
          editingEvent={editing}
          onSave={handleSave}
          onCancel={() => { setShowForm(false); setEditing(null); }}
        />
      )}
    </div>
  );
}

/* ================================================================
   Tab: QR Gate Scanner
   ================================================================ */

function TabScanner({ registrations, onToggleCheckIn }) {
  const [scanInput, setScanInput] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [scanStatus, setScanStatus] = useState('idle'); // idle | found | already | notfound
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleScan = () => {
    const raw = scanInput.trim();
    if (!raw) return;

    // Normalize: if 4 digits, prepend prefix
    const ticketId = /^\d{4}$/.test(raw) ? `CC-ABES-${raw}` : raw.toUpperCase();

    const found = registrations.find((r) => r.ticketId === ticketId);

    if (!found) {
      setScanResult(null);
      setScanStatus('notfound');
      return;
    }

    setScanResult(found);
    if (found.checkedIn) {
      setScanStatus('already');
    } else {
      setScanStatus('found');
    }
  };

  const handleMarkVerified = () => {
    if (!scanResult) return;
    onToggleCheckIn(scanResult.id);
    setScanStatus('already');
    setScanResult((prev) => (prev ? { ...prev, checkedIn: true } : prev));
  };

  const statusBorderClass =
    scanStatus === 'found'
      ? 'border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.2)]'
      : scanStatus === 'already'
        ? 'border-amber-500 shadow-[0_0_30px_rgba(245,158,11,0.2)]'
        : scanStatus === 'notfound'
          ? 'border-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.2)]'
          : 'border-slate-800';

  return (
    <div className="flex justify-center">
      <div className={cn('glass-card max-w-md w-full p-6 sm:p-8 rounded-3xl transition-all duration-300', statusBorderClass)}>
        <div className="flex items-center gap-2 mb-5">
          <ScanLine className="w-5 h-5 text-amber-400" />
          <h3 className="font-display font-bold text-white text-lg">
            Gate Check-In Scanner
          </h3>
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              ref={inputRef}
              type="text"
              value={scanInput}
              onChange={(e) => { setScanInput(e.target.value); setScanStatus('idle'); }}
              onKeyDown={(e) => e.key === 'Enter' && handleScan()}
              placeholder="Enter Ticket ID (e.g., 9041)"
              className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white font-mono placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
            />
          </div>
          <button
            onClick={handleScan}
            className="cursor-pointer px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition active:scale-[0.98]"
          >
            Scan
          </button>
        </div>

        {/* Results */}
        <div className="mt-5">
          {/* NOT FOUND */}
          {scanStatus === 'notfound' && (
            <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-4 animate-fadeIn">
              <div className="flex items-center gap-2 mb-1">
                <XCircle className="w-5 h-5 text-rose-400" />
                <p className="text-rose-300 font-semibold text-sm">Ticket Not Found</p>
              </div>
              <p className="text-rose-400/70 text-xs">
                No registration matches "{scanInput}". Double-check the ticket ID.
              </p>
            </div>
          )}

          {/* ALREADY CHECKED IN */}
          {scanStatus === 'already' && scanResult && (
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 animate-fadeIn">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-amber-400" />
                <p className="text-amber-300 font-semibold text-sm">Already Scanned</p>
              </div>
              <div className="space-y-1 text-xs text-slate-300">
                <p><span className="text-slate-500">Name:</span> {scanResult.name}</p>
                <p><span className="text-slate-500">Event:</span> {scanResult.eventTitle}</p>
                <p><span className="text-slate-500">Ticket:</span> <span className="font-mono text-amber-300">{scanResult.ticketId}</span></p>
              </div>
            </div>
          )}

          {/* FOUND — ready to check in */}
          {scanStatus === 'found' && scanResult && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 animate-fadeIn">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <p className="text-emerald-300 font-semibold text-sm">Ticket Verified!</p>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-300 mb-4">
                <p><span className="text-slate-500">Name:</span> {scanResult.name}</p>
                <p><span className="text-slate-500">Email:</span> {scanResult.email}</p>
                <p><span className="text-slate-500">Branch:</span> {scanResult.branch}</p>
                <p><span className="text-slate-500">Year:</span> {scanResult.year}</p>
                <p className="col-span-2"><span className="text-slate-500">Event:</span> {scanResult.eventTitle}</p>
                <p className="col-span-2"><span className="text-slate-500">Ticket:</span> <span className="font-mono text-amber-300">{scanResult.ticketId}</span></p>
              </div>
              <button
                onClick={handleMarkVerified}
                className="cursor-pointer w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold shadow-lg shadow-emerald-500/25 transition active:scale-[0.98]"
              >
                <ShieldCheck className="w-4 h-4" />
                Mark Gate Verified ✅
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   Tab: Student Roster
   ================================================================ */

function TabRoster({ events, registrations, onToggleCheckIn }) {
  const [search, setSearch] = useState('');
  const [eventFilter, setEventFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const selectBase =
    'bg-slate-900/80 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none focus:border-amber-500/50 cursor-pointer';

  // Unique branches
  const branches = useMemo(
    () => [...new Set(registrations.map((r) => r.branch).filter(Boolean))].sort(),
    [registrations]
  );

  const filtered = useMemo(() => {
    let list = [...registrations];

    if (eventFilter !== 'all') list = list.filter((r) => r.eventId === eventFilter);
    if (branchFilter !== 'all') list = list.filter((r) => r.branch === branchFilter);
    if (statusFilter === 'checked') list = list.filter((r) => r.checkedIn);
    if (statusFilter === 'pending') list = list.filter((r) => !r.checkedIn);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((r) =>
        [r.name, r.email, r.ticketId, r.branch, r.eventTitle].join(' ').toLowerCase().includes(q)
      );
    }

    return list;
  }, [registrations, eventFilter, branchFilter, statusFilter, search]);

  const checkedCount = filtered.filter((r) => r.checkedIn).length;

  const handleExportCsv = () => {
    const headers = ['Ticket ID', 'Name', 'Email', 'Branch', 'Year', 'Phone', 'Event', 'Station', 'Check-In', 'Registered At'];
    const rows = filtered.map((r) => [
      r.ticketId, r.name, r.email, r.branch, r.year, r.phone,
      r.eventTitle, r.stationInterest, r.checkedIn ? 'Yes' : 'No', r.registeredAt,
    ]);
    const csv = [headers, ...rows].map((row) => row.map((c) => `"${String(c ?? '').replace(/"/g, '""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations_export_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search roster..."
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
          />
        </div>
        <select value={eventFilter} onChange={(e) => setEventFilter(e.target.value)} className={selectBase}>
          <option value="all">All Events</option>
          {events.map((ev) => <option key={ev.id} value={ev.id}>{ev.title}</option>)}
        </select>
        <select value={branchFilter} onChange={(e) => setBranchFilter(e.target.value)} className={selectBase}>
          <option value="all">All Branches</option>
          {branches.map((b) => <option key={b} value={b}>{b}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={selectBase}>
          <option value="all">All Status</option>
          <option value="checked">Checked-In</option>
          <option value="pending">Pending</option>
        </select>
      </div>

      {/* Summary + Export */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-400 font-mono">
          <span className="text-white font-semibold">{filtered.length}</span> students ·{' '}
          <span className="text-emerald-400 font-semibold">{checkedCount}</span> checked-in
        </p>
        <button
          onClick={handleExportCsv}
          className="cursor-pointer flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-semibold border border-amber-500/30 transition"
        >
          <Download className="w-3.5 h-3.5" />
          Export CSV
        </button>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="text-center py-14">
          <ChefHat className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400 text-sm">No registrations found.</p>
        </div>
      ) : (
        <div className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-[10px] font-mono uppercase tracking-wider text-slate-500">
                  <th className="text-left px-4 py-3">Ticket</th>
                  <th className="text-left px-3 py-3">Name</th>
                  <th className="text-left px-3 py-3 hidden md:table-cell">Email</th>
                  <th className="text-left px-3 py-3 hidden sm:table-cell">Branch</th>
                  <th className="text-left px-3 py-3 hidden lg:table-cell">Event</th>
                  <th className="text-center px-3 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {filtered.map((reg) => (
                  <tr key={reg.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-amber-400 font-semibold">
                      {reg.ticketId}
                    </td>
                    <td className="px-3 py-3 text-white font-medium truncate max-w-[140px]">
                      {reg.name}
                    </td>
                    <td className="px-3 py-3 text-slate-400 text-xs truncate max-w-[160px] hidden md:table-cell">
                      {reg.email}
                    </td>
                    <td className="px-3 py-3 hidden sm:table-cell">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                        {reg.branch}
                      </span>
                    </td>
                    <td className="px-3 py-3 text-slate-400 text-xs truncate max-w-[140px] hidden lg:table-cell">
                      {reg.eventTitle}
                    </td>
                    <td className="px-3 py-3 text-center">
                      <button
                        onClick={() => onToggleCheckIn(reg.id)}
                        className={cn(
                          'cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold border transition',
                          reg.checkedIn
                            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/25'
                            : 'bg-amber-500/10 text-amber-300 border-amber-500/25 hover:bg-amber-500/20'
                        )}
                      >
                        {reg.checkedIn ? (
                          <><ShieldCheck className="w-3 h-3" /> Checked-In</>
                        ) : (
                          <><Clock className="w-3 h-3" /> Pending</>
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   Tab: Broadcast
   ================================================================ */

function TabBroadcast({ broadcastMsg, onSetBroadcast }) {
  const [draft, setDraft] = useState('');

  const handlePush = () => {
    if (!draft.trim()) return;
    onSetBroadcast(draft.trim());
    setDraft('');
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h3 className="font-display font-bold text-white text-lg flex items-center gap-2">
        <Radio className="w-5 h-5 text-amber-400" />
        Live Kitchen Broadcast
      </h3>
      <p className="text-slate-400 text-sm">
        Push a live message to the broadcast ticker on the home page. Visible to all visitors.
      </p>

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handlePush()}
          placeholder="Type your broadcast message..."
          className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:border-amber-500/50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition"
        />
        <button
          onClick={handlePush}
          disabled={!draft.trim()}
          className="cursor-pointer px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 disabled:opacity-50 disabled:cursor-not-allowed transition active:scale-[0.98]"
        >
          Push Broadcast 📢
        </button>
      </div>

      {/* Current broadcast preview */}
      {broadcastMsg ? (
        <div className="glass-card p-5 rounded-2xl border-amber-500/30">
          <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider mb-2">
            📡 Currently Live
          </p>
          <p className="text-white font-medium text-sm">{broadcastMsg}</p>
          <button
            onClick={() => onSetBroadcast('')}
            className="cursor-pointer mt-3 flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold border border-rose-500/25 transition"
          >
            <X className="w-3 h-3" />
            Clear Broadcast
          </button>
        </div>
      ) : (
        <div className="glass-card p-5 rounded-2xl text-center">
          <p className="text-slate-500 text-sm">No active broadcast.</p>
        </div>
      )}
    </div>
  );
}

/* ================================================================
   AdminOpsModule — Main exported component
   ================================================================ */

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
  onNavigate,
}) {
  const [activeTab, setActiveTab] = useState('overview');

  /* ── Auth Gate ── */
  if (!adminAuth) {
    return <AuthGate onAdminLogin={onAdminLogin} />;
  }

  /* ── Authenticated Dashboard ── */
  return (
    <div className="px-4 py-8 sm:py-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-display font-bold text-white flex items-center gap-2">
          <Shield className="w-7 h-7 text-amber-400" />
          Admin & Ops Center
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Event management, check-ins, roster, and broadcast control.
        </p>
      </div>

      {/* Tab Bar */}
      <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-800 mb-6 pb-px">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              'cursor-pointer whitespace-nowrap px-4 py-2.5 text-sm font-medium border-b-2 transition-colors duration-200',
              activeTab === tab.id
                ? 'text-amber-400 border-amber-500'
                : 'text-slate-400 border-transparent hover:text-white'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fadeIn" key={activeTab}>
        {activeTab === 'overview' && (
          <TabOverview
            events={events}
            registrations={registrations}
            onEdit={(evt) => { setActiveTab('crud'); }}
            onDelete={onDeleteEvent}
          />
        )}
        {activeTab === 'crud' && (
          <TabCrud
            events={events}
            registrations={registrations}
            onAddEvent={onAddEvent}
            onEditEvent={onEditEvent}
            onDeleteEvent={onDeleteEvent}
            onResetData={onResetData}
          />
        )}
        {activeTab === 'scanner' && (
          <TabScanner
            registrations={registrations}
            onToggleCheckIn={onToggleCheckIn}
          />
        )}
        {activeTab === 'roster' && (
          <TabRoster
            events={events}
            registrations={registrations}
            onToggleCheckIn={onToggleCheckIn}
          />
        )}
        {activeTab === 'broadcast' && (
          <TabBroadcast
            broadcastMsg={broadcastMsg}
            onSetBroadcast={onSetBroadcast}
          />
        )}
      </div>
    </div>
  );
}
