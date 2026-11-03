---
name: mountain-seo-assets
description: Maintain The Mountain Table metadata, structured data, crawlability, UX content, and image assets without changing approved copy, property claims, URLs, or brand identity.
---

# Mountain SEO, content and assets

- Inspect src/data, src/lib/site.ts, src/lib/metadata.ts, src/components/seo/JsonLd.tsx and the affected app route. Preserve titles, descriptions, canonical URLs, social metadata and existing JSON-LD unless the task explicitly authorizes editing them.
- Use pageMetadata/pageJsonLd for existing mapped routes and pageMetadataFor for other pages as appropriate. Check blog slug generation, sitemap membership, robots, redirects and internal links when adding/removing routes. Do not invent lastModified dates or assume the current sitemap covers every blog article.
- Keep one meaningful page h1 and logical section headings. Important text and links must remain available to crawlers without waiting for animations. Validate rendered head and parse JSON-LD, including safe escaping of less-than characters. Structured data must match visible factual content; never invent ratings, prices, facilities or availability.
- SITE_URL/NEXT_PUBLIC_SITE_URL controls canonical origin. Do not change it or deploy as part of an SEO audit. Use Google Search Central for uncertain recommendations; make no ranking guarantees.
- For UX writing, preserve existing wording unless content changes are authorized. New copy must match the site's tone, real booking behavior and confirmed property facts. Do not claim a mailto handoff sent an enquiry or confirmed a reservation.
- Reuse existing public/images, videos, fonts and data mappings first. Inspect the asset before changing its crop. Do not substitute generated rooms, views or amenities as documentary property photographs. Use the environment imagegen skill only when authorized raster creation benefits the task; preserve SVG/code-native art in its existing format.
- For requested new external assets, verify license, author/source, allowed use and attribution; record provenance and retrieve a local optimized copy where permitted. An existing file or an online search result does not prove publication rights. The README records historical licensing uncertainty; retain that uncertainty rather than asserting ownership.
- Keep alt text descriptive and grounded; decorative images use empty alt. Reserve aspect ratios/dimensions, set sizes, and compare visual quality after optimization. Respect CSP and immutable-cache filenames. Never remove originals without authorization.

Sources: [Google SEO guide](https://developers.google.com/search/docs/fundamentals/seo-starter-guide), installed Next.js metadata and image guides. Check current primary documentation when recommendations or APIs may have changed.
