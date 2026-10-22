# Stack notes

## The original (detected)

- **Platform:** Wix (Thunderbolt renderer), React 18 runtime, Wix Chat, Wix Instagram Business app, Wix Honeycomb gallery
  (canvas), Wix Google Maps widget. Sentry and Wix telemetry (not reproduced).
- **Responsive model:** Wix serves a separate **mobile layout only to mobile user agents**, designed at 320px wide and scaled to
  the device. The desktop layout is a fixed 980px column (min-width 980px) centred on the viewport. At 750–979px the desktop
  layout simply scrolls horizontally, as on the original.
- **Fonts:** Brandon Grotesque Light (`brandon-grot-w01-light`), Didot Italic, Helvetica Bold, Anton (video lettering).
  Wix fakes bold on the Light font; the clone does the same (`font-weight: 700`).
- **Motion:** Wix entrance animations (fade/grow/slide/turn/fly), Wix background-parallax and "fixed" bg effects. See
  `ANIMATIONS.md`.

## The clone

| Layer | Choice |
|---|---|
| Framework | Next.js 16.4 App Router (Turbopack), React 19.3, TypeScript `strict` |
| Styling | Tailwind CSS 4 (CSS-first `@theme` tokens in `src/app/globals.css`) |
| Slider | Embla Carousel (`embla-carousel-react`) in one reusable `Carousel` |
| Motion | CSS transitions + `MotionController` (IntersectionObserver-free scroll check + rAF parallax) |
| Fonts | `next/font/local`, self-hosted woff2 |
| Layout model | Fixed-height blocks (`Block`) with a centred stage; children placed by `pos()` using coordinates measured on the original (desktop @1280, mobile @320). Mobile units are `rem` with the root font size set to `5vw` below 750px, which reproduces Wix's "scale the 320px design to the device". |

Server Components everywhere except: `MotionController`, `NavLinks`, `MobileMenu`, `Carousel`, `ReviewSlideshow`,
`TextVideo` (state/effects/browser APIs).

`cacheComponents` / `partialPrefetching` are deliberately **off**: with them on, Next keeps visited routes mounted
(`<Activity>`), which would stop entrance animations replaying on navigation, unlike the original.
