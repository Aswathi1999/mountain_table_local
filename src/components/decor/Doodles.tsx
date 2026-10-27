import { Art, P, tone, type DecorProps } from "./_base";

/* Hand-drawn doodles, in a loose pen stroke to match the Caveat notes. Default colour: terracotta. Use one or two per section. */

const base = { color: tone.clay, opacity: 0.85, stroke: 1.6 } as const;

/** A curved arrow that loops in and points down-right (flip it to point the other way). */
export function CurvedArrow(props: DecorProps) {
  return (
    <Art viewBox="0 0 90 70" {...base} {...props}>
      <P d="M4 8C26 2 56 8 60 32C62 46 52 52 46 44C40 36 52 28 62 40C68 48 70 54 74 60" />
      <P d="M62 62L74 61L72 49" />
    </Art>
  );
}

/** A loose, slightly overshot circle for ringing a word. Size it to the word and place it behind. */
export function LooseCircle(props: DecorProps) {
  return (
    <Art viewBox="0 0 160 60" {...base} {...props}>
      <P d="M82 6C42 4 6 14 7 32C8 50 52 56 90 53C132 50 156 40 152 24C148 10 112 4 70 8" />
    </Art>
  );
}

/** A quick underline swoosh. */
export function Swoosh(props: DecorProps) {
  return (
    <Art viewBox="0 0 160 20" {...base} {...props}>
      <P d="M3 13C32 5 70 4 104 8C124 10 142 9 157 5" />
      <P d="M22 17C54 12 92 12 128 14" />
    </Art>
  );
}

/** A small heart. */
export function Heart(props: DecorProps) {
  return (
    <Art viewBox="0 0 40 36" {...base} {...props}>
      <P d="M20 33C8 24 3 17 4 10C5 4 11 2 15 5C18 7 19 9 20 11C21 9 23 6 26 5C31 3 36 7 36 12C36 19 29 26 20 33Z" />
    </Art>
  );
}

/** A four-point sparkle with two small companions. */
export function Sparkle(props: DecorProps) {
  return (
    <Art viewBox="0 0 50 50" {...base} {...props}>
      <P d="M22 4C23 16 27 20 40 22C27 24 23 28 22 40C21 28 17 24 4 22C17 20 21 16 22 4Z" />
      <P d="M40 6V14M36 10H44" />
      <P d="M38 34V40M35 37H41" />
    </Art>
  );
}

/** A dotted trail path, for linking things on a page (it is a dotted stroke, so it does not use the draw-in hook). */
export function DottedTrail({
  color = tone.clay,
  opacity = 0.7,
  size,
  className = "",
  vertical,
}: DecorProps & { vertical?: boolean }) {
  return (
    <svg
      viewBox={vertical ? "0 0 60 400" : "0 0 400 60"}
      aria-hidden="true"
      focusable="false"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeDasharray="0.5 8"
      className={`pointer-events-none block max-w-none select-none ${className}`}
      style={{ color, opacity, width: size, height: "auto" }}
    >
      <path
        d={
          vertical
            ? "M30 4C6 60 6 100 30 150C54 200 54 240 30 290C12 332 20 370 30 396"
            : "M4 30C60 6 100 6 150 30C200 54 240 54 290 30C332 12 370 20 396 30"
        }
      />
    </svg>
  );
}
