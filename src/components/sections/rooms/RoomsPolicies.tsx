import { Lines, Reveal, Rule } from "@/components/motion/primitives";
import { copy } from "@/data/copy";
import { bookingPolicies, cancellationPolicies } from "@/data/policies";
import { sentenceCase } from "@/lib/text";
import { CancellationTimeline } from "./RoomsMotion";

/**
 * Booking policies and guidelines (ivory): the heading stays beside a long, quiet list; each guideline is a hairline row.
 * Then the cancellation policy (deep forest) as a drawn timeline. The `book-now` anchor, the target of every booking button
 * on this page, sits at the top.
 */
export function RoomsPolicies() {
  const [policyA, policyB] = sentenceCase(copy.rooms.policiesTitle).split(" & ");
  return (
    <section id="policies" aria-label="Policies" className="relative">
      <div id="book-now" className="scroll-mt-24" />

      <div className="bg-ivory text-ink py-20 desk:py-32">
        <div className="wrap grid gap-12 desk:grid-cols-12 desk:gap-x-12">
          <header className="desk:col-span-4">
            <div className="desk:sticky desk:top-32">
              <Lines
                as="h2"
                lines={[...policyA.split(" "), `& ${policyB}`]}
                lineClasses={["", "t-it", "t-it"]}
                className="t-h2 text-forest m-0"
              />
              <Rule className="bg-gold/70 mt-8 max-w-16" delay={0.2} />
            </div>
          </header>

          <ul className="m-0 list-none p-0 desk:col-span-7 desk:col-start-6">
            {bookingPolicies.map((item) => (
              <li
                key={item}
                className="border-forest/15 border-t py-6 first:border-t-0 first:pt-0 desk:py-7 desk:first:pt-2"
              >
                <Reveal y={14}>
                  <p className="t-body text-ink/90 m-0">{item}</p>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-forest-deep text-ivory py-20 desk:py-32">
        <div className="wrap grid gap-14 desk:grid-cols-12 desk:gap-x-12">
          <header className="desk:col-span-4">
            <div className="desk:sticky desk:top-32">
              <Lines
                as="h2"
                lines={sentenceCase(copy.rooms.cancellationTitle).split(" ")}
                lineClasses={["", "t-it text-gold-soft"]}
                className="t-h2 m-0"
              />
              <Rule className="bg-gold/60 mt-8 max-w-16" delay={0.2} />
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
