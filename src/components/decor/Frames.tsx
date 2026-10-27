import type { ReactNode } from "react";

/**
 * Image shapes are CSS classes (globals.css), so they can be added to an existing image wrapper without changing the DOM:
 *   .frame-arch  rounded top, flat bottom      .frame-pill  soft pill corners
 * Mix at most two frame styles on one page.
 */

/** A thin cream border inset inside an image (put it inside the image's relatively positioned wrapper, after the image). */
export function InnerBorder({
  inset = 10,
  radius,
  opacity = 0.5,
  className = "",
}: {
  inset?: number;
  radius?: string;
  opacity?: number;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`pointer-events-none absolute z-10 block border border-ivory ${className}`}
      style={{ inset, opacity, borderRadius: radius }}
    />
  );
}

/** A polaroid / postcard frame: cream border, thicker at the bottom for a handwritten caption. */
export function Polaroid({
  children,
  caption,
  rotate = 0,
  className = "",
}: {
  children: ReactNode;
  caption?: string;
  rotate?: number;
  className?: string;
}) {
  return (
    <figure
      className={`relative m-0 border border-[#e6dcc6] bg-[#fffdf8] p-2.5 pb-10 shadow-[0_10px_26px_-14px_rgba(20,42,33,0.45)] ${className}`}
      style={{ rotate: rotate ? `${rotate}deg` : undefined }}
    >
      <div className="relative overflow-hidden">{children}</div>
      {caption ? (
        <figcaption className="t-script text-forest/80 absolute inset-x-3 bottom-2 text-center text-[1.15rem]">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
