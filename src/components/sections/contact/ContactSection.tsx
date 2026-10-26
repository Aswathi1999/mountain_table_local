import Image from "next/image";
import { Lines, Reveal, Rule } from "@/components/motion/primitives";
import { contact, social } from "@/lib/site";
import { EnquiryForm } from "./EnquiryForm";

const detailLabel = "t-small text-muted block";
const detailValue = "t-h4 link-u mt-1 inline-block text-forest [overflow-wrap:anywhere]";

/** Contact us: tap-to-call and tap-to-email details set large on the left, the enquiry form on the right. */
export function ContactSection() {
  const phone = contact.phoneLabel.replace(/^Tel:\s*/, "");
  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ivory-deep text-ink relative py-20 desk:py-32">
      <div className="wrap grid gap-14 desk:grid-cols-12 desk:gap-x-12">
        <div className="min-w-0 desk:col-span-5">
          <Lines id="contact-title" as="h2" lines={["Contact us"]} className="t-h1 text-forest m-0" />

          <dl className="m-0 mt-12 grid">
            <Reveal delay={0.05} className="border-forest/15 border-t py-6">
              <dt className={detailLabel}>Call</dt>
              <dd className="m-0">
                <a href={contact.phoneHref} className={detailValue}>
                  {phone}
                </a>
              </dd>
            </Reveal>
            <Reveal delay={0.1} className="border-forest/15 border-t py-6">
              <dt className={detailLabel}>Email</dt>
              <dd className="m-0">
                <a href={`mailto:${contact.email}`} className={detailValue}>
                  {contact.email}
                </a>
              </dd>
            </Reveal>
            <Reveal delay={0.15} className="border-forest/15 border-y py-6">
              <dt className={detailLabel}>Visit</dt>
              <dd className="m-0">
                <address className="t-lead text-ink mt-1 not-italic">{contact.address}</address>
              </dd>
            </Reveal>
          </dl>

          <Reveal as="div" delay={0.2} className="mt-8">
            <ul className="m-0 flex list-none gap-3 p-0">
              {[
                { href: social.facebook, src: "/images/0fdef751204647a3bbd7eaa2827ed4f9.png", label: "Facebook" },
                { href: social.instagram, src: "/images/01c3aff52f2a4dffa526d7a9843d46ea.png", label: "Instagram" },
              ].map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} (opens in a new tab)`}
                    className="border-forest/30 hover:bg-forest hover:border-forest group flex size-12 items-center justify-center rounded-full border transition-colors duration-500"
                  >
                    <Image
                      src={link.src}
                      alt=""
                      width={22}
                      height={22}
                      className="transition-[filter] duration-500 group-hover:invert"
                    />
                  </a>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="min-w-0 desk:col-span-7 desk:pt-6">
          <Rule className="bg-gold/70 mb-10 hidden desk:block" />
          <Reveal delay={0.15}>
            <EnquiryForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}
