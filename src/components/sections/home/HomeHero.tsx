import Link from "next/link";
import { copy } from "@/data/copy";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { HeroMedia } from "@/components/ui/HeroMedia";
import { ParallaxLayer } from "@/components/ui/ParallaxImage";

/**
 * Full-viewport hero: the video and an aerial photograph alternate across the viewport, a gradient keeps the text
 * legible, and the original tagline rises in line by line. Keeps the original hero's parallax.
 */
export function HomeHero() {
  const [lead, ...rest] = copy.home.heroLines;
  return (
    <section
      id="hero"
      aria-label="Welcome"
      className="relative isolate h-[100svh] min-h-[560px] overflow-hidden bg-ink text-white"
    >
      <ParallaxLayer k={0.8} km={0.8}>
        <HeroMedia
          videoSrc="/videos/kling_20261014_VIDEO_Create_a_p_4745_0.mov"
          imageSrc="/images/81d784_a30ae9d65f7a4c158c25796451fed75f.jpg"
          imageAlt="Aerial view of The Mountain Table's thatched house among the tea plantations"
        />
      </ParallaxLayer>
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,42,33,0.6)_0%,rgba(20,42,33,0.15)_38%,rgba(20,42,33,0.82)_100%)]"
      />

      {/* Mountain-ridge edge: the hero resolves into the ivory page instead of ending in a straight cut. */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1440 90"
        preserveAspectRatio="none"
        className="absolute inset-x-0 -bottom-px block h-10 w-full fill-ivory desk:h-[90px]"
      >
        <path d="M0 90V52l130-30 150 34 170-46 190 52 160-38 190 44 170-52 280 46v78Z" />
      </svg>

      <div className="relative mx-auto flex h-full max-w-[1180px] flex-col justify-end px-6 pb-[14vh] desk:px-8 desk:pb-[16vh]">
        <p
          className="hero-rise text-gold-soft m-0 flex items-center gap-4 text-[0.8125rem] tracking-[0.42em] uppercase"
          style={{ "--i": 0 } as React.CSSProperties}
        >
          {lead}
        </p>
        <p className="t-h2 m-0 mt-5 max-w-[16ch] tracking-[0.04em] desk:max-w-none">
          {rest.map((line, i) => (
            <span key={line} className="hero-rise block" style={{ "--i": i + 1 } as React.CSSProperties}>
              {line}
            </span>
          ))}
        </p>
        <div className="hero-rise mt-10 flex flex-wrap items-center gap-4" style={{ "--i": 3 } as React.CSSProperties}>
          <BookNowButton href="/rooms-booking" />
          <Link
            href="#intro"
            className="t-ui inline-flex h-12 items-center border border-white/60 px-9 tracking-[0.22em] text-white uppercase no-underline transition-colors duration-300 hover:border-white hover:bg-white/10"
          >
            Discover
          </Link>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="absolute bottom-[104px] left-1/2 hidden h-12 w-px -translate-x-1/2 bg-white/30 desk:block"
      >
        <span className="hero-cue block h-full w-px bg-white" />
      </span>
    </section>
  );
}
