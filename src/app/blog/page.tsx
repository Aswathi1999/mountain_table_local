import Link from "next/link";
import { Bleed, Fern, PaperGrain } from "@/components/decor";
import { Reveal, Rule } from "@/components/motion/primitives";
import { BlogHero, FeaturedPost, PostRow } from "@/components/sections/blog/BlogParts";
import { posts } from "@/data/blog";
import { pageMetadataFor } from "@/lib/metadata";

const description = "The Mountain Table blog: articles from our homestay in the hills of Ulupuni, Vagamon.";

export const metadata = pageMetadataFor("/blog", "BLOG | The Mountain Table", description);

export default function BlogPage() {
  const [featured, ...rest] = posts;
  return (
    <div className="blog-page">
      <BlogHero intro="Articles from our homestay in the hills of Ulupuni, Vagamon." />

      <section aria-label="Articles" className="bg-ivory relative pt-20 pb-24 desk:pt-52 desk:pb-36">
        <PaperGrain />
        <Bleed>
          <Fern size={120} rotate={14} opacity={0.5} draw className="decor-lg absolute top-24 -right-8" />
        </Bleed>
        <div className="wrap">
          {featured ? (
            <>
              <FeaturedPost post={featured} />
              {rest.length ? (
                <ul className="m-0 mt-24 list-none p-0 desk:mt-40">
                  {rest.map((post, i) => (
                    <PostRow key={post.slug} post={post} index={i} />
                  ))}
                </ul>
              ) : null}
            </>
          ) : (
            <div className="grid gap-10 desk:grid-cols-12 desk:gap-x-12">
              <div className="desk:col-span-7">
                <Reveal>
                  <h2 className="t-h2 text-forest m-0">
                    No articles have been <span className="t-it">published yet.</span>
                  </h2>
                </Reveal>
              </div>
              <div className="desk:col-span-4 desk:col-start-9 desk:pt-4">
                <Rule className="bg-gold/70" />
                <Reveal delay={0.1} className="mt-8">
                  <p className="t-lead text-ink m-0">In the meantime, explore the property and what to do nearby.</p>
                </Reveal>
                <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-x-10 gap-y-4">
                  <Link href="/gallery" className="t-ui link-u text-forest no-underline">
                    Gallery
                  </Link>
                  <Link href="/see-do" className="t-ui link-u text-forest no-underline">
                    See &amp; Do
                  </Link>
                </Reveal>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
