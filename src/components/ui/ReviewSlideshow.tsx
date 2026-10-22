"use client";

import { useEffect, useState } from "react";

/**
 * Auto-rotating quote slideshow: a new slide every 3s with a 1s ease-in-out crossfade (measured on the original).
 * Dots below switch slides; the active dot is the grey one.
 */
export function ReviewSlideshow({ reviews }: { reviews: readonly string[] }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % reviews.length), 3000);
    return () => window.clearInterval(id);
  }, [reviews.length, index]);

  return (
    <div className="relative h-full w-full" aria-roledescription="carousel" aria-label="Guest reviews">
      {reviews.map((text, i) => (
        <blockquote
          key={i}
          aria-hidden={i !== index}
          className="absolute inset-0 m-0 flex justify-center pt-[1.8125rem] pr-[0.75rem] pl-[0.875rem] transition-opacity duration-1000 ease-in-out desk:pt-[13px] desk:pr-[41px] desk:pl-[44px]"
          style={{ opacity: i === index ? 1 : 0 }}
        >
          <p className="m-0 w-full text-center text-[1rem] leading-6 text-white italic desk:text-[18px] desk:leading-[27px]">
            {text}
          </p>
        </blockquote>
      ))}
      <div className="absolute inset-x-0 bottom-[1.4rem] flex justify-center gap-[13px] desk:bottom-[34px]">
        {reviews.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show review ${i + 1}`}
            aria-current={i === index}
            onClick={() => setIndex(i)}
            className="size-[6px] cursor-pointer rounded-full border-0 p-0 transition-colors"
            style={{ background: i === index ? "var(--color-gold)" : "var(--color-ivory)" }}
          />
        ))}
      </div>
    </div>
  );
}
