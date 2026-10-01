"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Background layer that drifts slightly slower than the page as its
 * section scrolls past. It's oversized vertically so the drift never
 * reveals an edge — place it where an `absolute inset-0` background
 * would go, inside a parent with overflow hidden.
 */
export default function ParallaxLayer({
  children,
  className = "",
  strength = 8,
}: {
  children: ReactNode;
  className?: string;
  /** Max drift in % of the layer height, each direction. */
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [`-${strength}%`, `${strength}%`]);

  return (
    <div
      ref={ref}
      // Inline so wrappers like .gradient-border (which force children to
      // position: relative) can't pull this layer into the flow.
      style={{ position: "absolute", inset: 0, zIndex: 0 }}
      className="overflow-hidden pointer-events-none"
    >
      <motion.div
        className={`absolute inset-x-0 ${className}`}
        style={{
          top: `-${strength + 2}%`,
          bottom: `-${strength + 2}%`,
          y: reduce ? 0 : y,
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
