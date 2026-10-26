import Image from "next/image";
import Link from "next/link";
import { Lines, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { copy } from "@/data/copy";
import { roomLayouts } from "@/data/rooms";

/** Heading as set in the approved design reference. */
const heading = ["Rooms With a View", "to Remember"] as const;

/** Where each card's photograph is anchored, so the window and the bed stay in the frame. */
const focus = ["50% 55%", "45% 55%", "50% 60%"] as const;

/**
 * "Stay with us", as in the reference: the eyebrow and a two-line headline with a "View All Rooms" button, then one card for each of
 * the three rooms. Names, photographs and descriptions are the ones on the Rooms & Booking page; the whole card links there.
 * (The site publishes no prices or room specifications, so none are shown.)
 */
export function HomeRoomsPreview() {
  return (
    <section id="rooms" aria-labelledby="rooms-title" className="bg-ivory relative pt-10 pb-20 desk:pt-12 desk:pb-28">
      <div className="wrap">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="t-eyebrow text-forest">Stay with us</p>
            </Reveal>
            <Lines
              id="rooms-title"
              as="h2"
              lines={heading}
              className="t-h2 text-forest m-0 mt-5 [font-size:clamp(2rem,1.3rem+2vw,3rem)]"
            />
          </div>
          <Reveal delay={0.15}>
            <Link href="/rooms-booking" className="btn btn-line-dark btn-sweep">
              View All Rooms
              <ArrowIcon />
            </Link>
          </Reveal>
        </div>

        <Stagger step={0.12} className="mt-12 grid gap-6 desk:mt-14 md:grid-cols-3">
          {roomLayouts.map((room, i) => (
            <StaggerItem key={room.name} y={30}>
              <Link
                href="/rooms-booking"
                className="group border-forest/10 hover:border-forest/25 block overflow-hidden rounded-[10px] border bg-white no-underline shadow-[0_14px_36px_rgba(31,59,47,0.07)] transition-[border-color,transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_24px_50px_rgba(31,59,47,0.13)]"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <div className="img-zoom absolute inset-0">
                    <Image
                      src={room.image.src}
                      alt={room.image.alt}
                      fill
                      sizes="(min-width: 1280px) 400px, (min-width: 768px) 33vw, 92vw"
                      className="object-cover"
                      style={{ objectPosition: focus[i] }}
                    />
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="t-h4 text-forest m-0 [font-size:1.5rem]">{room.name}</h3>
                  <p className="t-small text-ink/70 m-0 mt-2 line-clamp-3 [font-size:0.875rem]">
                    {copy.rooms.cards[i]}
                  </p>
                  <span className="t-ui text-forest mt-5 inline-flex items-center gap-2">
                    View room
                    <ArrowIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                  </span>
                </div>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
