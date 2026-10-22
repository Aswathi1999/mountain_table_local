import Image from "next/image";
import { instagramPosts, type InstagramPost } from "@/data/instagram";
import { posRel } from "@/lib/stage";

const iconProps = { viewBox: "0 0 24 24", fill: "#fff", className: "size-6", "aria-hidden": true } as const;

function Badge({ type }: { type: InstagramPost["type"] }) {
  if (type === "IMAGE") return null;
  return (
    <span className="absolute top-[12px] right-[12px] flex h-7 w-10 items-center justify-center rounded-[3px] bg-black/55 max-desk:top-[0.5rem] max-desk:right-[0.5rem] max-desk:h-[1.4rem] max-desk:w-[1.9rem]">
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

/**
 * Static rebuild of the original's Instagram widget (a Wix iframe): rounded tiles on a fixed grid, linking to the posts.
 * The 12 photos were captured from the feed and are served locally (see EXTERNAL.md).
 */
export function InstagramFeed({ style, className = "" }: { style: React.CSSProperties; className?: string }) {
  return (
    <div className={`at ${className}`} style={style}>
      {instagramPosts.map((post, i) => (
        <a
          key={post.src}
          href={post.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Instagram ${post.type === "VIDEO" ? "reel" : "post"} ${i + 1}`}
          className={`at overflow-hidden rounded-[24px] max-desk:rounded-[1.5rem] ${post.mobile ? "" : "max-desk:hidden"}`}
          style={posRel(post.desktop, post.mobile ?? undefined)}
        >
          <Image
            src={post.src}
            alt=""
            fill
            sizes="(min-width: 750px) 308px, 88px"
            className="object-cover"
            loading={i < 6 ? "eager" : "lazy"}
          />
          <Badge type={post.type} />
        </a>
      ))}
    </div>
  );
}
