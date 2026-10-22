import Image from "next/image";
import { copy } from "@/data/copy";
import { rv } from "@/lib/reveal";
import { pos } from "@/lib/stage";
import { Block } from "@/components/ui/Block";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { ReviewSlideshow } from "@/components/ui/ReviewSlideshow";

const O = { d: 4221, m: 3613 };

/** Bathroom image strip with the dark guest-review card and its rotating quotes. */
export function HomeReviews() {
  return (
    <Block d={704} m={409} id="reviews" label="Guest review">
      <h2
        className="t-h4 at m-0 text-center tracking-[0.2em] text-forest"
        {...rv("fade")}
        style={pos(O, [159, 4221, 962, 36], [20, 3613, 280, 28])}
      >
        {copy.home.reviewTitle}
      </h2>
      <div className="at overflow-hidden" style={pos(O, [150, 4295, 980, 630], [0, 3662, 320, 344])}>
        <ParallaxImage
          src="/images/c18256_c5916f03293c42b08d9b41c3f08adeee.jpg"
          alt="A bathroom with a glass window and plants"
          sizes="(min-width: 750px) 980px, 100vw"
          k={0.8}
          km={1}
        />
      </div>
      <div
        className="at bg-forest-deep"
        {...rv("slide-x", "fade")}
        style={pos(O, [444, 4425, 392, 370], [44, 3712, 240, 225])}
      />
      <div className="at" {...rv("slide-x", "fade")} style={pos(O, [629, 4545, 21, 25], [154, 3732, 22, 24])}>
        <Image
          src="/images/a9ff3b_e630dab1211b433ba1955369e2f15c16.png"
          alt=""
          fill
          sizes="22px"
          className="object-contain"
        />
      </div>
      <div className="at" {...rv("slide-x", "fade")} style={pos(O, [453, 4580, 372, 185], [44, 3757, 240, 180])}>
        <ReviewSlideshow reviews={copy.home.reviews} />
      </div>
    </Block>
  );
}
