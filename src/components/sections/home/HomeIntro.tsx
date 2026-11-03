import type { ReactNode } from "react";
import { ExperienceStory } from "./ExperienceStory";

/**
 * The section after the hero, told as a short arrival in two beats:
 *  1. The Experience: an overlapping pair of photographs on a soft arch with a leaf sprig and a handwritten signature, beside the
 *     headline, paragraph, three icon rows and a "Discover More" link (all as in the design reference).
 *  2. Whatever follows it (`afterExperience`).
 * The house story lives in `HomeHouse`, directly under the hero.
 */
export function HomeIntro({ afterExperience }: { afterExperience?: ReactNode }) {
  return (
    <>
      <ExperienceStory />

      {afterExperience}
    </>
  );
}
