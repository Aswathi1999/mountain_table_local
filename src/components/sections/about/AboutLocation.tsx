import { contact, DIRECTIONS_URL, MAP_PAGE_URL } from "@/lib/site";
import { rv, stagger } from "@/lib/reveal";
import { Eyebrow, RevealImage, Rule } from "@/components/ui/editorial";

const facts = [
  { label: "Setting", value: "Hills of Ulupuni, Wagamon" },
  { label: "Views", value: "Tea plantations, majestic mountains and serene valleys" },
  { label: "From the pool", value: "Idukki Dam and lush hills" },
] as const;

/** "The Location": aerial photograph of the house in the plantation, the setting described, directions linked. */
export function AboutLocation() {
  return (
    <section id="location-story" aria-labelledby="setting-title" className="relative bg-ivory py-24 desk:py-[150px]">
      <div className="mx-auto max-w-[1180px] px-6 desk:px-8">
        <div className="grid gap-12 desk:grid-cols-12 desk:gap-x-10">
          <div className="relative desk:col-span-8">
            <RevealImage
              src="/images/81d784_a30ae9d65f7a4c158c25796451fed75f.jpg"
              alt="Aerial view of The Mountain Table's thatched house among the tea plantations"
              sizes="(min-width: 750px) 780px, 100vw"
              reveal="wipe"
              className="aspect-[4/3] w-full desk:aspect-[16/12]"
              drift={0.08}
            />
          </div>
          <div className="desk:col-span-4 desk:pt-24">
            <Eyebrow>The Setting</Eyebrow>
            <h2 id="setting-title" className="t-h2 m-0 mt-6 text-forest" {...rv("rise", "rise", stagger(0.1))}>
              In the hills of Ulupuni
            </h2>
            <p className="t-body m-0 mt-7 text-muted" {...rv("rise", "rise", stagger(0.2))}>
              Spread over lush acres in the picturesque hills of Wagamon, our eco-friendly retreat offers panoramic
              views of tea plantations, majestic mountains and serene valleys.
            </p>
          </div>
        </div>

        <dl className="m-0 mt-16 grid gap-10 desk:mt-24 desk:grid-cols-3 desk:gap-x-10">
          {facts.map((f, n) => (
            <div key={f.label} {...rv("rise", "rise", stagger(n * 0.12))}>
              <Rule className="bg-gold/60" delay={n * 0.12} />
              <dt className="t-label mt-5 tracking-[0.3em] text-gold-ink uppercase">{f.label}</dt>
              <dd className="t-h4 m-0 mt-3 text-forest">{f.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-16 grid items-end gap-8 desk:mt-24 desk:grid-cols-12 desk:gap-x-10">
          <address className="t-lead m-0 text-ink not-italic desk:col-span-6" {...rv("rise", "rise")}>
            {contact.address}
          </address>
          <div
            className="flex flex-wrap items-center gap-x-9 gap-y-5 desk:col-span-6 desk:justify-end"
            {...rv("rise", "rise", stagger(0.15))}
          >
            <a
              href={DIRECTIONS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label group inline-flex h-[52px] items-center gap-3 bg-forest px-8 tracking-[0.26em] text-ivory uppercase no-underline transition-colors duration-500 hover:bg-gold-ink focus-visible:bg-gold-ink"
            >
              Get directions
              <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-1.5">
                →
              </span>
              <span className="sr-only">(opens Google Maps in a new tab)</span>
            </a>
            <a
              href={MAP_PAGE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="t-label about-link pb-1 tracking-[0.26em] text-forest uppercase no-underline"
            >
              Open in Maps<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
