import { CurveEdge, CurveTop } from "@/components/ui/decor";
import { Ridge, RidgeStack } from "./Ridges";

/** The existing hero curve, re-exported so every divider lives in one place. */
export { CurveEdge as WaveDivider, CurveTop as WaveDividerTop };

/** A ridge-line divider that sits on the bottom (or, with `top`, the top) edge of a relatively positioned section. */
export function RidgeDivider({
  color = "var(--color-ivory)",
  top,
  stack = true,
  height,
  className = "",
}: {
  /** The colour of the section the ridge leads into (it paints that section's tint into this one). */
  color?: string;
  top?: boolean;
  stack?: boolean;
  /** Any CSS length. */
  height?: string;
  className?: string;
}) {
  const pos = top ? "-top-px" : "-bottom-px";
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-x-0 ${pos} z-10 ${className}`}
      style={{ color, scale: top ? "1 -1" : undefined }}
    >
      {stack ? <RidgeStack color={color} height={height} /> : <Ridge color={color} height={height} />}
    </div>
  );
}

const glyphs = {
  diamond: <path d="M6 1l5 5-5 5-5-5z" fill="currentColor" stroke="none" />,
  mountain: (
    <path
      d="M1 10.5l4-6.5 2.4 3.6 1.4-2L11 10.5z"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinejoin="round"
    />
  ),
  leaf: (
    <path
      d="M2 10C2 5 5 2 10 2c0 5-3 8-8 8zM2 10l5-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
    />
  ),
};

/** A thin gold rule: two fading hairlines around a small centred diamond, mountain or leaf. */
export function OrnamentRule({
  glyph = "diamond",
  color = "var(--color-gold)",
  className = "",
  width = "min(22rem, 70%)",
  align = "center",
}: {
  glyph?: keyof typeof glyphs;
  color?: string;
  className?: string;
  width?: string;
  align?: "center" | "left";
}) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none flex items-center gap-3 ${align === "center" ? "mx-auto" : ""} ${className}`}
      style={{ color, width }}
    >
      <span className="h-px flex-1" style={{ background: "linear-gradient(to right, transparent, currentColor)" }} />
      <svg viewBox="0 0 12 12" className="size-3 shrink-0">
        {glyphs[glyph]}
      </svg>
      <span className="h-px flex-1" style={{ background: "linear-gradient(to left, transparent, currentColor)" }} />
    </div>
  );
}
