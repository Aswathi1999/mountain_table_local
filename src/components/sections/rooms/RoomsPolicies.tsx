import { Fragment } from "react";
import { copy } from "@/data/copy";
import { bookingPolicies, cancellationPolicies } from "@/data/policies";
import { rv, stagger } from "@/lib/reveal";

/** Booking policies & guidelines: a light "house rules" panel, the guidelines set in two columns with a gold rule each. */
function BookingPolicies() {
  return (
    <div className="pt-24 pb-16 desk:pt-[130px] desk:pb-[90px]">
      <div className="mx-auto max-w-[1180px] px-6 desk:px-8">
        <header className="max-w-[40rem]">
          <span aria-hidden="true" className="block h-px w-16 bg-gold" {...rv("draw", "draw")} />
          <h2 className="t-h1 m-0 mt-8 text-forest" {...rv("rise", "rise", stagger(0.1))}>
            {copy.rooms.policiesTitle}
          </h2>
        </header>

        <ul className="m-0 mt-14 list-none gap-x-16 p-0 min-[1000px]:[column-count:2] desk:mt-20">
          {bookingPolicies.map((item, i) => (
            <li
              key={item}
              className="group mb-8 break-inside-avoid border-l border-gold/40 pl-6 transition-colors duration-500 hover:border-gold desk:mb-10 desk:pl-8"
            >
              <p
                className="t-body m-0 text-muted transition-colors duration-500 group-hover:text-ink"
                {...rv("rise", "rise", stagger((i % 2) * 0.08))}
              >
                <span aria-hidden="true" className="mr-3 text-[0.6rem] text-gold">
                  ●
                </span>{" "}
                {item}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/** Cancellation policy: an ivory timeline, each condition hanging from a gold line, with the refund percentages picked out. */
function CancellationPolicy() {
  return (
    <div className="pt-16 pb-24 desk:pt-[90px] desk:pb-[130px]">
      <div className="mx-auto max-w-[1180px] px-6 desk:px-8">
        <span aria-hidden="true" className="mb-14 block h-px w-full bg-gold/50 desk:mb-20" {...rv("draw", "draw")} />
        <div className="grid gap-14 desk:grid-cols-12 desk:gap-x-10">
          <header className="desk:col-span-4">
            <div className="desk:sticky desk:top-28">
              <span aria-hidden="true" className="block h-px w-16 bg-gold" {...rv("draw", "draw")} />
              <h2 className="t-h2 m-0 mt-8 text-forest" {...rv("rise", "rise", stagger(0.1))}>
                {copy.rooms.cancellationTitle}
              </h2>
            </div>
          </header>

          <ol className="relative m-0 list-none p-0 desk:col-span-8">
            <span
              aria-hidden="true"
              className="absolute top-2 bottom-2 left-[6px] block w-px bg-gold/60"
              {...rv("drawy", "drawy")}
            />
            {cancellationPolicies.map((item, i) => (
              <li key={item} className="group relative pb-10 pl-12 last:pb-0 desk:pl-16">
                <span
                  aria-hidden="true"
                  className="absolute top-[0.7em] left-0 size-3.5 rounded-full border border-gold bg-ivory transition-colors duration-500 group-hover:bg-gold"
                />
                <p className="t-lead m-0 text-ink" {...rv("rise", "rise", stagger(i * 0.07))}>
                  <span aria-hidden="true" className="mr-3 text-[0.6rem] text-gold">
                    ●
                  </span>{" "}
                  {item.split(/(\d+%)/).map((part, n) =>
                    /^\d+%$/.test(part) ? (
                      <span key={n} className="text-gold-ink text-[1.25em]">
                        {part}
                      </span>
                    ) : (
                      <Fragment key={n}>{part}</Fragment>
                    ),
                  )}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

/** Booking policies & guidelines, then the cancellation policy. */
export function RoomsPolicies() {
  return (
    <section id="policies" aria-label="Policies" className="relative">
      <div id="book-now" className="scroll-mt-24" />
      <div className="bg-ivory text-ink">
        <BookingPolicies />
        <CancellationPolicy />
      </div>
    </section>
  );
}
