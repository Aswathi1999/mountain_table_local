/**
 * Motion tokens: the only place durations, easings and springs are defined, so related interactions always agree.
 * (CSS counterparts live in globals.css: --ease-out, --dur-fast, --dur-base, --dur-slow.)
 */

/** Entrances and most movement: starts at speed, settles softly (ease-out-expo family). */
export const EASE = [0.22, 1, 0.36, 1] as const;
/** Clip-path and mask reveals: a gentle in-out so the edge accelerates and decelerates without a hard start. */
export const EASE_REVEAL = [0.65, 0, 0.2, 1] as const;
/** Exits and quick state changes. */
export const EASE_IN = [0.4, 0, 1, 1] as const;

/** Seconds. */
export const DUR = {
  /** Hover, press, focus, toggles. */
  micro: 0.3,
  /** Menus, small panels, carousel text. */
  ui: 0.6,
  /** Text entrances. */
  reveal: 0.9,
  /** Masked heading lines. */
  line: 1,
  /** Clip-path photo reveals and panels. */
  image: 1.2,
  /** The photograph settling inside its frame. */
  settle: 1.6,
} as const;

/** Starting zoom of a photograph that settles into its frame (kept small: movement, not a zoom effect). */
export const SETTLE_SCALE = 1.08;

/** Interactive elements that follow a pointer or a press (springs keep velocity when interrupted). */
export const SPRING = {
  soft: { type: "spring", stiffness: 170, damping: 26, mass: 0.9 },
  press: { type: "spring", stiffness: 420, damping: 30, mass: 0.6 },
} as const;

/** Smooths scroll-linked values so they glide instead of tracking every wheel tick. */
export const SCROLL_SPRING = { stiffness: 110, damping: 26, mass: 0.5, restDelta: 0.001 } as const;

/** Scroll reveals fire once, when about a fifth of the element is in view (they never replay on the way back up). */
export const VIEW_ONCE = { once: true, amount: 0.2 } as const;

/** Seconds between related items entering one after another. */
export const STAGGER = { tight: 0.08, base: 0.12, loose: 0.15 } as const;

/** Hero load sequence (seconds): the photograph settles, then eyebrow, headline lines, paragraph and button follow. */
export const HERO = {
  settleScale: 1.08,
  settle: 2.5,
  eyebrow: 0.25,
  lines: 0.45,
  linesStep: 0.12,
  body: 0.95,
  button: 1.15,
} as const;

/** Below this width the scroll-linked parallax is switched off (performance). */
export const PARALLAX_MIN_WIDTH = 768;
