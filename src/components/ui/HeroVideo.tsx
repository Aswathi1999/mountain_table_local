"use client";

import { useEffect, useRef } from "react";

/**
 * Looping, muted background video. Scaled up from the top-left so the generator watermark in the bottom-right corner of the
 * clip falls outside the hero. For visitors who prefer reduced motion or have Data Saver on it does not autoplay and simply
 * shows its first frame.
 */
export function HeroVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || saveData) return;
    video.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      className="absolute inset-0 size-full origin-top-left scale-[1.16] object-cover"
      muted
      loop
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
      src={src}
    />
  );
}
