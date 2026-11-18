"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { DUR, EASE, STAGGER, SCROLL_SPRING } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";
import { useAutoplay } from "@/components/motion/useAutoplay";

const photographs = [
  {
    src: "/images/hero-concept-pool-v1.webp",
    alt: "Illustrative resort concept: infinity pool overlooking a tropical valley",
    label: "Family homestay in Vagamon",
    title: ["Nature’s Beauty, Your Perfect", "Homestay in Vagamon"],
    body: "A perfect mountain escape that gives you luxury, comfort, and breathtaking views. Experience a refreshing homestay in Vagamon with The Mountain Table.",
    cta: "Explore Rooms",
    href: "/rooms-booking",
  },
  {
    src: "/images/hero-concept-veranda-v1.webp",
    alt: "Illustrative resort concept: teak veranda overlooking lush hills",
    label: "A Serene Stay with Us",
    title: ["A View to Remember", "in the Hills"],
    body: "One of the best homestays in Vagamon that can take you to inner chambers of nature, surrounded by the calm mountain.",
    cta: "View All Rooms",
    href: "/rooms-booking",
  },
  {
    src: "/images/hero-concept-dining-v1.webp",
    alt: "Illustrative resort concept: open-air dining pavilion at sunset",
    label: "The Mountain Table",
    title: ["Enjoy Good Food and", "Relaxing Moments"],
    body: "Have a taste of the local cuisines and some relaxed evenings with cosy rooms and a homestay with a swimming pool in Vagamon.",
    cta: "Discover Our Story",
    href: "/about",
  },
  {
    src: "/images/hero-concept-garden-v1.webp",
    alt: "Illustrative resort concept: garden path through tropical greenery",
    label: "Thrills and Tranquillity",
    title: ["Nature and Outdoor Experiences", "in Vagamon"],
    body: "Experience scenic trekking trails, leisurely cycling routes, and slow walks through the plantations around Vagamon. Enjoy a combined experience of indoor relaxation and outdoor adventure during our stay at The Mountain Table.",
    cta: "Explore See & Do",
    href: "/see-do",
  },
];

function subscribeWidth(notify: () => void) {
  window.addEventListener("resize", notify);
  return () => window.removeEventListener("resize", notify);
}

function pickHeroVideo() {
  return window.innerWidth < 750 ? "/videos/vertical_new-v2.mp4" : "/videos/web_banner_new-v2.mp4";
}

export function HomeHero() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [loadedSrc, setLoadedSrc] = useState<string>();
  const section = useRef<HTMLElement>(null);
  const heroVideo = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();
  // Phones get a small portrait cut; chosen after mount so the desktop film is never downloaded on a phone.
  const videoSrc = useSyncExternalStore(subscribeWidth, pickHeroVideo, () => undefined);
  useAutoplay(heroVideo, !reduce);
  // Both hero videos get a loader over their poster; it clears once the browser can start playing it.
  const heroPoster =
    videoSrc === "/videos/vertical_new-v2.mp4"
      ? "/videos/vertical_new-poster.jpg"
      : videoSrc
        ? "/videos/web_banner_new-poster.jpg"
        : undefined;
  const videoLoading = !reduce && !!videoSrc && loadedSrc !== videoSrc;
  useEffect(() => {
    if (!videoLoading || !videoSrc) return;
    const video = heroVideo.current;
    if (video && video.readyState >= 3) {
      setLoadedSrc(videoSrc);
      return;
    }
    // Safety net so a stalled network never blocks the hero for good.
    const timer = window.setTimeout(() => setLoadedSrc(videoSrc), 15000);
    return () => window.clearTimeout(timer);
  }, [videoLoading, videoSrc]);
  const allowScrollMotion = useAllowMotion(750);
  const { scrollYProgress } = useScroll({ target: section, offset: ["start start", "end start"] });
  const departure = useSpring(scrollYProgress, SCROLL_SPRING);
  const copyLift = useTransform(departure, [0, 1], [0, -90]);
  const copyFade = useTransform(departure, [0, 0.8], [1, 0]);
  const photoDrift = useTransform(departure, [0, 1], [0, 100]);
  useEffect(() => {
    if (paused || reduce) return;
    const timer = window.setInterval(() => {
      if (document.hidden || !section.current) return;
      const bounds = section.current.getBoundingClientRect();
      if (bounds.bottom <= 0 || bounds.top >= window.innerHeight) return;
      setActive((value) => (value + 1) % photographs.length);
    }, 4000);
    return () => window.clearInterval(timer);
  }, [paused, reduce, active]);
  const change = (direction: number) =>
    setActive((value) => (value + direction + photographs.length) % photographs.length);

  return (
    <section
      ref={section}
      id="hero"
      className="resort-hero"
      aria-label="Welcome to The Mountain Table"
      onFocusCapture={(e) => setPaused((e.target as HTMLElement).matches(":focus-visible"))}
      onBlurCapture={() => setPaused(false)}
    >
      <motion.div className="resort-hero-photos" style={{ y: allowScrollMotion ? photoDrift : 0 }}>
        <div className="resort-hero-photo" style={{ opacity: 1 }}>
          {reduce ? (
            <Image src={photographs[0].src} alt="" fill sizes="100vw" priority className="object-cover" />
          ) : (
            <video
              ref={heroVideo}
              className="size-full object-cover"
              src={videoSrc}
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={heroPoster}
              aria-hidden="true"
              onCanPlay={() => setLoadedSrc(videoSrc)}
              onError={() => setLoadedSrc(videoSrc)}
            />
          )}
          {videoLoading && (
            <div className="resort-hero-loader" role="status">
              <span className="resort-hero-loader-ring" aria-hidden="true" />
              <span className="sr-only">Loading video</span>
            </div>
          )}
        </div>
      </motion.div>
      <div className="resort-hero-shade" aria-hidden="true" />
      <motion.div
        className="resort-hero-copy wrap"
        style={{
          y: allowScrollMotion ? copyLift : 0,
          opacity: allowScrollMotion ? copyFade : 1,
          justifyContent: "center",
        }}
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
                  textAlign: "center",
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
