"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState, type CSSProperties } from "react";
import { DUR, EASE, SPRING, STAGGER } from "@/components/motion/tokens";

/** Seconds each review stays in the spotlight. Paused while the carousel is hovered or focused, and off under reduced motion. */
const HOLD_MS = 7000;

const arrow =
  "flex size-11 cursor-pointer items-center justify-center rounded-full border border-forest/30 bg-ivory text-forest transition-colors duration-300 hover:bg-forest hover:text-ivory focus-visible:bg-forest focus-visible:text-ivory active:scale-95";

function QuoteMark({ className = "" }: { className?: string }) {
  return (
    <motion.svg
      data-motion=""
      viewBox="0 0 40 32"
      className={className}
      fill="currentColor"
      aria-hidden="true"
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: DUR.reveal, ease: EASE, delay: 0.3 }}
    >
      <path d="M0 32V19.2C0 8.2 5.6 1.6 15.6 0l1.8 4.6C11.6 6.4 9.2 10 9 14.4h7.4V32H0Zm22.6 0V19.2C22.6 8.2 28.2 1.6 38.2 0L40 4.6c-5.8 1.8-8.2 5.4-8.4 9.8H39V32H22.6Z" />
    </motion.svg>
  );
}

function Card({
  text,
  active,
  onSelect,
  index,
}: {
  text: string;
  active: boolean;
  onSelect?: () => void;
  index: number;
}) {
  return (
    <motion.figure
      data-motion=""
      onClick={onSelect}
      animate={{
        y: active ? -10 : 0,
        backgroundColor: active ? "#1f3b2f" : "#fbf9f4",
        color: active ? "#f6f2ea" : "#242323",
      }}
      whileHover={{ y: active ? -14 : -4 }}
      transition={{ ...SPRING.soft, backgroundColor: { duration: DUR.ui }, color: { duration: DUR.ui } }}
      className="relative m-0 flex min-h-[18rem] w-full flex-1 cursor-pointer flex-col overflow-hidden rounded-[10px] p-7 shadow-[0_18px_44px_rgba(31,59,47,0.10)] desk:p-9"
    >
      <QuoteMark className={`h-7 w-9 transition-colors duration-500 ${active ? "text-gold-soft" : "text-gold"}`} />
      <blockquote className="m-0 mt-6 flex-1">
        <p className="t-body m-0 [font-size:1rem] [line-height:1.75]">{text}</p>
      </blockquote>
      <figcaption className="t-small mt-6 opacity-70">Guest review {index + 1}</figcaption>
      {/* Time left in the spotlight. */}
      {active ? (
        <span aria-hidden="true" className="bg-ivory/15 absolute inset-x-0 bottom-0 h-[3px]">
          <span
            className="bg-gold block h-full origin-left"
            style={{
              animation: `review-fill ${HOLD_MS}ms linear both`,
              animationPlayState: "var(--review-play, running)",
            }}
          />
        </span>
      ) : null}
    </motion.figure>
  );
}

/**
 * Guest reviews: three cards side by side with one in the spotlight (forest green, lifted); the spotlight moves along by itself,
 * on a click, or with the arrows, and holds while the visitor points at or focuses the carousel. A thin gold line on the lit card
 * shows the time left. Below 1024px one card is shown at a time, sliding in the direction of travel.
 */
export function ReviewSlideshow({ reviews }: { reviews: readonly string[] }) {
  const [[index, dir], setPage] = useState<[number, number]>([0, 1]);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const autoplay = !reduce && !paused;
  const count = reviews.length;

  const goTo = (to: number, direction: number) => setPage([(to + count) % count, direction]);

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => goTo(index + 1, 1), HOLD_MS);
    return () => window.clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    >
      {/* Wide screens: all three, one lit. */}
      <div className="hidden gap-6 pt-3 lg:grid lg:grid-cols-3" aria-live={autoplay ? "off" : "polite"}>
        {reviews.map((text, i) => (
          <motion.div
            key={i}
            data-motion=""
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: DUR.reveal, ease: EASE, delay: i * STAGGER.base }}
            className="flex"
          >
            <div className="flex flex-1 flex-col">
              <Card text={text} index={i} active={i === index} onSelect={() => goTo(i, i > index ? 1 : -1)} />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Narrow screens: one at a time. */}
      <div className="relative overflow-x-clip pt-3 lg:hidden">
        <AnimatePresence mode="popLayout" initial={false} custom={dir}>
          <motion.div
            key={index}
            custom={dir}
            variants={{
              enter: (d: number) => ({ opacity: 0, x: d * 36 }),
              center: { opacity: 1, x: 0, transition: { duration: DUR.reveal, ease: EASE, delay: 0.1 } },
              exit: (d: number) => ({ opacity: 0, x: -d * 36, transition: { duration: DUR.ui, ease: EASE } }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
          >
            <Card text={reviews[index]} index={index} active />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <ol className="m-0 flex list-none gap-2 p-0">
          {reviews.map((_, i) => (
            <li key={i}>
              <button
                type="button"
                aria-label={`Show review ${i + 1}`}
                aria-current={i === index}
                onClick={() => goTo(i, i > index ? 1 : -1)}
                className="flex size-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
              >
                <span
                  className={`block h-1.5 rounded-full transition-[width,background-color] duration-500 ${
                    i === index ? "bg-forest w-6" : "bg-forest/25 w-1.5"
                  }`}
                />
              </button>
            </li>
          ))}
        </ol>
        <div className="flex gap-2">
          <button type="button" aria-label="Previous review" onClick={() => goTo(index - 1, -1)} className={arrow}>
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
          <button type="button" aria-label="Next review" onClick={() => goTo(index + 1, 1)} className={arrow}>
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
    </div>
  );
}
