import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageFrame, Lines, Reveal, Rule } from "@/components/motion/primitives";
import { ArticleShell } from "@/components/sections/blog/ArticleShell";
import { postMetaParts } from "@/components/sections/blog/BlogParts";
import { formatDate, getPost, posts } from "@/data/blog";
import { pageMetadataFor } from "@/lib/metadata";

type Params = { slug: string };

// Only published articles resolve; any other slug is a 404.
export const dynamicParams = false;
export const generateStaticParams = (): Params[] => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadataFor(`/blog/${post.slug}`, `${post.title} | The Mountain Table`, post.excerpt);
}

/** Drop cap on the opening paragraph, in the display face. */
const dropCap =
  "first-letter:font-display first-letter:text-forest first-letter:float-left first-letter:mt-[0.12em] first-letter:mr-3 first-letter:text-[4.4em] first-letter:leading-[0.72]";

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const meta = postMetaParts(post);
  return (
    <div className="blog-page">
      <ArticleShell className="bg-ivory block">
        <header className="pt-10 pb-12 desk:pt-16 desk:pb-20">
          <div className="wrap">
            <Reveal immediate>
              <Link href="/blog" className="t-ui link-u text-forest no-underline">
                All articles
              </Link>
            </Reveal>
            <div className="mt-12 grid gap-8 desk:mt-20 desk:grid-cols-12 desk:gap-x-12">
              <Lines
                as="h1"
                lines={[post.title]}
                className="t-h1 text-forest m-0 desk:col-span-9"
                immediate
                delay={0.1}
              />
            </div>
            <div className="mt-10 grid gap-8 desk:mt-14 desk:grid-cols-12 desk:gap-x-12">
              <div className="desk:col-span-4 desk:col-start-1">
                <Rule className="bg-gold/70" delay={0.5} />
                {meta.length ? (
                  <Reveal immediate delay={0.6} className="t-small text-gold-ink mt-5">
                    {post.date ? <p className="m-0">{formatDate(post.date)}</p> : null}
                    {post.category ? <p className="m-0">{post.category}</p> : null}
                    {post.author ? <p className="m-0">By {post.author}</p> : null}
                  </Reveal>
                ) : null}
              </div>
              <Reveal immediate delay={0.65} className="desk:col-span-7 desk:col-start-6">
                <p className="t-lead text-muted m-0">{post.excerpt}</p>
              </Reveal>
            </div>
          </div>
        </header>

        {post.image ? (
          <ImageFrame
            src={post.image.src}
            alt={post.image.alt}
            sizes="100vw"
            className="aspect-[4/3] w-full desk:aspect-[21/9]"
            from="bottom"
            drift={4}
            priority
          />
        ) : null}

        <div className="pt-16 pb-24 desk:pt-28 desk:pb-36">
          <div className="wrap grid gap-10 desk:grid-cols-12 desk:gap-x-12">
            <div className="flex flex-col gap-7 desk:col-span-7 desk:col-start-4">
              {post.body.map((paragraph, i) => (
                <Reveal key={i} as="p" y={16} className={`t-body text-ink m-0 max-w-[36em] ${i === 0 ? dropCap : ""}`}>
                  {paragraph}
                </Reveal>
              ))}
            </div>
          </div>
          <div className="wrap mt-20 desk:mt-28">
            <Rule className="bg-forest/15" />
            <Reveal className="mt-8">
              <Link href="/blog" className="t-ui link-u text-forest no-underline">
                All articles
              </Link>
            </Reveal>
          </div>
        </div>
      </ArticleShell>
    </div>
  );
}
