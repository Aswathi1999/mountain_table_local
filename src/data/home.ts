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
    photo: {
      src: "/images/c18256_13d5e4f454de4cdd85681b5304521f32.jpg",
      alt: "A stone path between tea bushes",
    },
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
  {
    src: "/images/c18256_f351e4c4ff654f0bae5209bb90cd484e.jpg",
    alt: "Stone steps winding through the gardens",
    blur: "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAeABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFAwb/xAAjEAACAgICAQQDAAAAAAAAAAABAgADBBESITETIkFCUWGB/8QAFwEAAwEAAAAAAAAAAAAAAAAAAAECA//EABkRAQACAwAAAAAAAAAAAAAAAAABEQISIf/aAAwDAQACEQMRAD8AiYri3GZCNt5hi3tRcHQHryJjgsVBII6HzKOM+M4X3gH7GZRHSXcfLFtIYNqERrepV0rgCE11g7c1XokKD2TGynoqqnjxB/EQ0aLh3siaWZD2LpvEigr12kr1Xv8AcJGry1qXjxJ/sJNZB//Z",
  },
  {
    src: "/images/c18256_4f1a87a5cd434f3e869c7e16b058f9b1.jpg",
    alt: "The dining area with a long wooden table",
    blur: "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAANABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFAQP/xAAeEAACAgICAwAAAAAAAAAAAAABAgADERIEISJBUf/EABYBAQEBAAAAAAAAAAAAAAAAAAIAAf/EABcRAQEBAQAAAAAAAAAAAAAAAAABAhL/2gAMAwEAAhEDEQA/AIzcBEcMLEs+gTrdx61qLrZqB6Madlq6rrVdu8yLezDfyJzMuVK3XPewhF1YhRCE+X//2Q==",
  },
  {
    src: "/images/c18256_13d5e4f454de4cdd85681b5304521f32.jpg",
    alt: "A stone path between tea bushes",
    blur: "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAdABQDASIAAhEBAxEB/8QAGAAAAwEBAAAAAAAAAAAAAAAAAAQFAwL/xAAjEAACAQQABwEBAAAAAAAAAAABAgMABBESBRMhMUFRUhQy/8QAFwEBAQEBAAAAAAAAAAAAAAAAAAECA//EABgRAQEBAQEAAAAAAAAAAAAAAAABEQIh/9oADAMBAAIRAxEAPwChw3iltHZn80Y3+fdTLq6mO2yomfmokDXCPjmBQPFMGQM+isXJ75rjbRolzPGCsTuFz4orBuchwDgeqKgUUOdVDbM3SnoI47dTGWG57mp1nKyyZGOlc3hIbYE5rdm+Lhi6aYTHTJHuikRcy4/s0UnOI//Z",
  },
  {
    src: "/images/c18256_55a42d4d67124846bf5373915527592c.jpg",
    alt: "The infinity pool overlooking the hills",
    blur: "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAZABQDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAEDBQIG/8QAIhAAAgIBAwQDAAAAAAAAAAAAAAECAxEFIVEEExRBFTGR/8QAFgEBAQEAAAAAAAAAAAAAAAAAAgQD/8QAHREAAgIBBQAAAAAAAAAAAAAAAAECAxIREzFRUv/aAAwDAQACEQMRAD8A9UqY8oU1XXFylJbLJifKVr2/05s1KudcljdordVpPlAstWy3iCazsBm9PZTGvEpLOQJtm70LKPRhK+XI+9LlkUP2bO+bXIlVFFfIaAhL7AGbFof/2Q==",
  },
  {
    src: "/images/c18256_e5d979a1e3574fa4982be5aba13e7d68.jpg",
    alt: "View across the valley from the property",
    blur: "data:image/jpeg;base64,/9j/2wBDABIMDRANCxIQDhAUExIVGywdGxgYGzYnKSAsQDlEQz85Pj1HUGZXR0thTT0+WXlaYWltcnNyRVV9hnxvhWZwcm7/2wBDARMUFBsXGzQdHTRuST5Jbm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm5ubm7/wAARCAAeABQDASIAAhEBAxEB/8QAGQAAAwEBAQAAAAAAAAAAAAAAAAMEBQEG/8QAIhAAAgIBBAEFAAAAAAAAAAAAAQIAEQMEEhMhMQUGFDJS/8QAFgEBAQEAAAAAAAAAAAAAAAAAAAIB/8QAGBEBAQADAAAAAAAAAAAAAAAAABEBITH/2gAMAwEAAhEDEQA/APJIpBBAJl2mc4yW5ONvIM7oesf1sXUXnU4cpDC1Pi5F2NPD7j9RXHtGpWh0LEJk0n5EJVDtM+zTmjRj+T5WAqwG5ZFp2ISj3cdjADrssSc9akfE6uQLhLMjAubHcIpH/9k=",
  },
] as const;

export const DISCOVER_REPEATS = 6;
