import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const routes = ["", "/rooms-booking", "/see-do", "/about", "/gallery", "/blog", "/contact"] as const;

/** The original's four public pages (its pages-sitemap.xml, last modified 2026-07-11) plus Gallery, Blog and Contact. */
export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({ url: `${SITE_URL}${route}`, lastModified: "2026-07-11" }));
}
