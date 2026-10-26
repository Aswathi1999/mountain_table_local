"use client";

import { AnimatePresence, motion, useReducedMotion, type PanInfo } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { EASE, EASE_REVEAL } from "@/components/motion/primitives";
import type { GalleryPhoto } from "@/data/gallery";

type Props = { photos: readonly GalleryPhoto[] };

/**
 * Where each photograph sits in the 12-column composition (desktop) and how wide it runs on a phone. Every photograph keeps its
 * own aspect ratio, nothing is cropped. Entries are in photo order, so the tab order follows the picture order. Photographs past
 * the end of this list (if more are added) fall back to a plain half-width placement.
 */
const PLACEMENT: readonly string[] = [
  "col-span-12 desk:col-span-8 desk:col-start-1", // 0 aerial
  "col-span-7 col-start-6 desk:col-span-3 desk:col-start-10 desk:mt-16", // 1
  "col-span-8 desk:col-span-4 desk:col-start-2", // 2 steps
  "col-span-9 col-start-4 desk:col-span-5 desk:col-start-7 desk:mt-10", // 3
  "col-span-12 desk:col-span-10 desk:col-start-2", // 4 dining, the wide moment
  "col-span-7 desk:col-span-4 desk:col-start-1", // 5
  "col-span-12 desk:col-span-8 desk:col-start-5 desk:mt-0", // 6 room 1
  "col-span-10 desk:col-span-6 desk:col-start-1 desk:mt-0", // 7
  "col-span-6 col-start-7 desk:col-span-3 desk:col-start-9 desk:mt-12", // 8
  "col-span-12 desk:col-span-9 desk:col-start-4", // 9
  "col-span-12 desk:col-span-7 desk:col-start-1", // 10
  "col-span-8 col-start-5 desk:col-span-4 desk:col-start-9 desk:mt-10", // 11
  "col-span-12 desk:col-span-8 desk:col-start-2", // 12 hall
  "col-span-6 desk:col-span-3 desk:col-start-10 desk:mt-16", // 13
  "col-span-7 col-start-6 desk:col-span-4 desk:col-start-1", // 14
  "col-span-12 desk:col-span-8 desk:col-start-5 desk:mt-0", // 15 bedroom
  "col-span-8 desk:col-span-4 desk:col-start-3", // 16 bar
  "col-span-6 col-start-7 desk:col-span-4 desk:col-start-8 desk:mt-12", // 17
  "col-span-12 desk:col-span-6 desk:col-start-1", // 18
  "col-span-8 col-start-5 desk:col-span-4 desk:col-start-8 desk:mt-0", // 19
  "col-span-8 desk:col-span-4 desk:col-start-5", // 20
];
const FALLBACK = "col-span-12 desk:col-span-6";

const FLY = { duration: 0.8, ease: EASE } as const;

/**
 * One photograph. The frame is uncovered with a clip-path as it scrolls into view and the photograph settles from a slight zoom.
 * Hover (and keyboard focus) slowly zooms the photograph and slides a caption bar up from the bottom edge. The photograph's box
 * carries the shared `layoutId`, so opening it flies the same box up into the lightbox. A transparent button on top is the control.
 */
function GalleryItem({
  photo,
  index,
  total,
  placement,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  total: number;
  placement: string;
  onOpen: (i: number, el: HTMLButtonElement) => void;
}) {
  const reduce = useReducedMotion();
  const [loaded, setLoaded] = useState(false);
  return (
    <li className={`gal-item group ${placement}`}>
      <motion.div
        data-motion=""
        className="relative overflow-hidden rounded-[18px]"
        initial={reduce ? false : { clipPath: index % 2 ? "inset(0 0 0 100%)" : "inset(100% 0 0 0)" }}
        whileInView={{ clipPath: "inset(0 0 0 0)" }}
        viewport={{ once: true, margin: "0px 0px -8% 0px" }}
        transition={{ duration: 1.2, ease: EASE_REVEAL }}
      >
        <motion.div
          layoutId={`photo-${index}`}
          transition={FLY}
          className="bg-ivory-deep relative w-full overflow-hidden rounded-[18px]"
          style={{ aspectRatio: `${photo.width} / ${photo.height}` }}
        >
          <motion.div
            data-motion=""
            className="absolute inset-0"
            initial={reduce ? false : { scale: 1.08 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true, margin: "0px 0px -8% 0px" }}
            transition={{ duration: 1.6, ease: EASE }}
          >
            <div className="img-zoom absolute inset-0">
              <Image
                src={photo.src}
                alt=""
                fill
                sizes="(min-width: 1280px) 760px, (min-width: 750px) 66vw, 92vw"
                placeholder="blur"
                blurDataURL={photo.blur}
                onLoad={() => setLoaded(true)}
                loading={index < 2 ? "eager" : "lazy"}
                className={`object-cover transition-[filter] duration-[1200ms] ease-out ${loaded ? "blur-0" : "blur-[6px]"}`}
              />
            </div>
          </motion.div>
        </motion.div>
        <span
          aria-hidden="true"
          className="t-small bg-forest-deep/95 text-ivory pointer-events-none absolute inset-x-0 bottom-0 translate-y-full px-4 py-3 transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0 group-focus-within:translate-y-0 max-[749px]:hidden"
        >
          {photo.alt}
        </span>
        <button
          type="button"
          onClick={(e) => onOpen(index, e.currentTarget)}
          aria-label={`View photo ${index + 1} of ${total}: ${photo.alt}`}
          aria-haspopup="dialog"
          className="absolute inset-0 z-10 block size-full cursor-zoom-in border-0 bg-transparent p-0 focus-visible:outline-offset-[-4px]"
        />
      </motion.div>
    </li>
  );
}

const chrome =
  "absolute z-10 flex size-12 cursor-pointer items-center justify-center border border-ivory/25 bg-forest-deep/50 text-ivory transition-colors duration-300 hover:bg-gold hover:text-forest-deep focus-visible:bg-gold focus-visible:text-forest-deep";

/**
 * Editorial composition of the property photographs and a keyboard-accessible lightbox built on the native modal <dialog>
 * (focus trap, Escape, focus return). The opened photograph flies out of its place in the page (shared `layoutId`) and flies
 * back on close; stepping between photographs slides them sideways, with arrow keys, buttons or a swipe. Neighbours are
 * fetched ahead of time.
 */
export function GalleryGrid({ photos }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const [current, setCurrent] = useState<number | null>(null);
  /** Index the lightbox was opened from: only that photograph shares its box with the page. */
  const [entry, setEntry] = useState<number | null>(null);
  const [dir, setDir] = useState<1 | -1 | 0>(0);
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const currentRef = useRef<number | null>(null);
  const reduce = useReducedMotion();
  const open = current !== null;

  const move = useCallback((i: number | null) => {
    currentRef.current = i;
    setCurrent(i);
  }, []);

  const show = useCallback(
    (i: number, el: HTMLButtonElement) => {
      triggerRef.current = el;
      setViewerLoaded(false);
      setDir(0);
      setEntry(i);
      move(i);
      const dialog = dialogRef.current;
      if (dialog && !dialog.open) dialog.showModal();
    },
    [move],
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
      setDir(d);
      move((currentRef.current + d + photos.length) % photos.length);
    },
    [photos.length, move],
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

  const photo = current === null ? null : photos[current];
  const neighbours =
    current === null
      ? []
      : [photos[(current + 1) % photos.length], photos[(current - 1 + photos.length) % photos.length]];
  const ratio = photo ? photo.width / photo.height : 1.5;
  const shared = current !== null && current === entry;
  const slide = reduce ? 0 : 70;

  return (
    <>
      <ul className="gal-list m-0 grid list-none grid-cols-12 items-start gap-x-4 gap-y-6 p-0 desk:gap-x-6 desk:gap-y-8">
        {photos.map((p, i) => (
          <GalleryItem
            key={p.src}
            photo={p}
            index={i}
            total={photos.length}
            placement={PLACEMENT[i] ?? FALLBACK}
            onOpen={show}
          />
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onCancel={(e) => {
          e.preventDefault();
          close();
        }}
        onClose={() => {
          // Closed by the browser (not through our exit animation): make sure state follows.
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
              initial={shared ? false : { opacity: 0, x: dir * slide }}
              animate={{ opacity: 1, x: 0, transition: { duration: 0.7, ease: EASE } }}
              exit={
                shared
                  ? { opacity: 1, transition: { duration: 0 } }
                  : { opacity: 0, x: -dir * slide * 0.6, transition: { duration: 0.35, ease: EASE } }
              }
            >
              <motion.div
                layoutId={shared ? `photo-${current}` : undefined}
                transition={FLY}
                className="relative overflow-hidden"
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
              </motion.div>
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
                  {(current ?? 0) + 1} / {photos.length}
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
