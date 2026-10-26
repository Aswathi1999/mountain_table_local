"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useEffect, useRef } from "react";
import { Lines } from "@/components/motion/primitives";
import { DUR, EASE, HERO, PARALLAX_MIN_WIDTH, SCROLL_SPRING } from "@/components/motion/tokens";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { CurveEdge } from "@/components/ui/decor";
import { HeroVideo } from "@/components/ui/HeroVideo";

/** Hero copy, as set in the approved design reference. */
const hero = {
  eyebrow: "A luxury mountain escape",
  lines: ["Nature’s Beauty,", "Your Perfect Stay"],
  body: "Experience the perfect blend of luxury, comfort, and breathtaking views at The Mountain Table. Your mountain escape awaits.",
  cta: "Explore Rooms",
} as const;

/** Fraction of the scroll the film trails behind the page (about 0.3x). */
const PARALLAX = 0.3;

/**
 * Hero load sequence (timings in `HERO`): the film settles from a slight zoom over 2.5s; the eyebrow fades in while its hairline
 * draws out; the headline lines rise out of a mask one after another; the paragraph and then the button fade up. Scrolling away
 * moves the film at about 0.3x the scroll speed (switched off below 768px) while the copy lifts and fades.
 */
export function HomeHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  // Parallax strength is 1 on wide screens and 0 on narrow ones; it is set after mount so server and client markup agree.
  const strength = useMotionValue(0);
  useEffect(() => {
    const update = () => strength.set(!reduce && window.innerWidth >= PARALLAX_MIN_WIDTH ? 1 : 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reduce, strength]);

  const mediaY = useTransform(() => `${progress.get() * PARALLAX * 100 * strength.get()}%`);
  const copyY = useTransform(progress, [0, 1], [0, reduce ? 0 : -60]);
  const copyOpacity = useTransform(progress, [0, 0.55], [1, reduce ? 1 : 0]);

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Welcome"
      className="bg-ivory text-forest relative isolate h-[calc(100svh-72px)] min-h-[600px] overflow-hidden desk:h-[calc(100svh-84px)]"
    >
      <motion.div
        data-motion=""
        className="absolute inset-0 will-change-transform"
        style={{ y: mediaY }}
        initial={reduce ? false : { scale: HERO.settleScale }}
        animate={{ scale: 1 }}
        transition={{ duration: HERO.settle, ease: EASE }}
      >
        <HeroVideo src="/videos/kling_20261014_VIDEO_Create_a_p_4745_0.mov" />
      </motion.div>
      {/* The ivory haze that carries the dark headline: strongest at the left, gone by two thirds across. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,242,234,0.94)_0%,rgba(246,242,234,0.84)_32%,rgba(246,242,234,0.38)_56%,rgba(246,242,234,0)_78%)] max-desk:bg-[linear-gradient(180deg,rgba(246,242,234,0.9)_0%,rgba(246,242,234,0.78)_55%,rgba(246,242,234,0.25)_100%)]"
      />

      <motion.div
        data-motion=""
        className="wrap relative flex h-full flex-col justify-center pb-[clamp(34px,5.4vw,86px)]"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <motion.p
          data-motion=""
          className="t-eyebrow t-eyebrow-draw text-forest"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: DUR.reveal, ease: EASE, delay: HERO.eyebrow } }}
        >
          {hero.eyebrow}
        </motion.p>

        <Lines
          as="h1"
          immediate
          delay={HERO.lines}
          step={HERO.linesStep}
          lines={hero.lines}
          className="t-h1 text-forest m-0 mt-5 desk:mt-6"
        />

        <motion.p
          data-motion=""
          className="t-lead text-ink/80 m-0 mt-6 max-w-[27em]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE, delay: HERO.body } }}
        >
          {hero.body}
        </motion.p>

        <motion.div
          data-motion=""
          className="mt-9 flex flex-wrap items-center gap-4"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE, delay: HERO.button } }}
        >
          <BookNowButton href="/rooms-booking">{hero.cta}</BookNowButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue: a mouse outline whose dot travels down and fades every two seconds. */}
      <motion.span
        data-motion=""
        aria-hidden="true"
        className="absolute right-10 bottom-[calc(clamp(34px,5.4vw,86px)+1.5rem)] hidden text-white/85 desk:block"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { delay: HERO.button + 0.3, duration: DUR.ui } }}
      >
        <svg viewBox="0 0 24 38" className="h-10 w-6" fill="none" stroke="currentColor" strokeWidth="1.3">
          <rect x="2" y="2" width="20" height="34" rx="10" />
          <circle className="mouse-dot" cx="12" cy="11" r="2" fill="currentColor" stroke="none" />
        </svg>
      </motion.span>
      <CurveEdge />
    </section>
  );
}
