import { Lines, Reveal } from "@/components/motion/primitives";
import { InstagramFeed } from "@/components/ui/InstagramFeed";
import { copy } from "@/data/copy";
import { social } from "@/lib/site";

/** "Explore & Follow Us": the Instagram tiles, with the heading and a link to the profile above. */
export function AboutFollow() {
  return (
    <section id="follow" aria-labelledby="follow-title" className="bg-ivory-deep relative py-20 desk:py-32">
      <div className="wrap">
        <div className="flex flex-col gap-6 desk:flex-row desk:items-end desk:justify-between">
          <Lines id="follow-title" as="h2" lines={[copy.about.followTitle]} className="t-h2 text-forest m-0" />
          <Reveal delay={0.1}>
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="link-u t-ui text-forest">
              Follow on Instagram<span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Reveal>
        </div>
        <div className="mt-10 desk:mt-14">
          <InstagramFeed />
        </div>
      </div>
    </section>
  );
}
