/**
 * QrPassModal.jsx
 * ──────────────────────────────────────────────────────────────
 * Module 3B — Holographic QR Chef Entry Pass
 *
 * Renders a premium, holographic event ticket with:
 *   • Deterministic QR-style SVG seeded from the ticket ID
 *   • Copy-to-clipboard with visual feedback
 *   • Status-aware badge (Checked-In vs Pending)
 *   • Perforated tear-line divider
 *   • Print-friendly layout via window.print()
 *   • Bridge to Admin QR Scanner for gate simulation
 *
 * @module  modules/registration/QrPassModal
 * @see     PROMPTS.md — PROMPT 4
 * ──────────────────────────────────────────────────────────────
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  X,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ScanLine,
  Mail,
  Phone,
  GraduationCap,
  Clock,
  Layers,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ================================================================
   DeterministicQrSvg — Seeded fake QR code
   ================================================================
   Uses FNV-1a hash of the ticket ID string to produce a consistent
   11×11 grid pattern. The three corner finder patterns (top-left,
   top-right, bottom-left) are always "on" to mimic real QR anatomy.
   ================================================================ */

function DeterministicQrSvg({ seedString }) {
  const SIZE = 11;
  const CELL = 1; // each cell is 1 SVG unit; viewBox handles scaling

  // FNV-1a 32-bit hash
  let hash = 2166136261;
  for (let i = 0; i < seedString.length; i++) {
    hash ^= seedString.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const cells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      // Finder-pattern corners: always ON
      const isCorner =
        (r < 3 && c < 3) ||
        (r < 3 && c >= SIZE - 3) ||
        (r >= SIZE - 3 && c < 3);

      // Data cells: derive from hash bits
      const bit =
        ((hash >>> ((r * SIZE + c) % 28)) ^ (r * 7 + c * 13)) & 1;

      const isOn = isCorner || bit === 1;

      if (isOn) {
        cells.push(
          <rect
            key={`${r}-${c}`}
            x={c * CELL}
            y={r * CELL}
            width={CELL}
            height={CELL}
            rx={isCorner ? 0.15 : 0.1}
            fill={isCorner ? '#d97706' : '#0f172a'}
          />
        );
      }
    }
  }

  return (
    <div className="w-28 h-28 sm:w-32 sm:h-32 p-2.5 bg-white rounded-xl shadow-inner border-2 border-amber-400/60 mx-auto">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-full"
        role="img"
        aria-label={`QR code for ticket ${seedString}`}
      >
        {/* White background */}
        <rect width={SIZE} height={SIZE} fill="white" rx={0.5} />
        {cells}
      </svg>
    </div>
  );
}

/* ================================================================
   Clipboard hook — copy with 2-second visual feedback
   ================================================================ */

function useCopyToClipboard(resetDelay = 2000) {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const copy = useCallback(
    async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetDelay);
      } catch {
        // Fallback for older browsers / non-HTTPS
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => setCopied(false), resetDelay);
      }
    },
    [resetDelay]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { copied, copy };
}

/* ================================================================
   InfoRow — reusable key-value display row
   ================================================================ */

function InfoRow({ icon: Icon, label, value, className }) {
  return (
    <div className={cn('flex items-start gap-2', className)}>
      <Icon className="w-3.5 h-3.5 text-slate-500 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-mono text-slate-500 tracking-wider leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm text-white font-medium truncate">{value || '—'}</p>
      </div>
    </div>
  );
}

/* ================================================================
   QrPassModal — Main exported component
   ================================================================ */

export default function QrPassModal({ ticket, onClose, onJumpToScanner }) {
  const { copied, copy } = useCopyToClipboard();

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  if (!ticket) return null;

  const isCheckedIn = ticket.checkedIn === true;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      aria-label="Chef Pass Ticket"
      onClick={(e) => {
        // Close on backdrop click
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="holo-ticket max-w-lg w-full rounded-3xl border border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.22)] p-6 sm:p-8 relative">
        {/* ── Close Button ── */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition z-10"
          aria-label="Close pass"
        >
          <X className="w-5 h-5" />
        </button>

        {/* ── Header Badge ── */}
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 leading-none">
            CodeChef ABESEC // Official Kitchen Entry Pass
          </span>
        </div>

        {/* ── Event Title ── */}
        <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug pr-10">
          {ticket.eventTitle}
        </h2>

        {/* ── Status Banner ── */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Status */}
          <div
            className={cn(
              'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border',
              isCheckedIn
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
            )}
          >
            {isCheckedIn ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                Gate Verified (Checked In)
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Confirmed Seat // Ready for Scan
              </>
            )}
          </div>

          {/* Ticket ID + Copy */}
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-amber-300 font-semibold tracking-wide">
              {ticket.ticketId}
            </span>
            <button
              onClick={() => copy(ticket.ticketId)}
              className="cursor-pointer p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
              aria-label={copied ? 'Copied!' : 'Copy ticket ID'}
              title={copied ? 'Copied!' : 'Copy ticket ID'}
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* ── Perforated Divider ── */}
        <div className="relative my-6">
          <div className="border-t-2 border-dashed border-slate-700/80" />
          {/* Left cutout */}
          <div className="absolute -left-9 sm:-left-11 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#07090e]" />
          {/* Right cutout */}
          <div className="absolute -right-9 sm:-right-11 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#07090e]" />
        </div>

        {/* ── QR Code + Student Info Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {/* QR Column */}
          <div className="flex flex-col items-center justify-center">
            <DeterministicQrSvg seedString={ticket.ticketId} />
            <p className="font-mono text-[11px] text-amber-300/80 mt-2 tracking-wider">
              {ticket.ticketId}
            </p>
          </div>

          {/* Student Info Column */}
          <div className="sm:col-span-2 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
            {/* Name + Branch badge */}
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="font-display font-bold text-white text-lg truncate">
                {ticket.name}
              </h3>
              <span className="shrink-0 px-2 py-0.5 rounded-md text-[10px] font-mono bg-slate-800 text-slate-300 border border-slate-700">
                {ticket.branch} · {ticket.year}
              </span>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow
                icon={Mail}
                label="College Email"
                value={ticket.email}
              />
              <InfoRow
                icon={Phone}
                label="WhatsApp"
                value={ticket.phone}
              />
              <InfoRow
                icon={Layers}
                label="Station Interest"
                value={ticket.stationInterest}
              />
              <InfoRow
                icon={Clock}
                label="Registered At"
                value={ticket.registeredAt}
              />
            </div>
          </div>
        </div>

        {/* ── Action Buttons ── */}
        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => window.print()}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-all duration-200"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            Print / Save Pass PDF
          </button>

          {onJumpToScanner && (
            <button
              onClick={() => {
                onJumpToScanner(ticket.ticketId);
                onClose();
              }}
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 text-sm font-bold shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-orange-500 transition-all duration-200 active:scale-[0.98]"
            >
              <ScanLine className="w-4 h-4" />
              Simulate Gate Scan in Admin
            </button>
          )}
        </div>

        {/* ── Footer Watermark ── */}
        <p className="text-center text-[10px] font-mono text-slate-600 mt-5 tracking-widest uppercase">
          ChefOps v2.6 · CodeChef ABESEC 2026–27
        </p>
      </div>
    </div>
  );
}
