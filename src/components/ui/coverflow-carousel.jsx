import * as React from "react";
import { ChevronLeft, ChevronRight, Ticket, Clock, Flame } from "lucide-react";
import { cn } from "@/lib/utils";

const useIsoLayoutEffect =
  typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;

/**
 * 21st.dev 3D CoverflowCarousel Component
 * Engineered with 60fps direct-DOM transform physics, pointer drag throw,
 * keyboard navigation, and interactive event action triggers.
 */
export function CoverflowCarousel({
  slides = [],
  rotate = 44,
  depth = 0.6,
  perspective = 3,
  falloff = 0.56,
  fade = 0.1,
  cardWidth = "clamp(230px, 28vw, 340px)",
  gap = 0.06,
  loop = true,
  showCaption = true,
  showPagination = true,
  showNavigation = true,
  label = "Event Coverflow Carousel",
  className,
  cardClassName,
  onBookEvent,
  onInspectEvent,
}) {
  const count = slides.length;

  const frameRef = React.useRef(null);
  const cardRefs = React.useRef([]);
  const posRef = React.useRef(0);
  const targetRef = React.useRef(0);
  const widthRef = React.useRef(0);
  const rafRef = React.useRef(null);
  const dragRef = React.useRef(null);
  const movedRef = React.useRef(false);

  const [selected, setSelected] = React.useState(0);

  const indexAt = React.useCallback(
    (pos) => (count > 0 ? ((Math.round(pos) % count) + count) % count : 0),
    [count]
  );

  const paint = React.useCallback(() => {
    const width = widthRef.current;
    if (!width || count === 0) return;
    const pitch = width * (1 + gap);
    const pos = posRef.current;

    cardRefs.current.forEach((card, index) => {
      if (!card) return;

      let offset = index - pos;
      if (loop && count > 2) {
        offset = ((offset % count) + count) % count;
        if (offset > count / 2) offset -= count;
      }

      const distance = Math.abs(offset);
      const ramp = Math.pow(distance, falloff);
      const tilt = Math.min(rotate * ramp, 82) * Math.sign(offset);

      card.style.transform =
        `translateX(calc(-50% + ${offset * pitch}px)) ` +
        `translateZ(${-depth * width * ramp}px) rotateY(${-tilt}deg)`;

      const edge =
        loop && count > 2 ? Math.min(1, Math.max(0, count / 2 - distance)) : 1;
      card.style.opacity = String(Math.max(0.12, 1 - fade * distance) * edge);
      card.style.zIndex = String(100 - Math.round(distance * 10));
    });
  }, [count, depth, fade, falloff, gap, loop, rotate]);

  const settle = React.useCallback(
    (target) => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      targetRef.current = target;
      setSelected(indexAt(target));

      const step = () => {
        const remaining = target - posRef.current;
        if (Math.abs(remaining) < 0.0004) {
          posRef.current = target;
          paint();
          rafRef.current = null;
          return;
        }
        posRef.current += remaining * 0.16;
        paint();
        rafRef.current = requestAnimationFrame(step);
      };
      rafRef.current = requestAnimationFrame(step);
    },
    [indexAt, paint]
  );

  const clamp = React.useCallback(
    (pos) =>
      loop && count > 2 ? pos : Math.max(0, Math.min(count - 1, pos)),
    [count, loop]
  );

  const goTo = React.useCallback(
    (index) => {
      if (count === 0) return;
      const target =
        loop && count > 2
          ? index + Math.round((targetRef.current - index) / count) * count
          : index;
      settle(clamp(target));
    },
    [clamp, count, loop, settle]
  );

  const nudge = React.useCallback(
    (by) => settle(clamp(Math.round(targetRef.current) + by)),
    [clamp, settle]
  );

  const onPointerDown = (event) => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    movedRef.current = false;
    event.currentTarget.setPointerCapture(event.pointerId);
    targetRef.current = posRef.current;
    dragRef.current = {
      id: event.pointerId,
      x: event.clientX,
      pos: posRef.current,
      v: 0,
      t: performance.now(),
    };
  };

  const onPointerMove = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;

    const deltaX = event.clientX - drag.x;
    if (Math.abs(deltaX) > 6) movedRef.current = true;

    const pitch = widthRef.current * (1 + gap);
    if (!pitch) return;

    const now = performance.now();
    const previous = posRef.current;
    posRef.current = clamp(drag.pos - deltaX / pitch);
    drag.v = ((posRef.current - previous) / Math.max(now - drag.t, 1)) * 1000;
    drag.t = now;

    const index = indexAt(posRef.current);
    if (index !== selected) setSelected(index);
    paint();
  };

  const endDrag = (event) => {
    const drag = dragRef.current;
    if (!drag || drag.id !== event.pointerId) return;
    dragRef.current = null;
    const carried = Math.max(-2, Math.min(2, drag.v * 0.18));
    settle(clamp(Math.round(posRef.current + carried)));
  };

  useIsoLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const measure = () => {
      const card = cardRefs.current[0];
      if (!card) return;
      widthRef.current = card.offsetWidth;
      paint();
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(frame);
    return () => observer.disconnect();
  }, [paint, count]);

  React.useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  if (count === 0) return null;

  const active = slides[selected] || slides[0];

  return (
    <div
      className={cn("w-full select-none", className)}
      style={{ "--cf-card": cardWidth }}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
    >
      <div className="relative">
        <div
          ref={frameRef}
          tabIndex={0}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={(event) => {
            if (event.key === "ArrowLeft") {
              event.preventDefault();
              nudge(-1);
            } else if (event.key === "ArrowRight") {
              event.preventDefault();
              nudge(1);
            }
          }}
          className="cursor-grab overflow-hidden py-12 outline-none active:cursor-grabbing"
          style={{
            perspective: `calc(var(--cf-card) * ${perspective})`,
            touchAction: "pan-y",
          }}
        >
          <div
            className="relative select-none"
            style={{
              height: "var(--cf-card)",
              transformStyle: "preserve-3d",
            }}
          >
            {slides.map((slide, index) => {
              const isCenter = index === selected;
              return (
                <div
                  key={slide.id || index}
                  ref={(node) => {
                    cardRefs.current[index] = node;
                  }}
                  onClick={() => {
                    if (!movedRef.current) {
                      goTo(index);
                    }
                  }}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${index + 1} of ${count}`}
                  className={cn(
                    "absolute left-1/2 top-0 aspect-square overflow-hidden rounded-3xl bg-zinc-950 border shadow-[0_30px_80px_rgba(0,0,0,0.9)] will-change-transform transition-colors duration-300",
                    isCenter
                      ? "border-white/60 ring-1 ring-white/30"
                      : "border-zinc-800/80",
                    cardClassName
                  )}
                  style={{ width: "var(--cf-card)" }}
                >
                  {/* High-Contrast Monochrome Visual Poster */}
                  <img
                    src={slide.src}
                    alt={slide.alt}
                    draggable={false}
                    className="h-full w-full select-none object-cover grayscale contrast-125 brightness-75 transition-transform duration-500 hover:scale-105"
                  />

                  {/* Dark Gradient Scrim + Live Event Poster Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/20 p-5 flex flex-col justify-between">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-white text-black">
                        {slide.badge || "EVENT"}
                      </span>
                      {slide.featured && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold bg-black/80 text-white border border-white/30 flex items-center gap-1">
                          <Flame className="w-3 h-3" /> FLAGSHIP
                        </span>
                      )}
                    </div>

                    <div>
                      <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-300">
                        {slide.dateLabel}
                      </p>
                      <h4 className="font-display font-bold text-white text-lg sm:text-xl leading-tight mt-1 line-clamp-2">
                        {slide.title}
                      </h4>
                      {slide.prizePool && (
                        <p className="font-mono text-xs text-white/90 mt-1.5 font-semibold">
                          PRIZE POOL · {slide.prizePool}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {showNavigation && (
          <>
            <button
              type="button"
              aria-label="Previous slide"
              onClick={() => nudge(-1)}
              className="cursor-pointer absolute left-3 sm:left-6 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-black/85 border border-white/25 p-3 text-white backdrop-blur-md transition hover:bg-white hover:text-black shadow-2xl"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              aria-label="Next slide"
              onClick={() => nudge(1)}
              className="cursor-pointer absolute right-3 sm:right-6 top-1/2 z-[200] -translate-y-1/2 rounded-full bg-black/85 border border-white/25 p-3 text-white backdrop-blur-md transition hover:bg-white hover:text-black shadow-2xl"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Active Event Caption + Telemetry Meta Table + Action Triggers */}
      {showCaption && active?.title && (
        <div
          key={selected}
          className="mt-2 flex flex-col items-center px-4 animate-fadeIn max-w-xl mx-auto text-center"
        >
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-zinc-400">
            SLIDE 0{selected + 1} / 0{count} · DRAG OR USE ARROW KEYS
          </span>
          <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white">
            {active.title}
          </h3>
          {active.subtitle && (
            <p className="mt-1.5 text-sm text-zinc-400 max-w-md leading-relaxed">
              {active.subtitle}
            </p>
          )}

          {active.meta && active.meta.length > 0 && (
            <dl className="mt-6 w-full max-w-md rounded-2xl bg-zinc-950/90 border border-zinc-800 p-4 text-xs font-mono divide-y divide-zinc-800/70">
              {active.meta.map((row) => (
                <div
                  key={row.label}
                  className="flex justify-between py-2 first:pt-0 last:pb-0"
                >
                  <dt className="text-zinc-500 uppercase">{row.label}</dt>
                  <dd className="font-bold text-white">{row.value}</dd>
                </div>
              ))}
            </dl>
          )}

          {/* Direct Action CTAs for the Active Coverflow Event */}
          {active.rawEvent && (
            <div className="mt-6 flex flex-wrap items-center justify-center gap-3 w-full max-w-md">
              {onBookEvent && (
                <button
                  type="button"
                  onClick={() => onBookEvent(active.rawEvent)}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-zinc-200 text-black font-mono text-xs uppercase font-bold tracking-wider transition active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                >
                  <Ticket className="w-4 h-4" />
                  Book QR Pass
                </button>
              )}
              {onInspectEvent && (
                <button
                  type="button"
                  onClick={() => onInspectEvent(active.rawEvent)}
                  className="cursor-pointer flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-zinc-900 hover:bg-zinc-800 text-white border border-zinc-700 font-mono text-xs uppercase font-bold tracking-wider transition active:scale-95"
                >
                  <Clock className="w-4 h-4" />
                  Run-of-Show Trace
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {showPagination && (
        <div className="mt-7 flex items-center justify-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === selected}
              onClick={() => goTo(index)}
              className={cn(
                "cursor-pointer h-2 rounded-full bg-white transition-all duration-300",
                index === selected ? "w-8 opacity-100" : "w-2 opacity-30 hover:opacity-60"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CoverflowCarousel;
