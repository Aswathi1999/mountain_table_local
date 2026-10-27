"use client";

import { animate, motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { EASE } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";

/**
 * The guest rating: the number counts up from 0.0 and the five stars fill one after another with a soft gold glow.
 * It renders only when a real rating is set in `HOME_FX.reviews.rating` (the site publishes none, so nothing is invented).
 */
export function RatingBadge() {
  const rating = HOME_FX.reviews.rating;
  const out = HOME_FX.reviews.ratingOutOf;
  const motionOk = useAllowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.6 });
  const [value, setValue] = useState(rating ?? 0);

  useEffect(() => {
    if (rating === null || !motionOk) return;
    // Counting up is a one-shot animation of a displayed number, driven from the animation callback.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setValue(0);
  }, [rating, motionOk]);
  useEffect(() => {
    if (rating === null || !motionOk || !seen) return;
    const c = animate(0, rating, { duration: 1.6, ease: EASE, onUpdate: (v) => setValue(v) });
    return () => c.stop();
  }, [rating, motionOk, seen]);

  if (rating === null) return null;
  return (
    <div ref={ref} className="mt-8 flex items-center gap-5" role="img" aria-label={`Rated ${rating} out of ${out}`}>
      <span className="t-num text-[3rem] leading-none tabular-nums" aria-hidden="true">
        {value.toFixed(1)}
      </span>
      <span className="flex gap-1.5" aria-hidden="true">
        {Array.from({ length: out }, (_, i) => (
          <motion.svg
            key={i}
            viewBox="0 0 24 24"
            className="size-6"
            fill="currentColor"
            initial={
              motionOk
                ? { opacity: 0.25, color: "rgba(184,147,46,0.3)", filter: "drop-shadow(0 0 0 rgba(184,147,46,0))" }
                : false
            }
            animate={
              seen || !motionOk
                ? {
                    opacity: i < Math.round(rating) ? 1 : 0.3,
                    color: "#B8912F",
                    filter: "drop-shadow(0 0 6px rgba(184,147,46,0.7))",
                  }
                : undefined
            }
            transition={{ duration: 0.7, ease: EASE, delay: 0.5 + i * 0.22 }}
          >
            <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z" />
          </motion.svg>
        ))}
      </span>
      <span className="t-small opacity-70" aria-hidden="true">
        out of {out}
      </span>
    </div>
  );
}
