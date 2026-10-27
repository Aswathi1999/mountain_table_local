"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import type { ReactNode } from "react";
import { ABOUT_FX } from "./home-fx.config";
import { DUR, EASE, EASE_REVEAL, VIEW_ONCE } from "./tokens";

/**
 * Small building blocks for the About page's "story being told" motion. Everything reads `ABOUT_FX` (home-fx.config.ts) and
 * animates only opacity, transform, clip-path, filter or SVG strokes. With an effect switched off, or for visitors who prefer
 * reduced motion (the global CSS shows every `data-motion` element), the content is simply there.
 */

/** A paragraph that settles like ink on paper: fades in from a slight blur while rising a few pixels. */
export function InkReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { enabled, blur, inkRise } = ABOUT_FX.story;
  return (
    <motion.div
      data-motion=""
      className={className}
      initial={enabled ? { opacity: 0, filter: `blur(${blur}px)`, y: inkRise } : false}
      whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
      viewport={VIEW_ONCE}
      transition={{ duration: 1.25, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** A soft band of shadow that sweeps once across the photograph it sits in, like a page turning. Place it inside the frame. */
export function PageSweep({ delay = 0.2 }: { delay?: number }) {
  const { enabled, sweepOpacity } = ABOUT_FX.story;
  const reduce = useReducedMotion();
  if (!enabled || reduce) return null;
  return (
    <motion.span
      aria-hidden="true"
      className="pointer-events-none absolute inset-y-0 -left-1/2 z-10 w-1/2 will-change-transform"
      style={{
        background: `linear-gradient(90deg, rgba(10,34,27,0) 0%, rgba(10,34,27,${sweepOpacity}) 65%, rgba(10,34,27,0) 100%)`,
      }}
      initial={{ x: "260%", opacity: 1 }}
      whileInView={{ x: "-20%", opacity: [1, 1, 0] }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 1.5, ease: EASE_REVEAL, delay }}
    />
  );
}

/** A photograph placed into an album: it starts a little higher and tilted, then settles. */
export function PhotoDrop({ children, className }: { children: ReactNode; className?: string }) {
  const { enabled, drop } = ABOUT_FX.story;
  return (
    <motion.div
      data-motion=""
      className={className}
      initial={enabled ? { opacity: 0, y: drop.y, rotate: drop.rotate } : false}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={VIEW_ONCE}
      transition={{
        opacity: { duration: 0.5, ease: EASE, delay: drop.delay },
        y: { type: "spring", stiffness: 90, damping: 15, mass: 1, delay: drop.delay },
        rotate: { type: "spring", stiffness: 70, damping: 13, mass: 1, delay: drop.delay },
      }}
    >
      {children}
    </motion.div>
  );
}

/** A decorative shape that grows softly from a smaller size as it enters. */
export function ScalePop({
  children,
  className,
  delay = 0,
}: {
  children?: ReactNode;
  className?: string;
  delay?: number;
}) {
  const { enabled, disc } = ABOUT_FX.story;
  return (
    <motion.div
      data-motion=""
      aria-hidden="true"
      className={className}
      initial={enabled ? { opacity: 0, scale: disc.scaleFrom } : false}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEW_ONCE}
      transition={{ duration: DUR.settle, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/**
 * A short script label that is written in from left to right, like a pen. It plays when the nearest ancestor `motion` element
 * with `initial="hidden"` / `whileInView="show"` variants reaches "show", so it can follow a tile's own reveal.
 */
export function Handwrite({ children, className }: { children: string; className?: string }) {
  const { enabled, labelDelay } = ABOUT_FX.tiles;
  return (
    <motion.span
      data-motion=""
      className={className}
      variants={
        enabled
          ? {
              hidden: { clipPath: "inset(-20% 100% -20% -2%)" },
              show: {
                clipPath: "inset(-20% -6% -20% -2%)",
                transition: { duration: 1.1, ease: EASE_REVEAL, delay: labelDelay },
              },
            }
          : undefined
      }
    >
      {children}
    </motion.span>
  );
}
