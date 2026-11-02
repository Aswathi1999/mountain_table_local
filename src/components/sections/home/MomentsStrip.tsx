"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { SITE_FX } from "@/components/motion/home-fx.config";
import { Lines, Reveal } from "@/components/motion/primitives";
import { DUR, EASE, EASE_REVEAL, SCROLL_SPRING, VIEW_ONCE } from "@/components/motion/tokens";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { social } from "@/lib/site";
import { useAllowMotion } from "@/components/motion/useAllowMotion";
import { galleryPhotos } from "@/data/gallery";
import { instagramPosts } from "@/data/instagram";

const KIND = { IMAGE: "Photo", VIDEO: "Reel", CAROUSEL_ALBUM: "Photo set" } as const;

/** Photographs from the Gallery page that lead the strip (indexes into `galleryPhotos`); each opens the Gallery. */
const GALLERY_PICKS = [1, 6, 3, 2, 4, 8] as const;

type Card = { key: string; src: string; alt: string; label: string; href: string; external: boolean };
const cards: Card[] = [
  ...GALLERY_PICKS.map((index) => ({
    key: galleryPhotos[index].src,
    src: galleryPhotos[index].src,
    alt: galleryPhotos[index].alt,
    label: "Gallery",
    href: "/gallery",
    external: false,
  })),
  ...instagramPosts.map((post) => ({
    key: post.href,
    src: post.src,
    alt: "",
    label: KIND[post.type],
    href: post.href,
    external: true,
  })),
];

/**
 * A drag-to-explore strip of the property's Instagram posts (the same photographs as the About page's "Explore & Follow Us").
 * On wide screens the strip is dragged with the pointer (with momentum and soft edges) and also glides sideways as the page
 * scrolls past; on phones and with reduced motion it is an ordinary swipeable row. Each card opens the original post.
 * Settings: `SITE_FX.moments`.
 */
export function MomentsStrip() {
  const on = useAllowMotion(SITE_FX.moments.minWidth) && SITE_FX.moments.enabled;
  const section = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLUListElement>(null);
  const [range, setRange] = useState(0);
  const dragged = useRef(false);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: section, offset: ["start end", "end start"] });
  const glide = useSpring(scrollYProgress, SCROLL_SPRING);
  const glideX = useTransform(glide, [0, 1], [SITE_FX.moments.glide, -SITE_FX.moments.glide]);
  const x = useMotionValue(0);
  const barScale = useTransform(x, (v) => (range > 0 ? 0.12 + 0.88 * Math.min(1, Math.abs(v) / range) : 1));

  useEffect(() => {
    const measure = () => {
      const t = track.current;
      const v = viewport.current;
      if (t && v) setRange(Math.max(0, t.scrollWidth - v.clientWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [on]);

  return (
    <section
      ref={section}
      aria-labelledby="moments-title"
      className="bg-ivory-deep relative overflow-hidden py-20 desk:py-32"
    >
      <div className="wrap">
        {/* The headline sits in the right half on wide screens, as in the reference. */}
        <div className="desk:ml-[50%]">
          <Reveal>
            <p className="t-eyebrow text-forest">From the mountain</p>
          </Reveal>
          <Lines
            id="moments-title"
            as="h2"
            lines={["Moments at", "The Mountain Table"]}
            lineClasses={["", "italic"]}
            className="t-h2 text-forest m-0 mt-5 leading-[1.05] [font-size:clamp(2.25rem,1.4rem+3vw,4.25rem)]"
          />
        </div>
      </div>

      <div
        ref={viewport}
        className={`mt-14 desk:mt-20 ${on ? "overflow-hidden" : "overflow-x-auto snap-x snap-mandatory [scrollbar-width:none]"}`}
      >
        <motion.div style={on ? { x: glideX } : undefined}>
          <motion.ul
            ref={track}
            className={`m-0 flex w-max list-none items-start gap-2 p-0 px-6 pb-12 ${on ? "cursor-grab active:cursor-grabbing" : ""}`}
            drag={on ? "x" : false}
            dragConstraints={{ left: -range, right: 0 }}
            dragElastic={0.1}
            dragTransition={{ power: 0.35, timeConstant: 260 }}
            style={on ? { x } : undefined}
            onDragStart={() => (dragged.current = true)}
            onDragEnd={() => setTimeout(() => (dragged.current = false), 60)}
          >
            {cards.map((card, i) => {
              const className = "group relative block aspect-[3/4] overflow-hidden bg-forest-deep no-underline";
              const inner = (
                <>
                  <motion.span
                    className="img-zoom absolute inset-0 block"
                    initial={{ scale: reduce ? 1 : 1.18 }}
                    whileInView={{ scale: 1 }}
                    viewport={VIEW_ONCE}
                    transition={{ duration: reduce ? 0 : 1.6, ease: EASE, delay: reduce ? 0 : (i % 4) * 0.1 }}
                  >
                    <Image
                      src={card.src}
                      alt={card.alt}
                      fill
                      draggable={false}
                      sizes="(min-width: 768px) 304px, 72vw"
                      className="object-cover select-none"
                    />
                  </motion.span>
                  <span
                    aria-hidden="true"
                    className="from-forest-deep/75 absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t to-transparent p-6 pt-24"
                  >
                    <span className="font-display text-ivory text-[clamp(1.5rem,1.2rem+0.9vw,2rem)] leading-none transition-transform duration-500 group-hover:-translate-y-1">
                      {card.label}
                    </span>
                  </span>
                </>
              );
              return (
                <motion.li
                  key={card.key}
                  data-motion=""
                  className={`w-[min(72vw,21.5rem)] shrink-0 snap-start desk:w-[calc((100vw-72px)/4)] ${i % 2 === 1 ? "mt-10" : ""}`}
                  initial={{
                    opacity: 0,
                    y: reduce ? 0 : 48,
                    clipPath: reduce ? "inset(0% 0 0 0)" : "inset(14% 0 0 0)",
                  }}
                  whileInView={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
                  viewport={VIEW_ONCE}
                  transition={{
                    duration: reduce ? 0 : DUR.image,
                    ease: EASE_REVEAL,
                    delay: reduce ? 0 : (i % 4) * 0.1,
                  }}
                >
                  {card.external ? (
                    <a
                      href={card.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      draggable={false}
                      onClick={(e) => dragged.current && e.preventDefault()}
                      className={className}
                      aria-label={`${card.label} on Instagram`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <Link
                      href={card.href}
                      draggable={false}
                      onClick={(e) => dragged.current && e.preventDefault()}
                      className={className}
                    >
                      {inner}
                    </Link>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        </motion.div>
      </div>

      <div className="wrap mt-6 desk:mt-4">
        <Reveal delay={0.2} className="desk:ml-[50%] flex flex-wrap items-center gap-x-8 gap-y-4">
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

      {on ? (
        <div className="wrap mt-8" aria-hidden="true">
          <div className="bg-forest/15 h-px w-full max-w-xs">
            <motion.div className="bg-gold h-px origin-left" style={{ scaleX: barScale }} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
