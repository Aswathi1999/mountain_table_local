"use client";

import { motion, useScroll, useSpring } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, useSyncExternalStore } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { DUR, EASE, SCROLL_SPRING } from "@/components/motion/tokens";
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
  const [hidden, setHidden] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);

  // Slides away while the page scrolls down, and back as soon as it scrolls up (never while the menu is open).
  useEffect(() => {
    if (!HOME_FX.header.enabled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      const delta = y - last;
      if (Math.abs(delta) < 6) return;
      last = y;
      if (document.getElementById("mobile-menu")) return;
      setHidden(delta > 0 && y > HOME_FX.header.hideAfterPx);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        id="SITE_HEADER"
        className={`text-forest fixed inset-x-0 top-0 z-50 transition-[height,box-shadow,transform,background-color,backdrop-filter] duration-500 ease-out focus-within:translate-y-0 ${
          scrolled
            ? "h-[64px] bg-ivory/80 shadow-[0_1px_0_rgba(31,59,47,0.12)] backdrop-blur-xl"
            : "h-[72px] bg-ivory/95 backdrop-blur-md desk:h-[84px]"
        } ${hidden ? "-translate-y-full" : "translate-y-0"}`}
      >
        {HOME_FX.header.progressLine ? (
          <motion.span
            aria-hidden="true"
            className="bg-gold absolute top-0 left-0 z-10 block h-[2px] w-full origin-left"
            style={{ scaleX: progress }}
          />
        ) : null}
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
