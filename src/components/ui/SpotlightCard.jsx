import React, { useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * SpotlightCard — Monochrome mouse-tracking radial glow + optional 3D perspective tilt
 */
export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(255, 255, 255, 0.12)",
  enableTilt = false,
  onClick,
  style = {},
}) {
  const cardRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setPos({ x, y });

    if (enableTilt) {
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -3.5;
      const rotateY = ((x - centerX) / centerX) * 3.5;
      setTilt({ rotateX, rotateY });
    }
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => {
        setOpacity(0);
        if (enableTilt) setTilt({ rotateX: 0, rotateY: 0 });
      }}
      style={{
        ...style,
        transform: enableTilt
          ? `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
          : style.transform,
        transition: enableTilt
          ? "transform 180ms cubic-bezier(0.16, 1, 0.3, 1), border-color 300ms ease"
          : undefined,
      }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0a0a0c] transition-colors duration-300 hover:border-white/40",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-0"
        style={{
          opacity,
          background: `radial-gradient(520px circle at ${pos.x}px ${pos.y}px, ${spotlightColor}, transparent 45%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
