import { ImageFrame } from "@/components/motion/primitives";
import { PageHero } from "@/components/sections/PageHero";
import { copy } from "@/data/copy";
import { activityLayouts } from "@/data/seeDo";

/**
 * See & Do hero: the shared inner-page hero with the existing heading and introduction, the Jeep Safari photograph behind it, and
 * the dusk photograph of the house overlapping on the right (desktop).
 */
export function SeeDoHero() {
  return (
    <PageHero
      id="intro"
      titleId="seedo-title"
      image={{ src: activityLayouts[0].image.src, position: "50% 58%" }}
      crumb="See & Do"
      eyebrow="Adventure awaits"
      lines={["Thrills and", "Tranquility"]}
      intro={copy.seeDo.intro}
      aside={
        <div className="absolute right-[7%] bottom-[clamp(5rem,12vw,11rem)] z-10 hidden w-[17rem] lg:block">
          <ImageFrame
            src="/images/mountain_table_3.jpg"
            alt="The house at dusk above the tea terraces"
            sizes="272px"
            className="border-ivory aspect-[3/4] w-full border-[6px] shadow-[0_24px_50px_rgba(10,34,27,0.35)]"
            from="fade"
            delay={0.9}
            position="62% 50%"
            radius={8}
          />
        </div>
      }
    />
  );
}
