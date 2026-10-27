import type { ReactNode } from "react";
import { tone } from "./_base";

/** A thin gold hairline frame offset behind an image. Put it inside the image's relatively positioned wrapper, before the image. */
export function GoldFrame({
  offset = 14,
  color = tone.gold,
  opacity = 0.6,
  radius,
  className = "",
  style,
}: {
  /** Pixels the frame is pushed right and down (negative values push left and up). */
  offset?: number;
  color?: string;
  opacity?: number;
  radius?: string;
  className?: string;
  /** Overrides, e.g. { inset: "0 auto auto 0" } with a width class to frame only part of the parent. */
  style?: React.CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-0 block border ${className}`}
      style={{ borderColor: color, opacity, translate: `${offset}px ${offset}px`, borderRadius: radius, ...style }}
    />
  );
}

/** Viewfinder-style corner brackets in the four corners of a relatively positioned parent. */
export function CornerBrackets({
  size = 22,
  inset = 12,
  color = tone.gold,
  opacity = 0.85,
  className = "",
}: {
  size?: number;
  inset?: number;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  const corner = (v: "top" | "bottom", h: "left" | "right") => (
    <span
      key={v + h}
      className="absolute block"
      style={{
        [v]: inset,
        [h]: inset,
        width: size,
        height: size,
        [`border${v === "top" ? "Top" : "Bottom"}`]: `1px solid ${color}`,
        [`border${h === "left" ? "Left" : "Right"}`]: `1px solid ${color}`,
      }}
    />
  );
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 z-10 block ${className}`}
      style={{ opacity }}
    >
      {corner("top", "left")}
      {corner("top", "right")}
      {corner("bottom", "left")}
      {corner("bottom", "right")}
    </span>
  );
}

/** A small gold diamond, for separators between inline items. */
export function Diamond({
  size = 7,
  color = tone.gold,
  className = "",
}: {
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 12 12"
      width={size}
      height={size}
      aria-hidden="true"
      focusable="false"
      className={`inline-block shrink-0 ${className}`}
      style={{ color }}
    >
      <path d="M6 0l6 6-6 6-6-6z" fill="currentColor" />
    </svg>
  );
}

/** A list whose markers are small gold diamonds. Pass `<li>` children. */
export function DiamondList({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <ul className={`decor-diamonds m-0 list-none p-0 ${className}`}>{children}</ul>;
}

/** Gold-foil text for very small accents only (numbers, short marks). Never use it on large headings. */
export function Foil({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`gold-foil ${className}`}>{children}</span>;
}
