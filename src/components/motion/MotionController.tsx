"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Drives the original site's two motion systems from one scroll listener, so pages stay Server Components:
 *  - `[data-reveal]`   one-shot entrance (adds `.is-in` once ~10% of the element's *layout* box is inside the viewport)
 *  - `[data-parallax]` image layer inside its section: translateY = -k * clamp(sectionTop, -sectionHeight, viewportHeight)
 *  - `[data-drift]` / `[data-drift-x]` oversized image layers that lag the scroll (vertical) or slide sideways (Discover rail)
 * The CSS for the entrance effects lives in globals.css.
 */
export function MotionController() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let pending = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)"));
    const layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
    const drifts = Array.from(document.querySelectorAll<HTMLElement>("[data-drift]"));
    const driftsX = Array.from(document.querySelectorAll<HTMLElement>("[data-drift-x]"));
    let raf = 0;

    /** Viewport-relative top of an element's layout box, ignoring its own transform (so slides/scales don't move the trigger). */
    const layoutTop = (el: HTMLElement) => {
      const parent = el.offsetParent as HTMLElement | null;
      if (!parent || getComputedStyle(el).position === "fixed") return el.getBoundingClientRect().top;
      return parent.getBoundingClientRect().top + parent.clientTop + el.offsetTop;
    };

    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      if (pending.length) {
        pending = pending.filter((el) => {
          const visible = vh - layoutTop(el);
          if (visible >= Math.max(1, el.offsetHeight * 0.1)) {
            el.classList.add("is-in");
            return false;
          }
          return true;
        });
      }
      if (!reduce) {
        const mobile = window.innerWidth < 750;
        for (const el of layers) {
          const section = el.parentElement;
          if (!section) continue;
          const rect = section.getBoundingClientRect();
          const k = Number((mobile && el.dataset.parallaxM) || el.dataset.parallax) || 0;
          const top = Math.min(Math.max(rect.top, -rect.height), vh);
          el.style.transform = `translate3d(0, ${-k * top}px, 0)`;
        }
        // Gentle drift: an oversized image lags the scroll by a small fraction, clamped to its spare margin.
        for (const el of drifts) {
          const box = el.parentElement;
          if (!box) continue;
          const rect = box.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > vh + 200) continue;
          const f = Number(el.dataset.drift) || 0;
          const spare = rect.height * 0.1;
          const offset = rect.top + rect.height / 2 - vh / 2;
          el.style.transform = `translate3d(0, ${Math.max(-spare, Math.min(spare, -offset * f))}px, 0)`;
        }
        // Sideways drift: an image layer wider than its frame (data-drift-x is the amplitude as a multiple of 10% of the frame width) slides within it as the frame crosses the viewport
        // (direction set by the sign of data-drift-x, so neighbouring photos move against each other).
        for (const el of driftsX) {
          const box = el.parentElement;
          if (!box) continue;
          const rect = box.getBoundingClientRect();
          if (rect.bottom < -200 || rect.top > vh + 200) continue;
          const dir = Number(el.dataset.driftX) || 0;
          const p = Math.max(-1, Math.min(1, (rect.top + rect.height / 2 - vh / 2) / (vh / 2 + rect.height / 2)));
          el.style.transform = `translate3d(${(-p * dir * rect.width * 0.1).toFixed(1)}px, 0, 0)`;
        }
      }
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    // Images/fonts settling can change layout after first paint.
    window.addEventListener("load", schedule);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      window.removeEventListener("load", schedule);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [pathname]);

  return null;
}
