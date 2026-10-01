"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import "lenis/dist/lenis.css";

let lenisInstance: Lenis | null = null;

/**
 * Site-wide momentum scrolling (Lenis). Native scroll position is still
 * the source of truth, so sticky/pinned sections and framer-motion's
 * useScroll keep working. Skipped for reduced-motion users; touch devices
 * keep their native scrolling.
 */
export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      allowNestedScroll: true,
      anchors: { offset: -90 },
    });
    lenisInstance = lenis;

    // Modals lock the page with body { overflow: hidden } — pause Lenis
    // while that's set so the page behind doesn't keep scrolling.
    const sync = () => {
      if (document.body.style.overflow === "hidden") lenis.stop();
      else lenis.start();
    };
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });

    return () => {
      mo.disconnect();
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);

  // New page → recalculate the scrollable height.
  useEffect(() => {
    lenisInstance?.resize();
  }, [pathname]);

  return null;
}
