"use client";

import Image from "next/image";
import { Linkedin, Phone } from "lucide-react";
import type { TeamMember } from "@/data/team";
import { StaggerGrid, StaggerItem } from "@/components/StaggerReveal";

function ConvenerTile({ m }: { m: TeamMember }) {
  const photo = m.photo.startsWith("/") ? m.photo : `/${m.photo.trim()}`;

  return (
    <div className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-gold/20 bg-[#141010] shadow-[0_18px_40px_-20px_rgba(0,0,0,0.8)] transition-all duration-500 ease-out hover:-translate-y-1.5 hover:border-gold/55 hover:shadow-[0_24px_60px_-20px_rgba(245,183,49,0.35)]">
      <Image
        src={photo}
        alt={m.name}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 300px"
        className="object-cover object-[center_15%] transition-transform duration-700 ease-out group-hover:scale-105"
      />

      {/* shade so the text always reads — same treatment as the manager cards */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent" />
      {/* gold line that sweeps across the top on hover */}
      <span
        aria-hidden
        className="absolute left-0 top-0 h-px w-full origin-left scale-x-0 bg-gradient-to-r from-transparent via-gold to-transparent transition-transform duration-700 ease-out group-hover:scale-x-100"
      />

      <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5">
        <h3
          className="font-bold text-base sm:text-xl text-gold leading-tight"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {m.name}
        </h3>
        <p className="text-sm sm:text-base text-cream/65 mb-2.5 sm:mb-3">{m.role}</p>
        <div className="space-y-1.5 text-[11px] sm:text-xs">
          <a
            href={`tel:${m.phone.replace(/\s+/g, "")}`}
            className="flex items-center gap-2 text-cream/80 hover:text-gold transition-colors"
          >
            <Phone className="w-3.5 h-3.5 shrink-0 text-gold/70" />
            <span className="whitespace-nowrap">{m.phone}</span>
          </a>
          <a
            href={m.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-cream/80 hover:text-gold transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5 shrink-0 text-gold/70" />
            <span>LinkedIn</span>
          </a>
        </div>
      </div>
    </div>
  );
}

// Split members into columns (left-to-right reading order is kept).
function toColumns(list: TeamMember[], cols: number) {
  return Array.from({ length: cols }, (_, c) => list.filter((_, i) => i % cols === c));
}

/**
 * Conveners as a staggered portrait wall: columns sit at different heights
 * so the tiles step up and down instead of forming flat rows. Three columns
 * from tablets up, two on phones. Full colour everywhere, contacts always
 * visible.
 */
export default function ConvenerWall({ conveners }: { conveners: TeamMember[] }) {
  // vertical offset per column (in rem) — middle column dips down
  const offsets3 = ["0rem", "3.5rem", "0rem"];
  const offsets2 = ["0rem", "2.5rem"];

  return (
    <>
      {/* Phones: two staggered columns */}
      <StaggerGrid className="sm:hidden flex items-start gap-3 pb-10" stagger={0.08}>
        {toColumns(conveners, 2).map((col, c) => (
          <div key={c} className="flex-1 flex flex-col gap-3" style={{ marginTop: offsets2[c] }}>
            {col.map((m) => (
              <StaggerItem key={m.id}>
                <ConvenerTile m={m} />
              </StaggerItem>
            ))}
          </div>
        ))}
      </StaggerGrid>

      {/* Tablets and up: three staggered columns (3 + 3) */}
      <StaggerGrid className="hidden sm:flex items-start gap-5 lg:gap-6 pb-14" stagger={0.08}>
        {toColumns(conveners, 3).map((col, c) => (
          <div key={c} className="flex-1 flex flex-col gap-5 lg:gap-6" style={{ marginTop: offsets3[c] }}>
            {col.map((m) => (
              <StaggerItem key={m.id}>
                <ConvenerTile m={m} />
              </StaggerItem>
            ))}
          </div>
        ))}
      </StaggerGrid>
    </>
  );
}
