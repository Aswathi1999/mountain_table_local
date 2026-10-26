"use client";

import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useSyncExternalStore } from "react";
import { DUR, EASE, STAGGER, VIEW_ONCE } from "@/components/motion/tokens";
import { copy } from "@/data/copy";
import { services } from "@/data/home";

const control =
  "flex size-12 cursor-pointer items-center justify-center rounded-full border border-forest/35 bg-transparent text-forest transition-colors duration-300 hover:bg-forest hover:text-ivory focus-visible:bg-forest focus-visible:text-ivory active:scale-95 disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-forest";

/**
 * The services as a row of tall cards that runs off the right edge of the page: a photograph (or, for services without one, the
 * service's icon on sand) with the service name and its sentence beneath. Drag, swipe, or use the arrows; each card rises in
 * turn the first time the row is seen, and photographs zoom very slightly on hover.
 */
export function ServicesCarousel() {
  const [viewportRef, embla] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: false,
    duration: 36,
  });

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

  return (
    <div role="group" aria-roledescription="carousel" aria-label="Our services">
      <div
        ref={viewportRef}
        className="cursor-grab overflow-hidden active:cursor-grabbing lg:-mr-[max(2.5rem,calc((100vw-1280px)/2+2.5rem))]"
      >
        <ul className="m-0 flex list-none gap-5 p-0">
          {services.map((service, i) => (
            <motion.li
              key={service.key}
              data-motion=""
              aria-roledescription="slide"
              className="group w-[14.5rem] shrink-0 sm:w-[16rem]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW_ONCE}
              transition={{ duration: DUR.reveal, ease: EASE, delay: Math.min(i, 3) * STAGGER.base }}
            >
              <div className="bg-ivory-deep relative aspect-[3/4] overflow-hidden rounded-[6px]">
                {service.photo ? (
                  <div className="absolute inset-0 transition-transform duration-[800ms] ease-out group-hover:scale-[1.06]">
                    <Image
                      src={service.photo.src}
                      alt={service.photo.alt}
                      fill
                      sizes="(min-width: 640px) 256px, 232px"
                      className="object-cover"
                      draggable={false}
                    />
                  </div>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="border-gold/40 bg-ivory flex size-24 items-center justify-center rounded-full border transition-transform duration-700 ease-out group-hover:scale-105">
                      <Image src={service.icon} alt="" width={44} height={44} className="size-11 object-contain" />
                    </span>
                  </div>
                )}
              </div>
              <h3 className="t-h4 text-forest m-0 mt-5 transition-transform duration-500 ease-out group-hover:translate-x-1.5 [font-size:1.375rem]">
                {service.label}
              </h3>
              <p className="t-small text-ink/70 m-0 mt-1.5 [font-size:0.875rem]">{copy.home.services[service.key]}</p>
            </motion.li>
          ))}
        </ul>
      </div>

      <div className="mt-8 flex gap-3">
        <button
          type="button"
          aria-label="Previous services"
          disabled={!canPrev}
          onClick={() => embla?.scrollPrev()}
          className={control}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M20 12H5M11 6l-6 6 6 6" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Next services"
          disabled={!canNext}
          onClick={() => embla?.scrollNext()}
          className={control}
        >
          <svg
            viewBox="0 0 24 24"
            className="size-5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            aria-hidden="true"
          >
            <path d="M4 12h15M13 6l6 6-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
