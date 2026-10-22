"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/lib/site";

/** Desktop horizontal menu: quiet uppercase links with an underline that draws in on hover/focus and stays on the current page. */
export function NavLinks() {
  const pathname = usePathname();
  return (
    <ul className="m-0 flex list-none gap-7 p-0">
      {nav.map((item) => (
        <li key={item.href}>
          <Link
            href={item.href}
            aria-current={pathname === item.href ? "page" : undefined}
            className="nav-link nav-underline t-ui block py-2 tracking-[0.2em] no-underline"
          >
            {item.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
