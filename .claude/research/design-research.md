# Design research

**Limitation:** no new live web research was run in this session. The project's design direction is already set by approved implementation and the owner's decisions, so external trend research would not change what is allowed. This file records the operative design position, not fresh findings.

## Direction (from the repo)
- Identity is protected: palette and tokens in `src/app/globals.css`, fonts in `src/lib/fonts.ts` (Cormorant Garamond display, Manrope body, Caveat accents), real Vagamon photography, existing copy.
- Tone per `RESORT-DESIGN-BRIEF.md` and `DESIGN-SYSTEM.md`: calm, editorial, nature-led hospitality. Resolve conflicts in favour of current CSS tokens.
- Avoid: purple gradients, glassmorphism, generic card grids, stock/AI people, invented amenities. Existing rounded or card forms stay where already approved.

## Motion
Moderate, storytelling-led (scroll reveals, parallax, hero film, splash). Existing Motion tokens/primitives and Lenis only; reduced-motion, touch and no-JS must work; no scroll-jacking. See `ANIMATIONS.md`.

## Imagery
Keep real property photography. Concept/generated images in `public/images/*-concept-*` and `archive/generated/` are exploratory; their authorization status is for the owner to confirm before use. Alt text and licensing: see mountain-seo-assets.

## Reference sources for future tasks (not fetched this session)
W3C WCAG 2.2 quickref, web.dev Web Vitals, MDN, Google Search Central, Nielsen Norman Group, Awwwards/SiteInspire for reference only.
