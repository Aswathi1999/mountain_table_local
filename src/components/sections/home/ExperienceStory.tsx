"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { DUR, EASE, SCROLL_SPRING, STAGGER } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";

import { copy } from "@/data/copy";
import "./ExperienceStory.css";
const experiences = [
  { title: "Luxurious Rooms", text: "Comfortable stays with stunning views.", image: "/images/experience-concept-room-v1.webp", alt: "Illustrative concept: a timber suite overlooking misty hills" },
  { title: "Fine Dining", text: "Savor locally inspired cuisine.", image: "/images/hero-concept-dining-v1.webp", alt: "Illustrative concept: an open-air dining pavilion at sunset" },
  { title: "Nature & Adventure", text: "Explore the beauty around you.", image: "/images/experience-concept-hiking-v1.webp", alt: "Illustrative concept: a hiker exploring a green mountain trail" },
  { title: "Infinity Pool", text: "The infinity pool overlooking the hills.", image: "/images/hero-concept-pool-v1.webp", alt: "Illustrative concept: an infinity pool above a tropical valley" },
  ...([{ index: 0, name: "safari", alt: "a safari vehicle in tea gardens" }, { index: 2, name: "cycling", alt: "a bicycle beside a tea plantation trail" }, { index: 4, name: "bbq", alt: "a barbecue terrace with an acoustic guitar at dusk" }]).map(({ index, name, alt }) => ({ title: copy.seeDo.activities[index].title, text: copy.seeDo.activities[index].subtitle, note: index === 0 ? "Extra charges apply." : undefined, image: `/images/experience-concept-${name}-v1.webp`, alt: `Illustrative concept: ${alt}` })),
];
export function ExperienceStory() {
  const section = useRef<HTMLElement>(null);
  const gallery = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const arrival = HOME_FX.experienceArrival;
  const allowMotion = !reduced && arrival.enabled;
  const wide = useAllowMotion(750);
  const distance = wide ? 1 : arrival.mobileFactor;
  const { scrollYProgress: headingProgress } = useScroll({ target: section, offset: ["start 95%", "start 35%"] });
  const { scrollYProgress: galleryProgress } = useScroll({ target: gallery, offset: ["start 100%", "start 65%"] });
  const headingArrival = useSpring(headingProgress, SCROLL_SPRING);
  const galleryArrival = useSpring(galleryProgress, SCROLL_SPRING);
  const eyebrowY = useTransform(headingArrival, [0, 0.55], [arrival.headingRise * distance, 0]);
  const eyebrowOpacity = useTransform(headingArrival, [0, 0.45], [0, 1]);
  const titleY = useTransform(headingArrival, [0.1, 0.8], [arrival.headingRise * distance, 0]);
  const titleOpacity = useTransform(headingArrival, [0.1, 0.65], [0, 1]);
  const descriptionY = useTransform(headingArrival, [0.2, 1], [arrival.headingRise * distance, 0]);
  const descriptionOpacity = useTransform(headingArrival, [0.2, 0.85], [0, 1]);
  const galleryY = useTransform(galleryArrival, [0, 1], [arrival.galleryRise * distance, 0]);
  const galleryOpacity = useTransform(galleryArrival, [0, 0.8], [0, 1]);

  useEffect(() => {
    const viewport = track.current;
    if (!viewport) return;
    const cards = Array.from(viewport.querySelectorAll<HTMLElement>("article"));
    let frame = 0;
    const paint = () => {
      frame = 0;
      const center = viewport.scrollLeft + viewport.clientWidth / 2;
      const positions = cards.map((card) => Math.max(-1, Math.min(1, (card.offsetLeft + card.offsetWidth / 2 - center) / (viewport.clientWidth / 2 + card.offsetWidth / 2))));
      cards.forEach((card, index) => {
        const position = reduced ? 0 : positions[index];
        card.style.transform = `perspective(1100px) translateZ(${-Math.abs(position) * 80}px) rotateY(${-position * 14}deg) scale(${1 - Math.abs(position) * 0.1})`;
        const photo = card.querySelector<HTMLElement>("[data-experience-photo]");
        if (photo) photo.style.transform = reduced ? "none" : `translateX(${-position * 28}px) scale(1.18)`;
      });
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const observer = new ResizeObserver(schedule);
    observer.observe(viewport);
    cards.forEach((card) => observer.observe(card));
    viewport.addEventListener("scroll", schedule, { passive: true });
    schedule();
    return () => { observer.disconnect(); viewport.removeEventListener("scroll", schedule); cancelAnimationFrame(frame); };
  }, [reduced]);

  const move = (direction: number) => {
    const viewport = track.current;
    const card = viewport?.querySelector("article");
    if (viewport && card) viewport.scrollBy({ left: direction * (card.clientWidth + 28), behavior: reduced ? "instant" : "smooth" });
  };

  return (
    <section ref={section} id="intro" aria-labelledby="experience-title" className={"mt-exp-section"}>
      <div className={`wrap ${"mt-exp-heading"}`}>
        <motion.p data-motion="" style={{ y: allowMotion ? eyebrowY : 0, opacity: allowMotion ? eyebrowOpacity : 1 }} className={"mt-exp-eyebrow"}><span aria-hidden="true" />The experience</motion.p>
        <motion.h2 data-motion="" style={{ y: allowMotion ? titleY : 0, opacity: allowMotion ? titleOpacity : 1 }} id="experience-title" className="t-h2">More Than a Stay,<br /><em>It’s an Experience</em></motion.h2>
        <motion.p data-motion="" style={{ y: allowMotion ? descriptionY : 0, opacity: allowMotion ? descriptionOpacity : 1 }} className={"mt-exp-description"}>At The Mountain Table, we believe in creating moments that stay with you forever. From cozy accommodations to unforgettable dining, every detail is designed for your comfort and joy.</motion.p>
      </div>
      <div ref={gallery} className="flow-root">
      <motion.div data-motion="" style={{ y: allowMotion ? galleryY : 0, opacity: allowMotion ? galleryOpacity : 1 }}>
      <div ref={track} className={"mt-exp-track"} role="region" aria-label="Experiences gallery" tabIndex={0} onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }}>
        {experiences.map((item, index) => (
          <article key={item.title} className={"mt-exp-card"}>
            <motion.div
              data-motion=""
              className="mt-exp-card-surface"
              initial={{ opacity: allowMotion ? 0 : 1, y: allowMotion ? arrival.cardRise * distance : 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              animate={allowMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: allowMotion ? DUR.reveal : 0, ease: EASE, delay: allowMotion ? (index % 3) * STAGGER.tight : 0 }}
            >
            <div className={"mt-exp-photo"} data-experience-photo><Image src={item.image} alt={item.alt} fill sizes="(min-width: 1407px) 450px, (min-width: 844px) 32vw, 270px" className="object-cover" /></div>
            <div className={"mt-exp-shade"} />
            <span aria-hidden="true" className={"mt-exp-number"}>{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className={"mt-exp-counter"}>{String(index + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}</span>
            <div className={"mt-exp-caption"}>
              <h3>{item.title}</h3>
              <div className={"mt-exp-details"}>
                <p>{item.text}</p>
                {"note" in item && item.note && <p>{item.note}</p>}
                <Link href="/see-do" className="link-u">Discover More<span className="sr-only">: {item.title}</span></Link>
              </div>
              <span className={"mt-exp-rule"} aria-hidden="true" />
            </div>
            </motion.div>
          </article>
        ))}
      </div>
      <div className={`wrap ${"mt-exp-controls"}`}>
        <span className="t-small">Explore our experiences</span>
        <div><button type="button" aria-label="Previous experiences" onClick={() => move(-1)}>←</button><button type="button" aria-label="Next experiences" onClick={() => move(1)}>→</button></div>
      </div>
      </motion.div>
      </div>
    </section>
  );
}
