"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useRef } from "react";
import { PARALLAX_MIN_WIDTH, SCROLL_SPRING } from "./tokens";
import { useAllowMotion } from "./useAllowMotion";

/**
 * A statement whose words brighten one after another as it is read up the screen (scrubbed, so it also dims again on the way
 * back). Narrow screens and reduced motion show the plain text. Assistive tech reads the whole sentence once.
 */
export function ScrubWords({ text, className }: { text: string; className?: string }) {
  const on = useAllowMotion(PARALLAX_MIN_WIDTH);
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 88%", "end 52%"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);
  const words = text.split(" ");
  return (
    <p ref={ref} className={className} aria-label={text}>
      {words.map((w, i) => (
        <Word key={i} word={w} i={i} n={words.length} p={p} on={on} last={i === words.length - 1} />
      ))}
    </p>
  );
}

function Word({
  word,
  i,
  n,
  p,
  on,
  last,
}: {
  word: string;
  i: number;
  n: number;
  p: MotionValue<number>;
  on: boolean;
  last: boolean;
}) {
  const from = i / n;
  const opacity = useTransform(p, [from, Math.min(1, from + 2.5 / n)], [on ? 0.16 : 1, 1], { clamp: true });
  return (
    <motion.span aria-hidden="true" style={{ opacity }}>
      {word}
      {last ? "" : " "}
    </motion.span>
  );
}
