import { smooth, tone } from "./_base";

/* Hiking-map contour lines: nested, slightly irregular rings around two summits. Generated once, so the markup is deterministic. */

function rings(cx: number, cy: number, count: number, step: number, seed: number) {
  const out: string[] = [];
  for (let k = 1; k <= count; k++) {
    const base = 18 + k * step;
    const pts: [number, number][] = [];
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2;
      const wob =
        1 +
        0.16 * Math.sin(3 * a + seed + k * 0.15) +
        0.09 * Math.sin(5 * a + seed * 2) +
        0.05 * Math.sin(2 * a - k * 0.3);
      pts.push([cx + Math.cos(a) * base * wob * 1.25, cy + Math.sin(a) * base * wob * 0.8]);
    }
    out.push(smooth(pts, true));
  }
  return out;
}

const PATHS = [...rings(190, 170, 8, 24, 1.2), ...rings(480, 270, 7, 22, 3.4)];

/**
 * A contour-line texture that fills its (relatively positioned) parent. Quiet by design: sage at about 20%.
 * Keep it behind cards, summaries and empty states, never behind running text.
 */
export function Contour({
  color = tone.sage,
  opacity = 0.22,
  className = "",
}: {
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 600 400"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      className={`pointer-events-none absolute inset-0 size-full select-none ${className}`}
      style={{ color, opacity }}
    >
      {PATHS.map((d, i) => (
        <path key={i} d={d} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}
