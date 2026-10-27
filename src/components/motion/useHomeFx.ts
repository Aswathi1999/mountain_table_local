"use client";

import { ABOUT_FX, CONTACT_FX, HOME_FX, ROOMS_FX } from "./home-fx.config";
import { useAllowMotion } from "./useAllowMotion";

type Switchable =
  "heroIntro" | "hero" | "experience" | "discover" | "rooms" | "reviews" | "banner" | "header" | "cursor";

/**
 * Whether a home-page effect should run now: switched on in `home-fx.config.ts`, the visitor has not asked for reduced motion and
 * the window is wide enough. False on the server and the first client render, so the page always starts in its readable,
 * static state and effects only take over after hydration.
 */
export function useHomeFx(key: Switchable): boolean {
  const cfg = HOME_FX[key] as { enabled: boolean; minWidth?: number };
  const allowed = useAllowMotion(cfg.minWidth ?? 0);
  return cfg.enabled && allowed;
}

/** The same, for an About page effect (`ABOUT_FX`); `minHeight` is for pinned effects that need a tall enough window. */
export function useAboutFx(key: keyof typeof ABOUT_FX): boolean {
  const cfg = ABOUT_FX[key] as { enabled: boolean; minWidth?: number; minHeight?: number };
  const allowed = useAllowMotion(cfg.minWidth ?? 0, cfg.minHeight ?? 0);
  return cfg.enabled && allowed;
}

/** The same, for a Rooms & Booking page effect (`ROOMS_FX`). */
export function useRoomsFx(key: keyof typeof ROOMS_FX): boolean {
  const cfg = ROOMS_FX[key] as { enabled: boolean; minWidth?: number };
  const allowed = useAllowMotion(cfg.minWidth ?? 0);
  return cfg.enabled && allowed;
}

/** The same, for a Contact page effect (`CONTACT_FX`). */
export function useContactFx(key: keyof typeof CONTACT_FX): boolean {
  const cfg = CONTACT_FX[key] as { enabled: boolean; minWidth?: number };
  const allowed = useAllowMotion(cfg.minWidth ?? 0);
  return cfg.enabled && allowed;
}
