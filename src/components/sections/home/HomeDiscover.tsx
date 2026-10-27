"use client";

import useEmblaCarousel from "embla-carousel-react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { Lines, Reveal } from "@/components/motion/primitives";
import { DUR, EASE, SCROLL_SPRING } from "@/components/motion/tokens";
import { useHomeFx } from "@/components/motion/useHomeFx";
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

/** The three photographs in the carousel (high-resolution site photographs), with the focal point that keeps the view in frame. */
const discoverPhotos = [
  {
    src: "/images/c18256_e258df5a2e004fb0b702a4bb9e142cec.jpg",
    alt: "The infinity pool and covered terrace at sunset",
    focus: "60% 55%",
  },
  {
    src: "/images/81d784_a30ae9d65f7a4c158c25796451fed75f.jpg",
    alt: "Aerial view of The Mountain Table's thatched house among the tea plantations",
    focus: "50% 50%",
  },
  {
    src: "/images/81d784_1c2a1355792941408dd4987fa7e78484.jpg",
    alt: "The infinity pool at night",
    focus: "50% 55%",
  },
] as const;

const control =
  "flex size-10 cursor-pointer items-center justify-center rounded-full border border-ivory/50 bg-forest-deep/30 text-ivory backdrop-blur-sm transition-colors duration-300 hover:bg-ivory hover:text-forest-deep focus-visible:bg-ivory focus-visible:text-forest-deep hover:scale-[1.06] active:scale-95";

/**
 * The film that "Watch Our Story" opens, full screen on a dark green backdrop with a cream close button. It is a native modal
 * dialog: keyboard focus is trapped inside while it is open, Escape, the close button and a click on the backdrop close it, and
 * focus returns to the button that opened it. The video fades in; the files are set in `HOME_FX.video`.
 */
export function StoryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
      opener.current?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label="Our story"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="film-dialog m-auto w-[min(92vw,70rem)] max-w-none overflow-visible border-0 bg-transparent p-0 backdrop:bg-[rgba(10,34,27,0.94)]"
    >
      {open ? (
        <div className="relative">
          <video
            className="aspect-video w-full rounded-[6px] bg-black object-cover"
            controls
            autoPlay
            playsInline
            loop
            poster={HOME_FX.video.heroPoster}
          >
            <source src={HOME_FX.video.film} type="video/mp4" />
            <source src={HOME_FX.video.filmFallback} type="video/quicktime" />
            <source src={HOME_FX.video.filmFallback} type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="bg-ivory text-forest-deep hover:bg-gold absolute -top-14 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full border-0 transition-colors duration-300 active:scale-95"
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
 * advances by itself, rests while hovered, focused or just used, and can be moved with the arrows, a swipe or the
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
  const night = useHomeFx("discover");
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress: sectionProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const dusk = useSpring(sectionProgress, SCROLL_SPRING);
  // Sunset to night: the picture slowly zooms in while a golden wash drains out and a twilight-blue wash deepens.
  const zoom = useTransform(dusk, [0, 1], [1.08, night ? 1.08 * HOME_FX.discover.zoomTo : 1.08]);
  const goldenOpacity = useTransform(dusk, [0.15, 0.65], [HOME_FX.discover.goldenOpacity, 0]);
  const twilightOpacity = useTransform(dusk, [0.2, 0.85], [0, HOME_FX.discover.twilightOpacity]);
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
      ref={sectionRef}
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
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={{ y: driftY, scale: zoom }}
            data-cursor="view"
          >
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
                          sizes="(min-width: 1024px) 60vw, 100vw"
                          quality={85}
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

          {night ? (
            <>
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  opacity: goldenOpacity,
                  background: `linear-gradient(to top, rgba(${HOME_FX.color.golden},0.9), rgba(${HOME_FX.color.golden},0) 70%)`,
                  mixBlendMode: "soft-light",
                }}
              />
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                style={{
                  opacity: twilightOpacity,
                  background: `rgba(${HOME_FX.color.twilight},1)`,
                  mixBlendMode: "multiply",
                }}
              />
            </>
          ) : null}

          {/* The photograph fades into the green on the text side (and at the top on small screens). */}
          <div
            aria-hidden="true"
            className="from-forest-deep lg:via-forest-deep/10 pointer-events-none absolute inset-0 bg-gradient-to-b via-transparent via-30% to-transparent lg:bg-gradient-to-r lg:via-18% lg:to-transparent lg:to-52%"
          />

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
