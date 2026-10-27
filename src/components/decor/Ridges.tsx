import { smooth, tone } from "./_base";

/* Three layered ridge silhouettes (far, mid, near), 1440 x 200, filled with currentColor so they can be stacked in tints of one colour. */

const ridge = (pts: [number, number][]) => `${smooth(pts)}V200H0Z`;

const PATHS = {
  far: ridge([
    [-40, 110],
    [120, 84],
    [250, 104],
    [380, 52],
    [520, 96],
    [650, 70],
    [780, 112],
    [910, 58],
    [1050, 100],
    [1180, 62],
    [1320, 96],
    [1480, 76],
  ]),
  mid: ridge([
    [-40, 140],
    [90, 112],
    [230, 138],
    [360, 96],
    [500, 134],
    [640, 104],
    [790, 146],
    [940, 108],
    [1080, 140],
    [1230, 106],
    [1360, 132],
    [1480, 116],
  ]),
  near: ridge([
    [-40, 168],
    [110, 148],
    [260, 170],
    [420, 142],
    [560, 172],
    [720, 150],
    [880, 176],
    [1030, 148],
    [1190, 172],
    [1330, 154],
    [1480, 166],
  ]),
};

export type RidgeLayer = keyof typeof PATHS;

/** One ridge layer, as a block-level band. Colour via `currentColor` (text-* class) or `color`. */
export function Ridge({
  layer = "mid",
  color,
  opacity = 1,
  height = "clamp(52px, 9vw, 130px)",
  className = "",
}: {
  layer?: RidgeLayer;
  color?: string;
  opacity?: number;
  /** Any CSS length. */
  height?: string;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none block w-full ${className}`}
      style={{ color, opacity, height }}
    >
      <path d={PATHS[layer]} fill="currentColor" />
    </svg>
  );
}

/** The three layers stacked in three tints of one colour (far lightest, near strongest). */
export function RidgeStack({
  color = tone.forest,
  height = "clamp(64px, 11vw, 160px)",
  className = "",
  flip,
}: {
  color?: string;
  height?: string;
  className?: string;
  flip?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 1440 200"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none block w-full ${className}`}
      style={{ color, height, scale: flip ? "1 -1" : undefined }}
    >
      <path d={PATHS.far} fill="currentColor" opacity="0.28" />
      <path d={PATHS.mid} fill="currentColor" opacity="0.55" />
      <path d={PATHS.near} fill="currentColor" />
    </svg>
  );
}
