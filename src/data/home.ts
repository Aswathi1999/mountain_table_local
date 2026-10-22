export type ServiceKey = "breakfast" | "garden" | "pool" | "wifi" | "housekeeping" | "amenities";

export type Service = {
  key: ServiceKey;
  /** Short label taken from the service's own sentence (the original has no per-service headings). */
  label: string;
  icon: string;
  /** Large photo for the three featured services. */
  photo?: { src: string; alt: string };
};

/** Original order: breakfast, garden, pool (featured with photos), then wifi, housekeeping, amenities (compact). */
export const services: readonly Service[] = [
  {
    key: "breakfast",
    label: "Complimentary breakfast",
    icon: "/icons/breakfast.svg",
    photo: {
      src: "/images/c18256_4f1a87a5cd434f3e869c7e16b058f9b1.jpg",
      alt: "The dining area with a long wooden table",
    },
  },
  {
    key: "garden",
    label: "Garden & tea plantation",
    icon: "/icons/garden.svg",
    photo: { src: "/images/c18256_13d5e4f454de4cdd85681b5304521f32.jpg", alt: "A stone path between tea bushes" },
  },
  {
    key: "pool",
    label: "Infinity pool",
    icon: "/icons/pool.svg",
    photo: {
      src: "/images/c18256_55a42d4d67124846bf5373915527592c.jpg",
      alt: "The infinity pool overlooking the hills",
    },
  },
  { key: "wifi", label: "Complimentary Wi-Fi", icon: "/icons/wifi.svg" },
  { key: "housekeeping", label: "Daily housekeeping", icon: "/icons/housekeeping.svg" },
  { key: "amenities", label: "Modern amenities", icon: "/icons/play.svg" },
];

/** Discover gallery: five photos, repeated to give the slider its length (as the original does). */
export const discoverPhotos = [
  { src: "/images/c18256_f351e4c4ff654f0bae5209bb90cd484e.jpg", alt: "Stone steps winding through the gardens" },
  { src: "/images/c18256_4f1a87a5cd434f3e869c7e16b058f9b1.jpg", alt: "The dining area with a long wooden table" },
  { src: "/images/c18256_13d5e4f454de4cdd85681b5304521f32.jpg", alt: "A stone path between tea bushes" },
  { src: "/images/c18256_55a42d4d67124846bf5373915527592c.jpg", alt: "The infinity pool overlooking the hills" },
  { src: "/images/c18256_e5d979a1e3574fa4982be5aba13e7d68.jpg", alt: "View across the valley from the property" },
] as const;

export const DISCOVER_REPEATS = 6;
