"use client";

import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useMotionValueEvent,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type HTMLMotionProps,
} from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, type CSSProperties, type ElementType, type ReactNode } from "react";

import { DUR, EASE, EASE_REVEAL, SCROLL_SPRING, SETTLE_SCALE, VIEW_ONCE } from "./tokens";

export { EASE, EASE_REVEAL };

const VIEW = VIEW_ONCE;

type RevealProps = {
  children: ReactNode;
  className?: string;
  /** Seconds before the entrance starts (use small steps, 0.08 to 0.2, to stagger siblings). */
  delay?: number;
  /** Rise distance in px. */
  y?: number;
  /** Slide in sideways instead (px, signed). */
  x?: number;
  as?: "div" | "p" | "li" | "span" | "section" | "header" | "address" | "blockquote" | "figure";
  style?: CSSProperties;
  /** Trigger on mount instead of on scroll (hero content). */
  immediate?: boolean;
};

/** Fades and rises once when scrolled into view. Used sparingly; images and headings have their own reveals. */
export function Reveal({ children, className, delay = 0, y = 18, x = 0, as = "div", style, immediate }: RevealProps) {
  const Tag = motion[as] as ElementType;
  const start = { opacity: 0, y, x };
  const end = { opacity: 1, y: 0, x: 0, transition: { duration: DUR.reveal, ease: EASE, delay } };
  return (
    <Tag
      data-motion=""
      className={className}
      style={style}
      initial={start}
      {...(immediate ? { animate: end } : { whileInView: end, viewport: VIEW })}
    >
      {children}
    </Tag>
  );
}

type LinesProps = {
  lines: readonly string[];
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "div";
  className?: string;
  /** Class for each line's text, by index (e.g. the italic cut for a line). Plain strings, so server components can pass it. */
  lineClasses?: readonly string[];
  delay?: number;
  /** Seconds between lines. */
  step?: number;
  immediate?: boolean;
  id?: string;
};

/**
 * Headline whose lines are set deliberately and rise out of a mask one after another. The heading stays one element, so
 * assistive tech reads it as one sentence.
 */
export function Lines({ lines, as = "h2", className, lineClasses, delay = 0, step = 0.09, immediate, id }: LinesProps) {
  const Tag = as as ElementType;
  // Observe the heading itself (never clipped), not the masked lines, so a line that wraps onto several rows still un-hides.
  const ref = useRef<HTMLElement>(null);
  const seen = useInView(ref, { once: true, margin: "0px 0px -8% 0px" });
  const show = immediate || seen;
  return (
    <Tag ref={ref} className={className} id={id}>
      {lines.map((line, i) => (
        <span key={i}>
          <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
            <motion.span
              data-motion=""
              className={`block ${lineClasses?.[i] ?? ""}`}
              initial={{ y: "108%" }}
              transition={{ duration: DUR.line, ease: EASE, delay: delay + i * step }}
              animate={{ y: show ? 0 : "108%" }}
            >
              {line}
            </motion.span>
          </span>
          {i < lines.length - 1 ? " " : null}
        </span>
      ))}
    </Tag>
  );
}

type FrameProps = {
  src: string;
  alt: string;
  sizes: string;
  /** Frame sizing: aspect ratio, height, width. */
  className?: string;
  /** Direction the photograph is uncovered from, or `fade` to fade and rise instead of a wipe. */
  from?: "bottom" | "top" | "left" | "right" | "center" | "fade";
  delay?: number;
  /** Scroll-linked drift inside the frame, as a percentage of the frame height (0 = still). */
  drift?: number;
  position?: string;
  priority?: boolean;
  /** Slow zoom on hover of an ancestor with the `group` class. */
  zoomOnHover?: boolean;
  /** Corner radius in px (the site's photographs have softly rounded corners). */
  radius?: number;
  /** Ties the drift straight to the scroll position (no spring), so the picture never wobbles or lags behind the page. */
  lock?: boolean;
  children?: ReactNode;
};

const INSETS = {
  bottom: "inset(0 0 100% 0)",
  top: "inset(100% 0 0 0)",
  left: "inset(0 100% 0 0)",
  right: "inset(0 0 0 100%)",
  center: "inset(50% 50% 50% 50%)",
} as const;

/**
 * Photograph in a frame: the frame is uncovered with a clip-path as it enters, the photograph settles from a slight zoom, and,
 * when `drift` is set, the photograph glides inside the frame as the page scrolls (it is oversized by the drift amount, so
 * edges never show). Scroll-linked values run on `transform` only.
 */
export function ImageFrame({
  src,
  alt,
  sizes,
  className = "",
  from = "bottom",
  delay = 0,
  drift = 0,
  position,
  priority,
  zoomOnHover,
  radius = 6,
  lock,
  children,
}: FrameProps) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rawDrift = useTransform(scrollYProgress, [0, 1], [-drift, drift]);
  const springDrift = useSpring(rawDrift, SCROLL_SPRING);
  const driftPct = lock ? rawDrift : springDrift;
  const y = useMotionTemplate`${driftPct}%`;
  const scale = 1 + (drift * 2) / 100;

  return (
    <motion.div
      ref={ref}
      data-motion=""
      className={`relative overflow-hidden ${className}`}
      style={{ borderRadius: radius }}
      initial={reduce ? false : from === "fade" ? { opacity: 0, y: 26 } : { clipPath: INSETS[from] }}
      whileInView={from === "fade" ? { opacity: 1, y: 0 } : { clipPath: "inset(0 0 0 0)" }}
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
      transition={{ duration: DUR.image, ease: EASE_REVEAL, delay }}
    >
      <motion.div
        data-motion=""
        className="absolute inset-0"
        initial={reduce ? false : { scale: SETTLE_SCALE }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: "0px 0px -10% 0px" }}
        transition={{ duration: DUR.settle, ease: EASE, delay }}
      >
        <div className={`absolute inset-0 ${zoomOnHover ? "img-zoom" : ""}`}>
          <motion.div
            className="absolute inset-0 will-change-transform"
            style={drift && !reduce ? { y, scale } : undefined}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
              style={position ? { objectPosition: position } : undefined}
            />
          </motion.div>
        </div>
      </motion.div>
      {children}
    </motion.div>
  );
}

/**
 * Full-bleed band whose photograph is a viewport-tall layer that slides with the page, as in the original homepage strips:
 * translateY = -k x clamp(sectionTop, -sectionHeight, viewportHeight). `km` is the factor below 750px.
 */
export function ParallaxBand({
  src,
  alt,
  sizes = "100vw",
  k = 0.8,
  km = 1,
  className = "",
  position,
  children,
}: {
  src: string;
  alt: string;
  sizes?: string;
  k?: number;
  km?: number;
  className?: string;
  position?: string;
  children?: ReactNode;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Starts at 0 on server and client (no hydration mismatch); the offset is written after mount and on every scroll/resize.
  const target = useMotionValue(0);
  const y = useSpring(target, { ...SCROLL_SPRING, stiffness: 170, damping: 30, restDelta: 0.5 });
  const settled = useRef(false);
  const update = useCallback(() => {
    const el = ref.current;
    if (reduce || !el) return target.set(0);
    const vh = window.innerHeight;
    const top = vh - scrollYProgress.get() * (vh + el.offsetHeight);
    const next = -(window.innerWidth < 750 ? km : k) * top;
    target.set(next);
    // The first measurement jumps straight to position, so the band never visibly slides in on load.
    if (!settled.current) {
      y.jump(next);
      settled.current = true;
    }
  }, [reduce, target, y, scrollYProgress, k, km]);
  useMotionValueEvent(scrollYProgress, "change", update);
  useEffect(() => {
    const id = requestAnimationFrame(update);
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", update);
    };
  }, [update]);

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      <motion.div className="absolute inset-x-0 top-0 h-[100vh] will-change-transform" style={{ y }}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          className="object-cover"
          style={position ? { objectPosition: position } : undefined}
        />
      </motion.div>
      {children}
    </div>
  );
}

/** A hairline that draws itself (left to right, or top to bottom) as it enters. */
export function Rule({
  className = "bg-gold",
  vertical,
  delay = 0,
  duration = 1.2,
}: {
  className?: string;
  vertical?: boolean;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.span
      data-motion=""
      aria-hidden="true"
      className={`block ${vertical ? "h-full w-px" : "h-px w-full"} ${className}`}
      style={{ transformOrigin: vertical ? "top" : "left" }}
      initial={vertical ? { scaleY: 0 } : { scaleX: 0 }}
      whileInView={vertical ? { scaleY: 1 } : { scaleX: 1 }}
      viewport={VIEW}
      transition={{ duration, ease: EASE, delay }}
    />
  );
}

/** Stagger wrapper for a group of `StaggerItem`s that enter together, one after another. */
export function Stagger({
  children,
  className,
  step = 0.1,
  ...rest
}: { children: ReactNode; className?: string; step?: number } & Omit<HTMLMotionProps<"div">, "children">) {
  return (
    <motion.div
      data-motion=""
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={VIEW}
      variants={{ hidden: {}, show: { transition: { staggerChildren: step } } }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Child of `Stagger`. */
export function StaggerItem({ children, className, y = 22 }: { children: ReactNode; className?: string; y?: number }) {
  return (
    <motion.div
      data-motion=""
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  );
}

/** A decorative piece that drifts into place slowly (fade plus a short slide), for arches, discs and sprigs behind photographs. */
export function Drift({
  children,
  className,
  x = 0,
  y = 20,
  delay = 0,
}: {
  children?: ReactNode;
  className?: string;
  x?: number;
  y?: number;
  delay?: number;
}) {
  return (
    <motion.div
      data-motion=""
      aria-hidden="true"
      className={className}
      initial={{ opacity: 0, x, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={VIEW}
      transition={{ duration: DUR.image + 0.4, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Wraps an icon badge: scales from 0.85 as its parent `Stagger` item arrives. */
export function ScaleIn({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      data-motion=""
      className={className}
      variants={{ hidden: { scale: 0.85 }, show: { scale: 1, transition: { duration: DUR.reveal, ease: EASE } } }}
    >
      {children}
    </motion.span>
  );
}

/** A line drawing of a leafy sprig whose strokes draw themselves (stem first, then the leaves) when it enters view. */
export function DrawnLeaf({ className = "" }: { className?: string }) {
  const leaves: [number, number, boolean][] = [
    [200, 1.05, false],
    [172, 1, true],
    [146, 0.95, false],
    [118, 0.85, true],
    [92, 0.75, false],
    [68, 0.62, true],
    [46, 0.5, false],
    [28, 0.4, true],
  ];
  return (
    <svg
      viewBox="0 0 120 230"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <motion.path
        d="M60 228 C56 170 66 110 58 8"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={VIEW}
        transition={{ duration: 1.6, ease: EASE }}
      />
      {leaves.map(([y, scale, flip], i) => (
        <motion.path
          key={y}
          d="M0 0 C-26 -6 -40 -26 -44 -50 C-14 -48 -2 -26 0 0Z"
          transform={`translate(60 ${y}) scale(${flip ? -scale : scale} ${scale})`}
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={VIEW}
          transition={{ duration: 1.1, ease: EASE, delay: 0.5 + i * 0.12 }}
        />
      ))}
    </svg>
  );
}
