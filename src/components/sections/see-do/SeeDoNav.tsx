"use client";

import { motion } from "motion/react";
import { useEffect, useState, type ReactNode } from "react";
import { copy } from "@/data/copy";
import { splitTitle } from "./title";

const svg = (d: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    className="size-[1.125rem] shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d}
  </svg>
);

/** One small line icon per activity, in page order. */
export const ACTIVITY_ICONS: ReactNode[] = [
  svg(
    <>
      <path d="M3 15v-3l2-5h14l2 5v3" />
      <path d="M3 15h18" />
      <circle cx="7.5" cy="17" r="1.8" />
      <circle cx="16.5" cy="17" r="1.8" />
    </>,
  ),
  svg(
    <>
      <path d="M3 9c3-6 15-6 18 0-3-1.5-15-1.5-18 0z" />
      <path d="M5 9.5l7 8 7-8" />
      <circle cx="12" cy="19.5" r="1.2" />
    </>,
  ),
  svg(
    <>
      <circle cx="6" cy="16" r="3.5" />
      <circle cx="18" cy="16" r="3.5" />
      <path d="M6 16l4-8h5l3 8M10 8H8M13 12l-3 4" />
    </>,
  ),
  svg(
    <>
      <path d="M2 20l7-12 4 7 3-4 6 9z" />
      <path d="M7.5 12.5l1.5 1.5 1.2-1.4" />
    </>,
  ),
  svg(
    <>
      <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 .3 1.5 1 2 2 2-.5-2-.5-4 0-6z" />
      <path d="M6 21h12" />
    </>,
  ),
  svg(
    <>
      <path d="M12 4c-1.5 0-2.5 1.5-2.5 3.5S10.5 11 12 11s2.5-1.5 2.5-3.5S13.500 4 12 4z" />
      <path d="M7 12.500c-1 0-1.800 1-1.800 2.300S6 17 7 17M17 12.500c1 0 1.800 1 1.800 2.300S18 17 17 17M12 14c-2 0-3.500 2-3.500 4s1.500 2.500 3.500 2.500 3.500-.5 3.500-2.500-1.500-4-3.500-4z" />
    </>,
  ),
];

const items = copy.seeDo.activities.map((a, i) => ({
  id: `activity-${i + 1}`,
  name: splitTitle(a.title)[0],
  icon: ACTIVITY_ICONS[i],
}));

/**
 * Sticky quick-nav under the header: one pill per activity with a line icon, linking to its anchor. Scroll spy marks the activity in
 * view and a gold underline slides to it. Scrolls sideways on small screens (the current item is kept in view).
 */
export function SeeDoNav() {
  const [current, setCurrent] = useState<string>("");

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setCurrent(e.target.id);
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => io.observe(el));
    const clear = () => {
      const first = els[0];
      if (first && first.getBoundingClientRect().top > window.innerHeight * 0.5) setCurrent("");
    };
    window.addEventListener("scroll", clear, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", clear);
    };
  }, []);

  // While the page is moving, photographs ignore the pointer: otherwise images sliding under a still cursor keep switching their
  // hover zoom and lantern on and off, which reads as shaking.
  useEffect(() => {
    const root = document.documentElement;
    let timer = 0;
    const onScroll = () => {
      root.classList.add("is-scrolling");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => root.classList.remove("is-scrolling"), 140);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
      root.classList.remove("is-scrolling");
    };
  }, []);

  useEffect(() => {
    if (!current) return;
    const link = document.querySelector<HTMLElement>(`#seedo-nav a[href="#${current}"]`);
    // Scroll only the pill row (never the page, which would cancel an anchor jump that is still in progress).
    const row = link?.closest("ul");
    if (link && row)
      row.scrollTo({ left: link.offsetLeft - (row.clientWidth - link.offsetWidth) / 2, behavior: "smooth" });
  }, [current]);

  return (
    <div id="seedo-nav" className="bg-ivory sticky top-[64px] z-30 border-b border-forest/10">
      <nav aria-label="Activities" className="wrap">
        <ul className="m-0 flex list-none gap-1 overflow-x-auto p-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden desk:justify-between">
          {items.map((item) => {
            const active = current === item.id;
            return (
              <li key={item.id} className="shrink-0">
                <a
                  href={`#${item.id}`}
                  aria-current={active ? "location" : undefined}
                  className={`t-ui relative flex min-h-14 items-center gap-2 px-3 no-underline transition-colors duration-500 desk:px-4 ${
                    active ? "text-forest" : "text-ink/65 hover:text-forest"
                  }`}
                >
                  {item.icon}
                  {item.name}
                  {active ? (
                    <motion.span
                      layoutId="seedo-nav-underline"
                      className="bg-gold absolute inset-x-3 bottom-0 h-[2px] desk:inset-x-4"
                      transition={{ type: "spring", stiffness: 260, damping: 32 }}
                    />
                  ) : null}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
