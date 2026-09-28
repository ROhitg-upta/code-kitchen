import React, { useState } from 'react';
import {
  X,
  CheckCircle2,
  MapPin,
  Calendar,
  Clock,
  Sparkles,
  Copy,
  Check,
  Printer,
  ScanLine,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

// Deterministic pseudo-QR SVG grid generator from ticketId string
function DeterministicQrSvg({ seedString = 'CC-ABES-2026' }) {
  const size = 11;
  let hash = 2166136261;
  for (let i = 0; i < seedString.length; i++) {
    hash ^= seedString.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const cells = [];
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      // Finder patterns in 3 corners
      const isTopLeft = r < 3 && c < 3;
      const isTopRight = r < 3 && c >= size - 3;
      const isBottomLeft = r >= size - 3 && c < 3;
      if (isTopLeft || isTopRight || isBottomLeft) {
        cells.push({ r, c, on: true, corner: true });
      } else {
        const bit = ((hash >>> ((r * size + c) % 28)) ^ (r * 7 + c * 13)) & 1;
        cells.push({ r, c, on: bit === 1, corner: false });
      }
    }
  }

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      className="w-32 h-32 p-2 bg-white rounded-xl shadow-inner border-2 border-amber-400/60"
      shapeRendering="crispEdges"
    >
      {cells.map((cell, idx) =>
        cell.on ? (
          <rect
            key={idx}
            x={cell.c}
            y={cell.r}
            width={0.92}
            height={0.92}
            rx={0.15}
            fill={cell.corner ? '#d97706' : '#0f172a'}
          />
        ) : null
      )}
    </svg>
  );
}

export default function QrPassModal({ ticket, onClose, onJumpToScanner }) {
  const [copied, setCopied] = useState(false);

  if (!ticket) return null;

  const handleCopyTicketId = () => {
    navigator.clipboard.writeText(ticket.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-3xl holo-ticket border border-amber-500/40 shadow-[0_0_60px_rgba(245,158,11,0.22)] p-6 sm:p-8 text-slate-100">
        {/* Top Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          title="Close Pass"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Badge */}
        <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-amber-400 mb-2">
          <Sparkles className="w-4 h-4" />
          <span>CodeChef ABESEC // Official Kitchen Entry Pass</span>
        </div>

        <h3 className="text-2xl font-bold font-display text-white leading-snug pr-8">
          {ticket.eventTitle}
        </h3>

        {/* Status Banner */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 bg-slate-900/90 border border-slate-800 rounded-2xl px-4 py-3">
          <div className="flex items-center gap-2.5">
            {ticket.checkedIn ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck className="w-4 h-4" />
                GATE VERIFIED (CHECKED IN)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                <CheckCircle2 className="w-4 h-4" />
                CONFIRMED SEAT // READY FOR SCAN
              </span>
            )}
          </div>

          <button
            onClick={handleCopyTicketId}
            className="inline-flex items-center gap-1.5 font-mono text-xs text-slate-300 hover:text-amber-300 bg-slate-800/90 px-3 py-1.5 rounded-lg border border-slate-700 transition cursor-pointer"
          >
            <span>{ticket.ticketId}</span>
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* Perforated Divider */}
        <div className="relative my-6 border-t-2 border-dashed border-slate-700/80">
          <div className="absolute -left-9 -top-3.5 w-7 h-7 rounded-full bg-[#07090e] border-r border-amber-500/30" />
          <div className="absolute -right-9 -top-3.5 w-7 h-7 rounded-full bg-[#07090e] border-l border-amber-500/30" />
        </div>

        {/* QR & Student Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-center">
          <div className="flex flex-col items-center justify-center">
            <DeterministicQrSvg seedString={`${ticket.ticketId}-${ticket.email}`} />
            <span className="mt-2 font-mono text-[11px] text-amber-300/90 tracking-wider">
              {ticket.ticketId}
            </span>
          </div>

          <div className="sm:col-span-2 space-y-2.5 text-sm bg-slate-950/60 p-4 rounded-2xl border border-slate-800/90">
            <div>
              <p className="text-[11px] uppercase font-mono text-slate-400">Chef Name & Batch</p>
              <p className="font-semibold text-white text-base">
                {ticket.name}{' '}
                <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                  {ticket.branch} • {ticket.year}
                </span>
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              <div>
                <p className="text-[11px] uppercase font-mono text-slate-400">College Email</p>
                <p className="text-xs text-slate-200 truncate">{ticket.email}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase font-mono text-slate-400">WhatsApp / Phone</p>
                <p className="text-xs text-slate-200 font-mono">+91 {ticket.phone}</p>
              </div>
            </div>

            <div className="pt-1 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-cyan-300">
                <Terminal className="w-3.5 h-3.5" />
                Station: {ticket.stationInterest || 'Development + Events'}
              </span>
              <span className="font-mono text-[11px]">{ticket.registeredAt}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition cursor-pointer"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            <span>Print / Save Pass PDF</span>
          </button>

          {onJumpToScanner && (
            <button
              onClick={() => onJumpToScanner(ticket.ticketId)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-slate-950 text-xs font-bold shadow-lg shadow-amber-500/25 transition cursor-pointer"
            >
              <ScanLine className="w-4 h-4" />
              <span>Simulate Gate Scan in Admin</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
