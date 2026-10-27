import { Art, bezier, P, r1, type DecorProps } from "./_base";

/* Five single-stroke botanical sketches, in the manner of a field journal. Default colour: soft gold (the sage line). */

const FERN_STEM = [
  [48, 198],
  [44, 140],
  [52, 70],
  [62, 6],
] as const;

/** A fern frond: a curved rachis with paired, tapering pinnae. */
export function Fern(props: DecorProps) {
  let d = "";
  for (let i = 0; i < 15; i++) {
    const t = 0.06 + (i / 14) * 0.9;
    const { x, y } = bezier(FERN_STEM, t);
    const len = 38 * (1 - t * 0.82) + 4;
    d += `M${r1(x)} ${r1(y)}q${r1(-len * 0.55)} ${r1(-len * 0.05)} ${r1(-len)} ${r1(-len * 0.5)}`;
    d += `M${r1(x)} ${r1(y)}q${r1(len * 0.55)} ${r1(-len * 0.05)} ${r1(len)} ${r1(-len * 0.5)}`;
  }
  return (
    <Art viewBox="0 0 100 200" {...props}>
      <P d="M48 198C44 140 52 70 62 6" />
      <P d={d} />
    </Art>
  );
}

const PINE_STEM = [
  [50, 198],
  [54, 140],
  [46, 80],
  [54, 8],
] as const;

/** A pine sprig: needles fanning off a stem, with one small cone. */
export function PineSprig(props: DecorProps) {
  let d = "";
  for (let i = 0; i < 11; i++) {
    const t = 0.1 + (i / 10) * 0.88;
    const { x, y } = bezier(PINE_STEM, t);
    const n = 24 * (1 - t * 0.55);
    for (const s of [-1, 1]) {
      d += `M${r1(x)} ${r1(y)}l${r1(s * n)} ${r1(-n * 0.62)}M${r1(x)} ${r1(y)}l${r1(s * n * 1.1)} ${r1(-n * 0.1)}M${r1(x)} ${r1(y)}l${r1(s * n * 0.7)} ${r1(n * 0.35)}`;
    }
  }
  return (
    <Art viewBox="0 0 100 200" {...props}>
      <P d="M50 198C54 140 46 80 54 8" />
      <P d={d} />
      <P d="M49 158c-8 2-13 9-12 19 8 2 14-3 15-12M44 163l5 9M41 169l7 5" />
    </Art>
  );
}

/** A wild grass stem with a feathered seed head and two long blades. */
export function GrassStem(props: DecorProps) {
  const stem = [
    [34, 198],
    [32, 130],
    [42, 70],
    [72, 10],
  ] as const;
  let d = "";
  for (let i = 0; i < 10; i++) {
    const { x, y, angle } = bezier(stem, 0.52 + i * 0.05);
    const a = (angle * Math.PI) / 180;
    const len = 12 - i * 0.6;
    for (const s of [-1, 1]) {
      const b = a + s * 0.75;
      d += `M${r1(x)} ${r1(y)}l${r1(Math.cos(b) * len)} ${r1(Math.sin(b) * len)}`;
    }
  }
  return (
    <Art viewBox="0 0 100 200" {...props}>
      <P d="M34 198C32 130 42 70 72 10" />
      <P d={d} />
      <P d="M40 198C46 140 40 100 22 60" />
      <P d="M46 198C58 150 70 120 92 100" />
    </Art>
  );
}

/** A mountain wildflower: six-petalled bloom on a stem with two leaves. */
export function Wildflower(props: DecorProps) {
  const petal = "M50 50C43 38 43 24 50 15C57 24 57 38 50 50Z";
  return (
    <Art viewBox="0 0 100 200" {...props}>
      <P d="M50 198C48 150 54 110 50 66" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <P key={a} d={petal} transform={`rotate(${a} 50 50)`} />
      ))}
      <circle cx="50" cy="50" r="2.4" />
      <P d="M50 150C34 146 26 134 24 120C40 122 48 134 50 150Z" />
      <P d="M50 120C64 116 72 104 74 90C60 92 52 104 50 120Z" />
      <P d="M50 150C42 140 34 132 26 124M50 120C58 110 66 102 72 94" />
    </Art>
  );
}

const BRANCH = [
  [20, 198],
  [30, 140],
  [60, 90],
  [112, 22],
] as const;

/** A leafy branch: alternating almond leaves, each with a midrib. */
export function LeafyBranch(props: DecorProps) {
  const leaves = [];
  for (let i = 0; i < 9; i++) {
    const t = 0.12 + (i / 8) * 0.82;
    const { x, y, angle } = bezier(BRANCH, t);
    const side = i % 2 ? 1 : -1;
    const len = 30 - t * 14;
    leaves.push(
      <g key={i} transform={`translate(${r1(x)} ${r1(y)}) rotate(${r1(angle + side * 52)}) scale(${r1(len / 32)})`}>
        <P d="M0 0C8-9 22-9 32 0C22 9 8 9 0 0Z" />
        <P d="M2 0H28" />
      </g>,
    );
  }
  return (
    <Art viewBox="0 0 140 200" {...props}>
      <P d="M20 198C30 140 60 90 112 22" />
      {leaves}
    </Art>
  );
}
