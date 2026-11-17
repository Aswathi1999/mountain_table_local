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
  /** More photographs of the same activity, shown after the main one when the picture is opened full screen. */
  more?: readonly { src: string; alt: string }[];
  /** Which side the photo sits on (desktop); drives the entrance direction. */
  side: "right" | "left";
};

export const activityLayouts: readonly ActivityLayout[] = [
  {
    side: "right",
    more: [
      {
        src: "/images/see_and_do/jeep-safari-2-v1.jpg",
        alt: "A jeep turning on a red dirt clearing above green hills and misty mountains",
      },
    ],
    image: {
      src: "/images/see_and_do/Jeep-Safari-v2.jpg",
      alt: "A jeep on a safari trail through Vagamon",
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
    more: [
      {
        src: "/images/see_and_do/river-crossing-2-v1.jpg",
        alt: "A jeep splashing through a shallow, rocky forest stream",
      },
    ],
    image: {
      src: "/images/see_and_do/river-crossing-v1.jpg",
      alt: "A jeep crossing a shallow forest stream, reflected in the still water",
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
    more: [
      {
        src: "/images/see_and_do/waterfall-2-v1.jpg",
        alt: "A clear forest stream flowing softly over rocks under green trees",
      },
    ],
    image: {
      src: "/images/see_and_do/waterfall-v1.jpg",
      alt: "A waterfall tumbling over dark rocks, surrounded by dense green forest",
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
    more: [
      {
        src: "/images/see_and_do/dam-view-2-v1.jpg",
        alt: "Layered misty hills and winding reservoir waters in the blue light of early morning",
      },
    ],
    image: {
      src: "/images/see_and_do/dam-view-v1.jpg",
      alt: "Misty hills and a reservoir at sunset, seen from above",
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
    more: [
      {
        src: "/images/see_and_do/paragliding-2-v1.jpg",
        alt: "Colourful paragliders in the air above a grassy hilltop with onlookers gathered below",
      },
    ],
    image: {
      src: "/images/see_and_do/Paragliding.jpg",
      alt: "A paraglider above the hills of Vagamon",
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
    more: [
      {
        src: "/images/see_and_do/mottakunnu-2-v1.jpg",
        alt: "Rounded green grassy hills rising into low cloud",
      },
    ],
    image: {
      src: "/images/see_and_do/Mottakunnu-v2.jpg",
      alt: "Green grassy hills and a small lake at Mottakunnu",
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
    more: [
      {
        src: "/images/see_and_do/pineforest-2-v1.jpg",
        alt: "A stone-paved path winding up through tall pines, covered in fallen pine needles",
      },
    ],
    image: {
      src: "/images/see_and_do/pineforest-v2.jpg",
      alt: "A misty trail through a tall pine forest",
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
      src: "/images/see_and_do/BBq-v2.jpg",
      alt: "Grilled food at an evening barbecue",
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
    more: [
      {
        src: "/images/see_and_do/glassbridge-2-v1.jpg",
        alt: "A glass-floored bridge reaching out over a dense forest canopy, seen from above",
      },
    ],
    image: {
      src: "/images/see_and_do/Glassbridge-v2.jpg",
      alt: "A glass bridge viewpoint above a misty forested valley",
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
  { src: "/images/81d784_a43d2aa0646e4ef884b76c80a2b04d2f-v2.jpg", alt: "A bathtub beside a slatted window" },
  { src: "/images/81d784_1c2a1355792941408dd4987fa7e78484-v2.jpg", alt: "The infinity pool at night" },
  { src: "/images/81d784_25b1f7c4c5de4910a05fa23069ef109a-v2.jpg", alt: "A basin beside a lit window niche" },
  {
    src: "/images/c18256_e258df5a2e004fb0b702a4bb9e142cec-v2.jpg",
    alt: "The infinity pool and covered terrace at sunset",
  },
  { src: "/images/c18256_9bf951b03ba94f55a8d71c9ad2cd5249-v2.jpg", alt: "A stone path through the tea plantation" },
  { src: "/images/c18256_6f8159e643924ae99302e95ab1689264-v2.jpg", alt: "A wooden writing desk" },
  { src: "/images/c18256_856598ef975d4cef8aab0df95f08eb12-v2.jpg", alt: "A bright hall with a world map" },
] as const;
