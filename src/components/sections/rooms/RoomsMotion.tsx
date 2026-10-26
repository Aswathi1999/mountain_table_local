"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { Fragment, useRef } from "react";
import { EASE } from "@/components/motion/primitives";

/**
 * A wide photograph that opens as it scrolls into view: it starts as a letterboxed window and widens to the full frame while
 * the picture settles from a slight zoom. Scroll-linked, `clip-path` and `transform` only. Still when motion is reduced.
 */
export function GrowFrame({
  src,
  alt,
  sizes,
  className = "",
  position,
  priority,
}: {
  src: string;
  alt: string;
  sizes: string;
  className?: string;
  position?: string;
  priority?: boolean;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 55%"] });
  const clip = useTransform(scrollYProgress, [0, 1], ["inset(10% 16% 10% 16%)", "inset(0% 0% 0% 0%)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.22, 1]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="absolute inset-0 will-change-[clip-path]" style={reduce ? undefined : { clipPath: clip }}>
        <motion.div className="absolute inset-0 will-change-transform" style={reduce ? undefined : { scale }}>
          <Image
            src={src}
            alt={alt}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover"
            style={position ? { objectPosition: position } : undefined}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * The cancellation policy as a sequence: a gold line draws down the list as it is scrolled, and each condition's marker lights
 * as it arrives. Percentages are picked out in the display face. The text of every item is unchanged.
 */
export function CancellationTimeline({ items }: { items: readonly string[] }) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 75%", "end 60%"] });
  const grow = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <ol ref={ref} className="relative m-0 list-none p-0">
      <span aria-hidden="true" className="bg-gold/20 absolute top-3 bottom-3 left-[7px] block w-px" />
      <motion.span
        aria-hidden="true"
        className="bg-gold absolute top-3 bottom-3 left-[7px] block w-px origin-top"
        style={{ scaleY: reduce ? 1 : grow }}
      />
      {items.map((item) => (
        <li key={item} className="relative pb-12 pl-12 last:pb-0 desk:pb-16 desk:pl-16">
          <motion.span
            data-motion=""
            aria-hidden="true"
            className="bg-forest-deep border-gold absolute top-[0.55em] left-0 block size-[15px] rotate-45 border"
            initial={{ backgroundColor: "#142a21" }}
            whileInView={{ backgroundColor: "#b8935a" }}
            viewport={{ once: true, margin: "0px 0px -35% 0px" }}
            transition={{ duration: 0.8, ease: EASE }}
          />
          <motion.p
            data-motion=""
            className="t-lead text-ivory/90 m-0"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -12% 0px" }}
            transition={{ duration: 1, ease: EASE }}
          >
            {item.split(/(\d+%)/).map((part, n) =>
              /^\d+%$/.test(part) ? (
                <span key={n} className="t-num text-gold-soft text-[1.35em] leading-none">
                  {part}
                </span>
              ) : (
                <Fragment key={n}>{part}</Fragment>
              ),
            )}
          </motion.p>
        </li>
      ))}
    </ol>
  );
}
