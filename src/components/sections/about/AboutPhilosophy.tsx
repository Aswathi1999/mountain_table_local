import { copy } from "@/data/copy";
import { rv, stagger } from "@/lib/reveal";
import { Eyebrow, RevealImage, Rule } from "@/components/ui/editorial";

/** Each line is taken from the existing story; only the short headings are new. */
const values = [
  {
    title: "Rooted in nature",
    text: "What once was a chaotic landscape of bushes and shrubs evolved into a serene tea plantation, crafted through years of dedication.",
  },
  {
    title: "Rustic comfort",
    text: "Our accommodations blend modern comfort with rustic charm, inviting guests to wake up to birdsong and panoramic views.",
  },
  {
    title: "Local flavours",
    text: "Culinary delights await, crafted from local ingredients by our skilled chefs, and grilled dishes at our forest-set grill house.",
  },
] as const;

const lead =
  "Driven by a vision of eco-friendly hospitality, The Mountain Table emerged as a haven where nature's harmony thrives.";

/** "Our Philosophy": numbered statements divided by hairlines, then the sustainability feature. */
export function AboutPhilosophy() {
  return (
    <section
      id="philosophy"
      aria-labelledby="philosophy-title"
      className="relative bg-forest py-24 text-ivory desk:py-[150px]"
    >
      <div className="mx-auto grid max-w-[1180px] gap-14 px-6 desk:grid-cols-12 desk:gap-x-10 desk:px-8">
        <header className="desk:col-span-4">
          <div className="desk:sticky desk:top-32">
            <Eyebrow tone="light">Philosophy</Eyebrow>
            <h2 id="philosophy-title" className="t-h1 m-0 mt-6" {...rv("rise", "rise", stagger(0.1))}>
              Our Philosophy
            </h2>
            <p className="t-body m-0 mt-8 max-w-[22rem] text-ivory/80" {...rv("rise", "rise", stagger(0.2))}>
              {lead}
            </p>
          </div>
        </header>

        <ol className="m-0 list-none p-0 desk:col-span-7 desk:col-start-6">
          {values.map((v, n) => (
            <li key={v.title} className="group">
              <Rule className="bg-white/20 transition-colors duration-500 group-hover:bg-gold" />
              <div
                className="grid gap-4 py-9 desk:grid-cols-[88px_1fr] desk:gap-8 desk:py-12"
                {...rv("rise", "rise", stagger(0.1))}
              >
                <span className="t-h4 text-gold-soft">{String(n + 1).padStart(2, "0")}</span>
                <div className="transition-transform duration-700 ease-out group-hover:translate-x-2">
                  <h3 className="t-h3 m-0">{v.title}</h3>
                  <p className="t-body m-0 mt-4 max-w-[34rem] text-ivory/75">{v.text}</p>
                </div>
              </div>
            </li>
          ))}
          <li>
            <Rule className="bg-white/20" />
          </li>
        </ol>
      </div>

      <div className="mx-auto mt-24 grid max-w-[1180px] items-center gap-12 px-6 desk:mt-[150px] desk:grid-cols-12 desk:gap-x-10 desk:px-8">
        <RevealImage
          src="/images/c18256_90e3f3e6801e4781854e622b194e9b04.jpg"
          alt="Thatched roof against a blue sky"
          sizes="(min-width: 750px) 400px, 90vw"
          className="aspect-[4/5] w-full desk:col-span-4 desk:aspect-[3/4]"
          drift={0.06}
        />
        <div className="desk:col-span-7 desk:col-start-6">
          <Eyebrow tone="light">Sustainability</Eyebrow>
          <h3 className="t-h2 m-0 mt-6" {...rv("rise", "rise", stagger(0.1))}>
            {copy.about.commitmentTitle}
          </h3>
          <p className="t-body m-0 mt-8 max-w-[36rem] text-ivory/80" {...rv("rise", "rise", stagger(0.2))}>
            {copy.about.commitmentBody}
          </p>
        </div>
      </div>
    </section>
  );
}
