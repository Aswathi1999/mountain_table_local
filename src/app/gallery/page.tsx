import { ViewfinderCursor } from "@/components/motion/ViewfinderCursor";
import { GalleryFilm } from "@/components/sections/gallery/GalleryFilm";
import { GalleryFollow } from "@/components/sections/gallery/GalleryFollow";
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
      <section aria-labelledby="photos-title" className="bg-ivory relative py-16 desk:py-24">
        <div className="wrap">
          <GalleryGrid photos={galleryPhotos} />
        </div>
      </section>
      <GalleryFilm />
      <GalleryFollow />
      <ViewfinderCursor />
    </div>
  );
}
