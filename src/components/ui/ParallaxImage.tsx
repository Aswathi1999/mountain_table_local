import Image from "next/image";
import type { ReactNode } from "react";

type LayerProps = {
  /** Parallax factor on desktop and mobile (the layer moves -k x the section's offset from the viewport). */
  k?: number;
  km?: number;
  className?: string;
  children: ReactNode;
};

/**
 * A viewport-tall layer inside an overflow-hidden box; MotionController slides it with scroll, reproducing the original's
 * background parallax (see ANIMATIONS.md). Fills the positioned parent.
 */
export function ParallaxLayer({ k = 0.8, km, className = "", children }: LayerProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      <div
        data-parallax={k}
        data-parallax-m={km ?? k}
        className="absolute inset-x-0 top-0 h-[100vh] will-change-transform"
      >
        {children}
      </div>
    </div>
  );
}

type ImageProps = {
  src: string;
  alt: string;
  sizes: string;
  k?: number;
  km?: number;
  priority?: boolean;
  className?: string;
  /** object-position of the viewport-tall image inside the box. */
  position?: string;
};

/** Parallax layer holding one cover image. */
export function ParallaxImage({ src, alt, sizes, k, km, priority, className, position }: ImageProps) {
  return (
    <ParallaxLayer k={k} km={km} className={className}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
        style={position ? { objectPosition: position } : undefined}
      />
    </ParallaxLayer>
  );
}
