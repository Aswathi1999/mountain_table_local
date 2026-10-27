import type { CSSProperties } from "react";

/** A line-drawn sprig of leaves (decorative, hidden from assistive tech). Colour comes from `currentColor`. */
export function LeafSprig({ className = "", style }: { className?: string; style?: CSSProperties }) {
  const leaf = (y: number, s: number, flip: boolean) => (
    <path
      key={`${y}${flip}`}
      d="M0 0 C-26 -6 -40 -26 -44 -50 C-14 -48 -2 -26 0 0Z"
      transform={`translate(60 ${y}) scale(${flip ? -s : s} ${s})`}
    />
  );
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
      style={style}
    >
      <path d="M60 228 C56 170 66 110 58 8" />
      {leaf(200, 1.05, false)}
      {leaf(172, 1, true)}
      {leaf(146, 0.95, false)}
      {leaf(118, 0.85, true)}
      {leaf(92, 0.75, false)}
      {leaf(68, 0.62, true)}
      {leaf(46, 0.5, false)}
      {leaf(28, 0.4, true)}
    </svg>
  );
}

/** A soft belly of colour along the bottom edge of a full-bleed section, so it flows into the next section with a gentle curve. */
export function CurveEdge({ className = "text-ivory" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 -bottom-px z-10 block h-[clamp(34px,5.4vw,86px)] w-full ${className}`}
    >
      <path d="M0 0 Q720 90 1440 0 V92 H0Z" fill="currentColor" />
    </svg>
  );
}

/** The same curve turned over, for the top edge of a section that follows a light one. */
export function CurveTop({ className = "text-ivory" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 1440 90"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 -top-px z-10 block h-[clamp(34px,5.4vw,86px)] w-full ${className}`}
    >
      <path d="M0 90 Q720 0 1440 90 V-2 H0Z" fill="currentColor" />
    </svg>
  );
}

/** A tall arch of tinted colour, used behind photographs to give a composition a soft backdrop. */
export function Arch({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`pointer-events-none absolute block rounded-t-full ${className}`} />;
}

/** A tall translucent arch of warm sand with a gold twig laid over it (the soft backdrop on the edge of a photograph). */
export function GoldArch({ className = "" }: { className?: string }) {
  const berries: [number, number][] = [
    [34, 40],
    [58, 62],
    [30, 86],
    [64, 104],
    [38, 126],
    [60, 148],
    [32, 170],
    [62, 190],
    [40, 212],
    [58, 232],
  ];
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute block overflow-hidden rounded-t-full ${className}`}
    >
      <span className="bg-gold-soft/30 absolute inset-0 block" />
      <svg
        viewBox="0 0 100 260"
        preserveAspectRatio="xMidYMid slice"
        className="text-gold absolute inset-0 size-full"
        fill="none"
      >
        <path d="M48 258 C44 190 54 120 46 14" stroke="currentColor" strokeWidth="1" opacity="0.7" />
        {berries.map(([x, y]) => (
          <g key={`${x}${y}`} opacity="0.85">
            <path d={`M48 ${y + 8} Q${x} ${y + 4} ${x} ${y - 6}`} stroke="currentColor" strokeWidth="0.8" />
            <ellipse
              cx={x}
              cy={y - 8}
              rx="3.2"
              ry="5.5"
              fill="currentColor"
              transform={`rotate(${x < 48 ? -20 : 20} ${x} ${y - 8})`}
            />
          </g>
        ))}
      </svg>
    </span>
  );
}

/** A soft cream disc used behind photographs. */
export function Disc({ className = "" }: { className?: string }) {
  return <span aria-hidden="true" className={`pointer-events-none absolute block rounded-full ${className}`} />;
}
