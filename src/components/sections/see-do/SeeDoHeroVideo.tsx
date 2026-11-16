"use client";

import { useRef } from "react";
import { ImageFrame } from "@/components/motion/primitives";
import { useAutoplay } from "@/components/motion/useAutoplay";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

/** Muted, looping banner film for the See & Do hero. The still photograph is shown only for reduced motion, so it never flashes before the film starts. */
export function SeeDoHeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useAutoplay(ref, !reduce);
  if (reduce) {
    return (
      <ImageFrame
        src="/images/see-do-hero-v1.webp"
        alt=""
        sizes="100vw"
        className="h-full w-full"
        from="none"
        drift={5}
        radius={0}
        position="50% 58%"
        priority
      />
    );
  }
  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      src="/images/see_and_do/Banner-v2.mp4"
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
