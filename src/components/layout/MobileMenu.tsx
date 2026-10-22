"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { SocialIcons } from "./SocialIcons";
import { nav } from "@/lib/site";

/** Hamburger + full-screen menu used below 750px: large staggered links, the booking CTA, Escape/navigation closes it. */
export function MobileMenu({ bookHref }: { bookHref: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <div className="min-[1180px]:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
        className="absolute top-1/2 right-4 z-[70] flex size-11 -translate-y-1/2 cursor-pointer flex-col items-center justify-center gap-[6px] border-0 bg-transparent p-0"
      >
        <span
          className={`block h-px w-6 bg-white transition-transform duration-300 ${open ? "translate-y-[3.5px] rotate-45" : ""}`}
        />
        <span
          className={`block h-px w-6 bg-white transition-transform duration-300 ${open ? "-translate-y-[3.5px] -rotate-45" : ""}`}
        />
      </button>
      <nav
        id="mobile-menu"
        aria-label="Site"
        aria-hidden={!open}
        inert={!open}
        className={`bg-ink fixed inset-0 z-[60] flex flex-col items-center overflow-y-auto pt-[6.5rem] transition-opacity duration-300 ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      >
        <ul className="m-0 list-none p-0 text-center">
          {nav.map((item, i) => (
            <li
              key={item.href}
              className={`transition-all duration-500 ease-out ${open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}
              style={{ transitionDelay: open ? `${120 + i * 70}ms` : "0ms" }}
            >
              <Link
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                onClick={() => setOpen(false)}
                className="block py-3 text-[1.0625rem] tracking-[0.22em] text-white no-underline aria-[current=page]:text-nav-active"
              >
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
        <BookNowButton href={bookHref} onClick={() => setOpen(false)} className="mt-8" />
        <SocialIcons className="mt-8" />
      </nav>
    </div>
  );
}
