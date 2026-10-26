import { Reveal } from "@/components/motion/primitives";
import { contact, DIRECTIONS_URL, MAP_PAGE_URL } from "@/lib/site";
import { LazyMap } from "./LazyMap";

/**
 * Where to find us: the map runs edge to edge (loaded only when close to view, and toned toward the site's greens), with the
 * address set on a forest-green panel laid over its lower left.
 */
export function LocationSection() {
  return (
    <section id="location" aria-labelledby="location-title" className="bg-ivory relative">
      <div className="relative h-[34rem] overflow-hidden desk:h-[680px]">
        <div className="absolute inset-0 [filter:grayscale(0.45)_sepia(0.15)_contrast(1.03)]">
          <LazyMap title="Map of The Mountain Table, Uluppuni, Vagamon" />
        </div>
        <div className="wrap pointer-events-none relative flex h-full items-end pb-6 desk:pb-14">
          <Reveal
            y={36}
            className="bg-forest-deep text-ivory pointer-events-auto w-full max-w-[26rem] p-7 shadow-[0_30px_70px_rgba(20,42,33,0.35)] desk:max-w-[30rem] desk:p-12"
          >
            <p className="t-kicker text-gold-soft m-0">Find us</p>
            <h2 id="location-title" className="t-h3 m-0 mt-3">
              The Mountain Table
            </h2>
            <address className="t-body text-ivory/85 mt-5 not-italic">{contact.address}</address>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                Get directions
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
              <a href={MAP_PAGE_URL} target="_blank" rel="noopener noreferrer" className="t-ui link-u text-ivory">
                Open in Maps
                <span className="sr-only"> (opens in a new tab)</span>
              </a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
