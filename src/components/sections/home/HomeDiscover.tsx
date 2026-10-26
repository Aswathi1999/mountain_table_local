"use client";

import useEmblaCarousel from "embla-carousel-react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { Lines, Reveal } from "@/components/motion/primitives";
import { DUR, EASE, SCROLL_SPRING } from "@/components/motion/tokens";
import { copy } from "@/data/copy";
import { sentenceCase } from "@/lib/text";

/** Calm between automatic steps, and how long the carousel rests after the visitor uses it. */
const STEP_MS = 5200;
const REST_AFTER_TOUCH_MS = 9000;

/** Discover section copy, as set in the approved design reference. */
const discover = {
  lines: ["Where Every Moment", "Feels Extraordinary"],
  body: "From peaceful mornings to starlit evenings, The Mountain Table offers a sanctuary where nature, comfort, and unforgettable experiences come together.",
  cta: "Watch Our Story",
} as const;

/** The three photographs in the carousel, with the focal point that keeps the view in frame. */
const discoverPhotos = [
  {
    src: "/images/image_1.png",
    alt: "A terrace with timber armchairs looking out over snow-capped mountains",
    focus: "62% 50%",
  },
  {
    src: "/images/image_2.png",
    alt: "An infinity pool and sun loungers overlooking a mountain valley",
    focus: "58% 50%",
  },
  {
    src: "/images/image_3.png",
    alt: "A fire bowl and lanterns on a terrace at dusk with the mountains behind",
    focus: "52% 55%",
  },
] as const;

const control =
  "flex size-10 cursor-pointer items-center justify-center rounded-full border border-ivory/50 bg-forest-deep/30 text-ivory backdrop-blur-sm transition-colors duration-300 hover:bg-ivory hover:text-forest-deep focus-visible:bg-ivory focus-visible:text-forest-deep hover:scale-[1.06] active:scale-95";

/** The film that "Watch Our Story" opens: the property's own hero film, in a native dialog (Esc and the close button dismiss it). */
export function StoryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label="Our story"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[min(92vw,70rem)] max-w-none overflow-visible border-0 bg-transparent p-0 backdrop:bg-black/80"
    >
      {open ? (
        <div className="relative">
          <video
            src="/videos/kling_20261014_VIDEO_Create_a_p_4745_0.mov"
            className="aspect-video w-full rounded-[6px] bg-black object-cover"
            controls
            autoPlay
            playsInline
            loop
          />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className={`${control} absolute -top-14 right-0`}
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      ) : null}
    </dialog>
  );
}

/**
 * "Discover", as in the reference: a deep forest-green band with the headline, paragraph and "Watch Our Story" on the left and a wide
 * photograph bleeding off the right edge that fades into the green. The photographs are a carousel (three terrace views): it
 * advances by itself, rests while hovered, focused or just used, and can be moved with the arrows, the dots, a swipe or the
 * keyboard. The active photograph settles from a slight zoom as it arrives.
 */
export function HomeDiscover() {
  const [viewportRef, embla] = useEmblaCarousel({ loop: true, duration: 40 });
  const regionRef = useRef<HTMLDivElement>(null);
  const restUntil = useRef(0);
  const hovering = useRef(false);
  const inView = useRef(false);
  const [story, setStory] = useState(false);
  const reduce = useReducedMotion();
  // Slow parallax: the photographs drift a few percent against the scroll while the band crosses the screen.
  const { scrollYProgress } = useScroll({ target: regionRef, offset: ["start end", "end start"] });
  const driftPct = useSpring(useTransform(scrollYProgress, [0, 1], [reduce ? 0 : -4, reduce ? 0 : 4]), SCROLL_SPRING);
  const driftY = useTransform(driftPct, (v) => v + "%");

  const subscribe = useCallback(
    (notify: () => void) => {
      if (!embla) return () => {};
      embla.on("select", notify).on("reInit", notify);
      return () => {
        embla.off("select", notify).off("reInit", notify);
      };
    },
    [embla],
  );
  const selected = useSyncExternalStore(
    subscribe,
    () => embla?.selectedScrollSnap() ?? 0,
    () => 0,
  );

  const touch = () => {
    restUntil.current = Date.now() + REST_AFTER_TOUCH_MS;
  };

  // Auto-advance, paused while out of view, the tab is hidden, the pointer is over the carousel, or the visitor just used it.
  // Off for visitors who prefer reduced motion.
  useEffect(() => {
    const region = regionRef.current;
    if (!embla || !region || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const observer = new IntersectionObserver(([entry]) => (inView.current = entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(region);
    const tick = window.setInterval(() => {
      if (!inView.current || hovering.current || document.hidden || Date.now() < restUntil.current) return;
      embla.scrollNext();
    }, STEP_MS);
    embla.on("pointerDown", touch);
    return () => {
      window.clearInterval(tick);
      observer.disconnect();
      embla.off("pointerDown", touch);
    };
  }, [embla]);

  const go = (dir: 1 | -1) => {
    touch();
    if (dir === 1) embla?.scrollNext();
    else embla?.scrollPrev();
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowRight") go(1);
    if (e.key === "ArrowLeft") go(-1);
  };

  return (
    <section
      id="discover"
      aria-labelledby="discover-title"
      className="bg-forest-deep text-ivory relative isolate overflow-hidden"
    >
      <div className="lg:grid lg:min-h-[30rem] lg:grid-cols-12">
        <div className="wrap relative z-10 flex flex-col justify-center py-16 lg:col-span-6 lg:max-w-none lg:py-24 lg:pr-0 lg:pl-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))]">
          <Reveal>
            <p className="t-eyebrow text-ivory">{sentenceCase(copy.home.discoverTitle)}</p>
          </Reveal>
          <Lines
            id="discover-title"
            as="h2"
            lines={discover.lines}
            className="t-h2 m-0 mt-5 [font-size:clamp(2rem,1.3rem+2.1vw,3.125rem)]"
          />
          <Reveal delay={0.1} className="mt-5">
            <p className="t-body text-ivory/80 m-0 max-w-[26em] [font-size:0.9375rem] [line-height:1.7]">
              {discover.body}
            </p>
          </Reveal>
          <Reveal delay={0.2} className="mt-8">
            <button
              type="button"
              onClick={() => setStory(true)}
              className="group text-ivory inline-flex cursor-pointer items-center gap-4 border-0 bg-transparent p-0"
            >
              <span className="border-ivory/60 group-hover:bg-ivory group-hover:text-forest-deep relative flex size-12 items-center justify-center rounded-full border transition-colors duration-500">
                <span aria-hidden="true" className="ring-pulse border-ivory/70 absolute inset-0 rounded-full border" />
                <svg viewBox="0 0 24 24" className="ml-0.5 size-4" fill="currentColor" aria-hidden="true">
                  <path d="M7 4.5v15l12-7.5z" />
                </svg>
              </span>
              <span className="t-ui">{discover.cta}</span>
            </button>
          </Reveal>
        </div>

        <div
          ref={regionRef}
          role="group"
          aria-roledescription="carousel"
          aria-label="Discover"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerEnter={() => (hovering.current = true)}
          onPointerLeave={() => (hovering.current = false)}
          onFocus={touch}
          className="relative aspect-[4/3] overflow-hidden outline-offset-[-4px] lg:col-span-6 lg:aspect-auto lg:min-h-full"
        >
          <motion.div className="absolute inset-0 scale-[1.08] will-change-transform" style={{ y: driftY }}>
            <motion.div
              data-motion=""
              className="absolute inset-0"
              initial={reduce ? false : { scale: 1.05 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.8, ease: EASE }}
            >
              <div ref={viewportRef} className="absolute inset-0 cursor-grab overflow-hidden active:cursor-grabbing">
                <div className="flex h-full">
                  {discoverPhotos.map((photo, i) => (
                    <div
                      key={photo.src}
                      role="group"
                      aria-roledescription="slide"
                      aria-label={`${i + 1} of ${discoverPhotos.length}`}
                      className="relative h-full min-w-0 flex-[0_0_100%] overflow-hidden"
                    >
                      <motion.div
                        className="absolute inset-0 will-change-transform"
                        initial={false}
                        animate={{ scale: i === selected ? 1 : 1.08 }}
                        transition={{ duration: DUR.settle + 0.6, ease: EASE }}
                      >
                        <Image
                          src={photo.src}
                          alt={photo.alt}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className="object-cover"
                          style={{ objectPosition: photo.focus }}
                          draggable={false}
                          loading={i < 2 ? "eager" : "lazy"}
                        />
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* The photograph fades into the green on the text side (and at the top on small screens). */}
          <div
            aria-hidden="true"
            className="from-forest-deep lg:via-forest-deep/10 pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent via-30% to-transparent lg:bg-gradient-to-r lg:via-18% lg:to-transparent lg:to-52%"
          />

          <ol className="absolute top-1/2 right-4 m-0 flex -translate-y-1/2 list-none flex-col gap-3 p-0 lg:right-8">
            {discoverPhotos.map((photo, i) => (
              <li key={photo.src}>
                <button
                  type="button"
                  aria-label={`Show photograph ${i + 1}`}
                  aria-current={i === selected}
                  onClick={() => {
                    touch();
                    embla?.scrollTo(i);
                  }}
                  className="flex size-5 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                >
                  <span
                    className={`border-ivory block rounded-full border transition-[background-color,width,height] duration-500 ${
                      i === selected ? "bg-ivory size-2.5" : "size-2 bg-transparent"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>

          <div className="absolute right-4 bottom-4 flex gap-2 lg:right-8 lg:bottom-8">
            <button type="button" aria-label="Previous photograph" onClick={() => go(-1)} className={control}>
              <svg
                viewBox="0 0 24 24"
                className="size-[1.125rem]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M20 12H5M11 6l-6 6 6 6" />
              </svg>
            </button>
            <button type="button" aria-label="Next photograph" onClick={() => go(1)} className={control}>
              <svg
                viewBox="0 0 24 24"
                className="size-[1.125rem]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <path d="M4 12h15M13 6l6 6-6 6" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <StoryDialog open={story} onClose={() => setStory(false)} />
    </section>
  );
}
