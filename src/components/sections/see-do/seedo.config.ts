/**
 * See & Do: the tuning values for every activity's signature animation. Durations are seconds; counts are for wide screens and
 * are halved below 768px. Everything here is skipped for visitors who prefer reduced motion.
 */
export const SEEDO_FX = {
  /** Width below which cursor effects are off and particle counts are halved. */
  minWidth: 768,
  lantern: { radius: 150, dim: 0.34 },
  jeep: { dustDuration: 5.5, dustOpacity: 0.32, trackDraw: 1.6 },
  paraglider: { flight: 9, drift: 7, glider: 26 },
  bicycle: { roll: 1.3, routeDraw: 2 },
  hiking: { steps: 8, stepGap: 0.35 },
  bbq: { embers: 18, warmth: 0.2, notes: 4 },
  elephant: { open: 1.7, prints: 9, printGap: 0.28, printOpacity: 0.22 },
} as const;
