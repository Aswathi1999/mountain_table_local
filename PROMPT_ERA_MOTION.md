# The Mountain Table: ERA Residence-style motion redesign, plus new sections

Project: D:\projects\the-mountain-table (Next.js + Motion + Lenis). Local site: http://localhost:3000
Reference: https://www.era-residence.com/
Design reference image: public/images/The Mountain Table_ A Luxury Mountain Escape.png

Before writing code, read the `frontend-design` and `motion` skills and AGENTS.md
(this Next.js version has breaking changes; read node_modules/next/dist/docs/ first).

## 0. Hard rules

- Keep the current design: palette (forest #0B2B1F, ivory, gold #B8912F), fonts, layouts, content, photography.
  With every animation disabled, the site must look like it does today.
- Do not copy ERA's layout, images, text, fonts, logo or colours. Copy the motion language only.
- Do not invent facts: no new prices, facilities, reviews or claims. New sections may use only
  existing site content and photos, or clearly marked placeholders I will fill in.
- Reuse the installed stack (Motion + Lenis). Do not add GSAP or a second animation library.
- Animate transform, opacity and clip-path only. Respect prefers-reduced-motion. Below 768px
  simplify pinned and horizontal sections to vertical layouts with fades. No JS = content still readable.

## 1. Study the reference in a real browser (Playwright + Chrome), not by fetching text

Open the site, scroll slowly with real mouse wheel input, open the menu, click through pages.
Record what you actually observe. Already measured, to verify and extend:

- Stack: GSAP + ScrollTrigger + SplitText + CustomEase, Lenis smooth scroll, Barba.js page transitions.
- ~190 ScrollTriggers, almost all SCRUBBED (scrub 0.25 to 0.5s): motion follows scroll position and
  reverses on scroll back. Few things are one-shot timers.
- Loader: dark title card with staged type; scrolling is locked until it ends.
- Hero: sticky/pinned for ~4x viewport height of scroll, with layered parallax (different y speeds),
  a scrubbed zoom (scale), and headline words that spread apart; the next section rises over it
  with a curved (arch) top edge.
- Sections change background colour through scrubbed "theme" triggers, so sections blend into each other.
- Pinned scenes: amenities as pinned slides (scale + opacity), a location scene where a path line draws
  with scroll, an image whose clip-path opens with scroll (arch reveal).
- Decorative layers (flowers) drift at their own parallax speed.
- Footer opens with a scrubbed clip-path + scale/opacity.
- Left rail with scroll hint and progress counter; full-screen modal menu; custom cursor rings on images.

Write a short motion analysis (loader, text, images, scroll, hover, menu, page transitions, timing/easing)
with the values you measured. Then compare it with the existing site, section by section.

## 2. Replace, don't stack

Inspect the current animation code (src/components/motion, \*\_FX config blocks, primitives.tsx).
For every section, decide: keep, replace, or remove the existing effect. Remove timer-based fade-ups
that a scrubbed equivalent replaces. One shared system (tokens + config + primitives), no per-page one-offs.

Target behaviours:

- Hero: pinned scene on Home (about 2 to 3 viewport heights) with layered parallax, scrubbed zoom, headline
  and copy lifting away, and the next section arriving over it with a curved edge.
- Section continuity: scrubbed background colour/tone blending between neighbouring sections; images that
  keep moving across a section boundary.
- Images: scrubbed clip-path opening (inset or arch) + scale 1.2 to 1; inner parallax.
- Text: line/word masks for headings (SplitText-style), scrubbed word brightening for key paragraphs.
- Pinned storytelling: Experience and Services content swaps while pinned; one full-screen image-expand scene
  (small card grows to full viewport, text fades in on top).
- Horizontal: a drag + scroll-linked horizontal strip (Rooms or Gallery), with momentum and edge snap.
- Navigation: header hides on scroll down, returns on scroll up; full-screen menu with layered panels,
  staggered large serif links and a photo that changes on link hover.
- Page transitions: layered panel with curved edge, logo and destination name, then the new page reveals;
  shared header persists; no flash, no layout shift; scroll resets to top.
- Loader once per session, under 2.5s, skippable, with a counter.
- Footer: scrubbed opening reveal.
- Hover: images slow-zoom; links underline-draw or text-roll; buttons fill-sweep and magnetic pull.
  Keep the native cursor unless I ask otherwise.

## 3. New sections to add (use only real content; placeholders marked "TODO: client to supply")

Add these to the existing pages without disturbing the current ones, each with its own motion style:

1. "Getting here" / location journey (Home or Contact): a scroll-drawn path line over the existing map or a
   simple SVG route, with pinned captions appearing along it. Use the real address and distances only if
   they exist in the project.
2. "A day at The Mountain Table" (Home): pinned section where morning, afternoon and evening images
   cross-fade with scroll, tied to the day-to-night idea already on the site.
3. Amenities slides (Home or About): pinned slides that scale and fade into each other, one per existing
   service/amenity from the current content.
4. Rooms horizontal showcase: scroll-pinned horizontal strip of the existing rooms.
5. Guest moments / gallery teaser (Home): drag-to-explore strip using existing gallery photos.
6. FAQ (Contact or Rooms): accordion with smooth height/clip transitions. Questions and answers come from
   the client; ship with clearly marked placeholders only.
7. Seasons in Vagamon (About or See & Do): a scrubbed image-expand scene, using existing photography.

Tell me which of these you could not build without content I have not provided.

## 4. Pages

Home, About, See & Do, Rooms & Booking, Gallery, Blog (index + posts), Contact. Include 404 and the footer.
Do not break booking, the contact form, map, reviews carousel, API integrations or SEO metadata.

## 5. Validation (at http://localhost:3000)

Test with Playwright at 1440, 1024, 820 and 390px, plus reduced motion. Scroll every page with real wheel
input and take frame captures. Check: console errors, hydration warnings, horizontal overflow, content stuck
invisible, scroll locking, overlapping text, menu open/close, page-to-page transitions, form submit, booking
button. Run `npm run lint`, `npm run typecheck` and `npm run build`. Report anything you could not verify.

## 6. Deliverables

1. Motion analysis of the reference (measured, not guessed).
2. The shared animation system and config.
3. Implementation across all pages, home first, then pause for my review.
4. A list of every effect: where it is used, how to turn it off.

Do not stop at a plan. Implement, test, and report honestly what is and is not done.
