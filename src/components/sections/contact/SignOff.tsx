"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { CONTACT_FX } from "@/components/motion/home-fx.config";
import { EASE, EASE_REVEAL, VIEW_ONCE } from "@/components/motion/tokens";

/**
 * "See you soon!" written in with a pen-like wipe, then a tiny heart doodle drawn after it. It plays once when it scrolls into view.
 * Settings: `CONTACT_FX.message`.
 */
export function SignOff({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const fx = CONTACT_FX.message.enabled && !reduce;
  return (
    <span className="relative inline-flex items-center gap-2">
      <motion.span
        data-motion=""
        className="t-script text-clay block text-[1.875rem]"
        initial={fx ? { clipPath: "inset(-20% 100% -20% -2%)" } : false}
        whileInView={{ clipPath: "inset(-20% -6% -20% -2%)" }}
        viewport={VIEW_ONCE}
        transition={{ duration: 1.2, ease: EASE_REVEAL, delay: 0.5 }}
      >
        {text}
      </motion.span>
      <svg
        viewBox="0 0 24 24"
        className="text-clay size-5 shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <motion.path
          d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"
          initial={fx ? { pathLength: 0 } : false}
          whileInView={{ pathLength: 1 }}
          viewport={VIEW_ONCE}
          transition={{ duration: 0.9, ease: EASE, delay: 1.5 }}
        />
      </svg>
    </span>
  );
}
