"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { DUR, EASE, SCROLL_SPRING, SETTLE_SCALE, STAGGER } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { copy } from "@/data/copy";
import { roomLayouts } from "@/data/rooms";

/** The three room photographs used on the home page's rooms slider, one per room. */
const photographs = [
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

/**
 * Rooms & Booking hero, built like the home page hero: a full-screen slideshow of the room photographs (cross-fading with a
 * slight settle, drifting as the page scrolls away) under a soft shade, with the copy centred at the bottom and dots, a pause
 * button and arrows. The title and introduction are the page's existing copy and stay put; the small label above them names the
 * room in view. The slideshow advances by itself, and holds on hover or focus, when paused, and with reduced motion.
 */
export function RoomsHero() {
  const [first, second] = copy.rooms.titleLines;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const section = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const allowScrollMotion = useAllowMotion(750);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const departure = useSpring(scrollYProgress, SCROLL_SPRING);
  const copyLift = useTransform(departure, [0, 1], [0, -90]);
  const copyFade = useTransform(departure, [0, 0.8], [1, 0]);
  const photoDrift = useTransform(departure, [0, 1], [0, 100]);

  useEffect(() => {
    if (paused || hovered || reduce) return;
    const timer = window.setInterval(() => {
      if (document.hidden || !section.current) return;
      const bounds = section.current.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      setActive((value) => (value + 1) % photographs.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [paused, hovered, reduce, active]);

  const change = (direction: number) =>
    setActive((value) => (value + direction + photographs.length) % photographs.length);
  const enter = (step: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: reduce ? 0 : DUR.reveal, delay: reduce ? 0 : 0.2 + step * STAGGER.base, ease: EASE },
  });

  return (
    <section
      ref={section}
      id="intro"
      aria-labelledby="rooms-title"
      className="resort-hero"
      style={{ height: "calc(100svh - 84px)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div className="resort-hero-photos" aria-hidden="true" style={{ y: allowScrollMotion ? photoDrift : 0 }}>
        {photographs.map((photo, index) => (
          <motion.div
            key={photo.src}
            className="resort-hero-photo"
            initial={false}
            animate={{ opacity: active === index ? 1 : 0, scale: reduce ? 1 : active === index ? 1 : SETTLE_SCALE }}
            transition={{
              opacity: { duration: reduce ? 0 : 1.1, ease: EASE },
              scale: { duration: reduce ? 0 : 5, ease: "linear" },
            }}
          >
            <Image
              src={photo.src}
              alt=""
              fill
              sizes="(max-width: 749px) 1200px, 100vw"
              quality={85}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
              className="object-cover"
            />
          </motion.div>
        ))}
      </motion.div>
      <div className="resort-hero-shade" aria-hidden="true" />

      <motion.div
        className="resort-hero-copy wrap"
        style={{ y: allowScrollMotion ? copyLift : 0, opacity: allowScrollMotion ? copyFade : 1 }}
      >
        <motion.p className="t-small" aria-live="polite" {...enter(0)}>
          Stay with us · {roomLayouts[active].name}
        </motion.p>
        <motion.h1
          id="rooms-title"
          className="t-h1"
          style={{
            fontSize: "clamp(2.1rem, 3.6vw, 4.2rem)",
            lineHeight: 1.08,
            margin: "18px 0 24px",
            color: "inherit",
          }}
          {...enter(1)}
        >
          {first}
          <br />
          {second}
        </motion.h1>
        <motion.p className="t-body resort-hero-description" {...enter(2)}>
          {copy.rooms.intro}
        </motion.p>
        <motion.div {...enter(3)}>
          <BookNowButton href="/contact" />
        </motion.div>
      </motion.div>

      <div className="resort-hero-controls wrap">
        <div className="resort-hero-dots" aria-label="Choose a room photograph">
          {photographs.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              aria-label={`Show ${roomLayouts[index].name} photograph`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <div className="resort-hero-arrows">
          {!reduce && (
            <button
              data-slideshow-toggle
              type="button"
              aria-label={paused ? "Play slideshow" : "Pause slideshow"}
              onClick={() => setPaused((value) => !value)}
            >
              <span aria-hidden="true">{paused ? "▶" : "Ⅱ"}</span>
            </button>
          )}
          <button type="button" aria-label="Previous photograph" onClick={() => change(-1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m14 4-8 8 8 8" />
            </svg>
          </button>
          <button type="button" aria-label="Next photograph" onClick={() => change(1)}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="m10 4 8 8-8 8" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
