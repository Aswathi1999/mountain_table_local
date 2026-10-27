import { ImageFrame, Lines, Reveal } from "@/components/motion/primitives";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { Disc, LeafSprig } from "@/components/ui/decor";
import { ROOMS_FX } from "@/components/motion/home-fx.config";
import { copy } from "@/data/copy";
import { roomLayouts } from "@/data/rooms";
import { DoorSeam } from "./RoomsMotion";

/** A second, supporting photograph for each room (all existing site photographs), laid over the corner of the main one. */
const EXTRAS = [
  { src: "/images/mountain_table_1.jpg", alt: "The pool terrace below the room balcony", position: "60% 50%" },
  {
    src: "/images/c18256_e5d979a1e3574fa4982be5aba13e7d68.jpg",
    alt: "A grass path between the tea plantation rows",
    position: "50% 50%",
  },
  {
    src: "/images/c18256_55a42d4d67124846bf5373915527592c.jpg",
    alt: "The infinity pool edge above the green hills",
    position: "50% 30%",
  },
] as const;

/** Main photograph anchoring for each room. */
const FOCUS = ["50% 55%", "50% 50%", "50% 55%"] as const;

/**
 * The three rooms, in the page's alternating editorial layout: the room's photograph with a smaller photograph overlapping its
 * corner (white border), a beige disc and a leaf behind; the name, existing description and a booking button beside it.
 */
export function RoomsList() {
  /** The text follows once the doors have begun to open. */
  const text = ROOMS_FX.doors.enabled ? ROOMS_FX.doors.textDelay : 0;
  return (
    <section
      id="rooms"
      aria-labelledby="rooms-heading"
      className="bg-ivory relative overflow-hidden pt-4 pb-6 desk:pb-10"
    >
      <div className="wrap pt-10 pb-4 text-center desk:pt-6">
        <Reveal>
          <p className="t-eyebrow text-forest justify-center before:h-px before:w-14 before:bg-current before:opacity-35 before:content-['']">
            Our rooms
          </p>
        </Reveal>
        <Lines
          id="rooms-heading"
          as="h2"
          lines={["Rooms With a View", "to Remember"]}
          className="t-h2 text-forest m-0 mt-4 text-center"
        />
      </div>

      {roomLayouts.map((room, i) => {
        const flip = i % 2 === 1;
        const extra = EXTRAS[i];
        return (
          <article
            key={room.name}
            id={`room-${i + 1}`}
            aria-labelledby={`room-${i + 1}-title`}
            className={`relative py-16 scroll-mt-24 desk:py-24 ${i === 1 ? "bg-ivory-deep" : ""}`}
          >
            <div className="wrap grid items-center gap-16 lg:grid-cols-12 lg:gap-x-16">
              <div className={`relative lg:col-span-6 lg:row-start-1 ${flip ? "lg:col-start-7" : "lg:col-start-1"}`}>
                <Disc
                  className={`${i === 1 ? "bg-ivory" : "bg-ivory-deep"} -top-8 size-[44%] ${flip ? "-right-8" : "-left-8"}`}
                />
                <LeafSprig
                  className={`text-forest/55 absolute -top-9 h-24 w-auto ${flip ? "right-[-2%] rotate-12" : "left-[-2%] -rotate-12"}`}
                />
                <div className="relative pb-16">
                  <ImageFrame
                    src={room.image.src}
                    alt={room.image.alt}
                    sizes="(min-width: 1280px) 620px, (min-width: 1024px) 48vw, 92vw"
                    className={`aspect-[4/3.4] w-[88%] shadow-[0_24px_50px_rgba(10,34,27,0.18)] ${flip ? "ml-auto" : ""}`}
                    radius={18}
                    from={ROOMS_FX.doors.enabled ? "doors" : flip ? "right" : "left"}
                    drift={3}
                    position={FOCUS[i]}
                    priority={i === 0}
                  >
                    <DoorSeam />
                  </ImageFrame>
                  <div className={`absolute bottom-0 w-[44%] ${flip ? "left-0" : "right-0"}`}>
                    <ImageFrame
                      src={extra.src}
                      alt={extra.alt}
                      sizes="(min-width: 1024px) 22vw, 40vw"
                      className="border-ivory aspect-[4/3] w-full border-[6px] shadow-[0_20px_44px_rgba(10,34,27,0.28)]"
                      radius={12}
                      from="fade"
                      delay={0.35}
                      drift={4}
                      position={extra.position}
                    />
                  </div>
                </div>
              </div>

              <div className={`lg:col-span-5 lg:row-start-1 ${flip ? "lg:col-start-1" : "lg:col-start-8"}`}>
                <Reveal as="span" y={0} className="t-num text-forest/12 block text-[5.5rem] leading-none">
                  <span aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                </Reveal>
                <h3
                  id={`room-${i + 1}-title`}
                  className="t-h2 text-forest m-0 mt-2 [font-size:clamp(2.125rem,1.3rem+2.6vw,3.5rem)]"
                >
                  <Lines as="div" lines={[room.name]} lineClasses={["t-it"]} />
                </h3>
                <Reveal delay={0.12 + text} className="mt-6">
                  <p className="t-body text-ink/75 m-0">{copy.rooms.cards[i]}</p>
                </Reveal>
                <Reveal delay={0.25 + text} className="mt-9">
                  <BookNowButton href="/rooms-booking#book-now" />
                </Reveal>
              </div>
            </div>
          </article>
        );
      })}
    </section>
  );
}
