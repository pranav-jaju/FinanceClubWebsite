"use client";

import { use } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  ExternalLink,
  ListChecks,
  User,
  Users,
} from "lucide-react";

import { competitions, type Competition } from "@/data/competitions";
import RevealWords from "@/components/motion/RevealWords";
import { StaggerGrid, StaggerItem } from "@/components/StaggerReveal";

const FINANCE_CLUB_LINKTREE =
  "https://l.instagram.com/?u=https%3A%2F%2Flnk.bio%2Ffinanceclubiitb%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAafQ-_qN_4OhVuT9yScv0-xdgVCIM_ePnRks6ofMwi8uJkWNrACrKw7JB-cYEg_aem_bpUMoiyH9L5zryStaUVJ-Q&e=AUDKKIDci_XsqrCp-nzmr2egaO8ESKn7ZujI_PTsdzjrgtXVAvw4ogDoSCo_NeARi051m7DcxPiJI_BbCNq7XS8Ng7WhzI36fXRxjuMG8u7wpE799BR0j8xSPiILcARRe-lKgg7vnuIs";

const STATUS: Record<Competition["status"], { label: string; className: string }> = {
  active: { label: "Registrations open", className: "bg-gold text-[#0D0A0A] border-gold" },
  upcoming: { label: "Coming soon", className: "bg-gold/10 text-gold border-gold/30" },
  past: { label: "Concluded", className: "bg-cream/5 text-cream/60 border-cream/15" },
};

// Dates in the data are reliable to the month, so that's what we show.
const monthYear = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

export default function CompetitionDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const competition = competitions.find((c) => c.slug === slug);
  if (!competition) return notFound();

  const status = STATUS[competition.status];
  const format = competition.allowTeams
    ? `Teams of up to ${competition.maxTeamSize}`
    : "Individual";
  const others = competitions.filter((c) => c.slug !== competition.slug).slice(0, 3);

  return (
    <div className="relative min-h-screen bg-[#0D0A0A] text-cream">
      {/* ================= HERO ================= */}
      <section className="pt-28 sm:pt-32 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/competitions"
            className="inline-flex items-center gap-2 mb-5 rounded-full border border-cream/10 bg-black/30 px-4 py-2 text-sm text-cream/65 hover:text-gold hover:border-gold/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All competitions
          </Link>

          <div className="hero-shine relative overflow-hidden rounded-3xl border border-gold/15 bg-black/35 backdrop-blur-md">
            {/* soft blurred poster (or art) behind everything */}
            <Image
              src={competition.image || "/Finance-Club/art7.JPG"}
              alt=""
              fill
              aria-hidden
              className="object-cover scale-110 blur-2xl opacity-25"
              sizes="300px"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#0D0A0A]/90 via-[#0D0A0A]/80 to-[#0D0A0A]/95" />
            <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-gold/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-[1.1fr_1fr] gap-8 lg:gap-12 items-center p-6 sm:p-10 lg:p-12">
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-[0.16em] ${status.className}`}>
                    {status.label}
                  </span>
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-cream/10 bg-black/30 text-xs text-cream/70">
                    {competition.allowTeams ? <Users className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    {format}
                  </span>
                </div>

                <h1
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.1] text-cream"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {competition.name}
                </h1>

                <p className="mt-4 text-lg sm:text-xl text-cream/75 leading-relaxed max-w-xl">
                  {competition.shortDescription}
                </p>

                {competition.partnerName && (
                  <div className="mt-5 inline-flex items-center gap-3 text-sm text-cream/60">
                    {competition.partnerLogo && (
                      <span className="relative w-9 h-9 rounded-lg bg-cream/95 p-1">
                        <Image src={competition.partnerLogo} alt={competition.partnerName} fill className="object-contain p-1" sizes="36px" />
                      </span>
                    )}
                    In collaboration with <span className="text-cream/85">{competition.partnerName}</span>
                  </div>
                )}

                <div className="mt-7 flex flex-col min-[420px]:flex-row gap-3">
                  <a href={FINANCE_CLUB_LINKTREE} target="_blank" rel="noopener noreferrer" className="btn-gold justify-center">
                    Register & Updates <ExternalLink className="w-4 h-4" />
                  </a>
                  <Link href="/competitions" className="btn-ghost justify-center">
                    Explore events
                  </Link>
                </div>
              </div>

              {/* Banner / emblem */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl border border-gold/20 bg-[#141010] shadow-[0_20px_60px_-25px_rgba(245,183,49,0.35)]">
                {competition.image ? (
                  <>
                    <Image src={competition.image} alt="" fill aria-hidden className="object-cover scale-125 blur-2xl opacity-60" sizes="200px" />
                    <div className="absolute inset-0 bg-black/30" />
                    <Image
                      src={competition.image}
                      alt={`${competition.name} banner`}
                      fill
                      priority
                      className="object-contain"
                      sizes="(max-width: 1024px) 100vw, 520px"
                    />
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_30%_20%,rgba(245,183,49,0.18),transparent_55%),radial-gradient(circle_at_80%_90%,rgba(27,107,64,0.22),transparent_55%)]">
                    <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border border-gold/40 shadow-[0_0_50px_-10px_rgba(245,183,49,0.5)]">
                      <Image src="/Finance-Club/logo.jpg" alt="Finance Club" fill className="object-cover" sizes="128px" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= BODY ================= */}
      <section className="px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-8 lg:gap-12 items-start">
          {/* At a glance — first on phones, sidebar on desktop */}
          <aside className="lg:order-2 lg:sticky lg:top-28">
            <div className="rounded-2xl border border-gold/15 bg-[#141010]/80 p-6">
              <h2 className="text-xs uppercase tracking-[0.2em] text-gold/80 mb-5">At a glance</h2>
              <dl className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <div>
                    <dt className="text-xs text-cream/50">Registrations close</dt>
                    <dd className="text-cream">{monthYear(competition.registrationDeadline)}</dd>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  {competition.allowTeams ? <Users className="w-4 h-4 mt-0.5 text-gold shrink-0" /> : <User className="w-4 h-4 mt-0.5 text-gold shrink-0" />}
                  <div>
                    <dt className="text-xs text-cream/50">Format</dt>
                    <dd className="text-cream">{format}</dd>
                  </div>
                </div>
                {competition.partnerName && (
                  <div className="flex items-start gap-3">
                    <Building2 className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                    <div>
                      <dt className="text-xs text-cream/50">Partner</dt>
                      <dd className="text-cream">{competition.partnerName}</dd>
                    </div>
                  </div>
                )}
              </dl>
              <a
                href={FINANCE_CLUB_LINKTREE}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full justify-center mt-6 text-sm"
              >
                Find out more <ExternalLink className="w-4 h-4" />
              </a>
              <p className="mt-3 text-xs text-cream/45 leading-relaxed">
                Registration links, updates and announcements are posted on our socials.
              </p>
            </div>
          </aside>

          {/* About + rules */}
          <div className="lg:order-1 min-w-0">
            <h2
              className="text-2xl sm:text-3xl font-extrabold mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              <RevealWords text="About the" />{" "}
              <RevealWords text="competition" className="text-gradient-gold" delay={0.14} />
            </h2>
            <p className="text-base sm:text-lg text-cream/75 leading-[1.85]">{competition.description}</p>

            {competition.rules.length > 0 && (
              <div className="mt-10">
                <h2
                  className="flex items-center gap-2 text-xl sm:text-2xl font-extrabold mb-5"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <ListChecks className="w-5 h-5 text-gold" />
                  <RevealWords text="Rules & format" />
                </h2>
                <ol className="space-y-3">
                  {competition.rules.map((rule, i) => (
                    <li
                      key={i}
                      className="flex gap-4 rounded-xl border border-cream/[0.07] bg-[#141010]/60 px-4 py-3.5"
                    >
                      <span className="shrink-0 w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm font-bold flex items-center justify-center tabular-nums">
                        {i + 1}
                      </span>
                      <span className="text-cream/75 leading-relaxed text-[15px] sm:text-base pt-0.5">{rule}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ================= MORE COMPETITIONS ================= */}
      {others.length > 0 && (
        <section className="px-4 sm:px-6 lg:px-8 pb-20 sm:pb-28">
          <div className="max-w-6xl mx-auto">
            <div className="divider-glow mb-12" />
            <div className="flex items-end justify-between gap-4 mb-6">
              <h2
                className="text-2xl sm:text-3xl font-extrabold"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <RevealWords text="More" />{" "}
                <RevealWords text="competitions" className="text-gradient-gold" delay={0.07} />
              </h2>
              <Link href="/competitions" className="hidden sm:inline-flex items-center gap-1.5 text-sm text-cream/60 hover:text-gold transition-colors">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-3 gap-4" stagger={0.1}>
              {others.map((c) => (
                <StaggerItem key={c.slug} className="h-full">
                  <Link
                    href={`/competitions/${c.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-cream/[0.08] bg-[#141010]/70 p-5 hover:border-gold/30 transition-colors"
                  >
                    <span className="text-xs text-gold/80 mb-2">{monthYear(c.registrationDeadline)}</span>
                    <h3
                      className="font-bold text-lg text-cream group-hover:text-gold transition-colors leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {c.name}
                    </h3>
                    <p className="mt-2 text-sm text-cream/60 leading-relaxed line-clamp-2">{c.shortDescription}</p>
                    <span className="mt-auto pt-4 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-cream/50 group-hover:text-gold transition-colors">
                      View <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                </StaggerItem>
              ))}
            </StaggerGrid>
          </div>
        </section>
      )}
    </div>
  );
}
