"use client";

import {
  cubicBezier,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ABOUT_FX } from "@/components/motion/home-fx.config";
import { Lines, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { EASE, SCROLL_SPRING } from "@/components/motion/tokens";
import { useAboutFx } from "@/components/motion/useHomeFx";

/**
 * Each icon draws itself from `draw` (0 to 1, tied to the scroll while the section is pinned; fixed at 1 otherwise, so the icon is
 * simply complete). Every icon has its own touch: the sprout grows and unfolds, the fork and knife slide together, the heart draws
 * and then beats once, the house is sketched with a slightly uneven hand.
 */
type IconProps = { draw: MotionValue<number> };

/** A stroke that draws between `from` and `to` of the icon's progress (a round cap would leave a dot at 0, so it also fades in). */
function useStroke(draw: MotionValue<number>, from: number, to: number) {
  const pathLength = useTransform(draw, [from, to], [0, 1], { clamp: true });
  const opacity = useTransform(draw, [from, from + 0.03], [0, 1], { clamp: true });
  return { pathLength, opacity };
}

const Svg = ({ children }: { children: ReactNode }) => (
  <motion.svg
    viewBox="0 0 24 24"
    className="size-[1.625rem] transition-colors duration-500"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </motion.svg>
);

function SproutIcon({ draw }: IconProps) {
  const stem = useStroke(draw, 0, 0.5);
  const leafA = useStroke(draw, 0.4, 0.8);
  const leafB = useStroke(draw, 0.55, 1);
  const unfoldA = useTransform(draw, [0.4, 0.9], [0.3, 1], { clamp: true });
  const unfoldB = useTransform(draw, [0.55, 1], [0.3, 1], { clamp: true });
  return (
    <Svg>
      <motion.path d="M12 21V11" style={stem} />
      <motion.path
        d="M12 11C12 6 8 3 4 3c0 5 3 8 8 8z"
        style={{ ...leafA, scale: unfoldA, transformOrigin: "12px 11px", transformBox: "view-box" }}
      />
      <motion.path
        d="M12 14c0-4 3-7 8-7 0 4-3 7-8 7z"
        style={{ ...leafB, scale: unfoldB, transformOrigin: "12px 14px", transformBox: "view-box" }}
      />
    </Svg>
  );
}

function HouseIcon({ draw }: IconProps) {
  const ground = useStroke(draw, 0, 0.3);
  const walls = useStroke(draw, 0.2, 0.75);
  const door = useStroke(draw, 0.65, 1);
  return (
    <Svg>
      <motion.path d="M2.8 21.2C8 20.6 15 21.4 21.2 20.8" style={ground} strokeWidth="1.5" />
      <motion.path d="M5.2 21L4.7 10.3L12.1 3.7L19.4 10.5L18.8 21" style={walls} strokeWidth="1.3" />
      <motion.path d="M10.1 21.2L9.7 15.2L14.3 14.8L13.9 20.9" style={door} strokeWidth="1.45" />
    </Svg>
  );
}

function CutleryIcon({ draw }: IconProps) {
  const fork = useStroke(draw, 0, 0.7);
  const knife = useStroke(draw, 0, 0.7);
  const forkX = useTransform(draw, [0, 0.6], [-7, 0], { clamp: true });
  const knifeX = useTransform(draw, [0, 0.6], [7, 0], { clamp: true });
  return (
    <Svg>
      <motion.path d="M9 3v8a3 3 0 0 1-6 0V3M6 3v18" style={{ ...fork, x: forkX }} />
      <motion.path d="M15 21V3c3 0 5 3 5 8h-5" style={{ ...knife, x: knifeX }} />
    </Svg>
  );
}

function HeartIcon({ draw }: IconProps) {
  const line = useStroke(draw, 0, 1);
  const [beat, setBeat] = useState(false);
  useMotionValueEvent(draw, "change", (v) => {
    if (v >= 0.98) setBeat(true);
  });
  return (
    <motion.span
      className="flex"
      animate={beat ? { scale: [1, 1.16, 1] } : { scale: 1 }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <Svg>
        <motion.path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" style={line} />
      </Svg>
    </motion.span>
  );
}

/** The four values. Each line is taken from the existing story and the sustainability statement; only the short headings are new. */
const values = [
  {
    title: "Rooted in nature",
    text: "What once was a chaotic landscape of bushes and shrubs evolved into a serene tea plantation, crafted through years of dedication.",
    Icon: SproutIcon,
  },
  {
    title: "Rustic comfort",
    text: "Our accommodations blend modern comfort with rustic charm, inviting guests to wake up to birdsong and panoramic views.",
    Icon: HouseIcon,
  },
  {
    title: "Local flavours",
    text: "Culinary delights await, crafted from local ingredients by our skilled chefs, and grilled dishes at our forest-set grill house.",
    Icon: CutleryIcon,
  },
  {
    title: "Kind to the hills",
    text: "Crafted from natural materials such as straw or reeds, our thatch roofing keeps the interiors cool in the summer and warm in the winter.",
    Icon: HeartIcon,
  },
] as const;

const lead =
  "Driven by a vision of eco-friendly hospitality, The Mountain Table emerged as a haven where nature's harmony thrives.";

const settle = cubicBezier(...EASE);

/**
 * One card. While the section is pinned it is dealt in from below with a slight turn, as the scroll reaches its turn (`p` is the
 * pinned section's progress); its icon then draws. When not pinned the card is plain and its icon complete.
 */
function ValueCard({ i, p, pinned }: { i: number; p: MotionValue<number>; pinned: boolean }) {
  const { title, text, Icon } = values[i];
  const { rotateFrom, riseVh } = ABOUT_FX.values;
  const start = 0.02 + i * 0.19;
  const end = start + 0.2;
  const y = useTransform(p, [start, end], [`${riseVh}vh`, "0vh"], { ease: settle, clamp: true });
  const rotate = useTransform(p, [start, end], [i % 2 ? -rotateFrom : rotateFrom, 0], { ease: settle, clamp: true });
  const opacity = useTransform(p, [start, start + 0.08], [0, 1], { clamp: true });
  const scrollDraw = useTransform(p, [end, end + 0.18], [0, 1], { clamp: true });
  const done = useMotionValue(1);
  const draw = pinned ? scrollDraw : done;
  return (
    <motion.article
      style={pinned ? { y, rotate, opacity } : undefined}
      className="group flex flex-1 flex-col gap-4 rounded-[18px] bg-[#fffdf8] p-8 shadow-[0_10px_30px_rgba(10,34,27,0.06)] transition-[translate,box-shadow] duration-500 hover:[translate:0_var(--lift)] hover:shadow-[0_22px_44px_rgba(10,34,27,0.14)]"
    >
      {/* The hover lift uses the individual `translate` property, so it never fights the deal-in's transform. */}
      <span className="bg-ivory-deep text-forest group-hover:bg-forest group-hover:text-ivory flex size-[3.75rem] items-center justify-center rounded-full transition-colors duration-500">
        <Icon draw={draw} />
      </span>
      <h3 className="t-h4 text-forest m-0">{title}</h3>
      <p className="t-small text-ink/70 m-0">{text}</p>
    </motion.article>
  );
}

/**
 * "Our Philosophy": a centred heading and four soft cards with a round icon badge, title and one line each. On wide, tall screens
 * the section stays in place for about one screen of scroll while the cards are dealt in one by one and their icons draw; on
 * phones, short windows and with reduced motion the cards arrive together and the icons are already complete.
 */
export function AboutValues() {
  const pinned = useAboutFx("values");
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, SCROLL_SPRING);

  const heading = (
    <div className="mx-auto mb-12 flex max-w-[40rem] flex-col items-center text-center desk:mb-14">
      <Reveal>
        <p className="t-eyebrow text-forest before:bg-current before:opacity-35 before:content-[''] before:h-px before:w-14">
          What we believe
        </p>
      </Reveal>
      <Lines id="philosophy-title" as="h2" lines={["Our Philosophy"]} className="t-h2 text-forest m-0 mt-4" />
      <Reveal delay={0.1} className="mt-5">
        <p className="t-body text-ink/70 m-0 [font-size:1rem]">{lead}</p>
      </Reveal>
    </div>
  );

  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-title"
      className="bg-ivory relative"
      style={{ "--lift": `-${ABOUT_FX.values.lift}px` } as CSSProperties}
    >
      <div
        ref={wrapRef}
        style={pinned ? { height: `${100 + ABOUT_FX.values.pinVh}svh` } : undefined}
        className={pinned ? "relative" : "relative pt-4 pb-20 desk:pb-28"}
      >
        <div className={pinned ? "sticky top-0 flex h-svh flex-col justify-center pt-[84px]" : undefined}>
          <div className="wrap">
            {heading}
            {pinned ? (
              <div className="grid gap-6 lg:grid-cols-4">
                {values.map((v, i) => (
                  <div key={v.title} className="flex">
                    <ValueCard i={i} p={p} pinned />
                  </div>
                ))}
              </div>
            ) : (
              <Stagger step={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {values.map((v, i) => (
                  <StaggerItem key={v.title} className="flex">
                    <ValueCard i={i} p={p} pinned={false} />
                  </StaggerItem>
                ))}
              </Stagger>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
