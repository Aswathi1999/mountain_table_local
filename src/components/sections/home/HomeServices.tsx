import { DrawnLeaf, Lines, Reveal } from "@/components/motion/primitives";
import { copy } from "@/data/copy";
import { sentenceCase } from "@/lib/text";
import { ServicesCarousel } from "./ServicesCarousel";

/** Heading as set in the approved design reference. */
const heading = ["Thoughtful Services", "for a Seamless Stay"] as const;

/**
 * Our Services, as in the reference: on the left the eyebrow, a two-line serif headline and a leaf line drawing; on the right a row
 * of tall service cards that runs off the edge of the page. All six services keep their own wording.
 */
export function HomeServices() {
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="bg-ivory relative overflow-hidden pt-20 pb-8 desk:pt-28 desk:pb-10"
    >
      <div className="wrap grid items-start gap-12 lg:grid-cols-12 lg:gap-x-12">
        <div className="relative lg:col-span-5 lg:pt-6">
          <Reveal>
            <p className="t-eyebrow text-forest">{sentenceCase(copy.home.servicesTitle)}</p>
          </Reveal>
          <Lines
            id="services-title"
            as="h2"
            lines={heading}
            className="t-h2 text-forest m-0 mt-5 [font-size:clamp(2rem,1.3rem+2vw,3rem)]"
          />
          <DrawnLeaf className="text-forest/35 mt-10 hidden h-44 w-auto -rotate-12 lg:block" />
        </div>
        <div className="min-w-0 lg:col-span-7">
          <ServicesCarousel />
        </div>
      </div>
    </section>
  );
}
