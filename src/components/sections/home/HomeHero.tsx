"use client";

import { animate, motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { Lines } from "@/components/motion/primitives";
import { DUR, EASE, EASE_REVEAL, PARALLAX_MIN_WIDTH, SCROLL_SPRING } from "@/components/motion/tokens";
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

type Phase = "pending" | "running" | "done";
const headingClass = "t-h1 text-forest m-0 mt-5 desk:mt-6";

/**
 * Hero, a cinematic opening. On wide screens the page first shows the headline as huge letters filled with the film (the film is
 * visible only through the letters, on cream); the letters then shrink to their normal size while the cream drains away until the
 * film fills the hero (about 2.4s, skipped by any scroll, key or touch), and the eyebrow, paragraph and button fade up in turn.
 * Scrolling away zooms the film gently (1 to 1.1), trails it behind the page and lifts the copy. Phones, reduced motion and
 * Data Saver skip the intro and the video (a still image is shown). Timings: `HOME_FX.heroIntro` and `HOME_FX.hero`.
 */
export function HomeHero() {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const [phase, setPhase] = useState<Phase>("pending");
  const [fromIntro, setFromIntro] = useState(false);

  // Decide once, after hydration, whether the intro plays (the server and first paint always show the static hero).
  useEffect(() => {
    const cfg = HOME_FX.heroIntro;
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ok = cfg.enabled && !prefersReduced && window.innerWidth >= cfg.minWidth && window.scrollY < cfg.skipOnScrollPx;
    const next: Phase = ok ? "running" : "done";
    // On a first visit the opening splash covers the page: the intro starts when it has lifted.
    const splash = document
      .getElementById("splash")
      ?.getAnimations()
      .find((x) => x.playState !== "finished");
    if (!splash) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPhase(next);
      return;
    }
    let live = true;
    splash.finished.then(() => live && setPhase(next)).catch(() => live && setPhase(next));
    return () => {
      live = false;
    };
  }, []);

  // Scroll parallax strength (0 on narrow screens), set after mount so server and client markup agree.
  const strength = useMotionValue(0);
  useEffect(() => {
    const update = () =>
      strength.set(HOME_FX.hero.enabled && !reduce && window.innerWidth >= PARALLAX_MIN_WIDTH ? 1 : 0);
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [reduce, strength]);

  const mediaY = useTransform(() => `${progress.get() * PARALLAX * 100 * strength.get()}%`);
  const zoom = useTransform(() => 1 + progress.get() * (HOME_FX.hero.zoomTo - 1) * strength.get());
  const copyY = useTransform(() => -progress.get() * HOME_FX.hero.copyLift * strength.get());
  const copyOpacity = useTransform(progress, [0, 0.55], [1, reduce ? 1 : 0]);

  // The intro: hold the knock-out letters, then shrink them while the cream drains away.
  const overlayRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (phase !== "running") return;
    const overlay = overlayRef.current;
    const ghost = overlay?.querySelector<HTMLElement>("h1");
    if (!overlay || !ghost) return;
    const { hold, open, textScaleFrom, bgFade, skipOnScrollPx } = HOME_FX.heroIntro;
    ghost.style.transform = `scale(${textScaleFrom})`;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      controls.forEach((c) => c.stop());
      window.removeEventListener("wheel", skip);
      window.removeEventListener("touchmove", skip);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("scroll", onScroll);
      setFromIntro(true);
      setPhase("done");
    };
    const skip = () => finish();
    const onScroll = () => window.scrollY > skipOnScrollPx && finish();
    window.addEventListener("wheel", skip, { passive: true });
    window.addEventListener("touchmove", skip, { passive: true });
    window.addEventListener("keydown", skip);
    window.addEventListener("scroll", onScroll, { passive: true });

    const controls = [
      animate(
        ghost,
        { transform: [`scale(${textScaleFrom})`, "scale(1)"] },
        { duration: open, delay: hold, ease: EASE_REVEAL },
      ),
      animate(
        overlay,
        { backgroundColor: [HOME_FX.color.cream, "rgba(247,244,237,0)"] },
        { duration: bgFade, delay: hold + open * 0.25, ease: "easeInOut" },
      ),
    ];
    controls[0].finished.then(finish).catch(() => {});
    return finish;
  }, [phase]);

  const showCopy = phase === "done";
  const copyIn = (delay: number) => ({
    initial: false as const,
    animate: {
      opacity: showCopy ? 1 : 0,
      y: showCopy ? 0 : 24,
      transition: { duration: DUR.reveal, ease: EASE, delay: showCopy ? delay : 0 },
    },
  });

  const copyBlock = (ghost: boolean) => (
    <div className="wrap relative flex h-full flex-col justify-center pb-[clamp(34px,5.4vw,86px)]">
      <p className={`t-eyebrow t-eyebrow-draw ${ghost ? "invisible" : "text-forest"}`}>{hero.eyebrow}</p>
      <h1
        className={`${headingClass} ${ghost ? "origin-left will-change-transform" : ""}`}
        aria-hidden={ghost || undefined}
      >
        {hero.lines.map((l, i) => (
          <span key={l} className="block">
            {l}
            {i < hero.lines.length - 1 ? " " : null}
          </span>
        ))}
      </h1>
      <p className="t-lead invisible m-0 mt-6 max-w-[27em]">{hero.body}</p>
      <div className="invisible mt-9 flex gap-4">
        <span className="btn btn-gold">{hero.cta}</span>
      </div>
    </div>
  );

  return (
    <section
      ref={ref}
      id="hero"
      aria-label="Welcome"
      className="bg-ivory text-forest relative isolate h-[calc(100svh-72px)] min-h-[600px] overflow-hidden desk:h-[calc(100svh-84px)]"
    >
      <motion.div className="absolute inset-0 will-change-transform" style={{ y: mediaY, scale: zoom }}>
        <motion.div
          data-motion=""
          className="absolute inset-0"
          initial={reduce ? false : { scale: 1.06 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.2, ease: EASE }}
        >
          <HeroVideo />
        </motion.div>
      </motion.div>

      {/* The ivory haze that carries the dark headline: strongest at the left, gone by two thirds across. */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(90deg,rgba(246,242,234,0.84)_0%,rgba(246,242,234,0.62)_24%,rgba(246,242,234,0.2)_42%,rgba(246,242,234,0)_60%)] max-desk:bg-[linear-gradient(180deg,rgba(246,242,234,0.82)_0%,rgba(246,242,234,0.6)_50%,rgba(246,242,234,0.12)_100%)]"
        initial={false}
        animate={{ opacity: phase === "running" ? 0 : 1 }}
        transition={{ duration: 0.9, ease: EASE, delay: phase === "running" ? 0 : 0.2 }}
      />

      {/* The intro: black letters on cream, blended with "screen" so the film shows only through the letters. */}
      {phase === "running" ? (
        <div
          ref={overlayRef}
          aria-hidden="true"
          className="absolute inset-0 z-20 [mix-blend-mode:screen] [&_h1]:text-black"
          style={{ backgroundColor: HOME_FX.color.cream }}
        >
          {copyBlock(true)}
        </div>
      ) : null}

      <motion.div
        data-motion=""
        className="wrap relative flex h-full flex-col justify-center pb-[clamp(34px,5.4vw,86px)]"
        style={{ y: copyY, opacity: copyOpacity }}
      >
        <motion.p data-motion="" className="t-eyebrow t-eyebrow-draw text-forest" {...copyIn(0.05)}>
          {hero.eyebrow}
        </motion.p>

        {fromIntro ? (
          <motion.h1
            data-motion=""
            className={headingClass}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { duration: 0.5, ease: EASE } }}
          >
            {hero.lines.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </motion.h1>
        ) : (
          <Lines as="h1" lines={hero.lines} ready={showCopy} delay={0.1} step={0.1} className={headingClass} />
        )}

        <motion.p data-motion="" className="t-lead text-ink/80 m-0 mt-6 max-w-[27em]" {...copyIn(0.25)}>
          {hero.body}
        </motion.p>

        <motion.div data-motion="" className="mt-9 flex flex-wrap items-center gap-4" {...copyIn(0.4)}>
          <BookNowButton href="/rooms-booking">{hero.cta}</BookNowButton>
        </motion.div>
      </motion.div>

      {/* Scroll cue: a mouse outline whose dot travels down and fades every two seconds. */}
      <motion.span
        data-motion=""
        aria-hidden="true"
        className="absolute right-10 bottom-[calc(clamp(34px,5.4vw,86px)+1.5rem)] hidden text-white/85 desk:block"
        initial={false}
        animate={{ opacity: showCopy ? 1 : 0, transition: { delay: showCopy ? 0.9 : 0, duration: DUR.ui } }}
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
