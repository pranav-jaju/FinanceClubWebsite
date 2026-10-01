"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  Trophy,
  Users,
  Lightbulb,
  BookOpen,
  BarChart3,
  Award,
} from "lucide-react";

const SECTORS = [
  {
    icon: Trophy,
    title: "Competitions",
    desc: "Flagship events like ERC and FinSearch testing real-world finance skills against top institutions.",
    image: "/Finance-Club/partner_1.png",
    imageScale: 1,
    imageX: 0,
    imageY: 0,
  },
  {
    icon: Users,
    title: "Sessions & Bootcamps",
    desc: "Intensive workshops on financial modeling, valuation and trading strategies.",
    image: "/Finance-Club/partner_2.jpeg",
    imageScale: 1.1,
    imageX: 0,
    imageY: -5,
  },
  {
    icon: Lightbulb,
    title: "Research",
    desc: "Deep-dive initiatives covering equity, macro and alternative investment analysis.",
    image: "/Finance-Club/partner_3.jpeg",
    imageScale: 1.1,
    imageX: 5,
    imageY: 35,
  },
  {
    icon: BookOpen,
    title: "Publications",
    desc: "Market reports, sector analysis and curated primers for every finance domain.",
    image: "/Finance-Club/partner_4.jpeg",
    imageScale: 1.08,
    imageX: 0,
    imageY: -5,
  },
  {
    icon: BarChart3,
    title: "Industry Connect",
    desc: "Guest lectures and sessions with professionals from leading financial firms.",
    image: "/Finance-Club/partner_5.jpeg",
    imageScale: 1.05,
    imageX: 0,
    imageY: -5,
  },
  {
    icon: Award,
    title: "Career Prep",
    desc: "Mock interviews, case studies and placement guidance for finance roles.",
    image: "/Finance-Club/partner_6.jpeg",
    imageScale: 1.55,
    imageX: 0,
    imageY: -22,
  },
];

const SECTOR_COUNT = SECTORS.length;
const ANGLE_STEP = 360 / SECTOR_COUNT;
const START_OFFSET = -90;
// Centre hub diameter as a fraction of the wheel diameter (hub is 16% wide).
const HUB_RATIO = 0.16;

function polar(radiusPct: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;

  const round = (v: number) => Math.round(v * 1000) / 1000;
  return {
    left: round(50 + radiusPct * Math.cos(rad)),
    top: round(50 + radiusPct * Math.sin(rad)),
  };
}

function wedgeClipPath(startAngle: number, endAngle: number) {
  const REACH = 62;

  const p1 = polar(REACH, startAngle);
  const mid = polar(REACH, (startAngle + endAngle) / 2);
  const p2 = polar(REACH, endAngle);

  return `polygon(50% 50%, ${p1.left}% ${p1.top}%, ${mid.left}% ${mid.top}%, ${p2.left}% ${p2.top}%)`;
}

// Shortest signed angle from a to b, in degrees.
function shortestDelta(from: number, to: number) {
  return ((((to - from) % 360) + 540) % 360) - 180;
}

const bisectorOf = (i: number) => START_OFFSET + i * ANGLE_STEP + ANGLE_STEP / 2;

export default function FinanceWheel() {
  const reduce = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const inView = useInView(containerRef, { once: true, amount: 0.35 });

  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [selected, setSelected] = useState<number | null>(null);

  // Wheel rotation: starts wound back, spins into place when it scrolls
  // into view, then turns the selected sector to the top.
  const rotTarget = useMotionValue(reduce ? 0 : -150);
  const rotation = useSpring(rotTarget, { stiffness: 55, damping: 16, mass: 1 });
  const counterRotation = useTransform(rotation, (v) => -v);

  useEffect(() => {
    if (inView) rotTarget.set(0);
  }, [inView, rotTarget]);

  const select = (i: number | null) => {
    setSelected(i);
    if (i === null) return;
    const goal = -90 - bisectorOf(i);
    const cur = rotTarget.get();
    rotTarget.set(cur + shortestDelta(cur, goal));
  };

  // Desktop hover: work out the sector from the pointer's angle around the
  // centre (minus the wheel's current rotation). Per-wedge mouseenter/leave
  // flickered at wedge edges.
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const radius = rect.width / 2;
    const dist = Math.hypot(dx, dy);
    const hubRadius = radius * (selected !== null ? 0.4 : HUB_RATIO);

    if (dist > radius || dist < hubRadius) {
      setHoverIndex(null);
      return;
    }

    const angle = (Math.atan2(dy, dx) * 180) / Math.PI - rotation.get();
    const normalized = (((angle - START_OFFSET) % 360) + 360) % 360;
    const next = Math.floor(normalized / ANGLE_STEP) % SECTOR_COUNT;
    setHoverIndex((prev) => (prev === next ? prev : next));
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    const radius = rect.width / 2;
    const dist = Math.hypot(dx, dy);
    if (dist > radius) return;
    // Clicking the centre closes the description.
    if (dist < radius * (selected !== null ? 0.4 : HUB_RATIO)) {
      select(null);
      return;
    }
    const angle = (Math.atan2(dy, dx) * 180) / Math.PI - rotation.get();
    const normalized = (((angle - START_OFFSET) % 360) + 360) % 360;
    const i = Math.floor(normalized / ANGLE_STEP) % SECTOR_COUNT;
    select(selected === i ? null : i);
  };

  // Close when clicking/tapping outside the wheel.
  useEffect(() => {
    if (selected === null) return;
    const onDown = (e: PointerEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setSelected(null);
      }
    };
    document.addEventListener("pointerdown", onDown);
    return () => document.removeEventListener("pointerdown", onDown);
  }, [selected]);

  const highlighted = hoverIndex ?? selected;
  const sel = selected !== null ? SECTORS[selected] : null;

  return (
    <div className="mx-auto">
      <motion.div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setHoverIndex(null)}
        onClick={handleClick}
        initial={reduce ? false : { opacity: 0, scale: 0.88 }}
        animate={inView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        className="relative mx-auto cursor-pointer select-none w-[88vw] h-[88vw] max-w-[320px] max-h-[320px] sm:w-[460px] sm:h-[460px] sm:max-w-none sm:max-h-none lg:w-[620px] lg:h-[620px]"
        role="group"
        aria-label="What we do. Select a sector to read what it covers."
      >
        {/* =========================================================
            ROTATING WHEEL
        ========================================================= */}
        <motion.div
          className="absolute inset-0 rounded-full overflow-hidden border-2 border-gold/25 shadow-[0_0_60px_-10px_rgba(245,183,49,0.25)]"
          style={{ rotate: rotation }}
        >
          {SECTORS.map((sector, i) => {
            const startAngle = START_OFFSET + i * ANGLE_STEP;
            const endAngle = startAngle + ANGLE_STEP;
            const isLit = highlighted === i;
            const dim = selected !== null && selected !== i && hoverIndex !== i;

            return (
              <div
                key={sector.title}
                className="absolute inset-0"
                style={{ clipPath: wedgeClipPath(startAngle, endAngle) }}
              >
                <Image
                  src={sector.image}
                  alt=""
                  fill
                  className="object-cover transition-transform duration-500 ease-out"
                  style={{
                    transform: `translate(${sector.imageX}%, ${sector.imageY}%) scale(${
                      isLit ? sector.imageScale + 0.08 : sector.imageScale
                    })`,
                  }}
                  sizes="(max-width: 640px) 320px, (max-width: 1024px) 460px, 620px"
                />
                <div
                  className={`absolute inset-0 transition-colors duration-300 ${
                    isLit ? "bg-black/30" : dim ? "bg-black/75" : "bg-black/62"
                  }`}
                />
              </div>
            );
          })}

          {/* Radial dividers */}
          {SECTORS.map((_, i) => (
            <div
              key={`divider-${i}`}
              className="absolute pointer-events-none"
              style={{
                left: "50%",
                top: "50%",
                width: "50%",
                height: "1.5px",
                background: "linear-gradient(to right, rgba(245,183,49,0.5), rgba(245,183,49,0.12))",
                transformOrigin: "0 50%",
                transform: `rotate(${START_OFFSET + i * ANGLE_STEP}deg)`,
              }}
            />
          ))}

          {/* Labels — ride with the wheel but counter-rotate to stay upright */}
          {SECTORS.map((sector, i) => {
            const labelPos = polar(30, bisectorOf(i));
            const isLit = highlighted === i;
            const dim = selected !== null && selected !== i && hoverIndex !== i;
            return (
              <motion.div
                key={`label-${sector.title}`}
                className="absolute flex flex-col items-center text-center pointer-events-none"
                style={{
                  left: `${labelPos.left}%`,
                  top: `${labelPos.top}%`,
                  width: "34%",
                  x: "-50%",
                  y: "-50%",
                  rotate: counterRotation,
                }}
                animate={{ opacity: dim ? 0.4 : 1 }}
                transition={{ duration: 0.3 }}
              >
                <sector.icon
                  className={`w-5 h-5 mb-1.5 transition-all duration-300 ${
                    isLit ? "text-gold-light scale-110" : "text-gold"
                  }`}
                />
                <span
                  className={`font-bold text-xs sm:text-lg lg:text-xl leading-tight whitespace-nowrap transition-colors duration-300 ${
                    isLit ? "text-gold-light" : "text-cream"
                  }`}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {sector.title}
                </span>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Pointer marking the "top" position the selected sector turns to */}
        <div className="absolute left-1/2 -top-3 -translate-x-1/2 z-30 pointer-events-none">
          <div
            className={`w-0 h-0 border-l-[9px] border-r-[9px] border-t-[12px] border-l-transparent border-r-transparent transition-colors duration-300 ${
              selected !== null ? "border-t-gold" : "border-t-gold/40"
            }`}
          />
        </div>

        {/* =========================================================
            CENTRE HUB — grows to show the selected sector
        ========================================================= */}
        <motion.div
          className="absolute left-1/2 top-1/2 z-40 rounded-full bg-[#0D0A0A] border border-gold/30 overflow-hidden shadow-[0_0_40px_-8px_rgba(0,0,0,0.9)]"
          style={{ x: "-50%", y: "-50%" }}
          animate={{
            width: sel ? "40%" : "16%",
            height: sel ? "40%" : "16%",
            borderColor: sel ? "rgba(245,183,49,0.55)" : "rgba(245,183,49,0.3)",
          }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          <AnimatePresence initial={false} mode="popLayout">
            {sel ? (
              <motion.div
                key={sel.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="absolute inset-0 flex flex-col items-center justify-center text-center px-[12%]"
              >
                <sel.icon className="w-5 h-5 sm:w-6 sm:h-6 text-gold mb-1.5" />
                <h4
                  className="font-bold text-gold text-[11px] sm:text-lg lg:text-xl leading-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {sel.title}
                </h4>
                <p className="hidden sm:block mt-2 text-[13px] lg:text-[15px] text-cream/80 leading-snug">
                  {sel.desc}
                </p>
              </motion.div>
            ) : (
              <motion.div
                key="logo"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0"
              >
                <Image src="/Finance-Club/logo.jpg" alt="Finance Club logo" fill className="object-cover" sizes="100px" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Phones: the hub is too small for the description, so show it below */}
      <div className="sm:hidden mt-6 min-h-[88px] px-2">
        <AnimatePresence mode="wait">
          {sel && (
            <motion.p
              key={sel.title}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="text-base text-cream/80 leading-relaxed text-center"
            >
              {sel.desc}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
