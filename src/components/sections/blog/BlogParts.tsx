import Link from "next/link";
import { formatDate, type BlogPost } from "@/data/blog";
import { rv, stagger } from "@/lib/reveal";
import { RevealImage } from "@/components/ui/editorial";

/** Date · category · author, each shown only when the article has it. */
export function PostMeta({ post, tone = "gold" }: { post: BlogPost; tone?: "gold" | "light" }) {
  const parts = [
    post.date ? formatDate(post.date) : null,
    post.category ?? null,
    post.author ? `By ${post.author}` : null,
  ].filter(Boolean) as string[];
  if (!parts.length) return null;
  return (
    <p className={`t-label m-0 uppercase ${tone === "gold" ? "text-gold-ink" : "text-gold-soft"}`}>
      {parts.join("  ·  ")}
    </p>
  );
}

const readMore =
  "t-ui group/rm mt-6 inline-flex items-center gap-3 text-forest uppercase no-underline after:transition-transform after:duration-500 after:content-['→'] hover:after:translate-x-2 focus-visible:after:translate-x-2";

/** The lead article: large image beside its title, excerpt and link. */
export function FeaturedPost({ post }: { post: BlogPost }) {
  return (
    <article className="group grid items-center gap-8 desk:grid-cols-12 desk:gap-x-12">
      {post.image ? (
        <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="block desk:col-span-7">
          <RevealImage
            src={post.image.src}
            alt=""
            sizes="(min-width: 1000px) 700px, 92vw"
            className="aspect-[4/3] w-full"
            zoomOnHover
            priority
          />
        </Link>
      ) : null}
      <div className={post.image ? "desk:col-span-5" : "desk:col-span-8"} {...rv("rise", "rise", stagger(0.1))}>
        <PostMeta post={post} />
        <h2 className="t-h2 m-0 mt-4 text-forest">{post.title}</h2>
        <p className="t-body m-0 mt-5 text-muted">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className={readMore}>
          Read more<span className="sr-only">: {post.title}</span>
        </Link>
      </div>
    </article>
  );
}

/** A listing card: 4:3 image above the metadata, title, excerpt and link. */
export function PostCard({ post, index }: { post: BlogPost; index: number }) {
  return (
    <article className="group flex flex-col" {...rv("rise", "rise", stagger((index % 3) * 0.1))}>
      {post.image ? (
        <Link href={`/blog/${post.slug}`} tabIndex={-1} aria-hidden="true" className="block">
          <RevealImage
            src={post.image.src}
            alt=""
            sizes="(min-width: 1000px) 370px, 92vw"
            className="aspect-[4/3] w-full"
            zoomOnHover
          />
        </Link>
      ) : null}
      <div className="mt-6 border-t border-gold/50 pt-5">
        <PostMeta post={post} />
        <h3 className="t-h4 m-0 mt-3 text-forest">{post.title}</h3>
        <p className="t-small m-0 mt-3 text-muted">{post.excerpt}</p>
        <Link href={`/blog/${post.slug}`} className={readMore}>
          Read more<span className="sr-only">: {post.title}</span>
        </Link>
      </div>
    </article>
  );
}
