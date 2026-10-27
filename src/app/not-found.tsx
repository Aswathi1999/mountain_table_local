import type { Metadata } from "next";
import Link from "next/link";
import { Lines, Reveal } from "@/components/motion/primitives";

export const metadata: Metadata = { title: { absolute: "404 Error: Page Not Found" } };

/** A quiet forest-green page: the lost page's number set huge behind the message, one way home. */
export default function NotFound() {
  return (
    <div className="bg-forest-deep text-ivory fixed inset-0 z-[300] overflow-auto">
      <div className="wrap relative flex min-h-full flex-col justify-center py-24">
        <p
          aria-hidden="true"
          className="font-display text-ivory/[0.07] pointer-events-none absolute -right-2 bottom-0 m-0 text-[min(62vw,34rem)] leading-[0.8] italic select-none"
        >
          404
        </p>
        <Reveal immediate delay={0.1}>
          <p className="t-kicker text-gold-soft m-0">Error: Page Not Found</p>
        </Reveal>
        <Lines
          as="h1"
          immediate
          delay={0.2}
          lines={["This page", "isn’t available."]}
          lineClasses={["", "t-it"]}
          className="t-h1 m-0 mt-5"
        />
        <Reveal immediate delay={0.6} className="mt-10">
          <Link href="/" className="btn btn-gold">
            Go to Homepage
          </Link>
        </Reveal>
      </div>
    </div>
  );
}
