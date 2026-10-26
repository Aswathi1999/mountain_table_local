"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Pages whose own design already carries the contact details, so the shared map and enquiry form are left out. */
const HIDDEN_ON = new Set(["/", "/about", "/see-do", "/gallery"]);

/** Renders its children on every page except the homepage, About, See & Do and Gallery pages (used for the map and contact form in the shared footer). */
export function HideOnHome({ children }: { children: ReactNode }) {
  return HIDDEN_ON.has(usePathname()) ? null : <>{children}</>;
}
