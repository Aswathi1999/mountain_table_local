import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/** Same rules as the original's robots.txt. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: "*?lightbox=" },
      {
        userAgent: ["AdsBot-Google-Mobile", "AdsBot-Google"],
        disallow: ["/_partials*", "/pro-gallery-webapp/v1/galleries/*"],
      },
      { userAgent: "PetalBot", disallow: "/" },
      { userAgent: "dotbot", crawlDelay: 10 },
      { userAgent: "AhrefsBot", crawlDelay: 10 },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
