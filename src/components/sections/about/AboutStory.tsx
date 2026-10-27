import Link from "next/link";
import { Postmark, Wildflower } from "@/components/decor";
import { InkReveal, PageSweep, PhotoDrop, ScalePop } from "@/components/motion/about-fx";
import { DrawnLeaf, ImageFrame, Lines, Reveal } from "@/components/motion/primitives";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { Disc } from "@/components/ui/decor";
import { ABOUT_FX } from "@/components/motion/home-fx.config";
import { copy } from "@/data/copy";

/**
 * "Our Story", as in the About design: the eyebrow, heading and the first two paragraphs of the existing story on the left; on the
 * right a misty-ridge photograph with a candlelit-table photograph laid over its lower-left corner, a cream disc and a leaf behind.
 */
export function AboutStory() {
  const [first, second] = copy.about.story;
  return (
    <section
      id="story"
      aria-labelledby="story-title"
      className="bg-ivory relative overflow-hidden pt-20 pb-10 desk:pt-28 desk:pb-12"
    >
      <div className="wrap grid items-center gap-16 lg:grid-cols-12 lg:gap-x-16">
        <div className="lg:col-span-6">
          <Reveal>
            <p className="t-eyebrow text-forest">A tale of transformation</p>
          </Reveal>
          <Lines
            id="story-title"
            as="h2"
            lines={[copy.about.titleLines.join(" ")]}
            className="t-h2 text-forest m-0 mt-4"
          />
          <InkReveal delay={0.1} className="mt-6">
            <p className="t-body text-ink/75 m-0">{first}</p>
          </InkReveal>
          <InkReveal delay={0.1 + ABOUT_FX.story.inkStep} className="mt-4">
            <p className="t-body text-ink/75 m-0">{second}</p>
          </InkReveal>
          <Reveal delay={0.3} className="mt-9">
            <Link href="/rooms-booking" className="btn btn-line-dark">
              See the rooms
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>

        <div className="relative mx-auto w-full max-w-[34rem] pb-24 lg:col-span-6 lg:mx-0 lg:max-w-none lg:pb-10 lg:pl-8">
          <ScalePop className="absolute top-[10%] left-0 size-[44%]">
            <Disc className="bg-ivory-deep inset-0" />
          </ScalePop>
          <div aria-hidden="true" className="absolute -top-3 left-[-2%] h-[24%] w-[14%] lg:-left-3">
            <DrawnLeaf className="text-forest h-full w-auto" />
          </div>
          <Wildflower size={58} rotate={10} opacity={0.6} draw className="decor-lg absolute -right-3 bottom-[14%]" />
          <Postmark size={132} opacity={0.75} rotate={-8} className="decor-lg absolute top-[-4%] right-[2%] z-10" />
          <ImageFrame
            src="/images/about/ridges.jpg"
            alt="Misty mountain ridges at sunrise seen from the resort"
            sizes="(min-width: 1280px) 560px, (min-width: 1024px) 44vw, 90vw"
            className="relative ml-auto aspect-[4/3.2] w-[86%] shadow-[0_24px_50px_rgba(10,34,27,0.18)]"
            from="right"
            drift={3}
            viewCursor
          >
            <PageSweep />
          </ImageFrame>
          <PhotoDrop className="absolute bottom-0 left-[6%] w-[40%] lg:left-[8%]">
            <ImageFrame
              src="/images/c18256_4f1a87a5cd434f3e869c7e16b058f9b1.jpg"
              alt="The dining area with a long wooden table and glass walls"
              sizes="(min-width: 1024px) 420px, 70vw"
              position="42% 55%"
              className="aspect-[1/1.12] w-full border-[6px] border-white shadow-[0_20px_44px_rgba(10,34,27,0.28)]"
              from="none"
              drift={4}
              radius={5}
              viewCursor
            />
          </PhotoDrop>
        </div>
      </div>
    </section>
  );
}
