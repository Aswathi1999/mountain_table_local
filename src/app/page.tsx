import { JsonLd } from "@/components/seo/JsonLd";
import { HomeDiscover } from "@/components/sections/home/HomeDiscover";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { HomeIntro } from "@/components/sections/home/HomeIntro";
import { HomeReviews } from "@/components/sections/home/HomeReviews";
import { HomeRoomsPreview } from "@/components/sections/home/HomeRoomsPreview";
import { HomeServices } from "@/components/sections/home/HomeServices";
import { pageJsonLd, pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/");

export default function HomePage() {
  return (
    <div className="home-page">
      {pageJsonLd("/").map((block, i) => (
        <JsonLd key={i} data={block} />
      ))}
      <HomeHero />
      <HomeIntro afterExperience={<HomeDiscover />} />
      <HomeServices />
      <HomeRoomsPreview />
      <HomeReviews />
    </div>
  );
}
