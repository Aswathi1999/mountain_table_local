/** Canonical origin. Set NEXT_PUBLIC_SITE_URL to switch every absolute URL (canonical, OG, sitemap) at once. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.themountaintable.in").replace(/\/$/, "");

export const SITE_NAME = "The Mountain Table";

export type NavItem = { label: string; href: string };

export const nav: readonly NavItem[] = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/about" },
  { label: "SEE & DO", href: "/see-do" },
  { label: "GALLERY", href: "/gallery" },
  { label: "BLOG", href: "/blog" },
  { label: "ROOMS & BOOKING", href: "/rooms-booking" },
];

export const contact = {
  heading: "CONTACT US",
  email: "themountaintable500@gmail.com",
  address: "Uluppuni, Kottamala P.O, Vagamon, Idukki Dst, Kerala- 685503",
  phoneLabel: "Tel: +91 9447009954",
  phoneHref: "tel:+919447009954",
  copyright: "© 2024 by The Mountain Table",
} as const;

export const social = {
  facebook: "https://www.facebook.com/themountaintableresort",
  instagram: "https://www.instagram.com/themountaintable/",
} as const;

/** Keyless Google Maps embed of the original's map widget (lat 9.742779, lng 76.900931, zoom 14, roadmap). */
export const MAP_EMBED_URL = "https://www.google.com/maps?q=9.742779,76.900931&z=14&output=embed";

/** Verified property location (the original Wix map's coordinates). */
export const PROPERTY_LOCATION = { lat: 9.742779, lng: 76.900931 } as const;
export const DIRECTIONS_URL = `https://www.google.com/maps/dir/?api=1&destination=${PROPERTY_LOCATION.lat},${PROPERTY_LOCATION.lng}`;
export const MAP_PAGE_URL = `https://www.google.com/maps/search/?api=1&query=${PROPERTY_LOCATION.lat},${PROPERTY_LOCATION.lng}`;

export const OG_IMAGE = {
  path: "/images/c18256_c623270b113b42aaa3981dedc1077ade.jpg",
  width: 2500,
  height: 1330,
} as const;
