import type { CSSProperties, ReactNode } from "react";

/** Brand tokens as CSS values (they resolve to the theme variables in globals.css). */
export const tone = {
  gold: "var(--color-gold)",
  goldSoft: "var(--color-gold-soft)",
  goldInk: "var(--color-gold-ink)",
  sage: "var(--color-sage)",
  clay: "var(--color-clay)",
  ivory: "var(--color-ivory)",
  ivoryDeep: "var(--color-ivory-deep)",
  forest: "var(--color-forest)",
  forestDeep: "var(--color-forest-deep)",
} as const;

/** Props every decorative element accepts. Elements are aria-hidden and ignore the pointer. */
export type DecorProps = {
  /** Any CSS colour; defaults differ per element. Use `tone.*` for brand colours. */
  color?: string;
  /** Rendered width (number = px, or any CSS length such as "clamp(5rem, 12vw, 9rem)"). Height follows the artwork's ratio. */
  size?: number | string;
  /** Degrees. */
  rotate?: number;
  opacity?: number;
  /** Mirror horizontally. */
  flip?: boolean;
  /** Animation hook: the strokes draw in as the element scrolls into view (static where unsupported or with reduced motion). */
  draw?: boolean;
  /** Animation hook: a slow, gentle drift. */
  float?: boolean;
  /** Position it with Tailwind classes, e.g. "absolute -right-6 top-10 decor-lg". */
  className?: string;
  style?: CSSProperties;
};

type ArtProps = DecorProps & {
  viewBox: string;
  stroke?: number;
  children: ReactNode;
  fill?: string;
  rotateSlow?: boolean;
};

/** The one SVG wrapper behind every line-art element. */
export function Art({
  viewBox,
  children,
  color = tone.goldSoft,
  size,
  rotate,
  opacity = 0.7,
  flip,
  draw,
  float,
  rotateSlow,
  stroke = 0.9,
  fill = "none",
  className = "",
  style,
}: ArtProps) {
  return (
    <svg
      viewBox={viewBox}
      aria-hidden="true"
      focusable="false"
      fill={fill}
      stroke="currentColor"
      strokeWidth={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
      data-draw={draw ? "" : undefined}
      data-float={float ? "" : undefined}
      data-rotate={rotateSlow ? "" : undefined}
      className={`pointer-events-none block max-w-none select-none ${className}`}
      style={{
        color,
        width: size,
        height: "auto",
        opacity,
        rotate: rotate ? `${rotate}deg` : undefined,
        scale: flip ? "-1 1" : undefined,
        ...style,
      }}
    >
      {children}
    </svg>
  );
}

/** A path that can be drawn in (pathLength is normalised so one CSS rule animates every path). */
export function P(props: React.SVGProps<SVGPathElement>) {
  return <path pathLength={1} {...props} />;
}

export const r1 = (n: number) => Math.round(n * 10) / 10;

type Pt = readonly [number, number];

/** A smooth Catmull-Rom curve through the points, as an SVG path (open, or closed when `closed`). */
export function smooth(pts: readonly Pt[], closed = false) {
  const n = pts.length;
  const at = (i: number): Pt => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  let d = `M${r1(pts[0][0])} ${r1(pts[0][1])}`;
  const last = closed ? n : n - 1;
  for (let i = 0; i < last; i++) {
    const p0 = at(i - 1);
    const p1 = at(i);
    const p2 = at(i + 1);
    const p3 = at(i + 2);
    d += `C${r1(p1[0] + (p2[0] - p0[0]) / 6)} ${r1(p1[1] + (p2[1] - p0[1]) / 6)} ${r1(p2[0] - (p3[0] - p1[0]) / 6)} ${r1(p2[1] - (p3[1] - p1[1]) / 6)} ${r1(p2[0])} ${r1(p2[1])}`;
  }
  return closed ? `${d}Z` : d;
}

/** Point and tangent angle (degrees) on a cubic Bézier. */
export function bezier(p: readonly [Pt, Pt, Pt, Pt], t: number) {
  const u = 1 - t;
  const x = u ** 3 * p[0][0] + 3 * u * u * t * p[1][0] + 3 * u * t * t * p[2][0] + t ** 3 * p[3][0];
  const y = u ** 3 * p[0][1] + 3 * u * u * t * p[1][1] + 3 * u * t * t * p[2][1] + t ** 3 * p[3][1];
  const dx = 3 * u * u * (p[1][0] - p[0][0]) + 6 * u * t * (p[2][0] - p[1][0]) + 3 * t * t * (p[3][0] - p[2][0]);
  const dy = 3 * u * u * (p[1][1] - p[0][1]) + 6 * u * t * (p[2][1] - p[1][1]) + 3 * t * t * (p[3][1] - p[2][1]);
  return { x, y, angle: (Math.atan2(dy, dx) * 180) / Math.PI };
}
