import Image from "next/image";
import Link from "next/link";
import { Lines, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";

/** Tile captions use wording from the existing About page (rooms, dining, plantation); each tile links to the page that covers it. */
const tiles = [
  {
    script: "Stay",
    title: "The Rooms",
    text: "Three air-conditioned bedrooms, each with a breathtaking view of the tea plantation.",
    href: "/rooms-booking",
    src: "/images/about/bedroom.jpg",
    alt: "A cosy wood-panelled bedroom",
  },
  {
    script: "Dine",
    title: "Dining",
    text: "Local cuisine by our chef, with a complimentary breakfast, and grilled dishes at the forest-set grill house.",
    href: "/#services",
    src: "/images/about/dinner.jpg",
    alt: "A candlelit dinner table with wine glasses",
  },
  {
    script: "Explore",
    title: "The Plantation",
    text: "Stroll through our lush garden and tea plantation and revel in the tranquillity of the surroundings.",
    href: "/see-do",
    src: "/images/about/hiker.jpg",
    alt: "A hiker looking out over a mountain valley",
  },
] as const;

/** "Stay, Dine, Explore", as in the About design: three tall photo tiles with a script word, a serif title and a line, on a dark fade. */
export function AboutTiles() {
  return (
    <section id="experience" aria-labelledby="tiles-title" className="bg-ivory relative pb-20 desk:pb-28">
      <div className="wrap">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-6 desk:mb-14">
          <div className="max-w-[35rem]">
            <Reveal>
              <p className="t-eyebrow text-forest">Life at The Mountain Table</p>
            </Reveal>
            <Lines id="tiles-title" as="h2" lines={["Stay, Dine, Explore"]} className="t-h2 text-forest m-0 mt-4" />
          </div>
          <Reveal delay={0.1} className="max-w-[25rem]">
            <p className="t-small text-ink/70 m-0">
              Whether for romance, family, or business, The Mountain Table ensures an unforgettable stay amid
              nature&apos;s enchantment.
            </p>
          </Reveal>
        </div>
        <Stagger step={0.12} className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map((t) => (
            <StaggerItem key={t.title}>
              <Link
                href={t.href}
                className="group text-ivory relative block h-[26rem] overflow-hidden rounded-[18px] no-underline desk:h-[27.5rem]"
              >
                <Image
                  src={t.src}
                  alt={t.alt}
                  fill
                  sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 92vw"
                  className="object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.05]"
                />
                <span className="absolute inset-x-0 bottom-0 block bg-gradient-to-t from-forest-deep/95 to-transparent px-7 pt-24 pb-7">
                  <span className="t-script text-[#e9c9a8] block text-[1.625rem]">{t.script}</span>
                  <span className="t-h3 mt-1 block [font-size:1.875rem]">{t.title}</span>
                  <span className="t-small text-ivory/85 mt-2 block [font-size:0.875rem]">{t.text}</span>
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
