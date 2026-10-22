import { copy } from "@/data/copy";
import { rv } from "@/lib/reveal";
import { pos } from "@/lib/stage";
import { Block } from "@/components/ui/Block";
import { InstagramFeed } from "@/components/ui/InstagramFeed";

const O = { d: 1525, m: 2045 };

/** "Explore & Follow Us" with the Instagram grid. */
export function AboutFollow() {
  return (
    <Block d={709} m={386} id="follow" label="Follow us on Instagram">
      <h2
        className="at m-0 text-[1.125rem] leading-[normal] font-normal text-muted italic desk:text-[40px] desk:leading-[52px] desk:text-ink desk:not-italic"
        {...rv("fade")}
        style={pos(O, [470, 1606, 420, 51], [140, 2087, 180, 23])}
      >
        {copy.about.followTitle}
      </h2>
      <InstagramFeed style={pos(O, [150, 1673, 980, 506], [22, 2123, 278, 278])} />
      <div
        className="at border-t border-rule max-desk:border-rule-soft"
        {...rv("grow")}
        style={pos(O, [206, 2210, 850, 6], [24, 2411, 276, 5])}
      />
    </Block>
  );
}
