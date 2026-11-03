# Resort design and motion brief

References: https://jannataresort.com/ and https://www.era-residence.com/

## Direction
Retain the mountain identity and existing cinematic opening. Use Jannata's accommodation emphasis and ERA's large photographic editorial composition as inspiration. Reference page text was inspected; exact live animation timing was not verified. Implement original transitions rather than copying source code.

## Tokens and composition
Forest #243B30, mountain mist #E8EDE7, ivory #F6F2EA, white #FFFFFF. Retain the established display and body fonts. Left-align accommodation copy beside a tall, dominant photograph; stack the photograph above controls on mobile.

Layout: [heading / room selectors / description / booking] [large room photograph]

## Review
Avoid another row of identical cards. Give accommodation one generous photographic stage. Preserve real room names, descriptions, imagery, and booking routes; generated resort photography is unnecessary for this change.

## Implemented requirements
- Replace the homepage room card grid with an interactive editorial showcase.
- Room selectors update the photograph and description; selection is exposed through aria-pressed.
- Blend photos using a 500ms opacity transition and subtle incoming scale.
- Disable transitions for reduced-motion preferences.
- Preserve visible focus indicators, touch controls, responsive layout and booking link.
- Preserve the existing user edits and cinematic motion elsewhere.

## Verification
Run npm run typecheck and npm run lint. Markdown is a specification, not an executable; its implementation is in HomeRoomsPreview.tsx and globals.css.

## Superseded
The interactive room showcase was reverted at the user's request. The homepage again uses the original three-card room layout and its existing animations.
