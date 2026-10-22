import type { CSSProperties } from "react";
import { contact, DIRECTIONS_URL, MAP_PAGE_URL } from "@/lib/site";
import { rv } from "@/lib/reveal";
import { LazyMap } from "./LazyMap";

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

/** Where to find us: the map (loaded only when close to view) beside a details card with directions. */
export function LocationSection() {
  return (
    <section
      id="location"
      aria-labelledby="location-title"
      className="bg-ivory relative px-6 py-14 desk:px-8 desk:py-20"
    >
      <div className="mx-auto grid max-w-[1180px] items-center desk:grid-cols-12">
        <div
          className="relative aspect-[4/3] overflow-hidden desk:col-span-8 desk:col-start-1 desk:row-start-1 desk:aspect-[16/11]"
          {...rv("mask")}
        >
          <div className="mask-img absolute inset-0">
            <LazyMap title="Map of The Mountain Table, Uluppuni, Vagamon" />
          </div>
        </div>

        <div
          className="relative z-10 -mt-10 mr-4 ml-4 bg-white p-6 shadow-[0_18px_50px_rgba(36,35,35,0.12)] desk:col-span-5 desk:col-start-8 desk:row-start-1 desk:m-0 desk:-ml-6 desk:p-12"
          {...rv("rise", "rise", delay(0.25))}
        >
          <p className="m-0 text-[12px] tracking-[0.3em] text-muted uppercase">Find us</p>
          <h2
            id="location-title"
            className="m-0 mt-4 text-[1.5rem] font-normal tracking-[0.12em] text-ink uppercase desk:text-[28px]"
          >
            The Mountain Table
          </h2>
          <span className="mt-5 block h-px w-14 bg-gold" />
          <address className="t-lead mt-6 text-ink not-italic">{contact.address}</address>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="t-ui bg-gold text-forest-deep hover:bg-forest hover:text-ivory inline-flex h-12 items-center px-5 tracking-[0.2em] whitespace-nowrap desk:px-7 uppercase no-underline transition-colors duration-300"
            >
              Get directions
            </a>
            <a
              href={MAP_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="t-ui nav-underline tracking-[0.2em] text-ink uppercase no-underline"
            >
              Open in Maps
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
