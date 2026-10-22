import Image from "next/image";
import type { ReactNode } from "react";
import { rv, stagger } from "@/lib/reveal";

/** Small tracked label with a leading hairline, e.g. "01 — Our Story". */
export function Eyebrow({
  children,
  tone = "gold",
  delay = 0,
}: {
  children: ReactNode;
  tone?: "gold" | "light";
  delay?: number;
}) {
  return (
    <p
      className={`m-0 flex items-center gap-4 text-[0.75rem] tracking-[0.34em] uppercase desk:text-[12px] ${
        tone === "gold" ? "text-gold-ink" : "text-gold-soft"
      }`}
      {...rv("rise", "rise", stagger(delay))}
    >
      <span aria-hidden="true" className="block h-px w-10 bg-current" />
      {children}
    </p>
  );
}

/** Hairline that draws itself from the left when it enters the viewport. */
export function Rule({ className = "bg-gold", delay = 0 }: { className?: string; delay?: number }) {
  return (
    <span aria-hidden="true" className={`block h-px w-full ${className}`} {...rv("draw", "draw", stagger(delay))} />
  );
}

type RevealImageProps = {
  src: string;
  alt: string;
  sizes: string;
  /** Sizing of the frame (aspect ratio / height / width). */
  className?: string;
  /** Entrance: `mask` reveals downwards, `wipe` sideways. Both settle a zoomed image. */
  reveal?: "mask" | "wipe" | "wipel" | "wipeu" | "iris";
  delay?: number;
  /** Scroll drift factor (0.04 to 0.1). Omit for a still image. */
  drift?: number;
  priority?: boolean;
  /** object-position for the cover crop. */
  position?: string;
  /** Zoom the photo slowly when an ancestor with the `group` class is hovered. */
  zoomOnHover?: boolean;
};

/** Cover image in a frame with a clipped entrance, an optional gentle scroll drift and an optional hover zoom. */
export function RevealImage({
  src,
  alt,
  sizes,
  className = "",
  reveal = "mask",
  delay = 0,
  drift,
  priority,
  position,
  zoomOnHover,
}: RevealImageProps) {
  return (
    <div className={`relative overflow-hidden ${className}`} {...rv(reveal, reveal, stagger(delay))}>
      <div className="mask-img absolute inset-0">
        <div
          className={`absolute inset-0 ${zoomOnHover ? "transition-transform duration-[1600ms] ease-out group-hover:scale-[1.05] group-focus-visible:scale-[1.05]" : ""}`}
        >
          <div
            {...(drift ? { "data-drift": drift } : {})}
            className={drift ? "absolute inset-x-0 -top-[10%] h-[120%] will-change-transform" : "absolute inset-0"}
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes={sizes}
              priority={priority}
              className="object-cover"
              style={position ? { objectPosition: position } : undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
