import type { ReactNode } from "react";
import { copy } from "@/data/copy";
import { bookingPolicies, cancellationPolicies } from "@/data/policies";
import { rv, stagger } from "@/lib/reveal";
import { Rule } from "@/components/ui/editorial";

/** One policy list: sticky heading on the left, hairline-separated items on the right. */
function PolicyList({ id, title, items }: { id?: string; title: string; items: readonly string[] }): ReactNode {
  return (
    <div className="mx-auto grid max-w-[1180px] gap-10 px-6 desk:grid-cols-12 desk:gap-x-10 desk:px-8">
      <h2
        id={id}
        className="t-h3 m-0 text-forest desk:sticky desk:top-28 desk:col-span-4 desk:self-start"
        {...rv("rise", "rise")}
      >
        {title}
      </h2>
      <ul className="m-0 list-none p-0 desk:col-span-8">
        {items.map((item, i) => (
          <li key={item} className="relative">
            <Rule className="bg-gold/40" />
            <p className="t-body m-0 py-5 text-ink desk:py-6" {...rv("rise", "rise", stagger(Math.min(i, 3) * 0.05))}>
              <span aria-hidden="true" className="mr-3 text-[0.6rem] text-gold">
                ●
              </span>{" "}
              {item}
            </p>
          </li>
        ))}
        <li aria-hidden="true">
          <Rule className="bg-gold/40" />
        </li>
      </ul>
    </div>
  );
}

/** Booking policies & guidelines, then the cancellation policy. */
export function RoomsPolicies() {
  return (
    <section id="policies" aria-label="Policies" className="relative">
      <div id="book-now" className="scroll-mt-24" />
      <div className="bg-ivory-deep py-24 desk:py-[130px]">
        <PolicyList title={copy.rooms.policiesTitle} items={bookingPolicies} />
      </div>
      <div className="bg-ivory py-24 desk:py-[130px]">
        <PolicyList title={copy.rooms.cancellationTitle} items={cancellationPolicies} />
      </div>
    </section>
  );
}
