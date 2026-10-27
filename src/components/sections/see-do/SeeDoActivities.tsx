import Link from "next/link";
import type { ReactNode } from "react";
import { ImageFrame, Lines, Reveal, ScaleIn, Stagger, StaggerItem } from "@/components/motion/primitives";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { Disc, LeafSprig } from "@/components/ui/decor";
import { copy } from "@/data/copy";
import { activityLayouts } from "@/data/seeDo";
import {
  BinocularMask,
  DustTrail,
  Embers,
  FootprintScatter,
  Footprints,
  LanternImage,
  MusicNotes,
  ParagliderPath,
  RouteLine,
  TyreTracks,
  WarmWash,
  WheelNumber,
} from "./ActivityFx";
import { splitTitle } from "./title";

/** Short handwritten notes beside each photograph (the only new wording on this page). */
const NOTES = [
  "Off the beaten track",
  "Fly above the valley",
  "Slow wheels, wide views",
  "Follow the windy walk",
  "Fire, music, stars",
  "Quiet watchers",
] as const;

/** Section look per activity: BBQ & Music is the dark evening band; the others alternate cream and sand. */
const TONES = ["ivory", "sand", "ivory", "sand", "dark", "ivory"] as const;

/** Where each photograph is anchored in its frame, the frame's aspect ratio and how far the picture drifts inside it. */
const FRAMES = [
  { position: "50% 60%", ratio: "aspect-[4/3]", drift: 3 },
  { position: "45% 50%", ratio: "aspect-[4/3]", drift: 3 },
  { position: "78% 30%", ratio: "aspect-[4/4.2]", drift: 3 },
  { position: "40% 55%", ratio: "aspect-[4/3]", drift: 3 },
  { position: "35% 50%", ratio: "aspect-[4/3]", drift: 3 },
  { position: "50% 40%", ratio: "aspect-[4/4.4]", drift: 3 },
] as const;

const icon = (d: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    className="size-[1.375rem]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {d}
  </svg>
);
const CLOCK = icon(
  <>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </>,
);
const TAG = icon(
  <>
    <path d="M3 12V4h8l10 10-8 8z" />
    <circle cx="7.5" cy="8.5" r="1.2" />
  </>,
);

/** One activity: the photograph with its signature effect, a handwritten note, and the number, title, text and detail rows. */
function Activity({ index }: { index: number }) {
  const n = index + 1;
  const text = copy.seeDo.activities[index];
  const [name, qualifier] = splitTitle(text.title);
  const words = name.split(" ");
  const lines = words.length > 1 ? [words.slice(0, -1).join(" "), words[words.length - 1]] : [name];
  const photo = activityLayouts[index].image;
  const frame = FRAMES[index];
  const tone = TONES[index];
  const dark = tone === "dark";
  const flip = index % 2 === 1;
  const id = `activity-${n}`;
  const num = String(n).padStart(2, "0");
  const paragraphs = text.body.filter((p) => !p.startsWith("*"));
  const notes = text.body.filter((p) => p.startsWith("*"));
  const details = [
    ...(qualifier ? [{ icon: CLOCK, label: qualifier.replace(/^\(|\)$/g, "") }] : []),
    ...notes.map((t) => ({ icon: TAG, label: t })),
  ];

  const overlay =
    index === 0 ? (
      <DustTrail />
    ) : index === 1 ? (
      <ParagliderPath />
    ) : index === 4 ? (
      <>
        <Embers />
        <MusicNotes />
      </>
    ) : undefined;
  const picture = (
    <LanternImage
      className={`${frame.ratio} w-full rounded-[18px] shadow-[0_24px_50px_rgba(10,34,27,0.18)]`}
      overlay={overlay}
    >
      <ImageFrame
        src={photo.src}
        alt={photo.alt}
        sizes="(min-width: 1280px) 620px, (min-width: 1024px) 48vw, 92vw"
        className="h-full w-full"
        radius={0}
        from={index === 5 ? "fade" : flip ? "right" : "left"}
        drift={frame.drift}
        lock
        position={frame.position}
      />
    </LanternImage>
  );
  const numberClass = `t-num text-[5.5rem] leading-none ${dark ? "text-ivory/15" : "text-forest/12"}`;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative scroll-mt-12 overflow-hidden py-20 desk:py-28 ${
        dark ? "bg-forest-deep text-ivory" : tone === "sand" ? "bg-ivory-deep text-forest" : "bg-ivory text-forest"
      }`}
    >
      {index === 4 ? <WarmWash /> : null}
      {index === 5 ? <FootprintScatter /> : null}
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12 lg:gap-x-16">
        <div className={`relative lg:col-span-6 lg:row-start-1 ${flip ? "lg:col-start-7" : "lg:col-start-1"}`}>
          <Disc
            className={`${dark ? "bg-ivory/[0.06]" : tone === "sand" ? "bg-ivory" : "bg-ivory-deep"} -top-6 ${flip ? "-right-6" : "-left-6"} size-[44%]`}
          />
          <LeafSprig
            className={`absolute -top-7 h-24 w-auto ${flip ? "right-[-3%] rotate-12" : "left-[-3%] -rotate-12"} ${dark ? "text-gold-soft/60" : "text-forest/55"}`}
          />
          <div className="relative">
            {index === 5 ? <BinocularMask>{picture}</BinocularMask> : picture}
            <Reveal
              delay={0.9}
              y={10}
              className={`t-script absolute -bottom-6 ${flip ? "right-6" : "left-6"} -rotate-3 text-[1.5rem] desk:text-[1.875rem] ${dark ? "text-gold-soft" : "text-clay"}`}
            >
              <span aria-hidden="true">{NOTES[index]}</span>
            </Reveal>
          </div>
        </div>

        <div className={`relative lg:col-span-5 lg:row-start-1 ${flip ? "lg:col-start-1" : "lg:col-start-8"}`}>
          {index === 3 ? (
            <Footprints
              className={`absolute -top-4 -right-2 hidden lg:block ${dark ? "text-gold-soft" : "text-forest"}`}
            />
          ) : null}
          <div>
            {index === 2 ? (
              <WheelNumber className={numberClass}>{num}</WheelNumber>
            ) : (
              <Reveal as="span" y={0} className={numberClass}>
                <span aria-hidden="true">{num}</span>
              </Reveal>
            )}
          </div>
          <Reveal delay={0.05}>
            <p className={`t-eyebrow ${dark ? "text-ivory" : "text-forest"}`}>{text.subtitle}</p>
          </Reveal>
          <h2
            id={`${id}-title`}
            className={`t-h2 m-0 mt-4 ${dark ? "text-ivory" : "text-forest"} [font-size:clamp(2.125rem,1.3rem+2.6vw,3.5rem)]`}
          >
            <Lines as="div" lines={lines} lineClasses={["", "t-it"]} />
          </h2>
          {index === 0 ? <TyreTracks className={`mt-4 ${dark ? "text-gold-soft" : "text-gold-ink"}`} /> : null}
          {index === 2 ? <RouteLine className={`mt-4 ${dark ? "text-gold-soft" : "text-gold-ink"}`} /> : null}

          <div className="mt-6 flex flex-col gap-4">
            {paragraphs.map((p, i) => (
              <Reveal key={i} delay={0.1 + i * 0.08}>
                <p className={`t-body m-0 ${dark ? "text-ivory/85" : "text-ink/75"}`}>{p}</p>
              </Reveal>
            ))}
          </div>

          {details.length ? (
            <Stagger step={0.12} className="mt-7 grid gap-4">
              {details.map((d) => (
                <StaggerItem key={d.label}>
                  <div className="flex items-center gap-4">
                    <ScaleIn
                      className={`flex size-[3rem] shrink-0 items-center justify-center rounded-full border ${
                        dark
                          ? "border-gold-soft/40 bg-ivory/10 text-gold-soft"
                          : "border-gold/40 bg-ivory-deep text-forest"
                      }`}
                    >
                      {d.icon}
                    </ScaleIn>
                    <span className={`t-small ${dark ? "text-ivory/85" : "text-ink/75"}`}>{d.label}</span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          ) : null}

          <Reveal delay={0.25} className="mt-9">
            <Link href="/rooms-booking#book-now" className="btn btn-gold">
              Enquire
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** The six activities, alternating image left and right, each with its own signature effect. BBQ & Music is a dark band. */
export function SeeDoActivities() {
  return (
    <div id="activities">
      {activityLayouts.map((_, i) => (
        <Activity key={i} index={i} />
      ))}
    </div>
  );
}
