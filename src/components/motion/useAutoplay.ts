"use client";

import { useEffect, type RefObject } from "react";

/**
 * Makes a muted, looping background video start on phones. React does not write the `muted` attribute to the HTML, and iOS Safari and
 * Android Chrome only allow autoplay when the element is muted, so the property is set directly before play() is called. If the browser
 * still blocks it (Low Power Mode, Data Saver), playback is retried on canplay, when the tab becomes visible, and on the first touch/scroll.
 * Pass `enabled: false` (reduced motion) to leave the video on its poster.
 */
export function useAutoplay(ref: RefObject<HTMLVideoElement | null>, enabled = true) {
  useEffect(() => {
    const video = ref.current;
    if (!video || !enabled) return;
    video.muted = true;
    video.defaultMuted = true;
    video.setAttribute("muted", "");
    video.setAttribute("playsinline", "");
    const play = () => {
      if (document.hidden || !video.paused) return;
      void video.play().catch(() => undefined);
    };
    const events = ["touchstart", "touchend", "pointerdown", "pointerup", "scroll", "click"] as const;
    const once = () => {
      play();
      if (!video.paused) events.forEach((e) => window.removeEventListener(e, once));
    };
    play();
    video.addEventListener("loadeddata", play);
    video.addEventListener("canplay", play);
    document.addEventListener("visibilitychange", play);
    events.forEach((e) => window.addEventListener(e, once, { passive: true }));
    return () => {
      video.removeEventListener("loadeddata", play);
      video.removeEventListener("canplay", play);
      document.removeEventListener("visibilitychange", play);
      events.forEach((e) => window.removeEventListener(e, once));
    };
  }, [ref, enabled]);
}
