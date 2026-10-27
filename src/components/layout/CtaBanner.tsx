"use client";

import { motion, useInView, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { Reveal } from "@/components/motion/primitives";
import { DUR, EASE, SCROLL_SPRING } from "@/components/motion/tokens";
import { useHomeFx } from "@/components/motion/useHomeFx";
import { BookNowButton } from "@/components/ui/BookNowButton";

/** Closing call to action copy, as set in the approved design reference (without its "best rates" claim, which the site does not make). */
const cta = {
  signature: "Stay · Relax · Explore",
  lines: ["Your Mountain", "Escape Awaits"],
  body: "Book directly with us and arrive to a warm welcome at the door.",
} as const;

/**
 * The closing call to action. As it scrolls into view the photograph pulls into focus like a camera: it starts zoomed in and
 * blurred and settles to its normal size, sharp. The headline arrives word by word, and the booking button carries a slow gold
 * shimmer. Without the effect it is a plain misty-valley photograph under a forest tint. Settings: `HOME_FX.banner`.
 */
export function CtaBanner() {
  const on = useHomeFx("banner");
  const ref = useRef<HTMLElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const seen = useInView(headRef, { once: true, amount: 0.6 });
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 60%"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);
  const { scaleFrom, blurFrom, wordStagger } = HOME_FX.banner;
  const scale = useTransform(p, [0, 1], [on ? scaleFrom : 1, 1]);
  const filter = useTransform(p, [0, 1], [on ? `blur(${blurFrom}px)` : "blur(0px)", "blur(0px)"]);
  const words = cta.lines.flatMap((line, li) =>
    line.split(" ").map((w, wi) => ({ w, key: `${li}-${wi}`, br: wi === 0 && li > 0 })),
  );

  return (
    <section
      ref={ref}
      aria-labelledby="cta-title"
      className="bg-forest-deep text-ivory relative isolate overflow-hidden"
    >
      <motion.div className="absolute inset-0 -z-10 will-change-[transform,filter]" style={{ scale, filter }}>
        <Image
          src="/images/c18256_e5d979a1e3574fa4982be5aba13e7d68.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "50% 55%" }}
        />
      </motion.div>
      <div aria-hidden="true" className="bg-forest-deep/70 absolute inset-0 -z-10" />
      <div className="wrap flex flex-col items-center py-24 text-center desk:py-32">
        <Reveal>
          <p className="t-script text-gold-soft m-0 text-[1.5rem] desk:text-[1.875rem]">{cta.signature}</p>
        </Reveal>
        <h2
          ref={headRef}
          id="cta-title"
          className="t-h2 m-0 mt-4 text-center [font-size:clamp(2.25rem,1.4rem+3vw,3.75rem)]"
          aria-label={cta.lines.join(" ")}
        >
          {words.map(({ w, key, br }, i) => (
            <span key={key} aria-hidden="true">
              {br ? <br /> : null}
              <span className="-mb-[0.14em] inline-block overflow-hidden pb-[0.14em] align-bottom">
                <motion.span
                  data-motion=""
                  className="inline-block"
                  initial={false}
                  animate={{ y: seen || !on ? 0 : "108%" }}
                  transition={{ duration: DUR.line, ease: EASE, delay: i * wordStagger }}
                >
                  {w}
                </motion.span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        <Reveal delay={0.12} className="mt-5">
          <p className="t-body text-ivory/85 m-0 mx-auto max-w-[26em] [font-size:0.9375rem]">{cta.body}</p>
        </Reveal>
        <Reveal delay={0.22} className="mt-9">
          <BookNowButton href="/rooms-booking" className="btn-shimmer" />
        </Reveal>
      </div>
    </section>
  );
}
