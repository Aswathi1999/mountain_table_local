import Image from "next/image";
import { copy } from "@/data/copy";
import { rv, stagger } from "@/lib/reveal";
import { merge, pos } from "@/lib/stage";
import { Block } from "@/components/ui/Block";
import { ParallaxImage } from "@/components/ui/ParallaxImage";

const INTRO = { d: 737, m: 587 };
const STRIP = { d: 1155, m: 957 };
const HOUSE = { d: 1828, m: 1257 };

/** Logo + rule + welcome paragraph (the page's h1), then the first image strip and the "house" blurb. */
export function HomeIntro() {
  return (
    <>
      <Block d={418} m={370} id="intro" label="Introduction">
        <div
          className="at mix-blend-multiply"
          {...rv("fade", "turn")}
          style={merge(pos(INTRO, [552, 795, 175, 153], [95, 617, 130, 110]), stagger(0))}
        >
          <Image
            src="/images/c18256_c623270b113b42aaa3981dedc1077ade.jpg"
            alt="The Mountain Table"
            fill
            sizes="175px"
            className="object-cover"
          />
        </div>
        <div
          className="at border-t border-gold"
          {...rv("grow")}
          style={merge(pos(INTRO, [517, 928, 245, 5], [22, 948, 276, 5]), stagger(0.18))}
        />
        <h1
          className="at m-0 text-center text-[1rem] leading-5 font-normal tracking-[0.05em] text-forest italic desk:text-[20px] desk:leading-[25px] desk:tracking-[1px]"
          {...rv("fade")}
          style={merge(pos(INTRO, [443, 938, 393, 200], [46, 724, 228, 200]), stagger(0.3))}
        >
          {copy.home.intro}
        </h1>
      </Block>

      <Block d={673} m={300} label="Dining area">
        <div className="at overflow-hidden" style={pos(STRIP, [150, 1190, 980, 638], [0, 968, 320, 289])}>
          <ParallaxImage
            src="/images/c18256_a5070a9643594d6e90bf5288ae7d0bec.jpg"
            alt="Dining area with a long wooden table and glass walls"
            sizes="(min-width: 750px) 980px, 100vw"
            k={0.8}
            km={1}
          />
        </div>
      </Block>

      <Block d={332} m={267} label="About the house">
        <div className="at" {...rv("fade", "slide-y")} style={pos(HOUSE, [562, 1882, 153, 82], [140, 1262, 40, 42])}>
          <Image src="/icons/house.svg" alt="" fill sizes="153px" className="object-contain" />
        </div>
        <p
          className="at m-0 text-center text-[1rem] leading-6 text-ink/80 italic desk:text-[18px] desk:leading-[27px]"
          {...rv("fade", "slide-y")}
          style={pos(HOUSE, [347, 1988, 585, 108], [36, 1309, 252, 192])}
        >
          {copy.home.house}
        </p>
      </Block>
    </>
  );
}
