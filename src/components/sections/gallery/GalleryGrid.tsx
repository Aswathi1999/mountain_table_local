import { ImageFrame, Lines, Reveal } from "@/components/motion/primitives";
import type { GalleryPhoto } from "@/data/gallery";

type Props = { photos: readonly GalleryPhoto[] };

/**
 * The collection: every photograph in a simple masonry grid (two columns on phones, three from large screens), shown at its
 * own aspect ratio. Each photograph is uncovered with a wipe as it scrolls in and drifts gently inside its frame; there are no
 * filters, no featured viewer and no expand-on-click.
 */
export function GalleryGrid({ photos }: Props) {
  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6 desk:mb-10">
        <div>
          <Reveal>
            <p className="t-eyebrow text-forest">Explore the collection</p>
          </Reveal>
          <Lines id="photos-title" as="h2" lines={["Stay, Dine, Explore"]} className="t-h2 text-forest m-0 mt-4" />
        </div>
        <p className="t-small text-ink/65 m-0">{photos.length} photos</p>
      </div>

      <ul className="m-0 columns-2 list-none gap-4 p-0 lg:columns-3 desk:gap-5 [&>li]:mb-4 desk:[&>li]:mb-5 [&>li]:break-inside-avoid">
        {photos.map((p, i) => (
          <li key={p.src}>
            <div className="bg-ivory-deep relative w-full rounded-[10px]" style={{ aspectRatio: `${p.width} / ${p.height}` }}>
              <ImageFrame
                src={p.src}
                alt={p.alt}
                sizes="(min-width: 1024px) 380px, 50vw"
                className="size-full"
                from="bottom"
                drift={3}
                radius={10}
                priority={i < 3}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
