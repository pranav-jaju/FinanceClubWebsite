"use client";

import { motion, useReducedMotion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Splits `text` into words that slide up from behind a mask one after
 * another when the heading scrolls into view. Use several in one heading
 * (e.g. plain + gold part) and offset them with `delay`.
 */
export default function RevealWords({
  text,
  className,
  delay = 0,
  stagger = 0.07,
}: {
  text: string;
  className?: string;
  delay?: number;
  stagger?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ").filter(Boolean);

  if (reduce) return <span className={className}>{text}</span>;

  return (
    <motion.span
      className="inline"
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.6 }}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={`${w}-${i}`} aria-hidden>
          <span className="inline-block overflow-hidden align-bottom pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className={`inline-block ${className ?? ""}`}
              variants={{
                hidden: { y: "105%", opacity: 0 },
                show: { y: "0%", opacity: 1, transition: { duration: 0.75, ease: EASE } },
              }}
            >
              {w}
            </motion.span>
          </span>
          {/* a real space between words so headings still wrap normally */}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </motion.span>
  );
}
