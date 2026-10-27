"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Reveal } from "@/components/motion/primitives";
import { EASE, EASE_REVEAL, VIEW_ONCE } from "@/components/motion/tokens";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { LeafSprig } from "@/components/ui/decor";
import { showcaseServices, type ShowcaseService } from "@/data/servicesShowcase";

/** Autoplay is optional and off by default. When on it advances every `AUTOPLAY_MS`, pauses on hover or focus, and never runs with reduced motion. */
const AUTOPLAY = false;
const AUTOPLAY_MS = 6000;

const GOLD = "#B8912F";
const GOLD_DARK = "#8A6A22";
const DIVIDER = "#D9CFBC";

const icon = (d: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    className="size-[1.375rem]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d}
  </svg>
);

/** One thin line icon per service. */
const ICONS: Record<ShowcaseService["icon"], ReactNode> = {
  dining: icon(<path d="M9 3v8a3 3 0 0 1-6 0V3M6 3v18M15 21V3c3 0 5 3 5 8h-5" />),
  adventure: icon(<path d="M2 20l7-12 4 7 3-4 6 9zM7.5 12.5l1.5 1.5 1.2-1.4" />),
  spa: icon(
    <>
      <path d="M12 6c2 2 2 5 0 8-2-3-2-6 0-8zM5 10c3 0 5 2.500 5 6-3 0-5-2.500-5-6zM19 10c-3 0-5 2.500-5 6 3 0 5-2.500 5-6z" />
      <path d="M4 19c3 1.500 13 1.500 16 0" />
    </>,
  ),
  fire: icon(
    <>
      <path d="M12 3c1 3 4 4 4 8a4 4 0 0 1-8 0c0-2 1-3 2-4 .3 1.500 1 2 2 2-.5-2-.5-4 0-6z" />
      <path d="M6 21h12" />
    </>,
  ),
  celebration: icon(
    <>
      <path d="M8 3h5l-.5 6a3 3 0 0 1-4 2.700A3 3 0 0 1 7.500 9zM8 12v8M5.500 20h5" />
      <path d="M16 6h4l-.5 4.500a2.500 2.500 0 0 1-3 2.200M17.500 13v7M15 20h5" />
    </>,
  ),
};

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * "Our Services" showcase: a vertical tab list of the services on the left and a feature panel (photograph, handwritten line, title,
 * description, highlights, call to action) on the right. Click a service, use the arrows or the dots, or the keyboard (Up/Down, Home,
 * End) to change it. It follows the WAI-ARIA tabs pattern. The data lives in `src/data/servicesShowcase.ts`.
 */
export function ServicesShowcase() {
  const services = showcaseServices;
  const [active, setActive] = useState(0);
  const reduce = useReducedMotion();
  const paused = useRef(false);
  const panelWrap = useRef<HTMLDivElement>(null);
  // Observe the unclipped wrapper: a clipped element can report as not visible and never start its own wipe.
  const panelSeen = useInView(panelWrap, VIEW_ONCE);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const s = services[active];
  const dur = (n: number) => (reduce ? 0 : n);

  const go = (i: number, focus = false) => {
    const next = (i + services.length) % services.length;
    setActive(next);
    if (focus) tabRefs.current[next]?.focus();
  };

  useEffect(() => {
    if (!AUTOPLAY || reduce) return;
    const id = window.setInterval(() => {
      if (!paused.current) setActive((a) => (a + 1) % services.length);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [reduce, services.length]);

  const onKey = (e: KeyboardEvent) => {
    const k = e.key;
    if (k === "ArrowDown" || k === "ArrowRight") go(active + 1, true);
    else if (k === "ArrowUp" || k === "ArrowLeft") go(active - 1, true);
    else if (k === "Home") go(0, true);
    else if (k === "End") go(services.length - 1, true);
    else return;
    e.preventDefault();
  };

  const line = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: dur(0.7), ease: EASE } },
  };

  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="relative overflow-hidden bg-[linear-gradient(180deg,#F7F4ED_0%,#F1E8D8_55%,#F7F4ED_100%)] pt-20 pb-24 sm:pt-[120px] sm:pb-[130px]"
    >
      {/* Decorations */}
      <span
        aria-hidden="true"
        className="font-display text-forest/[0.045] pointer-events-none absolute -top-2 right-[1%] hidden text-[200px] leading-none select-none sm:block"
      >
        Services
      </span>
      <LeafSprig className="pointer-events-none absolute -bottom-10 -left-8 hidden h-[17rem] w-auto rotate-[8deg] text-[#C9B98F] sm:block" />

      <div className="wrap relative">
        {/* Header row */}
        <Reveal className="flex flex-wrap items-end justify-between gap-x-12 gap-y-6">
          <div>
            <p className="t-eyebrow text-forest">Our Services</p>
            <h2
              id="services-title"
              className="font-display text-forest m-0 mt-4 max-w-[14em] text-[clamp(2.375rem,4.4vw,3.625rem)] leading-[1.05] font-medium"
            >
              Thoughtful Services for a{" "}
              <em className="font-medium italic" style={{ color: GOLD_DARK }}>
                Seamless
              </em>{" "}
              Stay
            </h2>
          </div>
          <p className="t-body m-0 max-w-[380px] text-[#555E57] [font-size:1rem] [line-height:1.8]">
            From the table to the trail to the spa, every detail is arranged quietly in the background — so all you have
            to do is enjoy it.
          </p>
        </Reveal>

        <div
          className="mt-12 flex flex-wrap items-stretch gap-x-14 gap-y-12 sm:mt-16"
          onPointerEnter={() => (paused.current = true)}
          onPointerLeave={() => (paused.current = false)}
          onFocus={() => (paused.current = true)}
          onBlur={() => (paused.current = false)}
        >
          {/* Left: the service list */}
          <div className="flex min-w-0 flex-1 basis-[25rem] flex-col max-sm:basis-full">
            <div
              role="tablist"
              aria-label="Our services"
              aria-orientation="vertical"
              onKeyDown={onKey}
              className="flex flex-1 flex-col border-t max-sm:-mx-5 max-sm:flex-none max-sm:flex-row max-sm:gap-2 max-sm:overflow-x-auto max-sm:border-t-0 max-sm:px-5 max-sm:pb-2 max-sm:[scrollbar-width:none]"
              style={{ borderColor: DIVIDER }}
            >
              {services.map((item, i) => {
                const on = i === active;
                return (
                  <motion.div
                    key={item.id}
                    role="presentation"
                    data-motion=""
                    className="flex-1 max-sm:shrink-0 max-sm:flex-none"
                    initial={{ opacity: 0, x: reduce ? 0 : -26 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VIEW_ONCE}
                    transition={{ duration: dur(0.8), ease: EASE, delay: dur(i * 0.08) }}
                  >
                    <button
                      ref={(el) => {
                        tabRefs.current[i] = el;
                      }}
                      type="button"
                      role="tab"
                      id={`svc-tab-${item.id}`}
                      aria-selected={on}
                      aria-controls="svc-panel"
                      tabIndex={on ? 0 : -1}
                      onClick={() => go(i)}
                      className="group relative flex min-h-[84px] w-full cursor-pointer items-center gap-5 border-0 border-b bg-transparent py-[22px] pr-2 pl-7 text-left outline-offset-[-3px] focus-visible:outline-2 focus-visible:outline-[#B8912F] max-sm:min-h-11 max-sm:w-auto max-sm:gap-2.5 max-sm:rounded-full max-sm:border max-sm:px-4 max-sm:py-2.5"
                      style={{ borderColor: on ? undefined : DIVIDER }}
                    >
                      {on ? (
                        <motion.span
                          aria-hidden="true"
                          className="absolute top-0 bottom-0 left-0 w-[3px] origin-top max-sm:hidden"
                          style={{ backgroundColor: GOLD }}
                          initial={{ scaleY: reduce ? 1 : 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ duration: dur(0.6), ease: EASE }}
                        />
                      ) : null}
                      <span
                        className="font-display w-7 shrink-0 text-xl italic transition-colors duration-500"
                        style={{ color: on ? GOLD_DARK : "#A9A08C" }}
                        aria-hidden="true"
                      >
                        {pad(i + 1)}
                      </span>
                      <span
                        className={`flex size-[50px] shrink-0 items-center justify-center rounded-full transition-colors duration-500 max-sm:hidden ${
                          on ? "bg-forest text-ivory" : "bg-ivory-deep text-forest"
                        }`}
                      >
                        {ICONS[item.icon]}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`font-display block text-[1.6875rem] leading-tight transition-colors duration-500 max-sm:text-lg ${
                            on ? "text-forest" : "text-[#4A544D] group-hover:text-forest"
                          }`}
                        >
                          {item.title}
                        </span>
                        <span className="mt-0.5 block text-sm text-[#6A716B] max-sm:hidden">{item.subtitle}</span>
                      </span>
                      <span
                        aria-hidden="true"
                        className={`shrink-0 transition-[opacity,transform] duration-500 max-sm:hidden ${
                          on
                            ? "translate-x-0 opacity-100"
                            : "-translate-x-1.5 opacity-30 group-hover:translate-x-0 group-hover:opacity-60"
                        }`}
                        style={{ color: GOLD_DARK }}
                      >
                        <ArrowIcon className="size-5" />
                      </span>
                    </button>
                  </motion.div>
                );
              })}
            </div>
            <Reveal delay={0.3} className="mt-5 flex h-6 items-center max-sm:hidden">
              <Link href="/see-do" className="t-ui link-u text-forest inline-flex items-center gap-2">
                View All Services
                <ArrowIcon className="size-4" />
              </Link>
            </Reveal>
          </div>

          {/* Right: the feature panel */}
          <div ref={panelWrap} className="relative min-w-0 flex-[1.25] basis-[32.5rem] max-sm:basis-full">
            <div className="relative">
              <svg
                aria-hidden="true"
                className="pointer-events-none absolute -top-6 -right-6 bottom-6 left-6 overflow-visible max-sm:hidden"
                style={{ width: "100%", height: "100%" }}
              >
                <motion.rect
                  x="0.5"
                  y="0.5"
                  width="calc(100% - 1px)"
                  height="calc(100% - 1px)"
                  rx="6"
                  fill="none"
                  stroke="#C9A65A"
                  strokeWidth="1"
                  style={{ width: "calc(100% - 1px)", height: "calc(100% - 1px)" }}
                  pathLength={1}
                  initial={{ pathLength: reduce ? 1 : 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={VIEW_ONCE}
                  transition={{ duration: dur(1.6), ease: EASE, delay: dur(0.7) }}
                />
              </svg>

              <motion.div
                data-motion=""
                initial={{ clipPath: reduce ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
                animate={{ clipPath: panelSeen || reduce ? "inset(0% 0 0 0)" : "inset(100% 0 0 0)" }}
                transition={{ duration: dur(1.2), ease: EASE_REVEAL }}
              >
                <div
                  role="tabpanel"
                  id="svc-panel"
                  aria-labelledby={`svc-tab-${s.id}`}
                  tabIndex={0}
                  data-cursor="view"
                  className="relative h-[620px] overflow-hidden rounded-[4px] bg-[#0A221B] shadow-[0_30px_60px_rgba(10,34,27,0.22)] outline-offset-4 focus-visible:outline-2 focus-visible:outline-[#B8912F] max-[999px]:h-[480px] max-sm:h-[420px]"
                >
                  <AnimatePresence initial={false}>
                    <motion.div
                      key={s.id}
                      className="absolute inset-0"
                      initial={{ opacity: 0, scale: reduce ? 1 : 1.04 }}
                      animate={{ opacity: 1, scale: 1, transition: { duration: dur(0.9), ease: EASE } }}
                      exit={{ opacity: 0, transition: { duration: dur(0.9), ease: EASE } }}
                    >
                      <Image
                        src={s.image.src}
                        alt={s.image.alt}
                        fill
                        sizes="(min-width: 1024px) 55vw, 100vw"
                        quality={85}
                        className="object-cover"
                        style={{ objectPosition: s.image.position }}
                      />
                    </motion.div>
                  </AnimatePresence>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,34,27,0.92) 0%, rgba(10,34,27,0.55) 38%, rgba(10,34,27,0) 65%)",
                    }}
                  />

                  <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 sm:p-6">
                    <span className="text-forest rounded-full bg-[#F7F4ED] px-3.5 py-1.5 text-[11px] font-medium tracking-[0.18em] uppercase">
                      {s.tag}
                    </span>
                    <span
                      className="font-display text-ivory rounded-full px-3.5 py-1 text-xl tabular-nums"
                      style={{ backgroundColor: "rgba(10,34,27,0.55)" }}
                      aria-hidden="true"
                    >
                      {pad(active + 1)} / {pad(services.length)}
                    </span>
                  </div>

                  <div className="text-ivory absolute inset-x-0 bottom-0 p-10 max-sm:p-6">
                    <motion.div
                      key={s.id}
                      initial="hidden"
                      animate="show"
                      variants={{ hidden: {}, show: { transition: { staggerChildren: dur(0.06) } } }}
                    >
                      <motion.p
                        variants={line}
                        className="t-script m-0 text-[1.75rem]"
                        style={{ color: "#E9C9A8" }}
                        aria-hidden="true"
                      >
                        {s.script}
                      </motion.p>
                      <motion.h3
                        variants={line}
                        aria-live="polite"
                        className="font-display m-0 mt-1 text-[clamp(2.125rem,3.4vw,2.875rem)] leading-[1.1] font-medium"
                      >
                        {s.title}
                      </motion.h3>
                      <motion.p
                        variants={line}
                        className="m-0 mt-3 max-w-[460px] text-[0.9375rem] leading-[1.75] text-[#DCE2DC]"
                      >
                        {s.description}
                      </motion.p>
                      <motion.ul variants={line} className="m-0 mt-4 flex list-none flex-wrap gap-2 p-0">
                        {s.highlights.map((h) => (
                          <li
                            key={h}
                            className="rounded-full border px-3.5 py-1.5 text-[13px]"
                            style={{ borderColor: "rgba(247,244,237,0.4)", backgroundColor: "rgba(247,244,237,0.1)" }}
                          >
                            {h}
                          </li>
                        ))}
                      </motion.ul>
                      <motion.div variants={line} className="mt-6 flex flex-wrap items-center justify-between gap-4">
                        <Link
                          href={s.cta.href}
                          className="text-forest hover:bg-gold inline-flex h-12 items-center gap-2.5 rounded-full bg-[#F7F4ED] px-6 text-[0.9375rem] font-medium no-underline transition-colors duration-300"
                        >
                          {s.cta.label}
                          <ArrowIcon className="size-4" />
                        </Link>
                        <span className="flex gap-2.5">
                          <button
                            type="button"
                            aria-label="Previous service"
                            onClick={() => go(active - 1)}
                            className="text-ivory flex size-12 cursor-pointer items-center justify-center rounded-full border bg-transparent transition-colors duration-300 hover:bg-[rgba(247,244,237,0.16)] active:scale-95"
                            style={{ borderColor: "rgba(247,244,237,0.5)" }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="size-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              aria-hidden="true"
                            >
                              <path d="M20 12H5M11 6l-6 6 6 6" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            aria-label="Next service"
                            onClick={() => go(active + 1)}
                            className="text-forest-deep flex size-12 cursor-pointer items-center justify-center rounded-full border-0 transition-[filter,transform] duration-300 hover:brightness-110 active:scale-95"
                            style={{ backgroundColor: GOLD }}
                          >
                            <svg
                              viewBox="0 0 24 24"
                              className="size-5"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              aria-hidden="true"
                            >
                              <path d="M4 12h15M13 6l6 6-6 6" />
                            </svg>
                          </button>
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </div>

            <ol className="m-0 mt-5 flex list-none items-center gap-2 p-0" aria-label="Choose a service">
              {services.map((item, i) => (
                <li key={item.id}>
                  <button
                    type="button"
                    aria-label={`Show ${item.title}`}
                    aria-current={i === active}
                    onClick={() => go(i)}
                    className="flex h-6 cursor-pointer items-center border-0 bg-transparent p-0 outline-offset-2 focus-visible:outline-2 focus-visible:outline-[#B8912F]"
                  >
                    <span
                      className="block h-1.5 rounded-full transition-[width,background-color] duration-500"
                      style={{ width: i === active ? 30 : 6, backgroundColor: i === active ? GOLD : "#CFC4AE" }}
                    />
                  </button>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
