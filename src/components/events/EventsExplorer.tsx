"use client";

import { useState } from "react";
import type { MouseEvent, ReactNode } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "framer-motion";
import {
  ArrowRight,
  Building2,
  GraduationCap,
  Layers,
  Mic,
  Star,
  Trophy,
  Wrench,
} from "lucide-react";
import { competitions } from "@/data/competitions";
import {
  clubEvents,
  eventCategories,
  type ClubEvent,
  type EventCategory,
} from "@/data/events";

export const categoryIcons: Record<EventCategory, typeof Trophy> = {
  competitions: Trophy,
  bootcamps: GraduationCap,
  sessions: Mic,
  workshops: Wrench,
  conferences: Building2,
  finfest: Star,
  miscellaneous: Layers,
};

function getEventHref(event: ClubEvent) {
  // Only competition cards have individual pages right now
  if (event.category !== "competitions") return null;

  const aliases: Record<string, string> = {
    "Citadel Trading ID Challenge": "citadel-trader-id",
  };
  if (aliases[event.name]) return `/competitions/${aliases[event.name]}`;

  const directMatch = competitions.find(
    (competition) =>
      competition.name.toLowerCase().includes(event.name.toLowerCase()) ||
      event.name.toLowerCase().includes(competition.name.toLowerCase())
  );
  return directMatch ? `/competitions/${directMatch.slug}` : null;
}

/* ------------------------------------------------------------------
   Tilt — follows the mouse on desktop with a soft glare. Disabled for
   touch and reduced-motion users.
------------------------------------------------------------------- */
function TiltCard({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(my, [0, 1], [6, -6]), { stiffness: 220, damping: 22 });
  const rotateY = useSpring(useTransform(mx, [0, 1], [-6, 6]), { stiffness: 220, damping: 22 });
  const glareX = useTransform(mx, (v) => `${v * 100}%`);
  const glareY = useTransform(my, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${glareX} ${glareY}, rgba(245,183,49,0.10), transparent 45%)`;
  const [hovering, setHovering] = useState(false);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const reset = () => {
    setHovering(false);
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <div className={`h-full [perspective:1000px] ${className ?? ""}`}>
      <motion.div
        onMouseMove={onMove}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={reset}
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="relative h-full"
      >
        {children}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[1.25rem] transition-opacity duration-300"
          style={{ background: glare, opacity: hovering && !reduce ? 1 : 0 }}
        />
      </motion.div>
    </div>
  );
}

function EventCard({ event }: { event: ClubEvent }) {
  const CatIcon = categoryIcons[event.category];
  const href = getEventHref(event);
  const featured = !!event.featured;

  const body = (
    <div
      className={`h-full flex flex-col overflow-hidden rounded-[1.25rem] border transition-colors duration-300 bg-[#141010]/80 ${
        featured ? "border-gold/20 hover:border-gold/40" : "border-cream/[0.07] hover:border-gold/25"
      }`}
    >
      {/* Cover */}
      <div className={`relative shrink-0 overflow-hidden ${featured ? "h-44 sm:h-52" : "h-28"}`}>
        {event.image ? (
          <>
            {/* Posters often contain text, so show them whole (contain) over a
                blurred, darkened copy of themselves instead of cropping. */}
            <Image
              src={event.image}
              alt=""
              fill
              aria-hidden
              className="object-cover scale-125 blur-2xl opacity-60"
              sizes="200px"
            />
            <div className="absolute inset-0 bg-black/35" />
            <Image
              src={event.image}
              alt={`${event.name} poster`}
              fill
              className="object-contain transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              sizes={featured ? "(max-width: 1024px) 100vw, 760px" : "(max-width: 1024px) 50vw, 380px"}
            />
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-[#141010] to-transparent" />
          </>
        ) : (
          <>
            <div
              className={`absolute inset-0 ${
                featured
                  ? "bg-[radial-gradient(circle_at_20%_0%,rgba(245,183,49,0.22),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(27,107,64,0.25),transparent_55%)]"
                  : "bg-[radial-gradient(circle_at_15%_0%,rgba(245,183,49,0.12),transparent_55%),radial-gradient(circle_at_100%_100%,rgba(27,107,64,0.14),transparent_50%)]"
              }`}
            />
            <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(rgba(245,230,208,1)_1px,transparent_1px),linear-gradient(90deg,rgba(245,230,208,1)_1px,transparent_1px)] bg-[size:28px_28px]" />
            <CatIcon
              className={`absolute text-gold/15 transition-transform duration-700 ease-out group-hover:scale-110 group-hover:-rotate-6 ${
                featured ? "-right-4 -bottom-8 w-44 h-44" : "-right-2 -bottom-5 w-24 h-24"
              }`}
              strokeWidth={1.25}
            />
            <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#141010] to-transparent" />
          </>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="badge-pill badge-cream text-[9px] capitalize backdrop-blur-md">
            <CatIcon className="w-3 h-3" />
            {event.category}
          </span>
          {featured && (
            <span className="badge-pill badge-gold text-[9px] backdrop-blur-md">Flagship</span>
          )}
        </div>

        {event.partnerLogo && (
          <div className="absolute top-3 right-3 w-11 h-11 rounded-xl bg-cream/95 p-1.5 shadow-lg">
            <div className="relative w-full h-full">
              <Image
                src={event.partnerLogo}
                alt={event.partnerName || "Partner"}
                fill
                className="object-contain"
                sizes="44px"
              />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className={`flex flex-col flex-1 ${featured ? "p-6 sm:p-7" : "p-6 pt-4"}`}>
        <h3
          className={`font-bold mb-2 text-cream transition-colors ${href ? "group-hover:text-gold" : ""} ${
            featured ? "text-2xl sm:text-3xl" : "text-xl"
          }`}
          style={{ fontFamily: "var(--font-display)" }}
        >
          {event.name}
        </h3>
        <p
          className={`text-cream/70 leading-relaxed mb-4 ${
            featured ? "text-lg line-clamp-3 max-w-2xl" : "text-base line-clamp-3"
          }`}
        >
          {event.description}
        </p>
        <div className="mt-auto flex items-center justify-between text-[13px]">
          <span className="text-gold font-semibold">{event.participationScale}</span>
          {href && (
            <span className="inline-flex items-center gap-1 text-cream/50 group-hover:text-gold transition-colors">
              {featured && <span className="text-xs uppercase tracking-wider">View</span>}
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <TiltCard>
      {href ? (
        <Link href={href} className="group block h-full">
          {body}
        </Link>
      ) : (
        <div className="group h-full">{body}</div>
      )}
    </TiltCard>
  );
}

export default function EventsExplorer({ header }: { header: ReactNode }) {
  const [activeTab, setActiveTab] = useState<EventCategory | "all">("all");
  const reduce = useReducedMotion();

  const counts = clubEvents.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] ?? 0) + 1;
    return acc;
  }, {});

  const filtered =
    activeTab === "all" ? clubEvents : clubEvents.filter((e) => e.category === activeTab);

  const tabs: { id: EventCategory | "all"; label: string; count: number; Icon?: typeof Trophy }[] = [
    { id: "all", label: "All", count: clubEvents.length },
    ...eventCategories
      .filter((c) => counts[c.id])
      .map((c) => ({ id: c.id, label: c.label, count: counts[c.id], Icon: categoryIcons[c.id] })),
  ];

  return (
    <LayoutGroup>
      <div className="relative overflow-hidden rounded-3xl border border-cream/10 mb-12">
        <Image
          src="/Finance-Club/art7.JPG"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1200px"
        />
        <div className="absolute inset-0 bg-black/78" />
        <div className="absolute inset-0 pointer-events-none opacity-25 bg-[radial-gradient(circle_at_top_left,rgba(245,183,49,0.15),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(27,107,64,0.14),transparent_32%)]" />

        <div className="relative z-10 py-14 px-6">
          {header}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-6 px-6 sm:mx-0 sm:px-0 sm:flex-wrap sm:justify-center sm:overflow-visible">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(isActive && tab.id !== "all" ? "all" : tab.id)}
              className={`badge-pill relative shrink-0 whitespace-nowrap cursor-pointer transition-colors ${
                isActive ? "badge-gold" : "badge-cream"
              }`}
              aria-pressed={isActive}
            >
              {isActive && (
                <motion.span
                  layoutId="events-tab-pill"
                  className="absolute inset-0 rounded-full bg-gold/15 ring-1 ring-gold/45"
                  transition={{ type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <span className="relative inline-flex items-center gap-1.5">
                {tab.Icon && <tab.Icon className="w-3 h-3" />}
                {tab.label}
                <span className={`tabular-nums ${isActive ? "text-gold/80" : "text-cream/40"}`}>{tab.count}</span>
              </span>
            </button>
          );
        })}
      </div>
        </div>
      </div>

      {/* Event grid — sits below the boxed panel */}
      <div>
        <motion.div layout={!reduce} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 [grid-auto-flow:dense]">
          <AnimatePresence mode="popLayout" initial={false}>
            {filtered.map((event) => (
              <motion.div
                key={event.id}
                layout={!reduce}
                initial={{ opacity: 0, scale: 0.94, y: 16 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.18 } }}
                transition={{ type: "spring", stiffness: 260, damping: 30, mass: 0.8 }}
                className={event.featured ? "sm:col-span-2" : ""}
              >
                <EventCard event={event} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filtered.length === 0 && (
          <div className="text-center py-16">
            <p className="text-cream/40">No events in this category yet.</p>
          </div>
        )}
      </div>
    </LayoutGroup>
  );
}
