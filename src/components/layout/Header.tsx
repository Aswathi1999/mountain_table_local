"use client";

import { motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useSyncExternalStore } from "react";
import { DUR, EASE } from "@/components/motion/tokens";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { SocialIcons } from "./SocialIcons";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

const BOOK_HREF = "/rooms-booking";

const subscribeToScroll = (notify: () => void) => {
  window.addEventListener("scroll", notify, { passive: true });
  return () => window.removeEventListener("scroll", notify);
};
const isScrolled = () => window.scrollY > 80;

const enter = (delay: number) => ({
  initial: { opacity: 0, y: -12 },
  animate: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE, delay } },
});

/**
 * Fixed site header: an ivory bar with the logo at the left, the page links in the middle and the booking button at the right
 * (a menu button replaces the links on narrower screens). It tightens and gains a hairline once the page scrolls, and its
 * parts arrive one after another on first load. A spacer keeps the page content below it.
 */
export function Header() {
  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, () => false);

  return (
    <>
      <header
        id="SITE_HEADER"
        className={`bg-ivory/92 text-forest fixed inset-x-0 top-0 z-50 backdrop-blur-md transition-[height,box-shadow] duration-500 ${
          scrolled ? "h-[64px] shadow-[0_1px_0_rgba(31,59,47,0.12)]" : "h-[72px] desk:h-[84px]"
        }`}
      >
        <div className="wrap flex h-full items-center justify-between">
          <motion.div {...enter(0.05)}>
            <Link href="/" aria-label="The Mountain Table, home" className="group block no-underline">
              <span className="relative block h-[50px] w-[84px] transition-transform duration-700 group-hover:scale-[1.03] desk:h-[58px] desk:w-[97px]">
                <Image
                  src="/images/logo-wordmark.png"
                  alt="The Mountain Table"
                  fill
                  sizes="100px"
                  className="object-contain"
                  priority
                />
              </span>
            </Link>
          </motion.div>

          <div className="flex items-center gap-8 max-[1179.98px]:hidden">
            <motion.nav aria-label="Site" {...enter(0.12)}>
              <NavLinks />
            </motion.nav>
            <motion.div className="text-forest" {...enter(0.19)}>
              <SocialIcons />
            </motion.div>
            <motion.div {...enter(0.26)}>
              <BookNowButton href={BOOK_HREF} size="compact" />
            </motion.div>
          </div>
        </div>
        <MobileMenu bookHref={BOOK_HREF} />
      </header>
      <div aria-hidden="true" className="h-[72px] desk:h-[84px]" />
    </>
  );
}
