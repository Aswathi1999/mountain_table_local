"use client";

import { useEffect, useRef, useState } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";

/**
 * Looping, silent background video with the hero still as its poster and fallback.
 * - Phones (under 768px), Data Saver and reduced motion get only the still image: the video file is never downloaded.
 * - The video plays inline, and pauses whenever it is off-screen or the tab is hidden.
 * Scaled up from the top-left so the generator watermark in the clip's bottom-right corner falls outside the hero.
 */
export function HeroVideo({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [useVideo, setUseVideo] = useState(false);
  const { heroLoop, heroFallback, heroPoster } = HOME_FX.video;

  useEffect(() => {
    const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const allowed = !reduce && !saveData && window.innerWidth >= 768;
    // One-time decision after hydration (the server and first paint show the still image).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setUseVideo(allowed);
  }, []);

  useEffect(() => {
    const video = ref.current;
    if (!useVideo || !video) return;
    let visible = true;
    const sync = () => {
      if (visible && !document.hidden) video.play().catch(() => {});
      else video.pause();
    };
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    io.observe(video);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
    };
  }, [useVideo]);

  return (
    <>
      {/* The still: always present (it is the poster, the mobile image and the fallback). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={heroPoster}
        alt=""
        aria-hidden="true"
        fetchPriority="high"
        className={`absolute inset-0 size-full origin-top-left scale-[1.16] object-cover ${className}`}
      />
      {useVideo ? (
        <video
          ref={ref}
          className={`absolute inset-0 size-full origin-top-left scale-[1.16] object-cover ${className}`}
          muted
          loop
          playsInline
          preload="metadata"
          poster={heroPoster}
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src={heroLoop} type="video/mp4" />
          <source src={heroFallback} type="video/quicktime" />
          <source src={heroFallback} type="video/mp4" />
        </video>
      ) : null}
    </>
  );
}
