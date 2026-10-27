"use client";

import Link from "next/link";
import { Lines, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { copy } from "@/data/copy";
import { ACTIVITY_ICONS } from "./SeeDoNav";
import { splitTitle } from "./title";

/**
 * How the existing activities fall across a day. Only what the page already says is used: the barbecue is an evening ("an
 * unforgettable evening of BBQ and music"), the elephants are watched from the homestay, and the rest are the day's outings.
 * Nothing here adds a time, a price or a duration.
 */
const PARTS = [
  { title: "By day", note: "Out on the trails and over the valley", items: [0, 1, 2, 3] },
  { title: "In the evening", note: "Around the fire, under the stars", items: [4] },
  { title: "From the homestay", note: "Watching the meadows", items: [5] },
] as const;

/** "Plan your day": three soft cards grouping the six activities, each linking to its section above. */
export function SeeDoPlan() {
  return (
    <section id="plan" aria-labelledby="plan-title" className="bg-ivory relative py-20 desk:py-28">
      <div className="wrap">
        <div className="mx-auto mb-12 flex max-w-[40rem] flex-col items-center text-center desk:mb-14">
          <Reveal>
            <p className="t-eyebrow text-forest before:h-px before:w-14 before:bg-current before:opacity-35 before:content-['']">
              Make the most of your stay
            </p>
          </Reveal>
          <Lines id="plan-title" as="h2" lines={["Plan your day"]} className="t-h2 text-forest m-0 mt-4" />
        </div>

        <Stagger step={0.12} className="grid items-start gap-6 lg:grid-cols-3">
          {PARTS.map((part) => (
            <StaggerItem key={part.title}>
              <article className="flex flex-col rounded-[18px] bg-[#fffdf8] p-8 shadow-[0_10px_30px_rgba(10,34,27,0.06)]">
                <h3 className="t-h4 text-forest m-0">{part.title}</h3>
                <p className="t-small text-ink/65 m-0 mt-1">{part.note}</p>
                <ul className="m-0 mt-6 flex list-none flex-col gap-1 p-0">
                  {part.items.map((i) => {
                    const a = copy.seeDo.activities[i];
                    const [name] = splitTitle(a.title);
                    return (
                      <li key={name}>
                        <Link
                          href={`#activity-${i + 1}`}
                          className="group border-forest/10 hover:border-forest/25 flex items-center gap-4 border-t py-4 no-underline transition-colors first:border-t-0"
                        >
                          <span className="bg-ivory-deep border-gold/40 group-hover:bg-gold/25 flex size-[3rem] shrink-0 items-center justify-center rounded-full border text-forest transition-colors duration-500">
                            {ACTIVITY_ICONS[i]}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="t-h4 text-forest block [font-size:1.3125rem]">{name}</span>
                            <span className="t-small text-ink/65 block [font-size:0.8125rem]">{a.subtitle}</span>
                          </span>
                          <svg
                            viewBox="0 0 24 24"
                            className="text-forest size-4 shrink-0 transition-transform duration-500 group-hover:translate-x-1.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            aria-hidden="true"
                          >
                            <path d="M4 12h15M13 6l6 6-6 6" />
                          </svg>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
