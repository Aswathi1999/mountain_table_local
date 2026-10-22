import Image from "next/image";
import { copy } from "@/data/copy";
import { rv, stagger } from "@/lib/reveal";
import { RevealImage } from "@/components/ui/editorial";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

/**
 * The section after the hero, told as a short arrival in three beats:
 *  1. A gold line falls from the hero's scroll cue to the logo, then the welcome statement sits beside a wide photograph of the pool terrace at sunset.
 *  2. A full-bleed band of the dining room, with the original scroll parallax (the photograph is pinned to the viewport on mobile).
 *  3. The house: a framed aerial photograph of the thatched house among the tea terraces, overlapping the band above, with a
 *     second photograph tucked into its corner, and the house blurb beside them.
 * Entrances are the site's own reveals (fade, grow, slide, mask); every text string is unchanged.
 */
export function HomeIntro() {
  return (
    <>
      <section id="intro" aria-label="Introduction" className="relative bg-ivory pb-12 desk:pb-[72px]">
        <div className="flex flex-col items-center">
          <span aria-hidden="true" className="block h-16 w-px bg-gold desk:h-24" {...rv("drawy", "drawy")} />
          <div
            className="relative mt-5 h-[6.5rem] w-[9.5rem] mix-blend-multiply desk:h-[110px] desk:w-[160px]"
            {...rv("fade", "turn")}
          >
            <Image
              src="/images/c18256_c623270b113b42aaa3981dedc1077ade.jpg"
              alt="The Mountain Table"
              fill
              sizes="160px"
              className="object-cover"
            />
          </div>
        </div>

        <div className="mx-auto mt-8 grid max-w-[1180px] items-center gap-10 px-6 desk:mt-12 desk:grid-cols-12 desk:gap-x-12 desk:px-8">
          <div className="relative desk:col-span-7">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 translate-x-3 translate-y-3 border border-gold/70 desk:translate-x-5 desk:translate-y-5"
            />
            <RevealImage
              src="/images/c18256_e258df5a2e004fb0b702a4bb9e142cec.jpg"
              alt="The infinity pool and covered terrace at sunset"
              sizes="(min-width: 1000px) 700px, 92vw"
              className="aspect-[4/3] w-full"
              reveal="wipe"
              drift={0.07}
              position="50% 58%"
            />
          </div>

          <div className="desk:col-span-5">
            <span aria-hidden="true" className="block h-px w-16 bg-gold" {...rv("grow")} />
            <h1 className="t-lead m-0 mt-8 text-ink" {...rv("fade", "fade", stagger(0.15))}>
              {copy.home.intro}
            </h1>
          </div>
        </div>
      </section>

      <section aria-label="Dining area" className="relative h-[20rem] overflow-hidden bg-forest-deep desk:h-[600px]">
        <ParallaxImage
          src="/images/c18256_a5070a9643594d6e90bf5288ae7d0bec.jpg"
          alt="Dining area with a long wooden table and glass walls"
          sizes="100vw"
          k={0.8}
          km={1}
        />
      </section>

      <section aria-label="About the house" className="relative z-10 bg-ivory px-6 pb-24 desk:px-8 desk:pb-[150px]">
        <div className="mx-auto grid max-w-[1180px] gap-10 desk:grid-cols-12 desk:gap-x-12">
          <div className="relative -mt-16 pr-6 desk:-mt-[150px] desk:col-span-7 desk:self-start desk:pr-0">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 -translate-x-3 translate-y-3 border border-gold/70 desk:-translate-x-5 desk:translate-y-5"
            />
            <RevealImage
              src="/images/81d784_a30ae9d65f7a4c158c25796451fed75f.jpg"
              alt="Aerial view of The Mountain Table's thatched house among the tea plantations"
              sizes="(min-width: 1000px) 700px, 90vw"
              className="aspect-[4/3] w-full"
              drift={0.06}
              position="52% 50%"
            />
          </div>

          <div className="desk:col-span-5 desk:self-end">
            <div className="relative h-9 w-16 desk:h-11 desk:w-20" {...rv("fade", "slide-y")}>
              <Image src="/icons/house.svg" alt="" fill sizes="80px" className="object-contain object-left" />
            </div>
            <span aria-hidden="true" className="mt-6 block h-px w-16 bg-gold" {...rv("grow")} />
            <p className="t-lead m-0 mt-8 text-ink" {...rv("fade", "slide-y", stagger(0.15))}>
              {copy.home.house}
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
