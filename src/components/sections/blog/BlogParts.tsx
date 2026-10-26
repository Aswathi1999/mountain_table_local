import Image from "next/image";
import Link from "next/link";
import { ImageFrame, Lines, Reveal, Rule } from "@/components/motion/primitives";
import { formatDate, type BlogPost } from "@/data/blog";

/** Date, category and author as a single quiet line, each shown only when the article has it. */
export function postMetaParts(post: BlogPost): string[] {
  return [
    post.date ? formatDate(post.date) : null,
    post.category ?? null,
    post.author ? `By ${post.author}` : null,
  ].filter(Boolean) as string[];
}

export function PostMeta({ post, className = "text-gold-ink" }: { post: BlogPost; className?: string }) {
  const parts = postMetaParts(post);
  if (!parts.length) return null;
  return <p className={`t-small m-0 ${className}`}>{parts.join("  ·  ")}</p>;
}

const readMore = "t-ui link-u text-forest mt-8 inline-block no-underline";

/**
 * The lead story: a large photograph (uncovered from the left, with a slow scroll drift and a hover zoom) and an ivory panel
 * with the title that overlaps its lower right corner.
 */
export function FeaturedPost({ post }: { post: BlogPost }) {
  const href = `/blog/${post.slug}`;
  return (
    <article className="group relative grid items-end gap-y-0 desk:grid-cols-12">
      {post.image ? (
        <Link
          href={href}
          tabIndex={-1}
          aria-hidden="true"
          className="block desk:col-span-8 desk:col-start-1 desk:row-start-1"
        >
          <ImageFrame
            src={post.image.src}
            alt=""
            sizes="(min-width: 1280px) 820px, (min-width: 750px) 66vw, 92vw"
            className="aspect-[4/3] w-full desk:aspect-[5/4]"
            from="left"
            drift={4}
            zoomOnHover
          />
        </Link>
      ) : null}
      <div
        className={`bg-ivory-deep relative z-10 ${
          post.image
            ? "mx-5 -mt-10 p-7 desk:col-span-6 desk:col-start-7 desk:row-start-1 desk:mx-0 desk:mt-0 desk:mb-16 desk:p-12"
            : "desk:col-span-8 desk:col-start-3"
        }`}
      >
        <Reveal delay={0.1}>
          <PostMeta post={post} />
        </Reveal>
        <Reveal delay={0.15}>
          <h2 className="t-h2 text-forest m-0 mt-4">{post.title}</h2>
        </Reveal>
        <Reveal delay={0.25}>
          <p className="t-body text-ink m-0 mt-6">{post.excerpt}</p>
          <Link href={href} className={readMore}>
            Read the story<span className="sr-only">: {post.title}</span>
          </Link>
        </Reveal>
      </div>
    </article>
  );
}

/**
 * A quieter entry in the journal list: date and category in a left column, title and excerpt in the middle and, when the article
 * has a photograph, a small frame at the right that is uncovered on hover (always shown on touch screens).
 */
export function PostRow({ post, index }: { post: BlogPost; index: number }) {
  const href = `/blog/${post.slug}`;
  const meta = postMetaParts(post);
  return (
    <Reveal
      as="li"
      delay={(index % 3) * 0.06}
      className="border-forest/15 group relative border-t py-10 last:border-b desk:py-14"
    >
      <article className="grid gap-5 desk:grid-cols-12 desk:items-start desk:gap-x-10">
        <div className="t-small text-gold-ink desk:col-span-3">
          {meta.map((m) => (
            <p key={m} className="m-0">
              {m}
            </p>
          ))}
        </div>
        <div className="desk:col-span-6">
          <h3 className="t-h3 text-forest m-0 transition-transform duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-3 group-focus-within:translate-x-3 motion-reduce:transition-none">
            <Link href={href} className="text-forest no-underline after:absolute after:inset-0">
              {post.title}
            </Link>
          </h3>
          <p className="t-body text-muted m-0 mt-4">{post.excerpt}</p>
        </div>
        {post.image ? (
          <div
            aria-hidden="true"
            className="relative aspect-[4/3] overflow-hidden transition-[clip-path] duration-[900ms] ease-[cubic-bezier(0.77,0,0.18,1)] [clip-path:inset(0_0_0_100%)] group-hover:[clip-path:inset(0)] group-focus-within:[clip-path:inset(0)] motion-reduce:transition-none [@media(hover:none)]:[clip-path:inset(0)] max-[749px]:[clip-path:inset(0)] desk:col-span-3"
          >
            <Image
              src={post.image.src}
              alt=""
              fill
              sizes="(min-width: 1280px) 300px, (min-width: 750px) 25vw, 92vw"
              className="img-zoom object-cover"
            />
          </div>
        ) : null}
      </article>
    </Reveal>
  );
}

/** Blog masthead: the title and a line about the journal on forest green, with a tall photograph that hangs over the next section. */
export function BlogHero({ intro }: { intro: string }) {
  return (
    <section
      id="blog-hero"
      aria-labelledby="blog-title"
      className="bg-forest-deep text-ivory relative z-10 pt-12 pb-24 desk:pt-24 desk:pb-0"
    >
      <div className="wrap grid gap-12 desk:grid-cols-12 desk:items-end desk:gap-x-12">
        <div className="desk:col-span-6 desk:pb-32">
          <Lines id="blog-title" as="h1" lines={["Blog"]} className="t-display m-0" immediate />
          <Rule className="bg-gold mt-8 max-w-24 desk:mt-10" delay={0.5} />
          <Reveal immediate delay={0.55} className="mt-8">
            <p className="t-lead text-ivory/85 m-0">{intro}</p>
          </Reveal>
        </div>
        <div className="relative desk:col-span-4 desk:col-start-9 desk:-mb-32">
          <ImageFrame
            src="/images/c18256_9bf951b03ba94f55a8d71c9ad2cd5249.jpg"
            alt=""
            sizes="(min-width: 1280px) 400px, (min-width: 750px) 33vw, 80vw"
            className="aspect-[4/5] w-4/5 max-desk:ml-auto desk:w-full"
            from="top"
            drift={5}
            priority
            position="50% 45%"
          />
        </div>
      </div>
    </section>
  );
}
