import { PageHero } from "@/components/sections/PageHero";

/** Gallery hero: the shared inner-page hero with the existing heading line and the pool-at-night photograph. */
export function GalleryHero() {
  return (
    <PageHero
      id="gallery-hero"
      titleId="gallery-title"
      image={{ src: "/images/81d784_1c2a1355792941408dd4987fa7e78484.jpg", position: "50% 55%" }}
      crumb="Gallery"
      eyebrow="Photographs"
      lines={["Gallery"]}
      intro="The property, its rooms, dining and surroundings, in the hills of Ulupuni, Vagamon."
    />
  );
}
