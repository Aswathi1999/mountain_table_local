"use client";

import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { useCallback, useSyncExternalStore, type CSSProperties, type ReactNode } from "react";

type Props = {
  slides: ReactNode[];
  /** Tailwind classes sizing each slide (width/height). */
  slideClassName: string;
  gapClassName: string;
  /** Distance (fraction of the viewport width) the first slide is inset after the first scroll; the original uses 74/980. */
  inset?: number;
  label: string;
  arrowClassName?: string;
  /** Optional purely visual progress line (aria-hidden) that tracks the scroll position; these classes position/colour its track. */
  progressClassName?: string;
  className?: string;
  style?: CSSProperties;
};

function Chevron({ flip }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 23 39"
      className={`h-[39px] w-[23px] max-desk:scale-[0.78] ${flip ? "-scale-x-100" : ""}`}
      aria-hidden="true"
    >
      <path d="M2 2 L21 19.5 L2 37" stroke="#fff" strokeWidth="1.8" fill="none" />
    </svg>
  );
}

/**
 * The one reusable slider. Matches the original gallery: the first slide sits flush left, every later position
 * insets the target slide by a fixed amount (so click 1 moves 208px and each next click one slide). Drag/swipe included.
 */
export function Carousel({
  slides,
  slideClassName,
  gapClassName,
  inset = 74 / 980,
  label,
  arrowClassName = "",
  progressClassName,
  className = "",
  style,
}: Props) {
  const options: EmblaOptionsType = {
    align: (viewSize, _snapSize, index) => (index === 0 ? 0 : viewSize * inset),
    containScroll: false,
    slidesToScroll: 1,
    duration: 22,
  };
  const [viewportRef, embla] = useEmblaCarousel(options);
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
  const subscribeScroll = useCallback(
    (notify: () => void) => {
      if (!embla) return () => {};
      embla.on("scroll", notify).on("reInit", notify);
      return () => {
        embla.off("scroll", notify).off("reInit", notify);
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
    subscribeScroll,
    () => (embla ? Math.min(1, Math.max(0, embla.scrollProgress())) : 0),
    () => 0,
  );

  const arrow = `absolute top-1/2 z-10 flex h-[39px] w-[23px] -translate-y-1/2 cursor-pointer items-center justify-center border-0 bg-transparent p-0 opacity-90 transition-opacity hover:opacity-100 ${arrowClassName}`;

  return (
    <div className={className} style={style} role="region" aria-roledescription="carousel" aria-label={label}>
      <div ref={viewportRef} className="h-full overflow-hidden">
        <div className={`flex h-full ${gapClassName}`}>
          {slides.map((slide, i) => (
            <div key={i} className={`shrink-0 grow-0 ${slideClassName}`} role="group" aria-roledescription="slide">
              {slide}
            </div>
          ))}
        </div>
      </div>
      {progressClassName ? (
        <div aria-hidden="true" className={progressClassName}>
          <span className="block h-full bg-gold" style={{ width: `${Math.round(progress * 100)}%` }} />
        </div>
      ) : null}
      {canPrev ? (
        <button
          type="button"
          aria-label="Previous"
          className={`${arrow} left-[1.4375rem] desk:left-[23px]`}
          onClick={() => embla?.scrollPrev()}
        >
          <Chevron flip />
        </button>
      ) : null}
      {canNext ? (
        <button
          type="button"
          aria-label="Next"
          className={`${arrow} right-[1.4375rem] desk:right-[23px]`}
          onClick={() => embla?.scrollNext()}
        >
          <Chevron />
        </button>
      ) : null}
    </div>
  );
}
