import type { Metadata } from "next";
import TypewriterTeamTitle from "@/components/TypewriterTeamTitle";
import Image from "next/image";
import { Mail, Phone, Linkedin, User } from "lucide-react";
import { teamMembers } from "@/data/team";
import ManagerCard from "@/components/ManagerCard";
import ConvenerWall from "@/components/ConvenerWall";
import RevealWords from "@/components/motion/RevealWords";
export const metadata: Metadata = {
  title: "Team — Finance Club IIT Bombay",
  description: "Meet the team behind Finance Club IIT Bombay.",
};

function TeamCard({ member, accent }: { member: typeof teamMembers[0]; accent: "gold" | "crimson" }) {
  const isGold = accent === "gold";
  const photoSrc = member.photo.startsWith("/") ? member.photo : `/${member.photo.trim()}`;
  return (
    <div className={`${isGold ? "card-glow-gold" : "card-glow-crimson"} p-8 group text-center w-[350px] h-[350px] flex flex-col justify-start`}>
      <div
        className={`relative w-[120px] h-[150px] mx-auto mb-6 overflow-hidden rounded-full border-2 ${isGold ? "border-gold/55" : "border-crimson/35"} bg-black/20 shadow-[0_0_22px_rgba(245,183,49,0.14),inset_0_1px_10px_rgba(0,0,0,0.45)] transition-all duration-250 ease-out group-hover:scale-[1.03] group-hover:${isGold ? "border-gold/75" : "border-crimson/55"}`}
      >
        <Image
          src={photoSrc}
          alt={member.name}
          fill
          sizes="116px"
          className="object-cover object-center transition-transform duration-250 ease-out group-hover:scale-[1.03]"
          unoptimized
          priority={member.category === "manager"}
        />
      </div>

      <h1 className="font-bold text-lg text-cream group-hover:text-gold transition-colors" style={{ fontFamily: "var(--font-display)" }}>{member.name}</h1>
      <p className="text-[15px] text-cream/25 mt-0.5 mb-4">{member.role}</p>

      <div className="space-y-2 text-xs">
        {/* <a href={`mailto:${member.email}`} className="flex items-center gap-2 text-cream/25 hover:text-gold transition-colors justify-center">
          <Mail className="w-3.5 h-3.5 text-gold/30" />
          <span className="truncate">{member.email}</span>
        </a> */}
        <a href={`tel:${member.phone}`} className="flex items-center gap-2 text-cream/25 hover:text-gold transition-colors justify-center">
          <Phone className="w-3.5 h-3.5 text-gold/30" />
          <span>{member.phone}</span>
        </a>
        <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-cream/25 hover:text-gold transition-colors justify-center">
          <Linkedin className="w-3.5 h-3.5 text-gold/30" />
          <span>LinkedIn</span>
        </a>
      </div>
    </div>
  );
}



export default function TeamPage() {
  const managers = teamMembers.filter((m) => m.category === "manager");
  const conveners = teamMembers.filter((m) => m.category === "convener");

  return (
    <div>
      {/* Hero — unchanged, exactly as you have it */}
      <section className="relative min-h-[85svh] sm:min-h-screen flex items-center pt-28 sm:pt-32 pb-16 sm:pb-20 px-4 sm:px-6 lg:px-8 grain overflow-hidden">
        {/* ...your existing hero code stays exactly as-is... */}
        <div className="absolute inset-0">
    <Image
      src="/Finance-Club/team.JPG"
      alt="Finance Club team background"
      fill
      priority
      sizes="100vw"
      className="object-cover"
    />
  </div>
  <div className="absolute inset-0 bg-black/70" />
  <div className="absolute inset-0 pointer-events-none opacity-35 bg-[radial-gradient(circle_at_top_left,rgba(245,183,49,0.12),transparent_32%),radial-gradient(circle_at_bottom_right,rgba(27,107,64,0.14),transparent_28%)]" />

  <div className="relative z-10 max-w-4xl mx-auto">
    <div className="hero-shine backdrop-blur-md bg-black/35 border border-cream/10 rounded-3xl px-6 py-9 sm:px-10 sm:py-12">
      <div className="badge-pill badge-gold mb-6">The People</div>
<TypewriterTeamTitle />
    </div>
  </div>
      </section>

      <div className="divider" />

      {/* ===== TEAM — ONE CONTINUOUS SECTION ===== */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 mesh-gold grain relative">
        <div className="max-w-5xl mx-auto">

          {/* Managers — inside a glass panel */}
          <div className="backdrop-blur-md bg-black/30 border border-cream/10 rounded-3xl px-5 py-10 sm:px-12 mb-10 sm:mb-16 max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="badge-pill badge-gold mb-4">Leadership</div>
              <h2 className="text-4xl sm:text-5xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
                <RevealWords text="Managers" className="text-gradient-gold" />
                {" "}
              </h2>
            </div>
            <div className="mx-auto flex w-fit flex-col items-center gap-8 sm:flex-row sm:gap-10 lg:gap-12">
              {managers.map((m) => <ManagerCard key={m.id} member={m} />)}
            </div>
          </div>

          {/* Conveners — same page, no divider, no mesh change */}
          {/* Conveners — same glass box width, same card design, 3D rotating carousel */}
<div className="backdrop-blur-md bg-black/30 border border-cream/10 rounded-3xl px-4 py-10 sm:py-14 sm:px-10 lg:px-12 max-w-5xl mx-auto overflow-hidden">
  <div className="text-center mb-12">
    <div className="badge-pill badge-gold mb-4">Core Team</div>
    <h2 className="text-4xl sm:text-5xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>
      <RevealWords text="Conveners" className="text-gradient-gold" />
      {" "}
    </h2>
  </div>
  <ConvenerWall conveners={conveners} />
</div>

        </div>
      </section>
    </div>
  );
}
