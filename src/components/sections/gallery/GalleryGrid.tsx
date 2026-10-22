"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { rv, stagger } from "@/lib/reveal";
import type { GalleryPhoto } from "@/data/gallery";

type Props = { photos: readonly GalleryPhoto[] };

/**
 * One photograph in the masonry. While the full image downloads it shows a blurred preview of the photo itself with a soft
 * light sweep; when the image arrives it sharpens and settles into place. The frame is revealed once on entering the
 * viewport, the photo drifts slightly with scroll, and hovering adds a slow zoom, a gold underline and a viewer cue.
 */
function GalleryItem({
  photo,
  index,
  total,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  total: number;
  onOpen: (i: number) => void;
}) {
  const [loaded, setLoaded] = useState(false);
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      aria-label={`View photo ${index + 1} of ${total}: ${photo.alt}`}
      aria-haspopup="dialog"
      className="group relative block w-full cursor-zoom-in overflow-hidden border-0 bg-ivory-deep p-0 text-left"
      style={{ aspectRatio: `${photo.width} / ${photo.height}`, ...stagger((index % 3) * 0.1) }}
      {...rv("mask", "mask")}
    >
      <span className="mask-img absolute inset-0 block">
        <span className="absolute inset-0 block transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05] group-focus-visible:scale-[1.05]">
          <span data-drift="0.06" className="absolute inset-x-0 -top-[10%] block h-[120%] will-change-transform">
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(min-width: 1000px) 380px, (min-width: 560px) 46vw, 92vw"
              placeholder="blur"
              blurDataURL={photo.blur}
              onLoad={() => setLoaded(true)}
              className={`object-cover transition-[filter,transform] duration-[1200ms] ease-out ${
                loaded ? "scale-100 blur-0" : "scale-[1.06] blur-[6px]"
              }`}
              loading={index < 3 ? "eager" : "lazy"}
            />
          </span>
        </span>
      </span>
      <span
        aria-hidden="true"
        className={`gal-sweep pointer-events-none absolute inset-0 block transition-opacity duration-700 ${
          loaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center bg-forest-deep/0 transition-colors duration-700 group-hover:bg-forest-deep/25 group-focus-visible:bg-forest-deep/25"
      >
        <span className="flex size-12 scale-75 items-center justify-center border border-ivory/80 bg-forest-deep/50 text-[1.25rem] leading-none text-ivory opacity-0 transition-[opacity,transform] duration-500 ease-out group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100">
          +
        </span>
      </span>
      <span
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 block h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-out group-hover:scale-x-100 group-focus-visible:scale-x-100"
      />
    </button>
  );
}

/**
 * Masonry of the property photographs (CSS columns, each frame keeps its real aspect ratio) and a keyboard-accessible
 * lightbox built on the native <dialog>: Escape closes, arrow keys / buttons move between photos, focus returns to the
 * photo that was opened. The neighbouring photos are fetched ahead of time so stepping through is instant.
 */
export function GalleryGrid({ photos }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [current, setCurrent] = useState<number | null>(null);
  const [viewerLoaded, setViewerLoaded] = useState(false);
  const open = current !== null;

  const show = useCallback((i: number) => {
    setViewerLoaded(false);
    setCurrent(i);
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);
  const close = useCallback(() => dialogRef.current?.close(), []);
  const step = useCallback(
    (dir: 1 | -1) => {
      setViewerLoaded(false);
      setCurrent((c) => (c === null ? c : (c + dir + photos.length) % photos.length));
    },
    [photos.length],
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

  const photo = current === null ? null : photos[current];
  const neighbours =
    current === null
      ? []
      : [photos[(current + 1) % photos.length], photos[(current - 1 + photos.length) % photos.length]];
  const btn =
    "absolute z-10 flex size-12 cursor-pointer items-center justify-center border border-ivory/30 bg-forest-deep/60 text-ivory transition-colors duration-300 hover:bg-gold hover:text-forest-deep focus-visible:bg-gold focus-visible:text-forest-deep";

  return (
    <>
      <ul className="m-0 list-none gap-5 p-0 [column-count:1] min-[560px]:[column-count:2] min-[1000px]:[column-count:3] desk:gap-7">
        {photos.map((p, i) => (
          <li key={p.src} className="mb-5 break-inside-avoid desk:mb-7">
            <GalleryItem photo={p} index={i} total={photos.length} onOpen={show} />
          </li>
        ))}
      </ul>

      <dialog
        ref={dialogRef}
        aria-label="Photo viewer"
        onClose={() => setCurrent(null)}
        onClick={(e) => e.target === e.currentTarget && close()}
        className="fixed inset-0 m-0 h-dvh max-h-none w-dvw max-w-none border-0 bg-forest-deep/95 p-0 text-ivory backdrop:bg-black/80"
      >
        {photo ? (
          <div className="relative flex h-full w-full flex-col items-center justify-center px-4 py-16 desk:px-24">
            <div className="relative size-full" onClick={close}>
              <Image
                key={photo.src}
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="100vw"
                placeholder="blur"
                blurDataURL={photo.blur}
                onLoad={() => setViewerLoaded(true)}
                className={`object-contain transition-[filter] duration-700 ease-out motion-safe:animate-[lb-in_0.6s_cubic-bezier(0.22,1,0.36,1)] ${
                  viewerLoaded ? "blur-0" : "blur-[10px]"
                }`}
                priority
              />
            </div>
            {/* Warm the cache for the photos either side (invisible, 1px). */}
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
            <p className="t-small m-0 mt-4 max-w-[48rem] text-center text-ivory/85" aria-live="polite">
              <span className="text-gold-soft">
                {(current ?? 0) + 1} / {photos.length}
              </span>
              {" · "}
              {photo.alt}
            </p>
            <button type="button" onClick={close} aria-label="Close photo viewer" className={`${btn} top-4 right-4`}>
              ✕
            </button>
            <button
              type="button"
              onClick={() => step(-1)}
              aria-label="Previous photo"
              className={`${btn} top-1/2 left-3 -translate-y-1/2 desk:left-6`}
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => step(1)}
              aria-label="Next photo"
              className={`${btn} top-1/2 right-3 -translate-y-1/2 desk:right-6`}
            >
              →
            </button>
          </div>
        ) : null}
      </dialog>
    </>
  );
}
