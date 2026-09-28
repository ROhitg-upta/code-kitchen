import React, { useState, useCallback, useEffect, useRef } from "react";
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
  Clock,
  Layers,
} from "lucide-react";
import { cn } from "@/lib/utils";

function DeterministicQrSvg({ seedString }) {
  const SIZE = 11;
  const CELL = 1;

  let hash = 2166136261;
  for (let i = 0; i < seedString.length; i++) {
    hash ^= seedString.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }

  const cells = [];
  for (let r = 0; r < SIZE; r++) {
    for (let c = 0; c < SIZE; c++) {
      const isCorner =
        (r < 3 && c < 3) ||
        (r < 3 && c >= SIZE - 3) ||
        (r >= SIZE - 3 && c < 3);

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
            rx={isCorner ? 0.15 : 0.08}
            fill="#000000"
          />
        );
      }
    }
  }

  return (
    <div className="w-28 h-28 sm:w-32 sm:h-32 p-2.5 bg-white rounded-xl shadow-inner border-2 border-white mx-auto">
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        className="w-full h-full"
        role="img"
        aria-label={`QR code for ticket ${seedString}`}
      >
        <rect width={SIZE} height={SIZE} fill="white" rx={0.5} />
        {cells}
      </svg>
    </div>
  );
}

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
      } catch {}
    },
    [resetDelay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { copied, copy };
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[10px] uppercase font-mono text-zinc-500 tracking-wider leading-none mb-0.5">
          {label}
        </p>
        <p className="text-sm text-white font-medium truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

export default function QrPassModal({ ticket, onClose, onJumpToScanner }) {
  const { copied, copy } = useCopyToClipboard();

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (!ticket) return null;

  const isCheckedIn = ticket.checkedIn === true;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="holo-ticket max-w-lg w-full rounded-3xl border border-white/35 shadow-[0_0_80px_rgba(255,255,255,0.14)] p-6 sm:p-8 relative">
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-4 right-4 sm:top-5 sm:right-5 p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-800 transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-white" />
          <span className="text-[11px] font-mono uppercase tracking-widest text-zinc-300 leading-none">
            CODECHEF ABESEC // HOLOGRAPHIC ENTRY PASS
          </span>
        </div>

        <h2 className="font-display text-xl sm:text-2xl font-bold text-white leading-snug pr-10">
          {ticket.eventTitle}
        </h2>

        <div className="bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-3 mt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold border",
              isCheckedIn
                ? "bg-white text-black border-white"
                : "bg-zinc-900 text-white border-zinc-700"
            )}
          >
            {isCheckedIn ? (
              <>
                <ShieldCheck className="w-3.5 h-3.5" />
                GATE VERIFIED (CHECKED IN)
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                CONFIRMED SEAT // READY FOR SCAN
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono text-sm text-white font-bold tracking-wide">
              {ticket.ticketId}
            </span>
            <button
              onClick={() => copy(ticket.ticketId)}
              className="cursor-pointer p-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white border border-zinc-800 transition"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-white" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Perforated Tear Line */}
        <div className="relative my-6">
          <div className="border-t-2 border-dashed border-zinc-800" />
          <div className="absolute -left-9 sm:-left-11 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050505]" />
          <div className="absolute -right-9 sm:-right-11 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#050505]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex flex-col items-center justify-center">
            <DeterministicQrSvg seedString={ticket.ticketId} />
            <p className="font-mono text-[11px] text-zinc-300 mt-2 tracking-wider font-bold">
              {ticket.ticketId}
            </p>
          </div>

          <div className="sm:col-span-2 bg-zinc-950/90 p-4 rounded-2xl border border-zinc-800">
            <div className="flex items-center justify-between gap-2 mb-4">
              <h3 className="font-display font-bold text-white text-lg truncate">
                {ticket.name}
              </h3>
              <span className="shrink-0 px-2.5 py-0.5 rounded text-[10px] font-mono bg-white text-black font-bold">
                {ticket.branch} · {ticket.year}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoRow icon={Mail} label="College Email" value={ticket.email} />
              <InfoRow icon={Phone} label="WhatsApp" value={ticket.phone} />
              <InfoRow
                icon={Layers}
                label="Station"
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

        <div className="flex flex-col sm:flex-row gap-3 mt-6">
          <button
            onClick={() => window.print()}
            className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 text-xs font-mono uppercase font-bold border border-zinc-800 transition"
          >
            <Printer className="w-4 h-4" />
            Print / Save Pass PDF
          </button>

          {onJumpToScanner && (
            <button
              onClick={() => {
                onJumpToScanner(ticket.ticketId);
                onClose();
              }}
              className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-zinc-200 text-black text-xs font-mono uppercase font-bold transition"
            >
              <ScanLine className="w-4 h-4" />
              Simulate Gate Scan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
