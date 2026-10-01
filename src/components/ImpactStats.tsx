"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";
import { Building2, Calendar, TrendingUp, Users } from "lucide-react";
import RollingNumber from "@/components/motion/RollingNumber";

const EASE = [0.16, 1, 0.3, 1] as const;

const STATS = [
  { value: "2000+", label: "Registrations", note: "across competitions, bootcamps and sessions", icon: Users, wide: true },
  { value: "15+", label: "Events Annually", icon: Calendar },
  { value: "8+", label: "Industry Partners", icon: Building2 },
  { value: "20+", label: "Sessions & Workshops", note: "led by students and industry professionals", icon: TrendingUp, wide: true },
];

// Decorative rising line for the wide tiles — a visual motif, not data.
const LINE = "M0 78 L40 70 L70 74 L110 58 L140 62 L180 44 L210 50 L250 30 L285 36 L320 14";
const AREA = `${LINE} L320 100 L0 100 Z`;

function GrowthLine({ id }: { id: string }) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 320 100"
      preserveAspectRatio="none"
      className="absolute right-0 bottom-0 h-[55%] w-[60%] sm:h-[70%] sm:w-[55%] pointer-events-none"
      aria-hidden
    >
      <defs>
        <linearGradient id={`${id}-stroke`} x1="0" x2="1">
          <stop offset="0%" stopColor="#D49A1A" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#FDD85D" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${id}-fill`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#F5B731" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#F5B731" stopOpacity="0" />
        </linearGradient>
      </defs>
      <motion.path
        d={AREA}
        fill={`url(#${id}-fill)`}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: reduce ? 0 : 1.1 }}
      />
      <motion.path
        d={LINE}
        fill="none"
        stroke={`url(#${id}-stroke)`}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: reduce ? 1 : 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.8, delay: 0.4, ease: EASE }}
      />
    </svg>
  );
}

/**
 * "Scale That Matters" stats: a bento of glass tiles that stagger in,
 * slot-machine numbers, a gold edge that draws across the top of each
 * tile, and rising lines on the wide tiles.
 */
export default function ImpactStats() {
  const reduce = useReducedMotion();

  const container: Variants = {
    hidden: {},
    show: { transition: { staggerChildren: reduce ? 0 : 0.12 } },
  };
  const tile: Variants = reduce
    ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 26, scale: 0.96, filter: "blur(6px)" },
        show: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)", transition: { duration: 0.8, ease: EASE } },
      };

  return (
    <motion.div
      className="grid grid-cols-2 gap-3 sm:gap-4"
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.25 }}
    >
      {STATS.map((s, i) => (
        <motion.div
          key={s.label}
          variants={tile}
          className={`group relative overflow-hidden rounded-2xl border border-gold/15 bg-[#141010]/75 backdrop-blur-md hover:border-gold/35 transition-colors duration-300 ${
            s.wide ? "col-span-2 p-5 sm:p-7 min-h-[150px] sm:min-h-[170px]" : "p-5 sm:p-6 min-h-[150px]"
          }`}
        >
          {/* gold edge drawing across the top */}
          <motion.span
            aria-hidden
            className="absolute left-0 top-0 h-px w-full origin-left bg-gradient-to-r from-transparent via-gold to-transparent"
            initial={{ scaleX: reduce ? 1 : 0, opacity: 0.8 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.3 + i * 0.12, ease: EASE }}
          />
          {/* soft glow that blooms on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-gold/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />

          {s.wide && <GrowthLine id={`impact-${i}`} />}

          <div className={`relative ${s.wide ? "flex items-end justify-between gap-4 h-full" : ""}`}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
                  <s.icon className="w-4 h-4" />
                </span>
                <span className="text-xs sm:text-sm uppercase tracking-[0.16em] text-cream/60">{s.label}</span>
              </div>
              <div
                className={`font-extrabold leading-none ${s.wide ? "text-5xl sm:text-6xl" : "text-4xl sm:text-5xl"}`}
                style={{ fontFamily: "var(--font-display)" }}
              >
                <RollingNumber value={s.value} digitClassName="text-gradient-gold" delay={0.25 + i * 0.12} />
              </div>
              {s.note && <p className="mt-3 text-sm text-cream/55 max-w-[16rem] hidden sm:block">{s.note}</p>}
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
