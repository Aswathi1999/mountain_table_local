import { Lines, Reveal } from "@/components/motion/primitives";
import { ReviewSlideshow } from "@/components/ui/ReviewSlideshow";
import { copy } from "@/data/copy";
import { RatingBadge } from "./RatingBadge";

/** Heading as set in the approved design reference. */
const heading = ["Kind Words From", "Our Guests"] as const;

/**
 * Guest reviews, kept simple and centred: the eyebrow and two-line headline, then one of the three real guest quotes at a time on
 * a light sand background. (No ratings, names or counts are shown: the site has none.)
 */
export function HomeReviews() {
  return (
    <section
      id="reviews"
      aria-labelledby="reviews-title"
      className="bg-ivory-deep text-forest relative overflow-hidden pt-10 pb-16 desk:pt-14 desk:pb-24"
    >
      <div className="wrap relative flex flex-col items-center text-center">
        <Reveal>
          <p className="t-eyebrow justify-center after:hidden">{copy.home.reviewTitle}</p>
        </Reveal>
        <Lines
          id="reviews-title"
          as="h2"
          lines={heading}
          lineClasses={["", "italic"]}
          className="t-h2 m-0 mt-4 leading-[1.12] [font-size:clamp(1.75rem,1.2rem+1.8vw,2.5rem)]"
        />
        <RatingBadge />
        <div className="mt-10 w-full desk:mt-12">
          <ReviewSlideshow reviews={copy.home.reviews} />
        </div>
      </div>
    </section>
  );
}
