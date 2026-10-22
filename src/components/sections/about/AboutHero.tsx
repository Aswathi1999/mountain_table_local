import Image from "next/image";
import type { CSSProperties } from "react";
import { copy } from "@/data/copy";
import { ParallaxLayer } from "@/components/ui/ParallaxImage";

const i = (n: number) => ({ "--i": n }) as CSSProperties;

/** First sentence of the existing story, used as the hero introduction. */
const intro = `${copy.about.story[0].split(". ")[0]}.`;

/** Full-viewport hero with the pool terrace at sunset; headline bottom-left, introduction bottom-right. */
export function AboutHero() {
  return (
    <section
      id="about-hero"
      aria-labelledby="about-title"
      className="relative isolate h-[100svh] min-h-[600px] overflow-hidden bg-forest-deep text-ivory"
    >
      <ParallaxLayer k={0.6} km={0.6}>
        <div className="about-zoom absolute inset-0">
          <Image
            src="/images/c18256_e258df5a2e004fb0b702a4bb9e142cec.jpg"
            alt="The infinity pool and covered terrace at sunset"
            fill
            sizes="100vw"
            priority
            className="object-cover object-[50%_60%]"
          />
        </div>
      </ParallaxLayer>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,42,33,0.6)_0%,rgba(20,42,33,0.22)_36%,rgba(20,42,33,0.86)_100%)]"
      />

      <div className="relative mx-auto flex h-full max-w-[1180px] flex-col justify-end px-6 pb-[11vh] desk:px-8 desk:pb-[13vh]">
        <p
          className="t-label hero-rise m-0 flex items-center gap-4 tracking-[0.34em] text-gold-soft uppercase"
          style={i(0)}
        >
          <span aria-hidden="true" className="block h-px w-10 bg-current" />
          Uluppuni · Vagamon · Kerala
        </p>
        <div className="mt-6 grid items-end gap-8 desk:grid-cols-12 desk:gap-10">
          <h1 id="about-title" className="t-display m-0 desk:col-span-8">
            <span className="hero-rise block" style={i(1)}>
              About
            </span>
            <span className="hero-rise block" style={i(2)}>
              The Mountain Table
            </span>
          </h1>
          <div className="hero-rise desk:col-span-4 desk:pb-3" style={i(4)}>
            <span aria-hidden="true" className="mb-5 block h-px w-14 bg-gold" />
            <p className="t-body m-0 max-w-[26rem] text-ivory/90">{intro}</p>
            <a
              href="#story"
              className="t-label about-link mt-7 inline-block pb-1 tracking-[0.3em] text-ivory uppercase no-underline"
            >
              Read our story
            </a>
          </div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-5 left-1/2 hidden h-10 w-px -translate-x-1/2 bg-white/30 desk:block"
      >
        <span className="hero-cue block h-full w-px bg-gold-soft" />
      </span>
    </section>
  );
}
