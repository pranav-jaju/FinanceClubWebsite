"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Trophy, Sparkles } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import NextUpSpotlight from "@/components/events/NextUpSpotlight";
import EventsExplorer from "@/components/events/EventsExplorer";
import RevealWords from "@/components/motion/RevealWords";

export default function EventsPage() {
  const TYPED_TEXT = "Events";
  const TYPE_SPEED_MS = 90;
  const PAUSE_BEFORE_PARAGRAPH_MS = 500;

  const [typed, setTyped] = useState(0);
  const [showParagraph, setShowParagraph] = useState(false);

  useEffect(() => {
    if (typed >= TYPED_TEXT.length) {
      const t = setTimeout(() => setShowParagraph(true), PAUSE_BEFORE_PARAGRAPH_MS);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setTyped((c) => c + 1), TYPE_SPEED_MS);
    return () => clearTimeout(t);
  }, [typed]);

  const typingDone = typed >= TYPED_TEXT.length;

  return (
    <div>
      {/* Hero */}
<section className="relative min-h-screen flex items-center pt-1 pb-20 px-6 lg:px-8 grain overflow-hidden">
  <div className="absolute inset-0">
    <Image
      src="/Finance-Club/partner_1.png"
      alt="Finance Club events collage background"
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  </div>
  <div className="absolute inset-0 bg-black/70" />
  <div className="absolute inset-0 pointer-events-none opacity-35 bg-[radial-gradient(circle_at_top_left,rgba(245,183,49,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(27,107,64,0.14),transparent_28%)]" />

  <div className="relative z-10 max-w-4xl mx-auto">
    <ScrollReveal>
      <div className="hero-shine backdrop-blur-md bg-black/35 border border-cream/10 rounded-3xl px-8 py-10 sm:px-10 sm:py-12">
        <div className="badge-pill badge-gold mb-6">
          <Trophy className="w-3 h-3" /> Events & Competitions
        </div>
        <h1
  className="text-5xl sm:text-5xl lg:text-6xl font-extrabold tracking-[0.03em] leading-tight mb-6"
  style={{ fontFamily: "var(--font-display)" }}
>
  <span className="text-gradient-gold">{TYPED_TEXT.slice(0, typed)}</span>
  {!typingDone && (
    <span className="inline-block w-[3px] h-[0.85em] bg-gold ml-1 align-middle animate-[blink_0.9s_steps(1)_infinite]" />
  )}
</h1>
<p
  className={`text-lg lg:text-2xl text-cream/85 max-w-2xl leading-relaxed transition-opacity duration-700 ${
    showParagraph ? "opacity-100" : "opacity-0"
  }`}
>
  From flagship competitions to industry workshops, explore
  everything Finance Club has delivered over the last 2 years.
</p>
      </div>
    </ScrollReveal>
  </div>
      </section>

      {/* Next Up — the next competition with a live countdown */}
      <section className="pt-4 pb-12 px-4 sm:px-6 lg:px-8 mesh-gold">
        <div className="max-w-6xl mx-auto">
          <NextUpSpotlight />
        </div>
      </section>

      <div className="divider" />

      {/* ===== ALL EVENTS — TABBED ===== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 mesh-gold">
        <div className="max-w-6xl mx-auto">
          <EventsExplorer
            header={
              <div className="text-center mb-10">
                <div className="badge-pill badge-gold mx-auto mb-6">
                  <Sparkles className="w-3 h-3" />
                  2 Years of Impact
                </div>
                <h2
                  className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <RevealWords text="All" />
                  {" "}
                  <RevealWords text="Events" className="text-gradient-gold" delay={0.07} />
                  {" "}
                </h2>
              </div>
            }
          />
        </div>
      </section>

      {/* Past Competitions
      {past.length > 0 && (
        <>
          <div className="divider" />
          <section className="py-20 px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
              <ScrollReveal>
                <div className="flex items-center gap-3 mb-8">
                  <Trophy className="w-5 h-5 text-cream/20" />
                  <h2
                    className="text-2xl font-bold text-cream/30"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    Past Competitions
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {past.map((comp) => (
                    <div
                      key={comp.id}
                      className="card-premium p-6 group opacity-50 hover:opacity-100 transition-opacity"
                    >
                      <div className="flex items-center gap-2 mb-3">
                        {comp.partnerLogo && (
                          <Image
                            src={comp.partnerLogo}
                            alt={comp.partnerName || ""}
                            width={20}
                            height={20}
                            className="object-contain rounded"
                          />
                        )}
                        <h3
                          className="font-bold text-cream group-hover:text-gold transition-colors"
                          style={{ fontFamily: "var(--font-display)" }}
                        >
                          {comp.name}
                        </h3>
                      </div>
                      <p className="text-xs text-cream/20 mb-3">
                        {comp.shortDescription}
                      </p>
                      <Link
                        href={`/competitions/${comp.slug}`}
                        className="btn-ghost w-full text-xs py-2 justify-center"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>
          </section>
        </>
      )} */}
    </div>
  );
}
