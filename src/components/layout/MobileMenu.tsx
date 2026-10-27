"use client";

import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { DUR, EASE, EASE_REVEAL } from "@/components/motion/tokens";
import { nav } from "@/lib/site";
import { SocialIcons } from "./SocialIcons";

/** Hamburger + full-screen menu used below 1180px: large serif links rise out of a panel that opens from the top. */
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
        className="absolute top-1/2 right-4 z-[70] flex size-11 -translate-y-1/2 cursor-pointer flex-col items-center justify-center gap-[7px] border-0 bg-transparent p-0"
      >
        <span
          className={`block h-px w-7 transition-[transform,background-color] duration-500 ease-out ${open ? "bg-ivory translate-y-[4px] rotate-45" : "bg-forest"}`}
        />
        <span
          className={`block h-px w-7 transition-[transform,background-color] duration-500 ease-out ${open ? "bg-ivory -translate-y-[4px] -rotate-45" : "bg-forest"}`}
        />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.nav
            id="mobile-menu"
            aria-label="Site"
            className="bg-forest-deep fixed inset-0 z-[60] flex flex-col overflow-y-auto px-8 pt-28 pb-10"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)", transition: { duration: 0.7, ease: EASE_REVEAL } }}
            exit={{ clipPath: "inset(0 0 100% 0)", transition: { duration: DUR.ui, ease: EASE_REVEAL } }}
          >
            <ul className="m-0 list-none p-0">
              {nav.map((item, i) => {
                const current = pathname === item.href;
                return (
                  <li key={item.href} className="overflow-hidden border-b border-white/10">
                    <motion.div
                      initial={{ y: "100%" }}
                      animate={{ y: 0, transition: { duration: DUR.reveal, ease: EASE, delay: 0.2 + i * 0.06 } }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                    >
                      <Link
                        href={item.href}
                        aria-current={current ? "page" : undefined}
                        onClick={() => setOpen(false)}
                        className="t-h3 text-ivory flex items-baseline justify-between py-4 leading-none no-underline aria-[current=page]:text-gold-soft aria-[current=page]:italic"
                      >
                        <span>{titleCase(item.label)}</span>
                      </Link>
                    </motion.div>
                  </li>
                );
              })}
            </ul>
            <motion.div
              className="mt-10 flex items-center justify-between"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.6, duration: DUR.ui } }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
            >
              <BookNowButton href={bookHref} onClick={() => setOpen(false)} />
              <SocialIcons className="text-ivory" />
            </motion.div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

/** "ROOMS & BOOKING" to "Rooms & booking". */
function titleCase(label: string) {
  const lower = label.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}
