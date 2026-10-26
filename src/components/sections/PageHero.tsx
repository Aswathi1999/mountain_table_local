"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { Lines } from "@/components/motion/primitives";
import { DUR, EASE, SCROLL_SPRING } from "@/components/motion/tokens";
import { CurveEdge } from "@/components/ui/decor";

type Props = {
  /** Section id and the heading's id (used for `aria-labelledby`). */
  id: string;
  titleId: string;
  image: { src: string; position?: string };
  /** Last crumb of the breadcrumb (after "Home /"). */
  crumb: string;
  eyebrow: string;
  /** The h1, set as deliberate lines. */
  lines: readonly string[];
  intro: string;
  /** Optional content placed on the right of the hero (desktop only), e.g. an overlapping photograph. */
  aside?: ReactNode;
};

/**
 * Inner-page hero shared by About and See & Do: a photograph under a deep green wash that is darkest at the left, a breadcrumb,
 * an eyebrow with its hairline, the h1 in the serif and one paragraph, with a curved ivory edge into the page. The photograph
 * settles from a slight zoom and trails the scroll; the copy arrives in sequence.
 */
export function PageHero({ id, titleId, image, crumb, eyebrow, lines, intro, aside }: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const y = useTransform(progress, [0, 1], ["0%", reduce ? "0%" : "16%"]);

  return (
    <section
      ref={ref}
      id={id}
      aria-labelledby={titleId}
      className="bg-forest-deep text-ivory relative isolate overflow-hidden pt-24 pb-[clamp(9rem,17vw,15rem)] desk:pt-32"
    >
      <motion.div
        data-motion=""
        className="absolute inset-0 -z-10 will-change-transform"
        style={{ y }}
        initial={reduce ? false : { scale: 1.08 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.2, ease: EASE }}
      >
        <Image
          src={image.src}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: image.position ?? "50% 40%" }}
        />
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,34,27,0.86)_0%,rgba(10,34,27,0.52)_50%,rgba(10,34,27,0.1)_100%)] max-desk:bg-[linear-gradient(180deg,rgba(10,34,27,0.78),rgba(10,34,27,0.5))]"
      />

      <div className="wrap">
        <motion.p
          data-motion=""
          className="t-small text-ivory/85 m-0 mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: DUR.reveal, ease: EASE, delay: 0.1 } }}
        >
          <Link href="/" className="text-ivory/85 hover:text-ivory no-underline transition-colors">
            Home
          </Link>
          <span aria-hidden="true" className="mx-2">
            /
          </span>
          {crumb}
        </motion.p>
        <motion.p
          data-motion=""
          className="t-eyebrow t-eyebrow-draw text-ivory"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: DUR.reveal, ease: EASE, delay: 0.25 } }}
        >
          {eyebrow}
        </motion.p>
        <Lines
          id={titleId}
          as="h1"
          immediate
          delay={0.4}
          step={0.12}
          lines={lines}
          className="t-h1 m-0 mt-4 max-w-[12em]"
        />
        <motion.p
          data-motion=""
          className="t-lead text-ivory/90 m-0 mt-6 max-w-[27em]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE, delay: 0.85 } }}
        >
          {intro}
        </motion.p>
      </div>
      {aside}
      <CurveEdge />
    </section>
  );
}
