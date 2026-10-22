import { GalleryGrid } from "@/components/sections/gallery/GalleryGrid";
import { GalleryHero } from "@/components/sections/gallery/GalleryHero";
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
      <section aria-label="Photographs" className="bg-ivory py-16 desk:py-[110px]">
        <div className="mx-auto max-w-[1180px] px-6 desk:px-8">
          <GalleryGrid photos={galleryPhotos} />
        </div>
      </section>
    </div>
  );
}
