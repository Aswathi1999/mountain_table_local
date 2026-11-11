"use client";

import { motion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { Lines, Reveal } from "@/components/motion/primitives";
import { SCROLL_SPRING } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { social } from "@/lib/site";

/**
 * Seven photographs of the property and its surroundings, laid out like the postcards in the Gallery page hero: a row of bordered cards,
 * each a little turned and lifted, the middle one the largest. `phone` marks the five shown on phones.
 */
const CARDS = [
  {
    src: "/images/moments-1-v1.jpg",
    alt: "The lit dining area and pool at night, seen through glass walls",
    rotate: -8,
    lift: 46,
    scale: 0.88,
    phone: false,
  },
  {
    src: "/images/moments-2-v1.jpg",
    alt: "A cool drink and a rolled towel on a table beside an infinity pool",
    rotate: -4.5,
    lift: 22,
    scale: 0.94,
    phone: true,
  },
  {
    src: "/images/moments-3-v1.jpg",
    alt: "Misty hills at dusk with a small white building among the trees",
    rotate: -1.5,
    lift: 8,
    scale: 1,
    phone: true,
  },
  {
    src: "/images/moments-4-v1.jpg",
    alt: "A stone path winding through a green garden beside the resort",
    rotate: 0,
    lift: 0,
    scale: 1.1,
    phone: true,
  },
  {
    src: "/images/moments-5-v1.jpg",
    alt: "Sunrise over misty islands and water among the hills",
    rotate: 1.5,
    lift: 8,
    scale: 1,
    phone: true,
  },
  {
    src: "/images/moments-6-v1.jpg",
    alt: "The thatched-roof house among tea terraces, seen from above",
    rotate: 4.5,
    lift: 22,
    scale: 0.94,
    phone: true,
  },
  {
    src: "/images/moments-7-v1.jpg",
    alt: "A waterfall tumbling through dark forest rocks",
    rotate: 8,
    lift: 46,
    scale: 0.88,
    phone: false,
  },
] as const;
const MID = (CARDS.length - 1) / 2;

/**
 * One card. As the section scrolls into view the cards start gathered in a pile at the middle (turned flat, a little low and
 * transparent) and fan out to their places one after another, the middle card first and the outer ones last; they then lean
 * straight and lift when the pointer is over them. `p` runs 0 to 1 over that scroll; without it (phones, reduced motion) the
 * cards simply sit in place.
 */
function Card({ n, p, live }: { n: number; p: MotionValue<number>; live: boolean }) {
  const card = CARDS[n];
  const rank = Math.abs(n - MID);
  const start = rank * 0.07;
  const end = start + 0.45;
  const shift = (MID - n) * 92;
  const x = useTransform(p, [start, end], [`${shift}%`, "0%"], { clamp: true });
  const y = useTransform(p, [start, end], [70, -card.lift], { clamp: true });
  const rotate = useTransform(p, [start, end], [0, card.rotate], { clamp: true });
  const opacity = useTransform(p, [start, start + 0.18], [0, 1], { clamp: true });
  const scale = useTransform(p, [start, end], [0.8, card.scale], { clamp: true });

  return (
    <motion.li
      data-motion=""
      className={`${card.phone ? "" : "max-md:hidden"} relative -ml-[4%] w-[25%] shrink-0 first:ml-0 md:-ml-[2.5%] md:w-[17.5%]`}
      style={live ? { x, y, rotate, opacity, scale } : { y: -card.lift, rotate: card.rotate, scale: card.scale }}
      whileHover={live ? { rotate: 0, y: -card.lift - 14, scale: card.scale * 1.06, zIndex: 20 } : undefined}
      transition={{ duration: 0.5 }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[4px] border-[5px] border-white bg-white shadow-[0_18px_40px_rgba(10,34,27,0.22)] desk:border-[7px]">
        <Image src={card.src} alt={card.alt} fill sizes="(min-width: 768px) 19vw, 28vw" className="object-cover" />
      </div>
    </motion.li>
  );
}

/**
 * The home page gallery: the centred headline and the two links, then a spread of the site's generated concept images like the Gallery page
 * hero's postcards. They gather at the middle and fan out as the section scrolls into view (a scroll-linked reveal, so it also
 * folds back on the way up). Phones show five cards with the same scroll motion; reduced motion shows them in place.
 */
export function MomentsStrip() {
  const row = useRef<HTMLUListElement>(null);
  const reduce = useReducedMotion();
  const allowed = useAllowMotion();
  const live = allowed && !reduce;
  const { scrollYProgress } = useScroll({ target: row, offset: ["start 92%", "center 52%"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);

  return (
    <section aria-labelledby="moments-title" className="bg-ivory-deep relative overflow-hidden pt-24 pb-14 md:py-20 desk:py-28">
      <div className="wrap text-center">
        <Reveal>
          <p className="t-eyebrow text-forest justify-center before:h-px before:w-14 before:bg-current before:opacity-35 before:content-['']">
            From the mountain
          </p>
        </Reveal>
        <Lines
          id="moments-title"
          as="h2"
          lines={["Moments at", "The Mountain Table"]}
          lineClasses={["", "italic"]}
          className="t-h2 text-forest m-0 mt-5 leading-[1.05] [font-size:clamp(1.875rem,1.3rem+2vw,3rem)]"
        />
      </div>

      <div className="mx-auto mt-8 w-full max-w-[1320px] px-5 pt-8 pb-10 md:mt-20 md:pt-16 md:pb-24 desk:mt-24">
        <ul ref={row} className="m-0 flex list-none items-center justify-center p-0">
          {CARDS.map((_, n) => (
            <Card key={n} n={n} p={p} live={live} />
          ))}
        </ul>
      </div>

      <div className="wrap">
        <Reveal delay={0.2} className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
          <Link
            href="/gallery"
            className="group/btn bg-forest text-ivory hover:bg-forest-deep inline-flex h-12 items-center gap-2.5 px-6 text-[0.9375rem] font-medium no-underline transition-colors duration-300"
          >
            View Gallery
            <ArrowIcon className="size-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Link>
          <a
            href={social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-forest group inline-flex items-center gap-3 no-underline"
          >
            <span className="bg-forest/10 group-hover:bg-forest group-hover:text-ivory flex size-10 items-center justify-center transition-colors duration-300">
              <ArrowIcon className="size-4" />
            </span>
            <span className="t-ui">Follow on Instagram</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
