import { ContactSection } from "@/components/sections/contact/ContactSection";
import { LocationSection } from "@/components/sections/contact/LocationSection";
import { contact } from "@/lib/site";

/** Closing area shared by every page: location + contact, then the copyright bar. */
export function Footer() {
  return (
    <footer id="SITE_FOOTER">
      <LocationSection />
      <ContactSection />
      <div className="bg-ink border-t border-white/10 py-5 text-center">
        <p className="text-nav m-0 text-[0.875rem] tracking-[0.08em]">{contact.copyright}</p>
      </div>
    </footer>
  );
}
