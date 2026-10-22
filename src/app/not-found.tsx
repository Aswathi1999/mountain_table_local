import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: { absolute: "404 Error: Page Not Found" } };

/** Same look as the original's 404: plain white page, small caps label, huge thin "404", black pill button. */
export default function NotFound() {
  return (
    <div className="fixed inset-0 z-[300] overflow-auto bg-white text-black">
      <div className="px-16 pt-[220px] max-desk:px-[1.5rem] max-desk:pt-[8rem]">
        <p className="m-0 text-[16px] tracking-[0.18em] uppercase max-desk:text-[0.875rem]">Error: Page Not Found</p>
        <p
          className="m-0 mt-[40px] text-[270px] leading-[1] tracking-[-0.02em] max-desk:text-[9rem]"
          aria-hidden="true"
        >
          404
        </p>
        <h1 className="m-0 mt-[26px] text-[24px] max-desk:text-[1.25rem]">This page isn’t available.</h1>
        <Link
          href="/"
          className="mt-[36px] inline-block rounded-full bg-black px-9 py-[13px] text-[18px] text-white no-underline max-desk:text-[1rem]"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
