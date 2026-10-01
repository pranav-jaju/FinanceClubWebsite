"use client";

import { useEffect, useRef } from "react";

/**
 * Soft gold glow that follows the cursor across its parent section.
 * Purely decorative overlay — never affects layout, hidden on touch
 * screens, and skipped for reduced-motion users.
 */
export default function HeroSpotlight() {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    const host = el?.parentElement;
    if (!el || !host) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    const apply = () => {
      raf = 0;
      el.style.setProperty("--spot-x", `${x}px`);
      el.style.setProperty("--spot-y", `${y}px`);
    };
    const onMove = (e: MouseEvent) => {
      const r = host.getBoundingClientRect();
      x = e.clientX - r.left;
      y = e.clientY - r.top;
      el.style.opacity = "1";
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onLeave = () => {
      el.style.opacity = "0";
    };

    host.addEventListener("mousemove", onMove);
    host.addEventListener("mouseleave", onLeave);
    return () => {
      host.removeEventListener("mousemove", onMove);
      host.removeEventListener("mouseleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 z-[3] opacity-0 transition-opacity duration-500"
      style={{
        background:
          "radial-gradient(520px circle at var(--spot-x, 50%) var(--spot-y, 50%), rgba(245,183,49,0.13), rgba(245,183,49,0.04) 35%, transparent 60%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
