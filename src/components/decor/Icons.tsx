import type { SVGProps } from "react";

/* One thin-line icon set: 24px grid, 1.4px stroke, round caps and joins, drawn in currentColor. */

const paths = {
  rooms: "M3 19V6M3 15h18v4M21 19v-5a3 3 0 0 0-3-3h-7v4M7.5 12.2a1.4 1.4 0 1 0 0-.01",
  dining: "M7 3v8M5 3v5a2 2 0 0 0 4 0V3M7 11v10M17 21V3c-2 1.5-3 4-3 7h3",
  adventure: "M2.5 19.5l6.5-11 4 6.5 2.5-3.5 6 8zM7 12.5l2-1.6 2 1.6",
  spa: "M12 20c-4 0-7-2.5-8-7 3 0 5.5 1 8 3.5 2.5-2.5 5-3.5 8-3.5-1 4.5-4 7-8 7zM12 16.5C10 14 10 9.5 12 5c2 4.5 2 9 0 11.5z",
  fire: "M12 21c-3.5 0-6-2.4-6-5.8 0-3 2.2-4.6 3.2-7 .5 1.6 1.6 2.4 2.3 2.8C12 8.5 12.5 5.8 11.5 3c4 1.8 6.5 6 6.5 9.6 0 5-2.5 8.4-6 8.4zM12 21c-1.7 0-3-1.2-3-3 0-1.6 1.5-2.4 3-4.5 1.5 2.1 3 2.9 3 4.5 0 1.8-1.3 3-3 3z",
  events: "M11 3l1.8 5.2L18 10l-5.2 1.8L11 17l-1.8-5.2L4 10l5.2-1.8zM19 15v5M16.5 17.5h5",
  wifi: "M2.5 9.5a14 14 0 0 1 19 0M5.5 13a9.5 9.5 0 0 1 13 0M8.8 16.4a5 5 0 0 1 6.4 0M12 19.8h.01",
  coffee:
    "M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.5a2.5 2.5 0 0 1 0 5H16M8 3c0 1.5 1 1.5 1 3M12 3c0 1.5 1 1.5 1 3",
  leaf: "M5 19C5 9 11 4 20 4c0 9-5 15-13 15M5 19c3-5 6-8 10-10",
  compass: "M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM15.5 8.5l-2 5-5 2 2-5z",
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z",
  email: "M3 6h18v12H3zM3 7l9 6 9-6",
  pin: "M12 21s-6.5-5.7-6.5-11a6.5 6.5 0 0 1 13 0c0 5.3-6.5 11-6.5 11zM12 7.6a2.4 2.4 0 1 0 0 4.8 2.4 2.4 0 0 0 0-4.8z",
} as const;

export type IconName = keyof typeof paths;

/** One icon from the set. Decorative by default (aria-hidden); pass `title` to expose it to assistive tech. */
export function Icon({
  name,
  size = 24,
  title,
  ...rest
}: { name: IconName; size?: number; title?: string } & Omit<SVGProps<SVGSVGElement>, "name">) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={title ? undefined : true}
      role={title ? "img" : undefined}
      focusable="false"
      {...rest}
    >
      {title ? <title>{title}</title> : null}
      <path d={paths[name]} />
    </svg>
  );
}
