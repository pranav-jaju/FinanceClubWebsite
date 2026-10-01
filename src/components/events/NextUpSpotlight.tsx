"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, User, Users } from "lucide-react";
import { competitions, type Competition } from "@/data/competitions";

// Registration closes at the end of the deadline day, local time.
function deadlineOf(c: Competition) {
  return new Date(`${c.registrationDeadline}T23:59:59`);
}

function upcomingCompetitions(now: number) {
  return [...competitions]
    .filter((c) => deadlineOf(c).getTime() > now)
    .sort((a, b) => deadlineOf(a).getTime() - deadlineOf(b).getTime());
}

// Dates in the data are only reliable to the month, so that's all we show.
const monthLong = (c: Competition) =>
  deadlineOf(c).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
const monthShort = (c: Competition) =>
  deadlineOf(c).toLocaleDateString("en-IN", { month: "short" });

export default function NextUpSpotlight() {
  // "Upcoming" depends on today's date, so resolve it on the client only
  // (avoids a server/client hydration mismatch).
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setNow(Date.now()), 0);
    return () => clearTimeout(t);
  }, []);

  if (now === null) {
    return <div className="h-[380px] sm:h-[300px]" aria-hidden />;
  }

  const upcoming = upcomingCompetitions(now);
  const next = upcoming[0];
  if (!next) return null;

  const rest = upcoming.slice(1, 4);
  const d = deadlineOf(next);
  const month = d.toLocaleDateString("en-IN", { month: "short" }).toUpperCase();
  const year = d.getFullYear();

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative overflow-hidden rounded-3xl border border-gold/20 shadow-[0_0_70px_-30px_rgba(245,183,49,0.35)]"
      >
        <Image
          src="/Finance-Club/art3.JPG"
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 1024px) 100vw, 1024px"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0D0A0A]/95 via-[#0D0A0A]/90 to-[#0D0A0A]/85 lg:via-[#0D0A0A]/85 lg:to-[#0D0A0A]/70" />
        <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gold/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 grid sm:grid-cols-[1fr_auto] gap-6 sm:gap-10 items-center p-6 sm:p-8 lg:p-10">
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold text-[#0D0A0A] text-[11px] font-bold uppercase tracking-[0.18em]">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inset-0 rounded-full bg-[#0D0A0A] animate-ping opacity-60" />
                  <span className="relative w-2 h-2 rounded-full bg-[#0D0A0A]" />
                </span>
                Next Up
              </span>
              {next.partnerName && (
                <span className="text-xs text-cream/60">in collaboration with {next.partnerName}</span>
              )}
            </div>

            <h2
              className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-cream leading-tight mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {next.name}
            </h2>
            <p className="text-base sm:text-lg text-cream/75 leading-relaxed mb-5 max-w-xl">
              {next.shortDescription}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cream/65 mb-6">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold/80" /> Registrations close in {monthLong(next)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                {next.allowTeams ? <Users className="w-4 h-4 text-gold/80" /> : <User className="w-4 h-4 text-gold/80" />}
                {next.allowTeams ? `Teams of up to ${next.maxTeamSize}` : "Individual"}
              </span>
            </div>

            <Link href={`/competitions/${next.slug}`} className="btn-gold">
              View Details & Register <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Month tile */}
          <div className="hidden sm:flex flex-col items-center justify-center w-36 lg:w-44 aspect-square rounded-2xl bg-black/50 border border-gold/25 shadow-[inset_0_1px_0_rgba(245,230,208,0.06),0_0_40px_-12px_rgba(245,183,49,0.35)]">
            <span className="text-[10px] uppercase tracking-[0.22em] text-cream/55 mb-1">Closes</span>
            <span
              className="text-5xl lg:text-6xl font-extrabold text-gradient-gold leading-none"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {month}
            </span>
            <span className="mt-2 text-sm text-cream/60 tabular-nums tracking-[0.2em]">{year}</span>
          </div>
        </div>
      </motion.div>

      {rest.length > 0 && (
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-3">
          <span className="text-xs uppercase tracking-[0.18em] text-cream/50 mr-1">Also coming up</span>
          {rest.map((c) => (
            <Link
              key={c.slug}
              href={`/competitions/${c.slug}`}
              className="group inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cream/10 bg-black/30 text-sm text-cream/75 hover:text-gold hover:border-gold/30 transition-colors"
            >
              <span className="text-gold/80 text-xs uppercase tracking-wider">{monthShort(c)}</span>
              {c.name}
              <ArrowRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
