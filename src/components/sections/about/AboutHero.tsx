import { PageHero } from "@/components/sections/PageHero";
import { copy } from "@/data/copy";

/** First sentence of the existing story, used as the hero introduction. */
const intro = `${copy.about.story[0].split(". ")[0]}.`;

/** About hero: the shared inner-page hero with the About copy. */
export function AboutHero() {
  return (
    <PageHero
      id="about-hero"
      titleId="about-title"
      image={{ src: "/images/about/hero.jpg", position: "50% 40%" }}
      crumb="About Us"
      eyebrow="Our story"
      lines={["About", "The Mountain Table"]}
      intro={intro}
    />
  );
}
