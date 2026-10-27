"use client";

/** Round up-arrow button that scrolls to the top of the page (smoothly, unless the visitor prefers reduced motion). */
export function BackToTop() {
  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        })
      }
      className="border-ivory/35 text-ivory/80 hover:bg-ivory hover:text-forest-deep flex size-11 cursor-pointer items-center justify-center rounded-full border bg-transparent transition-colors duration-300 active:scale-95"
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[1.125rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
      >
        <path d="M12 20V5M6 11l6-6 6 6" />
      </svg>
    </button>
  );
}
