import type { ReactNode } from "react";
import { ImageFrame, Lines, ParallaxBand, Reveal, Rule } from "@/components/motion/primitives";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { copy } from "@/data/copy";
import { roomLayouts } from "@/data/rooms";
import { GrowFrame } from "./RoomsMotion";

const room = (i: number) => roomLayouts[i];

/** Room title, hairline and the room's paragraph (unchanged copy). */
function RoomText({ i, tone = "light", children }: { i: number; tone?: "light" | "dark"; children?: ReactNode }) {
  const dark = tone === "dark";
  return (
    <>
      <Lines
        id={`room-${i + 1}`}
        as="h2"
        lines={[room(i).name]}
        lineClasses={["t-it"]}
        className={`t-h1 m-0 ${dark ? "text-gold-soft" : "text-forest"}`}
      />
      <Rule className="bg-gold/70 mt-7 max-w-16" delay={0.15} />
      <Reveal delay={0.12} className="mt-8">
        <p className={`t-body m-0 ${dark ? "text-ivory/85" : "text-ink"}`}>{copy.rooms.cards[i]}</p>
      </Reveal>
      {children}
    </>
  );
}

/**
 * The three rooms, each composed differently:
 *  1. A full-width photograph that opens out as it scrolls; the text steps up over its lower edge, a balcony view overlaps it.
 *  2. A tall portrait with the text beside it and a lawn photograph laid across the text's lower corner.
 *  3. A pool-side parallax band on forest green with the bed photograph overlapping it and the booking button.
 */
export function RoomsStory() {
  return (
    <div id="rooms">
      <section aria-labelledby="room-1" className="bg-ivory pt-20 pb-20 desk:pt-32 desk:pb-32">
        <GrowFrame
          src={room(0).image.src}
          alt={room(0).image.alt}
          sizes="100vw"
          className="aspect-[4/3] w-full desk:aspect-[21/10]"
          position="50% 55%"
        />
        <div className="wrap relative z-10 -mt-10 desk:-mt-24">
          <div className="grid gap-12 desk:grid-cols-12 desk:gap-x-12">
            <div className="bg-ivory pt-10 desk:col-span-6 desk:pt-14 desk:pr-14">
              <RoomText i={0} />
            </div>
            <div className="ml-auto w-3/5 desk:col-span-4 desk:col-start-9 desk:-mt-48 desk:w-full">
              <ImageFrame
                src="/images/mountain_table_1.jpg"
                alt="The pool terrace below the room balcony"
                sizes="(min-width: 1024px) 28vw, 60vw"
                className="aspect-[4/5] w-full"
                from="right"
                delay={0.1}
                drift={5}
                position="60% 50%"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="room-2" className="bg-ivory-deep py-20 desk:py-32">
        <div className="wrap grid items-start gap-16 desk:grid-cols-12 desk:gap-x-12">
          <div className="desk:col-span-5">
            <ImageFrame
              src={room(1).image.src}
              alt={room(1).image.alt}
              sizes="(min-width: 1280px) 500px, (min-width: 1024px) 42vw, 92vw"
              className="aspect-[4/5] w-full desk:aspect-[3/4]"
              from="left"
              drift={5}
              position="50% 50%"
            />
          </div>
          <div className="desk:col-span-6 desk:col-start-7 desk:pt-16">
            <RoomText i={1} />
            <div className="mt-14 ml-auto w-[85%] desk:-ml-32 desk:mt-20 desk:w-[88%]">
              <ImageFrame
                src="/images/c18256_e5d979a1e3574fa4982be5aba13e7d68.jpg"
                alt="A grass path between the tea plantation rows"
                sizes="(min-width: 1024px) 40vw, 80vw"
                className="aspect-[4/3] w-full"
                from="bottom"
                delay={0.1}
                drift={6}
                position="50% 50%"
              />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="room-3" className="bg-forest-deep text-ivory relative pb-20 desk:pb-32">
        <ParallaxBand
          src="/images/c18256_55a42d4d67124846bf5373915527592c.jpg"
          alt="The infinity pool edge above the green hills"
          className="bg-forest-deep h-[20rem] desk:h-[560px]"
          position="50% 30%"
          k={0.8}
          km={1}
        />
        <div className="wrap relative z-10 grid gap-12 desk:grid-cols-12 desk:gap-x-12">
          <div className="-mt-20 w-[78%] desk:-mt-52 desk:col-span-5 desk:w-full">
            <ImageFrame
              src={room(2).image.src}
              alt={room(2).image.alt}
              sizes="(min-width: 1280px) 500px, (min-width: 1024px) 42vw, 78vw"
              className="aspect-[3/4] w-full"
              from="bottom"
              drift={4}
              position="50% 55%"
            />
          </div>
          <div className="desk:col-span-6 desk:col-start-7 desk:pt-16">
            <RoomText i={2} tone="dark">
              <Reveal delay={0.2} className="mt-10">
                <BookNowButton href="/rooms-booking#book-now" />
              </Reveal>
            </RoomText>
          </div>
        </div>
      </section>
    </div>
  );
}
