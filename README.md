# The Mountain Table — Next.js clone

A faithful, offline-capable clone of <https://www.themountaintable.in/> (a Wix site): same four pages, routes, copy, look
and motion, desktop and mobile. Built for the owner's own reference; the original's text and photographs should be replaced
or licensed before any public launch.

| | |
|---|---|
| Framework | Next.js **16.4.0** (App Router, Turbopack), React **19.3.0**, TypeScript `strict` |
| Styling | Tailwind CSS **4.3.3** (CSS-first tokens in `src/app/globals.css`) |
| Slider | Embla Carousel 8.6.0 |
| Node | 22 LTS |

## Run

```bash
npm install
npm run dev          # http://localhost:3000
npm run build && npm start
```

`NEXT_PUBLIC_SITE_URL` (see `.env.example`) switches every absolute URL (canonical, Open Graph, sitemap, robots, JSON-LD)
to a new domain. It defaults to the original domain.

## Routes

`/` · `/about` · `/see-do` · `/rooms-booking` · `/sitemap.xml` · `/robots.txt` · `/llms.txt` · custom 404.
See `SITEMAP.md`.

## Project layout

```
src/app                 routes (thin pages), layout, robots, sitemap, not-found
src/components/layout   Header, NavLinks, MobileMenu, Footer, SocialBar, ChatBubble
src/components/sections one folder per page: home/, about/, see-do/, rooms/
src/components/ui       Block, ParallaxImage, PillButton, Carousel (Embla), ReviewSlideshow, TextVideo, Honeycomb, InstagramFeed
src/components/motion   MotionController (entrance reveals + parallax)
src/components/seo      JsonLd
src/data                typed content: copy, seo, policies, instagram (generated), home, seeDo, rooms
src/lib                 site constants, fonts, metadata, reveal helper, stage (layout helper)
scripts                 tooling (see below)
archive                 snapshot of the original: HTML, screenshots, assets, measurements
public                  images, icons, fonts, video, favicons, llms.txt
```

## Tooling (`scripts/`)

| Script | Purpose |
|---|---|
| `archive.mjs` | Snapshot the original (rendered + raw HTML, screenshots at 375/768/1280/1920, every asset it loads, manifest) into `archive/` |
| `extract.mjs`, `show.mjs`, `show2.mjs`, `box.mjs` | Dump and read per-section geometry, fonts, colours, images of the original |
| `motion.mjs`, `parallax.mjs` | Record the original's entrance animations and parallax relationship |
| `content.mjs`, `build-data.mjs` | Pull exact copy, SEO, Instagram feed and policies out of the archive into `src/data/*` |
| `download-assets.mjs`, `fit-icons.mjs` | Download every asset used (original resolution) into `public/` with a manifest; trim icon viewBoxes |
| `build-mask.mjs` | Build the SVG lettering mask for the See & Do video headline |
| `geodiff.mjs` | **Geometry diff** original vs clone at a given width (text + images, >3px reported) |
| `motion-clone.mjs` | Record the clone's entrance animations for comparison |
| `seo-diff.mjs` | SEO parity → `SEO-REPORT.md` |
| `shots.mjs`, `crop.mjs`, `probe*.mjs` | Screenshots / ad-hoc browser probes (original or clone) |

All browser scripts use `playwright-core` with the installed Chrome. Wix only serves its mobile layout to mobile user agents,
so the scripts send an iPhone UA for widths under 600.

```bash
npm run assets   # re-download assets from archive/assets-manifest.json
npm run data     # regenerate src/data/* and the video mask
npm run seo-diff # with the app running on :3200
node scripts/geodiff.mjs /about 1280 http://localhost:3200
```

## Verification

Measured with `scripts/geodiff.mjs` against the live original (production build), see "Results" below.
`typecheck`, `lint`, `format:check` and `build` are all clean; `npm run audit` (production deps) reports 0 vulnerabilities.
Further docs: `ANIMATIONS.md`, `SITEMAP.md`, `EXTERNAL.md`, `STACK-NOTES.md`, `SEO-REPORT.md`.

## Known deviations

1. **Map**: keyless Google Maps embed of the same point; the original's info bubble ("The Mountain Table Premium Homestay at
   Uluppuni · Directions") is not reproduced.
2. **Chat launcher** is a static button (the original opens a Wix Chat widget).
3. **Instagram feed** is a snapshot of 12 posts (originally a live feed in an iframe).
4. **Honeycomb gallery** (See & Do) is rebuilt from DOM; the original draws it on a canvas. Hover overlay colour/timing is
   estimated. (The original occasionally fails to draw it in headless browsers and falls back to a plain image list; a
   real browser shows the diamonds, which is what is reproduced.)
5. **Discover gallery**: 30 slides on both layouts; the original's mobile gallery has 26. The extra slides are off-screen.
6. **404 page** uses system sans-serif (the original uses Wix Madefor Display, not downloaded).
7. **Hamburger/close icons** and the Instagram video/carousel badge icons are redrawn as SVG. (The original also contains a
   Wix "back to top" button, but it is permanently hidden, so nothing is reproduced.)
8. **Entrance trigger** fires when ~10% of an element is in view (the original's exact IntersectionObserver threshold is not
   exposed); measured timings and easings otherwise match.
9. `npm audit` reports 5 high-severity findings in **dev-only** linting tooling (`braces` via `eslint-config-next`); the only
   fix offered is a forced downgrade. Production dependencies: 0 vulnerabilities.
