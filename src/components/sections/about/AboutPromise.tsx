import Link from "next/link";
import { ImageFrame, Lines, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { copy } from "@/data/copy";

/** The sustainability statement, split into its sentences, plus the vision sentence; all existing wording. */
const points = [
  "Driven by a vision of eco-friendly hospitality, The Mountain Table emerged as a haven where nature's harmony thrives.",
  ...copy.about.commitmentBody.split(/(?<=\.)\s+(?=[A-Z])/),
];

const Check = () => (
  <svg
    viewBox="0 0 24 24"
    className="text-gold-ink mt-0.5 size-[1.375rem] shrink-0"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9" />
    <path d="M8 12.5l2.5 2.5L16 9.5" />
  </svg>
);

/**
 * "Commitment to Sustainability", as in the About design's promise card: one rounded card, a lounge photograph on the left and on
 * the right the eyebrow, the heading, a ticked list and a link.
 */
export function AboutPromise() {
  return (
    <section id="sustainability" aria-labelledby="promise-title" className="bg-ivory relative pb-20 desk:pb-28">
      <div className="wrap">
        <div className="grid overflow-hidden rounded-[24px] bg-[#fffdf8] shadow-[0_10px_30px_rgba(10,34,27,0.06)] lg:grid-cols-2">
          <ImageFrame
            src="/images/about/lounge.jpg"
            alt="An open lounge of natural materials facing the mountains"
            sizes="(min-width: 1024px) 600px, 100vw"
            className="h-[22rem] w-full lg:h-full lg:min-h-[32rem]"
            from="left"
            radius={0}
            drift={3}
            position="40% 50%"
          />
          <div className="flex flex-col justify-center p-8 desk:p-14">
            <Reveal>
              <p className="t-eyebrow text-forest">Our promise</p>
            </Reveal>
            <Lines
              id="promise-title"
              as="h2"
              lines={["Commitment to", "Sustainability"]}
              className="t-h3 text-forest m-0 mt-4 [font-size:clamp(1.875rem,1.3rem+1.7vw,2.75rem)]"
            />
            <Stagger step={0.1} className="m-0 mt-7 flex list-none flex-col gap-4 p-0">
              {points.map((text) => (
                <StaggerItem key={text} y={14}>
                  <p className="t-small text-ink/80 m-0 flex gap-3.5 [font-size:0.9375rem]">
                    <Check />
                    <span>{text}</span>
                  </p>
                </StaggerItem>
              ))}
            </Stagger>
            <Reveal delay={0.2} className="mt-8">
              <Link href="/see-do" className="t-ui link-u text-forest inline-flex min-h-11 items-center gap-2">
                Explore the plantation
                <ArrowIcon className="size-4" />
              </Link>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
