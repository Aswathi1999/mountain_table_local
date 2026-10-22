import Image from "next/image";
import Link from "next/link";
import { FeaturedPost, PostCard } from "@/components/sections/blog/BlogParts";
import { posts } from "@/data/blog";
import { pageMetadataFor } from "@/lib/metadata";
import { rv, stagger } from "@/lib/reveal";

export const metadata = pageMetadataFor(
  "/blog",
  "BLOG | The Mountain Table",
  "The Mountain Table blog: articles from our homestay in the hills of Ulupuni, Vagamon.",
);

export default function BlogPage() {
  const [featured, ...rest] = posts;
  return (
    <div className="blog-page">
      <section
        id="blog-hero"
        aria-labelledby="blog-title"
        className="relative isolate overflow-hidden bg-forest-deep py-24 text-ivory desk:py-[130px]"
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div data-drift="0.08" className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
            <Image
              src="/images/c18256_9bf951b03ba94f55a8d71c9ad2cd5249.jpg"
              alt=""
              fill
              sizes="100vw"
              priority
              className="object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(20,42,33,0.94),rgba(20,42,33,0.75)_55%,rgba(20,42,33,0.55))]" />
        </div>
        <div className="mx-auto max-w-[1180px] px-6 desk:px-8">
          <p className="t-label m-0 flex items-center gap-4 text-gold-soft uppercase" {...rv("rise", "rise")}>
            <span aria-hidden="true" className="block h-px w-10 bg-current" />
            The Mountain Table
          </p>
          <h1 id="blog-title" className="t-display m-0 mt-6" {...rv("rise", "rise", stagger(0.1))}>
            Blog
          </h1>
          <span aria-hidden="true" className="mt-8 block h-px w-24 bg-gold" {...rv("draw", "draw", stagger(0.2))} />
        </div>
      </section>

      <section aria-label="Articles" className="bg-ivory py-16 desk:py-[110px]">
        <div className="mx-auto max-w-[1180px] px-6 desk:px-8">
          {featured ? (
            <>
              <FeaturedPost post={featured} />
              {rest.length ? (
                <div className="mt-20 grid gap-x-10 gap-y-16 border-t border-gold/40 pt-16 min-[560px]:grid-cols-2 min-[1000px]:grid-cols-3 desk:mt-24 desk:pt-20">
                  {rest.map((post, i) => (
                    <PostCard key={post.slug} post={post} index={i} />
                  ))}
                </div>
              ) : null}
            </>
          ) : (
            <div className="mx-auto max-w-[34rem] py-10 text-center desk:py-16" {...rv("rise", "rise")}>
              <span aria-hidden="true" className="mx-auto block h-12 w-px bg-gold" />
              <p className="t-h4 m-0 mt-8 text-forest">No articles have been published yet.</p>
              <p className="t-body m-0 mt-4 text-muted">In the meantime, explore the property and what to do nearby.</p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
                <Link href="/gallery" className="t-ui about-link pb-1 text-forest uppercase no-underline">
                  Gallery
                </Link>
                <Link href="/see-do" className="t-ui about-link pb-1 text-forest uppercase no-underline">
                  See &amp; Do
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
