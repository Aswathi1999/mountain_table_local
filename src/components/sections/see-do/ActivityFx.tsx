"use client";

import { animate, motion, useInView, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, type ReactNode } from "react";
import { EASE } from "@/components/motion/tokens";
import { useAllowMotion, useNearViewport } from "@/components/motion/useAllowMotion";
import { SEEDO_FX } from "./seedo.config";

const VIEW = { once: true, amount: 0.3 } as const;

/* ------------------------------------------------------------------ shared: lantern glow on image hover */

/**
 * Wraps a photograph: on a fine pointer the picture sits slightly dimmed and a warm lantern of light follows the cursor, lighting
 * what it passes over; the picture also zooms very slowly inside its frame. Plain (just the zoom) on touch and small screens.
 */
export function LanternImage({
  children,
  overlay,
  className = "",
}: {
  children: ReactNode;
  /** Decorative effect layers drawn over the picture (dust, a paraglider, embers). */
  overlay?: ReactNode;
  className?: string;
}) {
  const on = useAllowMotion(SEEDO_FX.minWidth);
  const ref = useRef<HTMLDivElement>(null);
  const { radius, dim } = SEEDO_FX.lantern;

  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--lx", `${e.clientX - r.left}px`);
    el.style.setProperty("--ly", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      data-lantern=""
      className={`group relative overflow-hidden ${className}`}
      onPointerMove={on ? move : undefined}
      style={{ ["--lx" as string]: "50%", ["--ly" as string]: "50%" }}
    >
      <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]">
        {children}
      </div>
      {overlay}
      {on ? (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-100 transition-opacity duration-700 group-hover:opacity-0 [@media(hover:none)]:hidden"
            style={{ background: `rgba(20,42,33,${dim})` }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100 [@media(hover:none)]:hidden"
            style={{
              background: `radial-gradient(circle ${radius}px at var(--lx) var(--ly), rgba(255,196,120,0.38), rgba(255,170,90,0.12) 55%, transparent 75%)`,
              mixBlendMode: "soft-light",
            }}
          />
        </>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ 01 jeep safari */

/** A faint trail of dust drifting from left to right across the bottom of the image, once. */
export function DustTrail() {
  const on = useAllowMotion();
  const { dustDuration, dustOpacity } = SEEDO_FX.jeep;
  if (!on) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] overflow-hidden">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="absolute block rounded-full will-change-transform"
          style={{
            bottom: `${6 + i * 11}%`,
            left: 0,
            width: `${34 - i * 6}%`,
            height: `${46 - i * 8}%`,
            background: "radial-gradient(ellipse, rgba(214,190,150,0.9), rgba(214,190,150,0) 70%)",
            filter: "blur(10px)",
          }}
          initial={{ x: "-60%", opacity: 0 }}
          whileInView={{ x: "340%", opacity: [0, dustOpacity, dustOpacity * 0.6, 0] }}
          viewport={VIEW}
          transition={{ duration: dustDuration + i * 0.9, ease: "easeOut", delay: 0.9 + i * 0.35 }}
        />
      ))}
    </div>
  );
}

/** Two tyre-track lines that draw themselves under the title. */
export function TyreTracks({ className = "" }: { className?: string }) {
  const on = useAllowMotion();
  if (!on) return null;
  const track = (y: number) =>
    `M0 ${y} C40 ${y - 6} 70 ${y + 6} 110 ${y} S180 ${y - 6} 220 ${y} S290 ${y + 6} 330 ${y}`;
  return (
    <svg
      viewBox="0 0 330 26"
      aria-hidden="true"
      className={`h-6 w-[16rem] ${className}`}
      fill="none"
      stroke="currentColor"
    >
      {[8, 18].map((y, i) => (
        <motion.path
          key={y}
          d={track(y)}
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="1 7"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={VIEW}
          transition={{ duration: SEEDO_FX.jeep.trackDraw, ease: EASE, delay: 0.5 + i * 0.15 }}
        />
      ))}
    </svg>
  );
}

/* ------------------------------------------------------------------ 02 paragliding */

/** A tiny paraglider that glides once along a curved dotted path across the image. */
export function ParagliderPath() {
  const on = useAllowMotion();
  const ref = useRef<SVGSVGElement>(null);
  const path = useRef<SVGPathElement>(null);
  const glider = useRef<SVGGElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.35 });

  useEffect(() => {
    if (!on || !seen || !path.current || !glider.current) return;
    const p = path.current;
    const g = glider.current;
    const len = p.getTotalLength();
    const c = animate(0, 1, {
      duration: SEEDO_FX.paraglider.flight,
      ease: "easeInOut",
      delay: 0.8,
      onUpdate: (v) => {
        const pt = p.getPointAtLength(v * len);
        const ahead = p.getPointAtLength(Math.min(len, v * len + 2));
        const tilt = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
        g.setAttribute("transform", `translate(${pt.x} ${pt.y}) rotate(${tilt * 0.5})`);
        g.style.opacity = String(Math.min(1, v * 8, (1 - v) * 8));
      },
    });
    return () => c.stop();
  }, [on, seen]);

  if (!on) return null;
  return (
    <svg
      ref={ref}
      viewBox="0 0 100 60"
      preserveAspectRatio="none"
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 size-full overflow-hidden"
    >
      <motion.path
        ref={path}
        d="M-4 46 C14 18 34 52 52 28 S86 8 106 16"
        fill="none"
        stroke="rgba(246,242,234,0.7)"
        strokeWidth="0.5"
        strokeDasharray="0.6 2.2"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        initial={{ pathLength: 0 }}
        animate={seen ? { pathLength: 1 } : undefined}
        transition={{ duration: SEEDO_FX.paraglider.flight, ease: "easeInOut", delay: 0.8 }}
      />
      <g ref={glider} style={{ opacity: 0 }}>
        <g transform={`scale(${SEEDO_FX.paraglider.glider / 100}) translate(-14 -10)`} fill="rgba(246,242,234,0.95)">
          <path d="M0 8 C6 -4 22 -4 28 8 C21 5 7 5 0 8Z" />
          <path d="M4 7.2 L14 17 L24 7.2" fill="none" stroke="rgba(246,242,234,0.9)" strokeWidth="0.7" />
          <circle cx="14" cy="18" r="1.6" />
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------ 03 bicycling */

/** The activity number that rolls in like a wheel: it rotates as it slides into place. */
export function WheelNumber({ children, className = "" }: { children: ReactNode; className?: string }) {
  const on = useAllowMotion();
  return (
    <motion.span
      aria-hidden="true"
      className={`inline-block will-change-transform ${className}`}
      initial={on ? { x: -90, rotate: -360, opacity: 0 } : false}
      whileInView={{ x: 0, rotate: 0, opacity: 1 }}
      viewport={VIEW}
      transition={{ duration: SEEDO_FX.bicycle.roll, ease: EASE }}
    >
      {children}
    </motion.span>
  );
}

/** A thin dotted route line with small hills that draws itself under the title. */
export function RouteLine({ className = "" }: { className?: string }) {
  const on = useAllowMotion();
  if (!on) return null;
  return (
    <svg
      viewBox="0 0 330 34"
      aria-hidden="true"
      className={`h-8 w-[17rem] ${className}`}
      fill="none"
      stroke="currentColor"
    >
      <motion.path
        d="M0 28 C20 28 28 12 48 12 S76 26 96 26 S124 6 150 6 S184 24 206 24 S236 14 262 14 S300 26 330 26"
        strokeWidth="2"
        strokeLinecap="round"
        strokeDasharray="1 7"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={VIEW}
        transition={{ duration: SEEDO_FX.bicycle.routeDraw, ease: EASE, delay: 0.4 }}
      />
    </svg>
  );
}

/* ------------------------------------------------------------------ 04 hiking and 06 elephants: footprints */

const FOOT =
  "M0 0c-2 0-3 3-3 6s1 5 3 5 3-2 3-5-1-6-3-6zM-1.4 13.5c-1.1 0-1.7 1.3-1.7 2.6s.6 2.1 1.7 2.1 1.7-.9 1.7-2.1-.6-2.6-1.7-2.6z";

/** Footprints that appear one by one along a short winding path. */
export function Footprints({ className = "" }: { className?: string }) {
  const on = useAllowMotion();
  if (!on) return null;
  const n = SEEDO_FX.hiking.steps;
  return (
    <svg viewBox="0 0 120 220" aria-hidden="true" className={`h-52 w-28 ${className}`} fill="currentColor">
      {Array.from({ length: n }, (_, i) => {
        const t = i / (n - 1);
        const x = 20 + t * 70 + Math.sin(t * 7) * 12 + (i % 2 ? 9 : -9);
        const y = 200 - t * 180;
        const rot = 12 + Math.sin(t * 7) * 18 + (i % 2 ? 6 : -6);
        return (
          <motion.g
            key={i}
            transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${rot.toFixed(1)})`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.55 }}
            viewport={VIEW}
            transition={{ duration: 0.7, ease: EASE, delay: 0.3 + i * SEEDO_FX.hiking.stepGap }}
          >
            <path d={FOOT} />
          </motion.g>
        );
      })}
    </svg>
  );
}

/** Soft footprint marks scattered across a section, appearing in a slow stagger. */
export function FootprintScatter() {
  const on = useAllowMotion();
  if (!on) return null;
  const { prints, printGap, printOpacity } = SEEDO_FX.elephant;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden text-forest">
      {Array.from({ length: prints }, (_, i) => {
        const left = 4 + ((i * 37) % 92);
        const top = 8 + ((i * 53) % 80);
        return (
          <motion.svg
            key={i}
            viewBox="-8 -2 16 24"
            className="absolute size-9 desk:size-12"
            style={{ left: `${left}%`, top: `${top}%`, rotate: `${((i * 47) % 70) - 35}deg` }}
            fill="currentColor"
            initial={{ opacity: 0, scale: 0.7 }}
            whileInView={{ opacity: printOpacity, scale: 1 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 1.2, ease: EASE, delay: i * printGap }}
          >
            <path d={FOOT} />
          </motion.svg>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ 05 bbq and music */

/** Warm embers that rise from the bottom of the image (canvas; paused when off-screen or the tab is hidden). */
export function Embers() {
  const on = useAllowMotion();
  const wrap = useRef<HTMLDivElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const active = useNearViewport(wrap);

  useEffect(() => {
    const cv = canvas.current;
    const box = wrap.current;
    if (!on || !active || !cv || !box) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const fit = () => {
      cv.width = box.clientWidth * dpr;
      cv.height = box.clientHeight * dpr;
    };
    fit();
    const count = window.innerWidth < SEEDO_FX.minWidth ? Math.ceil(SEEDO_FX.bbq.embers / 2) : SEEDO_FX.bbq.embers;
    type P = { x: number; y: number; r: number; vy: number; vx: number; life: number; max: number; ph: number };
    const spawn = (initial: boolean): P => ({
      x: Math.random() * cv.width,
      y: cv.height * (initial ? 0.55 + Math.random() * 0.45 : 1.02),
      r: (1 + Math.random() * 1.8) * dpr,
      vy: (0.18 + Math.random() * 0.4) * dpr,
      vx: (Math.random() - 0.5) * 0.25 * dpr,
      life: initial ? Math.random() * 200 : 0,
      max: 220 + Math.random() * 200,
      ph: Math.random() * 6.28,
    });
    const ps = Array.from({ length: count }, () => spawn(true));
    let raf = 0;
    const tick = () => {
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (let i = 0; i < ps.length; i++) {
        const p = ps[i];
        p.life++;
        p.y -= p.vy;
        p.x += p.vx + Math.sin(p.life * 0.03 + p.ph) * 0.18 * dpr;
        const t = p.life / p.max;
        if (t >= 1) {
          ps[i] = spawn(false);
          continue;
        }
        const flicker = 0.7 + 0.3 * Math.sin(p.life * 0.25 + p.ph);
        const a = Math.sin(Math.PI * t) * flicker;
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 4);
        g.addColorStop(0, `rgba(255,190,110,${a})`);
        g.addColorStop(0.4, `rgba(255,140,60,${a * 0.45})`);
        g.addColorStop(1, "rgba(255,120,40,0)");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 4, 0, 6.2832);
        ctx.fill();
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    window.addEventListener("resize", fit);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", fit);
    };
  }, [on, active]);

  // The wrapper is always rendered so the viewport observer has something to watch; the canvas only exists when motion is allowed.
  return (
    <div ref={wrap} aria-hidden="true" className="pointer-events-none absolute inset-0">
      {on ? <canvas ref={canvas} className="size-full" /> : null}
    </div>
  );
}

/** A few faint music notes that float up and fade, in a slow loop (paused when off-screen). */
export function MusicNotes() {
  const on = useAllowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const active = useNearViewport(ref);
  const glyphs = ["♪", "♫", "♪", "♬"];
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {(on ? glyphs.slice(0, SEEDO_FX.bbq.notes) : []).map((g, i) => (
        <span
          key={i}
          className="music-note text-gold-soft absolute font-display text-[1.6rem]"
          style={{
            left: `${14 + i * 21}%`,
            bottom: "12%",
            animationDelay: `${i * 1.6}s`,
            animationDuration: `${7 + i}s`,
            animationPlayState: active ? "running" : "paused",
          }}
        >
          {g}
        </span>
      ))}
    </div>
  );
}

/** A wash of amber behind the section that fades in as it scrolls into view, so the green warms toward firelight. */
export function WarmWash() {
  const on = useAllowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center center"] });
  const opacity = useTransform(scrollYProgress, [0, 1], [0, SEEDO_FX.bbq.warmth]);
  if (!on) return null;
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0">
      <motion.div
        className="absolute inset-0"
        style={{ opacity, background: "radial-gradient(ellipse 70% 80% at 30% 70%, rgb(214,120,40), transparent 70%)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ 06 elephant watch */

/** The binoculars mask: the image is first seen through two circles that widen until the whole frame is open. */
export function BinocularMask({ children, className = "" }: { children: ReactNode; className?: string }) {
  const on = useAllowMotion();
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.3 });

  useEffect(() => {
    const el = ref.current;
    if (!on || !seen || !el) return;
    const reach = Math.hypot(el.clientWidth, el.clientHeight);
    const c = animate(0, reach * 0.8, {
      duration: SEEDO_FX.elephant.open,
      ease: EASE,
      delay: 0.15,
      onUpdate: (v) => el.style.setProperty("--r", `${v}px`),
      onComplete: () => el.style.setProperty("--r", "4000px"),
    });
    return () => c.stop();
  }, [on, seen]);

  const mask =
    "radial-gradient(circle at 50% 28%, #000 var(--r), transparent calc(var(--r) + 3px)), radial-gradient(circle at 50% 72%, #000 var(--r), transparent calc(var(--r) + 3px))";
  return (
    <div
      ref={ref}
      className={className}
      style={{
        ["--r" as string]: on ? "0px" : "4000px",
        WebkitMaskImage: mask,
        maskImage: mask,
      }}
    >
      {children}
    </div>
  );
}
