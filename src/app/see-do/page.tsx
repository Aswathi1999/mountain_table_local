import { SeeDoActivities } from "@/components/sections/see-do/SeeDoActivities";
import { SeeDoHero } from "@/components/sections/see-do/SeeDoHero";
import { SeeDoPlan } from "@/components/sections/see-do/SeeDoPlan";
import { pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/see-do");

export default function SeeDoPage() {
  return (
    <div className="seedo-page">
      <SeeDoHero />
      <SeeDoActivities />
      <SeeDoPlan />
    </div>
  );
}
