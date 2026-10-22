import Image from "next/image";
import type { CSSProperties } from "react";
import { contact, social } from "@/lib/site";
import { rv } from "@/lib/reveal";
import { EnquiryForm } from "./EnquiryForm";

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

const detailLabel = "t-label block text-gold-ink uppercase";
const detailValue =
  "mt-1 inline-block text-[1.0625rem] leading-[1.6rem] text-ink no-underline transition-colors duration-300 hover:text-gold-ink desk:text-[20px] desk:leading-[1.5]";

/** Contact us: verified details on the left (tap-to-call / tap-to-email), an enquiry form on the right. */
export function ContactSection() {
  const phone = contact.phoneLabel.replace(/^Tel:\s*/, "");
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-ivory-deep text-ink relative border-t border-gold/40 px-6 py-12 desk:px-8 desk:py-[72px]"
    >
      <div className="mx-auto grid max-w-[1180px] gap-10 desk:grid-cols-12 desk:gap-x-2 desk:gap-y-10 min-[1000px]:gap-x-16">
        <div className="desk:col-span-5">
          <div {...rv("rise")}>
            <h2 id="contact-title" className="t-h3 text-forest m-0 tracking-[0.1em]">
              {contact.heading}
            </h2>
            <span className="mt-4 block h-px w-16 bg-gold" />
          </div>

          <dl className="m-0 mt-8 grid gap-6">
            <div {...rv("rise", "rise", delay(0.1))}>
              <dt className={detailLabel}>Call</dt>
              <dd className="m-0">
                <a href={contact.phoneHref} className={detailValue}>
                  {phone}
                </a>
              </dd>
            </div>
            <div {...rv("rise", "rise", delay(0.2))}>
              <dt className={detailLabel}>Email</dt>
              <dd className="m-0">
                <a href={`mailto:${contact.email}`} className={`${detailValue} break-words`}>
                  {contact.email}
                </a>
              </dd>
            </div>
            <div {...rv("rise", "rise", delay(0.3))}>
              <dt className={detailLabel}>Visit</dt>
              <dd className="m-0">
                <address className={`${detailValue} not-italic`}>{contact.address}</address>
              </dd>
            </div>
          </dl>

          <ul className="m-0 mt-8 flex list-none gap-3 p-0" {...rv("rise", "rise", delay(0.4))}>
            {[
              { href: social.facebook, src: "/images/0fdef751204647a3bbd7eaa2827ed4f9.png", label: "Facebook" },
              { href: social.instagram, src: "/images/01c3aff52f2a4dffa526d7a9843d46ea.png", label: "Instagram" },
            ].map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="flex size-12 items-center justify-center rounded-full border border-gold/50 bg-white transition-transform duration-300 hover:-translate-y-1"
                >
                  <Image src={link.src} alt="" width={26} height={26} />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 desk:col-span-7" {...rv("rise", "rise", delay(0.2))}>
          <EnquiryForm />
        </div>
      </div>
    </section>
  );
}
