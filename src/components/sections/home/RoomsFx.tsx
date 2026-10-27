"use client";

import { motion, useInView, useMotionValue, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { DUR, EASE } from "@/components/motion/tokens";
import { useHomeFx } from "@/components/motion/useHomeFx";

/**
 * A room card that is dealt onto the table (it flips up from a slight 3D angle, staggered by `index`) and, on a fine pointer,
 * tilts toward the cursor (at most `tiltMax` degrees) while a soft shine follows the pointer across it. The whole card is a link.
 * Phones and reduced motion get a plain fade-up. Settings: `HOME_FX.rooms`.
 */
export function RoomCard({ index, href, children }: { index: number; href: string; children: ReactNode }) {
  const on = useHomeFx("rooms");
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.2 });
  const { rotateFrom, perspective, tiltMax } = HOME_FX.rooms;

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 160, damping: 20, mass: 0.5 });
  const sy = useSpring(py, { stiffness: 160, damping: 20, mass: 0.5 });
  const rotateY = useTransform(sx, [-0.5, 0.5], [-tiltMax, tiltMax]);
  const rotateX = useTransform(sy, [-0.5, 0.5], [tiltMax, -tiltMax]);
  const shine = useTransform(
    () =>
      `radial-gradient(circle at ${(sx.get() + 0.5) * 100}% ${(sy.get() + 0.5) * 100}%, rgba(255,255,255,0.32), rgba(255,255,255,0) 55%)`,
  );
  const shineOpacity = useMotionValue(0);

  const move = (e: React.PointerEvent) => {
    if (!on || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
    shineOpacity.set(1);
  };
  const leave = () => {
    px.set(0);
    py.set(0);
    shineOpacity.set(0);
  };

  return (
    <div ref={ref} style={{ perspective: on ? perspective : undefined }}>
      <motion.div
        data-motion=""
        initial={false}
        animate={{
          opacity: seen ? 1 : 0,
          y: seen ? 0 : 44,
          rotateX: seen ? 0 : on ? rotateFrom : 0,
        }}
        transition={{ duration: DUR.image, ease: EASE, delay: index * 0.14 }}
        style={{ transformOrigin: "50% 100%" }}
      >
        <Link
          href={href}
          onPointerMove={move}
          onPointerLeave={leave}
          data-cursor="view"
          className="group border-forest/10 hover:border-forest/25 block rounded-[10px] border bg-white no-underline shadow-[0_14px_36px_rgba(31,59,47,0.07)] transition-[border-color,box-shadow] duration-500 hover:shadow-[0_24px_50px_rgba(31,59,47,0.13)]"
        >
          <motion.div
            className="relative overflow-hidden rounded-[10px] will-change-transform"
            style={on ? { rotateX, rotateY, transformPerspective: 900 } : undefined}
          >
            {children}
            {on ? (
              <motion.span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                style={{ background: shine, opacity: shineOpacity, mixBlendMode: "soft-light" }}
              />
            ) : null}
          </motion.div>
        </Link>
      </motion.div>
    </div>
  );
}

/**
 * Wraps a button so it drifts a little toward the cursor while the pointer is within `magnetRadius` pixels of it, and springs back
 * softly when the pointer leaves. Fine pointers on wide screens only. Settings: `HOME_FX.rooms`.
 */
export function Magnetic({ children, className = "" }: { children: ReactNode; className?: string }) {
  const on = useHomeFx("rooms");
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 170, damping: 16, mass: 0.6 });
  const y = useSpring(my, { stiffness: 170, damping: 16, mass: 0.6 });
  const { magnetRadius, magnetStrength } = HOME_FX.rooms;

  const leave = () => {
    mx.set(0);
    my.set(0);
  };
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!on || !el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const dx = e.clientX - (r.left + r.width / 2);
    const dy = e.clientY - (r.top + r.height / 2);
    if (Math.hypot(dx, dy) > magnetRadius + Math.max(r.width, r.height) / 2) return leave();
    mx.set(dx * magnetStrength);
    my.set(dy * magnetStrength);
  };

  return (
    // The padding gives the magnet a catching area a little larger than the button.
    <div ref={ref} className={`-m-6 p-6 ${className}`} onPointerMove={move} onPointerLeave={leave}>
      <motion.div style={{ x, y }}>{children}</motion.div>
    </div>
  );
}
