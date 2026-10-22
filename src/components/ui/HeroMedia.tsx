"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Props = { videoSrc: string; imageSrc: string; imageAlt: string };

const HOLD_MS = 6500;

/**
 * Hero background that alternates between a looping video and a photograph, crossfading (1.6s) every few seconds; the
 * photograph drifts in slowly while it is showing. For visitors who prefer reduced motion, or have Data Saver on, nothing
 * rotates and nothing autoplays: the video simply shows its first frame.
 * The video is scaled up from the top-left so the generator watermark in its bottom-right corner falls outside the hero.
 */
export function HeroMedia({ videoSrc, imageSrc, imageAlt }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || saveData) return;
    video.play().catch(() => {});
    const id = window.setInterval(() => setShowImage((s) => !s), HOLD_MS);
    return () => window.clearInterval(id);
  }, []);

  // Let the video rest while the photograph is on screen, and pick it up again just before it fades back in.
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (showImage) {
      const t = window.setTimeout(() => video.pause(), 1800);
      return () => window.clearTimeout(t);
    }
    if (video.paused && video.currentTime > 0) video.play().catch(() => {});
  }, [showImage]);

  return (
    <>
      <video
        ref={videoRef}
        className={`absolute inset-0 size-full origin-top-left scale-[1.16] object-cover transition-opacity duration-[1600ms] ease-in-out ${
          showImage ? "opacity-0" : "opacity-100"
        }`}
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
        src={videoSrc}
      />
      <div
        className={`absolute inset-0 transition-opacity duration-[1600ms] ease-in-out ${
          showImage ? "opacity-100" : "opacity-0"
        }`}
      >
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="100vw"
          priority
          className={`object-cover transition-transform ease-out ${
            showImage ? "scale-[1.08] duration-[9000ms]" : "scale-100 duration-[1600ms]"
          }`}
        />
      </div>
    </>
  );
}
