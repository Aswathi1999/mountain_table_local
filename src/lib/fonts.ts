import localFont from "next/font/local";

// The site's single typeface: a self-hosted copy of the original's Brandon Grotesque (one Light weight, ~17 KB).
// Hierarchy is made with size, letter spacing and case, so no second family or synthetic bold is ever needed.
export const brandon = localFont({
  src: "../../public/fonts/brandon-grot-w01-light.woff2",
  variable: "--font-face-brandon",
  weight: "400",
  display: "swap",
  adjustFontFallback: "Arial",
  fallback: ["Avenir Next", "Century Gothic", "Segoe UI", "system-ui", "sans-serif"],
});
