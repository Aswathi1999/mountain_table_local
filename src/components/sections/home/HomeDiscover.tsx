"use client";

import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useSyncExternalStore, type KeyboardEvent } from "react";
import { copy } from "@/data/copy";
import { DISCOVER_REPEATS, discoverPhotos } from "@/data/home";
import { rv, stagger } from "@/lib/reveal";

/** Seconds-worth of calm between automatic steps, and how long the rail rests after the visitor touches it. */
const STEP_MS = 2200;
const REST_AFTER_TOUCH_MS = 9000;

/**
 * Frame for each of the five photographs, so the rail reads as a composed sequence (tall, wide, tall...) instead of a strip of
 * equal tiles. Sizes are rem below 750px (the root font size scales with the viewport) and px from 750px up.
 */
const frames = [
  {
    box: "w-[15.5rem] h-[21.5rem] desk:w-[300px] desk:h-[540px] min-[1280px]:w-[350px] min-[1280px]:h-[620px]",
    drop: "mt-0",
    focus: "50% 55%",
  },
  {
    box: "w-[19rem] h-[15rem] desk:w-[450px] desk:h-[350px] min-[1280px]:w-[520px] min-[1280px]:h-[410px]",
    drop: "mt-10 desk:mt-[130px] min-[1280px]:mt-[150px]",
    focus: "34% 50%",
  },
  {
    box: "w-[16rem] h-[19.5rem] desk:w-[330px] desk:h-[480px] min-[1280px]:w-[380px] min-[1280px]:h-[560px]",
    drop: "mt-4 desk:mt-[40px] min-[1280px]:mt-[50px]",
    focus: "50% 45%",
  },
  {
    box: "w-[15rem] h-[20.5rem] desk:w-[300px] desk:h-[520px] min-[1280px]:w-[350px] min-[1280px]:h-[600px]",
    drop: "mt-12 desk:mt-[90px] min-[1280px]:mt-[100px]",
    focus: "50% 38%",
  },
  {
    box: "w-[15.5rem] h-[19rem] desk:w-[290px] desk:h-[500px] min-[1280px]:w-[330px] min-[1280px]:h-[570px]",
    drop: "mt-2 desk:mt-[20px] min-[1280px]:mt-[30px]",
    focus: "50% 50%",
  },
] as const;

/** Vertical scroll drift per slide (signed): neighbouring photos move at different speeds, so the rail has depth. */
const drifts = [0.07, -0.07, 0.1, -0.05, 0.08];

const photos = Array.from({ length: DISCOVER_REPEATS }, () => discoverPhotos).flat();

const arrowBtn =
  "flex size-12 active:scale-95 cursor-pointer items-center justify-center border border-gold/70 bg-transparent text-forest transition-colors duration-300 hover:bg-gold hover:text-forest-deep focus-visible:bg-gold focus-visible:text-forest-deep disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-forest";

/** Two topographic contour lines: a quiet natural hint behind the section. */
function Contours() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 1440 700"
      preserveAspectRatio="xMidYMid slice"
      className="pointer-events-none absolute inset-0 size-full fill-none stroke-gold/35"
      strokeWidth="1"
    >
      <path d="M-20 420C160 340 320 450 520 380S840 250 1040 310 1320 420 1460 340" />
      <path d="M-20 600C220 520 380 640 600 560S900 450 1100 510 1330 610 1460 540" />
    </svg>
  );
}

/**
 * "Discover": a deep-green gallery room. The heading is set exactly like "Our Services" (centred, gold line beneath), above a
 * full-width rail of photographs of different sizes and heights. The rail advances to the right by itself, rests while it is
 * hovered, focused, dragged or out of view, and can always be moved with the arrows, drag or the keyboard. Photographs are
 * revealed with a sideways wipe as the section arrives (the same 30 slides as before).
 */
export function HomeDiscover() {
  const [viewportRef, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    slidesToScroll: 1,
    duration: 27,
  });
  const regionRef = useRef<HTMLDivElement>(null);
  const restUntil = useRef(0);
  const hovering = useRef(false);
  const inView = useRef(false);

  const subscribe = useCallback(
    (notify: () => void) => {
      if (!embla) return () => {};
      embla.on("select", notify).on("reInit", notify).on("scroll", notify);
      return () => {
        embla.off("select", notify).off("reInit", notify).off("scroll", notify);
      };
    },
    [embla],
  );
  const canPrev = useSyncExternalStore(
    subscribe,
    () => embla?.canScrollPrev() ?? false,
    () => false,
  );
  const canNext = useSyncExternalStore(
    subscribe,
    () => embla?.canScrollNext() ?? true,
    () => true,
  );
  const progress = useSyncExternalStore(
    subscribe,
    () => (embla ? Math.min(1, Math.max(0, embla.scrollProgress())) : 0),
    () => 0,
  );

  // Rail parallax: as the rail moves sideways (auto-scroll, arrows, drag, keys) each photo slides inside its frame the
  // opposite way, so the images seem to trail the frames. Each slide's layer is shifted by its distance from the rail's middle.
  useEffect(() => {
    if (!embla || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const apply = () => {
      const view = embla.rootNode().getBoundingClientRect();
      const mid = view.left + view.width / 2;
      embla.slideNodes().forEach((node) => {
        const layer = node.querySelector<HTMLElement>("[data-rail-x]");
        if (!layer) return;
        const r = node.getBoundingClientRect();
        const rel = Math.max(-1, Math.min(1, (r.left + r.width / 2 - mid) / (view.width / 2 + r.width / 2)));
        layer.style.transform = `translate3d(${(-rel * r.width * 0.14).toFixed(1)}px, 0, 0)`;
      });
    };
    apply();
    embla.on("scroll", apply).on("reInit", apply).on("resize", apply);
    return () => {
      embla.off("scroll", apply).off("reInit", apply).off("resize", apply);
    };
  }, [embla]);

  // Auto-scroll to the right. Off for visitors who prefer reduced motion; paused while the section is out of view, the tab is
  // hidden, the pointer is over the rail, or the visitor has just used it. At the last photo it glides back to the first.
  useEffect(() => {
    const region = regionRef.current;
    if (!embla || !region || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rest = () => {
      restUntil.current = Date.now() + REST_AFTER_TOUCH_MS;
    };
    const observer = new IntersectionObserver(([entry]) => (inView.current = entry.isIntersecting), {
      threshold: 0.35,
    });
    observer.observe(region);
    const tick = window.setInterval(() => {
      if (!inView.current || hovering.current || document.hidden || Date.now() < restUntil.current) return;
      if (embla.canScrollNext()) embla.scrollNext();
      else embla.scrollTo(0);
    }, STEP_MS);
    embla.on("pointerDown", rest);
    return () => {
      window.clearInterval(tick);
      observer.disconnect();
      embla.off("pointerDown", rest);
    };
  }, [embla]);

  const touch = () => {
    restUntil.current = Date.now() + REST_AFTER_TOUCH_MS;
  };
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
    <section id="discover" aria-label="Discover" className="relative isolate bg-ivory text-forest">
      <Contours />

      <div className="relative py-12 desk:py-[72px]">
        <header className="px-6 text-center desk:px-8" {...rv("rise")}>
          <h2 className="t-h3 m-0 tracking-[0.18em]">{copy.home.discoverTitle}</h2>
          <span aria-hidden="true" className="mx-auto mt-6 block h-px w-16 bg-gold" />
        </header>

        <div
          ref={regionRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Discover"
          tabIndex={0}
          onKeyDown={onKeyDown}
          onPointerEnter={() => (hovering.current = true)}
          onPointerLeave={() => (hovering.current = false)}
          onFocus={touch}
          className="mt-10 min-w-0 outline-offset-8 desk:mt-12"
        >
          <div ref={viewportRef} className="cursor-grab overflow-hidden active:cursor-grabbing">
            <div className="flex items-start gap-4 desk:gap-6 min-[1000px]:min-h-[610px] min-[1280px]:min-h-[690px]">
              {photos.map((photo, i) => {
                const f = frames[i % frames.length];
                return (
                  <div
                    key={i}
                    role="group"
                    aria-roledescription="slide"
                    data-drift={drifts[i % drifts.length]}
                    className={`group relative shrink-0 grow-0 will-change-transform ${f.box} ${f.drop}`}
                  >
                    <div
                      className="absolute inset-0 overflow-hidden bg-forest transition-transform duration-700 ease-out group-hover:-translate-y-1"
                      {...rv("wipe", "wipe", stagger(i < 5 ? i * 0.12 : 0))}
                    >
                      <div className="mask-img absolute inset-0">
                        <div
                          data-drift-x={i % 2 ? -0.8 : 0.8}
                          className="absolute inset-y-0 -inset-x-[16%] will-change-transform"
                        >
                          <div data-rail-x="" className="absolute inset-0 will-change-transform">
                            <Image
                              src={photo.src}
                              alt={photo.alt}
                              placeholder="blur"
                              blurDataURL={photo.blur}
                              fill
                              sizes="(min-width: 750px) 520px, 300px"
                              className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]"
                              style={{ objectPosition: f.focus }}
                              draggable={false}
                              loading={i < 5 ? "eager" : "lazy"}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-6 px-6 desk:mt-10 min-[1000px]:pr-[max(2rem,calc((100vw-1180px)/2+2rem))] min-[1000px]:pl-[max(2rem,calc((100vw-1180px)/2+2rem))]">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Previous"
                disabled={!canPrev}
                onClick={() => go(-1)}
                className={arrowBtn}
              >
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M19 12H5M11 6l-6 6 6 6" />
                </svg>
              </button>
              <button type="button" aria-label="Next" disabled={!canNext} onClick={() => go(1)} className={arrowBtn}>
                <svg
                  viewBox="0 0 24 24"
                  className="size-5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M13 6l6 6-6 6" />
                </svg>
              </button>
            </div>
            <div aria-hidden="true" className="h-px flex-1 bg-forest/15">
              <span className="block h-full bg-gold" style={{ width: `${Math.round(progress * 100)}%` }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
