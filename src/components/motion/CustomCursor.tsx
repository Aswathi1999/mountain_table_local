"use client";

import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { HOME_FX } from "./home-fx.config";
import { useHomeFx } from "./useHomeFx";

type Mode = "idle" | "view" | "press";

/** Perceived brightness (0 to 255) of an `rgb()` / `rgba()` computed colour, or null when it is mostly transparent. */
function opaqueLuma(color: string): number | null {
  const m = color.match(/[\d.]+/g);
  if (!m || m.length < 3) return null;
  const alpha = m.length > 3 ? Number(m[3]) : 1;
  if (alpha < 0.5) return null;
  return 0.299 * Number(m[0]) + 0.587 * Number(m[1]) + 0.114 * Number(m[2]);
}

/**
 * Whether the pointer is over a dark surface. Looks down the stack of elements under the point: the first photograph or video
 * counts as dark (the cursor then turns white), otherwise the first element with a solid background decides by its brightness.
 */
function isDarkAt(x: number, y: number): boolean {
  for (const el of document.elementsFromPoint(x, y)) {
    // Surfaces painted with a gradient or image have no background colour to read: they opt in with `data-cursor-dark`.
    if (el.hasAttribute("data-cursor-dark")) return true;
    if (el instanceof HTMLVideoElement || el instanceof HTMLImageElement || el instanceof HTMLCanvasElement) return true;
    const luma = opaqueLuma(getComputedStyle(el).backgroundColor);
    if (luma !== null) return luma < 140;
  }
  return false;
}

/**
 * Desktop-only custom cursor for the home page: a small green dot that sticks to the pointer and a larger soft ring that follows
 * with a slight delay. Over a photograph marked `data-cursor="view"` the ring grows and says "View"; over buttons and links it
 * shrinks. It is off for touch, narrow windows and reduced motion (the normal cursor is then untouched), and it steps aside over
 * the film dialog. Settings: `HOME_FX.cursor`.
 */
export function CustomCursor() {
  const on = useHomeFx("cursor");
  const fine = typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches;
  const active = on && fine;
  const { dot, ring, ringGrown, ringShrunk, follow } = HOME_FX.cursor;
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 220 * follow * 5, damping: 24, mass: 0.6 });
  const ry = useSpring(y, { stiffness: 220 * follow * 5, damping: 24, mass: 0.6 });
  const [mode, setMode] = useState<Mode>("idle");
  const [visible, setVisible] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    if (!active) return;
    document.documentElement.classList.add("has-custom-cursor");
    let lastX = -1;
    let lastY = -1;
    let raf = 0;
    const classify = (el: Element | null) => {
      if (el?.closest("dialog")) return setVisible(false);
      setVisible(true);
      const overPhoto = !!el?.closest("[data-cursor=view]");
      const overControl = !!el?.closest("a, button, summary, [role=button], input, textarea, select, label");
      // A photograph that is itself a link keeps "View"; plain buttons and links shrink the ring.
      setMode(overPhoto ? "view" : overControl ? "press" : "idle");
    };
    // The surface check walks the element stack, so it runs at most once per frame.
    let toneRaf = 0;
    const tone = () => {
      if (toneRaf || lastX < 0) return;
      toneRaf = requestAnimationFrame(() => {
        toneRaf = 0;
        setDark(isDarkAt(lastX, lastY));
      });
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastX = e.clientX;
      lastY = e.clientY;
      x.set(lastX);
      y.set(lastY);
      classify(e.target as Element | null);
      tone();
    };
    // The page moves under a still pointer while scrolling: look again at what is under it.
    const onScroll = () => {
      if (raf || lastX < 0) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        classify(document.elementFromPoint(lastX, lastY));
      });
      tone();
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(toneRaf);
      document.documentElement.removeEventListener("pointerleave", leave);
      document.documentElement.classList.remove("has-custom-cursor");
    };
  }, [active, x, y]);

  if (!active) return null;
  const size = mode === "view" ? ringGrown : mode === "press" ? ringShrunk : ring;
  // Rendered on <body>, outside the page wrapper: that wrapper animates, which would otherwise trap the cursor beneath the fixed header.
  return createPortal(
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[300]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 0.3s" }}
    >
      <motion.div className="absolute top-0 left-0" style={{ x: rx, y: ry }}>
        <motion.div
          className="absolute flex items-center justify-center rounded-full border"
          style={{
            borderColor: dark ? "rgba(255,255,255,0.85)" : "rgba(11,43,31,0.55)",
            backgroundColor: mode === "view" ? "rgba(247,244,237,0.9)" : "rgba(247,244,237,0)",
            transition: "border-color 0.25s",
          }}
          animate={{ width: size, height: size, x: -size / 2, y: -size / 2 }}
          transition={{ duration: 0.45, ease: HOME_FX.ease }}
        >
          <span
            className="t-ui text-forest transition-opacity duration-300"
            style={{ opacity: mode === "view" ? 1 : 0, fontSize: "0.8125rem", letterSpacing: "0.08em" }}
          >
            View
          </span>
        </motion.div>
      </motion.div>
      <motion.div className="absolute top-0 left-0" style={{ x, y }}>
        <span
          className="absolute block rounded-full"
          style={{
            width: dot,
            height: dot,
            left: -dot / 2,
            top: -dot / 2,
            backgroundColor: dark ? "#fff" : HOME_FX.color.forest,
            opacity: mode === "view" ? 0 : 1,
            transition: "opacity 0.3s, background-color 0.25s",
          }}
        />
      </motion.div>
    </div>,
    document.body,
  );
}
