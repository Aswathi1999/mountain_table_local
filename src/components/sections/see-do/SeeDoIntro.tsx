import Image from "next/image";
import { copy } from "@/data/copy";
import { rv, stagger } from "@/lib/reveal";
import { TextVideo } from "@/components/ui/TextVideo";

/** "Adventure Awaits:" video headline, "Thrills and Tranquility" and the intro paragraph, centred on ivory. */
export function SeeDoIntro() {
  return (
    <section
      id="intro"
      aria-label="Adventure awaits"
      className="relative bg-ivory px-6 pt-14 pb-24 desk:px-8 desk:pt-20 desk:pb-[150px]"
    >
      <div className="mx-auto flex max-w-[860px] flex-col items-center text-center">
        <h1 className="sr-only">Adventure Awaits:</h1>
        <div className="w-full" {...rv("rise", "rise")}>
          <TextVideo
            videoSrc="/videos/11062b_d578b9d4ffba48c68d086ec29fe9e6f0-480p.mp4"
            poster="/images/11062b_d578b9d4ffba48c68d086ec29fe9e6f0f000.jpg"
            className="mx-auto aspect-[677/414] w-full max-w-[720px]"
          />
        </div>
        <span
          aria-hidden="true"
          className="mt-4 block h-px w-full max-w-[420px] bg-gold"
          {...rv("draw", "draw", stagger(0.1))}
        />
        <h1 className="t-h1 m-0 mt-10 text-forest desk:mt-14" {...rv("rise", "rise", stagger(0.1))}>
          {copy.seeDo.subtitle}
        </h1>
        <div className="relative mt-8 h-9 w-16" {...rv("rise", "rise", stagger(0.2))}>
          <Image src="/icons/hills.svg" alt="" fill sizes="64px" className="object-contain" />
        </div>
        <p className="t-lead m-0 mt-8 max-w-[40rem] text-ink" {...rv("rise", "rise", stagger(0.3))}>
          {copy.seeDo.intro}
        </p>
      </div>
    </section>
  );
}
