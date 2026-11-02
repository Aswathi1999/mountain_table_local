"use client";

import { animate } from "motion/react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { nav } from "@/lib/site";
import { SITE_FX } from "./home-fx.config";
import { EASE_REVEAL } from "./tokens";
import { useSiteFx } from "./useSiteFx";

/** The panel rises from the bottom with a curved leading edge (like an arch), then lifts away upward with a curved trailing edge. */
const HIDDEN = "ellipse(140% 0% at 50% 100%)";
const COVER = "ellipse(140% 170% at 50% 100%)";
const LIFT_FROM = "ellipse(140% 170% at 50% 0%)";
const GONE = "ellipse(140% 0% at 50% 0%)";

/**
 * Page transitions: an internal link click makes a deep-green panel rise over the page (logo shown), the route changes underneath,
 * then the panel lifts away. Progressive enhancement: without JavaScript, with the effect off, or with reduced motion, links
 * navigate normally. Settings: `SITE_FX.pageTransition`.
 */
export function PageTransition() {
  const on = useSiteFx("pageTransition");
  const router = useRouter();
  const pathname = usePathname();
  const panel = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const lastPath = useRef(pathname);
  const failsafe = useRef<number | undefined>(undefined);
  const word = useRef<HTMLSpanElement>(null);
  const [label, setLabel] = useState("");

  const lift = () => {
    const el = panel.current;
    if (!el) return;
    const { hold, reveal } = SITE_FX.pageTransition;
    // The destination name leaves first, then the panel peels upward.
    if (word.current)
      animate(word.current, { y: ["0%", "-110%"] }, { duration: 0.5, ease: EASE_REVEAL, delay: hold * 0.5 });
    animate(el, { clipPath: [LIFT_FROM, GONE] }, { duration: reveal, ease: EASE_REVEAL, delay: hold }).then(() => {
      el.style.visibility = "hidden";
      busy.current = false;
    });
  };

  useEffect(() => {
    if (!on) return;
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || busy.current)
        return;
      const a = (e.target as Element | null)?.closest("a[href]") as HTMLAnchorElement | null;
      if (!a || a.target || a.hasAttribute("download") || a.origin !== location.origin) return;
      if (a.pathname === location.pathname) return;
      const el = panel.current;
      if (!el) return;
      e.preventDefault();
      e.stopPropagation();
      busy.current = true;
      el.style.visibility = "visible";
      const item = nav.find((n) => n.href === a.pathname);
      setLabel(item ? item.label.charAt(0) + item.label.slice(1).toLowerCase() : "");
      if (word.current) animate(word.current, { y: ["110%", "0%"] }, { duration: 0.8, ease: EASE_REVEAL, delay: 0.25 });
      const { cover, maxWaitMs } = SITE_FX.pageTransition;
      animate(el, { clipPath: [HIDDEN, COVER] }, { duration: cover, ease: EASE_REVEAL }).then(() => {
        router.push(a.pathname + a.search + a.hash);
        // If the route never arrives, do not leave the visitor staring at the panel.
        failsafe.current = window.setTimeout(lift, maxWaitMs);
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [on, router]);

  // The new route has rendered: lift the panel.
  useEffect(() => {
    if (lastPath.current === pathname) return;
    lastPath.current = pathname;
    window.clearTimeout(failsafe.current);
    if (busy.current) lift();
  }, [pathname]);

  return (
    <div
      ref={panel}
      aria-hidden="true"
      className="bg-forest-deep pointer-events-none fixed inset-0 z-[900] flex items-center justify-center"
      style={{ visibility: "hidden", clipPath: HIDDEN }}
    >
      <Image
        src="/images/logo-wordmark-light.png"
        alt=""
        width={232}
        height={139}
        className="h-auto w-[150px] md:w-[200px]"
      />
      <span className="absolute bottom-[18vh] block overflow-hidden px-4 pb-2">
        <span
          ref={word}
          className="text-gold-soft block text-[clamp(1.75rem,4vw,3rem)] leading-none italic"
          style={{ fontFamily: "var(--font-display)", transform: "translateY(110%)" }}
        >
          {label}
        </span>
      </span>
    </div>
  );
}
