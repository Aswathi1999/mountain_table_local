import { copy } from "@/data/copy";
import { honeycombPhotos } from "@/data/seeDo";
import { rv } from "@/lib/reveal";
import { RevealImage } from "@/components/ui/editorial";

/**
 * Where each of the seven photographs sits in the desktop mosaic (a 12-column grid of 120px rows): a wide lead photograph with
 * two landscape photographs stacked beside it, then a row of four. Below 1000px it becomes a grid (two columns on phones, three on tablets) with the lead on top.
 * The photographs stay in their original order in the page; only their placement changes.
 */
const placement = [
  "min-[1000px]:col-start-1 min-[1000px]:col-span-3 min-[1000px]:row-start-5 min-[1000px]:row-span-3",
  "min-[1000px]:col-start-4 min-[1000px]:col-span-3 min-[1000px]:row-start-5 min-[1000px]:row-span-3",
  "min-[1000px]:col-start-7 min-[1000px]:col-span-3 min-[1000px]:row-start-5 min-[1000px]:row-span-3",
  "order-first col-span-2 aspect-[16/10] desk:col-span-3 min-[1000px]:order-none min-[1000px]:col-start-1 min-[1000px]:col-span-7 min-[1000px]:row-start-1 min-[1000px]:row-span-4",
  "min-[1000px]:col-start-10 min-[1000px]:col-span-3 min-[1000px]:row-start-5 min-[1000px]:row-span-3",
  "min-[1000px]:col-start-8 min-[1000px]:col-span-5 min-[1000px]:row-start-1 min-[1000px]:row-span-2",
  "min-[1000px]:col-start-8 min-[1000px]:col-span-5 min-[1000px]:row-start-3 min-[1000px]:row-span-2",
] as const;

/** Each photograph enters differently (direction, curve and timing), in the original photo order. */
const entrance = [
  { reveal: "mask", delay: 0.1 }, //   bathtub: opens downwards
  { reveal: "iris", delay: 0.25 }, //  pool at night: opens from its centre
  { reveal: "wipeu", delay: 0.4 }, //  basin: rises from below
  { reveal: "wipe", delay: 0 }, //     lead photograph: sweeps in from the left
  { reveal: "wipel", delay: 0.3 }, //  stone path: sweeps in from the right
  { reveal: "wipel", delay: 0.15 }, // writing desk: sweeps in from the right
  { reveal: "wipeu", delay: 0.35 }, // hall: rises from below
] as const;

/** Focal points for the crops (lead, then the rest). */
const focus = ["50% 60%", "50% 50%", "50% 40%", "50% 55%", "50% 40%", "50% 50%", "50% 45%"] as const;

/**
 * "Exciting Escapes": the heading is set like the other section headings (centred, gold line beneath), above an asymmetric
 * mosaic of the seven photographs on a warm ivory band. Each photograph is revealed with a sideways wipe and zooms slowly on hover.
 */
export function SeeDoEscapes() {
  return (
    <section
      id="escapes"
      aria-labelledby="escapes-title"
      className="relative bg-ivory-deep px-6 py-16 desk:px-8 desk:py-[110px]"
    >
      <div className="mx-auto max-w-[1180px]">
        <header className="text-center" {...rv("rise", "rise")}>
          <h2 id="escapes-title" className="t-h3 m-0 tracking-[0.18em] text-forest">
            <span className="max-desk:hidden">{copy.seeDo.escapes}</span>
            <span className="desk:hidden">Exciting Escapes Await</span>
          </h2>
          <span aria-hidden="true" className="mx-auto mt-6 block h-px w-16 bg-gold" />
        </header>

        <div className="mt-12 grid grid-cols-2 gap-3 desk:grid-cols-3 desk:gap-4 min-[1000px]:mt-16 min-[1000px]:auto-rows-[120px] min-[1000px]:grid-cols-12 min-[1000px]:gap-4">
          {honeycombPhotos.map((photo, i) => (
            <RevealImage
              key={photo.src}
              src={photo.src}
              alt={photo.alt}
              sizes={i === 3 ? "(min-width: 1000px) 700px, 92vw" : "(min-width: 1000px) 380px, 46vw"}
              className={`group ${i === 3 ? "" : "aspect-[4/5] min-[1000px]:aspect-auto"} ${placement[i]}`}
              reveal={entrance[i].reveal}
              delay={entrance[i].delay}
              position={focus[i]}
              zoomOnHover
            />
          ))}
        </div>
      </div>
    </section>
  );
}
