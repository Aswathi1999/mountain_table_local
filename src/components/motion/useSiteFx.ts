"use client";

import { SITE_FX } from "./home-fx.config";
import { useAllowMotion } from "./useAllowMotion";

/** Whether a site-wide effect (`SITE_FX`) should run now: switched on, not reduced motion, window wide enough. */
export function useSiteFx(key: keyof typeof SITE_FX): boolean {
  const cfg = SITE_FX[key] as { enabled: boolean; minWidth?: number };
  const allowed = useAllowMotion(cfg.minWidth ?? 0);
  return cfg.enabled && allowed;
}
