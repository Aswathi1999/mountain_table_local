import Image from "next/image";
import { copy } from "@/data/copy";
import { rv, stagger } from "@/lib/reveal";

/** "Luxurious Rooms: Where Every View is a Masterpiece" headline, bed icon and the welcome paragraph over a bedroom photo. */
export function RoomsIntro() {
  const [first, second] = copy.rooms.titleLines;
  return (
    <section
      id="intro"
      aria-label="Rooms"
      className="relative isolate overflow-hidden bg-forest-deep py-24 text-ivory desk:py-[140px]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div data-drift="0.08" className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
          <Image
            src="/images/c18256_989549b27d9e4d7b8dacd876f73eb8b7.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,42,33,0.92),rgba(20,42,33,0.7)_55%,rgba(20,42,33,0.45))]" />
      </div>
      <div className="mx-auto grid max-w-[1180px] gap-10 px-6 desk:grid-cols-12 desk:gap-x-10 desk:px-8">
        <h1 className="t-h3 m-0 desk:col-span-8" {...rv("rise", "rise")}>
          <span className="t-h1 block">{first}</span>
          <span className="t-h3 mt-2 block text-gold-soft">{second}</span>
        </h1>
        <div className="desk:col-span-7">
          <div className="relative h-7 w-12 brightness-0 invert" {...rv("rise", "rise", stagger(0.1))}>
            <Image src="/icons/bed.svg" alt="" fill sizes="48px" className="object-contain object-left" />
          </div>
          <p className="t-lead m-0 mt-6 max-w-[40rem] text-ivory/90" {...rv("rise", "rise", stagger(0.2))}>
            {copy.rooms.intro}
          </p>
        </div>
      </div>
    </section>
  );
}
