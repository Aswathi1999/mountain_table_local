"use client";

import { motion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import { DUR, EASE } from "@/components/motion/tokens";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

/** Seconds each review stays on screen. Paused while the carousel is hovered or focused, and off under reduced motion. */
const HOLD_MS = 7000;

const arrow =
  "flex size-10 cursor-pointer items-center justify-center rounded-full border border-current/30 bg-transparent text-current transition-colors duration-300 hover:border-gold hover:text-gold focus-visible:border-gold focus-visible:text-gold active:scale-95";

/**
 * Guest reviews, kept simple: one quote at a time, centred and set large in the display italic, with a short gold rule and a quiet
 * caption beneath. Thin bars below show which review is up (the current one fills while it waits its turn), with two outline
 * arrows. It advances by itself, holds while the visitor points at or focuses it, and never moves under reduced motion. All reviews
 * share one grid cell, so the section never changes height as they swap.
 */
export function ReviewSlideshow({ reviews }: { reviews: readonly string[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const autoplay = !reduce && !paused;
  const count = reviews.length;

  const goTo = (to: number) => setIndex((to + count) % count);

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % count), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, index, count]);

  return (
    <div
      role="group"
      aria-roledescription="carousel"
      aria-label="Guest reviews"
      onPointerEnter={() => setPaused(true)}
      onPointerLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      style={{ "--review-play": autoplay ? "running" : "paused" } as CSSProperties}
      className="mx-auto flex max-w-[40rem] flex-col items-center text-center"
    >
      <motion.svg
        data-motion=""
        viewBox="0 0 40 32"
        className="text-gold h-5 w-7"
        fill="currentColor"
        aria-hidden="true"
        initial={{ opacity: 0, scale: 0.85 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: DUR.reveal, ease: EASE }}
      >
        <path d="M0 32V19.2C0 8.2 5.6 1.6 15.6 0l1.8 4.6C11.6 6.4 9.2 10 9 14.4h7.4V32H0Zm22.6 0V19.2C22.6 8.2 28.2 1.6 38.2 0L40 4.6c-5.8 1.8-8.2 5.4-8.4 9.8H39V32H22.6Z" />
      </motion.svg>

      <div className="mt-6 grid w-full" aria-live={autoplay ? "off" : "polite"}>
        {reviews.map((text, i) => {
          const on = i === index;
          return (
            <motion.figure
              key={i}
              data-motion=""
              aria-hidden={!on}
              inert={!on}
              initial={false}
              animate={{ opacity: on ? 1 : 0, y: reduce ? 0 : on ? 0 : 14 }}
              transition={{
                duration: reduce ? 0 : on ? DUR.reveal : DUR.micro,
                delay: reduce || !on ? 0 : 0.15,
                ease: EASE,
              }}
              className="m-0 flex flex-col items-center [grid-area:1/1]"
            >
              <blockquote className="m-0">
                <p className="font-display m-0 [font-size:clamp(1.0625rem,0.95rem+0.6vw,1.375rem)] leading-[1.65] italic">
                  {text}
                </p>
              </blockquote>
              <figcaption className="mt-6">
                <span className="text-[11px] tracking-[0.24em] uppercase opacity-60">Guest review {i + 1}</span>
              </figcaption>
            </motion.figure>
          );
        })}
      </div>

      <div className="mt-9 flex items-center gap-5">
        <button type="button" aria-label="Previous review" onClick={() => goTo(index - 1)} className={arrow}>
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M20 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
        <ol className="m-0 flex list-none items-center gap-3 p-0">
          {reviews.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`Show review ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i)}
                className="flex h-6 w-14 cursor-pointer items-center border-0 bg-transparent p-0"
              >
                <span className="relative block h-px w-full bg-current/25">
                  {i === index ? (
                    <span
                      key={index}
                      className="bg-gold absolute inset-y-[-0.5px] left-0 block h-[2px] w-full origin-left"
                      style={{
                        animation: `review-fill ${HOLD_MS}ms linear both`,
                        animationPlayState: "var(--review-play, running)",
                      }}
                    />
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ol>
        <button type="button" aria-label="Next review" onClick={() => goTo(index + 1)} className={arrow}>
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
