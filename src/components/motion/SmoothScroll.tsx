"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { SITE_FX } from "./home-fx.config";
import { useSiteFx } from "./useSiteFx";

/**
 * Weighted, inertial scrolling for mouse and trackpad (touch devices keep native scrolling). It pauses while a modal or the menu
 * locks the page (body overflow hidden), and a new page always starts at the top. Settings: `SITE_FX.smoothScroll`.
 */
export function SmoothScroll() {
  const on = useSiteFx("smoothScroll");
  const pathname = usePathname();
  const lenis = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!on || !window.matchMedia("(pointer: fine)").matches) return;
    const { duration, wheelMultiplier } = SITE_FX.smoothScroll;
    const instance = new Lenis({
      duration,
      wheelMultiplier,
      easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)),
      anchors: true,
    });
    lenis.current = instance;
    let raf = requestAnimationFrame(function tick(time) {
      instance.raf(time);
      raf = requestAnimationFrame(tick);
    });
    const sync = () => (document.body.style.overflow === "hidden" ? instance.stop() : instance.start());
    const mo = new MutationObserver(sync);
    mo.observe(document.body, { attributes: true, attributeFilter: ["style"] });
    return () => {
      mo.disconnect();
      cancelAnimationFrame(raf);
      instance.destroy();
      lenis.current = null;
    };
  }, [on]);

  useEffect(() => {
    lenis.current?.scrollTo(0, { immediate: true, force: true });
  }, [pathname]);

  return null;
}
