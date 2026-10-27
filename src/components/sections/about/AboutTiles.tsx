"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { Handwrite } from "@/components/motion/about-fx";
import { ABOUT_FX } from "@/components/motion/home-fx.config";
import { Lines, Reveal } from "@/components/motion/primitives";
import { DUR, EASE, EASE_REVEAL, VIEW_ONCE } from "@/components/motion/tokens";
import { ArrowIcon } from "@/components/ui/BookNowButton";

/** Tile captions use wording from the existing About page (rooms, dining, plantation); each tile links to the page that covers it. */
const tiles = [
  {
    script: "Stay",
    title: "The Rooms",
    text: "Three air-conditioned bedrooms, each with a breathtaking view of the tea plantation.",
    href: "/rooms-booking",
    src: "/images/c18256_e6722fd3397a4b21a829c2ab06e9e5a6.jpg",
    alt: "Room 1 with panoramic glass windows",
    position: "38% 50%",
  },
  {
    script: "Dine",
    title: "Dining",
    text: "Local cuisine by our chef, with a complimentary breakfast, and grilled dishes at the forest-set grill house.",
    href: "/#services",
    src: "/images/c18256_0e64216c9f4a47aa9286384c0daec85b.jpg",
    alt: "A candle-lit wooden bar in the grill house",
    position: "50% 50%",
  },
  {
    script: "Explore",
    title: "The Plantation",
    text: "Stroll through our lush garden and tea plantation and revel in the tranquillity of the surroundings.",
    href: "/see-do",
    src: "/images/8daf94f88f524d8cb168d8004c1fe282.jpg",
    alt: "A hiker above the mist on the Vagamon trail",
    position: "50% 40%",
  },
] as const;

const { enabled, zoomFrom, stagger, grow } = ABOUT_FX.tiles;

/** The tile's own reveal: the photograph is uncovered from the bottom edge up, and settles from a slight zoom. */
const clip = {
  hidden: { clipPath: "inset(100% 0 0 0)" },
  show: { clipPath: "inset(0% 0 0 0)", transition: { duration: DUR.image, ease: EASE_REVEAL } },
};
const zoom = {
  hidden: { scale: zoomFrom },
  show: { scale: 1, transition: { duration: DUR.settle, ease: EASE } },
};

/**
 * "Stay, Dine, Explore", as in the About design: three tall photo tiles with a script word, a serif title and a line, on a dark
 * fade. The tiles rise into view one after another and the script words are written in. With a mouse on a wide screen the tiles
 * form an accordion: the hovered tile widens, its line slides up and an arrow appears; elsewhere they simply stack.
 */
export function AboutTiles() {
  return (
    <section
      id="experience"
      aria-labelledby="tiles-title"
      className="bg-ivory relative pt-20 pb-20 desk:pt-28 desk:pb-28"
    >
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 desk:mb-14">
          <div className="max-w-[35rem]">
            <Reveal>
              <p className="t-eyebrow text-forest">Life at The Mountain Table</p>
            </Reveal>
            <Lines id="tiles-title" as="h2" lines={["Stay, Dine, Explore"]} className="t-h2 text-forest m-0 mt-4" />
          </div>
          <Reveal delay={0.1} className="max-w-[25rem]">
            <p className="t-small text-ink/70 m-0">
              Whether for romance, family, or business, The Mountain Table ensures an unforgettable stay amid
              nature&apos;s enchantment.
            </p>
          </Reveal>
        </div>
        <motion.div
          data-motion=""
          className={`about-tiles grid gap-7 sm:grid-cols-2 lg:grid-cols-3 ${enabled ? "is-accordion" : ""}`}
          style={{ "--tile-grow": grow } as CSSProperties}
          initial={enabled ? "hidden" : false}
          whileInView="show"
          viewport={VIEW_ONCE}
          variants={{ hidden: {}, show: { transition: { staggerChildren: stagger } } }}
        >
          {tiles.map((t) => (
            <motion.div key={t.title} className="about-tile" variants={{ hidden: {}, show: {} }}>
              <motion.div variants={enabled ? clip : undefined} className="rounded-[18px]">
                <Link
                  href={t.href}
                  data-cursor="view"
                  className="group text-ivory relative block h-[26rem] overflow-hidden rounded-[18px] no-underline desk:h-[27.5rem]"
                >
                  <motion.span
                    variants={enabled ? zoom : undefined}
                    className="absolute inset-0 block will-change-transform"
                  >
                    <Image
                      src={t.src}
                      alt={t.alt}
                      fill
                      sizes="(min-width: 1024px) 900px, (min-width: 768px) 90vw, (min-width: 640px) 100vw, 184vw"
                      quality={85}
                      style={{ objectPosition: t.position }}
                      className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                    />
                  </motion.span>
                  <span
                    aria-hidden="true"
                    className="tile-arrow border-ivory/70 absolute top-5 right-5 size-11 items-center justify-center rounded-full border bg-forest-deep/30 backdrop-blur-sm"
                  >
                    <ArrowIcon className="size-4" />
                  </span>
                  <span className="from-forest-deep/95 absolute inset-x-0 bottom-0 block bg-gradient-to-t to-transparent px-7 pt-24 pb-7">
                    <Handwrite className="t-script block text-[1.625rem] text-[#e9c9a8]">{t.script}</Handwrite>
                    <span className="t-h3 mt-1 block [font-size:1.875rem]">{t.title}</span>
                    <span className="tile-text t-small text-ivory/85 mt-2 block [font-size:0.875rem]">{t.text}</span>
                  </span>
                </Link>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
