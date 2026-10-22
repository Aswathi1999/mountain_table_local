import { copy } from "@/data/copy";
import { rv, stagger } from "@/lib/reveal";
import { posRel } from "@/lib/stage";
import { Honeycomb } from "@/components/ui/Honeycomb";
import { Ridge } from "@/components/ui/editorial";

/** Diamond photo gallery with the "Exciting Escapes" caption and the solid + dotted rules, on a forest-green band. */
export function SeeDoEscapes() {
  return (
    <section id="escapes" aria-label="Exciting escapes" className="relative bg-forest py-20 text-ivory desk:py-[130px]">
      <Ridge />
      <div
        className="hc-scale relative mx-auto h-[7.875rem] w-[17.5rem] desk:h-[calc(477px*var(--hs))] desk:w-[calc(1216px*var(--hs))]"
        {...rv("rise", "rise")}
      >
        <Honeycomb
          style={{
            ...posRel([0, 0, 1216, 477], [0, 0, 280, 126]),
            transformOrigin: "0 0",
            transform: "scale(var(--hs))",
          }}
        />
      </div>
      <div className="mx-auto mt-14 max-w-[1211px] px-6 desk:mt-20 desk:px-8">
        <p className="t-h3 m-0 text-center text-gold-soft" {...rv("rise", "rise", stagger(0.1))}>
          <span className="max-desk:hidden">{copy.seeDo.escapes}</span>
          <span className="desk:hidden">Exciting Escapes Await</span>
        </p>
        <span aria-hidden="true" className="mt-8 block h-px w-full bg-gold" {...rv("draw", "draw", stagger(0.2))} />
        <span
          aria-hidden="true"
          className="mt-[7px] block w-full border-t-[3px] border-dotted border-gold/60"
          {...rv("draw", "draw", stagger(0.3))}
        />
      </div>
    </section>
  );
}
