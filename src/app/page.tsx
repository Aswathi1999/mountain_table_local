import { CustomCursor } from "@/components/motion/CustomCursor";
import { JsonLd } from "@/components/seo/JsonLd";
import { HomeDiscover } from "@/components/sections/home/HomeDiscover";
import { HomeHero } from "@/components/sections/home/HomeHero";
import { HomeHouse } from "@/components/sections/home/HomeHouse";
import { HomeIntro } from "@/components/sections/home/HomeIntro";
import { MomentsStrip } from "@/components/sections/home/MomentsStrip";
import { HomeReviews } from "@/components/sections/home/HomeReviews";
import { HomeRoomsSlider } from "@/components/sections/home/HomeRoomsSlider";
import { HomeServices } from "@/components/sections/home/HomeServices";
import { pageJsonLd, pageMetadata } from "@/lib/metadata";

export const metadata = pageMetadata("/");

export default function HomePage() {
  return (
    <div className="home-page">
      <CustomCursor />
      {pageJsonLd("/").map((block, i) => (
        <JsonLd key={i} data={block} />
      ))}
      <HomeHero />
      <HomeHouse />
      <HomeIntro
        afterExperience={
          <>
            <HomeDiscover />
            <HomeRoomsSlider />
          </>
        }
      />
      <HomeServices />
      <MomentsStrip />
      <HomeReviews />
    </div>
  );
}
