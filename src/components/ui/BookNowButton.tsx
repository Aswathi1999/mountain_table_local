import Link from "next/link";
import type { MouseEventHandler } from "react";

type Props = {
  href: string;
  /** `default` is the homepage hero button; `compact` is the same button at the header's height. */
  size?: "default" | "compact";
  onClick?: MouseEventHandler<HTMLAnchorElement>;
  className?: string;
};

const base =
  "bg-gold text-forest-deep t-ui inline-flex shrink-0 items-center uppercase no-underline transition-colors duration-300 hover:bg-ivory";
const sizes = { default: "h-12 px-9", compact: "h-10 px-6" } as const;

/** The site's single "Book Now" button, reproduced from the homepage hero (gold, square-edged, ivory on hover). */
export function BookNowButton({ href, size = "default", onClick, className = "" }: Props) {
  return (
    <Link href={href} onClick={onClick} className={`${base} ${sizes[size]} ${className}`}>
      Book Now
    </Link>
  );
}
