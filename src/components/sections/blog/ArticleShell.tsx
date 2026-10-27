"use client";

import { motion, useScroll, useSpring } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useRef, type ReactNode } from "react";

/**
 * The article element plus a reading-progress hairline fixed to the top of the window: it fills from left to right as the
 * article is read (transform only, smoothed with a light spring). Hidden for reduced-motion visitors.
 */
export function ArticleShell({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 28, mass: 0.4 });
  return (
    <article ref={ref} className={className}>
      {reduce ? null : (
        <motion.span
          aria-hidden="true"
          className="bg-gold pointer-events-none fixed inset-x-0 top-0 z-[60] block h-[3px] origin-left"
          style={{ scaleX }}
        />
      )}
      {children}
    </article>
  );
}
