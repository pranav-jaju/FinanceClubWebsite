"use client";

import { useEffect, useRef, useState } from "react";
import { teamMembers } from "@/data/team";
import ManagerCard from "@/components/ManagerCard";

export default function ConvenerCarousel({ conveners }: { conveners: typeof teamMembers }) {
  const ringRef = useRef<HTMLDivElement | null>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rotationRef = useRef(0);
  const isPausedRef = useRef(false);
  const rafRef = useRef<number | null>(null);

  const n = conveners.length;
  // Shrink the ring on narrow screens so the front card stays centred and
  // side cards don't spill off-screen on phones.
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [scale, setScale] = useState(1);
  useEffect(() => {
    const el = sceneRef.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / 640));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const radius = 300 * Math.max(scale, 0.6);
  const angleStep = 360 / n;

  useEffect(() => {
    const speed = 0.6;

    const tick = () => {
      if (!isPausedRef.current) {
        rotationRef.current = (rotationRef.current + speed) % 360;
      }

      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `rotateY(${rotationRef.current}deg)`;
      }

      cardRefs.current.forEach((card, i) => {
        if (!card) return;
        const baseAngle = i * angleStep;
        let effective = (baseAngle + rotationRef.current) % 360;
        if (effective > 180) effective -= 360;
        const distanceFromFront = Math.abs(effective);

        const opacity = 1 - Math.min(distanceFromFront / 140, 0.85);
        const brightness = 0.5 + 0.5 * (1 - Math.min(distanceFromFront / 140, 1));

        card.style.opacity = String(opacity);
        card.style.filter = `brightness(${brightness})`;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [angleStep]);

  return (
    <div
      ref={sceneRef}
      className="carousel-3d-scene relative w-full h-[400px] sm:h-[480px] flex items-center justify-center"
      onTouchStart={() => { isPausedRef.current = true; }}
      onTouchEnd={() => { isPausedRef.current = false; }}
      onMouseEnter={() => { isPausedRef.current = true; }}
      onMouseLeave={() => { isPausedRef.current = false; }}
    >
      <div style={{ transform: `scale(${Math.max(scale, 0.78)})` }} className="carousel-3d-scene">
      <div ref={ringRef} className="carousel-3d-ring">
        {conveners.map((m, i) => {
          const angle = i * angleStep;
          return (
            <div
              key={m.id}
              ref={(el) => { cardRefs.current[i] = el; }}
              className="absolute"
              style={{
                width: 260,
                height: 340,
                left: -130,
                top: -170,
                transform: `rotateY(${angle}deg) translateZ(${radius}px)`,
              }}
            >
              <ManagerCard member={m} compact />
            </div>
          );
        })}
      </div>
      </div>
    </div>
  );
}