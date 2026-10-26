import Image from "next/image";
import Link from "next/link";
import { HideOnHome } from "./HideOnHome";
import { Lines, ParallaxBand, Reveal } from "@/components/motion/primitives";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { LocationSection } from "@/components/sections/contact/LocationSection";
import { BookNowButton } from "@/components/ui/BookNowButton";
import { LeafSprig } from "@/components/ui/decor";
import { contact, nav, social } from "@/lib/site";

const link = "t-small link-u text-ivory/80 hover:text-ivory transition-colors";
const heading = "t-kicker text-gold-soft m-0";

/** Closing call to action copy, as set in the approved design reference (without its "best rates" claim, which the site does not make). */
const cta = {
  signature: "Stay · Relax · Explore",
  lines: ["Your Mountain", "Escape Awaits"],
  body: "Book directly with us and arrive to a warm welcome at the door.",
} as const;

/**
 * Closing area shared by every page: location and contact (every page except the homepage), then the call to action (a misty valley photograph under a forest tint,
 * with the headline and the booking button) and a deep green footer with the logo, page links, contact details and social links.
 */
export function Footer() {
  const phone = contact.phoneLabel.replace(/^Tel:\s*/, "");
  return (
    <footer id="SITE_FOOTER">
      <HideOnHome>
        <LocationSection />
        <ContactSection />
      </HideOnHome>

      <section aria-labelledby="cta-title" className="bg-forest-deep text-ivory relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <ParallaxBand
            src="/images/c18256_e5d979a1e3574fa4982be5aba13e7d68.jpg"
            alt=""
            className="h-full"
            k={0.25}
            km={0}
            position="50% 55%"
          />
        </div>
        <div aria-hidden="true" className="bg-forest-deep/70 absolute inset-0 -z-10" />
        <div className="wrap flex flex-col items-center py-24 text-center desk:py-32">
          <Reveal>
            <p className="t-script text-gold-soft m-0 text-[1.5rem] desk:text-[1.875rem]">{cta.signature}</p>
          </Reveal>
          <Lines
            id="cta-title"
            as="h2"
            lines={cta.lines}
            className="t-h2 m-0 mt-4 text-center [font-size:clamp(2.25rem,1.4rem+3vw,3.75rem)]"
          />
          <Reveal delay={0.12} className="mt-5">
            <p className="t-body text-ivory/85 m-0 mx-auto max-w-[26em] [font-size:0.9375rem]">{cta.body}</p>
          </Reveal>
          <Reveal delay={0.22} className="mt-9">
            <BookNowButton href="/rooms-booking" />
          </Reveal>
        </div>
      </section>

      <div className="bg-forest-deep text-ivory relative">
        <div className="relative overflow-hidden">
          <LeafSprig className="text-ivory/10 pointer-events-none absolute -right-6 bottom-0 hidden h-80 w-auto rotate-12 lg:block" />
          <div className="wrap relative grid gap-12 pt-16 pb-12 desk:pt-20 lg:grid-cols-12 lg:gap-x-10">
            <Reveal className="lg:col-span-4">
              <Link href="/" aria-label="The Mountain Table, home" className="inline-block no-underline">
                <Image
                  src="/images/logo-wordmark-light.png"
                  alt="The Mountain Table"
                  width={464}
                  height={278}
                  sizes="140px"
                  className="h-auto w-[8.75rem]"
                />
              </Link>
              <p className="t-small text-ivory/75 m-0 mt-5 max-w-[22em]">
                A luxury mountain retreat where nature, comfort and good food come together.
              </p>
            </Reveal>

            <Reveal delay={0.08} className="lg:col-span-2 lg:col-start-6">
              <nav aria-label="Footer">
                <p className={heading}>Explore</p>
                <ul className="m-0 mt-4 grid list-none gap-2.5 p-0">
                  {nav.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href} className={link}>
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </Reveal>

            <Reveal delay={0.16} className="lg:col-span-3">
              <p className={heading}>Contact</p>
              <ul className="m-0 mt-4 grid list-none gap-2.5 p-0">
                <li>
                  <address className="t-small text-ivory/80 not-italic">{contact.address}</address>
                </li>
                <li>
                  <a href={contact.phoneHref} className={link}>
                    {phone}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${contact.email}`} className={`${link} [overflow-wrap:anywhere]`}>
                    {contact.email}
                  </a>
                </li>
              </ul>
            </Reveal>

            <Reveal delay={0.24} className="lg:col-span-2">
              <p className={heading}>Follow</p>
              <ul className="m-0 mt-4 grid list-none gap-2.5 p-0">
                <li>
                  <a href={social.instagram} target="_blank" rel="noopener noreferrer" className={link}>
                    Instagram<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
                <li>
                  <a href={social.facebook} target="_blank" rel="noopener noreferrer" className={link}>
                    Facebook<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              </ul>
            </Reveal>
          </div>

          <div className="border-ivory/12 border-t">
            <div className="wrap text-ivory/60 flex flex-wrap items-center justify-between gap-3 py-6">
              <p className="t-small m-0">{contact.copyright}</p>
              <a href="#SITE_HEADER" className="t-small link-u text-ivory/60 hover:text-ivory transition-colors">
                Back to top
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
