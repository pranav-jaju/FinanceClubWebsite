"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Grid wrapper that reveals its <StaggerItem> children one after another
 * the first time it scrolls into view.
 */
export function StaggerGrid({
  className,
  children,
  stagger = 0.09,
}: {
  className?: string;
  children: ReactNode;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : stagger, delayChildren: 0.05 } },
  };

  return (
    <motion.div
      className={className}
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {children}
    </motion.div>
  );
}

/**
 * One revealed item: rises, un-blurs and fades in, then a soft gold
 * sheen sweeps across it once. Wrap the card (don't put this on an
 * element that has its own CSS `transition: all`).
 */
export function StaggerItem({
  className,
  children,
  from = "bottom",
}: {
  className?: string;
  children: ReactNode;
  /** Direction the item pans in from. */
  from?: "bottom" | "left" | "right";
}) {
  const reduce = useReducedMotion();
  const offset =
    from === "left" ? { x: -48, y: 0 } : from === "right" ? { x: 48, y: 0 } : { x: 0, y: 28 };

  const item: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.3 } } }
    : {
        hidden: { opacity: 0, ...offset, scale: 0.97, filter: "blur(6px)" },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          transition: { duration: 0.8, ease: EASE },
        },
      };

  const sheen: Variants = {
    hidden: { x: "-120%", opacity: 0 },
    show: {
      x: "120%",
      opacity: [0, 1, 0],
      transition: { duration: 1.1, ease: "easeInOut", delay: 0.35 },
    },
  };

  return (
    <motion.div className={`relative ${className ?? ""}`} variants={item}>
      {children}
      {!reduce && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[1.25rem]" aria-hidden>
          <motion.div
            variants={sheen}
            className="absolute inset-y-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-gold/[0.09] to-transparent"
          />
        </div>
      )}
    </motion.div>
  );
}
