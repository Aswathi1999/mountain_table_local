/**
 * Home page cinematic effects: every duration, distance, colour and switch lives here. Set an effect's `enabled` to false to turn
 * just that effect off (the content stays, in its normal static state). `minWidth` is the narrowest window an effect runs at:
 * pinned and scrubbed effects need 1024px, the cursor and tilt effects 768px. Every effect is also skipped for visitors who
 * prefer reduced motion. Durations are in seconds.
 */
export const HOME_FX = {
  ease: [0.22, 1, 0.36, 1] as const,
  color: {
    forest: "#0B2B1F",
    forestDeep: "#0A221B",
    cream: "#F7F4ED",
    beige: "#EFE6D3",
    gold: "#B8912F",
    night: "#0A221B",
    twilight: "10, 24, 52",
    golden: "255, 176, 84",
  },

  /** Video files (put the real ones in /public/videos; the existing hero clip is the fallback source). */
  video: {
    heroLoop: "/videos/hero-loop.mp4",
    heroFallback: "/videos/kling_20261014_VIDEO_Create_a_p_4745_0.mov",
    heroPoster: "/images/hero-poster.jpg",
    film: "/videos/Video_20261027_142530_254.mp4",
    filmFallback: "/videos/kling_20261014_VIDEO_Create_a_p_4745_0.mov",
  },

  /** 1. Hero: text-mask intro (video seen through the headline, then the mask opens), scroll zoom, copy lifting away. */
  heroIntro: { enabled: true, minWidth: 768, hold: 0.9, open: 1.5, textScaleFrom: 1.9, bgFade: 1.1, skipOnScrollPx: 8 },
  hero: { enabled: true, zoomTo: 1.1, copyLift: 70 },

  /** 2. Experience: pinned photo story (three steps, one per feature row). */
  experience: { enabled: true, minWidth: 1024, pinVh: 150, wipe: 1.1 },

  /** 3. Discover: sunset to night with the scroll, glowing lights; the film modal. */
  discover: { enabled: true, minWidth: 768, zoomTo: 1.12, goldenOpacity: 0.28, twilightOpacity: 0.55, lights: 14 },

  /** 5. Rooms: 3D deal-in, hover tilt with shine, magnetic button. */
  rooms: {
    enabled: true,
    minWidth: 768,
    rotateFrom: 25,
    perspective: 1200,
    tiltMax: 6,
    magnetRadius: 90,
    magnetStrength: 0.3,
  },

  /** 6. Reviews: beige to night green, twinkling stars, rating count-up (rating is shown only if you set a real value). */
  reviews: { enabled: true, stars: 46, floatPx: 4, floatSeconds: 4, rating: null as number | null, ratingOutOf: 5 },

  /** 7. Booking banner: pulls into focus (zoomed and blurred to sharp), words reveal one by one, gold shimmer on the button. */
  banner: { enabled: true, scaleFrom: 1.3, blurFrom: 14, wordStagger: 0.09 },

  /** 8. Header (hide on scroll down, progress line), custom cursor. */
  header: { enabled: true, hideAfterPx: 240, progressLine: true },
  cursor: { enabled: true, minWidth: 1024, dot: 8, ring: 40, ringGrown: 84, ringShrunk: 22, follow: 0.16 },
} as const;

export type HomeFxKey = keyof typeof HOME_FX;

/**
 * About page ("a story being told"): the same rules as `HOME_FX` (set `enabled: false` to turn one effect off and show its content
 * in the normal static state; `minWidth` is the narrowest window it runs at; reduced motion skips every effect). Seconds and px.
 */
export const ABOUT_FX = {
  /** Hero: the photograph comes into focus (zoomed and washed out to full colour), slow parallax, copy lifts away on scroll. */
  hero: { enabled: true, minWidth: 768, scaleFrom: 1.08, saturateFrom: 0.6, settle: 2.5, parallax: 0.3, copyLift: 40 },
  /** Our Story: ink-settling paragraphs, page-turn photo, album-drop photo, soft disc, drawn leaf. */
  story: {
    enabled: true,
    blur: 6,
    inkRise: 10,
    inkStep: 0.14,
    sweepOpacity: 0.3,
    drop: { rotate: -6, y: -64, delay: 0.9, duration: 1.3 },
    disc: { scaleFrom: 0.7 },
  },
  /** What we believe: pinned for `pinVh` of scroll while the four cards are dealt in; icons draw themselves. */
  values: { enabled: true, minWidth: 1024, minHeight: 640, pinVh: 100, rotateFrom: 3, riseVh: 55, lift: 6 },
  /** Quote band: the photograph zooms with the scroll, quote mark draws, words brighten as you read, button ring pulses. */
  quote: { enabled: true, zoomTo: 1.08, wordFloor: 0.2, pulseSeconds: 3.2 },
  /** Stay / Dine / Explore: rise-from-the-bottom reveal, images settle, labels write in, desktop accordion on hover. */
  tiles: { enabled: true, zoomFrom: 1.1, stagger: 0.14, grow: 1.6, labelDelay: 0.7 },
  /** Our promise: image and panel slide together, ticks draw in turn, a few leaves drift once. */
  promise: { enabled: true, slide: 40, itemStep: 0.5, leaves: 5, leafMinWidth: 768 },
} as const;

/**
 * Gallery page ("a photographer's journal"): the same rules as `HOME_FX` / `ABOUT_FX` (`enabled: false` turns one effect off and
 * shows its content in the normal static state; `minWidth` is the narrowest window it runs at; reduced motion skips every effect).
 */
export const GALLERY_FX = {
  /** Hero: postcards dealt face-down from the centre, flipped, fanned out and "developed"; scroll spread; hover lean. */
  hero: {
    enabled: true,
    dealStart: 1.0,
    dealStep: 0.28,
    flip: 1.1,
    develop: 1.5,
    developFrom: "brightness(1.6) saturate(0) contrast(0.7)",
    spread: 46,
    hoverLift: 18,
    lean: 10,
    captionDelay: 3.1,
    minWidth: 768,
  },
  /** Filters: sliding pill, FLIP wall, counting number. */
  filters: {
    enabled: true,
    pill: { type: "spring", stiffness: 380, damping: 34 },
    countSeconds: 0.8,
    enterScale: 0.92,
    enterStagger: 0.05,
  },
  /** Feature viewer: wipe + slower outgoing photo, blur text swap, odometer counter, Ken Burns, shared-element fly-in. */
  viewer: {
    enabled: true,
    wipe: 0.95,
    outShift: 14,
    text: 0.45,
    kenBurns: 1.06,
    kenBurnsSeconds: 12,
    fly: 0.9,
    swipePx: 60,
  },
  /** Wall: bottom clip reveal, column parallax (px over the wall's scroll), hover sheen, outline draw, Load more. */
  wall: {
    enabled: true,
    reveal: 1.0,
    stagger: 0.06,
    parallax: [0, -30, -15] as readonly number[],
    parallaxMinWidth: 1024,
    loadDelay: 650,
  },
  /** Viewfinder cursor over the wall and the viewer. */
  cursor: { enabled: true, minWidth: 1024, frame: 34, frameGrown: 78, snapMs: 150 },
  /** In Motion band: shutter iris, parallax, ring, morphing play button. */
  film: { enabled: true, blades: 8, iris: 1.2, parallax: 6, ringSeconds: 3, morph: 0.6, parallaxMinWidth: 768 },
  /** Guest grid: instant-photo flip, heart pop on hover. */
  guests: { enabled: true, flipFrom: 90, tilt: 2, stagger: 0.1 },
} as const;

/**
 * Rooms & Booking page ("arriving and checking in"): same rules as the other `*_FX` blocks (`enabled: false` turns an effect off
 * and shows its content normally; reduced motion skips every effect). Seconds and px.
 */
export const ROOMS_FX = {
  /** Hero: the room's lights come on (it starts darker and cooler and warms; soft glows fade in over the downlights and lamp). */
  hero: {
    enabled: true,
    minWidth: 768,
    brightnessFrom: 0.75,
    tintOpacity: 0.4,
    settle: 2.5,
    glowDelay: 1.1,
    glowStep: 0.35,
    glowSeconds: 1.4,
    parallax: 0.3,
    copyLift: 40,
    /** Glow positions as % of the photograph itself (x, y, size as % of its width): the three downlights and the wall lamp. */
    glows: [
      [7.4, 17.6, 11],
      [36.8, 22.4, 11],
      [46, 34.7, 9],
      [97.5, 12.8, 13],
    ] as readonly (readonly [number, number, number])[],
  },
  /** Room photographs open from the centre outward, like double doors, and the text follows. */
  doors: { enabled: true, textDelay: 0.5, seam: 0.9 },
  /** Policies: each row's top rule draws left to right, then its text fades in. */
  policies: { enabled: true, textDelay: 0.3 },
} as const;

/**
 * Contact page ("a letter to the mountain"): same rules as the other `*_FX` blocks (`enabled: false` turns an effect off and shows
 * its content normally; reduced motion skips every effect). Seconds, px and degrees.
 */
export const CONTACT_FX = {
  /** Hero: the mist clears (blur and brightness settle), a faint mist drifts across the lower part, parallax, copy lifts away. */
  hero: {
    enabled: true,
    minWidth: 768,
    blurFrom: 8,
    brightnessFrom: 1.15,
    clear: 2,
    mistSeconds: 40,
    mistOpacity: 0.16,
    parallax: 0.3,
    copyLift: 40,
  },
  /** Contact cards: rise one by one; icons act once and again on hover; copy to the clipboard. */
  cards: { enabled: true, rise: 40, stagger: 0.12, delay: 0.5, copiedMs: 1500 },
  /** Message section: photo wipe, handwriting, drawn leaf. */
  message: { enabled: true },
  /** The form: lines revealed top to bottom, gold underline, ticks, the sealed-letter sequence. */
  form: {
    enabled: true,
    lineStep: 0.09,
    seal: {
      enabled: true,
      /** Each step is [start, duration] in seconds: the two folds (angle in degrees), the envelope rising, the letter sliding in, the flap closing, the wax seal pressed on, the envelope floating away; then the thank-you shows. */
      foldAngle: 180,
      fold1: [0.2, 0.35],
      fold2: [0.5, 0.35],
      rise: [0.7, 0.4],
      slideIn: [1.1, 0.3],
      flap: [1.45, 0.25],
      stamp: [1.7, 0.25],
      floatOut: [2.0, 0.4],
      thanksAt: 2.25,
    },
  },
  /** Finding us: the panel rises, the button is magnetic, the map fades in over its placeholder. */
  location: { enabled: true, rise: 40, mapFade: 0.8 },
} as const;
