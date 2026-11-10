"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { DUR, EASE, STAGGER, VIEW_ONCE } from "@/components/motion/tokens";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { copy } from "@/data/copy";
import { roomLayouts } from "@/data/rooms";

/** Short highlights, each taken from the room's own description on the Rooms & Booking page (no specs or prices are published). */
const highlights: readonly (readonly string[])[] = [
  ["Panoramic glass windows", "Shaded balcony", "Pool access", "Mountain-sunset toilet window"],
  ["Private grass lawn", "Grill house access", "Tea plantation walk", "Wide hill-view window"],
  ["Our largest room", "Side glass window", "Garden view", "Direct infinity-pool access"],
];

/** Where each photograph is anchored so the window and the bed stay in the frame. */
const focus = ["50% 55%", "50% 55%", "50% 60%"] as const;
const concepts = [
  {
    src: "/images/room-1-v1.jpg",
    alt: "Bedroom with a large bed, a teak desk and tall windows opening onto a balcony above green hills",
  },
  { src: "/images/room-2-v1.jpg", alt: "Bedroom with a wooden double bed, cream linen and warm lighting" },
  {
    src: "/images/room-3-v1.jpg",
    alt: "Spacious bedroom with a wooden double bed, cushions and a teak door",
  },
] as const;
const fx = HOME_FX.roomSlider;

const pad = (n: number) => String(n).padStart(2, "0");

export function HomeRoomsSlider() {
  const rooms = roomLayouts;
  const [active, setActive] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reducedMotion = useReducedMotion();
  const reduce = reducedMotion || !fx.enabled;
  const wrap = useRef<HTMLDivElement>(null);
  const seen = useInView(wrap, VIEW_ONCE);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const dragX = useRef<{ x: number; y: number } | null>(null);
  const dur = (n: number) => (reduce ? 0 : n);
  const room = rooms[active];

  const go = (i: number, focusTab = false) => {
    const next = (i + rooms.length) % rooms.length;
    if (next === active) return;
    setDir(i > active || (active === rooms.length - 1 && next === 0) ? 1 : -1);
    setActive(next);
    if (focusTab) tabRefs.current[next]?.focus();
  };

  // Auto-advance while in view; pauses on hover/focus, hidden tab and reduced motion.
  // Restarts whenever `active` changes, so manual navigation resets the timer.
  useEffect(() => {
    if (reducedMotion || !fx.enabled || !seen || paused) return;
    const id = window.setTimeout(() => {
      if (document.hidden) return;
      setDir(1);
      setActive((a) => (a + 1) % rooms.length);
    }, fx.autoplayMs);
    return () => window.clearTimeout(id);
  }, [active, seen, paused, reducedMotion, rooms.length]);

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight" || e.key === "ArrowDown") go(active + 1, true);
    else if (e.key === "ArrowLeft" || e.key === "ArrowUp") go(active - 1, true);
    else if (e.key === "Home") go(0, true);
    else if (e.key === "End") go(rooms.length - 1, true);
    else return;
    e.preventDefault();
  };

  // Swipe on touch screens (buttons and tabs remain the accessible controls).
  const onDown = (e: PointerEvent) => {
    if (e.pointerType === "touch" && !(e.target as HTMLElement).closest("button, a, select, summary")) {
      dragX.current = { x: e.clientX, y: e.clientY };
    }
  };
  const onUp = (e: PointerEvent) => {
    if (dragX.current === null) return;
    const dx = e.clientX - dragX.current.x;
    const dy = e.clientY - dragX.current.y;
    dragX.current = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) go(active + (dx < 0 ? 1 : -1));
  };

  const rise = (i: number) => ({
    "data-motion": "",
    initial: { opacity: 0, y: reduce ? 0 : 22 },
    animate: seen || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 22 },
    transition: { duration: dur(DUR.reveal), ease: EASE, delay: dur(STAGGER.base * i) },
  });

  const line = {
    hidden: { opacity: 0, y: reduce ? 0 : 14 },
    show: { opacity: 1, y: 0, transition: { duration: dur(DUR.ui), ease: EASE } },
  };

  return (
    <section
      id="our-rooms"
      aria-labelledby="our-rooms-title"
      className="bg-forest-deep text-ivory relative overflow-hidden"
    >
      <motion.div
        ref={wrap}
        data-motion=""
        className="relative flex min-h-[max(46rem,100svh)] flex-col lg:min-h-[max(54rem,100svh)]"
        onPointerDown={onDown}
        onPointerUp={onUp}
        onPointerCancel={() => (dragX.current = null)}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        {/* Photographs */}
        <div aria-hidden="true" className="absolute inset-0">
          {concepts.map((concept, i) => (
            <motion.div
              key={concept.src}
              className="absolute inset-0"
              initial={false}
              animate={{
                opacity: active === i ? 1 : 0,
                scale: reduce ? 1 : seen && active === i ? fx.scaleTo : fx.scaleFrom,
              }}
              transition={{
                opacity: { duration: dur(fx.crossfade) },
                scale: { duration: dur(fx.settle), ease: "linear" },
              }}
            >
              <Image
                src={concept.src}
                alt={concept.alt}
                fill
                sizes="(max-aspect-ratio: 16/9) 180vh, 100vw"
                quality={85}
                className="object-cover"
                style={{ objectPosition: focus[i] }}
              />
            </motion.div>
          ))}
          {/* Scrims keep the headline, tabs and card readable on any photograph. */}
          <div
            aria-hidden="true"
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to bottom, rgba(20,42,33,0.7) 0%, rgba(20,42,33,0.28) 34%, rgba(20,42,33,0.12) 55%, rgba(20,42,33,0.78) 100%)",
            }}
          />
        </div>

        <div className="wrap relative z-10 flex flex-1 flex-col pt-16 pb-10 lg:pt-24 lg:pb-12">
          {/* Eyebrow */}
          <motion.p {...rise(0)} className="t-eyebrow text-ivory m-0 flex items-center gap-3">
            <span aria-hidden="true" className="bg-gold size-1.5 rounded-full" />
            Our Rooms
          </motion.p>

          {/* Headline */}
          <h2
            id="our-rooms-title"
            className="font-display m-0 mt-6 text-center text-[clamp(2rem,1.3rem+2.6vw,3.5rem)] leading-[1.1] font-medium"
          >
            <span className="block overflow-hidden pb-1">
              <motion.span
                data-motion=""
                className="block"
                initial={{ y: reduce ? 0 : "105%" }}
                animate={{ y: seen || reduce ? 0 : "105%" }}
                transition={{ duration: dur(DUR.line), ease: EASE, delay: dur(0.25) }}
              >
                {copy.rooms.titleLines[0]}
              </motion.span>
            </span>
            <span className="block overflow-hidden pb-2">
              <motion.em
                data-motion=""
                className="block font-medium italic"
                initial={{ y: reduce ? 0 : "105%" }}
                animate={{ y: seen || reduce ? 0 : "105%" }}
                transition={{ duration: dur(DUR.line), ease: EASE, delay: dur(0.38) }}
              >
                {copy.rooms.titleLines[1]}
              </motion.em>
            </span>
          </h2>

          {/* Room tabs */}
          <label className="mx-auto mt-8 block w-full max-w-80 md:hidden">
            <span className="sr-only">Choose a room</span>
            <select
              value={active}
              onChange={(event) => go(Number(event.target.value))}
              className="bg-forest-deep/60 text-ivory h-12 w-full rounded-full border border-ivory/40 px-5 backdrop-blur-md"
            >
              {rooms.map((r, i) => (
                <option key={r.name} value={i} className="bg-forest-deep">
                  {r.name}
                </option>
              ))}
            </select>
          </label>
          <motion.div {...rise(2)} className="mt-8 hidden justify-center md:flex">
            <div
              role="tablist"
              aria-label="Choose a room"
              onKeyDown={onKey}
              className="flex flex-wrap justify-center gap-3"
            >
              {rooms.map((r, i) => {
                const on = i === active;
                return (
                  <button
                    key={r.name}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    id={`rooms-tab-${i}`}
                    aria-selected={on}
                    aria-controls="rooms-slide"
                    tabIndex={on ? 0 : -1}
                    onClick={() => go(i)}
                    className={`min-h-11 cursor-pointer rounded-full border px-6 text-[0.8125rem] font-medium tracking-[0.2em] uppercase backdrop-blur-sm transition-[background-color,color,border-color] duration-500 outline-offset-4 focus-visible:outline-2 focus-visible:outline-gold-soft ${
                      on
                        ? "border-ivory bg-ivory text-forest"
                        : "border-ivory/35 bg-forest-deep/35 text-ivory hover:bg-forest-deep/60"
                    }`}
                  >
                    {r.name}
                  </button>
                );
              })}
            </div>
          </motion.div>

          {/* Edge arrows (desktop) */}
          <div className="pointer-events-none absolute inset-x-0 top-[44%] hidden items-center justify-between px-5 lg:flex">
            {([-1, 1] as const).map((d) => (
              <button
                key={d}
                type="button"
                aria-label={d < 0 ? "Previous room" : "Next room"}
                onClick={() => go(active + d)}
                className="group text-ivory pointer-events-auto flex cursor-pointer items-center gap-4 border-0 bg-transparent p-2 text-[11px] tracking-[0.22em] uppercase outline-offset-4 focus-visible:outline-2 focus-visible:outline-gold-soft"
              >
                {d < 0 ? <Chevron flip /> : null}
                <span
                  aria-hidden="true"
                  className="bg-ivory/60 h-px w-12 transition-[width] duration-500 group-hover:w-20"
                />
                <span aria-hidden="true">{d < 0 ? "Prev" : "Next"}</span>
                {d > 0 ? <Chevron /> : null}
              </button>
            ))}
          </div>

          {/* Lower row: frosted card + counter */}
          <div className="mt-auto flex flex-col gap-8 pt-12 lg:flex-row lg:items-end lg:justify-between">
            <motion.div
              {...rise(3)}
              id="rooms-slide"
              role="tabpanel"
              aria-label={room.name}
              tabIndex={0}
              className="border-ivory/25 bg-forest-deep/55 w-full max-w-[28rem] rounded-2xl border p-6 backdrop-blur-md sm:p-7"
            >
              <motion.div
                data-motion=""
                key={active}
                initial="hidden"
                animate="show"
                variants={{ hidden: {}, show: { transition: { staggerChildren: dur(STAGGER.tight) } } }}
              >
                <motion.h3
                  data-motion=""
                  variants={line}
                  aria-live="polite"
                  className="font-display m-0 text-[clamp(1.75rem,1.4rem+1vw,2.25rem)] leading-tight font-medium"
                >
                  {room.name}
                </motion.h3>
                <motion.p
                  data-motion=""
                  variants={line}
                  className="text-ivory/85 m-0 mt-3 hidden text-[0.8125rem] leading-[1.7] md:block"
                >
                  {copy.rooms.cards[active]}
                </motion.p>
                <details className="mt-3 md:hidden" key={room.name}>
                  <summary className="cursor-pointer py-2 text-sm">Room details</summary>
                  <p className="text-ivory/85 text-sm leading-relaxed">{copy.rooms.cards[active]}</p>
                </details>
                <motion.p
                  data-motion=""
                  variants={line}
                  className="text-gold-soft m-0 mt-5 text-[11px] tracking-[0.22em] uppercase"
                >
                  Highlights
                </motion.p>
                <motion.ul data-motion="" variants={line} className="m-0 mt-3 flex list-none flex-wrap gap-2 p-0">
                  {highlights[active].map((h) => (
                    <li key={h} className="border-ivory/35 bg-ivory/10 rounded-full border px-3.5 py-1.5 text-[13px]">
                      {h}
                    </li>
                  ))}
                </motion.ul>
                <p className="m-0 mt-4 text-xs text-ivory/80">AI-generated room concept</p>
              </motion.div>
            </motion.div>

            <motion.div {...rise(4)} className="flex flex-col gap-6 lg:items-end">
              <div className="flex items-center justify-between gap-6 lg:flex-col lg:items-end">
                <div className="flex items-center gap-2.5 lg:hidden">
                  <button
                    type="button"
                    aria-label="Previous room"
                    onClick={() => go(active - 1)}
                    className="border-ivory/50 text-ivory flex size-12 cursor-pointer items-center justify-center rounded-full border bg-transparent active:scale-95"
                  >
                    <Chevron flip />
                  </button>
                  <button
                    type="button"
                    aria-label="Next room"
                    onClick={() => go(active + 1)}
                    className="bg-gold text-forest-deep flex size-12 cursor-pointer items-center justify-center rounded-full border-0 active:scale-95"
                  >
                    <Chevron />
                  </button>
                </div>
                <p className="font-display m-0 text-[2.25rem] leading-none tabular-nums" aria-hidden="true">
                  <span className="relative inline-block h-[1em] overflow-hidden align-bottom">
                    <AnimatePresence initial={false} mode="popLayout">
                      <motion.span
                        key={active}
                        className="inline-block"
                        initial={{ y: reduce ? 0 : dir * 28, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: reduce ? 0 : dir * -28, opacity: 0 }}
                        transition={{ duration: dur(DUR.ui), ease: EASE }}
                      >
                        {pad(active + 1)}
                      </motion.span>
                    </AnimatePresence>
                  </span>
                  <span className="text-ivory/60"> / {pad(rooms.length)}</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-5 lg:justify-end">
                <ol className="m-0 flex list-none items-center gap-2 p-0" aria-label="Rooms">
                  {rooms.map((r, i) => (
                    <li key={r.name}>
                      <button
                        type="button"
                        aria-label={`Show ${r.name}`}
                        aria-current={i === active}
                        onClick={() => go(i)}
                        className="flex h-6 cursor-pointer items-center border-0 bg-transparent p-0 outline-offset-2 focus-visible:outline-2 focus-visible:outline-gold-soft"
                      >
                        <span
                          className="block h-[3px] rounded-full transition-[width,background-color] duration-500"
                          style={{
                            width: i === active ? 44 : 20,
                            backgroundColor: i === active ? "var(--color-gold-soft)" : "rgba(246,242,234,0.45)",
                          }}
                        />
                      </button>
                    </li>
                  ))}
                </ol>
                <Link
                  href="/rooms-booking"
                  className="text-forest hover:bg-gold bg-ivory inline-flex h-12 items-center gap-2.5 rounded-full px-6 text-[0.9375rem] font-medium no-underline transition-colors duration-300"
                >
                  View Rooms
                  <ArrowIcon className="size-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}

function Chevron({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`size-5 ${flip ? "-scale-x-100" : ""}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  );
}
