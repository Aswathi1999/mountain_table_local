import { Lines, Reveal } from "@/components/motion/primitives";
import { OrnamentRule } from "@/components/decor";
import { ReviewSlideshow } from "@/components/ui/ReviewSlideshow";
import { LeafSprig } from "@/components/ui/decor";
import { copy } from "@/data/copy";
import { NightSection } from "./NightSection";
import { RatingBadge } from "./RatingBadge";

/** Heading as set in the approved design reference. */
const heading = ["Kind Words From", "Our Guests"] as const;

/**
 * Guest reviews, as in the reference: a sand-coloured band with a faint leaf drawing, the eyebrow and a two-line headline, then
 * the three real guest quotes as cards with one in the spotlight. (No ratings, names or counts are shown: the site has none.)
 */
export function HomeReviews() {
  return (
    <NightSection className="bg-ivory-deep text-forest py-20 desk:py-28">
      <LeafSprig className="text-gold/40 pointer-events-none absolute top-4 right-[6%] hidden h-56 w-auto rotate-[24deg] lg:block" />
      <div className="wrap relative">
        <OrnamentRule align="left" width="min(14rem, 60%)" className="mb-8" />
        <Reveal>
          <p className="t-eyebrow">{copy.home.reviewTitle}</p>
        </Reveal>
        <Lines
          id="reviews-title"
          as="h2"
          lines={heading}
          className="t-h2 m-0 mt-5 [font-size:clamp(2rem,1.3rem+2vw,3rem)]"
        />
        <RatingBadge />
        <div className="mt-12 desk:mt-14">
          <ReviewSlideshow reviews={copy.home.reviews} />
        </div>
      </div>
    </NightSection>
  );
}
