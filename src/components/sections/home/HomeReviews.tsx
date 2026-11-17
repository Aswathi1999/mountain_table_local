import { Lines, Reveal } from "@/components/motion/primitives";
import { ReviewSlideshow } from "@/components/ui/ReviewSlideshow";
import { copy } from "@/data/copy";
import { RatingBadge } from "./RatingBadge";

/** Heading as set in the approved design reference. */
const heading = ["Words from the", "Bottom of the Heart"] as const;

const reviews = [
  {
    text: "Our stay in Vagamon at The Mountain Table was truly unforgettable. From the stunning views to the delicious food, every moment was special. A sincere mention to Mr Renjith, whose helpfulness and warmth made a huge difference during our visit. Thank you to the whole team for an incredible experience—we will definitely be back!",
    author: "Arjun R. Nair",
  },
  {
    text: "Beautiful property... perfect for a few days of relaxing holiday. The property is exactly as shown in the pictures. Care taker Renjith and his team made our stay extremely comfortable. Their chef prepared all the meals for us during our stay... we didn’t even step out!! I definitely recommend this homestay in Vagamon if you are looking for a calm, peaceful holiday.",
    author: "Ashwini G",
  },
  {
    text: "This is my third visit to Mountain Table with my family, and every visit has been more special than the last. ❤️ Everyone in my family absolutely loves this best homestay in Vagamon, especially the kids! The ambience, hospitality, and overall experience always make us feel at home.",
    author: "Martin George",
  },
] as const;

/**
 * Guest reviews, kept simple and centred: the eyebrow and two-line headline, then one of the three real guest quotes at a time on
 * a light sand background, each with its guest's name.
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
          <ReviewSlideshow reviews={reviews} />
        </div>
      </div>
    </section>
  );
}
