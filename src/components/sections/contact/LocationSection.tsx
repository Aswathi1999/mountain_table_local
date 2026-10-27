import { CONTACT_FX } from "@/components/motion/home-fx.config";
import { Contour } from "@/components/decor";
import { Lines, Reveal } from "@/components/motion/primitives";
import { Magnetic } from "@/components/sections/home/RoomsFx";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { contact, DIRECTIONS_URL, MAP_PAGE_URL } from "@/lib/site";
import { LazyMap } from "./LazyMap";

/**
 * Finding us: one rounded dark card, split in two. The address and the Get directions button sit on deep green on the left; the
 * map (loaded only when close to view) fills the right.
 */
export function LocationSection() {
  return (
    <section id="location" aria-labelledby="location-title" className="bg-ivory relative pb-20 desk:pb-28">
      <div className="wrap">
        <Reveal y={CONTACT_FX.location.enabled ? CONTACT_FX.location.rise : 0}>
          <div className="bg-forest-deep text-ivory grid overflow-hidden rounded-[24px] shadow-[0_24px_60px_rgba(10,34,27,0.2)] lg:grid-cols-2">
            <div className="relative isolate flex flex-col justify-center p-8 desk:p-14">
              <Contour opacity={0.14} className="-z-10" />
              <Reveal>
                <p className="t-eyebrow text-ivory">Find us</p>
              </Reveal>
              <Lines
                id="location-title"
                as="h2"
                lines={["The Mountain", "Table"]}
                lineClasses={["", "t-it"]}
                className="t-h2 m-0 mt-4 [font-size:clamp(2rem,1.3rem+2vw,3rem)]"
              />
              <Reveal delay={0.1} className="mt-6">
                <address className="t-body text-ivory/85 m-0 not-italic [font-size:1rem]">{contact.address}</address>
              </Reveal>
              <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                <Magnetic>
                  <a href={DIRECTIONS_URL} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
                    Get directions
                    <ArrowIcon />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </Magnetic>
                <a href={MAP_PAGE_URL} target="_blank" rel="noopener noreferrer" className="t-ui link-u text-ivory">
                  Open in Maps
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </Reveal>
            </div>
            <div className="relative min-h-[22rem] lg:min-h-[28rem]">
              <LazyMap title="Map of The Mountain Table, Uluppuni, Vagamon" />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
