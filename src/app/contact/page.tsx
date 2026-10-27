import { ContactCards } from "@/components/sections/contact/ContactCards";
import { ContactSection } from "@/components/sections/contact/ContactSection";
import { LocationSection } from "@/components/sections/contact/LocationSection";
import { PageHero } from "@/components/sections/PageHero";
import { pageMetadataFor } from "@/lib/metadata";
import { contact } from "@/lib/site";

export const metadata = pageMetadataFor(
  "/contact",
  "CONTACT | The Mountain Table",
  "Contact The Mountain Table, a homestay in the hills of Ulupuni, Vagamon: phone, email, address, WhatsApp, map and an enquiry form.",
);

/** Contact: the shared inner-page hero, the contact cards overlapping its edge, the enquiry form, then the map. */
export default function ContactPage() {
  return (
    <div className="contact-page">
      <PageHero
        id="contact-hero"
        titleId="contact-hero-title"
        image={{ src: "/images/about/ridges.jpg", position: "50% 40%" }}
        crumb="Contact"
        eyebrow="Vagamon, Kerala"
        mist
        lines={[contact.heading.charAt(0) + contact.heading.slice(1).toLowerCase()]}
        intro={contact.address}
      />
      <ContactCards />
      <ContactSection />
      <LocationSection />
    </div>
  );
}
