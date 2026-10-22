import { AboutClosing } from "@/components/sections/about/AboutClosing";
import { AboutExperience } from "@/components/sections/about/AboutExperience";
import { AboutFollow } from "@/components/sections/about/AboutFollow";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutLocation } from "@/components/sections/about/AboutLocation";
import { AboutPhilosophy } from "@/components/sections/about/AboutPhilosophy";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/about");

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutHero />
      <AboutStory />
      <AboutPhilosophy />
      <AboutLocation />
      <AboutExperience />
      <div className="overflow-x-auto bg-ivory">
        <AboutFollow />
      </div>
      <AboutClosing />
    </div>
  );
}
