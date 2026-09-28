import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  Bot,
  Cpu,
  FileText,
  Pause,
  Play,
  Wrench,
  Zap,
  RotateCcw,
} from "lucide-react";
import { cn } from "@/lib/utils";

const KIND_META = {
  agent: { label: "Stage Lead", Icon: Bot, barClass: "bg-white", dotClass: "bg-white" },
  model: { label: "Milestone", Icon: Cpu, barClass: "bg-zinc-300", dotClass: "bg-zinc-300" },
  tool: { label: "Ops / Gate", Icon: Wrench, barClass: "bg-zinc-400", dotClass: "bg-zinc-400" },
  io: { label: "Check-In", Icon: FileText, barClass: "bg-white", dotClass: "bg-white" },
};

function formatDuration(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * 21st.dev AgentTrace — Monochrome Black & White Edition
 */
export default function AgentTrace({
  title = "ops_execution_trace // cook-off-7.0",
  spans = [],
  totalDuration = 8400,
  className = "",
}) {
  const [selectedId, setSelectedId] = useState(spans[0]?.id || null);
  const [playing, setPlaying] = useState(false);
  const [playhead, setPlayhead] = useState(totalDuration);
  const [scrubbing, setScrubbing] = useState(false);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }
    const startFrom = playhead >= totalDuration ? 0 : playhead;
    startRef.current = performance.now() - startFrom;

    const tick = (now) => {
      const elapsed = now - (startRef.current || now);
      if (elapsed >= totalDuration) {
        setPlayhead(totalDuration);
        setPlaying(false);
        return;
      }
      setPlayhead(elapsed);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [playing, totalDuration]);

  const handleTogglePlay = () => {
    if (!playing && playhead >= totalDuration) {
      setPlayhead(0);
    }
    setPlaying((p) => !p);
  };

  const seekFromClientX = useCallback(
    (clientX) => {
      const el = trackRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      setPlayhead(ratio * totalDuration);
    },
    [totalDuration]
  );

  useEffect(() => {
    if (!scrubbing) return;
    const onMove = (e) => seekFromClientX(e.clientX);
    const onUp = () => setScrubbing(false);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [scrubbing, seekFromClientX]);

  const selected = spans.find((s) => s.id === selectedId) ?? spans[0];
  const progressPct = totalDuration > 0 ? (playhead / totalDuration) * 100 : 100;

  return (
    <div
      className={cn(
        "rounded-2xl border border-zinc-800 bg-[#08080a] text-zinc-100 shadow-[0_20px_70px_rgba(0,0,0,0.8)] overflow-hidden select-none",
        className
      )}
    >
      {/* Top Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-b border-zinc-800 bg-zinc-950">
        <div className="flex items-center gap-2.5 min-w-0">
          <button
            type="button"
            onClick={handleTogglePlay}
            className="cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-lg border border-white/30 bg-white text-black hover:bg-zinc-200 transition"
            title={playing ? "Pause Trace" : "Replay Trace"}
          >
            {playing ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
          </button>
          <button
            type="button"
            onClick={() => {
              setPlaying(false);
              setPlayhead(totalDuration);
            }}
            className="cursor-pointer inline-flex items-center justify-center w-8 h-8 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white transition"
            title="Reset Trace"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-semibold text-white truncate">
                {title}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-md bg-white/10 border border-white/20 px-2 py-0.5 text-[10px] font-mono text-white">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                LIVE TRACE
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
          <span>
            <strong className="text-white">{spans.length}</strong> stages
          </span>
          <span className="text-zinc-700">·</span>
          <span className="tabular-nums text-white">
            {formatDuration(playhead)}{" "}
            <span className="text-zinc-500">/ {formatDuration(totalDuration)}</span>
          </span>
        </div>
      </div>

      {/* Scrubbable Time Axis */}
      <div className="grid grid-cols-12 items-center px-4 py-2 border-b border-zinc-800/70 bg-zinc-900/40 text-[10px] font-mono text-zinc-500">
        <div className="col-span-5 uppercase tracking-wider">Stage / Station</div>
        <div
          ref={trackRef}
          onPointerDown={(e) => {
            setPlaying(false);
            setScrubbing(true);
            seekFromClientX(e.clientX);
          }}
          className="col-span-5 relative flex justify-between items-center cursor-ew-resize py-1 px-1 rounded hover:bg-zinc-800/50"
          title="Drag to scrub timeline"
        >
          <span>00:00</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>END</span>
          <div
            aria-hidden
            style={{ left: `${progressPct}%` }}
            className="pointer-events-none absolute top-0 bottom-0 w-0.5 bg-white shadow-[0_0_10px_#ffffff]"
          />
        </div>
        <div className="col-span-2 text-right uppercase tracking-wider">Owner</div>
      </div>

      {/* Span Waterfall Rows */}
      <div className="divide-y divide-zinc-800/50">
        {spans.map((span) => {
          const meta = KIND_META[span.kind || "agent"] || KIND_META.agent;
          const Icon = meta.Icon;
          const leftPct = (span.start / totalDuration) * 100;
          const widthPct = Math.max(2, ((span.end - span.start) / totalDuration) * 100);
          const visibleWidthPct =
            playhead <= span.start
              ? 0
              : playhead >= span.end
              ? widthPct
              : ((playhead - span.start) / totalDuration) * 100;
          const isActive = playhead >= span.start && playhead <= span.end && playing;
          const isSelected = selected?.id === span.id;

          return (
            <button
              key={span.id}
              type="button"
              onClick={() => setSelectedId(span.id)}
              className={cn(
                "cursor-pointer w-full grid grid-cols-12 items-center px-4 py-2.5 text-left transition-colors",
                isSelected ? "bg-white/10" : "hover:bg-zinc-900/80",
                playhead < span.start && "opacity-40"
              )}
            >
              <div
                className="col-span-5 flex items-center gap-2 min-w-0 pr-2"
                style={{ paddingLeft: `${(span.depth || 0) * 14}px` }}
              >
                <Icon
                  className={cn(
                    "w-3.5 h-3.5 shrink-0",
                    isSelected ? "text-white" : "text-zinc-500"
                  )}
                />
                <span className="text-xs font-medium text-zinc-100 truncate">
                  {span.label}
                </span>
                {span.timeLabel && (
                  <span className="hidden sm:inline-block rounded bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 text-[10px] font-mono text-zinc-300">
                    {span.timeLabel}
                  </span>
                )}
              </div>

              <div className="col-span-5 relative h-5 flex items-center">
                <div className="w-full h-1.5 rounded-full bg-zinc-900 relative overflow-hidden">
                  <div
                    style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                    className="absolute top-0 bottom-0 rounded-full bg-zinc-800"
                  />
                  <div
                    style={{ left: `${leftPct}%`, width: `${visibleWidthPct}%` }}
                    className={cn(
                      "absolute top-0 bottom-0 rounded-full transition-[width] duration-75",
                      meta.barClass,
                      isActive && "animate-pulse shadow-[0_0_10px_#ffffff]"
                    )}
                  />
                </div>
                <div
                  aria-hidden
                  style={{ left: `${progressPct}%` }}
                  className="pointer-events-none absolute -top-2 -bottom-2 w-px bg-white/40"
                />
              </div>

              <div className="col-span-2 text-right font-mono text-[11px] text-zinc-400 truncate pl-2">
                {span.owner || meta.label}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Span Inspector Footer */}
      {selected && (
        <div className="px-4 py-3 bg-zinc-950 border-t border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-3.5 h-3.5 text-white shrink-0" />
            <span className="font-mono text-white font-semibold">
              {selected.timeLabel || "STAGE"}
            </span>
            <span className="text-zinc-300 font-medium">{selected.label}</span>
          </div>
          <span className="font-mono text-[11px] text-zinc-400">
            {selected.detail || `Assigned to ${selected.owner || "Events & Ops"}`}
          </span>
        </div>
      )}
    </div>
  );
}
