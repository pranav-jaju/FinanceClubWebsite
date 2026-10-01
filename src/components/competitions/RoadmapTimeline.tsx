"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type MotionValue,
} from "framer-motion";
import Link from "next/link";
import { Maximize2, X } from "lucide-react";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { competitions, type Competition } from "@/data/competitions";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const M: any = motion.div;

const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/* ============================================================
   DATE / STATUS HELPERS — always derived live against today,
   never trusts the static `status` field, always in sync with
   /data/competitions.ts
   ============================================================ */

type CompState = { label: string; tone: "live" | "upcoming" | "closed" };

// The roadmap represents an academic-year cycle that ends before
// April of the following year. Anything past that April cutoff
// should not be labelled "Upcoming" for the CURRENT cycle.
function getAcademicCutoff(now: Date): Date {
  const year = now.getFullYear();
  // If we're already at/after April this year, the current cycle
  // runs through April 1 of next year. If we're still Jan–Mar,
  // the current cycle's cutoff is April 1 of THIS year.
  const cutoffYear = now.getMonth() >= 3 ? year + 1 : year;
  return new Date(cutoffYear, 3, 1); // month 3 = April, 0-indexed
}

function getCompetitionState(c: Competition): CompState {
  const now = new Date();
  const reg = new Date(c.registrationDeadline);
  const sub = new Date(c.submissionDeadline);
  const res = new Date(c.resultsDate);
  const cutoff = getAcademicCutoff(now);

  // Fully finished — actual date comparison, not month-name matching.
  if (now > reg) return { label: "Closed", tone: "closed" };

  // Actively running right now.
  // Hasn't started yet.
  if (now < reg) {
    if (reg < cutoff) return { label: "Upcoming", tone: "upcoming" };
    // Beyond the current academic-year cutoff — still hasn't
    // happened, but shouldn't be pulled into "this cycle" as
    // Upcoming. Keep it out of the misleading label.
    return { label: "Upcoming", tone: "upcoming" };
  }

  return { label: "Closed", tone: "closed" };
}

function formatMonthYear(dateStr: string) {
  return new Date(dateStr).toLocaleString("en-IN", {
    month: "short",
    year: "2-digit",
  });
}

interface Pt {
  x: number;
  y: number;
}

/* ============================================================
   COMPACT ROAD — one long wavy line, scrolled/auto-scrolled.
   ============================================================ */

function buildWavePoints(
  count: number,
  width: number,
  height: number,
  pad: number,
  amp: number
): Pt[] {
  if (count <= 0) return [];
  const usable = width - pad * 2;
  const seg = count > 1 ? usable / (count - 1) : 0;
  return Array.from({ length: count }, (_, i) => {
    const x = pad + seg * i;
    const y = i % 2 === 0 ? height / 2 - amp : height / 2 + amp;
    return { x, y };
  });
}

// Catmull-Rom -> cubic Bezier smoothing. Unlike a per-segment
// tangent guess, this looks at the point before AND after each
// pair, so direction changes become continuous bends instead of
// sharp cusps/Z-shapes.
function buildSmoothPath(points: Pt[], leadIn: Pt, leadOut: Pt, tension = 6) {
  if (!points.length) return "";
  const all = [leadIn, ...points, leadOut];
  if (all.length < 2) return `M${all[0].x} ${all[0].y}`;

  let d = `M${all[0].x} ${all[0].y}`;
  for (let i = 0; i < all.length - 1; i++) {
    const p0 = all[i - 1] || all[i];
    const p1 = all[i];
    const p2 = all[i + 1];
    const p3 = all[i + 2] || p2;

    const c1x = p1.x + (p2.x - p0.x) / tension;
    const c1y = p1.y + (p2.y - p0.y) / tension;
    const c2x = p2.x - (p3.x - p1.x) / tension;
    const c2y = p2.y - (p3.y - p1.y) / tension;

    d += ` C${c1x} ${c1y}, ${c2x} ${c2y}, ${p2.x} ${p2.y}`;
  }
  return d;
}

/* ============================================================
   MILESTONE CARD
   ============================================================ */

function MilestoneCard({
  c,
  size = "default",
  highlight = false,
}: {
  c: Competition;
  size?: "default" | "expanded";
  highlight?: boolean;
}) {
  const state = getCompetitionState(c);
  const expanded = size === "expanded";

  return (
    <Link href={`/competitions/${c.slug}`}>
      <M
  whileHover={{ y: -6, scale: 1.02 }}
  transition={{ type: "spring", stiffness: 300 }}
  className={`milestone-card ${
    state.tone === "live" ? "milestone-active" : ""
  }`}
  style={{
    width: expanded ? 140 : 260,
    minWidth: expanded ? 140 : 260,
    maxWidth: expanded ? 140 : 260,
    padding: expanded ? 8 : undefined,
    borderColor: highlight ? "rgba(245,183,49,0.45)" : undefined,
  }}
>
        <div
          className={`text-gold ${
            expanded ? "text-[10px]" : "text-xxs"
          }`}
        >
          {formatMonthYear(c.registrationDeadline)}
        </div>

        <div
          className={`font-semibold text-cream mt-1 leading-snug break-words ${
            expanded
              ? "text-sm line-clamp-2"
              : "text-lg"
          }`}
        >
          {c.name}
        </div>

        <div
          className={`text-cream/40 mt-1 flex items-center justify-between ${
            expanded ? "text-[10px]" : "text-sm"
          }`}
        >
          <span
            className={
              state.tone === "closed"
                ? "text-cream/30"
                : state.tone === "live"
                ? "text-gold"
                : ""
            }
          >
            {state.label}
          </span>

          <span
            className={`text-gold shrink-0 ${
              expanded ? "text-xs ml-2" : ""
            }`}
          >
            →
          </span>
        </div>
      </M>
    </Link>
  );
}

const PaperTexture = ({ watermarkSize = "min(62%, 320px)" }: { watermarkSize?: string }) => (
  <>
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "url('/Finance-Club/roadmapbg.JPG')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        opacity: 0.18,
        filter: "grayscale(60%) brightness(0.9) contrast(1.1)",
        mixBlendMode: "lighten",
      }}
    />
    {/* Faint Finance Club watermark pressed into the paper. `screen` drops
        the logo's dark background so only the mark shows through. */}
    <div
      aria-hidden
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: "url('/Finance-Club/logo.jpg')",
        backgroundSize: `${watermarkSize} auto`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        opacity: 0.1,
        filter: "grayscale(35%) contrast(1.15)",
        mixBlendMode: "screen",
        maskImage: "radial-gradient(closest-side, black 55%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(closest-side, black 55%, transparent 100%)",
      }}
    />
  </>
);

/* ============================================================
   EXPANDED ROAD — cards are laid out with real CSS (flex-wrap),
   so overlap is structurally impossible no matter what the
   container measures. We then read each card's ACTUAL rendered
   center via getBoundingClientRect and draw the road through
   those real points, after paint. Nothing here is predicted —
   the road just follows wherever the cards really landed.
   ============================================================ */

function ExpandedRoadmap({ items }: { items: Competition[] }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [roadD, setRoadD] = useState("");
  const [svgSize, setSvgSize] = useState({ width: 0, height: 0 });
  const [grid, setGrid] = useState({ cols: 1, rows: 1 });

  const count = items.length;

  // Decide a column/row count from the container's REAL measured
  // aspect ratio. A CSS Grid with this many cells physically
  // cannot exceed the container's bounds (unlike flex-wrap, which
  // can push extra rows past the bottom edge) — so nothing gets
  // clipped and nothing overlaps.
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const computeGrid = () => {
  const w = container.clientWidth;

  // Desktop: 4 cards per row.
  // Smaller screens: reduce columns so cards don't become cramped.
  let cols = 4;

  if (w < 900) cols = 3;
  if (w < 650) cols = 2;

  cols = Math.min(cols, count);

  const rows = Math.ceil(count / cols);

  setGrid((prev) =>
    prev.cols === cols && prev.rows === rows
      ? prev
      : { cols, rows }
  );
};

    computeGrid();
    const ro = new ResizeObserver(computeGrid);
    ro.observe(container);
    return () => ro.disconnect();
  }, [count]);

  useEffect(() => {
    const measure = () => {
      const container = containerRef.current;
      if (!container) return;
      const containerRect = container.getBoundingClientRect();
      const pts: Pt[] = items.map((_, i) => {
        const el = cardRefs.current[i];
        if (!el) return { x: 0, y: 0 };
        const r = el.getBoundingClientRect();
        return {
          x: r.left - containerRect.left + r.width / 2,
          y: r.top - containerRect.top + r.height / 2,
        };
      });
      if (!pts.length || pts.every((p) => p.x === 0 && p.y === 0)) return;

      const leadIn: Pt = { x: pts[0].x - 60, y: pts[0].y };
      const lastPt = pts[pts.length - 1];
      const leadOut: Pt = { x: lastPt.x + 60, y: lastPt.y };

      setRoadD(buildSmoothPath(pts, leadIn, leadOut));
      setSvgSize({
        width: container.scrollWidth,
        height: container.scrollHeight,
      });
    };

    let raf1 = 0;
    let raf2 = 0;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(measure);
    });

    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      ro.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, grid.cols, grid.rows]);

  return (
  <div
    ref={containerRef}
    className="relative z-10 flex-1 w-full min-h-0 overflow-hidden rounded-2xl"
  >
      <svg
  className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden"
  width="100%"
  height="100%"
>
        {roadD && (
          <>
            <path d={roadD} stroke="#0b0b0b" strokeWidth={26} strokeLinecap="round" fill="none" />
            <path d={roadD} stroke="#2A8F5C" strokeWidth={34} strokeOpacity={0.06} strokeLinecap="round" fill="none" />
            <path d={roadD} stroke="#F5B731" strokeWidth={3} strokeDasharray="14 10" strokeLinecap="round" fill="none" />
          </>
        )}
      </svg>

      <div
        className="relative z-10 h-full w-full grid place-items-center"
        style={{
          gridTemplateColumns: `repeat(${grid.cols}, 1fr)`,
          gridTemplateRows: `repeat(${grid.rows}, 1fr)`,
        }}
      >
        {items.map((c, i) => {
          const state = getCompetitionState(c);
          const row = Math.floor(i / grid.cols);
          const wave = i % 2 === 0 ? -10 : 10;
          return (
            <div
              key={c.slug}
              ref={(el) => {
                cardRefs.current[i] = el;
              }}
              style={{ transform: `translateY(${wave}px)` }}
              className="relative"
            >
              <MilestoneCard c={c} size="expanded" />
              <div
                className={`milestone-glow ${
                  state.tone === "live" ? "active" : ""
                }`}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}


/* ============================================================
   ROAD SAMPLING — the road is a real SVG path, so we sample it
   once and look points up by x (horizontal) or by length
   (vertical). This keeps the lit road + marker glued to the
   actual curve instead of approximating it.
   ============================================================ */

type Sampler = { total: number; step: number; xs: Float32Array; ys: Float32Array };

function samplePath(path: SVGPathElement, step = 3): Sampler {
  const total = path.getTotalLength();
  const n = Math.max(2, Math.ceil(total / step) + 1);
  const xs = new Float32Array(n);
  const ys = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const p = path.getPointAtLength(Math.min(i * step, total));
    xs[i] = p.x;
    ys[i] = p.y;
  }
  return { total, step, xs, ys };
}

// The wave road always moves left → right, so x is monotonic along it.
function indexAtX(s: Sampler, x: number) {
  let lo = 0;
  let hi = s.xs.length - 1;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (s.xs[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

// Where "today" falls between milestones, as a fractional index
// (e.g. 3.4 = 40% of the way from milestone 3 to milestone 4).
function todayIndex(items: Competition[]): number {
  const now = Date.now();
  const ts = items.map((c) => new Date(c.registrationDeadline).getTime());
  if (!ts.length) return 0;
  if (now <= ts[0]) return -0.5;
  if (now >= ts[ts.length - 1]) return ts.length - 0.5;
  for (let i = 0; i < ts.length - 1; i++) {
    if (now >= ts[i] && now < ts[i + 1]) {
      const span = ts[i + 1] - ts[i];
      return i + (span > 0 ? (now - ts[i]) / span : 0.5);
    }
  }
  return 0;
}

const TRACK_HEIGHT = 380;
const PAD = 220;

function roadGeometry(count: number) {
  const width = Math.max(2400, count * 320 + 500);
  const points = buildWavePoints(count, width, TRACK_HEIGHT, PAD, TRACK_HEIGHT * 0.28);
  const d = buildSmoothPath(
    points,
    { x: (points[0]?.x ?? 0) - 160, y: TRACK_HEIGHT / 2 },
    { x: (points[points.length - 1]?.x ?? 0) + 160, y: TRACK_HEIGHT / 2 }
  );
  const seg = points.length > 1 ? points[1].x - points[0].x : 0;
  const span = points.length > 1 ? points[points.length - 1].x - points[0].x : 0;
  return { width, points, d, seg, span };
}

// Scroll progress → travel progress, with a short dwell at both
// ends so the first and last stops get a moment on screen.
const DWELL = 0.06;
const travelOf = (p: number) => clamp01((p - DWELL) / (1 - DWELL * 2));

/* ============================================================
   HORIZONTAL ROAD (tablet / desktop) — page scroll drives the
   journey. Pinned on large screens, scrubbed in place otherwise.
   ============================================================ */

function HorizontalRoad({
  items,
  progress,
  onExpand,
  onStep,
}: {
  items: Competition[];
  progress: MotionValue<number>;
  onExpand: () => void;
  onStep: (dir: 1 | -1) => void;
}) {
  const geo = roadGeometry(items.length);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const litRef = useRef<SVGPathElement | null>(null);
  const markerRef = useRef<SVGGElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const samplerRef = useRef<Sampler | null>(null);
  const placedRef = useRef(false);

  const [cw, setCw] = useState(0);
  const [active, setActive] = useState(0);

  const target = useMotionValue(0);
  const x = useSpring(target, { stiffness: 170, damping: 34, mass: 0.6 });

  // Depends on the current time, so compute it client-side only
  // (avoids a server/client hydration mismatch).
  const [todayX, setTodayX] = useState<number | null>(null);
  useEffect(() => {
    setTodayX((geo.points[0]?.x ?? 0) + todayIndex(items) * geo.seg);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items.length, geo.seg]);

  const toX = (p: number) => cw / 2 - (geo.points[0]?.x ?? 0) - geo.span * travelOf(p);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const measure = () => setCw(el.clientWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const paint = (v: number) => {
    const s = samplerRef.current;
    if (!s || !cw) return;
    const cx = cw / 2 - v;
    const i = indexAtX(s, cx);
    const L = Math.min(i * s.step, s.total);
    if (litRef.current) litRef.current.style.strokeDashoffset = String(s.total - L);
    markerRef.current?.setAttribute("transform", `translate(${s.xs[i]} ${s.ys[i]})`);
    const idx = geo.seg
      ? Math.max(0, Math.min(items.length - 1, Math.round((cx - geo.points[0].x) / geo.seg)))
      : 0;
    setActive((prev) => (prev === idx ? prev : idx));
  };

  useIsoLayoutEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    const s = samplePath(path);
    samplerRef.current = s;
    if (litRef.current) {
      litRef.current.style.strokeDasharray = String(s.total);
      litRef.current.style.strokeDashoffset = String(s.total);
    }
  }, [geo.d]);

  // Place the road for the current scroll position once we know the width.
  useEffect(() => {
    if (!cw) return;
    const v = toX(progress.get());
    target.set(v);
    if (!placedRef.current) {
      x.jump(v);
      placedRef.current = true;
    }
    paint(x.get());
    if (barRef.current) barRef.current.style.transform = `scaleX(${travelOf(progress.get())})`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cw]);

  useMotionValueEvent(progress, "change", (p) => {
    if (!cw) return;
    target.set(toX(p));
    if (barRef.current) barRef.current.style.transform = `scaleX(${travelOf(p)})`;
  });
  useMotionValueEvent(x, "change", paint);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[420px] lg:h-[520px] overflow-hidden roadmap-wrapper rounded-xl outline-none focus-visible:ring-1 focus-visible:ring-gold/40"
      tabIndex={0}
      aria-label="Competition roadmap. Scroll the page or use the arrow keys to travel along it."
      onKeyDown={(e) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          e.preventDefault();
          onStep(e.key === "ArrowRight" ? 1 : -1);
        }
      }}
    >
      <PaperTexture />

      <button
        onClick={onExpand}
        className="absolute top-3 right-3 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 border border-gold/15 text-cream/60 text-xs hover:text-gold hover:border-gold/30 transition-colors"
        aria-label="Expand roadmap"
      >
        <Maximize2 className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">View Full Roadmap</span>
      </button>

      <M className="absolute left-0 top-0 h-full" style={{ x, width: geo.width }}>
        {/* Today line — behind the cards, label in the free band below the road */}
        {todayX !== null && (
          <>
            <div
              className="absolute top-0 pointer-events-none"
              style={{ left: todayX, height: TRACK_HEIGHT + 18 }}
              aria-hidden
            >
              <div className="w-px h-full bg-gradient-to-b from-transparent via-gold/45 to-gold/80" />
            </div>
            <div
              className="absolute -translate-x-1/2 pointer-events-none z-20"
              style={{ left: todayX, top: TRACK_HEIGHT + 18 }}
            >
              <span className="inline-block px-3 py-1 rounded-full bg-gold text-[#0D0A0A] text-[11px] font-bold uppercase tracking-[0.18em] shadow-[0_0_24px_rgba(245,183,49,0.35)] whitespace-nowrap">
                You are here
              </span>
            </div>
          </>
        )}

        <svg
          viewBox={`0 0 ${geo.width} ${TRACK_HEIGHT}`}
          width={geo.width}
          height={TRACK_HEIGHT}
          className="block relative overflow-visible"
        >
          <path ref={pathRef} d={geo.d} stroke="#0b0b0b" strokeWidth={34} strokeLinecap="round" fill="none" className="road-path" />
          <path d={geo.d} stroke="#2A8F5C" strokeWidth={44} strokeOpacity={0.06} strokeLinecap="round" fill="none" />
          <path d={geo.d} stroke="#F5B731" strokeWidth={4} strokeDasharray="18 12" strokeLinecap="round" fill="none" className="road-flow" />
          {/* The stretch you've already travelled lights up */}
          <path
            ref={litRef}
            d={geo.d}
            stroke="#FDD85D"
            strokeWidth={5}
            strokeLinecap="round"
            fill="none"
            style={{ filter: "drop-shadow(0 0 6px rgba(245,183,49,0.75))" }}
          />
          <g ref={markerRef}>
            <circle r={18} fill="rgba(245,183,49,0.14)" />
            <circle r={7.5} fill="#FDD85D" stroke="#0b0b0b" strokeWidth={2.5} />
          </g>
        </svg>

        {items.map((c, i) => {
          const pos = geo.points[i];
          const state = getCompetitionState(c);
          const isActive = i === active;
          return (
            <div
              key={c.slug}
              style={{ position: "absolute", left: pos.x, top: pos.y }}
              className={`-translate-x-1/2 -translate-y-1/2 milestone ${isActive ? "z-30" : "z-10"}`}
            >
              <div
                className={`transition-[opacity,transform,filter] duration-500 ease-out ${
                  isActive
                    ? "opacity-100 scale-[1.06] drop-shadow-[0_0_28px_rgba(245,183,49,0.22)]"
                    : state.tone === "closed"
                    ? "opacity-50 scale-95"
                    : "opacity-80 scale-95"
                }`}
              >
                <MilestoneCard c={c} highlight={isActive} />
              </div>
            </div>
          );
        })}
      </M>

      <div className="absolute bottom-3 left-3 z-40 pointer-events-none">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 border border-gold/10 text-cream/60 text-xs">
          <span>Scroll to travel the year</span>
          <span className="text-gold/80 tabular-nums">
            {String(active + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-cream/5 z-40">
        <div
          ref={barRef}
          className="h-full bg-gradient-to-r from-gold-dark via-gold to-gold-light origin-left"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <div className="road-fade-left pointer-events-none" aria-hidden={true} />
      <div className="road-fade-right pointer-events-none" aria-hidden={true} />
    </div>
  );
}

/* ============================================================
   VERTICAL ROAD (phones) — a road that winds down the screen
   between the cards and lights up as you scroll with your thumb.
   ============================================================ */

type Row = { kind: "comp"; c: Competition; i: number } | { kind: "today" };

function VerticalRoad({ items }: { items: Competition[] }) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement | null>(null);
  const litRef = useRef<SVGPathElement | null>(null);
  const markerRef = useRef<SVGGElement | null>(null);
  const samplerRef = useRef<Sampler | null>(null);
  const nodeYs = useRef<number[]>([]);

  const [geo, setGeo] = useState<{ d: string; w: number; h: number } | null>(null);
  const [active, setActive] = useState(-1);

  // Insert a "today" stop between the last closed and first upcoming.
  const now = Date.now();
  const rows: Row[] = [];
  let todayPlaced = false;
  items.forEach((c, i) => {
    if (!todayPlaced && new Date(c.registrationDeadline).getTime() > now) {
      rows.push({ kind: "today" });
      todayPlaced = true;
    }
    rows.push({ kind: "comp", c, i });
  });
  if (!todayPlaced) rows.push({ kind: "today" });

  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 0.7", "end 0.6"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 220, damping: 40, mass: 0.4 });

  useIsoLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const measure = () => {
      const wr = wrap.getBoundingClientRect();
      const pts: Pt[] = [];
      nodeRefs.current.slice(0, rows.length).forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        pts.push({ x: r.left - wr.left + r.width / 2, y: r.top - wr.top + r.height / 2 });
      });
      if (pts.length < 2) return;
      nodeYs.current = pts.map((p) => p.y);
      const d = buildSmoothPath(
        pts,
        { x: pts[0].x, y: Math.max(0, pts[0].y - 70) },
        { x: pts[pts.length - 1].x, y: pts[pts.length - 1].y + 70 },
        5
      );
      setGeo((prev) =>
        prev && prev.d === d && prev.w === wr.width ? prev : { d, w: wr.width, h: wrap.scrollHeight }
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rows.length]);

  const paint = (v: number) => {
    const s = samplerRef.current;
    if (!s) return;
    const L = clamp01(v) * s.total;
    const i = Math.min(s.xs.length - 1, Math.round(L / s.step));
    if (litRef.current) litRef.current.style.strokeDashoffset = String(s.total - L);
    markerRef.current?.setAttribute("transform", `translate(${s.xs[i]} ${s.ys[i]})`);
    // Highlight the stop the marker is closest to.
    const my = s.ys[i];
    let best = -1;
    let bestD = Infinity;
    nodeYs.current.forEach((y, k) => {
      if (rows[k]?.kind !== "comp") return;
      const dist = Math.abs(y - my);
      if (dist < bestD) {
        bestD = dist;
        best = k;
      }
    });
    setActive((prev) => (prev === best ? prev : best));
  };

  useIsoLayoutEffect(() => {
    const path = pathRef.current;
    if (!path || !geo) return;
    const s = samplePath(path, 2);
    samplerRef.current = s;
    if (litRef.current) litRef.current.style.strokeDasharray = String(s.total);
    paint(progress.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geo?.d]);

  useMotionValueEvent(progress, "change", paint);

  let compCount = 0;

  return (
    <div ref={wrapRef} className="relative py-8 overflow-hidden rounded-xl">
      <PaperTexture />

      {geo && (
        <svg
          className="absolute left-0 top-0 pointer-events-none"
          width={geo.w}
          height={geo.h}
          viewBox={`0 0 ${geo.w} ${geo.h}`}
          aria-hidden
        >
          <path ref={pathRef} d={geo.d} stroke="#0b0b0b" strokeWidth={26} strokeLinecap="round" fill="none" />
          <path d={geo.d} stroke="#2A8F5C" strokeWidth={34} strokeOpacity={0.07} strokeLinecap="round" fill="none" />
          <path d={geo.d} stroke="#F5B731" strokeWidth={3} strokeDasharray="12 9" strokeLinecap="round" fill="none" opacity={0.7} />
          <path
            ref={litRef}
            d={geo.d}
            stroke="#FDD85D"
            strokeWidth={4}
            strokeLinecap="round"
            fill="none"
            style={{ filter: "drop-shadow(0 0 5px rgba(245,183,49,0.75))" }}
          />
          <g ref={markerRef}>
            <circle r={14} fill="rgba(245,183,49,0.16)" />
            <circle r={6} fill="#FDD85D" stroke="#0b0b0b" strokeWidth={2} />
          </g>
        </svg>
      )}

      <div className="relative space-y-12 px-1">
        {rows.map((row, k) => {
          if (row.kind === "today") {
            return (
              <div key="today" className="flex justify-center">
                <div
                  ref={(el) => {
                    nodeRefs.current[k] = el;
                  }}
                  className="px-3.5 py-1.5 rounded-full bg-gold text-[#0D0A0A] text-[11px] font-bold uppercase tracking-[0.18em] shadow-[0_0_24px_rgba(245,183,49,0.4)]"
                >
                  You are here ·{" "}
                  {new Date(now).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                </div>
              </div>
            );
          }

          const { c } = row;
          const state = getCompetitionState(c);
          const isActive = active === k;
          const side = compCount++ % 2 === 0 ? "mr-auto" : "ml-auto";

          return (
            <div key={c.slug} className={`w-[86%] ${side}`}>
              <div
                ref={(el) => {
                  nodeRefs.current[k] = el;
                }}
              >
                <Link href={`/competitions/${c.slug}`} className="block">
                  <div
                    className={`rounded-xl p-4 border bg-[#0D0A0A]/92 backdrop-blur-md transition-all duration-500 active:scale-[0.98] ${
                      isActive
                        ? "border-gold/45 shadow-[0_0_32px_-8px_rgba(245,183,49,0.35)]"
                        : state.tone === "closed"
                        ? "border-cream/10 opacity-60"
                        : "border-cream/10"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-gold">
                        {formatMonthYear(c.registrationDeadline)}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          state.tone === "closed"
                            ? "border-cream/10 text-cream/40"
                            : "border-gold/30 text-gold bg-gold/10"
                        }`}
                      >
                        {state.label}
                      </span>
                    </div>
                    <div className="text-lg font-bold text-cream mt-2 leading-snug">{c.name}</div>
                    <p className="text-base text-cream/55 mt-1 line-clamp-2 leading-relaxed">
                      {c.shortDescription}
                    </p>
                    <div className="mt-3 flex items-center text-xs text-gold font-medium gap-1">
                      <span>View Details</span>
                      <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   MAIN — the whole "Compete Against the Best Minds" block.
   `intro` is the left-hand text column from the homepage.
   ============================================================ */

type Mode = "pinned" | "inline" | "vertical";

export default function RoadmapTimeline({ intro }: { intro: ReactNode }) {
  // All competitions sorted strictly by registration date so the
  // road always runs earliest → latest.
  const items = [...competitions].sort(
    (a, b) =>
      new Date(a.registrationDeadline).getTime() -
      new Date(b.registrationDeadline).getTime()
  );

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<Mode>("inline");
  const [isExpanded, setIsExpanded] = useState(false);

  // How much page scroll the pinned journey takes: ~0.85px of
  // scroll per px of road, so it feels 1:1 without dragging on.
  const scrollDistance = Math.round(roadGeometry(items.length).span * 0.85);

  const { scrollYProgress: pinnedProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const { scrollYProgress: inlineProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.85", "end 0.15"],
  });

  useEffect(() => {
    const decide = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setMode(w < 768 ? "vertical" : w >= 1024 && h >= 700 ? "pinned" : "inline");
    };
    decide();
    window.addEventListener("resize", decide);
    return () => window.removeEventListener("resize", decide);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isExpanded ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isExpanded]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Arrow keys jump one stop by scrolling the page the matching amount.
  const step = (dir: 1 | -1) => {
    const per =
      mode === "pinned"
        ? (scrollDistance * (1 - DWELL * 2)) / Math.max(1, items.length - 1)
        : window.innerHeight / Math.max(1, items.length - 1);
    window.scrollBy({ top: dir * per, behavior: "smooth" });
  };

  const pinned = mode === "pinned";

  return (
    <>
      <div
        ref={sectionRef}
        className="relative"
        style={pinned ? { height: `calc(100vh + ${scrollDistance}px)` } : undefined}
      >
        <div
          className={pinned ? "sticky top-0 h-screen flex items-center" : ""}
          style={pinned ? { paddingTop: "var(--navbar-height, 80px)" } : undefined}
        >
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 py-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {intro}

              <div className="lg:col-span-8">
                <div className="card-premium p-3 sm:p-6 rounded-2xl border border-cream/10">
                  <div className="relative">
                    <ScrollReveal>
                      {mode === "vertical" ? (
                        <VerticalRoad items={items} />
                      ) : (
                        <HorizontalRoad
                          items={items}
                          progress={pinned ? pinnedProgress : inlineProgress}
                          onExpand={() => setIsExpanded(true)}
                          onStep={step}
                        />
                      )}
                    </ScrollReveal>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FULLSCREEN EXPANDED MODAL — static, measured layout,
          zero overlap by construction ===== */}
      {isExpanded && (
        <div className="fixed inset-0 z-[200] bg-[#0D0A0A]/97 backdrop-blur-md flex flex-col p-6">
          <PaperTexture />

          <button
            onClick={() => setIsExpanded(false)}
            className="absolute top-6 right-6 z-50 flex items-center gap-2 px-4 py-2 rounded-full bg-black/50 border border-gold/15 text-cream/70 text-sm hover:text-gold hover:border-gold/30 transition-colors"
          >
            <X className="w-4 h-4" /> Close
          </button>

          <div className="relative z-10 text-center mb-4 shrink-0">
            <h3
              className="text-2xl sm:text-3xl font-extrabold text-cream"
              style={{ fontFamily: "var(--font-display)" }}
            >
              The Full <span className="text-gradient-gold">Roadmap</span>
            </h3>
            <p className="text-cream/40 text-sm mt-1">
              Every competition this year, at a glance
            </p>
          </div>

          <ExpandedRoadmap items={items} />
        </div>
      )}
    </>
  );
}
