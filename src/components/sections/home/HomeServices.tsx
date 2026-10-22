import Image from "next/image";
import type { CSSProperties } from "react";
import { copy } from "@/data/copy";
import { services, type Service } from "@/data/home";
import { rv } from "@/lib/reveal";

const delay = (seconds: number) => ({ "--d": `${seconds}s` }) as CSSProperties;

function FeaturedService({ service, index }: { service: Service; index: number }) {
  const flip = index % 2 === 1;
  const text = copy.home.services[service.key];
  return (
    <article className="group grid items-center gap-8 desk:grid-cols-12 desk:gap-16">
      <div
        className={`relative aspect-[4/3] overflow-hidden desk:col-span-7 ${flip ? "desk:order-2" : ""}`}
        {...rv("mask")}
      >
        <div className="mask-img absolute inset-0">
          <div className="absolute inset-0 transition-transform duration-[1400ms] ease-out group-hover:scale-[1.05]">
            <Image
              src={service.photo!.src}
              alt={service.photo!.alt}
              fill
              sizes="(min-width: 750px) 640px, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
      <div className={`desk:col-span-5 ${flip ? "desk:order-1 desk:pr-6" : "desk:pl-6"}`}>
        <div {...rv("rise", "rise", delay(0.15))}>
          <span className="t-h4 text-gold-ink block tracking-[0.2em]">{String(index + 1).padStart(2, "0")}</span>
          <div className="mt-5 flex items-center gap-4">
            <Image src={service.icon} alt="" width={44} height={44} className="h-11 w-11 object-contain" />
            <h3 className="m-0 text-[1.25rem] font-normal tracking-[0.16em] text-forest uppercase desk:text-[22px]">
              {service.label}
            </h3>
          </div>
          <span className="mt-6 block h-px w-14 bg-gold transition-all duration-700 ease-out group-hover:w-28" />
        </div>
        <p
          className="t-lead m-0 mt-6 text-ink transition-transform duration-700 ease-out group-hover:translate-x-1"
          {...rv("rise", "rise", delay(0.3))}
        >
          {text}
        </p>
      </div>
    </article>
  );
}

function CompactService({ service, index }: { service: Service; index: number }) {
  return (
    <article className="group border-t border-gold/50 pt-8" {...rv("rise", "rise", delay(index * 0.14))}>
      <Image
        src={service.icon}
        alt=""
        width={44}
        height={44}
        className="h-11 w-11 object-contain transition-transform duration-500 ease-out group-hover:-translate-y-1"
      />
      <h3 className="m-0 mt-5 text-[1.0625rem] font-normal tracking-[0.16em] text-forest uppercase">{service.label}</h3>
      <p className="t-body m-0 mt-3 text-muted">{copy.home.services[service.key]}</p>
    </article>
  );
}

/** Our Services: three photo-led rows that alternate sides, then a quieter row of three compact items. */
export function HomeServices() {
  const featured = services.filter((s) => s.photo);
  const compact = services.filter((s) => !s.photo);
  return (
    <section
      id="services"
      aria-labelledby="services-title"
      className="bg-ivory-deep relative px-6 py-20 desk:px-8 desk:py-[120px]"
    >
      <div className="mx-auto max-w-[1180px]">
        <header className="text-center" {...rv("rise")}>
          <h2 id="services-title" className="t-h3 m-0 tracking-[0.18em] text-forest">
            {copy.home.servicesTitle}
          </h2>
          <span className="mx-auto mt-6 block h-px w-16 bg-gold" />
        </header>

        <div className="mt-16 flex flex-col gap-16 desk:mt-24 desk:gap-28">
          {featured.map((service, i) => (
            <FeaturedService key={service.key} service={service} index={i} />
          ))}
        </div>

        <div className="mt-20 grid gap-10 desk:mt-32 desk:grid-cols-3 desk:gap-14">
          {compact.map((service, i) => (
            <CompactService key={service.key} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
