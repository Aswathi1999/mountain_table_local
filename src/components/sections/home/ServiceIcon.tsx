/** Fine line icons for the six services (24px grid, 1.2 stroke, drawn in `currentColor`). */
const paths = {
  breakfast: (
    <>
      <path d="M4 11h13v3.5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5V11Z" />
      <path d="M17 12.5h1.5a2.2 2.2 0 0 1 0 4.4H16.6" />
      <path d="M8 3.5c-1 1-1 2 0 3M11.5 3.5c-1 1-1 2 0 3" />
    </>
  ),
  wifi: (
    <>
      <path d="M3 9.5a13 13 0 0 1 18 0" />
      <path d="M6 13a8.5 8.5 0 0 1 12 0" />
      <path d="M9 16.4a4 4 0 0 1 6 0" />
      <circle cx="12" cy="19.5" r="0.6" />
    </>
  ),
  garden: (
    <>
      <path d="M12 21v-9" />
      <path d="M12 12c-4.5 0-6.5-3-6.5-7 4.5 0 6.5 3 6.5 7Z" />
      <path d="M12 15c4 0 6-2.5 6-6-4 0-6 2.5-6 6Z" />
    </>
  ),
  housekeeping: (
    <>
      <path d="M3 18v-6.5A2.5 2.5 0 0 1 5.5 9h13a2.5 2.5 0 0 1 2.5 2.5V18" />
      <path d="M3 15.5h18M6 9V7a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 12 7v2" />
      <path d="M3 18v1.5M21 18v1.5" />
    </>
  ),
  pool: (
    <>
      <path d="M3 15c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2S19.5 15 21 15" />
      <path d="M3 19c1.5 0 1.5-1.2 3-1.2s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2S19.5 19 21 19" />
      <path d="M8 11.5V5.5a1.8 1.8 0 0 1 3.6 0M15 11.5V5.5a1.8 1.8 0 0 1 3.6 0M8 8.5h7" />
    </>
  ),
  amenities: (
    <>
      <rect x="3" y="5" width="18" height="12" rx="1.5" />
      <path d="M9 20.5h6M12 17v3.5" />
    </>
  ),
} as const;

export type ServiceIconName = keyof typeof paths;

export function ServiceIcon({ name, className }: { name: ServiceIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
