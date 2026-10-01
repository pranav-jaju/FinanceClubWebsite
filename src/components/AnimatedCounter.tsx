// components/AnimatedCounter.tsx
"use client";

import { useEffect, useRef, useState } from "react";

export default function AnimatedCounter({
  value,
  start = true,
  delay = 0,
}: {
  value: string;
  /** Hold the counter at 0 until this becomes true (e.g. after a reveal animation). */
  start?: boolean;
  /** Extra delay in ms once the counter is both visible and allowed to start. */
  delay?: number;
}) {
  const numericValue = parseInt(value.replace(/\D/g, ""), 10);
  const suffix = value.replace(/[0-9]/g, "");

  const [display, setDisplay] = useState(0);
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView || !start) return;

    let raf = 0;
    const duration = 1400;
    const timeout = setTimeout(() => {
      const startTime = performance.now();

      const tick = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        setDisplay(Math.floor(eased * numericValue));

        if (progress < 1) raf = requestAnimationFrame(tick);
        else setDisplay(numericValue);
      };

      raf = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, [inView, start, delay, numericValue]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
}
