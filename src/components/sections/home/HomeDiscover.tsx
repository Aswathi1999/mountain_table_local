"use client";

import { motion, useInView } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { DUR, EASE, STAGGER, VIEW_ONCE } from "@/components/motion/tokens";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { copy } from "@/data/copy";
import { sentenceCase } from "@/lib/text";
import "./HomeDiscover.css";

const discover = {
  lines: ["Where Every Moment", "Feels Extraordinary"],
  body: "From peaceful mornings to starlit evenings, The Mountain Table offers a sanctuary where nature, comfort, and unforgettable experiences come together.",
  cta: "Watch Our Story",
} as const;

export function StoryDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement | null;
      dialog.showModal();
    }
    if (!open && dialog.open) {
      dialog.close();
      opener.current?.focus({ preventScroll: true });
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label="Our story"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="film-dialog m-auto w-[min(92vw,70rem)] max-w-none overflow-visible border-0 bg-transparent p-0 backdrop:bg-[rgba(10,34,27,0.94)]"
    >
      {open ? (
        <div className="relative">
          <video
            className="aspect-video w-full rounded-[6px] bg-black object-cover"
            controls
            autoPlay
            playsInline
            loop
            poster={HOME_FX.video.heroPoster}
          >
            <source src={HOME_FX.video.film} type="video/mp4" />
            <source src={HOME_FX.video.filmFallback} type="video/quicktime" />
            <source src={HOME_FX.video.filmFallback} type="video/mp4" />
          </video>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close video"
            className="bg-ivory text-forest-deep hover:bg-gold absolute -top-14 right-0 flex size-10 cursor-pointer items-center justify-center rounded-full border-0 transition-colors duration-300 active:scale-95"
          >
            <svg
              viewBox="0 0 24 24"
              className="size-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path d="M6 6l12 12M18 6L6 18" />
            </svg>
          </button>
        </div>
      ) : null}
    </dialog>
  );
}

/** Muted ambient loop that only plays while it is on screen, and stays on its poster with reduced motion. */
function AmbientFilm({ still }: { still: boolean }) {
  const ref = useRef<HTMLVideoElement>(null);
  const seen = useInView(ref, { amount: 0.25 });
  useEffect(() => {
    const video = ref.current;
    if (!video || still) return;
    if (seen) void video.play().catch(() => undefined);
    else video.pause();
  }, [seen, still]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload={still ? "none" : "metadata"}
      poster={HOME_FX.video.heroPoster}
      aria-hidden="true"
      tabIndex={-1}
    >
      <source src="/videos/discover-v1.mp4" type="video/mp4" />
    </video>
  );
}

export function HomeDiscover() {
  const [story, setStory] = useState(false);
  const reduce = useReducedMotion();
  const copyRef = useRef<HTMLDivElement>(null);
  const seen = useInView(copyRef, VIEW_ONCE);
  const dur = (n: number) => (reduce ? 0 : n);

  const rise = (i: number) => ({
    "data-motion": "",
    initial: { opacity: 0, y: reduce ? 0 : 16 },
    animate: seen || reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: reduce ? 0 : 16 },
    transition: { duration: dur(DUR.ui + 0.2), ease: EASE, delay: dur(STAGGER.base * i) },
  });

  return (
    <section id="discover" aria-labelledby="discover-title" className="discover-band">
      <div className="discover-band-inner">
        <motion.div
          data-motion=""
          className="discover-media"
          initial={{ opacity: 0.001, scale: reduce ? 1 : 1.05 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={VIEW_ONCE}
          transition={{ duration: dur(DUR.image), ease: EASE }}
        >
          <AmbientFilm still={reduce} />
        </motion.div>

        <div ref={copyRef} className="discover-copy">
          <motion.p {...rise(0)} className="discover-label">
            {sentenceCase(copy.home.discoverTitle)}
          </motion.p>
          <motion.h2 {...rise(1)} id="discover-title">
            {discover.lines[0]}
            <em>{discover.lines[1]}</em>
          </motion.h2>
          <motion.p {...rise(2)} className="discover-description">
            {discover.body}
          </motion.p>
          <motion.button {...rise(3)} type="button" className="discover-story-button" onClick={() => setStory(true)}>
            {discover.cta}
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          </motion.button>
        </div>
      </div>
      <StoryDialog open={story} onClose={() => setStory(false)} />
    </section>
  );
}
