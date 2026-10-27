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
import { LeafSprig } from "@/components/ui/decor";
import { copy } from "@/data/copy";
import { ExperienceStory } from "./ExperienceStory";

/** The welcome statement is two sentences: the first is set large, the second beside it. */
const [welcomeLead, welcomeRest] = copy.home.intro.split(/(?<=\.)\s+(?=[A-Z])/);

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
      <ExperienceStory />

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
                width={56}
                height={30}
                className="object-contain"
                style={{ width: "auto", height: "1.875rem" }}
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
