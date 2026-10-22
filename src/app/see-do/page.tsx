import { SeeDoActivities } from "@/components/sections/see-do/SeeDoActivities";
import { SeeDoEscapes } from "@/components/sections/see-do/SeeDoEscapes";
import { SeeDoIntro } from "@/components/sections/see-do/SeeDoIntro";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/see-do");

export default function SeeDoPage() {
  return (
    <div className="seedo-page">
      <SeeDoIntro />
      <SeeDoEscapes />
      <SeeDoActivities />
    </div>
  );
}
