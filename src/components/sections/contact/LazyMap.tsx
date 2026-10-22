"use client";

import { useEffect, useRef, useState } from "react";
import { MAP_EMBED_URL } from "@/lib/site";

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
          sandbox="allow-scripts allow-same-origin allow-popups"
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
    </div>
  );
}
