import { AboutFollow } from "@/components/sections/about/AboutFollow";
import { AboutHero } from "@/components/sections/about/AboutHero";
import { AboutPromise } from "@/components/sections/about/AboutPromise";
import { AboutQuote } from "@/components/sections/about/AboutQuote";
import { AboutStory } from "@/components/sections/about/AboutStory";
import { AboutTiles } from "@/components/sections/about/AboutTiles";
import { AboutValues } from "@/components/sections/about/AboutValues";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/about");

export default function AboutPage() {
  return (
    <div className="about-page">
      <AboutHero />
      <AboutStory />
      <AboutValues />
      <AboutQuote />
      <AboutTiles />
      <AboutPromise />
      <AboutFollow />
    </div>
  );
}
