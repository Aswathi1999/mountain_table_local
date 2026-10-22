# Sitemap

Source: the original's `sitemap.xml` → `pages-sitemap.xml` (last modified 2026-07-11), plus a crawl of nav, footer and body
links. The site has **four public pages**, no blog, no catalogue, no admin/login/checkout areas.

| Route | Title | Template | Notes |
|---|---|---|---|
| `/` | The Mountain Table \| Uluppuni Premium Homestay \| Vagamon, Kerala, India | home | hero, intro, rooms teaser, services, Discover slider, guest review |
| `/about` | ABOUT \| The Mountain Table | static | story, sustainability, Instagram feed |
| `/see-do` | SEE & DO \| The Mountain Table | static | video headline, Honeycomb gallery, six activities |
| `/rooms-booking` | ROOMS & BOOKING \| The Mountain Table | static | three rooms, booking + cancellation policies |
| `/404` (any unknown URL) | 404 Error: Page Not Found | error | styled like the original's 404 |

## Global layout

- **Header**: sticky 80px dark bar with four links (desktop); static 71px bar with hamburger → full-screen menu (mobile).
  The original also contains a hidden "More" overflow item, which is empty and not rendered.
- **Fixed widgets**: white Facebook/Instagram tab on the right edge (desktop), red chat launcher (bottom-left on desktop,
  bottom-right on mobile; static stand-in, see `EXTERNAL.md`).
- **Footer**: contact heading + email / address / phone, Google Map, copyright bar (social icons in the footer on mobile).
- No cookie banner, announcement bar, popups or language switcher exist on the original.

## Root files

`/robots.txt` (same rules), `/sitemap.xml`, `/llms.txt` (summary only), favicon set under `/favicon`.
`/pages-sitemap.xml` redirects (308) to `/sitemap.xml`. The original has no `humans.txt`, `ads.txt`, `security.txt`,
`manifest.json` or feeds (all 400/404 there).
