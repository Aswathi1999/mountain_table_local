import Link from "next/link";
import type { MouseEventHandler } from "react";

type Props = {
  href: string;
  /** `default` is the standard booking button; `compact` is the same button at the header's height. */
  size?: "default" | "compact";
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
  children?: string;
};

/** The arrow used inside buttons; it slides a few pixels on hover (see `.btn svg`). */
export function ArrowIcon({ className = "size-[1.125rem]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}

/** The site's single booking button: a forest-green pill (ivory on dark sections) with an arrow and a gold fill that rises on hover. */
export function BookNowButton({ href, size = "default", onClick, className = "", children = "Book Your Stay" }: Props) {
  return (
    <Link href={href} onClick={onClick} className={`btn btn-gold ${size === "compact" ? "btn-sm" : ""} ${className}`}>
      {children}
      <ArrowIcon />
    </Link>
  );
}
