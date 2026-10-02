import { notFound } from "next/navigation";
import Link from "next/link";

import { ArrowLeft, ArrowRight, Calendar, Clock, PenLine } from "lucide-react";

import { blogPosts } from "@/data/blogs";
import ReadingProgress from "@/components/blog/ReadingProgress";
import { StaggerGrid, StaggerItem } from "@/components/StaggerReveal";

type PageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
  };
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.slug === slug);
  if (!post) notFound();

  const words = post.content.split(/\s+/).filter(Boolean).length;
  const readMinutes = Math.max(1, Math.round(words / 200));
  const more = blogPosts.filter((p) => p.slug !== post.slug).slice(0, 2);

  // Index of the first plain paragraph — it gets an editorial drop cap.
  const lines = post.content.split("\n");
  const firstParagraph = lines.findIndex((l) => {
    const t = l.trim();
    return t !== "" && !t.startsWith("## ") && !t.startsWith("- ") && !/^\d+\.\s/.test(t) && !t.startsWith("*");
  });

  return (
    <div className="min-h-screen bg-[#0D0A0A] text-cream">
      <ReadingProgress />

      {/* ==================== HERO ==================== */}
      <section className="pt-28 sm:pt-32 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 mb-5 rounded-full border border-cream/10 bg-black/30 px-4 py-2 text-sm text-cream/65 hover:text-gold hover:border-gold/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            All insights
          </Link>

          <div className="hero-shine relative overflow-hidden rounded-3xl border border-gold/15 bg-[linear-gradient(120deg,#1b130e_0%,#2a1b11_50%,#140f0c_100%)] px-6 py-9 sm:px-10 sm:py-12">
            <div className="absolute -top-28 -right-20 w-80 h-80 rounded-full bg-gold/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-32 -left-24 w-80 h-80 rounded-full bg-[#1B6B40]/15 blur-3xl pointer-events-none" />

            <div className="relative">
              <div className="badge-pill badge-gold mb-5">Finance Club Insights</div>

              <h1
                className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.12] tracking-tight text-[#FFF8EC]"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {post.title}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-cream/60">
                <span className="inline-flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gold" />
                  {formatDate(post.date)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gold" />
                  {readMinutes} min read
                </span>
                <span className="inline-flex items-center gap-2">
                  <PenLine className="w-4 h-4 text-gold" />
                  {post.author}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== ARTICLE ==================== */}
      <article className="max-w-3xl mx-auto px-5 sm:px-6 pt-12 sm:pt-14 pb-16">
        {/* Lede */}
        <p
          className="border-l-2 border-gold/60 pl-5 text-xl sm:text-2xl leading-relaxed text-cream/85 mb-12"
          style={{ fontFamily: "var(--font-body)" }}
        >
          {post.excerpt}
        </p>

        <div className="blog-content">
          {lines.map((line, i) => {
            const trimmedLine = line.trim();

            /* Section heading */
            if (trimmedLine.startsWith("## ")) {
              return (
                <h2
                  key={i}
                  className="flex items-center gap-3 text-2xl sm:text-[1.75rem] font-bold text-[#FFF8EC] mt-12 mb-5 leading-snug"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  <span className="h-6 w-1 rounded-full bg-gradient-to-b from-gold-light to-gold-dark shrink-0" />
                  {trimmedLine.replace("## ", "")}
                </h2>
              );
            }

            /* Bullet points */
            if (trimmedLine.startsWith("- ")) {
              return (
                <div key={i} className="flex gap-3 text-base sm:text-lg leading-relaxed text-cream/75 mb-3">
                  <span className="mt-[0.7em] w-1.5 h-1.5 rounded-full bg-gold shrink-0" />
                  <span>{renderBoldText(trimmedLine.replace("- ", ""))}</span>
                </div>
              );
            }

            /* Numbered list */
            if (/^\d+\.\s/.test(trimmedLine)) {
              const number = trimmedLine.match(/^(\d+)\./)?.[1];
              const text = trimmedLine.replace(/^\d+\.\s/, "");
              return (
                <div key={i} className="flex gap-4 text-base sm:text-lg leading-relaxed text-cream/75 mb-4">
                  <span className="shrink-0 w-7 h-7 rounded-lg bg-gold/10 border border-gold/20 text-gold text-sm font-bold flex items-center justify-center tabular-nums mt-0.5">
                    {number}
                  </span>
                  <span>{renderBoldText(text)}</span>
                </div>
              );
            }

            /* Italic / emphasis line */
            if (trimmedLine.startsWith("*") && trimmedLine.endsWith("*") && !trimmedLine.startsWith("**")) {
              return (
                <p key={i} className="text-base sm:text-lg italic text-cream/55 my-6">
                  {trimmedLine.slice(1, -1)}
                </p>
              );
            }

            /* Empty line */
            if (trimmedLine === "") {
              return <div key={i} className="h-2" />;
            }

            /* Normal paragraph — the first one gets an editorial drop cap */
            const isFirst = i === firstParagraph;
            return (
              <p
                key={i}
                className={`text-base sm:text-lg leading-[1.85] text-cream/75 mb-6 ${
                  isFirst
                    ? "first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:leading-[0.8] first-letter:font-bold first-letter:text-gold"
                    : ""
                }`}
              >
                {renderBoldText(trimmedLine)}
              </p>
            );
          })}
        </div>
      </article>

      {/* ==================== MORE INSIGHTS ==================== */}
      {more.length > 0 && (
        <section className="px-4 sm:px-6 pb-20 sm:pb-28">
          <div className="max-w-4xl mx-auto">
            <div className="divider-glow mb-10" />
            <div className="flex items-end justify-between gap-4 mb-6">
              <h2 className="text-2xl sm:text-3xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
                More <span className="text-gradient-gold">insights</span>
              </h2>
              <Link href="/blogs" className="inline-flex items-center gap-1.5 text-sm text-cream/60 hover:text-gold transition-colors">
                All posts <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4" stagger={0.1}>
              {more.map((p) => (
                <StaggerItem key={p.slug} className="h-full">
                  <Link
                    href={`/blogs/${p.slug}`}
                    className="group flex h-full flex-col rounded-2xl border border-cream/[0.08] bg-[#141010]/70 p-6 hover:border-gold/30 transition-colors"
                  >
                    <span className="text-xs uppercase tracking-wider text-cream/45 mb-2">{formatDate(p.date)}</span>
                    <h3
                      className="font-bold text-lg sm:text-xl text-cream group-hover:text-gold transition-colors leading-snug"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm sm:text-base text-cream/60 leading-relaxed line-clamp-2">{p.excerpt}</p>
                    <span className="mt-auto pt-4 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-cream/50 group-hover:text-gold transition-colors">
                      Read <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
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

/* ==================== BOLD TEXT HELPER ==================== */

function renderBoldText(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);

  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={index} className="font-semibold text-[#F5E6D0]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={index}>{part}</span>;
  });
}
