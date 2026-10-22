import Link from "next/link";
import { rv, stagger } from "@/lib/reveal";
import { Eyebrow, RevealImage } from "@/components/ui/editorial";

type Tile = {
  n: string;
  title: string;
  text: string;
  href: string;
  cta: string;
  image: { src: string; alt: string; position?: string };
  frame: string;
  wrapper: string;
  sizes: string;
};

/** Captions use wording from the existing site; links go to the pages that cover each topic. */
const tiles: readonly Tile[] = [
  {
    n: "01",
    title: "The Rooms",
    text: "Three air-conditioned bedrooms, each with a breathtaking view of the tea plantation through expansive glass doors and windows.",
    href: "/rooms-booking",
    cta: "See the rooms",
    image: { src: "/images/c18256_e6722fd3397a4b21a829c2ab06e9e5a6.jpg", alt: "Room 1 with panoramic glass windows" },
    frame: "aspect-[4/3]",
    wrapper: "desk:col-span-7",
    sizes: "(min-width: 750px) 700px, 100vw",
  },
  {
    n: "02",
    title: "The Infinity Pool",
    text: "A refreshing dip with panoramic vistas of the misty hills and meadows.",
    href: "/#services",
    cta: "Our services",
    image: {
      src: "/images/c18256_55a42d4d67124846bf5373915527592c.jpg",
      alt: "The infinity pool overlooking the hills",
      position: "50% 0%",
    },
    frame: "aspect-[4/5]",
    wrapper: "desk:col-span-5 desk:mt-28",
    sizes: "(min-width: 750px) 500px, 100vw",
  },
  {
    n: "03",
    title: "Dining",
    text: "Local cuisine by our chef, with a complimentary breakfast, and grilled dishes at the forest-set grill house.",
    href: "/#services",
    cta: "Our services",
    image: {
      src: "/images/c18256_4f1a87a5cd434f3e869c7e16b058f9b1.jpg",
      alt: "The dining area with a long wooden table",
    },
    frame: "aspect-[5/4]",
    wrapper: "desk:col-span-5 desk:col-start-2",
    sizes: "(min-width: 750px) 500px, 100vw",
  },
  {
    n: "04",
    title: "The Plantation",
    text: "Stroll through our lush garden and tea plantation and revel in the tranquillity of the surroundings.",
    href: "/see-do",
    cta: "See & do",
    image: {
      src: "/images/c18256_e5d979a1e3574fa4982be5aba13e7d68.jpg",
      alt: "A stone path through the tea plantation",
      position: "50% 45%",
    },
    frame: "aspect-[4/3]",
    wrapper: "desk:col-span-6 desk:col-start-7 desk:-mt-12",
    sizes: "(min-width: 750px) 600px, 100vw",
  },
];

function ExperienceTile({ tile, index }: { tile: Tile; index: number }) {
  return (
    <article className={tile.wrapper}>
      <Link
        href={tile.href}
        className="group block text-ink no-underline focus-visible:outline-offset-8"
        aria-label={`${tile.title}: ${tile.cta}`}
      >
        <RevealImage
          src={tile.image.src}
          alt={tile.image.alt}
          sizes={tile.sizes}
          className={`${tile.frame} w-full`}
          reveal={index % 2 ? "wipe" : "mask"}
          position={tile.image.position}
          zoomOnHover
        />
        <div className="mt-6 grid grid-cols-[auto_1fr] gap-x-5" {...rv("rise", "rise", stagger(0.15))}>
          <span className="t-h4 pt-1 text-gold-ink">{tile.n}</span>
          <div>
            <h3 className="t-h3 m-0 text-forest">{tile.title}</h3>
            <p className="t-body m-0 mt-3 max-w-[30rem] text-muted">{tile.text}</p>
            <span className="t-label mt-5 inline-flex items-center gap-3 tracking-[0.26em] text-forest uppercase">
              <span className="relative pb-1 after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-100 after:bg-current after:transition-transform after:duration-500 group-hover:after:scale-x-0 group-focus-visible:after:scale-x-0">
                {tile.cta}
              </span>
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-2">
                →
              </span>
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/** "The Experience": an asymmetric, staggered mosaic of rooms, pool, dining and plantation, each linking onward. */
export function AboutExperience() {
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="relative bg-ivory-deep py-24 desk:py-[150px]"
    >
      <div className="mx-auto max-w-[1180px] px-6 desk:px-8">
        <header className="max-w-[52rem]">
          <Eyebrow>The Experience</Eyebrow>
          <h2 id="experience-title" className="t-h1 m-0 mt-6 text-forest" {...rv("rise", "rise", stagger(0.1))}>
            A stay among the hills
          </h2>
        </header>
        <div className="mt-16 grid gap-16 desk:mt-24 desk:grid-cols-12 desk:gap-x-10 desk:gap-y-24">
          {tiles.map((tile, i) => (
            <ExperienceTile key={tile.n} tile={tile} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
