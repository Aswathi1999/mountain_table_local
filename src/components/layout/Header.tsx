"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { SocialIcons } from "./SocialIcons";
import { MobileMenu } from "./MobileMenu";
import { NavLinks } from "./NavLinks";

const BOOK_HREF = "/rooms-booking";

const subscribeToScroll = (notify: () => void) => {
  window.addEventListener("scroll", notify, { passive: true });
  return () => window.removeEventListener("scroll", notify);
};
const isScrolled = () => window.scrollY > 24;

/**
 * Fixed site header. On the home and About pages it floats transparent over the hero and turns into a soft dark bar once the visitor
 * scrolls; on every other page it is the original solid dark bar (a spacer keeps the content where it was).
 */
export function Header() {
  const pathname = usePathname();
  const overHero = pathname === "/" || pathname === "/about";
  const scrolled = useSyncExternalStore(subscribeToScroll, isScrolled, () => false);
  const solid = !overHero || scrolled;

  return (
    <>
      <header
        id="SITE_HEADER"
        className={`fixed inset-x-0 top-0 z-50 h-[4.4375rem] transition-[background-color,box-shadow,height] duration-500 ease-out desk:h-[80px] ${
          solid
            ? "bg-ink/92 shadow-[0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-md desk:data-[scrolled=true]:h-[68px]"
            : "bg-gradient-to-b from-ink/70 to-transparent"
        }`}
        data-scrolled={scrolled}
      >
        <div className="mx-auto flex h-full max-w-[1180px] items-center justify-between px-5 desk:px-8">
          <Link href="/" aria-label="The Mountain Table, home" className="group flex items-center gap-3 no-underline">
            <Image
              src="/images/81d784_b04585865a4143659f5fb16e59163c94.png"
              alt=""
              width={44}
              height={44}
              className="size-9 rounded-full transition-transform duration-700 ease-out group-hover:rotate-[8deg] desk:size-11"
              priority
            />
          </Link>

          <div className="flex items-center gap-7 max-[1179.98px]:hidden">
            <nav aria-label="Site">
              <NavLinks />
            </nav>
            <SocialIcons />
            <BookNowButton href={BOOK_HREF} size="compact" />
          </div>
        </div>
        <MobileMenu bookHref={BOOK_HREF} />
      </header>
      {overHero ? null : <div aria-hidden="true" className="h-[4.4375rem] desk:h-[80px]" />}
    </>
  );
}
