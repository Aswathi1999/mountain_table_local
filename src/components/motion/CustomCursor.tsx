"use client";

import { createPortal } from "react-dom";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useState } from "react";
import { HOME_FX } from "./home-fx.config";
import { useHomeFx } from "./useHomeFx";

type Mode = "idle" | "view" | "press";

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
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      lastX = e.clientX;
      lastY = e.clientY;
      x.set(lastX);
      y.set(lastY);
      classify(e.target as Element | null);
    };
    // The page moves under a still pointer while scrolling: look again at what is under it.
    const onScroll = () => {
      if (raf || lastX < 0) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        classify(document.elementFromPoint(lastX, lastY));
      });
    };
    const leave = () => setVisible(false);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.documentElement.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
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
            borderColor: "rgba(11,43,31,0.55)",
            backgroundColor: mode === "view" ? "rgba(247,244,237,0.9)" : "rgba(247,244,237,0)",
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
            backgroundColor: HOME_FX.color.forest,
            opacity: mode === "view" ? 0 : 1,
            transition: "opacity 0.3s",
          }}
        />
      </motion.div>
    </div>,
    document.body,
  );
}
