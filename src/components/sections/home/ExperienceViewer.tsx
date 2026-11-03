"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type KeyboardEvent,
  type TouchEvent,
  type WheelEvent,
} from "react";
import { createPortal } from "react-dom";
import { DUR, EASE, EASE_REVEAL } from "@/components/motion/tokens";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

export type Experience = {
  title: string;
  text: string;
  image: string;
  alt: string;
  note?: string;
  details?: readonly string[];
};

/** Where the viewer grows from and shrinks back to: the clicked card's rectangle in the window, or null to just fade. */
export type OpenFrom = { index: number; rect: DOMRect | null };

const clipFor = (rect: DOMRect | null) => {
  if (!rect) return "inset(50% 50% 50% 50%)";
  const { innerWidth: w, innerHeight: h } = window;
  const clamp = (n: number) => Math.max(0, Math.round(n));
  return `inset(${clamp(rect.top)}px ${clamp(w - rect.right)}px ${clamp(h - rect.bottom)}px ${clamp(rect.left)}px)`;
};
const FULL = "inset(0px 0px 0px 0px)";

/**
 * Full-screen view of the experiences. The clicked card's photograph grows to fill the screen (a clip that opens from the card's
 * own rectangle) and its details appear. Scrolling down from there, each next experience slides up over the one before it, a
 * full-screen page at a time; scrolling up slides them back. Escape, the close button or a click on "Close" shrinks it back to the
 * card. Focus moves into the viewer and returns to the card afterwards. With reduced motion it simply fades.
 */
export function ExperienceViewer({
  items,
  open,
  onClose,
}: {
  items: readonly Experience[];
  open: OpenFrom | null;
  onClose: (closeRect: DOMRect | null) => void;
}) {
  const reduce = useReducedMotion();
  const mounted = useSyncExternalStore(
    () => () => undefined,
    () => true,
    () => false,
  );
  const [page, setPage] = useState(0);
  const [closeRect, setCloseRect] = useState<DOMRect | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  // Remember what had focus, lock the page behind, and jump straight to the clicked experience.
  useLayoutEffect(() => {
    if (!open) return;
    opener.current = document.activeElement as HTMLElement | null;
    const html = document.documentElement;
    const previous = html.style.overflow;
    html.style.overflow = "hidden";
    const el = scroller.current;
    if (el) el.scrollTop = open.index * el.clientHeight;
    return () => {
      html.style.overflow = previous;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => closeButton.current?.focus({ preventScroll: true }), reduce ? 0 : 650);
    return () => window.clearTimeout(id);
  }, [open, reduce]);

  const onScroll = useCallback(() => {
    const el = scroller.current;
    if (el) setPage(Math.round(el.scrollTop / el.clientHeight));
  }, []);

  const close = useCallback(
    (go?: "next" | "prev") => {
      // Shrink back to the card of the experience now showing (or fade, if that card is not on screen).
      const cards = document.querySelectorAll<HTMLElement>("[data-experience-card]");
      const rect = cards[page]?.getBoundingClientRect() ?? null;
      const visible =
        rect && rect.bottom > 0 && rect.top < window.innerHeight && rect.right > 0 && rect.left < window.innerWidth;
      setCloseRect(visible ? rect : null);
      onClose(visible ? rect : null);
      window.setTimeout(() => setPage(0), 900);
      if (go) {
        // Leaving past either end: once the photograph has settled back into its card, carry on to the section above or below.
        const section = cards[0]?.closest("section");
        const target = go === "next" ? section?.nextElementSibling : section?.previousElementSibling;
        window.setTimeout(
          () => target?.scrollIntoView({ behavior: reduce ? "instant" : "smooth", block: "start" }),
          reduce ? 250 : 1150,
        );
        return;
      }
      window.setTimeout(
        () => (cards[page]?.querySelector("button") as HTMLElement | null)?.focus({ preventScroll: true }),
        reduce ? 0 : 700,
      );
    },
    [onClose, page, reduce],
  );

  // Past the last page: leave the viewer and carry on down the home page, to the section after the experiences.
  const reachedEnd = useRef(0);
  const touchY = useRef<number | null>(null);
  const leaveDown = useCallback(() => close("next"), [close]);
  const leaveUp = useCallback(() => close("prev"), [close]);
  const atEnd = () => {
    const el = scroller.current;
    return !!el && el.scrollTop >= el.scrollHeight - el.clientHeight - 2;
  };
  const atStart = () => (scroller.current?.scrollTop ?? 1) <= 2;
  const onWheel = (e: WheelEvent<HTMLDivElement>) => {
    const edge = atEnd() ? "end" : atStart() ? "start" : null;
    if (!edge) {
      reachedEnd.current = 0;
      return;
    }
    if (!reachedEnd.current) reachedEnd.current = performance.now();
    // A brief pause on the first or last page, so a fast scroll does not shoot straight past it.
    if (performance.now() - reachedEnd.current < 450) return;
    if (edge === "end" && e.deltaY > 12) leaveDown();
    else if (edge === "start" && e.deltaY < -12) leaveUp();
  };
  const onTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    touchY.current = e.touches[0]?.clientY ?? null;
  };
  const onTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchY.current;
    touchY.current = null;
    const end = e.changedTouches[0]?.clientY;
    if (start === null || end === undefined) return;
    if (start - end > 70 && atEnd()) leaveDown();
    else if (end - start > 70 && atStart()) leaveUp();
  };

  const goTo = (i: number) => {
    const el = scroller.current;
    if (el) el.scrollTo({ top: i * el.clientHeight, behavior: reduce ? "instant" : "smooth" });
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      close();
    } else if (e.key === "ArrowDown" || e.key === "PageDown") {
      e.preventDefault();
      if (page >= items.length - 1) leaveDown();
      else goTo(page + 1);
    } else if (e.key === "ArrowUp" || e.key === "PageUp") {
      e.preventDefault();
      if (page <= 0) leaveUp();
      else goTo(page - 1);
    } else if (e.key === "Tab" && root.current) {
      const focusable = Array.from(root.current.querySelectorAll<HTMLElement>("button, a[href]"));
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  const line = {
    hidden: { opacity: 0, y: reduce ? 0 : 28 },
    show: { opacity: 1, y: 0, transition: { duration: reduce ? 0 : DUR.reveal, ease: EASE } },
  };

  if (!mounted) return null;

  const variants = {
    enter: (from: OpenFrom | null) => ({
      clipPath: reduce ? FULL : clipFor(from?.rect ?? null),
      opacity: reduce ? 0 : 1,
    }),
    show: { clipPath: FULL, opacity: 1 },
    leave: (rect: DOMRect | null) => ({ clipPath: reduce ? FULL : clipFor(rect), opacity: reduce || !rect ? 0 : 1 }),
  };

  return createPortal(
    <AnimatePresence custom={closeRect}>
      {open ? (
        <motion.div
          key="experience-viewer"
          ref={root}
          role="dialog"
          aria-modal="true"
          aria-label="Experiences"
          custom={open}
          variants={variants}
          initial="enter"
          animate="show"
          exit="leave"
          transition={{ duration: reduce ? 0.2 : DUR.image, ease: EASE_REVEAL }}
          onKeyDown={onKey}
          className="bg-forest-deep fixed inset-0 z-[950] text-white"
        >
          <div
            ref={scroller}
            data-lenis-prevent=""
            onScroll={onScroll}
            onWheel={onWheel}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div style={{ height: `${items.length * 100}svh` }} className="relative">
              {items.map((item, i) => (
                <section
                  key={item.title}
                  aria-label={`${item.title}, ${i + 1} of ${items.length}`}
                  className="bg-forest-deep sticky top-0 h-svh w-full overflow-hidden"
                  style={{ zIndex: i + 1 }}
                >
                  <motion.div
                    className="absolute inset-0"
                    initial={{ scale: reduce ? 1 : 1.14 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ root: scroller, amount: 0.4 }}
                    transition={{
                      duration: reduce ? 0 : 1.6,
                      ease: EASE,
                      delay: i === open.index && !reduce ? 0.2 : 0,
                    }}
                  >
                    <Image
                      src={item.image}
                      alt={item.alt}
                      fill
                      sizes="100vw"
                      quality={85}
                      priority={i === open.index}
                      className="object-cover"
                    />
                  </motion.div>
                  <div
                    aria-hidden="true"
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to top, rgba(10,34,27,0.88) 0%, rgba(10,34,27,0.35) 45%, rgba(10,34,27,0.45) 100%)",
                    }}
                  />
                  <span
                    aria-hidden="true"
                    className="font-display pointer-events-none absolute right-[4vw] bottom-[-4vw] leading-none text-white/10 [font-size:clamp(9rem,26vw,24rem)]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>

                  <motion.div
                    className="wrap absolute inset-x-0 bottom-0 pb-[max(5.5rem,12svh)]"
                    initial="hidden"
                    whileInView="show"
                    viewport={{ root: scroller, amount: 0.5 }}
                    variants={{
                      hidden: {},
                      show: {
                        transition: {
                          staggerChildren: reduce ? 0 : 0.1,
                          delayChildren: reduce ? 0 : i === open.index ? 0.7 : 0.3,
                        },
                      },
                    }}
                  >
                    <div className="lg:grid lg:grid-cols-12 lg:items-end lg:gap-x-16">
                      <div className="lg:col-span-7">
                        <motion.p
                          variants={line}
                          className="t-small m-0 tracking-[0.32em] text-white/80 uppercase [font-size:0.75rem]"
                        >
                          {String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}
                        </motion.p>
                        <motion.h3
                          variants={line}
                          className="font-display m-0 mt-4 max-w-[12em] font-normal [font-size:clamp(2.25rem,1.3rem+4vw,5.25rem)] leading-[1.02]"
                        >
                          {item.title}
                        </motion.h3>
                        <motion.p
                          variants={line}
                          className="t-body m-0 mt-5 max-w-[30rem] text-white/90 [font-size:1.125rem] [line-height:1.7]"
                        >
                          {item.text}
                        </motion.p>
                      </div>
                      {item.details?.length || item.note ? (
                        <motion.div
                          variants={line}
                          className="mt-7 border-l border-white/35 pl-6 lg:col-span-5 lg:mt-0"
                        >
                          {item.details?.map((paragraph) => (
                            <p
                              key={paragraph}
                              className="t-body m-0 mb-3 text-white/85 [font-size:0.9375rem] [line-height:1.75]"
                            >
                              {paragraph}
                            </p>
                          ))}
                          {item.note ? <p className="t-small m-0 mt-1 text-white/70">{item.note}</p> : null}
                        </motion.div>
                      ) : null}
                    </div>
                  </motion.div>
                </section>
              ))}
            </div>
          </div>

          {/* Controls sit above the pages. */}
          <button
            ref={closeButton}
            type="button"
            onClick={() => close()}
            aria-label="Close experiences"
            className="absolute top-5 right-5 z-[60] flex h-12 cursor-pointer items-center gap-3 border border-white/60 bg-black/20 px-5 text-[0.75rem] tracking-[0.24em] text-white uppercase backdrop-blur-sm transition-colors duration-300 hover:bg-white hover:text-[#0a221b] focus-visible:bg-white focus-visible:text-[#0a221b] sm:top-8 sm:right-8"
          >
            Close
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>

          <ol
            aria-label="Experiences"
            className="absolute top-1/2 right-5 z-[60] m-0 hidden -translate-y-1/2 list-none flex-col gap-1 p-0 sm:flex sm:right-8"
          >
            {items.map((item, i) => (
              <li key={item.title}>
                <button
                  type="button"
                  aria-label={`Go to ${item.title}`}
                  aria-current={i === page}
                  onClick={() => goTo(i)}
                  className="flex h-6 w-6 cursor-pointer items-center justify-center border-0 bg-transparent p-0"
                >
                  <span
                    className={`block w-[3px] rounded-full bg-white transition-[height,opacity] duration-500 ${
                      i === page ? "h-7 opacity-100" : "h-2 opacity-40"
                    }`}
                  />
                </button>
              </li>
            ))}
          </ol>

          <button
            type="button"
            onClick={() => (page < items.length - 1 ? goTo(page + 1) : leaveDown())}
            aria-label={page < items.length - 1 ? "Next experience" : "Continue to the next section"}
            className="absolute bottom-6 left-1/2 z-[60] flex -translate-x-1/2 cursor-pointer flex-col items-center gap-2 border-0 bg-transparent p-2 text-[0.6875rem] tracking-[0.3em] text-white/80 uppercase transition-colors duration-300 hover:text-white"
          >
            <span>Scroll</span>
            <svg
              viewBox="0 0 24 24"
              className="size-5 animate-bounce"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}
