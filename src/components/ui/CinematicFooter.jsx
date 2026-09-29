import React, { useRef, useState } from "react";
import {
  Ticket,
  Shield,
  Sparkles,
  Terminal,
  Trophy,
  Calendar,
  Download,
  ArrowUpRight,
  Plus,
  Heart,
  Code2,
} from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Default Project-Specific Configuration for CodeChef ABESEC — The Code Kitchen
 * Can be overridden partially or completely via the `footerConfig` prop.
 */
export const DEFAULT_FOOTER_CONFIG = {
  brandName: "CODE KITCHEN",
  subBrand: "CODECHEF ABESEC · CHEFOPS v2.6",
  eyebrow: "// CHAPTER RECRUITMENT & EVENT ENGINE 2026–27",
  headline: "Ready to step into the Kitchen?",
  subheadline:
    "Book your holographic QR Chef Pass, inspect live AgentTrace run-of-show timelines, or jump into the Admin Gate Console.",
  marqueeItems: [
    "HOLOGRAPHIC QR CHEF PASSES",
    "3D COVERFLOW EVENT STAGE",
    "LIVE AGENTTRACE TELEMETRY",
    "REAL-TIME SEAT HEATMAPS",
    "HEAD CHEF AI CONCIERGE",
    "ABESEC BRANCH PARTICIPATION BATTLE",
    "ZERO-FIRE GROUND EXECUTION",
    "DUAL-ENGINE EXPRESS + MONGODB API",
  ],
  creatorName: "ROHIT SHARMA · DEV & EVENT OPS",
  repoUrl: "https://github.com/ROhitg-upta/code-kitchen",
};

/**
 * MagneticButton — Interactive pill button with spring-like cursor magnetic pull
 */
function MagneticButton({ children, className, onClick, href }) {
  const btnRef = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const el = btnRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.22;
    const deltaY = (e.clientY - centerY) * 0.28;
    setOffset({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setOffset({ x: 0, y: 0 });
  };

  const style = {
    transform: `translate3d(${offset.x}px, ${offset.y}px, 0)`,
    transition:
      offset.x === 0 && offset.y === 0
        ? "transform 450ms cubic-bezier(0.22, 1.4, 0.36, 1)"
        : "transform 60ms linear",
  };

  if (href) {
    return (
      <a
        ref={btnRef}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={style}
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      ref={btnRef}
      type="button"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={style}
      className={className}
    >
      {children}
    </button>
  );
}

/**
 * CinematicFooter — Curtain-Reveal Sticky Footer with Infinite Ticker,
 * Magnetic Primary CTA Buttons, Giant Masked Watermark & Creator Attribution.
 */
export default function CinematicFooter({
  footerConfig = {},
  onNavigate,
  onOpenRegister,
  onExportCsv,
  featuredEvent,
}) {
  const config = { ...DEFAULT_FOOTER_CONFIG, ...footerConfig };
  const year = new Date().getFullYear();
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const handlePointerMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setMousePos({ x, y });
  };

  const primaryButtons = config.primaryButtons || [
    {
      label: "Book Holographic QR Pass",
      icon: Ticket,
      variant: "primary",
      onClick: () => {
        if (featuredEvent && onOpenRegister) onOpenRegister(featuredEvent);
        else if (onNavigate) onNavigate("events");
      },
    },
    {
      label: "Launch Admin Gate Console",
      icon: Shield,
      variant: "secondary",
      onClick: () => onNavigate?.("admin"),
    },
    {
      label: "Ask Head Chef AI",
      icon: Sparkles,
      variant: "secondary",
      onClick: () => onNavigate?.("ai-finder"),
    },
  ];

  const secondaryLinks = config.secondaryLinks || [
    {
      label: "Kitchen Menu (Events)",
      icon: Calendar,
      onClick: () => onNavigate?.("events"),
    },
    {
      label: "Branch Battle Leaderboard",
      icon: Trophy,
      onClick: () => onNavigate?.("leaderboard"),
    },
    {
      label: "Command Palette (Ctrl+K)",
      icon: Terminal,
      onClick: () => onNavigate?.("__toggle_cmd__"),
    },
    {
      label: "Export Roster CSV",
      icon: Download,
      onClick: () => onExportCsv?.(),
    },
    {
      label: "GitHub Repository",
      icon: Code2,
      href: config.repoUrl,
    },
  ];

  return (
    <footer
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className="relative lg:sticky lg:bottom-0 lg:z-0 w-full bg-[#030304] text-white overflow-hidden select-none border-t border-zinc-800/90"
    >
      {/* Dynamic Cursor Ambient Glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.07), transparent 60%)`,
        }}
      />

      {/* ───────── 1. Infinite Scrolling Slanted/Horizontal Ticker Ribbon ───────── */}
      <div className="relative z-20 border-b border-zinc-800/90 bg-white text-black py-3 overflow-hidden shadow-[0_10px_40px_rgba(255,255,255,0.08)]">
        <div className="flex items-center whitespace-nowrap animate-[footerMarquee_28s_linear_infinite]">
          {[0, 1, 2].map((loopIdx) => (
            <div key={loopIdx} className="flex items-center">
              {config.marqueeItems.map((item, idx) => (
                <span
                  key={`${loopIdx}-${idx}`}
                  className="inline-flex items-center gap-4 font-mono text-[11px] sm:text-xs font-extrabold uppercase tracking-[0.22em] px-6"
                >
                  <span>{item}</span>
                  <Plus className="w-3.5 h-3.5 stroke-[3] text-zinc-500" />
                </span>
              ))}
            </div>
          ))}
        </div>
        <style>{`
          @keyframes footerMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.333%); }
          }
        `}</style>
      </div>

      {/* ───────── 2. Main Center Stage CTA + Giant Masked Watermark ───────── */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-16 sm:pt-24 pb-12 sm:pb-16 flex flex-col items-center text-center">
        {/* Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 rounded-full bg-zinc-900/90 border border-zinc-800 px-4 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-300 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
          {config.eyebrow}
        </div>

        {/* Prominent Center Stage Title */}
        <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold tracking-[-0.03em] text-white leading-[0.98] max-w-3xl">
          {config.headline}
        </h2>

        <p className="mt-4 text-sm sm:text-base text-zinc-400 max-w-xl leading-relaxed">
          {config.subheadline}
        </p>

        {/* Primary Magnetic Pill Buttons */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3.5">
          {primaryButtons.map((btn, i) => {
            const Icon = btn.icon || Ticket;
            const isPrimary = btn.variant === "primary";
            return (
              <MagneticButton
                key={i}
                onClick={btn.onClick}
                href={btn.href}
                className={cn(
                  "cursor-pointer group inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-xs sm:text-sm font-mono uppercase tracking-wider font-bold transition-colors",
                  isPrimary
                    ? "bg-white text-black hover:bg-zinc-200 shadow-[0_0_45px_rgba(255,255,255,0.22)]"
                    : "bg-zinc-900/90 hover:bg-zinc-800 text-white border border-zinc-700/90 hover:border-white/50"
                )}
              >
                <Icon className="w-4 h-4" />
                <span>{btn.label}</span>
                <ArrowUpRight className="w-4 h-4 opacity-60 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100 transition-transform" />
              </MagneticButton>
            );
          })}
        </div>

        {/* Secondary Navigation Pill Links */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
          {secondaryLinks.map((link, idx) => {
            const Icon = link.icon;
            const content = (
              <>
                {Icon && <Icon className="w-3.5 h-3.5 text-zinc-400 group-hover:text-white transition-colors" />}
                <span>{link.label}</span>
              </>
            );
            const pillClass =
              "cursor-pointer group inline-flex items-center gap-1.5 rounded-full bg-zinc-950/80 hover:bg-zinc-900 border border-zinc-800/90 hover:border-zinc-600 px-4 py-2 text-[11px] font-mono text-zinc-400 hover:text-white transition-all";

            if (link.href) {
              return (
                <a
                  key={idx}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={pillClass}
                >
                  {content}
                  <ArrowUpRight className="w-3 h-3 opacity-60" />
                </a>
              );
            }
            return (
              <button
                key={idx}
                type="button"
                onClick={link.onClick}
                className={pillClass}
              >
                {content}
              </button>
            );
          })}
        </div>
      </div>

      {/* ───────── 3. Giant Masked Watermark Typography ───────── */}
      <div
        aria-hidden="true"
        className="relative z-0 w-full overflow-hidden flex justify-center items-center py-2 pointer-events-none select-none"
      >
        <span
          className="font-display font-bold uppercase tracking-[-0.06em] leading-[0.82] text-[15vw] sm:text-[13.5vw] whitespace-nowrap bg-gradient-to-b from-white/[0.14] via-white/[0.05] to-transparent bg-clip-text text-transparent"
        >
          {config.brandName}
        </span>
      </div>

      {/* ───────── 4. Bottom Copyright & Creator Attribution Bar ───────── */}
      <div className="relative z-20 border-t border-zinc-900 bg-black/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Left: Dynamic Copyright */}
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-zinc-500 text-center sm:text-left">
            © {year} {config.subBrand}. ALL RIGHTS RESERVED.
          </p>

          {/* Right: Creator Attribution Pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-zinc-950 border border-zinc-800 px-4 py-1.5 font-mono text-[10px] uppercase tracking-widest text-zinc-300 shadow-inner">
            <span>CRAFTED WITH</span>
            <Heart className="w-3 h-3 text-white fill-white animate-pulse" />
            <span>BY {config.creatorName}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
