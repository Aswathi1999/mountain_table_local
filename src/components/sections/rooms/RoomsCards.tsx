import { copy } from "@/data/copy";
import { roomLayouts } from "@/data/rooms";
import { rv, stagger } from "@/lib/reveal";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { RevealImage, Rule } from "@/components/ui/editorial";

/** Vertical offsets that stagger the three columns on desktop. */
const offsets = ["", "desk:mt-16", "desk:mt-8"];

/** Three room columns (staggered on desktop, stacked on mobile) and the "Book Now" button. */
export function RoomsCards() {
  return (
    <section id="rooms" aria-label="Our rooms" className="relative bg-ivory py-24 desk:py-[130px]">
      <div className="mx-auto max-w-[1180px] px-6 desk:px-8">
        <div className="grid gap-16 desk:grid-cols-3 desk:items-start desk:gap-x-10">
          {roomLayouts.map((room, i) => (
            <article
              key={room.name}
              aria-label={room.name}
              className={`group ${offsets[i]}`}
              {...rv("slide-x", "fade", stagger(i * 0.12))}
            >
              <RevealImage
                src={room.image.src}
                alt={room.image.alt}
                sizes="(min-width: 750px) 370px, 90vw"
                className="aspect-[4/5] w-full"
                zoomOnHover
              />
              <div className="mt-7">
                <Rule className="bg-gold/70" delay={0.2} />
                <h2 className="t-h3 m-0 mt-6 text-forest">{room.name}</h2>
                <p className="t-body m-0 mt-5 text-muted">{copy.rooms.cards[i]}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-20 flex justify-center desk:mt-28" {...rv("rise", "rise")}>
          <BookNowButton href="/rooms-booking#book-now" />
        </div>
      </div>
    </section>
  );
}
