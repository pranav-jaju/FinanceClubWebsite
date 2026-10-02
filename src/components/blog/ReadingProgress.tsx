"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Thin gold bar under the navbar showing how far through the article you are. */
export default function ReadingProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40, mass: 0.3 });

  return (
    <motion.div
      aria-hidden
      className="fixed left-0 right-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold-dark via-gold to-gold-light shadow-[0_0_10px_rgba(245,183,49,0.6)]"
      style={{ scaleX }}
    />
  );
}
