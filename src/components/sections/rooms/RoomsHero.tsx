import { PageHero } from "@/components/sections/PageHero";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { copy } from "@/data/copy";

/** Rooms & Booking hero: the shared inner-page hero with the existing title lines and introduction and the booking button. */
export function RoomsHero() {
  const [first, second] = copy.rooms.titleLines;
  return (
    <PageHero
      id="intro"
      titleId="rooms-title"
      image={{ src: "/images/c18256_989549b27d9e4d7b8dacd876f73eb8b7.jpg", position: "40% 55%" }}
      crumb="Rooms & Booking"
      eyebrow="Stay with us"
      lines={[first, second]}
      intro={copy.rooms.intro}
      titleClassName="max-w-[14em]"
      lights
      actions={<BookNowButton href="/rooms-booking#book-now" />}
    />
  );
}
