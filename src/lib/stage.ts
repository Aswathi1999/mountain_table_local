import type { CSSProperties } from "react";

/** [x, y, width?, height?] in the original's page coordinates. */
export type Box = readonly [x: number, y: number, w?: number, h?: number];
export type Origin = { d: number; m: number };

/** Left edge of the 980px column on the original's 1280px-wide desktop capture. */
const DESKTOP_STAGE_LEFT = 150;

const px = (n: number) => `${n}px`;
const rem = (n: number) => `${n / 16}rem`;

/**
 * Convert boxes measured on the original (desktop @1280 and mobile @320 design width) into the custom
 * properties read by the `.at` class. `origin` is the page-y of the containing block on each layout.
 */
export function pos(origin: Origin, d?: Box, m?: Box): CSSProperties {
  const s: Record<string, string> = {};
  if (d) {
    s["--dx"] = px(d[0] - DESKTOP_STAGE_LEFT);
    s["--dy"] = px(d[1] - origin.d);
    if (d[2] !== undefined) s["--dw"] = px(d[2]);
    if (d[3] !== undefined) s["--dh"] = px(d[3]);
  }
  if (m) {
    s["--mx"] = rem(m[0]);
    s["--my"] = rem(m[1] - origin.m);
    if (m[2] !== undefined) s["--mw"] = rem(m[2]);
    if (m[3] !== undefined) s["--mh"] = rem(m[3]);
  }
  return s as CSSProperties;
}

/** Height of a block on desktop (px) and mobile (rem). */
export function blockHeight(d: number, m: number): CSSProperties {
  return { "--bh": px(d), "--bmh": rem(m) } as CSSProperties;
}

/** Position relative to a block's own stage (desktop px from the stage's left/top, mobile px from the block's left/top). */
export function posRel(d?: Box, m?: Box): CSSProperties {
  return pos({ d: 0, m: 0 }, d ? [d[0] + DESKTOP_STAGE_LEFT, d[1], d[2], d[3]] : undefined, m);
}

/** Merge style fragments. */
export const merge = (...parts: (CSSProperties | undefined)[]): CSSProperties => Object.assign({}, ...parts);
