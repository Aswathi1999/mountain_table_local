import { copy } from "@/data/copy";
import { rv, stagger } from "@/lib/reveal";
import { Eyebrow, RevealImage, Rule } from "@/components/ui/editorial";

const [lead, ...rest] = copy.about.story;
// The drop cap is the lead paragraph's first letter; the rest of the paragraph follows unchanged.
const dropCap = lead.charAt(0);
const leadRest = lead.slice(1);

/** "Our Story": tall moss-wall photograph with a smaller plantation frame, the story set beside it. */
export function AboutStory() {
  return (
    <section id="story" aria-labelledby="story-title" className="relative bg-ivory py-24 desk:py-[150px]">
      <div className="mx-auto grid max-w-[1180px] gap-14 px-6 desk:grid-cols-12 desk:gap-x-10 desk:px-8">
        <div className="relative desk:col-span-5">
          <RevealImage
            src="/images/c18256_bca9ca65f306415a95ae5b159b661421.jpg"
            alt="Moss-covered stone wall beside a garden path"
            sizes="(min-width: 750px) 460px, 90vw"
            className="aspect-[4/5] w-[88%] desk:w-full"
            drift={0.07}
          />
          <RevealImage
            src="/images/c18256_13d5e4f454de4cdd85681b5304521f32.jpg"
            alt="A stone path between tea bushes"
            sizes="(min-width: 750px) 260px, 50vw"
            reveal="wipe"
            delay={0.25}
            className="absolute -right-2 -bottom-10 aspect-[3/4] w-[46%] border-[6px] border-ivory desk:-right-16 desk:-bottom-16 desk:w-[52%] desk:border-[10px]"
            position="50% 40%"
          />
        </div>

        <div className="desk:col-span-6 desk:col-start-7 desk:pt-16">
          <Eyebrow>Our Story</Eyebrow>
          <h2 id="story-title" className="t-h1 m-0 mt-6 text-forest" {...rv("rise", "rise", stagger(0.1))}>
            {copy.about.titleLines.join(" ")}
          </h2>
          <div className="mt-8 max-w-[34rem]">
            <Rule className="bg-gold/70" delay={0.2} />
          </div>

          <p className="t-lead m-0 mt-9 max-w-[34rem] text-ink" {...rv("rise", "rise", stagger(0.15))}>
            <span
              className="float-left mt-1 mr-3 text-[4.4rem] leading-[0.8] text-gold-ink desk:text-[84px]"
              aria-hidden="true"
            >
              {dropCap}
            </span>
            <span className="sr-only">{dropCap}</span>
            {leadRest}
          </p>

          <blockquote
            className="t-h4 m-0 mt-10 max-w-[30rem] border-l border-gold pl-6 text-forest"
            {...rv("rise", "rise")}
          >
            Wake up to birdsong and panoramic views.
          </blockquote>

          <div className="mt-10 flex max-w-[34rem] flex-col gap-6">
            {rest.map((paragraph, n) => (
              <p key={n} className="t-body m-0 text-muted" {...rv("rise", "rise")}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
