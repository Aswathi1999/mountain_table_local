"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { DUR, EASE, STAGGER, SCROLL_SPRING } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";

const photographs = [
  {
    src: "/images/hero-concept-pool-v1.webp",
    alt: "Illustrative resort concept: infinity pool overlooking a tropical valley",
    label: "A luxury mountain escape",
    title: ["Nature’s Beauty,", "Your Perfect Stay"],
    body: "Experience the perfect blend of luxury, comfort, and breathtaking views at The Mountain Table. Your mountain escape awaits.",
    cta: "Explore Rooms",
    href: "/rooms-booking",
  },
  {
    src: "/images/hero-concept-veranda-v1.webp",
    alt: "Illustrative resort concept: teak veranda overlooking lush hills",
    label: "Stay with us",
    title: ["Rooms With a View", "to Remember"],
    body: "Find your mountain escape in cosy rooms surrounded by the serene hills of Vagamon.",
    cta: "View All Rooms",
    href: "/rooms-booking",
  },
  {
    src: "/images/hero-concept-dining-v1.webp",
    alt: "Illustrative resort concept: open-air dining pavilion at sunset",
    label: "The Mountain Table",
    title: ["Good Food,", "Unhurried Moments"],
    body: "Enjoy local cuisine and relaxed evenings as part of your stay in the hills.",
    cta: "Discover Our Story",
    href: "/about",
  },
  {
    src: "/images/hero-concept-garden-v1.webp",
    alt: "Illustrative resort concept: garden path through tropical greenery",
    label: "Thrills and Tranquility",
    title: ["Step Outside,", "Explore Vagamon"],
    body: "Discover scenic trekking trails, leisurely cycling routes, and plantation walks around Vagamon.",
    cta: "Explore See & Do",
    href: "/see-do",
  },
];

export function HomeHero() {
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
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, hovered, reduce, active]);
  const change = (direction: number) =>
    setActive((value) => (value + direction + photographs.length) % photographs.length);

  return (
    <section
      ref={section}
      id="hero"
      className="resort-hero"
      aria-label="Welcome to The Mountain Table"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <motion.div className="resort-hero-photos" style={{ y: allowScrollMotion ? photoDrift : 0 }}>
        <div className="resort-hero-photo" style={{ opacity: 1 }}>
          {reduce ? (
            <Image src={photographs[0].src} alt="" fill sizes="100vw" priority className="object-cover" />
          ) : (
            <video
              className="size-full object-cover"
              src="/videos/web-banner.mp4"
              poster="/images/hero-banner-poster-v1.webp"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              aria-hidden="true"
            />
          )}
        </div>
      </motion.div>
      <div className="resort-hero-shade" aria-hidden="true" />
      <motion.div
        className="resort-hero-copy wrap"
        style={{ y: allowScrollMotion ? copyLift : 0, opacity: allowScrollMotion ? copyFade : 1 }}
      >
        <h1 className="sr-only">The Mountain Table — A luxury mountain escape</h1>
        <div style={{ display: "grid", width: "100%" }}>
          {photographs.map((photo, index) => {
            const selected = active === index;
            const enter = (step: number) => ({
              initial: false as const,
              animate: { opacity: selected ? 1 : 0, y: reduce ? 0 : selected ? 0 : 24 },
              transition: {
                duration: reduce ? 0 : selected ? DUR.reveal : DUR.micro,
                delay: reduce || !selected ? 0 : step * STAGGER.base,
                ease: EASE,
              },
            });
            return (
              <div
                key={photo.src}
                aria-hidden={!selected}
                inert={!selected}
                style={{
                  gridArea: "1 / 1",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  pointerEvents: selected ? "auto" : "none",
                }}
              >
                <motion.p className="t-small" {...enter(0)}>
                  {photo.label}
                </motion.p>
                <motion.h2
                  className="t-h1"
                  style={{
                    fontSize: "clamp(2.4rem, 4.1vw, 4.8rem)",
                    lineHeight: 1.08,
                    margin: "18px 0 24px",
                    color: "inherit",
                  }}
                  {...enter(1)}
                >
                  {photo.title[0]}
                  <br />
                  {photo.title[1]}
                </motion.h2>
                <motion.p className="t-body resort-hero-description" {...enter(2)}>
                  {photo.body}
                </motion.p>
                <motion.div {...enter(3)}>
                  <Link href={photo.href} className="btn btn-line-light">
                    {photo.cta}
                  </Link>
                </motion.div>
              </div>
            );
          })}
        </div>
      </motion.div>
      <div className="resort-hero-controls wrap">
        <div className="resort-hero-dots" aria-label="Choose a photograph">
          {photographs.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              aria-label={`Show photograph ${index + 1}: ${photo.alt}`}
              aria-pressed={active === index}
              onClick={() => setActive(index)}
            >
              <span />
            </button>
          ))}
        </div>
        <span className="sr-only" aria-live={paused || reduce ? "polite" : "off"}>
          Slide {active + 1} of {photographs.length}: {photographs[active].title.join(" ")}
        </span>
        <div className="resort-hero-arrows">
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
