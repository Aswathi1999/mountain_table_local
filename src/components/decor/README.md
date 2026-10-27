# Decor library

Small, reusable decorative elements for The Mountain Table: inline SVG or CSS only, no image files. Every element is
`aria-hidden="true"` and ignores the pointer. They use the project's real tokens (`gold`, `gold-soft`, `gold-ink`, `clay`, `ivory`,
`forest`, plus one new `--color-sage`), Cormorant for display and Caveat for script. Body type stays Manrope.

```tsx
import { Fern, OrnamentRule, Contour, tone } from "@/components/decor";

<section className="relative overflow-hidden">
  <Fern size={120} rotate={14} opacity={0.5} draw className="decor-lg absolute top-10 -right-8" />
  <OrnamentRule />
</section>;
```

## Shared props (`DecorProps`)

Line-art elements (botanicals, doodles, compass) and stamps take:

| Prop        | Meaning                                                                                                  |
| ----------- | -------------------------------------------------------------------------------------------------------- |
| `color`     | Any CSS colour. Use `tone.gold`, `tone.goldSoft`, `tone.sage`, `tone.clay`, `tone.ivory`, `tone.forest`. |
| `size`      | Width (number = px, or any CSS length like `"clamp(5rem, 12vw, 9rem)"`). Height follows the artwork.     |
| `rotate`    | Degrees.                                                                                                 |
| `opacity`   | 0 to 1. Keep decoration at 0.1 to 0.6 except small gold accents.                                         |
| `flip`      | Mirror horizontally.                                                                                     |
| `draw`      | Animation hook: strokes draw in as the element scrolls into view.                                        |
| `float`     | Animation hook: slow vertical drift.                                                                     |
| `className` | Position with Tailwind (`absolute …`). Add `decor-lg` to hide below 768px.                               |

Layout rule: decorations are absolutely positioned inside a `relative` section. Where one bleeds off an edge, wrap it in
`<Bleed>` (clips it without touching the section's own overflow).

## Elements

| Group            | Components                                                                                                                                      |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| A. Botanicals    | `Fern`, `PineSprig`, `GrassStem`, `Wildflower`, `LeafyBranch`                                                                                   |
| B. Ridges        | `Ridge` (`layer="far" \| "mid" \| "near"`), `RidgeStack` (all three, three tints of one colour)                                                 |
| C. Contour lines | `Contour` (fills its relative parent; sage at about 20%)                                                                                        |
| D. Dividers      | `WaveDivider` / `WaveDividerTop` (the existing hero curve), `RidgeDivider`, `OrnamentRule` (`glyph="diamond" \| "mountain" \| "leaf"`, `align`) |
| E. Gold accents  | `GoldFrame`, `CornerBrackets`, `Diamond`, `DiamondList`, `Foil` (small accents only)                                                            |
| F. Doodles       | `CurvedArrow`, `LooseCircle`, `Swoosh`, `Heart`, `Sparkle`, `DottedTrail` (`vertical`)                                                          |
| G. Stamps        | `RotatingBadge` (`text`, `spin`), `Postmark` (`top`, `bottom`, `date`, `lines`), `WaxSeal`                                                      |
| H. Frames        | `.frame-arch` and `.frame-pill` classes, `InnerBorder`, `Polaroid` (`caption`, `rotate`)                                                        |
| I. Atmosphere    | `PaperGrain`, `GoldGlow`, `Watermark`, `Bleed`, `FilmEdge`                                                                                      |
| J. Wayfinding    | `CompassRose`, `Coordinates` (`altitude?`), `SectionMarker` (`n`)                                                                               |
| K. Icons         | `Icon` (`name`: rooms, dining, adventure, spa, fire, events, wifi, coffee, leaf, compass, phone, email, pin)                                    |

Notes:

- `Coordinates` reads the property's verified coordinates from `src/lib/site.ts`. An altitude is shown only if you pass one
  (none is recorded in the project, so none is invented).
- `Postmark` omits the "EST." line unless you pass `date` (for example `date="EST. 2019"`): the founding year is not in the project.
- `ImageFrame` (`components/motion/primitives.tsx`) now accepts `radius` as a number or any CSS `border-radius` (for example
  an arch top).
- Paper grain is a 180px tiled SVG tile in `globals.css` (`.paper-grain`), not a large image, so scrolling is unaffected.

## Animation hooks (in `globals.css`)

- `data-draw` (set by `draw`): strokes draw in on a scroll timeline where `animation-timeline: view()` is supported; elsewhere they simply stay drawn.
- `data-float` (set by `float`): gentle drift.
- `data-rotate` (set by `RotatingBadge`): slow rotation.
- All three are disabled under `prefers-reduced-motion: reduce`.

## Where each element is used

To remove one, delete its JSX line (and the import if it was the last use).

| Page / area         | Element                                                        | File                                            |
| ------------------- | -------------------------------------------------------------- | ----------------------------------------------- |
| Home, Reviews       | `OrnamentRule` above the heading                               | `components/sections/home/HomeReviews.tsx`      |
| Home, Rooms preview | `PineSprig` (bottom-left, cut off)                             | `components/sections/home/HomeRoomsPreview.tsx` |
| Rooms               | `GoldFrame` behind Room 1's photo                              | `components/sections/rooms/RoomsList.tsx`       |
| About               | `Wildflower` and `Postmark` on the story collage               | `components/sections/about/AboutStory.tsx`      |
| About               | `RidgeDivider` at the bottom of the quote band                 | `components/sections/about/AboutQuote.tsx`      |
| See & Do            | `CompassRose` on the hero photo                                | `components/sections/see-do/SeeDoHero.tsx`      |
| Gallery             | `FilmEdge` on the In Motion section                            | `components/sections/gallery/GalleryFilm.tsx`   |
| Blog                | `PaperGrain` and `Fern` on the article list                    | `app/blog/page.tsx`                             |
| Contact             | `CurvedArrow` and a Caveat "say hello" under the WhatsApp card | `components/sections/contact/ContactCards.tsx`  |
| Footer (all pages)  | `RidgeStack` along the top edge                                | `components/layout/Footer.tsx`                  |
| Footer (all pages)  | `CompassRose` and `Coordinates` in the bottom row              | `components/layout/Footer.tsx`                  |
| Footer (all pages)  | `LeafyBranch` near the newsletter column                       | `components/layout/Footer.tsx`                  |

Already on the site before this library (left as they were): the hero `CurveEdge`, `LeafSprig` sprigs, the Services watermark,
gold diamond markers in the policies list, the Services and Experience frames and the Contact wax-seal animation.
