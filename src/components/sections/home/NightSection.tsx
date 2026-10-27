"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import { useRef, useState, type ReactNode } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { SCROLL_SPRING } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";
import { useHomeFx } from "@/components/motion/useHomeFx";

/** Stars at fixed positions (deterministic, so server and client agree): [x%, y%, size px, twinkle delay s, twinkle length s]. */
const STARS = Array.from({ length: 80 }, (_, i) => {
  const r = (n: number) => {
    const v = Math.sin(i * 12.9898 + n * 78.233) * 43758.5453;
    return v - Math.floor(v);
  };
  return [r(1) * 100, r(2) * 100, 1 + r(3) * 1.8, r(4) * 5, 3 + r(5) * 4] as const;
});

/**
 * Wraps the Guest Reviews: as the section comes into view its background slowly changes from beige to a dark night green while
 * tiny stars fade in and twinkle. The text colour switches from forest to ivory at the half-way point (so it is readable the whole
 * way, and fully readable if the effect is off). Phones get half as many stars. Settings: `HOME_FX.reviews`.
 */
export function NightSection({ children, className = "" }: { children: ReactNode; className?: string }) {
  const on = useHomeFx("reviews");
  const wide = useAllowMotion(768);
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 90%", "start 25%"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);
  const background = useTransform(p, [0, 1], [HOME_FX.color.beige, HOME_FX.color.night]);
  const starOpacity = useTransform(p, [0.45, 1], [0, 1]);
  const [dark, setDark] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    const next = v > 0.5;
    setDark((d) => (d === next ? d : next));
  });

  const count = on ? (wide ? HOME_FX.reviews.stars : Math.ceil(HOME_FX.reviews.stars / 2)) : 0;

  return (
    <motion.section
      ref={ref}
      id="reviews"
      aria-labelledby="reviews-title"
      className={`relative overflow-hidden transition-colors duration-500 ${className}`}
      style={on ? { backgroundColor: background, color: dark ? HOME_FX.color.cream : HOME_FX.color.forest } : undefined}
      data-night={on && dark ? "true" : undefined}
    >
      {count > 0 ? (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ opacity: starOpacity }}
        >
          {STARS.slice(0, count).map(([x, y, s, d, len], i) => (
            <span
              key={i}
              className="star-twinkle absolute block rounded-full bg-[#fff4de]"
              style={{
                left: `${x}%`,
                top: `${y}%`,
                width: s,
                height: s,
                animationDelay: `${d}s`,
                animationDuration: `${len}s`,
              }}
            />
          ))}
        </motion.div>
      ) : null}
      <div className="relative">{children}</div>
    </motion.section>
  );
}
