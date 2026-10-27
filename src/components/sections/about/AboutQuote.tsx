"use client";

import {
  motion,
  useInView,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { RidgeDivider } from "@/components/decor";
import Image from "next/image";
import { useRef, useState } from "react";
import { ABOUT_FX } from "@/components/motion/home-fx.config";
import { Reveal } from "@/components/motion/primitives";
import { EASE, SCROLL_SPRING } from "@/components/motion/tokens";
import { useNearViewport } from "@/components/motion/useAllowMotion";
import { useAboutFx } from "@/components/motion/useHomeFx";
import { StoryDialog } from "@/components/sections/home/HomeDiscover";

/** The vision sentence from the existing story, set as a pull quote. */
const quote =
  "Driven by a vision of eco-friendly hospitality, The Mountain Table emerged as a haven where nature's harmony thrives.";
const words = quote.split(" ");

/** One word of the quote: dim until the scroll reaches it, then fully bright, so the reader "reads along". */
function Word({ word, i, p, on }: { word: string; i: number; p: MotionValue<number>; on: boolean }) {
  const n = words.length;
  const from = i / n;
  const opacity = useTransform(p, [from, Math.min(1, from + 2.5 / n)], [on ? ABOUT_FX.quote.wordFloor : 1, 1], {
    clamp: true,
  });
  return (
    <motion.span data-motion="" style={{ opacity }}>
      {word}
      {i < n - 1 ? " " : null}
    </motion.span>
  );
}

/**
 * The quote band, as in the About design: deep green on the left fading into a terrace photograph on the right, a gold quote mark,
 * the quote in the serif italic, and a "Watch Our Story" button that opens the property film. The photograph zooms slowly with the
 * scroll, the quote mark draws, the words brighten as they are read, and a soft ring pulses around the button while it is on screen.
 */
export function AboutQuote() {
  const [open, setOpen] = useState(false);
  const on = useAboutFx("quote");
  const reduce = useReducedMotion();
  const enabled = ABOUT_FX.quote.enabled;
  const sectionRef = useRef<HTMLElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const markRef = useRef<SVGSVGElement>(null);
  const buttonRef = useRef<HTMLSpanElement>(null);
  const markSeen = useInView(markRef, { once: true, amount: 0.8 });
  const near = useNearViewport(buttonRef);

  const { scrollYProgress: zoomRaw } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const zoomP = useSpring(zoomRaw, SCROLL_SPRING);
  const scale = useTransform(zoomP, [0, 1], [1, on ? ABOUT_FX.quote.zoomTo : 1]);
  const { scrollYProgress: readRaw } = useScroll({ target: quoteRef, offset: ["start 85%", "end 50%"] });
  const readP = useSpring(readRaw, SCROLL_SPRING);
  // The signature appears once the last words have been reached.
  const [signatureOn, setSignatureOn] = useState(false);
  useMotionValueEvent(readP, "change", (v) => v > 0.92 && setSignatureOn(true));

  return (
    <section
      ref={sectionRef}
      aria-label="In our words"
      className="bg-forest-deep text-ivory relative isolate overflow-hidden py-24 desk:py-32"
    >
      <motion.div className="absolute inset-0 -z-10 will-change-transform" style={{ scale }}>
        <Image
          src="/images/about/quote.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "right center" }}
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0a221b_0%,#0a221b_38%,rgba(10,34,27,0.55)_70%,rgba(10,34,27,0.25)_100%)] max-desk:bg-[rgba(10,34,27,0.78)]"
      />
      <RidgeDivider color="var(--color-ivory)" height="clamp(40px, 6vw, 92px)" />
      <div className="wrap">
        <div className="max-w-[35rem]">
          <svg
            ref={markRef}
            viewBox="0 0 48 40"
            className="text-gold-soft h-9 w-11"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <motion.path
              data-motion=""
              d="M0 40V22C0 9 7 2 19 0l2 5c-7 2-10 7-10 13h9v22zm27 0V22C27 9 34 2 46 0l2 5c-7 2-10 7-10 13h9v22z"
              initial={enabled ? { pathLength: 0, fillOpacity: 0 } : false}
              animate={
                markSeen || !enabled || reduce ? { pathLength: 1, fillOpacity: 1 } : { pathLength: 0, fillOpacity: 0 }
              }
              transition={{
                pathLength: { duration: 1.4, ease: EASE },
                fillOpacity: { duration: 0.8, ease: EASE, delay: 1.1 },
              }}
              style={{ fill: "currentColor" }}
            />
          </svg>
          <blockquote ref={quoteRef} className="t-quote m-0 mt-6 italic">
            {words.map((w, i) => (
              <Word key={i} word={w} i={i} p={readP} on={on} />
            ))}
          </blockquote>
          <motion.p
            data-motion=""
            className="t-ui text-gold-soft m-0 mt-5 tracking-[0.14em] uppercase [font-size:0.8125rem]"
            initial={enabled ? { opacity: 0 } : false}
            animate={{ opacity: signatureOn || !on ? 1 : 0 }}
            transition={{ duration: 1.1, ease: EASE, delay: 0.4 }}
          >
            — The Mountain Table family
          </motion.p>
          <Reveal delay={0.25} className="mt-10">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group text-ivory inline-flex cursor-pointer items-center gap-4 border-0 bg-transparent p-0"
            >
              <span ref={buttonRef} className="relative flex size-[3.25rem] items-center justify-center">
                {enabled && !reduce ? (
                  <span
                    aria-hidden="true"
                    className="about-ring border-ivory/50 absolute inset-0 rounded-full border"
                    style={{
                      animationDuration: `${ABOUT_FX.quote.pulseSeconds}s`,
                      animationPlayState: near ? "running" : "paused",
                    }}
                  />
                ) : null}
                <span className="border-ivory/60 group-hover:bg-ivory group-hover:text-forest-deep flex size-full items-center justify-center rounded-full border transition-colors duration-500">
                  <svg viewBox="0 0 24 24" className="ml-0.5 size-4" fill="currentColor" aria-hidden="true">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </span>
              </span>
              <span className="t-ui">Watch Our Story</span>
            </button>
          </Reveal>
        </div>
      </div>
      <StoryDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
