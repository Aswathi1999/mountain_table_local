import Link from "next/link";
import { Drift, ImageFrame, Reveal } from "@/components/motion/primitives";
import { PanelWipe } from "@/components/motion/PanelWipe";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { LeafSprig } from "@/components/ui/decor";
import { copy } from "@/data/copy";

/**
 * The section after the hero, matching Jannata's "The Resort": a wide, modest aerial photograph sits higher than a tinted panel and
 * overlaps its left end, the heading, paragraph and text link live inside the panel, and a faint frond stands at the left edge.
 * Entrance order: panel wipes open, the photograph is uncovered from the left (and drifts as you scroll), the heading lines rise,
 * then the paragraph and link. Colours, type and copy are the site's own.
 */
export function HomeHouse() {
  return (
    <section
      aria-labelledby="house-title"
      className="bg-ivory relative overflow-hidden pt-14 pb-12 desk:pt-16 desk:pb-16 lg:pt-24 lg:pb-20"
    >
      {/* Tall faint frond cropped by the left edge, as on the reference. */}
      <Drift x={-16} y={40} className="pointer-events-none absolute -top-4 -left-10 hidden h-[34rem] lg:block">
        <LeafSprig className="text-forest/[0.08] h-full w-auto -rotate-[8deg]" />
      </Drift>

      <div className="wrap relative lg:grid lg:grid-cols-12 lg:items-center">
        {/* Photograph: a wide, modest frame that sits higher than the panel and overlaps its left end. */}
        <div className="relative z-10 lg:col-span-5 lg:col-start-2 lg:row-start-1 lg:self-center">
          <ImageFrame
            src="/images/home-house-about-v1.jpg"
            alt="The Mountain Table"
            sizes="(min-width: 1280px) 520px, (min-width: 1024px) 42vw, 92vw"
            className="aspect-[4/3] w-full shadow-[0_24px_50px_rgba(20,42,33,0.18)] lg:aspect-[2.1/1]"
            from="left"
            drift={4}
            position="50% 50%"
            radius={0}
          />
        </div>

        {/* Panel: a clearly tinted slab that starts under the photograph and runs to the right edge. */}
        <div className="relative lg:col-span-8 lg:col-start-4 lg:row-start-1">
          <PanelWipe from="right" delay={0.1} className="absolute inset-0 -mt-px" panelClassName="bg-sage/35" />
          <div className="relative -mt-6 px-6 pt-14 pb-12 desk:px-10 lg:mt-0 lg:py-20 lg:pr-16 lg:pl-[calc(37.5%+3.5rem)]">
            <h2 id="house-title" className="sr-only">
              The House
            </h2>
            <Reveal delay={0.3}>
              <p className="t-lead text-ink/80 m-0 max-w-[22rem] [font-size:0.9375rem] [line-height:1.9]">
                {copy.home.house}
              </p>
            </Reveal>
            <Reveal delay={0.4} className="mt-7">
              <Link href="/about" className="t-ui link-u text-gold-ink inline-flex items-center gap-2">
                Our Story
                <ArrowIcon className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
