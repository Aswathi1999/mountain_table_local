"use client";

import { useEffect, useState, useSyncExternalStore, type RefObject } from "react";

const reduceQuery = "(prefers-reduced-motion: reduce)";

function subscribe(notify: () => void) {
  const mq = window.matchMedia(reduceQuery);
  mq.addEventListener("change", notify);
  window.addEventListener("resize", notify);
  return () => {
    mq.removeEventListener("change", notify);
    window.removeEventListener("resize", notify);
  };
}

/**
 * True when decorative motion may run: the visitor has not asked for reduced motion and the window is at least `minWidth` wide.
 * Always false on the server and on the first client render, so markup matches and the final, readable state is what is rendered.
 */
export function useAllowMotion(minWidth = 0): boolean {
  return useSyncExternalStore(
    subscribe,
    () => !window.matchMedia(reduceQuery).matches && window.innerWidth >= minWidth,
    () => false,
  );
}

/** True while the element is within `margin` of the viewport and the tab is visible: use it to start, and pause, loops and canvases. */
export function useNearViewport(ref: RefObject<Element | null>, margin = "160px"): boolean {
  const [near, setNear] = useState(false);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: margin });
    io.observe(el);
    const onVis = () => setVisible(!document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [ref, margin]);
  return near && visible;
}
