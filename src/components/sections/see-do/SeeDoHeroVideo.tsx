"use client";

import { useRef } from "react";
import { useAutoplay } from "@/components/motion/useAutoplay";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

/** Muted, looping banner film for the See & Do hero. It sits over the hero photograph, which stays visible until the first frame plays and for reduced motion. */
export function SeeDoHeroVideo() {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  useAutoplay(ref, !reduce);
  if (reduce) return null;
  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full object-cover"
      src="/images/see_and_do/Banner.mp4"
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
