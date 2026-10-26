import Image from "next/image";
import { Stagger, StaggerItem } from "@/components/motion/primitives";
import { instagramPosts, type InstagramPost } from "@/data/instagram";

const iconProps = { viewBox: "0 0 24 24", fill: "#fff", className: "size-5", "aria-hidden": true } as const;

function Badge({ type }: { type: InstagramPost["type"] }) {
  if (type === "IMAGE") return null;
  return (
    <span className="bg-black/55 absolute top-2 right-2 flex h-6 w-8 items-center justify-center desk:top-3 desk:right-3 desk:h-7 desk:w-10">
      {type === "VIDEO" ? (
        <svg {...iconProps}>
          <path d="M4 9h5.5l-3-5h-1A1.5 1.5 0 0 0 4 5.5V9Zm11.5 0H11L8 4h4.5l3 5ZM17 9l-3-5h4.5A1.5 1.5 0 0 1 20 5.5V9h-3Z" />
          <path
            fillRule="evenodd"
            d="M20 10H4v8.5A1.5 1.5 0 0 0 5.5 20h13a1.5 1.5 0 0 0 1.5-1.5V10Zm-9 2.236v3.528c0 .185.185.298.328.2l2.571-1.764a.248.248 0 0 0 0-.4l-2.571-1.764c-.143-.098-.328.015-.328.2Z"
          />
        </svg>
      ) : (
        <svg {...iconProps}>
          <path d="M8 3h10.5A1.5 1.5 0 0 1 20 4.5V15h-2V5H8V3Z" />
          <rect x="4" y="7" width="12" height="13" rx="1.5" />
        </svg>
      )}
    </span>
  );
}

/** Grid areas (row / column) of the twelve tiles on the 6 x 3 desktop grid, matching the original widget's layout in data order. */
const AREAS = [
  "desk:[grid-area:1/1]",
  "desk:[grid-area:1/2]",
  "desk:[grid-area:2/1/span_2/span_2]",
  "desk:[grid-area:1/3]",
  "desk:[grid-area:2/3]",
  "desk:[grid-area:3/3]",
  "desk:[grid-area:1/4/span_2/span_2]",
  "desk:[grid-area:3/4]",
  "desk:[grid-area:3/5]",
  "desk:[grid-area:1/6]",
  "desk:[grid-area:2/6]",
  "desk:[grid-area:3/6]",
] as const;

/**
 * Rebuild of the original's Instagram widget (a Wix iframe): square tiles linking to the posts, on the original's 6 x 3 grid with
 * two double-size tiles on desktop and the first nine on mobile (3 x 3). The photos were captured from the feed and are served
 * locally (see EXTERNAL.md). Tiles enter one after another and zoom slowly on hover.
 */
export function InstagramFeed({ className = "" }: { className?: string }) {
  return (
    <Stagger
      step={0.06}
      className={`grid grid-cols-3 gap-1.5 desk:aspect-[980/506] desk:grid-cols-6 desk:grid-rows-3 desk:gap-2${className}`}
    >
      {instagramPosts.map((post, i) => (
        <StaggerItem key={post.src} y={16} className={`${post.mobile ? "" : "max-desk:hidden"} ${AREAS[i] ?? ""}`}>
          <a
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Instagram ${post.type === "VIDEO" ? "reel" : "post"} ${i + 1}`}
            className="group bg-ivory relative block aspect-square overflow-hidden desk:aspect-auto desk:h-full"
          >
            <span className="img-zoom relative block size-full">
              <Image
                src={post.src}
                alt=""
                fill
                sizes={post.desktop[2] > 200 ? "(min-width: 750px) 32vw, 33vw" : "(min-width: 750px) 16vw, 33vw"}
                className="object-cover"
                loading={i < 6 ? "eager" : "lazy"}
              />
            </span>
            <Badge type={post.type} />
          </a>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
