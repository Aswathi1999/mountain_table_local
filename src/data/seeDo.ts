/** [x, y, width?, height?] in the original page coordinates (kept for reference; the redesigned layouts use only the photographs). */
type Box = readonly [x: number, y: number, w?: number, h?: number];

export type Placed = { d: Box; m: Box };

/** Layout of one activity row, in the original's page coordinates (desktop @1280, mobile @320 design width). */
export type ActivityLayout = {
  image: { src: string; alt: string } & Placed;
  number: Placed;
  title: Placed;
  subtitle: Placed;
  body: Placed;
  /** Which side the photo sits on (desktop); drives the entrance direction. */
  side: "right" | "left";
};

export const activityLayouts: readonly ActivityLayout[] = [
  {
    side: "right",
    image: {
      src: "/images/11062b_4ed71e30b24e45bfa12d57c8cbbb52d3_d_5863_3920_s_4_2.jpg",
      alt: "A jeep on a safari trail at sunset",
      d: [851, 1663, 277, 426],
      m: [27, 1059, 227, 95],
    },
    number: { d: [925, 1921, 142, 152], m: [119, 1082, 42, 46] },
    title: { d: [179, 1732, 620, 112], m: [27, 1184, 250, 124] },
    subtitle: { d: [245, 1858, 300, 33], m: [27, 1325, 260, 33] },
    body: { d: [245, 1909, 500, 190], m: [27, 1367, 272, 300] },
  },
  {
    side: "left",
    image: {
      src: "/images/11062b_ff90a3f429144c7d853bea6506b7f737.jpg",
      alt: "Paragliders above the hills of Vagamon",
      d: [152, 2129, 277, 426],
      m: [27, 1725, 227, 95],
    },
    number: { d: [226, 2387, 142, 152], m: [119, 1748, 42, 46] },
    title: { d: [534, 2152, 560, 112], m: [27, 1850, 250, 124] },
    subtitle: { d: [595, 2278, 300, 33], m: [27, 1985, 260, 33] },
    body: { d: [595, 2329, 502, 280], m: [27, 2028, 263, 500] },
  },
  {
    side: "right",
    image: {
      src: "/images/11062b_a52890f0d524450eb3e371bcfa5c0b77.jpg",
      alt: "A cyclist on a hillside trail",
      d: [851, 2629, 277, 426],
      m: [30, 2569, 227, 95],
    },
    number: { d: [925, 2887, 142, 152], m: [122, 2592, 42, 46] },
    title: { d: [179, 2661, 560, 112], m: [27, 2694, 250, 62] },
    subtitle: { d: [240, 2774, 300, 33], m: [30, 2764, 260, 33] },
    body: { d: [240, 2824, 438, 140], m: [30, 2806, 251, 190] },
  },
  {
    side: "left",
    image: {
      src: "/images/8daf94f88f524d8cb168d8004c1fe282.jpg",
      alt: "A hiker above the mist on the Vagamon trail",
      d: [152, 3055, 277, 426],
      m: [30, 3042, 227, 95],
    },
    number: { d: [226, 3313, 142, 152], m: [122, 3065, 42, 46] },
    title: { d: [552, 3068, 560, 112], m: [33, 3167, 250, 62] },
    subtitle: { d: [613, 3181, 300, 33], m: [33, 3236, 260, 33] },
    body: { d: [613, 3231, 495, 190], m: [33, 3279, 252, 270] },
  },
  {
    side: "right",
    image: {
      src: "/images/66154b37def64bfba3cf82929427e0c5.jpg",
      alt: "Grilled food over a barbecue fire",
      d: [851, 3481, 277, 426],
      m: [33, 3606, 227, 95],
    },
    number: { d: [925, 3739, 142, 152], m: [125, 3629, 42, 46] },
    title: { d: [179, 3525, 620, 112], m: [36, 3732, 270, 62] },
    subtitle: { d: [240, 3638, 300, 33], m: [33, 3802, 260, 33] },
    body: { d: [240, 3688, 504, 190], m: [33, 3844, 252, 330] },
  },
  {
    side: "left",
    image: {
      src: "/images/7323565a035442139d080d3d3fead270.jpg",
      alt: "Wild elephants grazing in a meadow",
      d: [161, 3934, 277, 426],
      m: [30, 4233, 227, 95],
    },
    number: { d: [235, 4192, 142, 152], m: [122, 4256, 42, 46] },
    title: { d: [529, 4013, 560, 112], m: [33, 4358, 280, 62] },
    subtitle: { d: [590, 4126, 300, 33], m: [30, 4427, 260, 33] },
    body: { d: [590, 4176, 457, 100], m: [33, 4470, 252, 150] },
  },
];

/** The seven "Exciting Escapes" photographs, in their original order. */
export const honeycombPhotos = [
  { src: "/images/81d784_a43d2aa0646e4ef884b76c80a2b04d2f.jpg", alt: "A bathtub beside a slatted window" },
  { src: "/images/81d784_1c2a1355792941408dd4987fa7e78484.jpg", alt: "The infinity pool at night" },
  { src: "/images/81d784_25b1f7c4c5de4910a05fa23069ef109a.jpg", alt: "A basin beside a lit window niche" },
  {
    src: "/images/c18256_e258df5a2e004fb0b702a4bb9e142cec.jpg",
    alt: "The infinity pool and covered terrace at sunset",
  },
  { src: "/images/c18256_9bf951b03ba94f55a8d71c9ad2cd5249.jpg", alt: "A stone path through the tea plantation" },
  { src: "/images/c18256_6f8159e643924ae99302e95ab1689264.jpg", alt: "A wooden writing desk" },
  { src: "/images/c18256_856598ef975d4cef8aab0df95f08eb12.jpg", alt: "A bright hall with a world map" },
] as const;
