"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

const CYCLES = 2; // full 0–9 spins before landing, for the slot-machine feel

/**
 * Odometer / slot-machine number: every digit is a reel that spins a
 * couple of times and lands on its value, left to right, when the
 * number scrolls into view. `value` like "2000+" — non-digits are
 * treated as a suffix that fades in once the reels settle.
 */
export default function RollingNumber({
  value,
  className = "",
  digitClassName = "",
  delay = 0,
}: {
  value: string;
  className?: string;
  digitClassName?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  const digits = value.replace(/\D/g, "").split("").map(Number);
  const suffix = value.replace(/[0-9]/g, "");

  if (reduce) {
    return (
      <span ref={ref} className={className}>
        <span className={digitClassName}>{value}</span>
      </span>
    );
  }

  const strip = Array.from({ length: (CYCLES + 1) * 10 }, (_, i) => i % 10);
  const settle = 1.5 + digits.length * 0.12;

  return (
    <span ref={ref} className={`inline-flex items-baseline tabular-nums ${className}`} aria-label={value}>
      {digits.map((d, i) => {
        const target = CYCLES * 10 + d;
        return (
          <span
            key={i}
            aria-hidden
            className="relative inline-block overflow-hidden"
            style={{ height: "1.15em", lineHeight: "1.15em" }}
          >
            {/* invisible placeholder keeps the reel exactly one digit wide */}
            <span className="invisible">0</span>
            <motion.span
              className="absolute left-0 top-0 flex flex-col"
              initial={{ y: "0%" }}
              animate={inView ? { y: `-${(target / strip.length) * 100}%` } : {}}
              transition={{
                duration: 1.5 + i * 0.12,
                delay: delay + i * 0.08,
                ease: [0.12, 0.8, 0.2, 1],
              }}
            >
              {strip.map((n, k) => (
                <span key={k} className={`block ${digitClassName}`} style={{ height: "1.15em" }}>
                  {n}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
      {suffix && (
        <motion.span
          aria-hidden
          className={digitClassName}
          initial={{ opacity: 0, x: -6 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.4, delay: delay + settle - 0.3 }}
        >
          {suffix}
        </motion.span>
      )}
    </span>
  );
}
