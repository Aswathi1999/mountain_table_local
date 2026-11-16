import Image from "next/image";
import { Lines, Reveal } from "@/components/motion/primitives";
import { instagramPosts, type InstagramPost } from "@/data/instagram";
import { copy } from "@/data/copy";
import { social } from "@/lib/site";
import "./AboutFollow.css";

/** All of the feed, split across two strips. */
const half = Math.ceil(instagramPosts.length / 2);
const rows = [instagramPosts.slice(0, half), instagramPosts.slice(half)] as const;

/** One copy of a strip's photographs, each in a portrait frame with a fine outline ring. The second copy only exists to make the loop seamless. */
function Group({ posts, start, hidden }: { posts: readonly InstagramPost[]; start: number; hidden?: boolean }) {
  return (
    <div className="follow-group" aria-hidden={hidden || undefined}>
      {posts.map((post, i) => {
        const number = start + i + 1;
        return (
          <a
            key={post.src}
            href={post.href}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={hidden ? -1 : undefined}
            aria-label={`Instagram ${post.type === "VIDEO" ? "reel" : "post"} ${number} (opens in a new tab)`}
            className="follow-tile"
          >
            <span className="follow-photo img-zoom">
              <Image
                src={post.src}
                alt=""
                fill
                sizes="(min-width: 1024px) 25vw, (min-width: 750px) 33vw, 50vw"
                className="object-cover"
                loading="lazy"
              />
            </span>
          </a>
        );
      })}
    </div>
  );
}

/** One slowly drifting strip. `reverse` runs it left to right; otherwise it runs right to left. Hover or focus pauses it. */
function Strip({
  posts,
  start,
  reverse,
  label,
}: {
  posts: readonly InstagramPost[];
  start: number;
  reverse?: boolean;
  label: string;
}) {
  return (
    <div className="follow-strip" role="group" aria-label={label}>
      <div className={`follow-track${reverse ? " follow-track-reverse" : ""}`}>
        <Group posts={posts} start={start} />
        <Group posts={posts} start={start} hidden />
      </div>
    </div>
  );
}

/** "Explore & Follow Us": a centred heading over two drifting strips of portrait-framed Instagram photographs (the first moves left to right, the second right to left), then the profile link. */
export function AboutFollow() {
  return (
    <section
      id="follow"
      aria-labelledby="follow-title"
      className="bg-ivory-deep relative overflow-hidden py-20 desk:py-32"
    >
      <div className="wrap">
        <div className="flex flex-col items-center text-center">
          <Lines id="follow-title" as="h2" lines={[copy.about.followTitle]} className="t-h2 text-forest m-0" />
        </div>
      </div>
      <Strip posts={rows[0]} start={0} reverse label="Instagram posts, first row" />
      <Strip posts={rows[1]} start={half} label="Instagram posts, second row" />
      <div className="wrap">
        <Reveal delay={0.1} className="mt-8 flex justify-center desk:mt-12">
          <a
            href={social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="border-forest text-forest hover:bg-forest hover:text-ivory t-ui inline-flex items-center rounded-full border px-8 py-3 no-underline transition-colors duration-300"
          >
            Follow on Instagram<span className="sr-only"> (opens in a new tab)</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
