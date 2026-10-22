import Image from "next/image";
import { copy } from "@/data/copy";
import { DISCOVER_REPEATS, discoverPhotos } from "@/data/home";
import { rv, stagger } from "@/lib/reveal";
import { pos } from "@/lib/stage";
import { Block } from "@/components/ui/Block";
import { Carousel } from "@/components/ui/Carousel";

const O = { d: 3632, m: 3334 };

/** object-position per photo (order of discoverPhotos): steps, dining, tea path, pool, lantern path. */
const focus = ["50% 55%", "34% 50%", "50% 45%", "50% 40%", "50% 50%"];

const slides = Array.from({ length: DISCOVER_REPEATS }, () => discoverPhotos)
  .flat()
  .map((photo, i) => (
    <Image
      key={i}
      src={photo.src}
      alt={photo.alt}
      fill
      sizes="(min-width: 750px) 267px, 101px"
      className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
      style={{ objectPosition: focus[i % focus.length] }}
      loading={i < 5 ? "eager" : "lazy"}
    />
  ));

/** "Discover" photo slider (267x475 slides on desktop, 101x179 on mobile). */
export function HomeDiscover() {
  return (
    <Block
      d={589}
      m={279}
      id="discover"
      label="Discover"
      back={
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-[1.6rem] top-[6.9rem] bg-forest desk:bottom-[38px] desk:top-[215px]"
        />
      }
    >
      <h2
        className="t-h4 at m-0 text-center tracking-[0.2em] text-forest"
        {...rv("fade")}
        style={pos(O, [159, 3632, 961, 36], [21, 3333, 278, 28])}
      >
        {copy.home.discoverTitle}
      </h2>
      <div
        aria-hidden="true"
        className="at border-t border-gold"
        {...rv("draw")}
        style={pos(O, [608, 3684, 64, 1], [140, 3366, 40, 1])}
      />
      <Carousel
        label="Discover"
        slides={slides.map((s, i) => (
          <div
            key={i}
            className="group relative size-full overflow-hidden bg-ivory-deep shadow-[0_14px_30px_-18px_rgba(20,42,33,0.55)] after:pointer-events-none after:absolute after:inset-[0.4375rem] after:border after:border-ivory/70 after:transition-[inset,border-color] after:duration-700 after:content-[''] desk:after:inset-[10px] desk:group-hover:after:inset-[15px] desk:group-hover:after:border-ivory"
            {...rv("rise", "rise", stagger(i < 5 ? i * 0.1 : 0))}
          >
            {s}
          </div>
        ))}
        slideClassName="relative h-[11.1875rem] w-[6.3125rem] self-start even:h-[9.5rem] even:self-end desk:h-[475px] desk:w-[267px] desk:even:h-[405px]"
        gapClassName="gap-[0.8125rem] desk:gap-[15px]"
        progressClassName="absolute inset-x-0 -bottom-[1.1rem] h-px bg-gold/30 desk:-bottom-[38px]"
        arrowClassName="!size-[2.25rem] !border !border-gold/70 !bg-ivory !opacity-100 transition-colors duration-300 hover:!bg-gold focus-visible:!bg-gold desk:!size-[44px] [&_path]:!stroke-forest-deep [&_svg]:!h-[0.9rem] [&_svg]:!w-[0.55rem] [&_svg]:!scale-100 desk:[&_svg]:!h-[18px] desk:[&_svg]:!w-[11px]"
        className="at"
        style={pos(O, [150, 3701, 980, 475], [21, 3382, 280, 180])}
      />
    </Block>
  );
}
