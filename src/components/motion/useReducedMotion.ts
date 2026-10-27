"use client";

import { useSyncExternalStore } from "react";

const query = "(prefers-reduced-motion: reduce)";

function subscribe(notify: () => void) {
  const mq = window.matchMedia(query);
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
}

/**
 * Whether the visitor prefers reduced motion. Unlike the library's hook, it is always false on the server and while hydrating, so
 * the markup matches the server's (no hydration mismatch) and the preference takes effect right after; the global CSS already shows
 * every \`data-motion\` element in its final state for these visitors.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}
