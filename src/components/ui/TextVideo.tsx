"use client";

import { useEffect, useRef } from "react";

type Props = {
  videoSrc: string;
  poster: string;
  className?: string;
  style?: React.CSSProperties;
};

/**
 * "ADVENTURE AWAITS:" headline with a looping video showing through the letters (the original's video-in-text box).
 * The lettering is a static SVG (scripts/build-mask.mjs, Anton embedded) used as a CSS mask, so the page background
 * stays visible around the glyphs and the effect scales with the box. Autoplay is skipped when the visitor prefers
 * reduced motion (the poster frame shows instead).
 */
export function TextVideo({ videoSrc, poster, className = "", style }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      video.pause();
      return;
    }
    video.play().catch(() => {});
  }, []);

  const mask = 'url("/images/adventure-mask.svg")';
  return (
    <div className={className} style={style}>
      <video
        ref={ref}
        className="block size-full object-cover"
        style={{
          maskImage: mask,
          WebkitMaskImage: mask,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
          maskRepeat: "no-repeat",
          WebkitMaskRepeat: "no-repeat",
        }}
        src={videoSrc}
        poster={poster}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
    </div>
  );
}
