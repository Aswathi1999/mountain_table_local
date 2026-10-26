import type { Metadata, Viewport } from "next";
import { ChatBubble } from "@/components/layout/ChatBubble";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MotionProvider } from "@/components/motion/MotionProvider";
import { caveat, cormorant, manrope } from "@/lib/fonts";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: "The Mountain Table",
  formatDetection: { telephone: false },
  verification: { google: "7S4eAE8plXrs1-1JSpHOA2bPOOd98BpaX7y_PoOFOWY" },
  other: { "fb:admins": "themountaintableresort" },
  icons: {
    icon: [
      { url: "/favicon/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    shortcut: "/favicon/favicon-32.png",
    apple: "/favicon/apple-touch-icon.png",
  },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${manrope.variable} ${cormorant.variable} ${caveat.variable}`}>
      <body>
        <noscript>
          <style>{`[data-motion]{opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
        <a href="#PAGES_CONTAINER" className="skip-link">
          Skip to Main Content
        </a>
        <MotionProvider>
          <Header />
          <main id="PAGES_CONTAINER">{children}</main>
          <Footer />
          <ChatBubble />
        </MotionProvider>
      </body>
    </html>
  );
}
