import Link from "next/link";
import { notFound } from "next/navigation";
import { PostMeta } from "@/components/sections/blog/BlogParts";
import { RevealImage } from "@/components/ui/editorial";
import { getPost, posts } from "@/data/blog";
import { pageMetadataFor } from "@/lib/metadata";
import { rv, stagger } from "@/lib/reveal";

type Params = { slug: string };

// Only published articles resolve; any other slug is a 404.
export const dynamicParams = false;
export const generateStaticParams = (): Params[] => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const post = getPost((await params).slug);
  if (!post) return {};
  return pageMetadataFor(`/blog/${post.slug}`, `${post.title} | The Mountain Table`, post.excerpt);
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  return (
    <div className="blog-page">
      <article className="bg-ivory py-16 desk:py-[110px]">
        <div className="mx-auto max-w-[820px] px-6 desk:px-8">
          <Link href="/blog" className="t-ui about-link pb-1 text-forest uppercase no-underline">
            All articles
          </Link>
          <header className="mt-10" {...rv("rise", "rise")}>
            <PostMeta post={post} />
            <h1 className="t-h1 m-0 mt-5 text-forest">{post.title}</h1>
            <p className="t-lead m-0 mt-6 text-muted">{post.excerpt}</p>
          </header>
          {post.image ? (
            <RevealImage
              src={post.image.src}
              alt={post.image.alt}
              sizes="(min-width: 860px) 820px, 92vw"
              className="mt-12 aspect-[16/10] w-full"
              priority
            />
          ) : null}
          <div className="mt-12 flex flex-col gap-6">
            {post.body.map((paragraph, i) => (
              <p key={i} className="t-body m-0 text-ink" {...rv("rise", "rise", stagger(0.05))}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
