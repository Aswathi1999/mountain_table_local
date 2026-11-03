import Link from "next/link";
import { Lines, Reveal } from "@/components/motion/primitives";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { faqs } from "@/data/faq";
import { FaqAccordion } from "./FaqAccordion";

/**
 * Frequently Asked Questions: the centred heading on top, then the accordion with a link to the full booking policies beneath it. The
 * answers restate the existing booking policies (`src/data/faq.ts`). The same questions are published as FAQPage structured data.
 */
export function HomeFaq() {
  const structured = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="bg-ivory relative py-20 desk:py-28">
      <JsonLd data={structured} />
      <div className="wrap">
        <header className="mx-auto flex max-w-[40rem] flex-col items-center text-center">
          <Reveal>
            <p className="t-eyebrow text-forest justify-center before:h-px before:w-14 before:bg-current before:opacity-35 before:content-['']">
              FAQ
            </p>
          </Reveal>
          <Lines
            id="faq-title"
            as="h2"
            lines={["Frequently Asked", "Questions"]}
            className="t-h2 text-forest m-0 mt-4 leading-[1.1] [font-size:clamp(2rem,1.3rem+2.4vw,3.25rem)]"
          />
        </header>
        <div className="mx-auto mt-12 max-w-[52rem] desk:mt-14">
          <FaqAccordion items={faqs} />
          <Reveal delay={0.2} className="mt-10 flex justify-center">
            <Link href="/rooms-booking#policies" className="t-ui link-u text-gold-ink inline-flex items-center gap-2">
              All booking policies
              <ArrowIcon className="size-4" />
            </Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
