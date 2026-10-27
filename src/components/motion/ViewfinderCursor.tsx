"use client";

import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { GALLERY_FX, HOME_FX } from "./home-fx.config";
import { useAllowMotion } from "./useAllowMotion";

type Mode = "idle" | "view" | "snap";

/**
 * Gallery cursor, desktop only: over anything marked `data-viewfinder` the pointer becomes a camera focus frame (four corner
 * brackets around a tiny centre dot). Over a photograph marked `data-cursor="view"` the brackets open wider and say "View"; on
 * press they snap inward for a moment, like a camera locking focus. Settings: `GALLERY_FX.cursor`. It is off for touch, narrow
 * windows and reduced motion, and the normal cursor is untouched elsewhere. Components that run an action after the press can
 * wait `GALLERY_FX.cursor.snapMs` when `document.documentElement` has the `has-viewfinder` class.
 */
export function ViewfinderCursor() {
  const cfg = GALLERY_FX.cursor;
  const allowed = useAllowMotion(cfg.minWidth);
  const fine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  const active = cfg.enabled && allowed && fine;
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 700, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 700, damping: 40, mass: 0.4 });
  const [mode, setMode] = useState<Mode>("idle");
  const [inZone, setInZone] = useState(false);

  useEffect(() => {
    if (!active) return;
    const root = document.documentElement;
    let lastX = -1;
    let lastY = -1;
    let raf = 0;
    let snapTimer = 0;
    const classify = (el: Element | null) => {
      const zone = !!el?.closest("[data-viewfinder]") && !el?.closest("dialog");
      setInZone(zone);
      root.classList.toggle("has-viewfinder", zone);
      setMode((m) => (m === "snap" ? m : el?.closest("[data-cursor=view]") ? "view" : "idle"));
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastX = e.clientX;
      lastY = e.clientY;
      x.set(lastX);
      y.set(lastY);
      classify(e.target as Element | null);
    };
    const onScroll = () => {
      if (raf || lastX < 0) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        classify(document.elementFromPoint(lastX, lastY));
      });
    };
    const down = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" || !(e.target as Element).closest("[data-viewfinder]")) return;
      setMode("snap");
      window.clearTimeout(snapTimer);
      snapTimer = window.setTimeout(() => classify(document.elementFromPoint(lastX, lastY)), cfg.snapMs + 120);
    };
    const leave = () => {
      setInZone(false);
      root.classList.remove("has-viewfinder");
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    root.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(snapTimer);
      cancelAnimationFrame(raf);
      root.removeEventListener("pointerleave", leave);
      root.classList.remove("has-viewfinder");
    };
  }, [active, x, y, cfg.snapMs]);

  if (!active) return null;
  const size = mode === "snap" ? cfg.frame * 0.55 : mode === "view" ? cfg.frameGrown : cfg.frame;
  const arm = 9;
  const corner = "absolute block border-[1.5px]";
  // Rendered on <body>, outside the page wrapper: that wrapper animates, which would otherwise trap the cursor beneath the fixed header.
  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[300]"
      style={{ opacity: inZone ? 1 : 0, transition: "opacity 0.25s" }}
    >
      <motion.div className="absolute top-0 left-0" style={{ x: sx, y: sy }}>
        <motion.div
          className="absolute flex items-center justify-center"
          style={{ color: mode === "view" ? "#F7F4ED" : HOME_FX.color.gold }}
          animate={{ width: size, height: size, x: -size / 2, y: -size / 2 }}
          transition={{ duration: mode === "snap" ? 0.12 : 0.45, ease: HOME_FX.ease }}
        >
          {(
            [
              ["top-0 left-0 border-t border-l", "tl"],
              ["top-0 right-0 border-t border-r", "tr"],
              ["bottom-0 left-0 border-b border-l", "bl"],
              ["bottom-0 right-0 border-b border-r", "br"],
            ] as const
          ).map(([cls, k]) => (
            <span
              key={k}
              className={`${corner} ${cls}`}
              style={{ width: arm, height: arm, borderColor: "currentColor" }}
            />
          ))}
          <span
            className="t-ui transition-opacity duration-300"
            style={{ opacity: mode === "view" ? 1 : 0, fontSize: "0.75rem", letterSpacing: "0.1em" }}
          >
            View
          </span>
        </motion.div>
        <span
          className="absolute block size-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{
            backgroundColor: mode === "view" ? "#F7F4ED" : HOME_FX.color.gold,
            opacity: mode === "view" ? 0 : 1,
          }}
        />
      </motion.div>
    </div>,
    document.body,
  );
}
