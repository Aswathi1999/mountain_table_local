import { DrawnLeaf, ImageFrame, Lines, Reveal } from "@/components/motion/primitives";
import { WaxSeal } from "@/components/decor";
import { EnquiryForm } from "./EnquiryForm";
import { SignOff } from "./SignOff";

/**
 * "Send a message", as in the Contact design: on the left the eyebrow, the heading, a short note, a lounge photograph and a
 * handwritten "See you soon!"; on the right the form in a soft rounded card. (The form builds an email to the property.)
 */
export function ContactSection() {
  return (
    <section
      id="contact"
      aria-labelledby="contact-title"
      className="bg-ivory text-ink relative overflow-hidden py-20 desk:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute top-40 -left-6 hidden h-56 lg:block">
        <DrawnLeaf className="text-gold/45 h-full w-auto -rotate-6" />
      </div>
      <div className="wrap relative grid items-center gap-14 lg:grid-cols-12 lg:gap-x-14">
        <div className="min-w-0 lg:col-span-5">
          <Reveal>
            <p className="t-eyebrow text-forest">Send a message</p>
          </Reveal>
          <Lines
            id="contact-title"
            as="h2"
            lines={["Let’s Plan Your", "Mountain Escape"]}
            className="t-h2 text-forest m-0 mt-4 [font-size:clamp(2.125rem,1.3rem+2.4vw,3.25rem)]"
          />
          <Reveal delay={0.1} className="mt-5">
            <p className="t-body text-ink/70 m-0 max-w-[28em] [font-size:1rem]">
              Tell us a little about what you have in mind — dates, guests, a special occasion — and we’ll get back to
              you personally.
            </p>
          </Reveal>
          <div className="relative mt-9 pb-10">
            <ImageFrame
              src="/images/about/lounge.jpg"
              alt="A lounge opening onto a balcony with mountain views"
              sizes="(min-width: 1024px) 34vw, 90vw"
              className="aspect-[4/3] w-[88%] shadow-[0_20px_40px_rgba(10,34,27,0.14)]"
              from="bottom"
              drift={3}
              position="40% 55%"
              radius={6}
            />
            <div className="absolute right-0 bottom-0 -rotate-6" aria-hidden="true">
              <SignOff text="See you soon!" />
            </div>
          </div>
        </div>

        <Reveal delay={0.1} className="min-w-0 lg:col-span-7">
          <div className="relative rounded-[22px] bg-[#fffdf8] p-7 shadow-[0_14px_40px_rgba(10,34,27,0.08)] desk:p-11">
            <WaxSeal size={60} rotate={-10} className="absolute -top-6 right-8 z-10" />
            <EnquiryForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
