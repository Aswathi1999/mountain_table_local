import Image from "next/image";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  Drift,
  ImageFrame,
  Lines,
  ParallaxBand,
  Reveal,
  Rule,
  ScaleIn,
  Stagger,
  StaggerItem,
} from "@/components/motion/primitives";
import { STAGGER } from "@/components/motion/tokens";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { Disc, GoldArch, LeafSprig } from "@/components/ui/decor";
import { copy } from "@/data/copy";

/** The welcome statement is two sentences: the first is set large, the second beside it. */
const [welcomeLead, welcomeRest] = copy.home.intro.split(/(?<=\.)\s+(?=[A-Z])/);

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

/**
 * The section after the hero, told as a short arrival in four beats:
 *  1. The Experience: an overlapping pair of photographs on a soft arch with a leaf sprig and a handwritten signature, beside the
 *     headline, paragraph, three icon rows and a "Discover More" link (all as in the design reference).
 *  2. The original welcome statement, set large.
 *  3. A full-bleed band of the dining room, with the original scroll parallax (the photograph is pinned to the viewport on mobile).
 *  4. The house: a tall aerial photograph of the thatched house among the tea terraces, overlapping the band above, the house
 *     blurb beside it and a second view from the balcony below the text.
 */
export function HomeIntro({ afterExperience }: { afterExperience?: ReactNode }) {
  return (
    <>
      <section
        id="intro"
        aria-labelledby="experience-title"
        className="bg-ivory relative overflow-hidden pt-6 pb-20 desk:pb-32"
      >
        <div className="wrap grid items-center gap-16 lg:grid-cols-12 lg:gap-x-16">
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
            <ImageFrame
              src="/images/the_experiance_1.png"
              alt="A lounge with a wooden ceiling and glass walls looking out over the mountains"
              sizes="(min-width: 1280px) 460px, (min-width: 1024px) 38vw, 80vw"
              className="relative mr-[12%] ml-[24%] aspect-[4/5] shadow-[0_30px_60px_rgba(20,42,33,0.16)]"
              from="bottom"
              drift={3}
              position="46% 50%"
              radius={4}
            />
            <div className="absolute bottom-[14%] left-[8%] w-[37%]">
              <ImageFrame
                src="/images/the_experiance_2.png"
                alt="A timber-clad bedroom with a bed facing a mountain-view terrace"
                sizes="(min-width: 1024px) 15vw, 30vw"
                className="aspect-[1.15/1] w-full border-[4px] border-white shadow-[0_20px_44px_rgba(20,42,33,0.28)]"
                from="fade"
                delay={0.45}
                drift={4}
                position="30% 50%"
                radius={5}
              />
            </div>
            <p
              className="t-script text-clay absolute bottom-[3%] left-[47%] m-0 -rotate-6 text-[1.375rem] lg:text-[1.75rem]"
              aria-hidden="true"
            >
              {experience.signature.map((word, i) => (
                <Reveal key={word} as="span" y={10} delay={0.8 + i * 0.18} className="block">
                  <span className="block" style={{ marginLeft: i * 0.35 + "rem" }}>
                    {word}
                  </span>
                </Reveal>
              ))}
            </p>
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
            <Stagger step={STAGGER.base} className="mt-7 grid gap-5">
              {experience.items.map((item) => (
                <StaggerItem key={item.title}>
                  <div className="group flex items-center gap-5">
                    <ScaleIn className="bg-ivory-deep border-gold/40 group-hover:bg-gold/25 flex size-[3.25rem] shrink-0 items-center justify-center rounded-full border transition-colors duration-500">
                      <Image
                        src={item.icon}
                        alt=""
                        width={30}
                        height={30}
                        className="size-[1.625rem] object-contain transition-transform duration-500 group-hover:-translate-y-0.5"
                      />
                    </ScaleIn>
                    <span className="min-w-0">
                      <span className="t-h4 text-forest block [font-size:1.3125rem]">{item.title}</span>
                      <span className="t-small text-ink/65 mt-0.5 block [font-size:0.8125rem]">{item.text}</span>
                    </span>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.2} className="mt-8">
              <Link href="/about" className="group t-ui link-u text-forest inline-flex items-center gap-3 no-underline">
                {experience.link}
                <ArrowIcon className="size-[1.125rem] transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {afterExperience}

      <section aria-label="Welcome" className="bg-ivory-deep relative overflow-hidden py-20 desk:py-28">
        <LeafSprig className="text-gold/35 pointer-events-none absolute -bottom-6 left-[3%] hidden h-52 w-auto -rotate-[18deg] lg:block" />
        <div className="wrap relative grid items-start gap-10 lg:grid-cols-12 lg:gap-x-16">
          <Reveal className="lg:col-span-7">
            <p className="t-h3 text-forest m-0 [font-size:clamp(1.75rem,1.2rem+1.9vw,2.875rem)] [line-height:1.15]">
              {welcomeLead}
            </p>
          </Reveal>
          <div className="lg:col-span-4 lg:col-start-9 lg:pt-3">
            <Rule className="bg-gold/70 max-w-20" delay={0.1} />
            <Reveal delay={0.15} className="mt-6">
              <p className="t-lead text-ink/80 m-0 [font-size:1.0625rem]">{welcomeRest}</p>
            </Reveal>
          </div>
        </div>
      </section>

      <ParallaxBand
        src="/images/c18256_a5070a9643594d6e90bf5288ae7d0bec.jpg"
        alt="Dining area with a long wooden table and glass walls"
        className="bg-forest-deep h-[18rem] desk:h-[540px]"
        k={0.8}
        km={1}
      />

      <section aria-label="About the house" className="bg-ivory relative z-10 pb-4 desk:pb-8">
        <div className="wrap grid items-center gap-12 lg:grid-cols-12 lg:gap-x-16">
          <div className="relative -mt-14 pb-0 lg:-mt-40 lg:col-span-7 lg:pb-12">
            <ImageFrame
              src="/images/81d784_a30ae9d65f7a4c158c25796451fed75f.jpg"
              alt="Aerial view of The Mountain Table's thatched house among the tea plantations"
              sizes="(min-width: 1280px) 700px, (min-width: 1024px) 56vw, 92vw"
              className="aspect-[5/6] w-full shadow-[0_30px_60px_rgba(20,42,33,0.18)]"
              from="bottom"
              drift={4}
              position="50% 50%"
            />
            <div className="absolute right-[-6%] bottom-0 hidden w-[38%] lg:block">
              <ImageFrame
                src="/images/mountain_table_5.jpg"
                alt="The view from the wooden balcony over the tea hills"
                sizes="(min-width: 1024px) 22vw, 40vw"
                className="aspect-[4/5] w-full border-[6px] border-white shadow-[0_24px_50px_rgba(20,42,33,0.28)]"
                from="right"
                delay={0.25}
                drift={5}
                position="40% 50%"
                radius={8}
              />
            </div>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <Reveal className="bg-ivory-deep border-gold/40 flex size-[3.75rem] items-center justify-center rounded-full border">
              <Image
                src="/icons/house.svg"
                alt=""
                width={34}
                height={30}
                className="h-[1.875rem] w-auto object-contain"
              />
            </Reveal>
            <Rule className="bg-gold/70 mt-7 max-w-16" delay={0.1} />
            <Reveal delay={0.15} className="mt-7">
              <p className="t-lead text-ink m-0 [font-size:1.125rem]">{copy.home.house}</p>
            </Reveal>
            <Reveal delay={0.25} className="mt-9">
              <Link href="/about" className="btn btn-line-dark">
                Our Story
                <ArrowIcon />
              </Link>
            </Reveal>
            <Reveal delay={0.1} className="mt-10 ml-auto w-3/5 lg:hidden">
              <ImageFrame
                src="/images/mountain_table_5.jpg"
                alt="The view from the wooden balcony over the tea hills"
                sizes="60vw"
                className="aspect-[4/5] w-full border-[5px] border-white shadow-[0_20px_44px_rgba(20,42,33,0.25)]"
                from="right"
                position="40% 50%"
                radius={8}
              />
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
