"use client";

import { AnimatePresence, motion, useScroll, type PanInfo, type Variants } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Image from "next/image";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { GALLERY_FX } from "@/components/motion/home-fx.config";
import { Lines, Reveal } from "@/components/motion/primitives";
import { EASE, EASE_REVEAL } from "@/components/motion/tokens";
import { useAllowMotion, useNearViewport } from "@/components/motion/useAllowMotion";
import type { GalleryPhoto } from "@/data/gallery";
import { AnimatedCount, ApertureIcon, Odometer, WallItem } from "./GalleryParts";

type Props = { photos: readonly GalleryPhoto[] };

/** Filter groups, taken from what each existing photograph shows (by its own description). */
const CATEGORIES = ["All", "Rooms", "Dining", "Nature", "Property"] as const;
type Category = (typeof CATEGORIES)[number];

/** Category of each photograph, in the same order as `galleryPhotos`. */
const CATEGORY_OF: readonly Exclude<Category, "All">[] = [
  "Property", // aerial view of the house
  "Property", // pool and terrace at sunset
  "Nature", // stone steps
  "Property", // pool over the hills
  "Dining", // dining area
  "Nature", // path between tea bushes
  "Rooms", // Room 1
  "Property", // pool at night
  "Property", // thatched roof
  "Dining", // dining area with glass walls
  "Rooms", // Room 2
  "Nature", // path through the plantation
  "Property", // bright hall
  "Rooms", // Room 3
  "Nature", // moss wall
  "Rooms", // bedroom
  "Dining", // candle-lit bar
  "Rooms", // bathroom
  "Rooms", // bathtub
  "Nature", // lantern-lit path
  "Rooms", // basin
  "Property", // timber cabin at dusk
  "Property", // terrace at dusk
  "Nature", // misty ridges at sunrise
  "Rooms", // lounge with balcony
  "Property", // fire bowl terrace
  "Nature", // peaks at sunrise
];

const PAGE = 9;
const { viewer: V, filters: F, wall: W, cursor: C } = GALLERY_FX;

const arrow =
  "flex size-11 cursor-pointer items-center justify-center rounded-full border border-ivory/40 bg-forest-deep/40 text-ivory backdrop-blur-sm transition-colors duration-300 hover:bg-ivory hover:text-forest-deep focus-visible:bg-ivory focus-visible:text-forest-deep active:scale-95";
const chrome =
  "absolute z-10 flex size-12 cursor-pointer items-center justify-center rounded-full border border-ivory/25 bg-forest-deep/50 text-ivory transition-colors duration-300 hover:bg-gold hover:text-forest-deep focus-visible:bg-gold focus-visible:text-forest-deep";

/** The photograph flying from its tile into the viewer (all in page coordinates, so scrolling does not disturb it). */
type Flight = {
  src: string;
  blur: string;
  x: number;
  y: number;
  w: number;
  h: number;
  /** Start transform: where the tile is relative to the viewer picture. */
  tx: number;
  ty: number;
  scale: number;
  insetX: number;
  insetY: number;
};

/** Text lines of the viewer change with a quick blur-out and a staggered blur-in. */
const textV: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)" },
  show: { opacity: 1, filter: "blur(0px)", transition: { duration: V.text, ease: EASE } },
};

/**
 * The collection, as in the Gallery design: filter pills (one green pill slides between them) with a counting total; a featured
 * viewer (the photograph wipes in from the direction of travel while the old one slides away more slowly, the text blurs through,
 * the counter rolls like an odometer, a slow Ken Burns drift, arrow keys and swipe); a masonry wall of every photograph that
 * reveals from the bottom, glides when filtered, floats in columns on wide screens and flies the chosen photograph into the
 * viewer; "Load more photos"; and a lightbox on the native modal <dialog> (arrow keys, buttons or a swipe step through, Escape
 * closes, focus returns). Captions are the photographs' own descriptions. Settings: `GALLERY_FX.filters`, `.viewer`, `.wall`.
 */
export function GalleryGrid({ photos }: Props) {
  const reduce = useReducedMotion();
  const wide = useAllowMotion(W.parallaxMinWidth);
  const [category, setCategory] = useState<Category>("All");
  const [featured, setFeatured] = useState(0);
  const [shown, setShown] = useState(PAGE);
  const [batchStart, setBatchStart] = useState(0);
  const [loading, setLoading] = useState(false);
  const [dir, setDir] = useState<1 | -1 | 0>(0);
  const [flight, setFlight] = useState<Flight | null>(null);

  const list = useMemo(
    () => photos.filter((_, i) => category === "All" || CATEGORY_OF[i] === category),
    [photos, category],
  );
  const categoryOf = (p: GalleryPhoto) => CATEGORY_OF[photos.indexOf(p)] ?? "Property";
  const safeFeatured = Math.min(featured, list.length - 1);
  const hero = list[safeFeatured];

  const pick = (c: Category) => {
    setCategory(c);
    setFeatured(0);
    setDir(0);
    setShown(PAGE);
    setBatchStart(0);
  };
  const stepFeatured = (d: 1 | -1) => {
    setDir(d);
    setFeatured((safeFeatured + d + list.length) % list.length);
  };

  /* ---------------------------------------------------------------- viewer */
  const viewerRef = useRef<HTMLDivElement>(null);
  const viewerNear = useNearViewport(viewerRef, "0px");
  const viewerLive = V.enabled && !reduce;

  const onViewerPan = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > V.swipePx && Math.abs(info.offset.x) > Math.abs(info.offset.y) * 1.2) {
      stepFeatured(info.offset.x < 0 ? 1 : -1);
    }
  };
  const onKeys = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    if ((e.target as HTMLElement).closest("input, textarea, select")) return;
    e.preventDefault();
    stepFeatured(e.key === "ArrowRight" ? 1 : -1);
  };

  /** Choose a tile: its photograph flies into the viewer, then the page glides so the viewer is in view if it was not. */
  const choose = (i: number, el: HTMLButtonElement) => {
    const run = () => {
      const box = viewerRef.current;
      const goal = box?.getBoundingClientRect();
      const from = el.getBoundingClientRect();
      const p = list[i];
      setDir(0);
      setFeatured(i);
      if (box && goal && viewerLive && p) {
        const sx = window.scrollX;
        const sy = window.scrollY;
        const s = Math.max(from.width / goal.width, from.height / goal.height);
        setFlight({
          src: p.src,
          blur: p.blur,
          x: goal.left + sx,
          y: goal.top + sy,
          w: goal.width,
          h: goal.height,
          tx: from.left + from.width / 2 - (goal.left + goal.width / 2),
          ty: from.top + from.height / 2 - (goal.top + goal.height / 2),
          scale: s,
          insetX: (goal.width - from.width / s) / 2,
          insetY: (goal.height - from.height / s) / 2,
        });
      }
      if (goal && (goal.top < 80 || goal.bottom > window.innerHeight)) {
        document
          .getElementById("gallery-viewer")
          ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      }
    };
    // With the viewfinder cursor, the brackets snap in first, then the photograph moves.
    if (document.documentElement.classList.contains("has-viewfinder")) window.setTimeout(run, C.snapMs);
    else run();
  };

  const loadMore = () => {
    if (loading) return;
    setLoading(true);
    window.setTimeout(
      () => {
        const first = Math.min(shown, list.length - 1);
        setBatchStart(shown);
        setShown((s) => s + PAGE);
        setLoading(false);
        requestAnimationFrame(() =>
          requestAnimationFrame(() =>
            document
              .getElementById(`gal-photo-${first}`)
              ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" }),
          ),
        );
      },
      reduce || !W.enabled ? 0 : W.loadDelay,
    );
  };

  /* ---------------------------------------------------------------- wall columns (for the parallax) */
  const wallRef = useRef<HTMLUListElement>(null);
  const [cols, setCols] = useState<number[]>([]);
  const { scrollYProgress: wallProgress } = useScroll({ target: wallRef, offset: ["start end", "end start"] });
  const parallaxOn = W.enabled && wide && !reduce;
  const visible = list.slice(0, shown);
  useEffect(() => {
    const ul = wallRef.current;
    if (!ul || !parallaxOn) return;
    const measure = () => {
      // One batch of reads: where each tile sits horizontally tells which column it is in.
      const n = Number.parseInt(getComputedStyle(ul).columnCount, 10) || 3;
      const colWidth = ul.clientWidth / n;
      const next = Array.from(ul.children, (li) =>
        Math.min(n - 1, Math.round((li as HTMLElement).offsetLeft / colWidth)),
      );
      setCols((prev) => (prev.join() === next.join() ? prev : next));
    };
    const id = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(ul);
    return () => {
      cancelAnimationFrame(id);
      ro.disconnect();
    };
  }, [parallaxOn, visible.length, category]);

  /* ---------------------------------------------------------------- lightbox */
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [lbDir, setLbDir] = useState<1 | -1 | 0>(0);
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const currentRef = useRef<number | null>(null);
  const open = current !== null;

  const move = useCallback((i: number | null) => {
    currentRef.current = i;
    setCurrent(i);
  }, []);
  const show = useCallback(
    (i: number, el: HTMLButtonElement) => {
      triggerRef.current = el;
      setViewerLoaded(false);
      setLbDir(0);
      move(i);
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) dialog.showModal();
    },
    [move, setViewerLoaded, setLbDir],
  );
  const close = useCallback(() => move(null), [move]);
  const finishClose = useCallback(() => {
    if (currentRef.current !== null) return;
    const dialog = dialogRef.current;
    if (dialog?.open) dialog.close();
    triggerRef.current?.focus({ preventScroll: true });
  }, []);
  const step = useCallback(
    (d: 1 | -1) => {
      if (currentRef.current === null) return;
      setViewerLoaded(false);
      setLbDir(d);
      const next = (currentRef.current + d + list.length) % list.length;
      move(next);
      setFeatured(next);
    },
    [list.length, move, setViewerLoaded, setLbDir, setFeatured],
  );

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, step]);

  const onPanEnd = (_: PointerEvent, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 60 && Math.abs(info.offset.x) > Math.abs(info.offset.y) * 1.2) {
      step(info.offset.x < 0 ? 1 : -1);
    }
  };

  const photo = current === null ? null : list[current];
  const neighbours =
    current === null ? [] : [list[(current + 1) % list.length], list[(current - 1 + list.length) % list.length]];
  const ratio = photo ? photo.width / photo.height : 1.5;
  const slide = reduce ? 0 : 70;

  const photoV: Variants = {
    enter: (d: number) => ({
      clipPath: d === 0 || !viewerLive ? "inset(0 0 0 0)" : d > 0 ? "inset(0 0 0 100%)" : "inset(0 100% 0 0)",
    }),
    center: {
      clipPath: "inset(0 0 0 0)",
      x: "0%",
      transition: { duration: viewerLive ? V.wipe : 0, ease: EASE_REVEAL },
    },
    exit: (d: number) => ({
      x: d === 0 || !viewerLive ? "0%" : d > 0 ? `-${V.outShift}%` : `${V.outShift}%`,
      transition: { duration: d === 0 || !viewerLive ? 0 : V.wipe * 1.15, ease: EASE },
    }),
  };

  if (!hero) return null;
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 desk:mb-10">
        <div>
          <Reveal>
            <p className="t-eyebrow text-forest">Explore the collection</p>
          </Reveal>
          <Lines id="photos-title" as="h2" lines={["Stay, Dine, Explore"]} className="t-h2 text-forest m-0 mt-4" />
        </div>
        <div className="flex flex-col items-end gap-3">
          <div role="group" aria-label="Filter photographs" className="flex flex-wrap gap-2.5">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                aria-pressed={category === c}
                onClick={() => pick(c)}
                className={`t-small border-forest/20 relative cursor-pointer rounded-full border bg-transparent px-5 py-2 transition-colors duration-500 ${
                  category === c ? "text-ivory" : "text-forest hover:border-forest/50"
                }`}
              >
                {category === c ? (
                  <motion.span
                    layoutId="gal-pill"
                    aria-hidden="true"
                    className="bg-forest absolute -inset-px rounded-full"
                    transition={F.enabled ? F.pill : { duration: 0 }}
                  />
                ) : null}
                <span className="relative">{c}</span>
              </button>
            ))}
          </div>
          <AnimatedCount value={list.length} />
        </div>
      </div>

      <div onKeyDown={onKeys}>
        {/* Featured viewer */}
        <div
          id="gallery-viewer"
          className="bg-forest-deep text-ivory grid scroll-mt-28 overflow-hidden rounded-[22px] shadow-[0_24px_60px_rgba(10,34,27,0.18)] lg:grid-cols-[1.9fr_1fr]"
        >
          <motion.div
            ref={viewerRef}
            data-viewfinder=""
            className="relative aspect-[4/3] touch-pan-y overflow-hidden lg:aspect-auto lg:min-h-[26rem]"
            onPanEnd={onViewerPan}
          >
            <AnimatePresence mode="popLayout" initial={false} custom={dir}>
              <motion.div
                key={hero.src}
                custom={dir}
                variants={photoV}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
                style={{ opacity: flight ? 0 : 1 }}
              >
                <div
                  className={viewerLive ? "gal-kenburns absolute inset-0" : "absolute inset-0"}
                  style={
                    viewerLive
                      ? ({
                          "--kb-scale": V.kenBurns,
                          animationDuration: `${V.kenBurnsSeconds}s`,
                          animationPlayState: viewerNear ? "running" : "paused",
                        } as React.CSSProperties)
                      : undefined
                  }
                >
                  <Image
                    src={hero.src}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 62vw, 100vw"
                    placeholder="blur"
                    blurDataURL={hero.blur}
                    className="object-cover"
                    priority
                  />
                </div>
              </motion.div>
            </AnimatePresence>
            <button
              type="button"
              onClick={(e) => show(safeFeatured, e.currentTarget)}
              aria-haspopup="dialog"
              aria-label={`Open photo ${safeFeatured + 1} of ${list.length} full size: ${hero.alt}`}
              data-cursor="view"
              className="absolute inset-0 z-10 block size-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline-offset-[-4px]"
            />
            <div className="absolute bottom-5 left-5 z-20 flex gap-2.5">
              <button type="button" aria-label="Previous photo" onClick={() => stepFeatured(-1)} className={arrow}>
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M20 12H5M11 6l-6 6 6 6" />
                </svg>
              </button>
              <button type="button" aria-label="Next photo" onClick={() => stepFeatured(1)} className={arrow}>
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M4 12h15M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
          </motion.div>
          <div className="flex flex-col justify-between gap-10 p-7 desk:p-10">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={hero.src}
                initial="hidden"
                animate="show"
                exit="hidden"
                variants={{ hidden: {}, show: { transition: { staggerChildren: viewerLive ? 0.09 : 0 } } }}
                aria-live="polite"
              >
                <motion.p variants={viewerLive ? textV : undefined} className="t-eyebrow text-gold-soft">
                  {categoryOf(hero)}
                </motion.p>
                <motion.p
                  variants={viewerLive ? textV : undefined}
                  className="t-h3 m-0 mt-4 [font-size:clamp(1.625rem,1.2rem+1.4vw,2.25rem)]"
                >
                  {hero.alt}
                </motion.p>
              </motion.div>
            </AnimatePresence>
            <div>
              <p className="t-caption text-ivory/70 m-0 tracking-[0.18em] tabular-nums">
                <span className="sr-only">{`Photo ${safeFeatured + 1} of ${list.length}`}</span>
                <Odometer value={safeFeatured + 1} /> <span aria-hidden="true">/</span> <Odometer value={list.length} />
              </p>
              <span className="bg-ivory/20 mt-3 block h-px w-full">
                <motion.span
                  className="bg-gold block h-full origin-left"
                  animate={{ scaleX: (safeFeatured + 1) / list.length }}
                  transition={{ duration: reduce ? 0 : 0.7, ease: EASE }}
                />
              </span>
            </div>
          </div>
        </div>

        {/* Masonry of the collection */}
        <ul
          ref={wallRef}
          data-viewfinder=""
          className="m-0 mt-6 columns-2 list-none gap-5 p-0 lg:columns-3 [&>li]:mb-5 [&>li]:break-inside-avoid"
        >
          <AnimatePresence initial={false}>
            {visible.map((p, i) => (
              <WallItem
                key={p.src}
                photo={p}
                category={categoryOf(p)}
                index={i}
                batchIndex={i >= batchStart ? i - batchStart : 0}
                column={cols[i] ?? 0}
                wallProgress={wallProgress}
                parallaxOn={parallaxOn}
                active={i === safeFeatured}
                onPick={(el) => choose(i, el)}
              />
            ))}
          </AnimatePresence>
        </ul>
      </div>
      {shown < list.length ? (
        <div className="mt-8 flex justify-center">
          <button type="button" onClick={loadMore} aria-busy={loading} className="btn btn-line-dark">
            Load more photos
            {loading ? (
              <ApertureIcon spinning={!reduce} />
            ) : (
              <svg
                viewBox="0 0 24 24"
                className="size-[1.125rem]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M12 4v15M6 13l6 6 6-6" />
              </svg>
            )}
          </button>
        </div>
      ) : null}

      {flight && typeof document !== "undefined"
        ? createPortal(
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute z-[45] overflow-hidden will-change-transform"
              style={{ left: flight.x, top: flight.y, width: flight.w, height: flight.h, borderRadius: 16 }}
              initial={{
                x: flight.tx,
                y: flight.ty,
                scale: flight.scale,
                clipPath: `inset(${flight.insetY}px ${flight.insetX}px)`,
              }}
              animate={{ x: 0, y: 0, scale: 1, clipPath: "inset(0px 0px)" }}
              transition={{ duration: V.fly, ease: EASE_REVEAL }}
              onAnimationComplete={() => setFlight(null)}
            >
              <Image
                src={flight.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 62vw, 100vw"
                placeholder="blur"
                blurDataURL={flight.blur}
                className="object-cover"
                priority
              />
            </motion.div>,
            document.body,
          )
        : null}

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={() => {
          if (currentRef.current !== null) move(null);
        }}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none overflow-hidden border-0 bg-transparent p-0 text-ivory backdrop:bg-transparent"
      >
        <AnimatePresence onExitComplete={finishClose}>
          {open ? (
            <motion.div
              key="backdrop"
              className="bg-forest-deep absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              onClick={close}
            />
          ) : null}
          {photo && current !== null ? (
            <motion.div
              key={`fig-${current}`}
              className="absolute inset-0 flex touch-pan-y items-center justify-center pb-36 [--pad:2rem] desk:pb-28 desk:[--pad:13rem]"
              onPanEnd={onPanEnd}
              onClick={(e) => e.target === e.currentTarget && close()}
              initial={{ opacity: 0, x: lbDir * slide }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } }}
              exit={{ opacity: 0, x: -lbDir * slide * 0.6, transition: { duration: 0.35, ease: EASE } }}
            >
              <div
                className="relative overflow-hidden rounded-[12px]"
                style={{
                  aspectRatio: String(ratio),
                  width: `min(calc(100vw - var(--pad)), calc((100dvh - 12rem) * ${ratio}))`,
                  maxWidth: "100%",
                }}
              >
                <Image
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="100vw"
                  placeholder="blur"
                  blurDataURL={photo.blur}
                  onLoad={() => setViewerLoaded(true)}
                  className={`object-cover transition-[filter] duration-700 ease-out ${viewerLoaded ? "blur-0" : "blur-[10px]"}`}
                  priority
                />
              </div>
            </motion.div>
          ) : null}
          {open && photo ? (
            <motion.div
              key="chrome"
              className="pointer-events-none absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.6, delay: 0.25, ease: EASE } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <p
                className="t-small text-ivory/85 pointer-events-none absolute bottom-[5.75rem] left-5 m-0 max-w-[calc(100%-2.5rem)] desk:bottom-10 desk:left-24 desk:max-w-[40rem]"
                aria-live="polite"
              >
                <span className="t-kicker text-gold-soft mr-3">
                  {(current ?? 0) + 1} / {list.length}
                </span>
                {photo.alt}
              </p>
              {neighbours.map((n) => (
                <Image
                  key={n.src}
                  src={n.src}
                  alt=""
                  width={1}
                  height={1}
                  sizes="100vw"
                  aria-hidden="true"
                  className="pointer-events-none absolute size-px opacity-0"
                />
              ))}
              <div className="pointer-events-auto">
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close photo viewer"
                  className={`${chrome} top-4 right-4 desk:top-6 desk:right-6`}
                >
                  ✕
                </button>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label="Previous photo"
                  className={`${chrome} right-[4.75rem] bottom-5 desk:top-1/2 desk:right-auto desk:bottom-auto desk:left-6 desk:-translate-y-1/2`}
                >
                  ←
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label="Next photo"
                  className={`${chrome} right-4 bottom-5 desk:top-1/2 desk:right-6 desk:bottom-auto desk:-translate-y-1/2`}
                >
                  →
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </dialog>
    </>
  );
}
