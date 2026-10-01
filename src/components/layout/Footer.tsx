import Link from "next/link";
import Image from "next/image";
import { Mail, Instagram, Linkedin } from "lucide-react";
import logoImg from "../../../public/logo.jpg";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "About", href: "/about" },
      { label: "Competitions", href: "/competitions" },
      { label: "Resources", href: "/resources" },
      { label: "Blog", href: "/blogs" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Team", href: "/team" },
      { label: "Sponsors", href: "/sponsors" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-cream/[0.04] relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-10 md:gap-12">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-3 mb-5">
              <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-gold/15">
                <Image src={logoImg} alt="Finance Club" fill className="object-cover" sizes="40px" />
              </div>
              <div>
                <span className="font-bold text-cream block text-lg" style={{ fontFamily: "var(--font-display)" }}>Finance Club</span>
                <span className="text-[13px] text-cream/40 uppercase tracking-widest">IIT Bombay</span>
              </div>
            </Link>
            <p className="text-lg text-cream/55 max-w-xs mb-6 leading-relaxed">
              Finance education, research, competitions and industry exposure for IIT Bombay students.
            </p>
            <div className="flex items-center gap-3">
              {[
                { icon: Mail, href: "mailto:financeclub@iitb.ac.in", label: "Email" },
                { icon: Instagram, href: "https://instagram.com/finance.iitb", label: "Instagram" },
                { icon: Linkedin, href: "https://linkedin.com/company/finance-club-iitbombay", label: "LinkedIn" },
              ].map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}
                  className="w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-cream/[0.06] flex items-center justify-center text-cream/55 hover:text-gold hover:border-gold/20 transition-all">
                  <s.icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-[15px] font-bold uppercase tracking-[0.2em] text-gold/50 mb-4">{group.title}</h4>
              <ul className="space-y-1">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="inline-block py-1.5 text-lg text-cream/55 hover:text-cream transition-colors">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="divider my-10" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[15px] text-cream/55">
          <span>&copy; {new Date().getFullYear()} Finance Club IIT Bombay</span>
          <span>Built by the Finance Club, IIT Bombay</span>
        </div>
      </div>
    </footer>
  );
}
