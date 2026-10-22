# External embeds, widgets and tags

The clone builds and runs **offline**: every image, font, icon, video and data file is local (`public/`, `archive/`). Only the
items below talk to a third party.

| Item | What the original did | What the clone does |
|---|---|---|
| Google Map (footer) | Wix Google Maps widget, lat 9.742779 / lng 76.900931, zoom 14, roadmap, with an info bubble "The Mountain Table Premium Homestay at Uluppuni · Directions" | Keyless Google Maps `<iframe>` (`MAP_EMBED_URL` in `src/lib/site.ts`) of the same point, sandboxed, lazy. The info bubble is not reproduced. CSP `frame-src https://www.google.com`. |
| Instagram feed (About) | Wix "Instagram Business" widget in an iframe (`instafeed.codev.wixapps.net`), live feed | Static rebuild: the first 12 posts' photos were captured and are stored in `public/images/instagram/`; tiles link to the posts. Content is a snapshot of the feed at capture time. |
| Wix Chat (bottom corner) | Third-party chat iframe (`engage.wixapps.net`), "Let's Chat!" launcher | Static launcher button with the same icon/colour; **does nothing** (`TODO` in `ChatBubble.tsx`). |
| Social links | Facebook `themountaintableresort`, Instagram `themountaintable` | Plain outbound links (`rel="noopener noreferrer"`). |
| Analytics / pixels | Wix site tags, Sentry, Wix "frog" telemetry | **Not loaded.** No tracking of any kind. |
| Fonts | Wix-hosted Brandon Grotesque Light, Didot Italic, Helvetica Bold; Google Anton | Self-hosted copies in `public/fonts` via `next/font/local`. |

Identifiers found on the original: Google site verification token (kept as `verification.google` meta), `fb:admins`
= `themountaintableresort`.
