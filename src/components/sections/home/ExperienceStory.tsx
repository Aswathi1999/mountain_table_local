"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef, useState, useSyncExternalStore } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { Drift, Lines, Reveal } from "@/components/motion/primitives";
import { DUR, EASE, EASE_REVEAL, SCROLL_SPRING, VIEW_ONCE } from "@/components/motion/tokens";
import { useHomeFx } from "@/components/motion/useHomeFx";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { Disc, GoldArch, LeafSprig } from "@/components/ui/decor";

/** Experience section copy, as set in the approved design reference. */
const experience = {
  eyebrow: "The experience",
  lines: ["More Than a Stay,", "It’s an Experience"],
  body: "At The Mountain Table, we believe in creating moments that stay with you forever. From cozy accommodations to unforgettable dining, every detail is designed for your comfort and joy.",
  items: [
    { icon: "/icons/bed.svg", title: "Luxurious Rooms", text: "Comfortable stays with stunning views." },
    { icon: "/icons/breakfast.svg", title: "Fine Dining", text: "Savor locally inspired cuisine." },
    { icon: "/icons/hills.svg", title: "Nature & Adventure", text: "Explore the beauty around you." },
  ],
  link: "Discover More",
  signature: ["Stay", "Relax", "Explore"],
} as const;

/** The photographs for each step: a large one and a smaller one that overlaps its lower-left corner (all existing site photos). */
const STEPS = [
  {
    main: {
      src: "/images/the_experiance_1.png",
      alt: "A lounge with a wooden ceiling and glass walls looking out over the mountains",
      position: "46% 50%",
    },
    small: {
      src: "/images/the_experiance_2.png",
      alt: "A timber-clad bedroom with a bed facing a mountain-view terrace",
      position: "30% 50%",
    },
  },
  {
    main: {
      src: "/images/c18256_4f1a87a5cd434f3e869c7e16b058f9b1.jpg",
      alt: "The dining area with a long wooden table",
      position: "40% 50%",
    },
    small: {
      src: "/images/about/dinner.jpg",
      alt: "A candlelit dinner table set with wine glasses",
      position: "50% 55%",
    },
  },
  {
    main: {
      src: "/images/8daf94f88f524d8cb168d8004c1fe282.jpg",
      alt: "A hiker above the mist on the Vagamon trail",
      position: "50% 40%",
    },
    small: {
      src: "/images/c18256_9bf951b03ba94f55a8d71c9ad2cd5249.jpg",
      alt: "A stone path through the tea plantation",
      position: "50% 50%",
    },
  },
] as const;

const tallEnough = (subscribe: (cb: () => void) => () => void) => subscribe;
function useMinHeight(px: number) {
  return useSyncExternalStore(
    tallEnough((cb) => {
      window.addEventListener("resize", cb);
      return () => window.removeEventListener("resize", cb);
    }),
    () => window.innerHeight >= px,
    () => false,
  );
}

/** "Stay, Relax, Explore" written live: each word's outline draws itself, then fills. Plain text without motion. */
function Handwriting({ allowed }: { allowed: boolean }) {
  const words = experience.signature;
  return (
    <svg
      viewBox={`0 0 190 ${words.length * 46 + 10}`}
      aria-hidden="true"
      role="presentation"
      className="text-clay absolute bottom-[1%] left-[46%] h-auto w-[8.5rem] -rotate-6 overflow-visible lg:w-[10.5rem]"
    >
      {words.map((w, i) => (
        <motion.text
          key={w}
          x={i * 14 + 4}
          y={(i + 1) * 44}
          fontSize={40}
          stroke="currentColor"
          strokeWidth="0.9"
          strokeLinejoin="round"
          strokeDasharray="520"
          fill="currentColor"
          style={{ fontFamily: "var(--font-script)", fontWeight: 500 }}
          initial={allowed ? { strokeDashoffset: 520, fillOpacity: 0 } : false}
          whileInView={{ strokeDashoffset: 0, fillOpacity: 1 }}
          viewport={VIEW_ONCE}
          transition={{
            strokeDashoffset: { duration: 2.2, ease: "easeInOut", delay: 0.7 + i * 0.7 },
            fillOpacity: { duration: 0.8, ease: "easeOut", delay: 0.7 + i * 0.7 + 1.6 },
          }}
        >
          {w}
        </motion.text>
      ))}
    </svg>
  );
}

/**
 * The Experience as a pinned photo story. On wide screens the section stays on screen for about 150% of a viewport of scrolling;
 * in that time the photographs change three times (rooms, dining, nature) with a soft wipe, the matching feature row lights up
 * (its icon circle fills with green, the others dim) and a gold line beside the rows fills with the scroll. On narrow screens, with
 * reduced motion or without JavaScript it is an ordinary section: the first photographs and all three rows at full strength.
 * Settings: `HOME_FX.experience`.
 */
export function ExperienceStory() {
  const on = useHomeFx("experience");
  const tall = useMinHeight(640);
  const pinned = on && tall;
  const wrapRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const fill = useSpring(useTransform(scrollYProgress, [0.02, 0.98], [0, 1]), SCROLL_SPRING);
  const [step, setStep] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!pinned) return;
    const next = v < 0.34 ? 0 : v < 0.67 ? 1 : 2;
    setStep((s) => (s === next ? s : next));
  });
  const activeStep = pinned ? step : 0;
  const lit = (i: number) => !pinned || i === step;

  return (
    <section
      ref={wrapRef}
      id="intro"
      aria-labelledby="experience-title"
      className="bg-ivory relative"
      style={pinned ? { height: `${100 + HOME_FX.experience.pinVh}vh` } : undefined}
    >
      <div
        className={
          pinned
            ? "sticky top-0 flex h-svh items-center overflow-hidden pt-[84px]"
            : "overflow-hidden pt-6 pb-20 desk:pb-32"
        }
      >
        <div className="wrap grid w-full items-center gap-16 lg:grid-cols-12 lg:gap-x-16">
          <div className="relative mx-auto w-full max-w-[34rem] pt-6 pb-24 lg:col-span-6 lg:mx-0 lg:max-w-[36rem] lg:pb-28">
            <Drift x={-24} y={0} className="absolute bottom-[14%] left-0 size-[34%]">
              <Disc className="bg-ivory-deep inset-0" />
            </Drift>
            <Drift y={24} delay={0.2} className="absolute top-[10%] left-[4%] h-[30%] w-[12%] -rotate-[14deg]">
              <LeafSprig className="leaf-sway text-forest/80 h-full w-auto" />
            </Drift>
            <Drift x={24} y={0} delay={0.15} className="absolute top-[18%] right-0 h-[58%] w-[17%]">
              <GoldArch className="inset-0" />
            </Drift>

            <Reveal className="relative grid" y={26}>
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.main.src}
                  className="relative [grid-area:1/1]"
                  data-cursor="view"
                  initial={false}
                  animate={{ clipPath: i <= activeStep ? "inset(0% 0% 0% 0%)" : "inset(100% 0% 0% 0%)" }}
                  transition={{ duration: HOME_FX.experience.wipe, ease: EASE_REVEAL }}
                  style={{ zIndex: i, pointerEvents: i === activeStep ? "auto" : "none" }}
                  aria-hidden={i === activeStep ? undefined : true}
                >
                  <div className="relative mr-[12%] ml-[24%] aspect-[4/5] overflow-hidden rounded-[4px] shadow-[0_30px_60px_rgba(20,42,33,0.16)]">
                    <Image
                      src={s.main.src}
                      alt={s.main.alt}
                      fill
                      sizes="(min-width: 1280px) 460px, (min-width: 1024px) 38vw, 80vw"
                      className="object-cover"
                      style={{ objectPosition: s.main.position }}
                      priority={i === 0}
                    />
                  </div>
                  <div className="absolute bottom-[14%] left-[8%] w-[37%]">
                    <div className="relative aspect-[1.15/1] w-full overflow-hidden rounded-[5px] border-[4px] border-white shadow-[0_20px_44px_rgba(20,42,33,0.28)]">
                      <Image
                        src={s.small.src}
                        alt={s.small.alt}
                        fill
                        sizes="(min-width: 1024px) 15vw, 30vw"
                        className="object-cover"
                        style={{ objectPosition: s.small.position }}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </Reveal>
            <Handwriting allowed={on} />
          </div>

          <div className="lg:col-span-6">
            <Reveal>
              <p className="t-eyebrow text-forest">{experience.eyebrow}</p>
            </Reveal>
            <Lines
              id="experience-title"
              as="h2"
              lines={experience.lines}
              className="t-h2 text-forest m-0 mt-4 [font-size:clamp(2rem,1.3rem+2.1vw,3.125rem)]"
            />
            <Reveal delay={0.1} className="mt-5">
              <p className="t-body text-ink/70 m-0 max-w-[30em] [font-size:0.9375rem] [line-height:1.7]">
                {experience.body}
              </p>
            </Reveal>

            <div className="relative mt-7 pl-7">
              <span
                aria-hidden="true"
                className="bg-gold/25 absolute top-1 bottom-1 left-0 block w-[2px] rounded-full"
              />
              <motion.span
                aria-hidden="true"
                className="bg-gold absolute top-1 bottom-1 left-0 block w-[2px] origin-top rounded-full"
                style={{ scaleY: pinned ? fill : 1 }}
              />
              <ul className="m-0 grid list-none gap-5 p-0">
                {experience.items.map((item, i) => {
                  const active = lit(i);
                  return (
                    <li
                      key={item.title}
                      className="group flex items-center gap-5 transition-opacity duration-500"
                      style={{ opacity: active ? 1 : 0.38 }}
                      aria-current={pinned && i === step ? "step" : undefined}
                    >
                      <span
                        className={`flex size-[3.25rem] shrink-0 items-center justify-center rounded-full border transition-colors duration-500 ${
                          pinned && active
                            ? "bg-forest border-forest"
                            : "bg-ivory-deep border-gold/40 group-hover:bg-gold/25"
                        }`}
                      >
                        <Image
                          src={item.icon}
                          alt=""
                          width={30}
                          height={30}
                          className={`size-[1.625rem] object-contain transition-[filter,transform] duration-500 group-hover:-translate-y-0.5 ${
                            pinned && active ? "invert" : ""
                          }`}
                        />
                      </span>
                      <span className="min-w-0">
                        <span className="t-h4 text-forest block [font-size:1.3125rem]">{item.title}</span>
                        <span className="t-small text-ink/65 mt-0.5 block [font-size:0.8125rem]">{item.text}</span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <motion.div
              data-motion=""
              className="mt-8"
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={VIEW_ONCE}
              transition={{ duration: DUR.reveal, ease: EASE, delay: 0.2 }}
            >
              <Link href="/about" className="group t-ui link-u text-forest inline-flex items-center gap-3 no-underline">
                {experience.link}
                <ArrowIcon className="size-[1.125rem] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
