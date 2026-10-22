/**
 * Blog content source. The site has no published articles yet, so `posts` is empty and the Blog page shows its empty state.
 * To publish an article, add an entry here (newest first): the listing, the featured layout and `/blog/<slug>` pick it up.
 * Only real, published material belongs in this list.
 */
export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  /** ISO date (YYYY-MM-DD). Shown only when present. */
  date?: string;
  category?: string;
  author?: string;
  image?: { src: string; alt: string; width: number; height: number };
  /** Article body, one string per paragraph. */
  body: string[];
};

export const posts: readonly BlogPost[] = [];

export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

export const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
