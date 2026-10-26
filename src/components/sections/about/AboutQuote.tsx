"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/motion/primitives";
import { StoryDialog } from "@/components/sections/home/HomeDiscover";

/** The vision sentence from the existing story, set as a pull quote. */
const quote =
  "Driven by a vision of eco-friendly hospitality, The Mountain Table emerged as a haven where nature's harmony thrives.";

/**
 * The quote band, as in the About design: deep green on the left fading into a terrace photograph on the right, a gold quote mark,
 * the quote in the serif italic, and a "Watch Our Story" button that opens the property film.
 */
export function AboutQuote() {
  const [open, setOpen] = useState(false);
  return (
    <section
      aria-label="In our words"
      className="bg-forest-deep text-ivory relative isolate overflow-hidden py-24 desk:py-32"
    >
      <div className="absolute inset-0 -z-10">
        <Image
          src="/images/about/quote.jpg"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: "right center" }}
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,#0a221b_0%,#0a221b_38%,rgba(10,34,27,0.55)_70%,rgba(10,34,27,0.25)_100%)] max-desk:bg-[rgba(10,34,27,0.78)]"
      />
      <div className="wrap">
        <div className="max-w-[35rem]">
          <Reveal y={16}>
            <svg viewBox="0 0 48 40" className="text-gold-soft h-9 w-11" fill="currentColor" aria-hidden="true">
              <path d="M0 40V22C0 9 7 2 19 0l2 5c-7 2-10 7-10 13h9v22zm27 0V22C27 9 34 2 46 0l2 5c-7 2-10 7-10 13h9v22z" />
            </svg>
          </Reveal>
          <Reveal delay={0.1} className="mt-6">
            <blockquote className="t-quote m-0 italic">{quote}</blockquote>
          </Reveal>
          <Reveal delay={0.25} className="mt-10">
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="group text-ivory inline-flex cursor-pointer items-center gap-4 border-0 bg-transparent p-0"
            >
              <span className="border-ivory/60 group-hover:bg-ivory group-hover:text-forest-deep flex size-[3.25rem] items-center justify-center rounded-full border transition-colors duration-500">
                <svg viewBox="0 0 24 24" className="ml-0.5 size-4" fill="currentColor" aria-hidden="true">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <span className="t-ui">Watch Our Story</span>
            </button>
          </Reveal>
        </div>
      </div>
      <StoryDialog open={open} onClose={() => setOpen(false)} />
    </section>
  );
}
