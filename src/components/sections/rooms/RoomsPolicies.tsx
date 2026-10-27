import { Lines, Reveal } from "@/components/motion/primitives";
import { Contour } from "@/components/decor";
import { LeafSprig } from "@/components/ui/decor";
import { copy } from "@/data/copy";
import { bookingPolicies, cancellationPolicies } from "@/data/policies";
import { sentenceCase } from "@/lib/text";
import { CancellationTimeline, PolicyRow } from "./RoomsMotion";

/**
 * Booking policies and guidelines: a centred heading, then every guideline in one soft rounded card, in two columns with a gold
 * marker. The cancellation policy follows on a deep forest band as a drawn timeline. The `book-now` anchor, the target of every
 * booking button on this page, sits at the top.
 */
export function RoomsPolicies() {
  return (
    <section id="policies" aria-label="Policies" className="relative">
      <div id="book-now" className="scroll-mt-24" />

      <div className="bg-ivory-deep text-ink relative overflow-hidden py-20 desk:py-28">
        <LeafSprig className="text-gold/35 pointer-events-none absolute top-8 right-[5%] hidden h-48 w-auto rotate-[22deg] lg:block" />
        <div className="wrap relative">
          <div className="mx-auto mb-12 flex max-w-[40rem] flex-col items-center text-center desk:mb-14">
            <Reveal>
              <p className="t-eyebrow text-forest before:h-px before:w-14 before:bg-current before:opacity-35 before:content-['']">
                Before you book
              </p>
            </Reveal>
            <Lines
              id="policies-title"
              as="h2"
              lines={[sentenceCase(copy.rooms.policiesTitle).replace(/\b(\w)/g, (m) => m.toUpperCase())]}
              className="t-h2 text-forest m-0 mt-4 text-center"
            />
          </div>

          <div className="relative isolate rounded-[24px] bg-[#fffdf8] p-6 shadow-[0_10px_30px_rgba(10,34,27,0.06)] desk:p-12">
            <Contour opacity={0.16} className="-z-10 rounded-[24px]" />
            <ul className="m-0 list-none gap-x-14 p-0 lg:columns-2">
              {bookingPolicies.map((item, i) => (
                <li key={item} className="break-inside-avoid pb-5">
                  <PolicyRow rule={i !== 0} ruleOnWide={i !== 14}>
                    <p className="t-small text-ink/80 m-0 flex gap-3.5 [font-size:0.9375rem]">
                      <span aria-hidden="true" className="bg-gold mt-[0.55em] block size-1.5 shrink-0 rotate-45" />
                      <span>{item}</span>
                    </p>
                  </PolicyRow>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-forest-deep text-ivory py-20 desk:py-28">
        <div className="wrap grid gap-14 desk:grid-cols-12 desk:gap-x-12">
          <header className="desk:col-span-4">
            <div className="desk:sticky desk:top-32">
              <Reveal>
                <p className="t-eyebrow text-ivory">If plans change</p>
              </Reveal>
              <Lines
                id="cancellation-title"
                as="h2"
                lines={sentenceCase(copy.rooms.cancellationTitle).split(" ")}
                lineClasses={["", "t-it text-gold-soft"]}
                className="t-h2 m-0 mt-4"
              />
            </div>
          </header>
          <div className="desk:col-span-7 desk:col-start-6">
            <CancellationTimeline items={cancellationPolicies} />
          </div>
        </div>
      </div>
    </section>
  );
}
