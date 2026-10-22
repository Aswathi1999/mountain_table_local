import type { CSSProperties } from "react";

export type RevealEffect =
  "none" | "rise" | "mask" | "wipe" | "draw" | "fade" | "grow" | "slide-x" | "slide-y" | "turn" | "fly" | "fly-y";

type RevealProps = { "data-reveal": RevealEffect; "data-reveal-m"?: RevealEffect; style?: CSSProperties };

/**
 * Props that opt an element into the one-shot entrance animation (see MotionController + globals.css).
 * `mobile` overrides the effect below 750px, where the original sometimes animates differently.
 */
export function rv(effect: RevealEffect = "fade", mobile?: RevealEffect, style?: CSSProperties): RevealProps {
  const props: RevealProps = { "data-reveal": effect };
  if (mobile) props["data-reveal-m"] = mobile;
  if (style) props.style = style;
  return props;
}

/** Stagger offset for an entrance (read by the `[style*="--d"]` rule in globals.css). */
export const stagger = (seconds: number): CSSProperties => ({ "--d": `${seconds}s` }) as CSSProperties;
