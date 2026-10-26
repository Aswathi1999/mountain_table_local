import { Lines, Reveal } from "@/components/motion/primitives";
import { GalleryGrid } from "@/components/sections/gallery/GalleryGrid";
import { GalleryHero } from "@/components/sections/gallery/GalleryHero";
import { Disc, LeafSprig } from "@/components/ui/decor";
import { galleryPhotos } from "@/data/gallery";
import { pageMetadataFor } from "@/lib/metadata";

export const metadata = pageMetadataFor(
  "/gallery",
  "GALLERY | The Mountain Table",
  "Photographs of The Mountain Table, a homestay in the hills of Ulupuni, Vagamon: the property, rooms, dining and surroundings.",
);

export default function GalleryPage() {
  return (
    <div className="gallery-page">
      <GalleryHero />
      <section aria-labelledby="photos-title" className="bg-ivory relative overflow-hidden pt-4 pb-20 desk:pb-32">
        <Disc className="bg-ivory-deep top-40 -left-24 size-72" />
        <LeafSprig className="text-forest/35 pointer-events-none absolute top-24 right-[4%] hidden h-44 w-auto rotate-12 lg:block" />
        <div className="wrap relative">
          <div className="mx-auto mb-10 flex max-w-[40rem] flex-col items-center text-center desk:mb-14">
            <Reveal>
              <p className="t-eyebrow text-forest before:h-px before:w-14 before:bg-current before:opacity-35 before:content-['']">
                Life at The Mountain Table
              </p>
            </Reveal>
            <Lines id="photos-title" as="h2" lines={["Stay, Dine, Explore"]} className="t-h2 text-forest m-0 mt-4" />
          </div>
          <GalleryGrid photos={galleryPhotos} />
        </div>
      </section>
    </div>
  );
}
