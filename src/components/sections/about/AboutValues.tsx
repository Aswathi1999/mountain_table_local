import type { ReactNode } from "react";
import { Lines, Reveal, Stagger, StaggerItem } from "@/components/motion/primitives";

const icon = (children: ReactNode) => (
  <svg
    viewBox="0 0 24 24"
    className="text-forest size-[1.625rem]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

/** The four values. Each line is taken from the existing story and the sustainability statement; only the short headings are new. */
const values = [
  {
    title: "Rooted in nature",
    text: "What once was a chaotic landscape of bushes and shrubs evolved into a serene tea plantation, crafted through years of dedication.",
    icon: icon(
      <>
        <path d="M12 21V11" />
        <path d="M12 11C12 6 8 3 4 3c0 5 3 8 8 8z" />
        <path d="M12 14c0-4 3-7 8-7 0 4-3 7-8 7z" />
      </>,
    ),
  },
  {
    title: "Rustic comfort",
    text: "Our accommodations blend modern comfort with rustic charm, inviting guests to wake up to birdsong and panoramic views.",
    icon: icon(
      <>
        <path d="M3 21h18" />
        <path d="M5 21V10l7-6 7 6v11" />
        <path d="M10 21v-6h4v6" />
      </>,
    ),
  },
  {
    title: "Local flavours",
    text: "Culinary delights await, crafted from local ingredients by our skilled chefs, and grilled dishes at our forest-set grill house.",
    icon: icon(<path d="M9 3v8a3 3 0 0 1-6 0V3M6 3v18M15 21V3c3 0 5 3 5 8h-5" />),
  },
  {
    title: "Kind to the hills",
    text: "Crafted from natural materials such as straw or reeds, our thatch roofing keeps the interiors cool in the summer and warm in the winter.",
    icon: icon(<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />),
  },
] as const;

const lead =
  "Driven by a vision of eco-friendly hospitality, The Mountain Table emerged as a haven where nature's harmony thrives.";

/** "Our Philosophy", as in the About design: a centred heading and four soft cards with a round icon badge, title and one line each. */
export function AboutValues() {
  return (
    <section id="philosophy" aria-labelledby="philosophy-title" className="bg-ivory relative pt-4 pb-20 desk:pb-28">
      <div className="wrap">
        <div className="mx-auto mb-12 flex max-w-[40rem] flex-col items-center text-center desk:mb-14">
          <Reveal>
            <p className="t-eyebrow text-forest before:bg-current before:opacity-35 before:content-[''] before:h-px before:w-14">
              What we believe
            </p>
          </Reveal>
          <Lines id="philosophy-title" as="h2" lines={["Our Philosophy"]} className="t-h2 text-forest m-0 mt-4" />
          <Reveal delay={0.1} className="mt-5">
            <p className="t-body text-ink/70 m-0 [font-size:1rem]">{lead}</p>
          </Reveal>
        </div>
        <Stagger step={0.1} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((v) => (
            <StaggerItem key={v.title} className="flex">
              <article className="group flex flex-1 flex-col gap-4 rounded-[18px] bg-[#fffdf8] p-8 shadow-[0_10px_30px_rgba(10,34,27,0.06)] transition-[transform,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_22px_44px_rgba(10,34,27,0.11)]">
                <span className="bg-ivory-deep flex size-[3.75rem] items-center justify-center rounded-full transition-colors duration-500 group-hover:bg-gold/25">
                  {v.icon}
                </span>
                <h3 className="t-h4 text-forest m-0">{v.title}</h3>
                <p className="t-small text-ink/70 m-0">{v.text}</p>
              </article>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
