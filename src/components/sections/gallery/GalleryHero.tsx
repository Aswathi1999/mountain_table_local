"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { GALLERY_FX } from "@/components/motion/home-fx.config";
import { DrawnLeaf, Lines, Reveal } from "@/components/motion/primitives";
import { DUR, EASE, EASE_REVEAL, SCROLL_SPRING } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";
import { galleryPhotos } from "@/data/gallery";

/** Five of the gallery's own photographs, fanned like postcards; the centre one is the largest. `stack` is how far (in its own widths) the card starts from the centre pile. */
const FAN = [
  { i: 15, rotate: -7, lift: "mt-8", w: "w-[15%]", stack: 257 },
  { i: 25, rotate: -3, lift: "mt-3", w: "w-[17%]", stack: 123 },
  { i: 21, rotate: 0, lift: "mt-0", w: "w-[22%]", stack: 0 },
  { i: 23, rotate: 3, lift: "mt-3", w: "w-[17%]", stack: -123 },
  { i: 16, rotate: 7, lift: "mt-8", w: "w-[15%]", stack: -257 },
] as const;

const hero = GALLERY_FX.hero;
const face = "absolute inset-0 [backface-visibility:hidden] overflow-hidden";

/** The cream back of a postcard, with a faint postmark and a stamp drawn on it. */
function CardBack({ delay }: { delay: number }) {
  const draw = (d: number) => ({
    initial: { pathLength: 0 },
    animate: { pathLength: 1 },
    transition: { duration: 1.1, ease: EASE, delay: delay + d },
  });
  return (
    <div
      className={`${face} flex items-center justify-center rounded-[4px] border-[5px] border-white bg-[#f3ecd9] shadow-[0_18px_40px_rgba(10,34,27,0.2)] [transform:rotateY(180deg)] desk:border-[8px]`}
    >
      <svg
        viewBox="0 0 100 130"
        className="text-forest/25 size-full p-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <motion.path d="M10 40h28M10 50h28M10 60h22" {...draw(0)} />
        <motion.rect x="62" y="12" width="26" height="32" rx="1.5" strokeDasharray="2 2.2" {...draw(0.1)} />
        <motion.circle cx="48" cy="92" r="17" {...draw(0.2)} />
        <motion.circle cx="48" cy="92" r="12" {...draw(0.3)} />
        <motion.path d="M70 86q6-6 12 0t12 0M70 94q6-6 12 0t12 0" {...draw(0.4)} />
      </svg>
    </div>
  );
}

type CardProps = {
  n: number;
  hover: number | null;
  setHover: (n: number | null) => void;
  p: MotionValue<number>;
  live: boolean;
  fx: boolean;
};

/** One postcard: spread with the scroll, leans or lifts with the pointer, and (inside) is dealt, flipped and developed. */
function Postcard({ n, hover, setHover, p, live, fx }: CardProps) {
  const f = FAN[n];
  const photo = galleryPhotos[f.i];
  const reduce = useReducedMotion();
  const rank = Math.abs(n - 2);
  const delay = hero.dealStart + rank * hero.dealStep;
  const spreadX = useTransform(p, [0, 1], [0, live ? (n - 2) * hero.spread : 0]);
  const hovered = hover === n;
  const away = hover !== null && !hovered ? Math.sign(n - hover) * hero.lean : 0;
  const stage = fx && !reduce;
  return (
    <motion.div
      className={`${f.w} ${f.lift} relative shrink-0`}
      style={{ x: spreadX, zIndex: hovered ? 30 : 1 }}
      onPointerEnter={live ? () => setHover(n) : undefined}
      onPointerLeave={live ? () => setHover(null) : undefined}
    >
      <motion.div
        style={{ perspective: 1400 }}
        initial={{ rotate: f.rotate }}
        animate={
          live && hover !== null
            ? hovered
              ? { rotate: 0, y: -hero.hoverLift, x: 0, scale: 1.05 }
              : { rotate: f.rotate + Math.sign(away) * 2, y: 0, x: away, scale: 1 }
            : { rotate: f.rotate, y: 0, x: 0, scale: 1 }
        }
        transition={{ duration: 0.7, ease: EASE }}
      >
        <motion.div
          data-motion=""
          className="relative aspect-[3/4] w-full [transform-style:preserve-3d]"
          initial={stage ? { x: `${f.stack}%`, rotateY: 180 } : false}
          animate={{ x: "0%", rotateY: 0 }}
          transition={{
            x: { duration: hero.flip, ease: EASE, delay },
            rotateY: { duration: hero.flip, ease: EASE_REVEAL, delay },
          }}
        >
          {stage ? <CardBack delay={0.2} /> : null}
          <div
            className={`${face} rounded-[4px] border-[5px] border-white bg-white shadow-[0_18px_40px_rgba(10,34,27,0.2)] desk:border-[8px]`}
          >
            <motion.div
              data-motion=""
              className="absolute inset-0"
              initial={stage ? { filter: hero.developFrom } : false}
              animate={{ filter: "brightness(1) saturate(1) contrast(1)" }}
              transition={{ duration: hero.develop, ease: EASE, delay: delay + hero.flip * 0.75 }}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(min-width: 1024px) 200px, 22vw"
                className="object-cover"
                priority
              />
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** A gold hairline that draws outward from the centre (the left one from its right end, the right one from its left end). */
function EyebrowLine({ side }: { side: "left" | "right" }) {
  return (
    <motion.span
      data-motion=""
      aria-hidden="true"
      className={`bg-gold block h-px w-14 ${side === "left" ? "origin-right" : "origin-left"}`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: DUR.line, ease: EASE, delay: 0.3 }}
    />
  );
}

/**
 * Gallery opening: a soft ivory hero with a line-drawn leaf at each side (they draw in), a centred breadcrumb, eyebrow with gold
 * lines drawing outward, the heading and the one-line introduction, and five postcards. The postcards start in a pile face-down
 * (cream backs with a faint postmark), then are dealt from the centre outward: each flips, slides to its place in the fan and
 * "develops" like an instant photograph. With a mouse, a card lifts and straightens while its neighbours lean away; scrolling
 * spreads the fan a little and fades it as the photographs arrive. Settings: `GALLERY_FX.hero`.
 */
export function GalleryHero() {
  const reduce = useReducedMotion();
  const wide = useAllowMotion(hero.minWidth);
  const live = hero.enabled && wide;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);
  const fanOpacity = useTransform(p, [0.5, 1], [1, live ? 0.15 : 1]);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      id="gallery-hero"
      aria-labelledby="gallery-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#ece6d8_0%,#f6f2ea_100%)] pt-16 pb-20 text-center desk:pt-20 desk:pb-28"
    >
      <div className="pointer-events-none absolute top-8 -left-4 hidden h-56 lg:block">
        <DrawnLeaf className="text-gold/60 h-full w-auto rotate-[24deg]" />
      </div>
      <div className="pointer-events-none absolute top-8 -right-4 hidden h-56 lg:block">
        <DrawnLeaf className="text-gold/60 h-full w-auto -scale-x-100 -rotate-[24deg]" />
      </div>
      <div className="wrap relative">
        <Reveal immediate>
          <p className="t-small text-ink/65 m-0 mb-4">
            <Link href="/" className="text-ink/65 hover:text-forest no-underline transition-colors">
              Home
            </Link>
            <span aria-hidden="true" className="mx-2">
              /
            </span>
            Gallery
          </p>
        </Reveal>
        <Reveal immediate delay={0.08}>
          <p className="t-eyebrow text-forest justify-center after:hidden">
            <EyebrowLine side="left" />
            Photographs
            <EyebrowLine side="right" />
          </p>
        </Reveal>
        <Lines
          id="gallery-title"
          as="h1"
          immediate
          delay={0.2}
          lines={["Gallery"]}
          className="t-h1 text-forest m-0 mt-4"
        />
        <Reveal immediate delay={0.5}>
          <p className="t-lead text-ink/70 mx-auto mt-5 max-w-[30em] [font-size:1.0625rem]">
            The property, its rooms, dining and surroundings, in the hills of Ulupuni, Vagamon.
          </p>
        </Reveal>

        <motion.div
          className="mx-auto mt-12 flex max-w-[56rem] items-start justify-center gap-[1.5%] pb-10 desk:mt-16"
          style={{ opacity: fanOpacity }}
        >
          {FAN.map((_, n) => (
            <Postcard key={n} n={n} hover={hover} setHover={setHover} p={p} live={live} fx={hero.enabled} />
          ))}
        </motion.div>
        <div className="relative mx-auto -mt-6 h-8 w-[22%] max-w-[12.5rem]">
          <motion.span
            data-motion=""
            className="t-script text-forest/80 absolute inset-x-0 top-0 block whitespace-nowrap text-[1.5rem]"
            initial={hero.enabled && !reduce ? { clipPath: "inset(-20% 100% -20% -2%)" } : false}
            animate={{ clipPath: "inset(-20% -6% -20% -2%)" }}
            transition={{ duration: 1.1, ease: EASE_REVEAL, delay: hero.captionDelay }}
          >
            our little cabin
          </motion.span>
          <svg
            viewBox="0 0 120 8"
            className="text-gold absolute inset-x-0 top-[1.9rem] h-2 w-full"
            fill="none"
            aria-hidden="true"
          >
            <motion.path
              d="M4 5C30 1 60 7 116 2"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              initial={hero.enabled && !reduce ? { pathLength: 0 } : false}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.9, ease: EASE, delay: hero.captionDelay + 0.6 }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
