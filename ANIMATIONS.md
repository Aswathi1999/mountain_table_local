# Animation & motion inventory

Everything below was **measured on the live original** (Chrome, scripted slow scroll + `requestAnimationFrame` sampling:
`scripts/motion.mjs`, `scripts/parallax.mjs`) and reproduced in the clone. The original is a Wix site, so the "library" is
Wix's own viewer runtime; the clone uses plain CSS transitions plus one small client controller
(`src/components/motion/MotionController.tsx`). No animation library is installed.

## 1. Entrance animations (one-shot, time-based)

Triggered **once**, when an element first enters the viewport (about 10% of its layout box inside). Not scroll-linked, not
reversible, not re-triggered on scroll back. Each element triggers independently. Implemented with `data-reveal` /
`data-reveal-m` attributes (`src/lib/reveal.ts`) + CSS in `src/app/globals.css`. Initial hidden state is CSS (no flash, no
layout shift); `<noscript>` and `prefers-reduced-motion` show everything immediately.

| Effect (`data-reveal`) | Start state | End | Duration | Easing | Where (desktop) |
|---|---|---|---|---|---|
| `fade` | opacity 0 | 1 | 1.2s | CSS `ease-in-out` (measured: 0.15 @ 300ms, 0.53 @ 600ms, 0.88 @ 900ms) | all headings, paragraphs, icons, header nav, hero tagline |
| `grow` | opacity 0, scale 0 (mobile: scale 0.8) | 1, 1 | opacity 1.2s linear; scale 1.2s ease (mobile 0.8s) | scale: `cubic-bezier(.6,0,.4,1)` | rules/dotted lines, "slash" shape, footer rows |
| `slide-x` | opacity 0, translateX 60px | 1, 0 | 1.2s | `ease-in-out` | review card, room cards, activity 03/05 photos |
| `slide-y` | opacity 0, translateY 60px | 1, 0 | 1.2s | `ease-in-out` | mobile footer social icons, house blurb (mobile) |
| `turn` | opacity 0, `rotateY(42deg)` (origin right) | 1, 0 | 1.2s | `ease-in-out` | fixed social bar (desktop), intro logo (mobile) |
| `fly` | translateX from the viewport edge (right: `50vw − 209px`, left: `490px − 50vw`; "Exciting Escapes": −211px), **no fade** | 0 | 1.2s | `ease-in-out` | See & Do photo pills #1/#2/#4/#6, "Exciting Escapes" caption |
| `fly-y` | translateY 95–200px, no fade | 0 | 1.2s | `ease-in-out` | See & Do photo pills on mobile |
| `none` | – | – | – | – | hero tagline banner on desktop (static; fades on mobile) |

Per-element effect choice (desktop / mobile) is set where each element is rendered, e.g. `rv("slide-x", "fade")`.

## 2. Scroll-linked: parallax image layers

An image as tall as the viewport sits inside an `overflow:hidden` box; its offset is
`translateY = −k · clamp(sectionTop, −sectionHeight, viewportHeight)` (sectionTop = the box's top relative to the viewport).

| Element | Desktop k | Mobile k |
|---|---|---|
| Home hero photo | 0.8 | 0.8 |
| Home image strips (dining, bedroom, bathroom) | 0.8 | 1.0 (pinned to viewport) |
| About "Our Story" left photo | 1.0 (pinned to viewport) | 1.0 |

(`ParallaxImage` → `data-parallax` / `data-parallax-m`, driven by `MotionController`, one passive scroll listener,
`requestAnimationFrame`-throttled, transform-only.) Disabled under `prefers-reduced-motion`.

## 3. Hover / state transitions

| Element | Change | Duration |
|---|---|---|
| Header nav links | colour `#c8c8c8` → `#929191` (also the active page colour) | 0.4s |
| "Explore" / "Book Now" pill | background `#5b5a5a` → `#ff4f4f` | 0.2s |
| Discover arrows | opacity 0.9 → 1 | 0.2s |
| Honeycomb tiles (See & Do) | white 75% overlay fades in | 0.3s (estimate; the original draws on a canvas) |

## 4. Sliders / loops

| Element | Behaviour |
|---|---|
| Discover gallery (home) | 267×475 slides, 15px gap, **no autoplay**; arrow/drag. First slide flush left; every later position insets the target slide by 74px (click 1 moves 208px, each next click one slide). Embla `align` function reproduces this. Prev arrow appears after the first move. |
| Guest review (home) | 3 quotes, auto-advance every **3.0s**, crossfade **1.0s** ease-in-out, 3 dots (active = grey) that also switch slides. Autoplay off under reduced motion. |
| "Adventure Awaits:" (See & Do) | looping, muted, autoplaying video (480p MP4) showing through the Anton lettering via an SVG mask. Paused under reduced motion. |

## 5. Not present in the original (not added)

No preloader, no page transitions, no smooth-scroll library, no custom cursor, no marquee, no counters, no scroll-jacking.

## Known deviations

See the "Known deviations" section of `README.md`.
