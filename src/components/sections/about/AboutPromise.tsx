"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Link from "next/link";
import { useState } from "react";
import { ABOUT_FX } from "@/components/motion/home-fx.config";
import { ImageFrame, Lines, Reveal } from "@/components/motion/primitives";
import { DUR, EASE, VIEW_ONCE } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { copy } from "@/data/copy";

/** The sustainability statement, split into its sentences, plus the vision sentence; all existing wording. */
const points = [
  "Driven by a vision of eco-friendly hospitality, The Mountain Table emerged as a haven where nature's harmony thrives.",
  ...copy.about.commitmentBody.split(/(?<=\.)\s+(?=[A-Z])/),
];

const { enabled, slide, itemStep, leaves, leafMinWidth } = ABOUT_FX.promise;

/** One checklist line: the circle draws first, then the tick inside it, then the text fades in (the parent list staggers the lines). */
function PromiseItem({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const fx = enabled && !reduce;
  const draw = (delay: number, duration: number) => ({
    hidden: { pathLength: 0, opacity: 0 },
    show: { pathLength: 1, opacity: 1, transition: { duration, ease: EASE, delay } },
  });
  return (
    <motion.li
      className="t-small text-ink/80 m-0 flex gap-3.5 [font-size:0.9375rem]"
      variants={{ hidden: {}, show: {} }}
    >
      <svg
        viewBox="0 0 24 24"
        className="text-gold-ink mt-0.5 size-[1.375rem] shrink-0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <motion.circle data-motion="" cx="12" cy="12" r="9" variants={fx ? draw(0, 0.7) : undefined} />
        <motion.path data-motion="" d="M8 12.5l2.5 2.5L16 9.5" variants={fx ? draw(0.55, 0.45) : undefined} />
      </svg>
      <motion.span
        data-motion=""
        variants={
          fx
            ? {
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: DUR.reveal, ease: EASE, delay: 0.9 } },
              }
            : undefined
        }
      >
        {text}
      </motion.span>
    </motion.li>
  );
}

/** A few leaves that float down across the photograph once, then fade away (they are removed when done, and never loop). */
function DriftingLeaves() {
  const wide = useAllowMotion(leafMinWidth);
  const reduce = useReducedMotion();
  const [gone, setGone] = useState(0);
  if (!enabled || !wide || reduce || gone >= leaves) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
      {Array.from({ length: leaves }, (_, i) => {
        const left = 12 + ((i * 37) % 76);
        const size = 14 + ((i * 5) % 9);
        const sway = i % 2 ? 26 : -26;
        return (
          <motion.svg
            key={i}
            viewBox="0 0 24 24"
            className="absolute -top-6 text-[#d9c58a]"
            style={{ left: `${left}%`, width: size, height: size }}
            fill="currentColor"
            initial={{ y: -20, x: 0, rotate: i * 40, opacity: 0 }}
            whileInView={{
              y: 440,
              x: [0, sway, -sway / 2, sway / 3],
              rotate: i * 40 + 220,
              opacity: [0, 0.9, 0.9, 0],
            }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 7 + (i % 3), ease: "linear", delay: 1 + i * 0.9 }}
            onAnimationComplete={() => setGone((g) => g + 1)}
          >
            <path d="M12 2C6 6 4 12 6 19c2-1 4-2 6-4 2 2 4 3 6 4 2-7 0-13-6-17z" />
          </motion.svg>
        );
      })}
    </div>
  );
}

/**
 * "Commitment to Sustainability", as in the About design's promise card: one rounded card, a lounge photograph on the left and on
 * the right the eyebrow, the heading, a ticked list and a link. The photograph and the text slide toward each other, each tick is
 * drawn in turn, and a few leaves drift down over the photograph once.
 */
export function AboutPromise() {
  return (
    <section id="sustainability" aria-labelledby="promise-title" className="bg-ivory relative pb-20 desk:pb-28">
      <div className="wrap">
        <div className="grid overflow-hidden rounded-[24px] bg-[#fffdf8] shadow-[0_10px_30px_rgba(10,34,27,0.06)] lg:grid-cols-2">
          <Reveal x={enabled ? -slide : 0} y={0} className="h-[22rem] lg:h-full lg:min-h-[32rem]">
            <ImageFrame
              src="/images/about/lounge.jpg"
              alt="An open lounge of natural materials facing the mountains"
              sizes="(min-width: 1024px) 600px, 100vw"
              className="h-full w-full"
              from="none"
              radius={0}
              drift={3}
              position="40% 50%"
              viewCursor
            >
              <DriftingLeaves />
            </ImageFrame>
          </Reveal>
          <Reveal x={enabled ? slide : 0} y={0} className="flex flex-col justify-center p-8 desk:p-14">
            <Reveal>
              <p className="t-eyebrow text-forest">Our promise</p>
            </Reveal>
            <Lines
              id="promise-title"
              as="h2"
              lines={["Commitment to", "Sustainability"]}
              className="t-h3 text-forest m-0 mt-4 [font-size:clamp(1.875rem,1.3rem+1.7vw,2.75rem)]"
            />
            <motion.ul
              className="m-0 mt-7 flex list-none flex-col gap-4 p-0"
              initial="hidden"
              whileInView="show"
              viewport={VIEW_ONCE}
              variants={{ hidden: {}, show: { transition: { staggerChildren: itemStep, delayChildren: 0.3 } } }}
            >
              {points.map((text) => (
                <PromiseItem key={text} text={text} />
              ))}
            </motion.ul>
            <Reveal delay={0.2} className="mt-8">
              <Link href="/see-do" className="t-ui link-u text-forest inline-flex min-h-11 items-center gap-2">
                Explore the plantation
                <ArrowIcon className="size-4" />
              </Link>
            </Reveal>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
