"use client";

import { animate, motion, useInView, useMotionValue, useTransform, type MotionValue } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { GALLERY_FX } from "@/components/motion/home-fx.config";
import { EASE, EASE_REVEAL } from "@/components/motion/tokens";
import type { GalleryPhoto } from "@/data/gallery";

/** A number that counts up or down to its new value ("10 photos" to "3 photos"). */
export function AnimatedCount({ value }: { value: number }) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(value);
  const text = useTransform(mv, (v) => String(Math.round(v)));
  useEffect(() => {
    if (reduce || !GALLERY_FX.filters.enabled) return mv.set(value);
    const controls = animate(mv, value, { duration: GALLERY_FX.filters.countSeconds, ease: EASE });
    return () => controls.stop();
  }, [value, mv, reduce]);
  return (
    <span className="t-small text-ink/65 tabular-nums">
      <span className="sr-only" aria-live="polite">{`${value} photos`}</span>
      <span aria-hidden="true">
        <motion.span>{text}</motion.span> photos
      </span>
    </span>
  );
}

/** One odometer wheel: the digits 0 to 9 in a column that slides so the current digit shows. */
function Wheel({ digit }: { digit: number }) {
  const reduce = useReducedMotion();
  return (
    <span className="relative inline-block h-[1.2em] overflow-hidden align-bottom">
      <motion.span
        className="block"
        initial={false}
        animate={{ y: `${-digit * 10}%` }}
        transition={reduce ? { duration: 0 } : { duration: 0.7, ease: EASE }}
      >
        {Array.from({ length: 10 }, (_, d) => (
          <span key={d} className="block h-[1.2em] leading-[1.2em]">
            {d}
          </span>
        ))}
      </motion.span>
    </span>
  );
}

/** A zero-padded number whose digits roll vertically when it changes, like an odometer. */
export function Odometer({ value, digits = 2 }: { value: number; digits?: number }) {
  const s = String(value).padStart(digits, "0");
  return (
    <span aria-hidden="true" className="inline-flex">
      {s.split("").map((ch, i) => (
        <Wheel key={`${s.length}-${i}`} digit={Number(ch)} />
      ))}
    </span>
  );
}

/** A small aperture: six blades round a centre. It turns while a load is in progress. */
export function ApertureIcon({ spinning }: { spinning: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-[1.125rem] ${spinning ? "animate-spin" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3l4.5 7.8M20.2 7.5l-9 0M21 12l-4.5 7.8M12 21l-4.5-7.8M3.8 16.5h9M3 12l4.5-7.8" />
    </svg>
  );
}

type WallItemProps = {
  photo: GalleryPhoto;
  category: string;
  index: number;
  /** Position in the batch that was just added (0 for the first screenful), which sets the stagger. */
  batchIndex: number;
  column: number;
  wallProgress: MotionValue<number>;
  parallaxOn: boolean;
  active: boolean;
  onPick: (el: HTMLButtonElement) => void;
};

const wall = GALLERY_FX.wall;

/**
 * One photograph in the wall. The tile is a button: it is uncovered from the bottom edge up while the picture settles from a
 * slight zoom (the delay follows column order, so the reveal ripples across the wall), floats a little with its column on wide
 * screens, and on hover (mouse only) zooms, shows its caption with a gold line drawing in, and catches one soft sheen.
 * The tile in the viewer gets a gold outline that is drawn round it.
 */
export function WallItem({
  photo,
  category,
  index,
  batchIndex,
  column,
  wallProgress,
  parallaxOn,
  active,
  onPick,
}: WallItemProps) {
  const reduce = useReducedMotion();
  const filters = GALLERY_FX.filters;
  const ref = useRef<HTMLLIElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const y = useTransform(wallProgress, [0, 1], [0, parallaxOn ? (wall.parallax[column] ?? 0) : 0]);
  const delay = Math.min(batchIndex, 9) * wall.stagger;
  const fx = wall.enabled && !reduce;
  return (
    <motion.li
      ref={ref}
      layout={reduce ? false : "position"}
      initial={reduce ? false : { opacity: 0, scale: filters.enterScale }}
      animate={{
        opacity: 1,
        scale: 1,
        transition: { duration: 0.7, ease: EASE, delay: Math.min(batchIndex, 8) * filters.enterStagger },
      }}
      exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.3, ease: EASE } }}
      id={`gal-photo-${index}`}
    >
      <motion.div style={{ y }} className="relative will-change-transform">
        <motion.div
          data-motion=""
          initial={fx ? { clipPath: "inset(100% 0 0 0)" } : false}
          animate={{ clipPath: seen || !fx ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
          transition={{ duration: wall.reveal, ease: EASE_REVEAL, delay }}
          className="rounded-[16px]"
        >
          <button
            type="button"
            onClick={(e) => onPick(e.currentTarget)}
            aria-pressed={active}
            aria-label={`Show in the viewer: ${photo.alt}`}
            data-cursor="view"
            className="gal-tile group relative block w-full cursor-pointer overflow-hidden rounded-[16px] border-0 p-0"
            style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
          >
            <motion.span
              data-motion=""
              className="absolute inset-0 block"
              initial={fx ? { scale: 1.1 } : false}
              animate={{ scale: seen || !fx ? 1 : 1.1 }}
              transition={{ duration: 1.6, ease: EASE, delay }}
            >
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 400px, (min-width: 1024px) 33vw, 50vw"
                placeholder="blur"
                blurDataURL={photo.blur}
                className="gal-tile-img object-cover"
              />
            </motion.span>
            <span aria-hidden="true" className="gal-sheen" />
            <span aria-hidden="true" className="gal-caption">
              <span className="gal-caption-line" />
              <span className="t-kicker text-gold-soft block">{category}</span>
              <span className="t-small text-ivory mt-1 block text-left [font-size:0.8125rem] [line-height:1.4]">
                {photo.alt}
              </span>
            </span>
            {/* The outline of the photograph in the viewer: drawn round the tile's edge (inside it, so it never disturbs the column layout). */}
            <svg aria-hidden="true" className="pointer-events-none absolute inset-0 size-full">
              <motion.rect
                x="1.5"
                y="1.5"
                width="calc(100% - 3px)"
                height="calc(100% - 3px)"
                rx="15"
                fill="none"
                stroke="#B8912F"
                strokeWidth="3"
                pathLength={1}
                style={{ width: "calc(100% - 3px)", height: "calc(100% - 3px)" }}
                initial={false}
                animate={{ pathLength: active ? 1 : 0, opacity: active ? 1 : 0 }}
                transition={{ duration: reduce ? 0 : 0.9, ease: EASE }}
              />
            </svg>
          </button>
        </motion.div>
      </motion.div>
    </motion.li>
  );
}
