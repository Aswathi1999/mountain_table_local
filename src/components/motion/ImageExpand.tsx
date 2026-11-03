"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { SITE_FX } from "./home-fx.config";
import { SCROLL_SPRING } from "./tokens";
import { useAllowMotion } from "./useAllowMotion";

/**
 * A pinned scene: a small rounded photograph in the middle of the page grows, as you scroll, until it fills the whole screen,
 * then the line of text fades in over it. Narrow or short screens and reduced motion show the plain full-width photograph with
 * the text already in place. Settings: `SITE_FX.expand`.
 */
export function ImageExpand({
  src,
  alt,
  words,
  position = "50% 50%",
}: {
  src: string;
  alt: string;
  words: readonly string[];
  position?: string;
}) {
  const { enabled, minWidth, minHeight, pinScreens, from } = SITE_FX.expand;
  const allowed = useAllowMotion(minWidth, minHeight);
  const pinned = enabled && allowed;
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrap, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);
  const clip = useTransform(
    p,
    [0, 0.6],
    [`inset(${from.y}% ${from.x}% ${from.y}% ${from.x}% round 28px)`, "inset(0% 0% 0% 0% round 0px)"],
    { clamp: true },
  );
  const zoom = useTransform(p, [0, 0.6], [1.25, 1], { clamp: true });
  const veil = useTransform(p, [0.3, 0.75], [0, 1], { clamp: true });
  const textOpacity = useTransform(p, [0.55, 0.8], [0, 1], { clamp: true });
  const textY = useTransform(p, [0.55, 0.85], [40, 0], { clamp: true });

  return (
    <section
      ref={wrap}
      aria-label={words.join(", ")}
      className="bg-ivory relative"
      style={pinned ? { height: `${pinScreens * 100}svh` } : undefined}
    >
      <div
        className={pinned ? "sticky top-0 h-svh overflow-hidden" : "relative h-[70svh] min-h-[420px] overflow-hidden"}
      >
        <motion.div className="absolute inset-0" style={pinned ? { clipPath: clip } : undefined}>
          <motion.div className="absolute inset-0 will-change-transform" style={pinned ? { scale: zoom } : undefined}>
            <Image
              src={src}
              alt={alt}
              fill
              sizes="100vw"
              className="object-cover"
              style={{ objectPosition: position }}
            />
          </motion.div>
          <motion.div
            aria-hidden="true"
            className="bg-forest-deep/45 absolute inset-0"
            style={pinned ? { opacity: veil } : undefined}
          />
        </motion.div>
        <motion.p
          className="text-ivory absolute inset-x-0 top-1/2 m-0 -translate-y-1/2 px-6 text-center text-[clamp(2rem,6vw,5.5rem)] leading-[1.05]"
          style={{
            fontFamily: "var(--font-display)",
            ...(pinned ? { opacity: textOpacity, y: textY } : {}),
          }}
        >
          {words.map((w, i) => (
            <span key={w}>
              <span className={i === words.length - 1 ? "italic" : undefined}>{w}</span>
              {i < words.length - 1 ? (
                <span aria-hidden="true" className="text-gold-soft mx-[0.4em]">
                  ·
                </span>
              ) : null}
            </span>
          ))}
        </motion.p>
      </div>
    </section>
  );
}
