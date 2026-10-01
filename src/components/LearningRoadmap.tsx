"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import {
  TrendingUp,
  BarChart3,
  Briefcase,
  Award,
  BookOpen,
  ChevronDown,
  ExternalLink,
  FileText,
  Globe,
  PlayCircle,
} from "lucide-react";

interface ResourceItem {
  title: string;
  desc: string;
  url?: string;
  author?: string;
}

interface RoadmapSection {
  id: string;
  icon: typeof TrendingUp;
  /** The area itself, e.g. "Financial Modelling & Valuation". */
  label: string;
  /** What the student wants to do — the branch's headline. */
  goal: string;
  forYou: string;
  resources: ResourceItem[];
}

const SECTIONS: RoadmapSection[] = [
  {
    id: "fundamentals",
    icon: TrendingUp,
    label: "Market & Business Fundamentals",
    goal: "Understand markets",
    forYou: "For you if you're new to finance and want to follow markets and businesses with confidence.",
    resources: [
      {
        title: "Zerodha Varsity",
        desc: "The best free starting point for understanding Indian markets - stock market basics, fundamental and technical analysis, F&O, personal finance, and financial modelling, all in bite-sized modules with quizzes.",
        url: "https://zerodha.com/varsity/",
      },
      {
        title: "Zerodha Varsity — YouTube Modules",
        desc: "Video versions of the Varsity curriculum for those who prefer watching over reading.",
        url: "https://www.youtube.com/@varsitybyzerodha",
      },
      {
        title: "Zerodha YouTube — Daily Market Recaps",
        desc: "Good for building the habit of staying current with markets, not just learning theory.",
        url: "https://www.youtube.com/@varsitybyzerodha",
      },
      {
        title: "Think School",
        desc: "Not finance-technical, but essential for business understanding — real company case studies on why businesses win, fail, and how strategy plays out.",
        url: "https://www.youtube.com/@ThinkSchool",
      },
      {
        title: "The Economic Times",
        desc: "Works best as a daily habit rather than a one-time read. Just the front page and markets section every day is enough to start.",
        url: "https://economictimes.indiatimes.com/",
      },
    ],
  },
  {
    id: "modelling",
    icon: BarChart3,
    label: "Financial Modelling & Valuation",
    goal: "Build & value companies",
    forYou: "For you if you want to model a business and put a number on what it's worth.",
    resources: [
      {
        title: "The Valuation School — Channel",
        desc: "Financial modelling and valuation content, broken into structured playlists.",
        url: "https://www.youtube.com/@thevaluationschool",
      },
      {
        title: "The Valuation School — Playlists",
        desc: "Organized playlists covering modelling and valuation topic by topic.",
        url: "https://www.youtube.com/@thevaluationschool/playlists",
      },
      {
        title: "Aswath Damodaran — YouTube",
        desc: "Known as the Dean of Valuation, and probably the single most credible free resource out there.",
        url: "https://www.youtube.com/channel/UCLvnJL8htRR1T9cbSccaoVw",
      },
      {
        title: "Aswath Damodaran — Website",
        desc: "Datasets, slides, and spreadsheets covering both valuation and accounting fundamentals in real depth.",
        url: "https://pages.stern.nyu.edu/~adamodar/",
      },
    ],
  },
  {
    id: "placement",
    icon: Briefcase,
    label: "Placement Prep: Core Technicals",
    goal: "Crack finance interviews",
    forYou: "For you if IB, PE or finance placements are the goal.",
    resources: [
      {
        title: "Breaking Into Wall Street (BIWS)",
        desc: "Structured courses on 3-statement modelling, DCF, M&A, and LBO modelling — widely used as a self-study curriculum for IB and PE prep.",
        url: "https://breakingintowallstreet.com/",
      },
      {
        title: "The 400 Questions Guide",
        desc: "A free 200+ page guide covering fit and behavioral questions along with technicals across accounting, valuation, M&A, and LBOs (BIWS / Mergers & Inquisitions).",
        url: "https://drive.google.com/file/d/1D6XMGgc2oImIWcIcqR3IzFujub2qWJnP/view?usp=sharing",
      },
      {
        title: "500+ Real IB & PE Interview Questions",
        desc: "Over 500 real IB and PE interview questions and answers, organized by topic: accounting, valuation, M&A, LBO, industry-specific, and behavioral.",
        url: "https://drive.google.com/file/d/1tVln8KG927yBmsj58H_VnSCQ7ui_RtuI/view?usp=sharing",
      },
      {
        title: "3-Statement Analysis",
        desc: "Already covered inside both BIWS and the Red Book above — BIWS's \"Core Financial Modeling\" course is built almost entirely around this if you want it as a standalone module.",
        url: "https://breakingintowallstreet.com/",
      },
    ],
  },
  {
    id: "cfa",
    icon: Award,
    label: "CFA Track",
    goal: "Get certified",
    forYou: "For you if you're considering the CFA charter.",
    resources: [
      {
        title: "Schweser CFA Level 1",
        desc: "The standard prep provider alongside the official CFA Institute curriculum.",
        url: "https://www.schweser.com/cfa/level-1/study-materials",
      },
      {
        title: "Schweser CFA Level 2",
        desc: "Level 2 study materials from Kaplan Schweser.",
        url: "https://www.schweser.com/cfa/level-2/study-materials",
      },
      {
        title: "Schweser CFA Level 3",
        desc: "Level 3 study materials from Kaplan Schweser.",
        url: "https://www.schweser.com/cfa/level-3/study-materials",
      },
      {
        title: "Schweser Free Trial & Materials",
        desc: "Useful for students who want to sample the notes before committing.",
        url: "https://www.schweser.com/cfa/level-1/free-study-materials",
      },
    ],
  },
  {
    id: "books",
    icon: BookOpen,
    label: "Books",
    goal: "Go deeper",
    forYou: "For you if you'd rather learn from the classics behind the craft.",
    resources: [
      { title: "One Up on Wall Street", author: "Peter Lynch", desc: "How to think about businesses as investments." },
      { title: "The Intelligent Investor", author: "Benjamin Graham", desc: "The fundamentals of value investing." },
      { title: "Poor Charlie's Almanack", author: "Charlie Munger", desc: "Mental models and judgment." },
      { title: "Investment Banking: Valuation, LBOs, M&A, and IPOs", author: "Rosenbaum & Pearl", desc: "The standard technical reference for IB." },
      { title: "Valuation: Measuring and Managing the Value of Companies", author: "McKinsey & Co. (Koller et al.)", desc: "The definitive corporate valuation reference." },
      { title: "Liar's Poker", author: "Michael Lewis", desc: "Wall Street culture and bond trading in the 1980s." },
      { title: "Barbarians at the Gate", author: "Burrough & Helyar", desc: "The RJR Nabisco LBO - a classic PE case study." },
      { title: "The Big Short", author: "Michael Lewis", desc: "The 2008 crisis, told through the people who saw it coming." },
    ],
  },
];


/* ------------------------------------------------------------------
   Helpers
------------------------------------------------------------------- */

const EASE = [0.16, 1, 0.3, 1] as const;

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function kindOf(r: ResourceItem): { Icon: typeof Globe; label: string } {
  if (!r.url) return { Icon: BookOpen, label: r.author ? "Book" : "Read" };
  let host = "";
  try {
    host = new URL(r.url).hostname.replace(/^www\./, "");
  } catch {
    return { Icon: Globe, label: "Link" };
  }
  if (host.includes("youtube")) return { Icon: PlayCircle, label: "YouTube" };
  if (host.includes("drive.google")) return { Icon: FileText, label: "PDF · Drive" };
  return { Icon: Globe, label: host };
}

// Position of `el` inside `root`, ignoring CSS transforms (so measurements
// stay correct while nodes are mid-animation).
function offsetWithin(el: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let node: HTMLElement | null = el;
  while (node && node !== root) {
    x += node.offsetLeft;
    y += node.offsetTop;
    node = node.offsetParent as HTMLElement | null;
  }
  return { x, y, w: el.offsetWidth, h: el.offsetHeight };
}

function curve(x1: number, y1: number, x2: number, y2: number) {
  const mx = (x1 + x2) / 2;
  return `M${x1} ${y1} C${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;
}

function LeafCard({ r, compact = false }: { r: ResourceItem; compact?: boolean }) {
  const { Icon, label } = kindOf(r);
  const inner = (
    <div
      className={`group flex items-start gap-3 rounded-xl border border-cream/10 bg-[#141010]/90 backdrop-blur-sm transition-colors duration-300 ${
        r.url ? "hover:border-gold/40 hover:bg-[#1C1616]" : ""
      } ${compact ? "p-3" : "p-3.5"}`}
    >
      <span className="mt-0.5 shrink-0 w-8 h-8 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center text-gold">
        <Icon className="w-4 h-4" />
      </span>
      <div className="min-w-0 flex-1 text-left">
        <div className="flex items-center gap-2">
          <h4
            className="font-bold text-[15px] text-cream leading-snug group-hover:text-gold transition-colors"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {r.title}
          </h4>
          {r.url && (
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-cream/30 group-hover:text-gold transition-colors" />
          )}
        </div>
        <p className="text-[11px] uppercase tracking-wider text-gold/70 mt-0.5">
          {r.author ? `${label} · ${r.author}` : label}
        </p>
        <p className="text-sm text-cream/65 leading-relaxed mt-1 line-clamp-2">{r.desc}</p>
      </div>
    </div>
  );
  return r.url ? (
    <a href={r.url} target="_blank" rel="noopener noreferrer" className="block">
      {inner}
    </a>
  ) : (
    inner
  );
}

/* ------------------------------------------------------------------
   Desktop — a left-to-right branching map:
   hub → five goals → resources of the chosen goal
------------------------------------------------------------------- */

function BranchMap() {
  const reduce = useReducedMotion();
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hubRef = useRef<HTMLDivElement | null>(null);
  const goalRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const leafRefs = useRef<(HTMLDivElement | null)[]>([]);
  const inView = useInView(rootRef, { once: true, amount: 0.25 });

  const [activeId, setActiveId] = useState<string>(SECTIONS[0].id);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [trunks, setTrunks] = useState<string[]>([]);
  const [twigs, setTwigs] = useState<string[]>([]);

  const activeIndex = SECTIONS.findIndex((s) => s.id === activeId);
  const active = SECTIONS[activeIndex];

  useIsoLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const hub = hubRef.current;
      if (!hub) return;
      const h = offsetWithin(hub, root);
      const hx = h.x + h.w;
      const hy = h.y + h.h / 2;

      const goalBoxes = goalRefs.current.map((el) => (el ? offsetWithin(el, root) : null));
      setTrunks(goalBoxes.map((g) => (g ? curve(hx, hy, g.x, g.y + g.h / 2) : "")));

      const g = goalBoxes[activeIndex];
      if (g) {
        const gx = g.x + g.w;
        const gy = g.y + g.h / 2;
        setTwigs(
          leafRefs.current
            .slice(0, active.resources.length)
            .map((el) => {
              if (!el) return "";
              const l = offsetWithin(el, root);
              return curve(gx, gy, l.x, l.y + Math.min(l.h / 2, 30));
            })
        );
      }
      setSize({ w: root.scrollWidth, h: root.scrollHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    return () => ro.disconnect();
  }, [activeId]);

  return (
    <div
      ref={rootRef}
      className="relative grid grid-cols-[200px_300px_1fr] xl:grid-cols-[220px_320px_1fr] gap-x-14 items-start text-left"
    >
      {/* Connectors */}
      <svg
        className="absolute left-0 top-0 pointer-events-none overflow-visible"
        width={size.w}
        height={size.h}
        aria-hidden
      >
        {trunks.map((d, i) =>
          d ? (
            <motion.path
              key={`trunk-${i}`}
              d={d}
              fill="none"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{
                pathLength: inView ? 1 : 0,
                stroke: i === activeIndex ? "rgba(245,183,49,0.85)" : "rgba(245,230,208,0.14)",
                strokeWidth: i === activeIndex ? 2 : 1.25,
              }}
              transition={{ pathLength: { duration: reduce ? 0 : 0.9, delay: reduce ? 0 : 0.2 + i * 0.12, ease: EASE }, default: { duration: 0.4 } }}
              style={i === activeIndex ? { filter: "drop-shadow(0 0 6px rgba(245,183,49,0.6))" } : undefined}
            />
          ) : null
        )}
        {inView && twigs.map((d, i) =>
          d ? (
            <motion.path
              key={`twig-${activeId}-${i}`}
              d={d}
              fill="none"
              stroke="rgba(245,183,49,0.45)"
              strokeWidth={1.25}
              strokeLinecap="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 0.05 + i * 0.06, ease: EASE }}
            />
          ) : null
        )}
      </svg>

      {/* Hub */}
      <div className="self-center flex flex-col items-center text-center">
        <motion.div
          ref={hubRef}
          initial={{ opacity: 0, scale: 0.85 }}
          animate={inView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.8, ease: EASE }}
          className="relative w-36 h-36 xl:w-40 xl:h-40 rounded-full"
        >
          <span className="absolute -inset-3 rounded-full border border-gold/20 animate-[ping_3.5s_cubic-bezier(0,0,0.2,1)_infinite] opacity-40" />
          <span className="absolute -inset-1 rounded-full bg-gold/10 blur-xl" />
          <div className="relative w-full h-full rounded-full overflow-hidden border border-gold/40 shadow-[0_0_50px_-10px_rgba(245,183,49,0.5)]">
            <Image src="/Finance-Club/logo.jpg" alt="Finance Club logo" fill className="object-cover" sizes="160px" />
          </div>
        </motion.div>
        <p
          className="mt-5 text-lg text-cream/80 leading-snug"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What do you want
          <br />
          <span className="text-gradient-gold font-bold">to do?</span>
        </p>
      </div>

      {/* Goals */}
      <div className="flex flex-col gap-3 py-2">
        {SECTIONS.map((s, i) => {
          const isActive = s.id === activeId;
          return (
            <motion.button
              key={s.id}
              ref={(el) => {
                goalRefs.current[i] = el;
              }}
              type="button"
              onClick={() => setActiveId(s.id)}
              aria-pressed={isActive}
              initial={{ opacity: 0, x: -16 }}
              animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: reduce ? 0 : 0.35 + i * 0.1, ease: EASE }}
              className={`group relative w-full rounded-2xl border px-4 py-3.5 text-left transition-all duration-300 ${
                isActive
                  ? "border-gold/50 bg-gold/[0.08] shadow-[0_0_40px_-12px_rgba(245,183,49,0.55)]"
                  : "border-cream/10 bg-[#141010]/70 hover:border-gold/30 opacity-75 hover:opacity-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                    isActive ? "bg-gold text-[#0D0A0A]" : "bg-gold/10 text-gold border border-gold/20"
                  }`}
                >
                  <s.icon className="w-5 h-5" />
                </span>
                <div className="min-w-0">
                  <div
                    className={`font-bold text-[17px] leading-tight ${isActive ? "text-gold" : "text-cream"}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.goal}
                  </div>
                  <div className="text-xs text-cream/50 mt-0.5 truncate">{s.label}</div>
                </div>
                <span className="ml-auto text-[11px] tabular-nums text-cream/40">{s.resources.length}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Resources of the chosen goal */}
      <div className="min-h-[420px]">
        {/* Keyed so the new resources mount immediately — the connector
            measurement in the layout effect then sees the right cards. */}
        <motion.div
            key={activeId}
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
          >
            <p className="text-sm text-cream/60 mb-3 italic">{active.forYou}</p>
            <div className="flex flex-col gap-2.5">
              {active.resources.map((r, i) => (
                <motion.div
                  key={r.title}
                  ref={(el) => {
                    leafRefs.current[i] = el;
                  }}
                  initial={{ opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: reduce ? 0 : 0.12 + i * 0.06, ease: EASE }}
                >
                  <LeafCard r={r} compact />
                </motion.div>
              ))}
            </div>
          </motion.div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------
   Mobile / tablet — the same branches as tappable rows that open up
------------------------------------------------------------------- */

function BranchList() {
  const [openId, setOpenId] = useState<string | null>(SECTIONS[0].id);
  const reduce = useReducedMotion();

  return (
    <div className="text-left">
      <div className="flex items-center gap-3 mb-5 justify-center">
        <div className="relative w-12 h-12 rounded-full overflow-hidden border border-gold/40 shadow-[0_0_30px_-8px_rgba(245,183,49,0.6)]">
          <Image src="/Finance-Club/logo.jpg" alt="Finance Club logo" fill className="object-cover" sizes="48px" />
        </div>
        <p className="text-lg text-cream/80" style={{ fontFamily: "var(--font-display)" }}>
          What do you want <span className="text-gradient-gold font-bold">to do?</span>
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {SECTIONS.map((s, i) => {
          const open = openId === s.id;
          return (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.06, ease: EASE }}
              className={`rounded-2xl border transition-colors ${
                open ? "border-gold/45 bg-gold/[0.06]" : "border-cream/10 bg-[#141010]/70"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenId(open ? null : s.id)}
                aria-expanded={open}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span
                  className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
                    open ? "bg-gold text-[#0D0A0A]" : "bg-gold/10 text-gold border border-gold/20"
                  }`}
                >
                  <s.icon className="w-5 h-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <div
                    className={`font-bold text-[17px] leading-tight ${open ? "text-gold" : "text-cream"}`}
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {s.goal}
                  </div>
                  <div className="text-xs text-cream/50 mt-0.5">{s.label}</div>
                </div>
                <ChevronDown
                  className={`w-5 h-5 shrink-0 text-cream/50 transition-transform duration-300 ${open ? "rotate-180 text-gold" : ""}`}
                />
              </button>

              <AnimatePresence initial={false}>
                {open && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.4, ease: EASE }}
                    className="overflow-hidden"
                  >
                    <div className="px-4 pb-4">
                      <p className="text-sm text-cream/60 italic mb-3">{s.forYou}</p>
                      {/* Branch line with a twig to each resource */}
                      <div className="relative pl-5 flex flex-col gap-2.5">
                        <span className="absolute left-1.5 top-0 bottom-6 w-px bg-gradient-to-b from-gold/70 to-gold/10" />
                        {s.resources.map((r, j) => (
                          <motion.div
                            key={r.title}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.35, delay: reduce ? 0 : 0.08 + j * 0.05, ease: EASE }}
                            className="relative"
                          >
                            <span className="absolute -left-3.5 top-7 w-3 h-px bg-gold/50" />
                            <LeafCard r={r} compact />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

export default function LearningRoadmap() {
  return (
    <>
      <div className="hidden lg:block">
        <BranchMap />
      </div>
      <div className="lg:hidden max-w-xl mx-auto">
        <BranchList />
      </div>
    </>
  );
}
