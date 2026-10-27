import { social } from "@/lib/site";

const link =
  "flex size-8 items-center justify-center text-current opacity-70 no-underline transition-[opacity] duration-300 hover:opacity-100 focus-visible:opacity-100";

/** Facebook and Instagram links (open in a new tab). Used in the header and the mobile menu. */
export function SocialIcons({ className = "" }: { className?: string }) {
  return (
    <ul aria-label="Social links" className={`m-0 flex list-none items-center gap-1 p-0 ${className}`}>
      <li>
        <a href={social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={link}>
          <svg viewBox="0 0 24 24" className="size-[18px]" fill="currentColor" aria-hidden="true">
            <path d="M13.5 21v-8h2.7l.4-3.2h-3.1V7.8c0-.9.3-1.5 1.6-1.5h1.7V3.4c-.3 0-1.3-.1-2.4-.1-2.4 0-4 1.5-4 4.1v2.4H7.6V13h2.8v8h3.1Z" />
          </svg>
        </a>
      </li>
      <li>
        <a href={social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={link}>
          <svg
            viewBox="0 0 24 24"
            className="size-[18px]"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            aria-hidden="true"
          >
            <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
          </svg>
        </a>
      </li>
    </ul>
  );
}
