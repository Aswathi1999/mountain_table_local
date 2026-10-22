import type { CSSProperties } from "react";
import { copy } from "@/data/copy";
import { activityLayouts } from "@/data/seeDo";
import { rv, stagger } from "@/lib/reveal";
import { RevealImage } from "@/components/ui/editorial";

/** Splits "Jeep Safari (On Request)" into the big title and its smaller parenthesised qualifier. */
function splitTitle(title: string): [string, string | null] {
  const match = title.match(/^(.*?)\s*(\(.*\))$/);
  return match ? [match[1], match[2]] : [title, null];
}

/**
 * The six activities as an alternating editorial list: a tall photograph beside the title, subtitle and
 * description. Photos keep the original's directional entrance (they slide in from their own side).
 */
export function SeeDoActivities() {
  return (
    <section id="activities" aria-label="Activities" className="relative bg-ivory py-20 desk:py-[130px]">
      <div className="mx-auto flex max-w-[1180px] flex-col px-6 desk:px-8">
        {activityLayouts.map((layout, i) => {
          const text = copy.seeDo.activities[i];
          const [name, qualifier] = splitTitle(text.title);
          const photoRight = layout.side === "right";
          const flyStyle = { "--fly": photoRight ? "120px" : "-120px", "--fly-m": "70px" } as CSSProperties;
          return (
            <article
              key={name}
              aria-label={name}
              className={`group grid items-center gap-8 py-14 desk:grid-cols-12 desk:gap-x-14 desk:py-[90px] ${
                i === 0 ? "pt-0" : "border-t border-gold/40"
              }`}
            >
              <div
                className={`desk:col-span-5 ${photoRight ? "desk:order-2 desk:col-start-8" : "desk:col-start-1"}`}
                {...rv("fly", "fly-y", flyStyle)}
              >
                <RevealImage
                  src={layout.image.src}
                  alt={layout.image.alt}
                  sizes="(min-width: 750px) 460px, 90vw"
                  className={`aspect-[4/5] w-full ${i % 2 ? "desk:aspect-square" : ""}`}
                  reveal={photoRight ? "wipe" : "mask"}
                  zoomOnHover
                />
              </div>
              <div className={`desk:col-span-6 ${photoRight ? "desk:order-1 desk:col-start-1" : "desk:col-start-7"}`}>
                <div {...rv("rise", "rise")}>
                  <span
                    aria-hidden="true"
                    className="block h-px w-14 bg-gold transition-all duration-700 ease-out group-hover:w-28"
                  />
                  <h2 className="t-h1 m-0 mt-6 text-forest">
                    {name}
                    {qualifier ? " " : null}
                    {qualifier ? <span className="t-h4">{qualifier}</span> : null}
                  </h2>
                </div>
                <div {...rv("rise", "rise", stagger(0.15))}>
                  <h3 className="t-lead m-0 mt-6 text-gold-ink">{text.subtitle}</h3>
                  <div className="t-body mt-5 flex max-w-[34rem] flex-col gap-3 text-muted">
                    {text.body.map((paragraph, p) => (
                      <p key={p} className={`m-0 ${p > 0 ? "text-ink" : ""}`}>
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
