import Link from "next/link";
import { ImageFrame, Lines, Reveal } from "@/components/motion/primitives";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { SeeDoHeroVideo } from "./SeeDoHeroVideo";

/**
 * See & Do hero, composed like the restaurant page it follows: a full-screen banner film (no overlay), with the breadcrumb,
 * eyebrow, spaced capital headline, introduction and one outlined action anchored bottom-left. The photograph drifts slowly with the
 * scroll; the headline lines rise out of a mask, then the rest fades up in turn. The wording is the page's existing copy.
 */
export function SeeDoHero() {
  return (
    <section
      id="intro"
      aria-labelledby="seedo-title"
      className="bg-forest-deep text-ivory relative isolate flex min-h-[calc(100svh-5rem)] items-end overflow-hidden"
    >
      <div aria-hidden="true" className="absolute inset-0">
        <ImageFrame
          src="/images/see-do-hero-v1.webp"
          alt=""
          sizes="100vw"
          className="h-full w-full"
          from="none"
          drift={5}
          radius={0}
          position="50% 58%"
          priority
        />
        <SeeDoHeroVideo />
      </div>
      <div className="wrap relative flex flex-col items-start pt-24 pb-16 text-left [text-shadow:0_1px_3px_rgba(0,0,0,0.55),0_2px_24px_rgba(0,0,0,0.5)] desk:pb-24">
        <Reveal y={10}>
          <nav aria-label="Breadcrumb" className="t-small text-ivory/80">
            <Link href="/" className="text-ivory/80 hover:text-ivory no-underline">
              Home
            </Link>
            <span aria-hidden="true"> / </span>
            <span aria-current="page">See &amp; Do</span>
          </nav>
        </Reveal>
        <Reveal delay={0.1} className="mt-8">
          <p className="t-eyebrow text-ivory">Adventure awaits</p>
        </Reveal>
        <Lines
          id="seedo-title"
          as="h1"
          lines={["Thrills and", "Tranquility"]}
          delay={0.2}
          className="t-h2 text-ivory m-0 mt-5 uppercase leading-[1.2] tracking-[0.16em] [font-size:clamp(2rem,1.2rem+3.2vw,3.75rem)]"
        />
        <Reveal delay={0.55} className="mt-6 max-w-[28rem]">
          <p className="t-body text-ivory/90 m-0">
            Thrilling jeep safaris, scenic trekking trails and live barbeque evenings, with diverse activities for every guest.
          </p>
        </Reveal>
        <Reveal delay={0.7} className="mt-10">
          <Link
            href="/rooms-booking#book-now"
            className="border-ivory/70 text-ivory hover:bg-ivory hover:text-forest-deep inline-flex h-12 items-center gap-3 border px-8 text-[0.75rem] tracking-[0.24em] uppercase no-underline transition-colors duration-500"
          >
            Enquire
            <ArrowIcon className="size-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
