/** The services shown in the home page "Our Services" showcase. Edit this list to change, reorder or add services. */
export type ShowcaseService = {
  id: string;
  title: string;
  subtitle: string;
  /** Short category shown in the pill on the photograph. */
  tag: string;
  /** Handwritten line over the photograph. */
  script: string;
  description: string;
  highlights: readonly [string, string, string];
  cta: { label: string; href: string };
  icon: "dining" | "adventure" | "spa" | "fire" | "celebration";
  image: { src: string; alt: string; position: string };
};

export const showcaseServices: readonly ShowcaseService[] = [
  {
    id: "dining",
    title: "Fine Dining",
    subtitle: "Seasonal menus from local farms",
    tag: "Dining",
    script: "Taste the mountain",
    description: "Long, unhurried dinners on the terrace, with dishes built around what the valley grows each season.",
    highlights: ["Seasonal tasting menus", "Terrace dining", "Local wines"],
    cta: { label: "View the Menu", href: "/contact" },
    icon: "dining",
    image: {
      src: "/images/c18256_4f1a87a5cd434f3e869c7e16b058f9b1.jpg",
      alt: "The dining area with a long wooden table and glass walls",
      position: "42% 55%",
    },
  },
  {
    id: "adventure",
    title: "Guided Adventures",
    subtitle: "Trails, viewpoints & hidden corners",
    tag: "Adventure",
    script: "Go a little further",
    description: "Set out with guides who know every ridge and shortcut — on foot, by jeep or from the sky.",
    highlights: ["Sunrise hikes", "Jeep safaris", "Paragliding"],
    cta: { label: "See Activities", href: "/see-do" },
    icon: "adventure",
    image: {
      src: "/images/8daf94f88f524d8cb168d8004c1fe282.jpg",
      alt: "A hiker above the mist on the Vagamon trail",
      position: "50% 40%",
    },
  },
  {
    id: "spa",
    title: "Spa & Wellness",
    subtitle: "Slow, restoring rituals",
    tag: "Wellness",
    script: "Breathe it in",
    description: "Warm stone, soft linen and treatments that let the mountain air do the rest.",
    highlights: ["Massages", "Wellness rituals", "Morning yoga"],
    cta: { label: "Explore the Spa", href: "/contact" },
    icon: "spa",
    image: {
      src: "/images/81d784_a43d2aa0646e4ef884b76c80a2b04d2f.jpg",
      alt: "A bathtub beside a slatted window",
      position: "50% 50%",
    },
  },
  {
    id: "fireside",
    title: "Fireside Evenings",
    subtitle: "BBQ, music & starlit nights",
    tag: "Evenings",
    script: "Stay up for the stars",
    description: "As the sun sets, the terrace comes alive with the fire pit, the grill and music under the stars.",
    highlights: ["BBQ nights", "Live music", "Stargazing"],
    cta: { label: "Plan Your Evening", href: "/see-do#activity-5" },
    icon: "fire",
    image: {
      src: "/images/66154b37def64bfba3cf82929427e0c5.jpg",
      alt: "Burgers sizzling over open flames on the barbecue",
      position: "28% 55%",
    },
  },
  {
    id: "celebrations",
    title: "Private Celebrations",
    subtitle: "Weddings, birthdays & gatherings",
    tag: "Celebrations",
    script: "Moments worth raising a glass to",
    description:
      "Intimate weddings, milestone birthdays or a private dinner for two — planned around you, with the mountains as the backdrop.",
    highlights: ["Intimate weddings", "Birthdays", "Private dinners"],
    cta: { label: "Enquire Now", href: "/contact" },
    icon: "celebration",
    image: {
      src: "/images/c18256_e258df5a2e004fb0b702a4bb9e142cec.jpg",
      alt: "The infinity pool and covered terrace at sunset",
      position: "60% 55%",
    },
  },
];
