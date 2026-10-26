import { ImageFrame, Lines, Reveal, Rule } from "@/components/motion/primitives";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { CurveEdge } from "@/components/ui/decor";
import { copy } from "@/data/copy";

/**
 * Opening: a forest room split in two. The headline, welcome paragraph and the booking button sit on the left (the button is
 * reachable at once); a tall bedroom photograph on the right carries a small balcony view overlapping its lower-left corner.
 */
export function RoomsIntro() {
  const [first, second] = copy.rooms.titleLines;
  return (
    <section
      id="intro"
      aria-label="Rooms"
      className="bg-forest-deep text-ivory relative overflow-hidden pt-10 pb-32 desk:pt-24 desk:pb-36"
    >
      <div className="wrap grid items-center gap-16 desk:grid-cols-12 desk:gap-x-12">
        <div className="desk:col-span-7">
          <Lines
            as="h1"
            immediate
            lines={[first, second]}
            lineClasses={["", "t-it text-gold-soft"]}
            className="t-h2 m-0"
          />
          <Rule className="bg-gold/60 mt-8 max-w-20" delay={0.5} />
          <Reveal immediate delay={0.35} className="mt-8">
            <p className="t-lead text-ivory/85 m-0">{copy.rooms.intro}</p>
          </Reveal>
          <Reveal immediate delay={0.5} className="mt-10">
            <BookNowButton href="/rooms-booking#book-now" />
          </Reveal>
        </div>

        <div className="relative desk:col-span-5">
          <ImageFrame
            src="/images/c18256_989549b27d9e4d7b8dacd876f73eb8b7.jpg"
            alt="A bedroom with a large bed and glass walls"
            sizes="(min-width: 1280px) 500px, (min-width: 1024px) 40vw, 92vw"
            className="aspect-[4/5] w-full"
            from="bottom"
            drift={4}
            position="35% 50%"
            priority
          />
          <div className="absolute bottom-0 left-0 w-[42%] -translate-x-[14%] translate-y-[14%] desk:-translate-x-[16%] desk:translate-y-[12%]">
            <ImageFrame
              src="/images/mountain_table_5.jpg"
              alt="The view from the wooden balcony over the tea hills"
              sizes="(min-width: 1024px) 18vw, 38vw"
              className="aspect-[3/4] w-full shadow-[0_30px_60px_rgba(0,0,0,0.35)]"
              from="left"
              delay={0.3}
              drift={6}
              position="40% 50%"
            />
          </div>
        </div>
      </div>
      <CurveEdge />
    </section>
  );
}
