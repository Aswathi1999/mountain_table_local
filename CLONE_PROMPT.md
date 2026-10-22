# Universal Website Clone Prompt (Next.js)

**Usage:** change ONLY the line below, paste this whole file into your coding agent. Nothing else needs editing.

```
TARGET_URL = https://www.themountaintable.in/
```

---

## ROLE
You are a senior frontend engineer. Build a **faithful, full-site Next.js clone** of `TARGET_URL`: same pages, same routes, same structure, same content, same look, same interactions. Fixed, bounded task: finish all steps and the Definition of Done, no skipped steps, no endless polishing.

## ASSUMPTIONS (do not ask questions; proceed on these)
- Clone **every public page** reachable from the site (not just the URL given), keeping **identical route paths** (`/about`, `/products/xyz`, etc.).
- **SKIP** admin panels, dashboards, login/account areas, checkout/payment, `/wp-admin`, `/admin`, `/cms`, `/api`. Keep the links as static `<a>` to `#` or the original URL.
- **Blogs / news / articles / listings / product catalogs / dynamic CMS content:** scrape what is there and render as **static data** (`data/*.ts` or `.json`) with the same routes (`/blog`, `/blog/[slug]`). No backend, DB, CMS or auth.
- Forms (contact/enquiry/newsletter): same UI + client-side validation + success state; no real submission (stub handler marked `TODO`).
- Search, cart, maps, embeds: render the same UI statically; embed iframes (maps/YouTube) as-is.

## TECH STACK (fixed)
- **Latest stable Next.js** (run `npm view next dist-tags.latest`, then `npx create-next-app@latest`; never `canary`/`rc`, never an old pinned version; check the official upgrade guide/docs for the current App Router conventions, e.g. async `params`/`searchParams`, `next/image` and metadata APIs, and use the current ones). Latest stable React, Node LTS, TypeScript `strict: true`, latest stable Tailwind CSS (use its current config style) with a custom theme from extracted tokens.
- Package manager: pnpm or npm, commit the lockfile; pin exact versions after install.
- `next/image` for images, **Embla Carousel** for all sliders (one reusable component).
- Allowed extras ONLY if the original needs them: `lucide-react`/inline SVG for icons; CSS keyframes for animations. If the original clearly uses scroll-reveal/parallax/marquee, implement with CSS + a tiny `IntersectionObserver` hook, no animation libraries unless unavoidable.

---

## STEP 0: USE EXISTING SKILLS / TOOLS FIRST (do not rebuild what exists)
Cloning by eye leaves gaps. Before building:
1. **Fetch ready-made skills online.** NOTE: `github.com/skills` is GitHub's *learning exercises* org, not an agent-skill registry; it has no cloning skills. Use it only as a pointer; the real sources are:
   - **Primary: `github.com/JCodesMore/ai-website-cloner-template`** (MIT). A Claude Code template with a `/clone-website <url>` command: recon, design-token extraction, asset download, parallel section builders, visual diff, outputs Next.js + Tailwind. Create a repo from the template (or copy its `.claude/` skills/commands and `AGENTS.md`/`CLAUDE.md` into this project), run `claude --chrome`, then `/clone-website TARGET_URL`.
   - Also search GitHub topics `claude-skills`, `agent-skills`, `website-cloner`, `site-clone`, `design-extraction`, `screenshot-to-code`, `skills.sh`/`openskillindex.com`, and `anthropics/skills`, for: crawling, token extraction, asset download, visual-regression/screenshot diffing, Next.js best practices, security review.
   - Verify a repo before trusting it: read its skill/command files, license and recent commits; never run unknown install scripts blindly.
2. **Skills-only mode:** if a cloner skill is installed, run it for the base clone (it handles recon, tokens, parallel builds, diff), then **use the rest of this document as the checklist that fills the gaps it misses**: full-site routes, offline archive (4B), SEO parity (4C), animation inventory (3B), code quality/security (5B), Definition of Done. If NO skill can be fetched, do everything from this document alone. Either way the end result must satisfy the Definition of Done.
3. Install/load the best 1-3 matches into the project (e.g. `.claude/skills/`) and **follow their instructions** where they beat the steps below. Note in one line which you picked and why.
3. Use a real browser (Chrome automation / Playwright) rather than static fetch, so JS-rendered content, lazy images, and hover states are captured.
4. If nothing suitable is found after one search round, continue with this prompt alone. Don't stall.

## STEP 1: CRAWL & MAP THE SITE
1. Fetch `/sitemap.xml`, `/robots.txt`, and crawl internal links from the nav, footer, and body (depth until no new internal URLs). Output `SITEMAP.md`: every route, page title, template type (home, listing, detail, static, blog, form).
2. Group pages by **template**. Build each template once as a reusable component/layout, then feed it data per page.
3. Record global layout: header, footer, announcement bars, floating buttons (WhatsApp/chat/back-to-top), cookie banner, popups/modals.
4. Preserve exact **meta**: `<title>`, description, OG tags, canonical, per-page.

## STEP 2: EXTRACT DESIGN TOKENS (never eyeball)
From computed styles in the live browser, write into `tailwind.config.ts` (single source of truth; components use tokens only, no raw hex/px):
- Colors: primary, secondary/CTA, text dark/muted, backgrounds, borders, footer bg, hover/active variants, gradients.
- Fonts: families (download the **actual font files** or use the same Google Font via `next/font`), weights, sizes/line-heights per h1-h6/body/small, letter-spacing.
- Spacing scale, section padding, container max-width, grid gaps, border radius, shadows, z-index layers.
- **Breakpoints** the original actually uses (read its media queries), mapped into Tailwind `screens`.
- Transition durations/easings.

## STEP 3: CAPTURE EVERY INTERACTION & STATE (the usual gap)
For each component, record and reproduce:
- **Hover/focus/active** on links, buttons, cards, nav items, images (zoom, overlay, underline, color swap, lift/shadow, icon move), with the same duration and easing.
- **Dropdowns / mega menus / sub-menus**, mobile drawer, accordions/FAQ, tabs, modals, lightboxes, tooltips.
- **Sticky/shrinking header**, header color change on scroll, scroll-to-top, smooth-scroll anchors.
- **Scroll animations** (fade/slide-in, counters, parallax, marquees/tickers), **page-load animations**, loaders/preloaders.
- **Sliders:** slide count, order, autoplay + delay, loop, arrows/dots/thumbnails, swipe, breakpoints (slides per view).
- **Forms:** fields, placeholders, validation messages, focus styles, success/error states.
- Cursor styles, text selection color, scrollbar styling, `::before/::after` decorations, background patterns/videos.
- **Dark/light mode, language switcher, currency switcher**, if present.
- Method: hover/click the live site in the browser, read the computed `:hover` CSS rules from the stylesheets (don't guess), and copy actual values.

## STEP 3B: ANIMATION & MOTION CLONING (deep pass; "how elements come into the UI")
Motion is the most-missed part of a clone. Treat it as its own deliverable: build `ANIMATIONS.md` (inventory) **before** coding, then implement every row.

**A. Detect what the site uses** (check in this order, in the live browser):
1. Libraries: look in loaded scripts/`window` for GSAP/ScrollTrigger, AOS, WOW.js/animate.css, ScrollMagic, Locomotion/Lenis/Locomotive (smooth scroll), Framer Motion, Lottie, Swiper/Slick/Owl, Three.js/canvas/WebGL, Rive, Splitting.js, Typed.js, CountUp, Isotope. Read their init code and data attributes (`data-aos`, `data-wow-delay`, `data-scroll`, `data-animation`, `data-speed`). Copy the **same config** (duration, delay, easing, offset, once/repeat).
2. CSS: dump all `@keyframes`, `animation`, `transition`, `transform`, `will-change`, `clip-path`, `mask`, `filter`, `backdrop-filter`, `scroll-snap`, `animation-timeline` (scroll-driven) rules from the stylesheets. Copy values verbatim into Tailwind `keyframes`/`animation` config or global CSS.
3. JS-driven: `IntersectionObserver` / scroll listeners adding classes like `.in-view`, `.is-visible`, `.active`, `.animated`. Find the class and the CSS it triggers.
4. Capture it in motion: record screenshots/frames while scrolling slowly top-to-bottom and while hovering; note element, trigger, start state, end state, duration, delay, easing.

**B. Inventory table (fill one row per animated element/group):**
| Element | Trigger (load / scroll-in / hover / click / time loop) | Start state (opacity, translate, scale, rotate, blur, clip) | End state | Duration | Delay / stagger | Easing (cubic-bezier) | Once or repeat | Library/CSS source |

**C. Must-cover animation types (check each exists or not on the site):**
- **Entrance on load:** hero text line-by-line/word/letter reveal, hero image zoom-out/Ken Burns, header slide-down, loader/preloader then page reveal, staggered children.
- **Scroll reveal:** fade-up/down/left/right, scale-in, clip/mask reveal, image curtain wipe, underline draw, staggered cards/grid/lists, section heading reveals, number **counters** counting up, progress bars/circles filling, timeline lines drawing, SVG path draw.
- **Scroll-linked:** parallax (speed per layer), pinned/sticky sections, horizontal scroll sections, scroll-scrubbed video/images, background color change per section, progress indicator bar, header hide-on-scroll-down/show-on-scroll-up, smooth-scroll inertia (Lenis/Locomotive).
- **Hover:** image zoom/pan, overlay slide/fade with text, card lift + shadow, button fill-slide/ripple/arrow shift/magnetic, link underline grow, icon spin/bounce, nav underline, text swap/roll, grayscale to color, tilt (3D), cursor-follower/custom cursor, hover-reveal images, tooltip.
- **Click/state:** mobile drawer slide + overlay fade + staggered link entry, hamburger to X morph, accordion height (smooth, with icon rotate), tab content cross-fade, modal scale/fade + backdrop, dropdown/mega-menu (fade, slide, delay-to-close), lightbox, toast, form field label float, success checkmark.
- **Continuous/loops:** marquee/ticker/logo carousel (speed, direction, pause on hover), floating/bobbing shapes, pulsing CTA/WhatsApp button, rotating badge, gradient shifts, typewriter text, Lottie/video loops, animated backgrounds (particles, blobs, canvas/WebGL).
- **Sliders:** transition type (slide/fade/cube/coverflow/creative), speed, easing, autoplay delay, pause on hover, loop, per-slide content animation (caption entrance after slide change), progress bars/pagination animation, thumbnail sync.
- **Page transitions:** route change fade/slide/wipe; scroll-to-top behavior on navigation.

**D. Implementation rules:**
- Prefer CSS (`transition`, `@keyframes`, scroll-driven where supported) + one reusable `useInView` hook / `<Reveal>` component (IntersectionObserver, same threshold/rootMargin, once vs. repeat as original). Use the **same library as the original only if** CSS can't match it (GSAP/ScrollTrigger, Lenis, Lottie, Three.js); document why in `ANIMATIONS.md`.
- Match **exact timings and easings** from the source; never default to a generic `ease`/300ms.
- Animate only `transform`/`opacity` (and `clip-path`/`filter` when the original does) so it's smooth; add `will-change` sparingly.
- Initial hidden state must **not flash** (SSR-safe: hidden via CSS class set at first paint, revealed on intersect; no layout shift).
- Respect `prefers-reduced-motion`: disable large movement but keep content visible.
- Mobile: replicate which animations the original disables/changes on touch (no hover on touch; different parallax).
- Re-trigger behavior on route navigation and on resize/refresh (e.g. ScrollTrigger refresh after images load).

**E. Verification for motion (required, per page):**
- Scroll each page slowly top to bottom on both original and clone; compare when each element appears, direction, speed and stagger order.
- Hover every interactive element on both and compare the start/end states and timing.
- Compare slider transitions, loops and marquee speed.
- Record a short screen capture or frame sequence of each section for the final diff when tooling allows; log anything not matched in "Known deviations".
- Nothing should "pop in" abruptly where the original animates, and nothing should animate where the original is static.

## STEP 3C: LAYOUT & BEHAVIOUR FIDELITY GAPS (measure, never assume)
These are the gaps that survive a "looks about right" clone. Check every one on every template, on the ORIGINAL first, then on the clone.

**A. Elements that cross section boundaries (overlaps + clipping)**
- Find elements whose box extends outside their own section (negative margins like `margin-top:-120px`, absolute badges, images overlapping a hero/banner, decorative fruit/shapes poking into the next section). List them with their offset and the section they overlap.
- Never put `overflow:hidden` on generic section wrappers: it silently crops these overlaps. Clip only where the original clips (e.g. the slider itself). Use `overflow-x: clip` (not `hidden`) on the page wrapper so slide-in animations (`translateX(100%)`) can't cause horizontal scroll without clipping vertical overlaps.
- Check stacking: the overlapping element must paint above the previous section (DOM order + `position`), and z-indexed slider layers must not escape their slider (give the slider its own stacking context, e.g. `isolation: isolate`).
- Verify by computing each element's visible area through all ancestors' `overflow` on both sites; any element visible on the original but partly clipped on the clone is a bug.

**B. Header behaviour on scroll (sticky / fixed / shrink / hide)**
- Read ALL theme scripts, including small "dynamic"/inline config files (e.g. `sticky_menu: 1`), and grep every script for `scroll`, `scrollTop`, `sticky`, `fixed`, `is-stuck`, `has-sticky`. Do not conclude "not sticky" from one file.
- Measure the header in the live browser at scrollY 0, 1, 5, 50, 110, 600: `position`, `top`, height of the outer header (does it collapse to 0 so the page jumps up, or keep a placeholder?), background/opacity, logo size/position, transition. Copy the exact threshold (e.g. `scrollTop > 1`) and the layout jump.

**C. Scroll-linked motion inside sliders / heroes / sections**
- Slider plugins (Slider Revolution, LayerSlider, Swiper parallax, Elementor motion effects) add scroll effects that are invisible in static screenshots: background parallax (`data-bgparallax`), layer parallax levels, Ken Burns, scroll-scrubbed fades. Read their init config AND data attributes from the RAW (pre-JS) HTML; slider plugins rewrite their markup at runtime, so rendered HTML loses `rs-looped`, `rev-slidebg`, `data-*` layers.
- Detect motion empirically: for every page, sample each element's document position (`rect.top + scrollY`) and `transform` at scrollY 0/300/600/900/1200 on the original. Constant = static; anything else is scroll-linked (parallax speed = Δtranslate / Δscroll, e.g. 0.45). Reproduce the same speed, the same oversize/offset so no gap appears, and the same mobile/reduced-motion opt-outs (`disable_onmobile`).
- A uniform jump of all elements by the header height after the first scroll pixel means a sticky header that leaves the flow (B), not parallax.

**D. The real CSS cascade, not just computed values of a few elements**
- For each text element type (p, h1-h6, li, list text, banner title), query which stylesheet rules actually match on the original (walk `document.styleSheets`, `el.matches(rule.selectorText)`), including framework base rules (Bootstrap heading `em` sizes, `p { margin: 0 0 10px }`, `:last-child { margin-bottom: 0 }`) and theme defaults (e.g. `p { 14px / 1.7 }`).
- Extract **per-page custom CSS** (WPBakery `style[data-type="vc_custom-css"]`, `vc_custom_*` shortcode CSS, Elementor `post-<id>.css`, theme "Additional CSS"). These differ per page (homepage `p { 16px/20px #444 }` vs About `.saos { #666 }`); store them with the page, sanitize, scope them to that page, and order media-query rules after base rules.
- Note where a page-builder puts styles: on a wrapper (`.vc_custom_heading` padding) or on the element itself (inline font-size/colour). Recreate the same wrapper/element split or vertical positions drift.
- Fonts used only by page CSS (e.g. a script font for banner titles) must be downloaded and self-hosted too.

**E. Measurement-based verification (required before claiming "matches")**
- Write a geometry diff script: load original + clone at the same viewport, scroll through to trigger lazy content, then for every heading/paragraph/list item/image/button/input match elements by text or image file name and diff x, y, width, height, font-size, line-height, weight, colour. Tolerance: 3px. Fix the FIRST vertical drift on a page before looking further down, because everything below inherits it.
- Write a gap scanner that runs A + C (clip ratios and scroll-motion paths) on both sites and reports only differences, comparing only elements found on both sites.
- Run both at 375, 768 and 1280 for every template; record what remains in "Known deviations" with the measured reason.

**F. Tooling traps**
- Tailwind v4 namespaces are shared by name: a token named `--color-nav` and `--text-nav` makes `text-nav` ambiguous (colour wins, size silently ignored). Give colour and size tokens different names.
- Unlayered `<style>` beats every Tailwind layer regardless of specificity; inject page CSS inside `@layer components` so component/utility classes still win where intended.
- next/image rewrites `src` to `/_next/image?url=...`; key image comparisons by the decoded `url` parameter.

## STEP 4: DOWNLOAD ALL ASSETS LOCALLY (no hotlinking)
Download **everything** and store in `/public`, reference locally:
```
/public/images/        content + hero + product + background images (keep original filenames, organise by page/section)
/public/icons/         SVG icons, social icons, UI icons
/public/logo/          logo (all variants: light, dark, mobile, footer) as SVG when available
/public/favicon/       favicon.ico, apple-touch-icon, android-chrome, site.webmanifest, og-image
/public/fonts/         self-hosted font files (woff2)
/public/videos/        background/hero videos (or keep embed if too large; note it)
/public/docs/          downloadable PDFs/brochures
```
- Collect from: `<img src/srcset/data-src/data-lazy-src>`, `<picture>/<source>`, CSS `background-image`, inline styles, `<link rel=icon|apple-touch-icon|manifest>`, `<meta og:image>`, SVG sprites, `<video poster/src>`, stylesheet `url(...)` (fonts, images).
- Take the **largest/highest-res** variant from `srcset`. Convert nothing; keep format.
- Write a script `scripts/download-assets.mjs` that does this in bulk (with retries, 2 max per file, and a manifest `assets-manifest.json` of original URL -> local path). Rewrite all references to local paths.
- Failed asset after 2 retries: generate a placeholder at the original aspect ratio (never a broken-image icon) and list it in the final report.
- Always set `width/height` (or `fill` + sized parent) to match the original; zero layout shift. Lazy-load everything except the hero/LCP image.
- Don't ship third-party tracking scripts (GA, pixels). Keep a commented placeholder only.

## STEP 4B: FULL OFFLINE ARCHIVE (the site may change or vanish in days; the clone must never depend on it)
Goal: after this step, the clone builds and runs with the original site **fully offline**. Do this BEFORE building pages.
1. **Snapshot the original** into `/archive/` (not shipped, kept for reference and diffs):
   - Rendered HTML of every page (post-JS, via browser) + raw HTML, as `archive/html/<route>.html`.
   - Full-page screenshots per page at 375 / 768 / 1280 / 1920 (`archive/screens/`).
   - All CSS/JS bundles, `sitemap.xml`, `robots.txt`, `manifest`, `humans.txt`, `security.txt`, `ads.txt`, `llms.txt`, `.well-known/*`, `feed.xml`/RSS/Atom, `browserconfig.xml`.
   - Network log (HAR) of one full scroll-through per template: lists every request the page makes.
   - Optionally a Wayback Machine (`web.archive.org`) save request for the same URLs.
2. **Download everything the pages load**, from the site AND third parties (CDNs, Google Fonts, cdnjs, jsdelivr, unpkg, Cloudinary, S3, Shopify/WordPress uploads, Vimeo/YouTube thumbnails): images (all srcset sizes + `data-src`/lazy), SVG, GIF/WebP/AVIF, videos + posters, audio, fonts (woff2/woff/ttf, all weights/subsets), Lottie/JSON animation files, 3D models/textures (glb/gltf), PDFs/brochures/docs, downloadable zips, JSON/XML data feeds the page fetches (XHR/fetch responses), icon sprites, cursor images, CSS background images, and any JS/CSS libraries loaded from CDNs (vendor them into `/public/vendor/` or install via npm at the same version).
3. **Discover hidden assets** by: parsing every downloaded CSS for `url()`/`@import`/`@font-face`; parsing JS for string URLs of media; checking the HAR; opening modals/tabs/menus/hover states so lazily-loaded assets fire; scrolling to bottom to trigger lazy-load; viewing at mobile + desktop widths (different `srcset`/`<picture>` sources); checking `<noscript>` blocks.
4. **Rewrite all references** to local `/public` paths. Keep `assets-manifest.json` (original URL -> local path -> size -> sha256 -> where used). Then audit:
   `grep -rEi "https?://" app components data public styles` -> only allowed: outbound `<a href>` links, canonical/OG absolute URLs (SEO), social profile links, embeds that can't be self-hosted (maps/YouTube; record these in `EXTERNAL.md`).
5. **Self-host fonts** with `next/font/local` (woff2 in `/public/fonts` or `app/fonts`), preload critical ones, `font-display: swap`, same `unicode-range` subsets as original.
6. **Embedded third-party video** (YouTube/Vimeo): keep embed but also download the poster image and store locally; if the video file is directly hosted, download it.
7. **Dynamic data fetched at runtime** (product APIs, blog JSON, store locators, testimonials feeds): save the JSON responses to `/data/*.json` and read from there; no live API calls from the clone.
8. Check total size; if some media >50MB, still download but note it. Failed after 2 retries -> placeholder + listed in report.

## STEP 4C: SEO, META & TECHNICAL CLONE (every page, no exceptions)
Extract from each page's rendered `<head>` and body, and reproduce with Next.js `metadata` / `generateMetadata`, per route:
- `<title>` (exact), meta `description`, `keywords`, `author`, `robots` (index/noindex, follow/nofollow, max-image-preview etc.), `viewport`, `theme-color`, `color-scheme`, `format-detection`, `generator` (omit), `referrer`.
- **Canonical** URL per page (set `alternates.canonical`; keep the ORIGINAL domain paths pattern; use a single `SITE_URL` env var so it can be switched to the new domain with one change, and document this in the README).
- **hreflang / alternate languages** (`alternates.languages`), `x-default`, RSS/Atom alternate links, `prev`/`next` for paginated lists, AMP link if present (note only).
- **Open Graph**: `og:title|description|type|url|site_name|locale|image(+width,height,alt)|article:published_time|author|section|tag` (blog posts), `og:video` if any.
- **Twitter/X cards**: `twitter:card|site|creator|title|description|image|image:alt`.
- **Other platform tags**: `fb:app_id`, `apple-mobile-web-app-*`, `msapplication-*`, Pinterest, `application-name`, `mobile-web-app-capable`.
- **Structured data (JSON-LD)**: copy every `<script type="application/ld+json">` per page verbatim (Organization, WebSite+SearchAction, BreadcrumbList, Product/Offer, Article/BlogPosting, FAQPage, LocalBusiness, Review/AggregateRating, VideoObject, Event, etc.), also microdata/RDFa attributes (`itemscope/itemprop`, `typeof/property`) where present. Update URLs through `SITE_URL`. Validate JSON syntax.
- **Icons**: favicon.ico, PNG/SVG icons, `apple-touch-icon`, `mask-icon`, `site.webmanifest` (name, short_name, icons, theme/background color, display), `browserconfig.xml`, `og-image` / social share images; all stored in `/public` and linked as in the original.
- **Heading structure** (h1-h6 order), image `alt` and `title`, link `title`/`rel` (`nofollow`, `noopener`, `sponsored`, `ugc`), `target`, `lang` attr on `<html>`, `dir` for RTL languages, breadcrumbs markup, semantic landmarks (`header/nav/main/footer`), skip-links, ARIA labels/roles as in original.
- **Crawl files**: `app/sitemap.ts` (same URLs, `lastmod`, `changefreq`, `priority`; image/video sitemaps if the original has them), `app/robots.ts` (same rules; sitemap link), copy `llms.txt`, `humans.txt`, `ads.txt`, `security.txt`, `.well-known/*` into `/public`.
- **Redirects & URLs**: reproduce original trailing-slash policy (`trailingSlash` in `next.config`), `www` vs non-www noted, 301/302 redirects seen while crawling (`redirects()` in `next.config`), case/legacy URLs, query-param pages (`?page=2`, `?lang=`), pagination routes, custom 404 (and 500 if styled) with the same look.
- **HTTP/perf headers worth mirroring** in `next.config` `headers()`: caching for static assets, security headers (CSP optional, `X-Content-Type-Options`, `Referrer-Policy`).
- **Analytics/tags/consent**: do not load GA/GTM/pixels/chat widgets; leave a single commented `<Analytics />` placeholder component and record IDs found in `EXTERNAL.md`. Keep cookie-consent banner UI if the original has one.
- **Verify SEO parity**: write `scripts/seo-diff.mjs` that, for every route, fetches original vs clone (from the archived HTML) and diffs title, description, canonical, robots, OG/Twitter tags, hreflang, JSON-LD, h1, and number of images missing alt; output `SEO-REPORT.md`. Expected diffs are only the domain (via `SITE_URL`). Fix everything else.

## STEP 4D: OTHER "PACKAGE" LAYERS PEOPLE FORGET
- **Third-party widgets**: chat (WhatsApp/Tawk/Intercom), review widgets, social feeds (Instagram/Facebook), maps, booking/calendar embeds, newsletters (Mailchimp), cookie tools; replicate the visual UI statically (screenshot + HTML/CSS) and list real embeds in `EXTERNAL.md`.
- **Content Edge cases**: pop-ups/exit-intent/timed modals, announcement bars, language/region redirect, age gates, A/B variants (clone default), print stylesheet (`@media print`), RTL, `prefers-color-scheme`, `<noscript>` fallback content, `<template>` and hidden-but-SEO text, tabs/accordion content that exists in DOM but is collapsed.
- **Third-party packages used**: record library names/versions found (jQuery plugins, Bootstrap, Swiper, Fancybox, Isotope, etc.) in `STACK-NOTES.md`; reproduce behavior with the allowed stack or, if essential, install the same npm package at that version.
- **Environment & config**: `.env.example` (`SITE_URL`, etc.), `README.md` (how to run, build, swap domain, re-run asset script/SEO diff), `package.json` scripts: `assets`, `seo-diff`, `audit`.

## STEP 5: BUILD (structure must match the original)
```
/app
  layout.tsx            -> fonts, global header/footer, metadata
  page.tsx              -> home
  <route>/page.tsx      -> same route paths as original
  <route>/[slug]/page.tsx  -> dynamic detail pages using generateStaticParams over static data
  not-found.tsx         -> same 404 style as original
/components             -> Header, Footer, MegaMenu, Slider, Card, Accordion, Tabs, Modal, FormX, SectionX...
/data                   -> page + blog + product content (typed .ts/.json)
/public                 -> all assets (Step 4)
sitemap.ts, robots.ts   -> mirrored from the original
tailwind.config.ts      -> tokens
```
- Same **DOM hierarchy and section order** per page; same heading levels and text copy (exact, including punctuation); same link targets (internal links mapped to the cloned routes).
- One component per section; shared sections reused, not copy-pasted.
- Use semantic HTML and alt text from the original.

## STEP 5B: CODE QUALITY, ARCHITECTURE & SECURITY (production standard, not a hack)
Use skills and official docs for this too: load any code-quality/Next.js/React best-practice/security-review skills found in Step 0 (and `frontend-design`, `simplify`, `code-review`, `security-review` if available), and follow Next.js official docs + Vercel React/Next best-practice guidance for the installed version.

**Architecture (modular, feature-oriented):**
```
/app                    routes only: thin page.tsx files that compose sections + fetch data
/components/ui          primitives: Button, Container, Section, Heading, Card, Badge, Icon, Input
/components/layout      Header, Footer, MegaMenu, MobileDrawer
/components/sections    page sections (Hero, Features, Testimonials...) reused across pages
/components/motion      Reveal, Marquee, Counter, Parallax, SmoothScroll
/components/seo         JsonLd, Breadcrumbs
/lib                    utils (cn, formatters), seo helpers, site config, constants
/hooks                  useInView, useMediaQuery, useScrollDirection, useLockBody
/data                   typed content per page, blog posts, products (single source of truth)
/types                  shared TypeScript types / Zod schemas
/scripts                asset download, seo-diff, audits
```
- **One component per file**, named export or default consistently, props typed with explicit interfaces, no `any`, no giant files (>200 lines = split).
- **Server Components by default**; add `"use client"` only on the smallest leaf that needs state/effects/browser APIs (sliders, menus, reveals). Keep data in server components; never import big client libs in server trees.
- **Data-driven**: sections receive typed props from `/data`; no hard-coded copy inside components; every list rendered with `.map` over data; stable `key`s.
- **Reuse, DRY**: one `Slider`, one `Reveal`, one `Section`, one `Button` with variants (`cva`-style or plain typed variant maps); no copy-pasted markup between pages; shared layouts via route groups `(site)` and `layout.tsx`.
- **Styling**: Tailwind tokens only (Step 2); `cn()` helper for class merging; no inline styles except dynamic values; no `!important`; CSS variables for tokens that need runtime use.
- **Naming/format**: ESLint (`next/core-web-vitals` + `typescript-eslint`) and Prettier configured, absolute imports (`@/`), consistent file naming (PascalCase components, camelCase utils), no dead code, no commented-out blocks, no `console.log`.
- **Performance**: `next/image` with correct `sizes` and `priority` only on LCP image, `next/font`, dynamic import for heavy below-fold client components, no layout shift, avoid unnecessary client JS, static generation (`generateStaticParams`, `dynamic = 'error'`/`force-static` where possible), `next/link` for internal navigation with prefetch.
- **Accessibility**: semantic HTML, focus-visible styles, keyboard-operable menus/accordions/modals (focus trap, Esc to close, `aria-expanded/controls`), alt text, contrast checked, `prefers-reduced-motion`.
- **Error handling**: `not-found.tsx`, `error.tsx`, `loading.tsx` where relevant; guard against missing data (no crashes on empty arrays).

**Security (non-negotiable):**
- No secrets in client code; `.env` ignored by git; only `NEXT_PUBLIC_*` for public values; `.env.example` provided.
- **Security headers** in `next.config`: `Content-Security-Policy` (tuned to the embeds actually used, e.g. YouTube/maps), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `X-Frame-Options`/`frame-ancestors`, `Permissions-Policy`, `Strict-Transport-Security`; `poweredByHeader: false`.
- No `dangerouslySetInnerHTML` except for JSON-LD (use a `JsonLd` component that serializes with `JSON.stringify` and escapes `<`) and for scraped rich blog HTML, which must be **sanitized at build time** (e.g. `sanitize-html`/DOMPurify) and stored sanitized.
- External links: `rel="noopener noreferrer"` with `target="_blank"`; validate any URL from data before rendering (`http/https/mailto/tel` only).
- Forms: validate input client **and** server side (Server Action or route handler) with Zod, honeypot field, length limits, CSRF-safe (Server Actions or same-origin check), rate-limit stub, no data logged; submission is a stub unless the user provides an endpoint.
- Third-party iframes: `sandbox`, `loading="lazy"`, `referrerPolicy`.
- Dependencies: minimal, from npm only, run `npm audit` (no high/critical), no abandoned packages, no remote scripts/CDN at runtime (all vendored, Step 4B).
- Run a security pass: use a `security-review` skill if available, plus `npm audit`, ESLint security rules, and a header check (`curl -I` on the built app).

**Quality gates before "done":** `tsc --noEmit`, `eslint .`, `prettier --check .`, `next build` all clean; bundle analysis shows no oversized client chunks; Lighthouse mobile (Performance, Accessibility, Best Practices, SEO) all in the green; no unused exports/files (`knip` or equivalent optional).

## STEP 6: VERIFY PER PAGE AND PER SECTION (as you build, not at the end)
Use a real browser. At 375 / 414 / 768 / 1024 / 1280 / 1920px, for each template page:
1. Screenshot clone vs. original side by side, section by section.
2. Check: colors = tokens, font/size/weight, alignment, spacing, image crops, button styles.
3. **Test every interaction from Step 3** on both (hover each element, open menus, click sliders/tabs/accordions, scroll to trigger animations).
4. Zero horizontal overflow, zero console errors, zero broken images.
5. Max **2 correction passes** per section; if still off, log under "Known deviations" and move on.
6. Run a **link crawl** on the clone: every internal link resolves (no 404); the route list equals `SITEMAP.md`.

## STEP 7: POLISH (light only)
Smoother easing, consistent hover feel. No layout, color, content or section-order changes.

## GUARDRAILS
- **Skills first:** for every phase (crawl, tokens, assets, animation, SEO, code quality, security, visual diff) check whether an installed or online skill covers it (Step 0) and use it before hand-rolling.
- No admin/backend/CMS/auth. Blogs and dynamic content = static data.
- No raw hex/px outside `tailwind.config.ts` tokens (arbitrary values only where the original has one-off values, and then add them as tokens).
- Max 2 retries per failed fetch; max 2 correction passes per section; if blocked >2 attempts, take the fallback and continue.
- Respect scope: clone for the user's own use/reference. Don't copy login flows, payment, or personal data. Note that copyrighted text/images should be replaced before any public launch.
- Don't invent content. If something can't be fetched, mark it and use a neutral placeholder.

## DEFINITION OF DONE
- [ ] `SITEMAP.md` exists; every public route cloned at the same path; admin areas skipped.
- [ ] `tailwind.config.ts` holds the extracted tokens; fonts self-hosted.
- [ ] All assets (logo, favicons, images, icons, fonts, videos, PDFs) downloaded into `/public`; `assets-manifest.json` present; no hotlinks remaining (`grep` for the original domain finds nothing except link hrefs).
- [ ] Header (incl. dropdowns/mobile drawer/sticky), footer, and global widgets match the original.
- [ ] Hover/focus/scroll animations and every slider/accordion/tab/modal behave like the original.
- [ ] `ANIMATIONS.md` inventory complete; every row implemented with matching trigger, timing, easing, stagger; reduced-motion handled; no flash of hidden content.
- [ ] Smooth-scroll, parallax, counters, marquees, preloader, page transitions, custom cursor replicated where the original has them.
- [ ] Step 3C done: header scroll behaviour (threshold, fixed/collapse jump) matches; slider/hero scroll effects (bg parallax speed) match; no element that crosses a section boundary is clipped; per-page custom CSS extracted and scoped; geometry diff shows no element off by more than 3px at 375/768/1280 (or listed in Known deviations with the reason); gap scanner reports no clip/scroll-motion differences.
- [ ] Blogs/listings rendered from static data with working list + detail routes.
- [ ] `/archive` holds original HTML, screenshots, HAR; clone builds and runs fully offline (disconnect network and test).
- [ ] Every asset the site loads (own + CDN + third-party, including CSS-only, lazy, JS-fetched and JSON data) is local; asset-audit grep passes; `EXTERNAL.md` lists the few remaining embeds.
- [ ] Per-page SEO parity: title, description, canonical, robots, hreflang, OG, Twitter, JSON-LD, icons, manifest; `SEO-REPORT.md` shows no diffs except the domain; `SITE_URL` env switches all absolute URLs.
- [ ] `sitemap.ts`, `robots.ts`, redirects, trailing-slash policy, custom 404, and root files (`llms.txt`, `ads.txt`, `.well-known`) mirrored.
- [ ] `README.md`, `.env.example`, `STACK-NOTES.md`, `EXTERNAL.md` written.
- [ ] Built on the latest stable Next.js/React/Tailwind (versions stated in README); modular structure per Step 5B; Server Components by default; TypeScript strict with no `any`.
- [ ] Security headers, sanitized HTML, validated forms, `npm audit` clean; `tsc`, ESLint, Prettier and `next build` all pass; Lighthouse mobile green.
- [ ] `npm run build` has zero errors; no TS/ESLint errors.
- [ ] No horizontal overflow at 375/768/1280; no console errors; link crawl clean.
- [ ] Final report: skills used, pages cloned, assets count, placeholders used, known deviations.

## FINAL TEST CASES
0. Offline test: block the original domain (hosts file or DevTools offline/blocked-domain) and confirm every page, image, font, video and animation still works. SEO diff script clean.
1. Link crawl: all internal links 200. 2. Asset audit: no remote image/font URLs. 3. Token audit: no stray hex. 4. Visual diff per template at 375 and 1280. 5. Hover/interaction pass on every interactive element. 6. Slider autoplay/arrows/swipe. 7. Mobile nav open/close. 8. Forms validate and show success. 9. Break one image: placeholder renders. 10. Lighthouse mobile: no major CLS.
11. Scroll test: scroll 1px, 300px, 900px on both sites and screenshot side by side (header state, hero background offset, overlapping images). 12. Geometry diff (Step 3C-E) clean within 3px. 13. Gap scanner clean (no clipped overlaps, same scroll-linked motion).

---
**End of prompt.** Only `TARGET_URL` at the top changes between projects.
