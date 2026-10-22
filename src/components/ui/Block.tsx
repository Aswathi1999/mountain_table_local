import type { ReactNode } from "react";
import { blockHeight } from "@/lib/stage";

type Props = {
  /** Block height on desktop (px) and mobile (px at the 320px design width). */
  d: number;
  m: number;
  id?: string;
  className?: string;
  /** Full-bleed content (backgrounds) rendered behind the centred stage. */
  back?: ReactNode;
  children?: ReactNode;
  label?: string;
};

/** Fixed-height page band containing a centred stage (980px desktop, 320-unit mobile) for absolutely placed children. */
export function Block({ d, m, id, className = "", back, children, label }: Props) {
  return (
    <section id={id} aria-label={label} className={`mt-block ${className}`} style={blockHeight(d, m)}>
      {back}
      <div className="mt-stage">{children}</div>
    </section>
  );
}
