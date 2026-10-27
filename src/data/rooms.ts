/** [x, y, width?, height?] in the original page coordinates (kept for reference; the redesigned layouts use only the photographs). */
type Box = readonly [x: number, y: number, w?: number, h?: number];

export type Placed = { d: Box; m: Box };

export type RoomLayout = {
  name: string;
  image: { src: string; alt: string } & Placed;
  /** Dark text panel laid over the lower part of the photo. */
  panel: Placed;
  title: Placed;
  body: Placed;
};

/** Page coordinates measured on the original (desktop @1280, mobile @320 design width). */
export const roomLayouts: readonly RoomLayout[] = [
  {
    name: "Room 1",
    image: {
      src: "/images/c18256_e6722fd3397a4b21a829c2ab06e9e5a6.jpg",
      alt: "Room 1 with panoramic glass windows",
      d: [154, 894, 302, 849],
      m: [0, 636, 320, 630],
    },
    panel: { d: [154, 1380, 303, 351], m: [0, 972, 320, 294] },
    title: { d: [177, 1394, 191, 34], m: [22, 1005, 181, 33] },
    body: { d: [175, 1434, 262, 250], m: [15, 1044, 289, 190] },
  },
  {
    name: "Room 2",
    image: {
      src: "/images/c18256_6f8159e643924ae99302e95ab1689264.jpg",
      alt: "Room 2 with a wooden writing desk",
      d: [489, 894, 302, 849],
      m: [0, 1299, 320, 653],
    },
    panel: { d: [489, 1380, 303, 352], m: [0, 1635, 320, 317] },
    title: { d: [512, 1394, 191, 35], m: [22, 1668, 181, 33] },
    body: { d: [510, 1434, 262, 250], m: [15, 1707, 289, 190] },
  },
  {
    name: "Room 3",
    image: {
      src: "/images/c18256_6dc10df5ec984167b34b20faaf20a16c.jpg",
      alt: "Room 3 with a king bed and rose petals",
      d: [824, 894, 302, 849],
      m: [0, 1985, 320, 653],
    },
    panel: { d: [824, 1380, 303, 352], m: [0, 2321, 320, 317] },
    title: { d: [847, 1394, 191, 35], m: [22, 2354, 181, 33] },
    body: { d: [845, 1434, 262, 250], m: [15, 2393, 289, 210] },
  },
];

/** Cancellation-policy rows are placed individually in the original (mixed line heights), so keep their tops. */
export const cancellationRows: readonly { d: Box; m: Box; leading: "tight" | "loose" }[] = [
  { d: [187, 3410, 930, 26], m: [20, 5467, 280, 76], leading: "tight" },
  { d: [187, 3434, 930, 32], m: [20, 5538, 280, 84], leading: "loose" },
  { d: [187, 3465, 930, 32], m: [20, 5625, 280, 84], leading: "loose" },
  { d: [187, 3496, 930, 26], m: [20, 5712, 280, 52], leading: "tight" },
  { d: [187, 3522, 930, 26], m: [20, 5761, 280, 76], leading: "tight" },
];
