"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import LogoCarousel from "@/components/LogoCarousel";
import HeroMoneyPile from "@/components/HeroMoneyPile";
import FinanceWheel from "@/components/FinanceWheel";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ArrowRight,
  Trophy,
  BookOpen,
  Users,
  Lightbulb,
  Calendar,
  FileText,
  Video,
  Award,
  ChevronRight,
  Sparkles,
  TrendingUp,
  BarChart3,
  Zap,
  Target,
  Building2,
} from "lucide-react";
import { sponsors } from "@/data/sponsors";
import { competitions } from "@/data/competitions";
import { blogPosts } from "@/data/blogs";
import ScrollReveal from "@/components/ScrollReveal";
import RoadmapTimeline from "@/components/competitions/RoadmapTimeline";
import AnimatedCounter from "@/components/AnimatedCounter";
import HeroSpotlight from "@/components/HeroSpotlight";
import RevealWords from "@/components/motion/RevealWords";
import ParallaxLayer from "@/components/motion/ParallaxLayer";
import ImpactStats from "@/components/ImpactStats";

export default function HomePage() {
  const activeCompetitions = competitions.filter(
    (c) => c.status === "active" || c.status === "upcoming"
  );
  const latestBlogs = blogPosts.slice(0, 3);

   const REAL = "Finance Club";
  const REAL_SPLIT = 7; 
  const LINE2 = "IIT BOMBAY";

    const [typeSpeed, setTypeSpeed] = useState(30);
const [typeSpeedLine1, setTypeSpeedLine1] = useState(30);

useEffect(() => {
  const mobile = window.innerWidth < 640;
  setTypeSpeed(mobile ? 10 : 30);
  setTypeSpeedLine1(mobile ? 6 : 30);
}, []);
  const PAUSE_BEFORE_LINE2 = 300;
  const PAUSE_BEFORE_REST = 1000;

  // Phases: "type2" -> "line2" -> "done"
  const [phase, setPhase] = useState("type2");
  const [typedReal, setTypedReal] = useState(0);
  const [typedLine2, setTypedLine2] = useState(0);
  const [showRest, setShowRest] = useState(false);
  // Swap the title colours once the rest of the hero has appeared.
  const swapped = showRest;

  // Hero reacts to scrolling away: background zooms + darkens, content drifts up.
  const heroRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress: heroProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroBgScale = useTransform(heroProgress, [0, 1], [1, 1.12]);
  const heroShade = useTransform(heroProgress, [0, 1], [0, 0.55]);
  const heroContentY = useTransform(heroProgress, [0, 1], [0, -90]);
  const cueOpacity = useTransform(heroProgress, [0, 0.06], [1, 0]);

  // Phase 1: Type "Finance Club"

  // Phase 3: Type "Finance Club"
    useEffect(() => {
  if (phase !== "type2") return;
  if (typedReal < REAL.length) {
    const t = setTimeout(() => setTypedReal((c) => c + 1), typeSpeedLine1);
    return () => clearTimeout(t);
  }
  const t = setTimeout(() => setPhase("line2"), PAUSE_BEFORE_LINE2);
  return () => clearTimeout(t);
}, [phase, typedReal, typeSpeedLine1]);

useEffect(() => {
  if (phase !== "line2") return;
  if (typedLine2 < LINE2.length) {
    const t = setTimeout(() => setTypedLine2((c) => c + 1), typeSpeed);
    return () => clearTimeout(t);
  }
  const t = setTimeout(() => {
    setPhase("done");
    setShowRest(true);
  }, PAUSE_BEFORE_REST);
  return () => clearTimeout(t);
}, [phase, typedLine2, typeSpeed]);
    const line1Done = phase === "type2" || phase === "line2" || phase === "done";
  const line2Done = typedLine2 >= LINE2.length;

  return (
    <>
      <div>
        {/* ===== HERO — FULL SCREEN IMAGE ===== */}
        {/* ===== HERO — FULL SCREEN IMAGE ===== */}
<section ref={heroRef} className="relative min-h-0 lg:min-h-screen w-full flex items-start overflow-hidden">  {/* Background Image Container */}
  {/* Background zooms in slightly and darkens as you scroll past the hero */}
  <motion.div className="absolute inset-0 w-full h-full" style={{ scale: heroBgScale }}>
    <Image
      src="/Finance-Club/bg1.png"
      alt="Finance Club IIT Bombay"
      fill
      className="object-cover"
      priority
      sizes="100vw"
      quality={90}
    />
    <div className="hero-image-overlay" />
    <div
      className="absolute inset-0 z-[2] pointer-events-none"
      style={{
        background:
          "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
        opacity: 0.35,
      }}
    />
    <div className="accent-orb-gold top-[10%] right-[5%] z-[2]" />
    <div className="accent-orb-crimson bottom-[15%] left-[5%] z-[2]" style={{ animationDelay: "1.5s" }} />
  </motion.div>
  <motion.div aria-hidden className="absolute inset-0 z-[3] bg-[#0D0A0A] pointer-events-none" style={{ opacity: heroShade }} />
  <HeroSpotlight />

  {/* Scroll cue — large screens only, fades out as soon as you scroll */}
  <motion.div
    aria-hidden
    className="hidden lg:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex-col items-center gap-2 pointer-events-none"
    style={{ opacity: cueOpacity }}
  >
    <span className="text-[10px] uppercase tracking-[0.35em] text-cream/50">Scroll</span>
    <span className="relative block w-px h-12 bg-gradient-to-b from-gold/50 to-transparent overflow-hidden">
      <motion.span
        className="absolute left-1/2 -translate-x-1/2 w-[3px] h-[3px] rounded-full bg-gold-light shadow-[0_0_8px_rgba(253,216,93,0.9)]"
        initial={{ top: "-10%" }}
        animate={{ top: ["-10%", "100%"] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", repeatDelay: 0.3 }}
      />
    </span>
  </motion.div>

  {/* Content Layer */}
  <motion.div style={{ y: heroContentY }} className="relative z-10 w-full">
  <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pt-24 sm:pt-32 pb-10 lg:pb-16 xl:-translate-x-10">
    {/* Badge */}
<div className="badge-pill badge-gold mb-5 sm:mb-8 text-xs sm:text-sm lg:text-base px-3 py-1 sm:px-3.5 sm:py-1.5 lg:px-4 whitespace-nowrap">
  <Sparkles className="w-3.5 h-3.5 sm:w-5 sm:h-5 lg:w-7 lg:h-7 shrink-0"/>
  IIT Bombay&apos;s Premier Finance Society
</div>

    {/* Main Headline */}
    <h1
      className="whitespace-normal sm:whitespace-nowrap font-extrabold tracking-[0.03em] sm:tracking-[0.08em] leading-[1.2]  mb-4 sm:mb-6 select-none pt-2 sm:pt-3"
      style={{
  fontFamily: "var(--font-rocksalt)",
  fontSize: "clamp(3.8rem, 7.5vw, 9rem)",
}}
    >
          <span 
  className="relative inline-block w-full min-h-[2.4em] sm:min-h-[1.2em] align-top"
>
        {/* While typing: "Finance" gold, "Club" cream. Once the rest of the
            hero appears they cross-fade: "Finance" cream, "Club" gold. */}
        <span className="relative inline-block">
          <span
            className="text-gradient-gold transition-opacity duration-[1400ms] ease-out"
            style={{ opacity: swapped ? 0 : 1 }}
          >
            {REAL.slice(0, Math.min(typedReal, REAL_SPLIT))}
          </span>
          <span
            aria-hidden
            className="absolute left-0 top-0 text-cream transition-opacity duration-[1400ms] ease-out"
            style={{ opacity: swapped ? 1 : 0 }}
          >
            {REAL.slice(0, Math.min(typedReal, REAL_SPLIT))}
          </span>
        </span>
        {typedReal > REAL_SPLIT ? " " : ""}
        <span className="relative inline-block">
          <span
            className="text-cream transition-opacity duration-[1400ms] ease-out"
            style={{ opacity: swapped ? 0 : 1 }}
          >
            {REAL.slice(REAL_SPLIT + 1, typedReal)}
          </span>
          <span
            aria-hidden
            className="absolute left-0 top-0 text-gradient-gold transition-opacity duration-[1400ms] ease-out"
            style={{ opacity: swapped ? 1 : 0 }}
          >
            {REAL.slice(REAL_SPLIT + 1, typedReal)}
          </span>
        </span>
        {!line1Done && (
          <span className="inline-block w-[4px] h-[0.85em] bg-gold ml-1 align-middle animate-[blink_0.9s_steps(1)_infinite]" />
        )}
        {/* One-time glint across the title as the colours swap (overlay
            only — no layout change). Styled inline so it never depends on
            the global stylesheet. */}
        {swapped && (
          <motion.span
            aria-hidden
            className="absolute left-0 top-0 w-full pointer-events-none"
            style={{
              color: "transparent",
              WebkitTextFillColor: "transparent",
              backgroundImage:
                "linear-gradient(110deg, transparent 42%, rgba(255,246,214,0.95) 50%, transparent 58%)",
              backgroundSize: "250% 100%",
              backgroundRepeat: "no-repeat",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
            }}
            initial={{ backgroundPosition: "150% 0%" }}
            animate={{ backgroundPosition: "-50% 0%" }}
            transition={{ duration: 1.6, ease: [0.45, 0, 0.25, 1], delay: 0.2 }}
          >
            {REAL}
          </motion.span>
        )}
      </span>

      <br />
            <span
        className="text-cream/60 font-semibold tracking-wider block mt-1 sm:mt-0 pt-8 sm:pt-2 min-h-[1.2em] whitespace-nowrap"
        style={{
          fontFamily: "var(--font-display)",
          fontSize: "clamp(1.75rem, 3.2vw, 3rem)",
        }}
      >
        {LINE2.slice(0, typedLine2)}
        {line1Done && !line2Done && (
          <span className="inline-block w-[3px] h-[0.75em] bg-cream/40 ml-1 align-middle animate-[blink_0.9s_steps(1)_infinite]" />
        )}
      </span>
    </h1>

     <div
      aria-hidden={!showRest}
      className={`transition-all duration-700 ease-out ${
        showRest
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-6 pointer-events-none"
      }`}
    >
      {/* Paragraph */}
      <p className="text-lg sm:text-3xl lg:text-2xl text-cream/90 sm:text-cream/80 max-w-2xl mb-6 sm:mb-10 leading-relaxed font-normal">
        Building structured pathways into finance careers through
        world-class competitions, research and industry exposure.
      </p>

      {/* ===== ALIGNED METRICS & ACTIONS ROW ===== */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 sm:gap-8 max-w-15xl pt-10">
        {/* Glass Stats Grid Box */}
        <div className="backdrop-blur-md bg-black/30 border border-cream/10 rounded-2xl py-4 sm:py-6 grid grid-cols-3 divide-x divide-cream/10 w-full lg:w-auto lg:min-w-[500px] shrink-0">
          {[
            { value: "15+", label: "Events Annually" },
            { value: "2000+", label: "Registrations" },
            { value: "8+", label: "Industry Partners" },
          ].map((stat, i) => (
            <div key={stat.label} className="text-center px-1.5 sm:px-4">
              <div
                className="text-2xl sm:text-3xl font-extrabold text-gold mb-0.5"
                style={{ fontFamily: "var(--font-display)" }}
              >
                <AnimatedCounter value={stat.value} start={showRest} delay={250 + i * 120} />
              </div>
              <div className="text-[9px] sm:text-xs text-cream/50 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Action Buttons: Side-by-side compact on mobile, original layout on desktop */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 justify-start lg:justify-end w-full lg:w-auto lg:pb-1 lg:pr-2 lg:px-85">
          <Link href="/competitions" className="btn-gold w-full sm:flex-initial text-center justify-center whitespace-nowrap text-xs sm:text-base py-2.5 sm:py-3.5 px-4 sm:px-8">
            <Trophy className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
            <span>Explore Competitions</span>
          </Link>
          <Link href="/resources" className="btn-ghost w-full sm:flex-initial text-center justify-center whitespace-nowrap text-xs sm:text-base py-2.5 sm:py-3.5 px-4 sm:px-8">
            <span>View Resources</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
          </Link>
        </div>
      </div>
    </div>
  </div>
  </motion.div>
</section>
        {/* ===== WHAT WE DO — WHEEL ===== */}
        <section className="py-10 px-6 lg:px-8 relative mesh-gold overflow-hidden">
          <div className="accent-orb-gold top-[10%] left-[5%]" />
          <div className="accent-orb-crimson bottom-[10%] right-[8%]" />

          <div className="max-w-4xl mx-auto relative z-10 text-center">
            <ScrollReveal>
                <div className="badge-pill badge-gold mb-6 mx-auto">
                  What We Do
                </div>
                <h2
                  className="text-4xl sm:text-4xl lg:text-5xl font-extrabold tracking-[0.02em]"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <RevealWords text="Building" />{" "}
                  <RevealWords text="Finance Acumen" className="text-gradient-gold" delay={0.07} />
                </h2>
                <p className="text-cream/35 mt-5 text-lg sm:text-xl lg:text-2xl lg:leading-relaxed max-w-4xl mx-auto text-center sm:text-center">
                  From flagship competitions to published research - structured
                  pathways across every major finance discipline.{" "}
                  <span className="hidden sm:inline">Click</span>
                  <span className="sm:hidden">Tap</span> any sector to explore
                  what it covers.
                </p>
            </ScrollReveal>
              
            <ScrollReveal delay={200}>
              <div className="mt-15 sm:mt-28 pb-25">
                <FinanceWheel />
              </div>
            </ScrollReveal>
          </div>
        </section>
         <section className="py-10 px-4 sm:px-6 lg:px-8 relative mesh-gold overflow-x-clip">


          {/* ===== IMPACT / SCALE ===== */}
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 mb-12 mt-6 sm:mt-12">
            <div className="relative overflow-hidden rounded-3xl border border-cream/10">
              <ParallaxLayer>
              <Image
                  src="/Finance-Club/art5.JPG"
                  alt=""
                  fill
                  className="object-cover opacity-[0.8] pointer-events-none select-none"
                  sizes="(max-width: 1024px) 100vw, 1200px"
                />
              </ParallaxLayer>
              <div className="absolute inset-0 bg-gradient-to-br from-[#141010]/90 via-[#141010]/85 to-[#141010]/95 pointer-events-none" />

              <ScrollReveal>
                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center py-10 sm:py-12 px-5 sm:px-12">
                  <div>
                    <div className="badge-pill badge-gold mb-6">
                      <Zap className="w-3 h-3" />
                      Our Impact
                    </div>
                    <h2
                      className="text-4xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      <RevealWords text="Scale That" />{" "}
                      <RevealWords text="Matters" className="text-gradient-gold" delay={0.14} />
                    </h2>
                    <p className="text-cream/60 mt-5 text-base sm:text-xl lg:text-2xl lg:leading-relaxed max-w-md">
                      Year after year, our events and initiatives reach hundreds of
                      students and connect them with leading financial firms.
                    </p>
                  </div>

                  <ImpactStats />
                </div>
              </ScrollReveal>
            </div>
          </div>
        

          {/* ===== FEATURED COMPETITIONS — ROADMAP ===== */}
          {/* Pinned on desktop: page scroll drives the road. Winding vertical road on phones. */}
          <RoadmapTimeline
            intro={
    <div className="lg:col-span-4">
        <div className="badge-pill badge-gold mb-6">Competitions</div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-4 tracking-[0.02em] leading-[1.35]" style={{ fontFamily: "var(--font-display)" }}>
          <RevealWords text="Compete Against the" />{" "}
          <RevealWords text="Best Minds" className="text-gradient-gold" delay={0.21} />
        </h2>
        <p className="text-cream/35 mb-6 text-xl">
          Our flagship competitions create a structured pathway into finance throughout the academic year.
        </p>
        <Link href="/competitions" className="btn-gold">
          View All Competitions <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
            }
          />
          </section>

          <div className="divider-glow" />

          {/* ===== PARTNERS HIGHLIGHT ===== */}
          <section className="relative py-16 sm:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <ParallaxLayer className="grid grid-cols-2 grid-rows-2 gap-0">
              <div className="relative col-span-1 row-span-2">
                <Image src="/Finance-Club/partner_3.jpeg" alt="" fill className="object-cover" sizes="50vw" />
              </div>
              <div className="relative col-span-1 row-span-1">
                <Image src="/Finance-Club/finfestpubli.jpg" alt="" fill className="object-cover" sizes="50vw" />
              </div>
              <div className="relative col-span-1 row-span-1">
                <Image src="/Finance-Club/publi.jpg" alt="" fill className="object-cover" sizes="50vw" />
              </div>
            </ParallaxLayer>

            <div className="absolute inset-0 bg-black/82" />
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(245,183,49,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(27,107,64,0.14),transparent_28%)]" />

            <div className="relative z-10 max-w-[1300px] mx-auto">
              <ScrollReveal>
                <div className="backdrop-blur-md bg-black/50 border border-cream/10 rounded-3xl px-5 py-8 sm:px-12 sm:py-14">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-10 sm:mb-14">
                    <div>
                      <div className="badge-pill badge-gold mb-6">
                        <Building2 className="w-3 h-3" />
                        Our Partners
                      </div>
                      <h2
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        <RevealWords text="Industry" />{" "}
                        <RevealWords text="Collaborators" className="text-gradient-gold" delay={0.07} />
                      </h2>
                    </div>
                    <Link href="/sponsors" className="btn-gold shrink-0">
                      Partner With Us <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>

                  <LogoCarousel />
                </div>
              </ScrollReveal>
            </div>
          </section>

          {/* ===== LATEST BLOGS ===== */}
          <section className="relative py-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
            <ParallaxLayer className="grid grid-cols-2 grid-rows-2 gap-0">
              <div className="relative col-span-1 row-span-2">
                <Image src="/Finance-Club/publi.jpg" alt="" fill className="object-cover" sizes="50vw" />
              </div>
              <div className="relative col-span-1 row-span-1">
                <Image src="/Finance-Club/finfestpubli.jpg" alt="" fill className="object-cover" sizes="50vw" />
              </div>
              <div className="relative col-span-1 row-span-1">
                <Image src="/Finance-Club/partner_3.jpeg" alt="" fill className="object-cover" sizes="50vw" />
              </div>
            </ParallaxLayer>

            <div className="absolute inset-0 bg-black/82" />
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_top_left,rgba(27,107,64,0.14),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(245,183,49,0.12),transparent_28%)]" />

            <div className="relative z-10 max-w-[1300px] mx-auto">
              <ScrollReveal>
                <div className="backdrop-blur-md bg-black/50 border border-cream/10 rounded-3xl px-5 py-8 sm:px-12 sm:py-14">
                  <div className="flex items-end justify-between mb-8 sm:mb-14">
                    <div>
                      <div className="badge-pill badge-gold mb-6">Insights</div>
                      <h2
                        className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        <RevealWords text="Latest from the" />{" "}
                        <RevealWords text="Blog" className="text-gradient-gold" delay={0.21} />
                      </h2>
                    </div>
                    <div className="hidden sm:block">
                      <Link href="/blogs" className="btn-ghost text-sm">
                        All Posts <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {latestBlogs.map((post, i) => (
                      <Link key={post.id} href={`/blogs/${post.slug}`}>
                        <div
                          className={`${
                            i === 0 ? "card-glow-gold" : "card-premium"
                          } p-6 sm:p-7 group h-full`}
                        >
                          <div className="text-[10px] text-cream/20 mb-3 font-medium uppercase tracking-wider">
                            {new Date(post.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                            <span className="mx-1.5">·</span>
                          </div>
                          <h3
                            className="font-bold text-xl mb-3 text-cream group-hover:text-gold transition-colors"
                            style={{ fontFamily: "var(--font-display)" }}
                          >
                            {post.title}
                          </h3>
                          <p className="text-lg text-cream/25 line-clamp-3 leading-relaxed">
                            {post.excerpt}
                          </p>
                          <span className="inline-flex items-center gap-1 text-xs text-gold/40 mt-5 group-hover:text-gold transition-colors font-semibold uppercase tracking-wider">
                            Read <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="sm:hidden mt-6">
                    <Link href="/blogs" className="btn-ghost w-full text-sm">
                      All Posts <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </section>

          <div className="divider" />

        {/* ===== CTA ===== */}
        <section className="py-20 sm:py-32 px-4 sm:px-6 lg:px-8 mesh-crimson grain relative">
          <div className="accent-orb-gold top-0 left-1/4" />
          <div className="accent-orb-crimson bottom-0 right-1/4" />
          <div className="relative z-10 max-w-3xl mx-auto text-center">
            <ScrollReveal>
              <div className="gradient-border relative overflow-hidden px-6 py-10 sm:p-16 bg-[#0D0A0A]">
                <ParallaxLayer>
                <Image
                    src="/Finance-Club/art2.JPG"
                    alt=""
                    fill
                    className="object-cover opacity-[0.08] pointer-events-none select-none"
                    sizes="(max-width: 1024px) 100vw, 800px"
                  />
                </ParallaxLayer>
                <div className="absolute inset-0 bg-[#0D0A0A]/85 pointer-events-none" />
                <div className="relative z-10 text-center">
                  <div className="badge-pill badge-gold mx-auto mb-6">
                    Join the Community
                  </div>
                  <h2
                    className="text-4xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight mb-5"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    <RevealWords text="Ready to" />{" "}
                    <RevealWords text="Level Up?" className="text-gradient-gold" delay={0.14} />
                  </h2>
                  <p className="text-cream/50 max-w-3xl mx-auto mb-10 leading-relaxed text-lg lg:text-xl">
                    Compete in flagship events, access curated resources and be
                    part of IIT Bombay&apos;s most active finance community.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link href="/competitions" className="btn-gold">
                      <Trophy className="w-4 h-4" /> Competitions
                    </Link>
                    <Link href="/team" className="btn-ghost">
                      Meet the Team
                    </Link>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </section>
      </div>
    </>
  );
}