"use client";

import { useEffect, useRef, useState } from "react";
import { MAP_EMBED_URL, MAP_PAGE_URL } from "@/lib/site";

/**
 * The Google Map is only mounted once the visitor is about to reach it (300px before it enters the viewport), so the heavy
 * map script never delays the rest of the page. A button loads it on demand where IntersectionObserver is unavailable.
 */
export function LazyMap({ title }: { title: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [load, setLoad] = useState(false);

  useEffect(() => {
    const el = host.current;
    if (!el || !("IntersectionObserver" in window)) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={host} className="absolute inset-0 bg-[#d9d6cf]">
      {load ? (
        <iframe
          title={title}
          src={MAP_EMBED_URL}
          referrerPolicy="no-referrer-when-downgrade"
          sandbox="allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox allow-forms"
          className="absolute inset-0 size-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setLoad(true)}
          className="absolute inset-0 flex size-full cursor-pointer items-center justify-center border-0 bg-transparent text-[13px] tracking-[0.22em] text-ink uppercase"
        >
          Load map
        </button>
      )}
      {/* Always-available fallback: the same map on Google Maps (the embed can be blocked by networks, extensions or privacy settings). */}
      <a
        href={MAP_PAGE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="t-label absolute top-3 left-3 z-10 bg-ivory/95 px-3 py-2 text-forest uppercase no-underline shadow-[0_2px_8px_rgba(20,42,33,0.2)] transition-colors duration-300 hover:bg-gold hover:text-forest-deep focus-visible:bg-gold focus-visible:text-forest-deep"
      >
        Open in Google Maps<span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );
}
