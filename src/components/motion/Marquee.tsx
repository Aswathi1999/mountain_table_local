"use client";

import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  wrap,
} from "motion/react";
import { Fragment, useRef } from "react";
import { SITE_FX } from "./home-fx.config";
import { SCROLL_SPRING } from "./tokens";
import { useSiteFx } from "./useSiteFx";

/**
 * A slow, large serif line that drifts sideways; scrolling speeds it up and reverses it with the scroll direction. Without
 * motion it is one static, centred line. Settings: `SITE_FX.marquee`.
 */
export function Marquee({ className = "" }: { className?: string }) {
  const on = useSiteFx("marquee");
  const { baseSpeed, velocityBoost, text } = SITE_FX.marquee;
  const group = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const dir = useRef(-1);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), SCROLL_SPRING);
  const boost = useTransform(velocity, (v) => Math.min(Math.abs(v) * velocityBoost, 6));

  useAnimationFrame((_, delta) => {
    const w = group.current?.offsetWidth;
    if (!on || !w) return;
    const v = velocity.get();
    if (Math.abs(v) > 20) dir.current = v > 0 ? -1 : 1;
    const step = dir.current * baseSpeed * (1 + boost.get()) * (delta / 1000);
    x.set(wrap(-w, 0, x.get() + step));
  });

  const line = text.map((word, i) => (
    <Fragment key={word}>
      <span className={i === text.length - 1 ? "italic" : undefined}>{word}</span>
      <span aria-hidden="true" className="text-gold mx-[0.5em] not-italic">
        ·
      </span>
    </Fragment>
  ));

  return (
    <section
      aria-label={text.join(", ")}
      className={`bg-ivory text-forest overflow-hidden py-10 md:py-14 ${className}`}
    >
      <motion.div
        aria-hidden="true"
        className={`flex w-max whitespace-nowrap text-[clamp(2.75rem,8vw,7rem)] leading-none ${on ? "" : "mx-auto"}`}
        style={{ x: on ? x : 0, fontFamily: "var(--font-display)" }}
      >
        <div ref={group} className="flex shrink-0">
          {line}
        </div>
        {on ? (
          <>
            <div className="flex shrink-0">{line}</div>
            <div className="flex shrink-0">{line}</div>
          </>
        ) : null}
      </motion.div>
    </section>
  );
}
