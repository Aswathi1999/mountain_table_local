import Image from "next/image";
import { honeycombPhotos, honeycombTiles } from "@/data/seeDo";
import { posRel } from "@/lib/stage";

/**
 * Diamond photo gallery (the original's Wix "Honeycomb": 4 columns, 2 holes, 9px margin, white rollover, no click action).
 * Seven photos as 45-degree-rotated squares; the container is 1216x477 on desktop and 280x126 on mobile.
 */
export function Honeycomb({ style }: { style: React.CSSProperties }) {
  return (
    <div className="at" style={style} role="group" aria-label="Photo gallery">
      {honeycombPhotos.map((photo, i) => (
        <div key={photo.src} className="at hc-tile group" style={posRel(honeycombTiles[i].d, honeycombTiles[i].m)}>
          <Image
            src={photo.src}
            alt={photo.alt}
            fill
            sizes="(min-width: 750px) 288px, 54px"
            className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-110"
          />
        </div>
      ))}
    </div>
  );
}
