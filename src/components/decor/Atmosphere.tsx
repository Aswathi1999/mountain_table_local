import type { ReactNode } from "react";

/** Paper grain: a tiled feTurbulence noise at about 4% (a small repeating tile, so it costs nothing while scrolling). Light sections only. */
export function PaperGrain({ opacity = 0.045, className = "" }: { opacity?: number; className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`paper-grain pointer-events-none absolute inset-0 z-0 block ${className}`}
      style={{ opacity }}
    />
  );
}

/** A soft radial gold glow behind a heading on a dark section. Position it behind the heading with className. */
export function GoldGlow({ className = "", opacity = 1 }: { className?: string; opacity?: number }) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute block rounded-full ${className}`}
      style={{ background: "radial-gradient(closest-side, rgba(217,192,138,0.14), rgba(217,192,138,0))", opacity }}
    />
  );
}

/** A faint oversized italic word behind a section heading (hidden below 768px). */
export function Watermark({
  children,
  color = "var(--color-forest)",
  opacity = 0.05,
  className = "",
}: {
  children: ReactNode;
  color?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`decor-lg pointer-events-none absolute block font-display leading-none whitespace-nowrap italic select-none ${className}`}
      style={{ color, opacity, fontSize: "clamp(7rem, 17vw, 17rem)" }}
    >
      {children}
    </span>
  );
}

/** Clips decoration that bleeds off the edge of a relatively positioned section, without changing the section itself. */
export function Bleed({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/** Film-strip sprocket holes along the top and bottom edges of a relatively positioned dark section. */
export function FilmEdge({ className = "" }: { className?: string }) {
  const strip = {
    height: 14,
    backgroundImage: "repeating-linear-gradient(90deg, rgba(246,242,234,0.22) 0 14px, transparent 14px 30px)",
    maskImage: "linear-gradient(to bottom, transparent, #000 0 100%)",
  } as const;
  return (
    <>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 top-3 z-0 block ${className}`}
        style={{ ...strip, backgroundSize: "30px 8px", backgroundRepeat: "repeat-x", backgroundPosition: "6px 3px" }}
      />
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-x-0 bottom-3 z-0 block ${className}`}
        style={{ ...strip, backgroundSize: "30px 8px", backgroundRepeat: "repeat-x", backgroundPosition: "6px 3px" }}
      />
    </>
  );
}
