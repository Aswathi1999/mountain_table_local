import { PROPERTY_LOCATION } from "@/lib/site";
import { Art, P, tone, type DecorProps } from "./_base";

/** A compass rose: a ring, a four-point star and a north tick. */
export function CompassRose(props: DecorProps) {
  return (
    <Art viewBox="0 0 60 60" color={tone.gold} opacity={0.8} stroke={0.9} {...props}>
      <circle cx="30" cy="30" r="22" />
      <circle cx="30" cy="30" r="17" opacity="0.5" />
      <P d="M30 6L35 25L54 30L35 35L30 54L25 35L6 30L25 25Z" />
      <P d="M30 1V7" />
    </Art>
  );
}

const fmt = (n: number, pos: string, neg: string) => `${Math.abs(n).toFixed(4)}° ${n >= 0 ? pos : neg}`;

/**
 * The property's position in small tracked type, e.g. "9.7428° N · 76.9009° E". An altitude is shown only when you pass one
 * (it is not recorded anywhere in the project, so none is invented).
 */
export function Coordinates({
  altitude,
  className = "",
}: {
  /** Metres above sea level, e.g. 1100. */
  altitude?: number;
  className?: string;
}) {
  return (
    <span className={`t-caption tracking-[0.18em] tabular-nums ${className}`}>
      {altitude ? `${altitude.toLocaleString("en-IN")} M · ` : ""}
      {fmt(PROPERTY_LOCATION.lat, "N", "S")} · {fmt(PROPERTY_LOCATION.lng, "E", "W")}
    </span>
  );
}

/** A section number in gold italic serif, such as "01 —". Use only where the sections really are a sequence. */
export function SectionMarker({ n, className = "" }: { n: number; className?: string }) {
  return (
    <span aria-hidden="true" className={`text-gold font-display italic ${className}`}>
      {String(n).padStart(2, "0")} —
    </span>
  );
}
