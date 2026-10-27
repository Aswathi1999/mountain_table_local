"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Image from "next/image";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { Lines } from "@/components/motion/primitives";
import { ABOUT_FX, CONTACT_FX, ROOMS_FX } from "@/components/motion/home-fx.config";
import { DUR, EASE, SCROLL_SPRING } from "@/components/motion/tokens";
import { useNearViewport } from "@/components/motion/useAllowMotion";
import { useAboutFx, useContactFx, useRoomsFx } from "@/components/motion/useHomeFx";
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
  /** Optional buttons shown under the introduction. */
  actions?: ReactNode;
  /** Overrides the h1 width (the default suits short headlines). */
  titleClassName?: string;
  /** About-page story motion (`ABOUT_FX.hero`): the photograph comes into focus from washed out, slow parallax, copy lifts away. */
  memory?: boolean;
  /** Rooms-page motion (`ROOMS_FX.hero`): the photograph starts darker and cooler and warms as soft glows come on over its lights. */
  lights?: boolean;
  /** Contact-page motion (`CONTACT_FX.hero`): the photograph clears from a soft blur like lifting mist, with a faint mist drifting across. */
  mist?: boolean;
};

/**
 * The cool evening tint that lifts, and soft warm glows over the room's lights. The glows sit in a box with the photograph's own
 * proportions (3:2) placed exactly as `object-fit: cover` places the picture, so they stay on their lights at every window size.
 */
function HeroLights({ position }: { position: string }) {
  const { tintOpacity, settle, glows, glowDelay, glowStep, glowSeconds } = ROOMS_FX.hero;
  const [px, py] = position.split(" ").map((v) => Number.parseFloat(v) / 100);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 [container-type:size]">
      <motion.span
        className="absolute inset-0 block"
        style={{ backgroundColor: "rgb(36,64,112)" }}
        initial={{ opacity: tintOpacity }}
        animate={{ opacity: 0 }}
        transition={{ duration: settle, ease: EASE }}
      />
      <div
        className="absolute"
        style={{
          width: "max(100cqw, 150cqh)",
          aspectRatio: "3 / 2",
          left: `calc((100cqw - max(100cqw, 150cqh)) * ${px})`,
          top: `calc((100cqh - max(100cqw, 150cqh) / 1.5) * ${py})`,
        }}
      >
        {glows.map(([x, y, size], i) => (
          <motion.span
            key={i}
            className="absolute block rounded-full mix-blend-screen"
            style={{
              left: `${x}%`,
              top: `${y}%`,
              width: `${size}%`,
              aspectRatio: "1",
              transform: "translate(-50%, -50%)",
              background:
                "radial-gradient(circle, rgba(255,196,110,0.75) 0%, rgba(255,170,80,0.28) 40%, rgba(255,170,80,0) 70%)",
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: glowSeconds, ease: EASE, delay: glowDelay + i * glowStep }}
          />
        ))}
      </div>
    </div>
  );
}

/** A very faint band of mist that drifts slowly sideways across the lower part of the hero, in an endless loop; it pauses when off screen or in a hidden tab. */
function HeroMist() {
  const ref = useRef<HTMLDivElement>(null);
  const near = useNearViewport(ref, "0px");
  const { mistSeconds, mistOpacity } = CONTACT_FX.hero;
  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] overflow-hidden"
    >
      <div
        className="hero-mist absolute inset-y-0 left-0 w-[200%]"
        style={{
          opacity: mistOpacity,
          animationDuration: `${mistSeconds}s`,
          animationPlayState: near ? "running" : "paused",
        }}
      />
    </div>
  );
}

/**
 * Inner-page hero shared by About and See & Do: a photograph under a deep green wash that is darkest at the left, a breadcrumb,
 * an eyebrow with its hairline, the h1 in the serif and one paragraph, with a curved ivory edge into the page. The photograph
 * settles from a slight zoom and trails the scroll; the copy arrives in sequence.
 */
export function PageHero({
  id,
  titleId,
  image,
  crumb,
  eyebrow,
  lines,
  intro,
  aside,
  actions,
  titleClassName,
  memory,
  lights,
  mist,
}: Props) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const aboutOn = useAboutFx("hero") && !!memory;
  const roomsOn = useRoomsFx("hero") && !!lights;
  const contactOn = useContactFx("hero") && !!mist;
  const fx = aboutOn || roomsOn || contactOn;
  const cfg = lights ? ROOMS_FX.hero : mist ? CONTACT_FX.hero : ABOUT_FX.hero;
  const cloud = !!mist && CONTACT_FX.hero.enabled;
  const warm = !!lights && ROOMS_FX.hero.enabled;
  const y = useTransform(progress, [0, 1], ["0%", reduce ? "0%" : fx ? `${cfg.parallax * 100}%` : "16%"]);
  const copyY = useTransform(progress, [0, 0.6], [0, fx ? -cfg.copyLift : 0]);
  const copyOpacity = useTransform(progress, [0, 0.6], [1, fx ? 0 : 1]);
  const story = !!memory && ABOUT_FX.hero.enabled;

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
        initial={
          reduce
            ? false
            : cloud
              ? {
                  scale: 1.03,
                  filter: `blur(${CONTACT_FX.hero.blurFrom}px) brightness(${CONTACT_FX.hero.brightnessFrom})`,
                }
              : warm
                ? { scale: 1.05, filter: `brightness(${ROOMS_FX.hero.brightnessFrom})` }
                : story
                  ? { scale: ABOUT_FX.hero.scaleFrom, filter: `saturate(${ABOUT_FX.hero.saturateFrom})` }
                  : { scale: 1.08 }
        }
        animate={
          cloud
            ? { scale: 1, filter: "blur(0px) brightness(1)" }
            : warm
              ? { scale: 1, filter: "brightness(1)" }
              : story
                ? { scale: 1, filter: "saturate(1)" }
                : { scale: 1 }
        }
        transition={{
          duration: cloud ? CONTACT_FX.hero.clear : story || warm ? ("settle" in cfg ? cfg.settle : 2.2) : 2.2,
          ease: EASE,
        }}
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
        {warm && !reduce ? <HeroLights position={image.position ?? "50% 40%"} /> : null}
        {cloud && !reduce ? <HeroMist /> : null}
      </motion.div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(10,34,27,0.86)_0%,rgba(10,34,27,0.52)_50%,rgba(10,34,27,0.1)_100%)] max-desk:bg-[linear-gradient(180deg,rgba(10,34,27,0.78),rgba(10,34,27,0.5))]"
      />

      <motion.div className="wrap" style={fx ? { y: copyY, opacity: copyOpacity } : undefined}>
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
          className={`t-h1 m-0 mt-4 ${titleClassName ?? "max-w-[12em]"}`}
        />
        <motion.p
          data-motion=""
          className="t-lead text-ivory/90 m-0 mt-6 max-w-[27em]"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE, delay: 0.85 } }}
        >
          {intro}
        </motion.p>
        {actions ? (
          <motion.div
            data-motion=""
            className="mt-8 flex flex-wrap items-center gap-4"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE, delay: 1.05 } }}
          >
            {actions}
          </motion.div>
        ) : null}
      </motion.div>
      {aside}
      <CurveEdge />
    </section>
  );
}
