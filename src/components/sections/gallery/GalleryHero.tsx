import Image from "next/image";
import { rv, stagger } from "@/lib/reveal";

/** Gallery hero: the pool at night behind the page heading and a line describing what the photographs show. */
export function GalleryHero() {
  return (
    <section
      id="gallery-hero"
      aria-labelledby="gallery-title"
      className="relative isolate overflow-hidden bg-forest-deep py-24 text-ivory desk:py-[130px]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div data-drift="0.08" className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
          <Image
            src="/images/81d784_1c2a1355792941408dd4987fa7e78484.jpg"
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,42,33,0.92),rgba(20,42,33,0.7)_55%,rgba(20,42,33,0.45))]" />
      </div>
      <div className="mx-auto max-w-[1180px] px-6 desk:px-8">
        <p className="t-label m-0 flex items-center gap-4 text-gold-soft uppercase" {...rv("rise", "rise")}>
          <span aria-hidden="true" className="block h-px w-10 bg-current" />
          The Mountain Table
        </p>
        <h1 id="gallery-title" className="t-display m-0 mt-6" {...rv("rise", "rise", stagger(0.1))}>
          Gallery
        </h1>
        <span aria-hidden="true" className="mt-8 block h-px w-24 bg-gold" {...rv("draw", "draw", stagger(0.2))} />
        <p className="t-lead m-0 mt-8 max-w-[34rem] text-ivory/90" {...rv("rise", "rise", stagger(0.3))}>
          The property, its rooms, dining and surroundings, in the hills of Ulupuni, Vagamon.
        </p>
      </div>
    </section>
  );
}
