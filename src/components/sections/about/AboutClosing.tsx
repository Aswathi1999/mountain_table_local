import Image from "next/image";
import Link from "next/link";
import { contact } from "@/lib/site";
import { rv, stagger } from "@/lib/reveal";

/** Closing invitation over the pool at night; links to the existing booking page and phone number. */
export function AboutClosing() {
  return (
    <section
      id="invitation"
      aria-labelledby="invitation-title"
      className="relative isolate overflow-hidden bg-forest-deep py-32 text-center text-ivory desk:py-[220px]"
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
        <div data-drift="0.1" className="absolute inset-x-0 -top-[10%] h-[120%] will-change-transform">
          <Image
            src="/images/81d784_1c2a1355792941408dd4987fa7e78484.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(20,42,33,0.7),rgba(20,42,33,0.55)_50%,rgba(20,42,33,0.85))]" />
      </div>

      <div className="mx-auto max-w-[860px] px-6">
        <span aria-hidden="true" className="mx-auto block h-12 w-px bg-gold" {...rv("grow", "grow")} />
        <h2 id="invitation-title" className="t-display m-0 mt-8" {...rv("rise", "rise", stagger(0.1))}>
          Step into our story
        </h2>
        <p className="t-lead mx-auto m-0 mt-8 max-w-[34rem] text-ivory/85" {...rv("rise", "rise", stagger(0.25))}>
          Whether for romance, family, or business, The Mountain Table ensures an unforgettable stay amid nature&apos;s
          enchantment.
        </p>
        <div
          className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-6"
          {...rv("rise", "rise", stagger(0.4))}
        >
          <Link
            href="/rooms-booking"
            className="t-label group inline-flex h-14 items-center gap-4 bg-gold px-10 tracking-[0.28em] text-forest-deep uppercase no-underline transition-all duration-500 hover:bg-ivory hover:tracking-[0.32em] focus-visible:bg-ivory"
          >
            Book your stay
            <span aria-hidden="true" className="transition-transform duration-500 group-hover:translate-x-2">
              →
            </span>
          </Link>
          <a
            href={contact.phoneHref}
            className="t-label about-link pb-1 tracking-[0.28em] text-ivory uppercase no-underline"
          >
            {contact.phoneLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
