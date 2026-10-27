import Link from "next/link";
import { Bleed, CompassRose, Coordinates, LeafyBranch, RidgeStack } from "@/components/decor";
import { Reveal } from "@/components/motion/primitives";
import { contact, nav } from "@/lib/site";
import { BackToTop } from "./BackToTop";
import { CtaBanner } from "./CtaBanner";
import { NewsletterForm } from "./NewsletterForm";

const link = "t-small text-ivory/85 hover:text-ivory no-underline transition-colors [font-size:0.875rem]";
const heading = "t-ui text-ivory m-0 font-semibold tracking-[0.2em] uppercase [font-size:0.75rem]";

/**
 * Closing area shared by every page: the call to action (a misty valley photograph under a forest tint,
 * with the headline and the booking button) and a deep green footer: logo and tagline, page links, contact details and a newsletter sign-up.
 */
export function Footer() {
  const phone = contact.phoneLabel.replace(/^Tel:\s*/, "");
  return (
    <footer id="SITE_FOOTER">
      <CtaBanner />

      <div className="text-ivory relative bg-[#0a221b]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-full">
          <RidgeStack color="#0a221b" height="clamp(28px, 4vw, 60px)" />
        </div>
        <Bleed>
          <LeafyBranch size={64} rotate={8} opacity={0.3} draw className="decor-lg absolute right-4 bottom-20" />
        </Bleed>
        <div className="wrap grid gap-12 pt-16 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-10">
          <Reveal>
            <Link href="/" aria-label="The Mountain Table, home" className="inline-flex flex-col gap-3 no-underline">
              <svg
                viewBox="0 0 64 22"
                className="h-[22px] w-16"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 21 L20 5 L28 12 L36 2 L62 21" />
                <path d="M30 9 L36 2 L42 8" />
              </svg>
              <span className="font-display text-ivory text-[1.375rem] leading-none font-semibold tracking-[0.04em]">
                THE MOUNTAIN TABLE
              </span>
            </Link>
            <p className="t-small text-ivory/85 m-0 mt-5 max-w-[17rem] [font-size:0.875rem] [line-height:1.7]">
              A luxury mountain escape where nature, comfort and good food come together.
            </p>
          </Reveal>

          <Reveal delay={0.08}>
            <nav aria-label="Footer">
              <p className={heading}>Explore</p>
              <ul className="m-0 mt-4 grid list-none gap-3 p-0">
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

          <Reveal delay={0.16}>
            <p className={heading}>Contact</p>
            <ul className="m-0 mt-4 grid list-none gap-3 p-0">
              <li>
                <address className="t-small text-ivory/85 not-italic [font-size:0.875rem]">{contact.address}</address>
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

          <Reveal delay={0.24}>
            <p className={heading}>Newsletter</p>
            <p className="t-small text-ivory/85 m-0 mt-4 mb-4 [font-size:0.875rem]">
              Seasonal offers, straight to your inbox.
            </p>
            <NewsletterForm />
          </Reveal>
        </div>

        <div className="wrap">
          <div className="border-ivory/14 flex flex-wrap items-center justify-between gap-3 border-t py-6">
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
