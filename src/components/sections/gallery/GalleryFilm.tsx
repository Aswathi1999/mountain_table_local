"use client";

import { motion, useInView, useScroll, useTransform } from "motion/react";
import { FilmEdge } from "@/components/decor";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GALLERY_FX } from "@/components/motion/home-fx.config";
import { Lines, Reveal } from "@/components/motion/primitives";
import { DUR, EASE, EASE_REVEAL } from "@/components/motion/tokens";
import { useAllowMotion, useNearViewport } from "@/components/motion/useAllowMotion";
import { StoryDialog } from "@/components/sections/home/HomeDiscover";

const film = GALLERY_FX.film;

/** The camera shutter: blades that cover the band, then slide outward so the opening grows from the centre. Plays once. */
function Iris({ go, onDone }: { go: boolean; onDone: () => void }) {
  const n = film.blades;
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 size-full"
      viewBox="0 0 1000 1000"
      preserveAspectRatio="xMidYMid slice"
    >
      {Array.from({ length: n }, (_, i) => (
        <g key={i} transform={`translate(500 500) rotate(${(360 / n) * i})`}>
          <motion.rect
            x={-1800}
            y={-2940}
            width={3600}
            height={3000}
            fill="#0A221B"
            stroke="rgba(247,244,237,0.14)"
            strokeWidth="2"
            initial={{ y: 0 }}
            animate={{ y: go ? -940 : 0 }}
            transition={{ duration: film.iris, ease: EASE_REVEAL, delay: i * 0.025 }}
            onAnimationComplete={i === n - 1 && go ? onDone : undefined}
          />
        </g>
      ))}
    </svg>
  );
}

/**
 * "In motion": a wide dusk photograph under a green wash, a round play button and a heading, opening the property film. As the
 * band enters view a camera shutter opens outward over the photograph (once); the photograph then drifts slowly with the scroll
 * and the text arrives in turn. A thin ring draws itself round the play button on a 3 second loop (paused off screen). Pressing
 * the button grows a circle from it to fill the screen and then the film opens; closing shrinks the circle back into the button.
 * Settings: `GALLERY_FX.film`.
 */
export function GalleryFilm() {
  const reduce = useReducedMotion();
  const wide = useAllowMotion(film.parallaxMinWidth);
  const fx = film.enabled && !reduce;
  const sectionRef = useRef<HTMLElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const seen = useInView(sectionRef, { once: true, amount: 0.35 });
  const nearButton = useNearViewport(buttonRef, "0px");
  const [armed, setArmed] = useState(false);
  const [photoReady, setPhotoReady] = useState(false);
  const [irisDone, setIrisDone] = useState(false);
  const [open, setOpen] = useState(false);
  const openRef = useRef(false);
  const origin = useRef({ cx: 0, cy: 0 });
  const [morph, setMorph] = useState<{ cx: number; cy: number; mode: "in" | "out" } | null>(null);

  // The shutter is only drawn once the page is running, so the band is fully readable without JavaScript.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setArmed(true);
    // The shutter opens on the photograph, so it waits until the photograph has loaded (it may already be cached).
    if (sectionRef.current?.querySelector("img")?.complete) setPhotoReady(true);
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [`-${wide && fx ? film.parallax : 0}%`, `${wide && fx ? film.parallax : 0}%`],
  );
  const base = fx ? 0.9 : 0;

  const press = () => {
    const r = buttonRef.current?.getBoundingClientRect();
    openRef.current = true;
    if (!fx || !r) return setOpen(true);
    origin.current = { cx: r.left + r.width / 2, cy: r.top + r.height / 2 };
    setMorph({ ...origin.current, mode: "in" });
  };
  const closed = () => {
    if (!openRef.current) return;
    openRef.current = false;
    setOpen(false);
    if (fx) setMorph({ ...origin.current, mode: "out" });
  };

  return (
    <section
      ref={sectionRef}
      aria-labelledby="film-title"
      className="bg-forest-deep text-ivory relative isolate overflow-hidden py-24 text-center desk:py-32"
    >
      <motion.div className="absolute inset-x-0 -inset-y-[10%] -z-10 will-change-transform" style={{ y }}>
        <Image
          src="/images/about/quote.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "70% 50%" }}
          onLoad={() => setPhotoReady(true)}
        />
      </motion.div>
      <div aria-hidden="true" className="bg-forest-deep/70 absolute inset-0 -z-10" />
      <FilmEdge />
      {fx && armed && !irisDone ? <Iris go={seen && photoReady} onDone={() => setIrisDone(true)} /> : null}
      <div className="wrap flex flex-col items-center">
        <Reveal delay={base}>
          <p className="t-eyebrow text-ivory justify-center after:hidden">
            <motion.span
              data-motion=""
              aria-hidden="true"
              className="bg-gold block h-px w-14 origin-right"
              initial={fx ? { scaleX: 0 } : false}
              animate={{ scaleX: seen || !fx ? 1 : 0 }}
              transition={{ duration: DUR.line, ease: EASE, delay: base }}
            />
            In motion
            <motion.span
              data-motion=""
              aria-hidden="true"
              className="bg-gold block h-px w-14 origin-left"
              initial={fx ? { scaleX: 0 } : false}
              animate={{ scaleX: seen || !fx ? 1 : 0 }}
              transition={{ duration: DUR.line, ease: EASE, delay: base }}
            />
          </p>
        </Reveal>
        <Reveal delay={base + 0.12} className="mt-8">
          <div className="relative size-20">
            {fx ? (
              <svg
                aria-hidden="true"
                viewBox="0 0 100 100"
                className="gal-ring pointer-events-none absolute -inset-3 size-[calc(100%+1.5rem)] -rotate-90"
                fill="none"
                stroke="rgba(247,244,237,0.6)"
                strokeWidth="1"
                style={{ animationPlayState: nearButton ? "running" : "paused" }}
              >
                <circle
                  cx="50"
                  cy="50"
                  r="49"
                  pathLength="1"
                  style={{ animationPlayState: nearButton ? "running" : "paused" }}
                />
              </svg>
            ) : null}
            <button
              ref={buttonRef}
              type="button"
              onClick={press}
              aria-label="Play the film"
              aria-haspopup="dialog"
              className="border-ivory/70 hover:bg-ivory hover:text-forest-deep text-ivory flex size-full cursor-pointer items-center justify-center rounded-full border bg-transparent transition-colors duration-500"
            >
              <svg viewBox="0 0 24 24" className="ml-1 size-6" fill="currentColor" aria-hidden="true">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </Reveal>
        <Lines
          id="film-title"
          as="h2"
          lines={["Watch Our Story"]}
          delay={base + 0.25}
          className="t-h2 m-0 mt-8 text-center"
        />
      </div>
      <StoryDialog open={open} onClose={closed} />
      {morph ? (
        <motion.div
          key={morph.mode}
          aria-hidden="true"
          className="bg-forest-deep pointer-events-none fixed inset-0 z-[300]"
          initial={{
            clipPath: `circle(${morph.mode === "in" ? 40 : 160}${morph.mode === "in" ? "px" : "vmax"} at ${morph.cx}px ${morph.cy}px)`,
          }}
          animate={{
            clipPath: `circle(${morph.mode === "in" ? 160 : 40}${morph.mode === "in" ? "vmax" : "px"} at ${morph.cx}px ${morph.cy}px)`,
          }}
          transition={{ duration: film.morph, ease: EASE_REVEAL }}
          onAnimationComplete={() => {
            if (morph.mode === "in") {
              setOpen(true);
              window.setTimeout(() => setMorph(null), 600);
            } else setMorph(null);
          }}
        />
      ) : null}
    </section>
  );
}
