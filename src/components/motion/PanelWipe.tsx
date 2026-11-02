"use client";

import { motion, useInView } from "motion/react";
import { useRef, type ReactNode } from "react";
import { DUR, EASE_REVEAL, VIEW_ONCE } from "./tokens";

/**
 * A coloured panel that is uncovered with a clip-path wipe as it scrolls into view (a quiet entrance that frames the content
 * placed inside it). The observer watches an unclipped wrapper: a fully clipped element reports as never visible and would
 * never start its own wipe. Reduced-motion visitors see it finished (global CSS resolves every `data-motion` element).
 * `className` positions the wrapper; `panelClassName` paints the panel.
 */
export function PanelWipe({
  children,
  className = "",
  panelClassName = "",
  from = "right",
  delay = 0,
}: {
  children?: ReactNode;
  className?: string;
  panelClassName?: string;
  from?: "left" | "right";
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, VIEW_ONCE);
  const closed = from === "right" ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)";
  return (
    <div ref={ref} aria-hidden={children ? undefined : true} className={className}>
      <motion.div
        data-motion=""
        className={`size-full ${panelClassName}`}
        initial={{ clipPath: closed }}
        animate={{ clipPath: seen ? "inset(0 0 0 0)" : closed }}
        transition={{ duration: DUR.image, ease: EASE_REVEAL, delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
