import { copy } from "@/data/copy";
import { rv } from "@/lib/reveal";
import { pos } from "@/lib/stage";
import { Block } from "@/components/ui/Block";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { PillButton } from "@/components/ui/PillButton";

const O = { d: 2160, m: 1524 };

/** Bedroom image strip with the white "Our rooms" card laid over it. */
export function HomeRooms() {
  return (
    <Block d={822} m={610} id="rooms" label="Our rooms">
      <div className="at overflow-hidden" style={pos(O, [150, 2160, 980, 822], [0, 1524, 320, 610])}>
        <ParallaxImage
          src="/images/c18256_989549b27d9e4d7b8dacd876f73eb8b7.jpg"
          alt="A bedroom with a large bed and glass walls"
          sizes="(min-width: 750px) 980px, 100vw"
          k={0.8}
          km={1}
        />
      </div>
      <div
        className="at border border-gold/60 bg-ivory"
        {...rv("fade")}
        style={pos(O, [701, 2281, 391, 634], [31, 1544, 258, 556])}
      />
      <h2
        className="t-h4 at m-0 text-center tracking-[0.12em] text-forest"
        {...rv("fade")}
        style={pos(O, [753, 2376, 287, 36], [69, 1589, 182, 28])}
      >
        {copy.home.roomsTitle}
      </h2>
      <div
        className="at text-center text-[1rem] leading-6 text-muted italic desk:text-[18px] desk:leading-[27px]"
        {...rv("fade")}
        style={pos(O, [753, 2447, 287, 351], [57, 1637, 205, 360])}
      >
        {copy.home.roomsBody.map((p) => (
          <p key={p} className="m-0">
            {p}
          </p>
        ))}
      </div>
      <PillButton href="/rooms-booking" arrow tone="forest" style={pos(O, [825, 2830, 148, 42], [105, 2029, 110, 37])}>
        Explore
      </PillButton>
    </Block>
  );
}
