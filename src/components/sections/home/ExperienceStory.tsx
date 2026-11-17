"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { DUR, EASE, SCROLL_SPRING, STAGGER } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useAutoplay } from "@/components/motion/useAutoplay";

import { ExperienceViewer, type OpenFrom } from "./ExperienceViewer";
import "./ExperienceStory.css";
const experiences = [
  {
    title: "Infinity Pool",
    text: "An infinity pool with the majestic view of the hills.",
    details: ["Take a refreshing dip in our infinity pool overlooking the hills and enjoy the unforgettable panoramic sight of the misty hills and meadows that can refresh your mind and soul."],
    image: "/images/experience-pool-expand-v2.jpg",
    video: "/videos/experience-pool-v2.mp4",
    alt: "An infinity pool looking out over green hills and a blue sky",
  },
  {
    title: "Luxurious Rooms",
    text: "Comfortable stay in Vagamon with stunning views",
    details: [
      "Your relaxing vacation could be backed with comfortable rooms in our homestay in Uluppuni. Each of our rooms has to offer unforgettable views of the misty hills. With carefully curated cosy ambience and modern amenities, you can step into comfort and peace.",
      "A calm day where you wake up to the sound of morning birds and rustling leaves, forgetting all the worries and deadlines of your everyday life.",
    ],
    image: "/images/experience-room-expand-v2.jpg",
    video: "/videos/experience-rooms-v2.mp4",
    alt: "A bedroom with a wooden bed and a window onto greenery",
  },
  {
    title: "Fine Dining",
    text: "Locally inspired cuisine for your palette",
    details: ["Delicacies from the heart of Kerala for your stay. We provide complimentary breakfasts where you will get to savour the regional flavours curated by our chef."],
    image: "/images/experience-dining-expand-v2.jpg",
    video: "/videos/experience-dining-v2.mp4",
    alt: "Sliced fresh pineapple served on a white plate",
  },
  {
    title: "Nature & Adventure",
    text: "The beauty of Vagamon is all around me.",
    details: ["With the lush garden and tea plantations, you can explore the tranquillity and calmness in the Uluppuni hills in Vagamon."],
    image: "/images/experience-adventure-expand-v2.jpg",
    video: "/videos/experience-adventure-v2.mp4",
    alt: "A jeep on a red dirt track through green grassy hills, seen from above",
  },
  {
    title: "Jeep Safari (On Request)",
    text: "Unleash Adventure, Discover Nature",
    details: ["Have a thrilling Jeep safari in Vagamon through the deeper side of nature. The journey starts from the Vagamon Viewpoint for the panoramic view of the hill and tea plantations. Covering the intriguing Vellaramchitta Tunnel, dam views, and off-road ride through the rugged terrain, you will have an unforgettable experience in this natural setup."],
    note: "Extra Charges Apply",
    image: "/images/experience-safari-expand-v2.jpg",
    video: "/videos/experience-safari-v2.mp4",
    alt: "A jeep crossing a shallow forest stream, reflected in the dark water",
  },
  {
    title: "Trekking (On Request)",
    text: "A Rush of Adrenaline with the Hills",
    details: ["Wake up for an adventure by trekking through the forest and near by mountains that can bring out your energy."],
    image: "/images/see_and_do/Mottakunnu-v2.jpg",
    alt: "Green grassy hills and a small lake at Mottakunnu",
  },
  {
    title: "BBQ & Music",
    text: "Sizzle, Strum, Stars",
    details: ["Our stay offers a starry experience with evening BBQ and music. Live music, delicious grilled dishes, and the calmness of the cool night can transform your night into an experience that can stay with you forever."],
    image: "/images/experience-bbq-expand-v2.jpg",
    video: "/videos/experience-bbq-v2.mp4",
    alt: "Grilled barbecue chicken served on a white plate with fresh vegetable garnish",
  },
];
function CardVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);
  useAutoplay(ref);
  // Only start downloading a card's video once it is close to the screen, so the six clips (5-16 MB each) don't compete with the hero.
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    const observer = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setNear(true); observer.disconnect(); } }, { rootMargin: "300px 600px" });
    observer.observe(video);
    return () => observer.disconnect();
  }, []);
  return <video ref={ref} className="size-full object-cover" src={near ? src : undefined} autoPlay muted loop playsInline preload={near ? "auto" : "none"} aria-hidden="true" />;
}
export function ExperienceStory() {
  const [viewer, setViewer] = useState<OpenFrom | null>(null);
  const closeViewer = useCallback(() => setViewer(null), []);
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
        <motion.p data-motion="" style={{ y: allowMotion ? eyebrowY : 0, opacity: allowMotion ? eyebrowOpacity : 1 }} className={"mt-exp-eyebrow"}><span aria-hidden="true" />The Experience</motion.p>
        <motion.h2 data-motion="" style={{ y: allowMotion ? titleY : 0, opacity: allowMotion ? titleOpacity : 1 }} id="experience-title" className="t-h2">More Than Just a Stay –<br /><em>A Complete Nature Experience</em></motion.h2>
        <motion.p data-motion="" style={{ y: allowMotion ? descriptionY : 0, opacity: allowMotion ? descriptionOpacity : 1 }} className={"mt-exp-description"}>We always try to create moments that will last with you forever. The Mountain Table has arranged for you a complete de-stress experience with cosy accommodation and premium dining that can bring you joy and comfort.</motion.p>
      </div>
      <div ref={gallery} className="flow-root">
      <motion.div data-motion="" style={{ y: allowMotion ? galleryY : 0, opacity: allowMotion ? galleryOpacity : 1 }}>
      <div ref={track} className={"mt-exp-track"} role="region" aria-label="Experiences gallery" tabIndex={0} onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }}>
        {experiences.map((item, index) => (
          <article key={item.title} className={"mt-exp-card"} data-experience-card="">
            <motion.div
              data-motion=""
              className="mt-exp-card-surface"
              initial={{ opacity: allowMotion ? 0 : 1, y: allowMotion ? arrival.cardRise * distance : 0 }}
              whileInView={{ opacity: 1, y: 0 }}
              animate={allowMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ amount: 0.2 }}
              transition={{ duration: allowMotion ? DUR.reveal : 0, ease: EASE, delay: allowMotion ? (index % 3) * STAGGER.tight : 0 }}
            >
            <div className={"mt-exp-photo"} data-experience-photo>{"video" in item && item.video && !reduced ? <CardVideo src={item.video} /> : <Image src={item.image} alt={item.alt} fill sizes="(min-width: 1407px) 450px, (min-width: 844px) 32vw, 270px" className="object-cover" />}</div>
            <button
              type="button"
              className="mt-exp-open"
              aria-haspopup="dialog"
              aria-label={`Open ${item.title} full screen`}
              onClick={(event) => setViewer({ index, rect: event.currentTarget.closest("article")?.getBoundingClientRect() ?? null })}
            />
            <span aria-hidden="true" className={"mt-exp-number"}>{String(index + 1).padStart(2, "0")}</span>
            <span aria-hidden="true" className={"mt-exp-counter"}>{String(index + 1).padStart(2, "0")} / {String(experiences.length).padStart(2, "0")}</span>
            <div className={"mt-exp-caption"}>
              <h3>{item.title}</h3>
              <div className={"mt-exp-details"}>
                <p>{item.text}</p>
                {"note" in item && item.note && <p>{item.note}</p>}
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
      <ExperienceViewer items={experiences} open={viewer} onClose={closeViewer} />
    </section>
  );
}
