import type { Metadata } from "next";
import { seo } from "@/data/seo";
import { OG_IMAGE, SITE_URL } from "@/lib/site";

/** Per-route metadata mirroring the original's <head> (title, description, canonical, Open Graph, Twitter). */
export function pageMetadata(route: keyof typeof seo): Metadata {
  const s = seo[route];
  const url = route === "/" ? SITE_URL : `${SITE_URL}${route}`;
  const image = { url: `${SITE_URL}${OG_IMAGE.path}`, width: OG_IMAGE.width, height: OG_IMAGE.height };
  return {
    title: { absolute: s.title },
    description: s.description,
    alternates: { canonical: url },
    openGraph: {
      title: s.ogTitle,
      description: s.ogDescription,
      url,
      siteName: "The Mountain Table ",
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: s.twitterTitle,
      description: s.twitterDescription,
      images: [image.url],
    },
  };
}

/** JSON-LD for a route with the original domain swapped for SITE_URL. */
export function pageJsonLd(route: keyof typeof seo): Record<string, unknown>[] {
  const origin = "https://www.themountaintable.in";
  return seo[route].jsonLd.map((block) => JSON.parse(JSON.stringify(block).replaceAll(origin, SITE_URL)));
}

/** Metadata for pages that did not exist on the original site (Gallery, Blog and its articles). */
export function pageMetadataFor(path: string, title: string, description: string): Metadata {
  const url = `${SITE_URL}${path}`;
  const image = { url: `${SITE_URL}${OG_IMAGE.path}`, width: OG_IMAGE.width, height: OG_IMAGE.height };
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "The Mountain Table ", type: "website", images: [image] },
    twitter: { card: "summary_large_image", title, description, images: [image.url] },
  };
}
