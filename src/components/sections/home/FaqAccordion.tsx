"use client";

import { AnimatePresence, motion } from "motion/react";
import { useId, useState } from "react";
import { DUR, EASE, STAGGER, VIEW_ONCE } from "@/components/motion/tokens";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import type { Faq } from "@/data/faq";

/**
 * The questions as a plain accordion: hairline rows, one open at a time (the first starts open), a plus that turns into a minus,
 * and an answer that opens by height with a soft fade. Each question is a real button wired to its answer region, so it works
 * with the keyboard and screen readers; reduced motion opens and closes instantly.
 */
export function FaqAccordion({ items }: { items: readonly Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);
  const reduce = useReducedMotion();
  const base = useId();

  return (
    <ul className="m-0 list-none border-t border-forest/20 p-0">
      {items.map((item, i) => {
        const isOpen = open === i;
        const buttonId = `${base}-q${i}`;
        const panelId = `${base}-a${i}`;
        return (
          <motion.li
            key={item.question}
            data-motion=""
            className="border-b border-forest/20"
            initial={{ opacity: 0, y: reduce ? 0 : 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEW_ONCE}
            transition={{ duration: reduce ? 0 : DUR.ui, ease: EASE, delay: reduce ? 0 : i * STAGGER.tight }}
          >
            <h3 className="m-0">
              <button
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen(isOpen ? null : i)}
                className="group text-forest flex w-full cursor-pointer items-center justify-between gap-6 border-0 bg-transparent py-6 text-left outline-offset-4 focus-visible:outline-2 focus-visible:outline-gold-ink"
              >
                <span
                  className={`font-display [font-size:clamp(1.125rem,1rem+0.5vw,1.375rem)] leading-snug transition-colors duration-300 ${
                    isOpen ? "text-forest" : "text-forest/80 group-hover:text-forest"
                  }`}
                >
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className="text-gold-ink relative block size-4 shrink-0 transition-transform duration-500 group-hover:scale-110"
                >
                  <span className="absolute top-1/2 left-0 block h-px w-full -translate-y-1/2 bg-current" />
                  <span
                    className={`absolute top-0 left-1/2 block h-full w-px -translate-x-1/2 bg-current transition-transform duration-500 ${
                      isOpen ? "scale-y-0" : "scale-y-100"
                    }`}
                  />
                </span>
              </button>
            </h3>
            <AnimatePresence initial={false}>
              {isOpen ? (
                <motion.div
                  key="panel"
                  id={panelId}
                  role="region"
                  aria-labelledby={buttonId}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: reduce ? 0 : 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <p className="t-body text-ink/75 m-0 max-w-[40rem] pb-7 [font-size:0.9375rem] [line-height:1.85]">
                    {item.answer}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}
