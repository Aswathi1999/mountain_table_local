import Link from "next/link";
import { Bleed, CompassRose, Coordinates, LeafyBranch, RidgeStack } from "@/components/decor";
import { Reveal } from "@/components/motion/primitives";
import { contact, nav } from "@/lib/site";
import { BackToTop } from "./BackToTop";
import { CtaBanner } from "./CtaBanner";
import { NewsletterForm } from "./NewsletterForm";
import { SocialIcons } from "./SocialIcons";

const link =
  "t-small text-ivory/80 no-underline hover:text-gold-soft inline-block transition-[color,transform] duration-300 hover:translate-x-1 [font-size:0.875rem]";
const heading = "t-ui text-gold-soft m-0 font-semibold tracking-[0.24em] uppercase [font-size:0.75rem]";

/** A column heading with a short gold rule beneath it. */
function ColumnHeading({ children }: { children: string }) {
  return (
    <>
      <p className={heading}>{children}</p>
      <span aria-hidden="true" className="bg-gold-soft/50 mt-3 block h-px w-8" />
    </>
  );
}

/**
 * Closing area shared by every page: the call to action (a misty valley photograph under a forest tint, with the headline and the
 * booking button) and a deep green footer. The footer opens on a fine gold line and sets the logo and tagline with the social
 * links, then the page links, contact details and newsletter sign-up in gold-headed columns, and a
 * quiet bottom bar with the copyright, coordinates and back-to-top.
 */
export function Footer() {
  const phone = contact.phoneLabel.replace(/^Tel:\s*/, "");
  return (
    <footer id="SITE_FOOTER" className="bg-white">
      <CtaBanner />

      <div className="text-ivory relative overflow-hidden bg-[linear-gradient(180deg,#0a221b_0%,#071812_100%)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full">
          <RidgeStack color="#0a221b" height="clamp(28px, 4vw, 60px)" />
        </div>
        <div
          aria-hidden="true"
          className="via-gold-soft/45 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent"
        />
        <Bleed>
          <LeafyBranch size={64} rotate={8} opacity={0.25} draw className="decor-lg absolute right-4 bottom-40" />
        </Bleed>

        <div className="wrap grid gap-14 pt-20 pb-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10">
          <Reveal className="sm:col-span-2 lg:col-span-4">
            <Link href="/" aria-label="The Mountain Table, home" className="inline-flex flex-col gap-3.5 no-underline">
              <svg
                viewBox="0 0 64 22"
                className="text-gold-soft h-[24px] w-[70px]"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 21 L20 5 L28 12 L36 2 L62 21" />
                <path d="M30 9 L36 2 L42 8" />
              </svg>
              <span className="font-display text-ivory text-[1.5rem] leading-none font-medium tracking-[0.08em]">
                THE MOUNTAIN TABLE
              </span>
            </Link>
            <p className="font-display text-ivory/80 m-0 mt-6 max-w-[19rem] text-[1.0625rem] leading-[1.65] italic">
              A luxury mountain escape where nature, comfort and good food come together.
            </p>
            <SocialIcons className="mt-7 -ml-1 gap-2" />
          </Reveal>

          <Reveal delay={0.08} className="lg:col-span-2 lg:col-start-5">
            <nav aria-label="Footer">
              <ColumnHeading>Explore</ColumnHeading>
              <ul className="m-0 mt-6 grid list-none gap-3.5 p-0">
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

          <Reveal delay={0.16} className="lg:col-span-3 lg:col-start-7">
            <ColumnHeading>Contact</ColumnHeading>
            <ul className="m-0 mt-6 grid list-none gap-3.5 p-0">
              <li>
                <address className="t-small text-ivory/80 not-italic [font-size:0.875rem] [line-height:1.7]">
                  {contact.address}
                </address>
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

          <Reveal delay={0.24} className="sm:col-span-2 lg:col-span-3 lg:col-start-10">
            <ColumnHeading>Newsletter</ColumnHeading>
            <p className="t-small text-ivory/80 m-0 mt-6 mb-4 [font-size:0.875rem]">
              Seasonal offers, straight to your inbox.
            </p>
            <NewsletterForm />
          </Reveal>
        </div>

        <div className="wrap">
          <div className="border-ivory/14 mt-8 flex flex-wrap items-center justify-between gap-3 border-t py-6">
            <p className="t-small text-ivory/65 m-0 [font-size:0.8125rem]">{contact.copyright}</p>
            <p className="text-ivory/65 m-0 flex items-center gap-2.5">
              <CompassRose size={22} color="var(--color-gold-soft)" opacity={0.9} className="shrink-0" />
              <Coordinates />
            </p>
            <BackToTop />
          </div>
        </div>
      </div>
    </footer>
  );
}
