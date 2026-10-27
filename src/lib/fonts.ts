import localFont from "next/font/local";

// Display face: Cormorant Garamond (variable weight 300 to 700, roman and italic, latin subset). A calm, high-contrast
// garalde with generous italics. Used for headings, pull quotes, the wordmark and figures.
export const cormorant = localFont({
  src: [
    { path: "../../public/fonts/cormorant-garamond-latin.woff2", style: "normal", weight: "300 700" },
    { path: "../../public/fonts/cormorant-garamond-italic-latin.woff2", style: "italic", weight: "300 700" },
  ],
  variable: "--font-face-display",
  display: "swap",
  adjustFontFallback: "Times New Roman",
  fallback: ["Georgia", "serif"],
});

// Text face: Manrope (variable weight 200 to 800, latin subset). Clean, open and sturdy at small sizes; used for running
// text, navigation, buttons and captions.
export const manrope = localFont({
  src: "../../public/fonts/manrope-latin.woff2",
  variable: "--font-face-text",
  weight: "200 800",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["system-ui", "Segoe UI", "sans-serif"],
});

// Handwritten accent (variable weight, latin subset): used only for the small "Stay Relax Explore" signature in the Experience section.
export const caveat = localFont({
  src: "../../public/fonts/caveat-latin.woff2",
  variable: "--font-face-script",
  weight: "400 600",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["cursive"],
});
