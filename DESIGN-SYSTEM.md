# Design system: The Mountain Table redesign

The homepage (`src/components/sections/home/*`, `src/components/layout/*`, `src/components/sections/contact/*`) is the reference
implementation. Every other page must read as part of the same hand: same type, same motion vocabulary, same gutters, same buttons.
Read those files before designing a page.

## Brand (do not change)

Existing palette only (tokens in `src/app/globals.css` `@theme`): `ivory` #f5f0e4, `ivory-deep` #ebe4d2, `forest` #1f3b2f,
`forest-deep` #142a21, `gold` #b8935a, `gold-soft` #d2b57f, `gold-ink` #7d5f2c, `ink` #242323, `muted` #5b5a5a.
Sections alternate ivory / ivory-deep / forest / forest-deep. No gradients as decoration, no new colours.

## Typography (two voices, one scale)

- **Display: Cormorant Garamond** (`font-display`; weight 400 for display/h1/h2, 500 for h3/h4/quote/kicker; italic cut for the second beat of a line).
  Chosen after comparing six pairings on the real copy: it keeps its hairlines at heading sizes (Bodoni did not), is warmer than Playfair/DM Serif,
  and its italics suit the landscape photography. Small x-height, so sizes run larger than a sans would.
- **Text: Manrope** (variable 200-800; running text 400, UI 500). Open and sturdy at small sizes; far more readable than the previous Light-weight grotesque.
  Both are self-hosted woff2 via `next/font/local` with metric-adjusted fallbacks (measured CLS 0 on every route).
- Classes (all fluid `clamp()`, defined once in `globals.css`): `t-display`, `t-h1`, `t-h2`, `t-h3`, `t-h4`, `t-quote`, `t-kicker` (small italic serif lead-in),
  `t-lead`, `t-body`, `t-small`, `t-caption`, `t-nav` (tracked capitals), `t-ui` (buttons/CTAs), `t-wordmark`. Never hard-code font sizes, families or tracking in components.
- Source copy is stored in capitals ("OUR ROOMS"): convert with `sentenceCase()` / `titleCase()` from `@/lib/text`.
- No eyebrow labels above headings, no numbered markers unless the content is a sequence. Body measure is capped at 36em; light-on-dark text takes weight 350.

## Layout

- Every section's content sits in `<div className="wrap">` (1280px column, 20px / 40px gutters, aligned with the header). Sections carry
  vertical padding only: `py-20 desk:py-32` (generous), tighter for sub-sections. Do NOT put horizontal padding on `<section>`.
- Breakpoints: `desk:` = 750px, `lg:` = 1024px, `min-[1180px]:` for the header switch. Design mobile (390px) deliberately, not by shrinking.
- Compose, don't grid-fill: asymmetric 12-column grids (`desk:grid-cols-12`), overlapping photographs, an image bleeding to an edge, one
  large figure beside quiet text. Avoid identical card grids, avoid borders and rounded corners on everything. Corners are square.
- Hairlines (`Rule`, `border-forest/15`) are structure, not decoration: separators between list rows, the line that introduces a text block.
- The legacy fixed-coordinate system (`Block`, `pos()`, `.at`, `.mt-block`) must not be used by redesigned pages; it scales the root font
  size on mobile (`html:has(.mt-block)`), which breaks everything else.

## Motion (Motion library, `motion/react`)

Durations, easings and springs live in `src/components/motion/tokens.ts` (`DUR`, `EASE`, `EASE_REVEAL`, `SPRING`, `SCROLL_SPRING`); never inline new numbers. Scroll-linked values are passed through `useSpring(SCROLL_SPRING)`. Every route also fades in over 0.5s (`app/template.tsx`, CSS only).

Shared primitives live in `src/components/motion/primitives.tsx` ("use client"; import them into Server Components freely):

| Primitive                 | Use                                                                                                                                                                                                                                                              |
| ------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Lines`                   | A heading set as deliberate lines that rise out of a mask. Pass `lines={[...]}` (plain strings), `lineClasses` (plain strings, e.g. `["", "t-it"]`), `as`, `className`, `delay`, `immediate` (on-load, hero only). Do not pass functions from Server Components. |
| `Reveal`                  | Fade + rise once on scroll (`delay`, `y`, `x`, `as`, `immediate`). For paragraphs, lists, buttons. Use delay steps of 0.05-0.2 inside one group.                                                                                                                 |
| `ImageFrame`              | Photograph with clip-path reveal (`from="bottom\|top\|left\|right\|center"`), settling zoom, optional scroll drift (`drift={4}` = ±4% of height) and `zoomOnHover` (needs an ancestor with `group`). Sizing via `className` (`aspect-[4/5] w-full`).             |
| `ParallaxBand`            | Full-bleed band with the original site's viewport-pinned parallax (`k`, `km` for mobile). Give it a height class.                                                                                                                                                |
| `Rule`                    | Hairline that draws itself (`vertical` for a falling line).                                                                                                                                                                                                      |
| `Stagger` / `StaggerItem` | A group whose children enter one after another.                                                                                                                                                                                                                  |

Rules:

- Vary the entrance technique between neighbouring elements (mask line, clip-path image, plain fade). Do not wrap everything in `Reveal`.
- One scroll-linked effect per composition, not per element. Images drift 3-6%, never more.
- Everything must work with `prefers-reduced-motion` (`MotionProvider` already sets `reducedMotion="user"`; `ImageFrame` and `ParallaxBand`
  also check it). Never block content behind animation: all copy is visible within ~1.5s of entering the viewport. No scroll hijacking.
- Animate `transform`, `opacity`, `clip-path` only. Use CSS for hover/focus (`.btn`, `.link-u`, `.img-zoom`), Motion for entrances,
  scroll-linked values, `AnimatePresence`, layout. For something stateful (lightbox, filters, accordions) use Motion `AnimatePresence` / `layout`.
- Client components: only where state/effects are needed. Keep pages Server Components; put `"use client"` in the smallest leaf.
- Anything hidden on first paint must carry `data-motion=""` (the `<noscript>` rule in the layout un-hides it for no-JS visitors; the primitives
  already do this).
- Never read `window` / `MotionValue.get()` during render (hydration mismatch). Initialise to a server-safe value and update after mount.

## Buttons and links

- Booking: `<BookNowButton href="/rooms-booking" />` (gold `.btn .btn-gold`). Same button everywhere a booking CTA appears.
- Secondary: `.btn .btn-line-light` (on dark), `.btn .btn-line-dark` (on light), `.btn .btn-forest`; `.btn-sm` for the compact size. Arrow icon inside
  `.btn` slides on hover. Text links: `.link-u` (underline retracts and redraws). Hover/focus/active are built in; focus rings are gold on dark sections.

## Photography

- Reuse files in `public/images` (see `data/*.ts` and `archive/screens/sheet-new.png` for a contact sheet; the untracked `mountain_table_1..5.jpg`
  are real property photos and are good to use). Never leave placeholders, broken links or invented captions.
- Pick intentional crops (`object-position`) and aspect ratios (`aspect-[4/5]`, `aspect-[16/10]`, tall `aspect-[3/4]`), mix portrait and landscape, and
  overlap or offset images instead of lining them up in rows. Always set `sizes`. `priority` only for the first above-the-fold image.
- Never use `next/image` without `alt` (decorative = `alt=""`).

## Preserve

Existing copy (verbatim), routes, metadata/JSON-LD (`pageMetadata`, `pageJsonLd`), booking flow/policies, forms, gallery lightbox behaviour,
accessibility semantics (one `h1` per page, landmarks, labels). Do not invent facilities, prices, reviews or claims.

## Checking your work

- Dev server is already running at http://localhost:3000 (do not start another, do not run `next build`; the machine is memory-constrained).
- Screenshots: `MSYS_NO_PATHCONV=1 node scripts/shoot.mjs <route> <width> <height> <outPrefix> <comma-separated scrollYs | auto>` then read the PNGs.
  Check 1440 and 390 (and 820 for tablet). The script prints page height, horizontal overflow (sw must equal cw) and console errors (must be empty).
- `node scripts/_overflow.mjs <route> <width>` lists elements that spill off-screen.
- `npx tsc --noEmit` and `npx eslint src --quiet` must be clean for your files.
