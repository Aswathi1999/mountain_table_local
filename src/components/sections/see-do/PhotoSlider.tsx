"use client";

import useEmblaCarousel from "embla-carousel-react";
import { motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { DUR, EASE, EASE_REVEAL } from "@/components/motion/tokens";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

export type SliderPhoto = { src: string; alt: string };

const INTERVAL = 3000;

/**
 * An activity's photographs as a swipeable strip that advances by itself. Auto-advance pauses while the pointer is over it, while
 * it has focus, while it is off screen and for visitors who prefer reduced motion; swiping, dragging or the dots work any time.
 */
export function PhotoSlider({
  photos,
  sizes,
  position = "50% 50%",
  from = "left",
}: {
  photos: readonly SliderPhoto[];
  sizes: string;
  position?: string;
  /** Side the picture wipes in from when it first scrolls into view (matches the single-photo frames). */
  from?: "left" | "right";
}) {
  const reduce = useReducedMotion();
  const [emblaRef, embla] = useEmblaCarousel({ duration: 30 });
  const [index, setIndex] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  const hold = useRef({ hover: false, focus: false, seen: false, still: false });
  const timer = useRef(0);

  const advance = useCallback(() => {
    if (!embla) return;
    if (embla.canScrollNext()) embla.scrollNext();
    else embla.scrollTo(0);
  }, [embla]);

  const restart = useCallback(() => {
    window.clearInterval(timer.current);
    const h = hold.current;
    if (h.hover || h.focus || !h.seen || h.still) return;
    timer.current = window.setInterval(advance, INTERVAL);
  }, [advance]);

  useEffect(() => {
    if (!embla) return;
    const sync = () => setIndex(embla.selectedScrollSnap());
    embla.on("select", sync);
    // A manual swipe restarts the countdown so the picture never jumps away right after the visitor moved it.
    embla.on("pointerDown", () => window.clearInterval(timer.current));
    embla.on("settle", restart);
    return () => {
      embla.off("select", sync);
      embla.off("settle", restart);
    };
  }, [embla, restart]);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    hold.current.still = mq.matches;
    const onMq = () => {
      hold.current.still = mq.matches;
      restart();
    };
    mq.addEventListener("change", onMq);
    const io = new IntersectionObserver(
      ([entry]) => {
        hold.current.seen = entry.isIntersecting;
        restart();
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => {
      mq.removeEventListener("change", onMq);
      io.disconnect();
      window.clearInterval(timer.current);
    };
  }, [restart]);

  const set = (key: "hover" | "focus", value: boolean) => {
    hold.current[key] = value;
    restart();
  };

  return (
    <motion.div
      ref={root}
      data-motion=""
      className="relative h-full w-full"
      initial={reduce ? false : { clipPath: from === "left" ? "inset(0 100% 0 0)" : "inset(0 0 0 100%)" }}
      whileInView={{ clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: DUR.image, ease: EASE_REVEAL }}
      role="group"
      aria-roledescription="carousel"
      onPointerEnter={(e) => e.pointerType === "mouse" && set("hover", true)}
      onPointerLeave={(e) => e.pointerType === "mouse" && set("hover", false)}
      onFocus={() => set("focus", true)}
      onBlur={() => set("focus", false)}
    >
      <motion.div
        data-motion=""
        className="h-full"
        initial={reduce ? false : { scale: 1.18 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: DUR.settle, ease: EASE }}
      >
        <div ref={emblaRef} className="h-full overflow-hidden">
          <div className="flex h-full touch-pan-y will-change-transform">
            {photos.map((p, i) => (
              <div
                key={p.src}
                className="relative h-full min-w-0 flex-[0_0_100%]"
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${photos.length}`}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes={sizes}
                  className="object-cover"
                  style={{ objectPosition: position }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="absolute inset-x-0 bottom-4 flex justify-center gap-2">
        {photos.map((p, i) => (
          <button
            key={p.src}
            type="button"
            aria-label={`Show photograph ${i + 1}`}
            aria-current={i === index}
            onClick={() => embla?.scrollTo(i)}
            className="flex size-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
          >
            <span
              className={`block h-[3px] rounded-full bg-white transition-all duration-500 ${i === index ? "w-7 opacity-95" : "w-3 opacity-55"}`}
            />
          </button>
        ))}
      </div>
    </motion.div>
  );
}
