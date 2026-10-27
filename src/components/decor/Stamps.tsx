import { useId } from "react";
import { smooth, tone, type DecorProps } from "./_base";

const MOUNTAIN = "M-14 8L-5-8L0-1L5-7L14 8Z";

type StampProps = Pick<DecorProps, "color" | "size" | "rotate" | "opacity" | "className" | "style">;

const wrap = (p: StampProps, defaults: { size: number; opacity: number }) => ({
  "aria-hidden": true as const,
  focusable: "false" as const,
  className: `pointer-events-none block max-w-none select-none ${p.className ?? ""}`,
  style: {
    color: p.color,
    width: p.size ?? defaults.size,
    height: "auto",
    opacity: p.opacity ?? defaults.opacity,
    rotate: p.rotate ? `${p.rotate}deg` : undefined,
    ...p.style,
  },
});

/** A circular badge with text running round it and a small mountain at its centre. The ring turns slowly (data-rotate). */
export function RotatingBadge({
  text = "STAY · RELAX · EXPLORE · ",
  spin = true,
  ...p
}: StampProps & { text?: string; spin?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 120 120" fill="none" {...wrap({ color: tone.gold, ...p }, { size: 112, opacity: 0.9 })}>
      <defs>
        <path id={`${id}-c`} d="M60 60m-43 0a43 43 0 1 1 86 0a43 43 0 1 1-86 0" />
      </defs>
      <circle cx="60" cy="60" r="57" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <circle cx="60" cy="60" r="29" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <g data-rotate={spin ? "" : undefined} style={{ transformOrigin: "60px 60px" }}>
        <text fill="currentColor" fontSize="9.4" fontFamily="var(--font-display)" fontWeight="600">
          <textPath href={`#${id}-c`} textLength="262" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </g>
      <g transform="translate(60 62)" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round">
        <path d={MOUNTAIN} />
      </g>
    </svg>
  );
}

/** A postmark: a dashed ring with the name on top, the place below and an optional date line, plus wavy cancellation lines. */
export function Postmark({
  top = "THE MOUNTAIN TABLE",
  bottom = "VAGAMON · KERALA",
  date,
  lines = true,
  ...p
}: StampProps & { top?: string; bottom?: string; date?: string; lines?: boolean }) {
  const id = useId();
  return (
    <svg viewBox="0 0 230 140" fill="none" {...wrap({ color: tone.clay, ...p }, { size: 150, opacity: 0.8 })}>
      <defs>
        <path id={`${id}-t`} d="M70 70m-50 0a50 50 0 0 1 100 0" />
        <path id={`${id}-b`} d="M70 70m-58 0a58 58 0 0 0 116 0" />
      </defs>
      <circle cx="70" cy="70" r="64" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2.5 4" />
      <circle cx="70" cy="70" r="38" stroke="currentColor" strokeWidth="1" />
      <text fill="currentColor" fontSize="9" letterSpacing="1.6" fontFamily="var(--font-text)" fontWeight="600">
        <textPath href={`#${id}-t`} startOffset="50%" textAnchor="middle">
          {top}
        </textPath>
      </text>
      <text fill="currentColor" fontSize="8.4" letterSpacing="1.4" fontFamily="var(--font-text)" fontWeight="600">
        <textPath href={`#${id}-b`} startOffset="50%" textAnchor="middle">
          {bottom}
        </textPath>
      </text>
      <g
        transform={`translate(70 ${date ? 64 : 70}) scale(0.9)`}
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      >
        <path d={MOUNTAIN} />
      </g>
      {date ? (
        <text
          x="70"
          y="86"
          textAnchor="middle"
          fill="currentColor"
          fontSize="8"
          letterSpacing="1"
          fontFamily="var(--font-text)"
          fontWeight="600"
        >
          {date}
        </text>
      ) : null}
      {lines ? (
        <g stroke="currentColor" strokeWidth="1.3" strokeLinecap="round">
          <path d="M142 50q9-7 18 0t18 0 18 0 18 0" />
          <path d="M142 66q9-7 18 0t18 0 18 0 18 0" />
          <path d="M142 82q9-7 18 0t18 0 18 0 18 0" />
        </g>
      ) : null}
    </svg>
  );
}

const SEAL = smooth(
  Array.from({ length: 14 }, (_, i): [number, number] => {
    const a = (i / 14) * Math.PI * 2;
    const r = 44 + (i % 2 ? -2.2 : 2.6) + Math.sin(i * 2.1) * 1.4;
    return [50 + Math.cos(a) * r, 50 + Math.sin(a) * r];
  }),
  true,
);

/** A gold wax seal pressed with a mountain. */
export function WaxSeal(p: StampProps) {
  const id = useId();
  return (
    <svg viewBox="0 0 100 100" {...wrap(p, { size: 84, opacity: 1 })}>
      <defs>
        <radialGradient id={id} cx="38%" cy="32%" r="80%">
          <stop offset="0" style={{ stopColor: "var(--color-gold-soft)" }} />
          <stop offset="0.55" style={{ stopColor: "var(--color-gold)" }} />
          <stop offset="1" style={{ stopColor: "var(--color-gold-ink)" }} />
        </radialGradient>
      </defs>
      <path d={SEAL} fill={`url(#${id})`} />
      <circle cx="50" cy="50" r="31" fill="none" stroke="var(--color-gold-ink)" strokeWidth="1.2" opacity="0.55" />
      <g
        transform="translate(50 54) scale(1.35)"
        fill="none"
        stroke="var(--color-ivory)"
        strokeWidth="1.5"
        strokeLinejoin="round"
        opacity="0.92"
      >
        <path d={MOUNTAIN} />
      </g>
    </svg>
  );
}
