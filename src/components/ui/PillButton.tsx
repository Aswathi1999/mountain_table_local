import Link from "next/link";
import type { CSSProperties } from "react";
import { rv } from "@/lib/reveal";

type Props = {
  href: string;
  children: string;
  /** Show the trailing chevron (the home page's "Explore" has one, "Book Now" does not). */
  arrow?: boolean;
  /** `forest` swaps the grey/red pill for a square forest-green button that turns gold on hover. */
  tone?: "default" | "forest";
  className?: string;
  /** Extra classes for the label (e.g. a different mobile size). */
  labelClassName?: string;
  style?: CSSProperties;
};

/** Grey pill that turns red on hover (0.2s), as on the original. */
export function PillButton({
  href,
  children,
  arrow,
  tone = "default",
  className = "",
  labelClassName = "",
  style,
}: Props) {
  return (
    <div className={`at ${className}`} style={style} {...rv("grow")}>
      <Link
        href={href}
        className={`${tone === "forest" ? "bg-forest transition-colors duration-500 hover:bg-gold-ink" : "pill-btn rounded-[50px]"} flex size-full items-center justify-center gap-[0.4375rem] desk:gap-2 text-[0.75rem] tracking-[3px] text-white no-underline desk:text-[15px] desk:tracking-[3.75px] ${labelClassName}`}
      >
        <span>{children}</span>
        {arrow ? (
          <svg viewBox="0 0 23 23" className="size-5 desk:size-[23px]" aria-hidden="true">
            <path d="M8 3.5 L16 11.5 L8 19.5" stroke="#fff" strokeWidth="1.3" fill="none" />
          </svg>
        ) : null}
      </Link>
    </div>
  );
}
