"use client";

import { motion, useInView } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { CONTACT_FX } from "@/components/motion/home-fx.config";
import { EASE } from "@/components/motion/tokens";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { contact, WHATSAPP_URL } from "@/lib/site";

const { enabled, rise, stagger, delay, copiedMs } = CONTACT_FX.cards;

/** Each icon is a small SVG with its own one-time action (set in globals.css, `.cc-*`), played when its card arrives and again on hover. */
const Svg = ({ children }: { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    className="cc-svg size-[1.375rem]"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children}
  </svg>
);

const PhoneIcon = () => (
  <Svg>
    <path
      className="cc-wig"
      d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"
    />
    <path className="cc-arc cc-arc-1" d="M14.5 3.5a6 6 0 0 1 6 6" />
    <path className="cc-arc cc-arc-2" d="M14.5 7a2.6 2.6 0 0 1 2.5 2.5" />
  </Svg>
);
const MailIcon = () => (
  <Svg>
    <rect className="cc-letter" x="6" y="6" width="12" height="9" rx="1" />
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path className="cc-flap" d="M3 7l9 6 9-6" />
  </Svg>
);
const PinIcon = () => (
  <Svg>
    <ellipse className="cc-ground" cx="12" cy="21.5" rx="3.5" ry="1" strokeWidth="1" />
    <g className="cc-pin">
      <path d="M12 20s-7-5.2-7-10a7 7 0 0 1 14 0c0 4.8-7 10-7 10z" />
      <circle cx="12" cy="10" r="2.5" />
    </g>
  </Svg>
);
const ChatIcon = () => (
  <Svg>
    <path d="M21 12a8.5 8.5 0 0 1-12.5 7.5L3 21l1.5-5.2A8.5 8.5 0 1 1 21 12z" />
    <circle className="cc-dot cc-dot-1" cx="8.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    <circle className="cc-dot cc-dot-2" cx="12.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
    <circle className="cc-dot cc-dot-3" cx="16.5" cy="12" r="0.9" fill="currentColor" stroke="none" />
  </Svg>
);

const badge = "flex size-[3.375rem] items-center justify-center rounded-full transition-colors duration-300";
const card =
  "cc-card group relative flex h-full flex-col gap-3 rounded-[18px] p-7 shadow-[0_18px_44px_rgba(10,34,27,0.1)] transition-[translate,box-shadow] duration-500 hover:-translate-y-1.5 hover:shadow-[0_26px_56px_rgba(10,34,27,0.16)]";

/** The phone number or email address: with a mouse, a click copies it ("Copied" pops up above and the text turns into a tick). */
function CopyText({
  text,
  label,
  children,
  className,
}: {
  text: string;
  label: string;
  children: ReactNode;
  className: string;
}) {
  const [copied, setCopied] = useState(false);
  const timer = useRef(0);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard access can be refused; the card itself is still a link, so nothing is lost.
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), copiedMs);
  };
  return (
    <>
      <p className={`${className} [@media(hover:hover)_and_(min-width:768px)]:hidden`}>{children}</p>
      <span className="relative z-10 hidden [@media(hover:hover)_and_(min-width:768px)]:block">
        <button
          type="button"
          onClick={copy}
          aria-label={`Copy ${label}`}
          className={`${className} -mx-2 inline-flex cursor-copy items-center gap-2 rounded-md border-0 bg-transparent px-2 py-1 text-left transition-colors duration-200 hover:bg-forest/5 focus-visible:outline-2 focus-visible:outline-gold`}
        >
          <span>{children}</span>
          {copied ? (
            <svg
              viewBox="0 0 24 24"
              className="text-gold-ink size-4 shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <motion.path
                d="M5 12.5l4.5 4.5L19 7.5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.25, ease: EASE }}
              />
            </svg>
          ) : null}
        </button>
        {copied ? (
          <span aria-hidden="true" className="pointer-events-none absolute -top-8 left-0">
            <motion.span
              className="t-caption bg-forest-deep text-ivory block rounded-full px-3 py-1 text-[0.75rem]"
              initial={{ opacity: 0, y: 6, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              Copied
            </motion.span>
          </span>
        ) : null}
        <span role="status" className="sr-only">
          {copied ? `${label} copied` : ""}
        </span>
      </span>
    </>
  );
}

/**
 * Four ways to reach the property, as soft cards that overlap the hero's lower edge: call, email, visit (all from the site's
 * contact details) and chat on WhatsApp (the dark card). Each card rises into place after the hero text, its icon acts once and
 * again on hover, and with a mouse the number and address copy on click (touch screens keep tap-to-call and tap-to-email).
 * Settings: `CONTACT_FX.cards`.
 */
export function ContactCards() {
  const reduce = useReducedMotion();
  const phone = contact.phoneLabel.replace(/^Tel:\s*/, "");
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { once: true, amount: 0.25 });
  const fx = enabled && !reduce;
  const item = {
    hidden: { opacity: 0, y: fx ? rise : 0 },
    show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: EASE } },
  };
  const stretch = "absolute inset-0 z-0 rounded-[18px] focus-visible:outline-2 focus-visible:outline-gold";
  return (
    <section
      aria-label="Ways to reach us"
      className="relative z-10 -mt-24 pb-4 desk:-mt-32"
      style={{ background: "linear-gradient(transparent 0, transparent 8rem, var(--color-ivory) 8rem)" }}
    >
      <div className="wrap">
        <motion.div
          ref={ref}
          data-motion=""
          className={`grid gap-5 sm:grid-cols-2 lg:grid-cols-4 ${seen && fx ? "cc-in" : ""}`}
          initial={fx ? "hidden" : false}
          animate={seen || !fx ? "show" : "hidden"}
          variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
        >
          <motion.div
            variants={item}
            data-motion=""
            className="cc-phone-card"
            style={{ ["--d" as string]: `${delay + 0.7}s` }}
          >
            <div className={`${card} text-forest bg-[#fffdf8]`}>
              <a href={contact.phoneHref} className={stretch} aria-label={`Call ${phone}`} />
              <span className={`${badge} text-forest bg-ivory-deep group-hover:bg-forest group-hover:text-ivory`}>
                <PhoneIcon />
              </span>
              <h2 className="t-h4 m-0 mt-1">Call</h2>
              <CopyText text={phone} label="phone number" className="t-small text-ink m-0 [font-size:1rem]">
                {phone}
              </CopyText>
            </div>
          </motion.div>
          <motion.div
            variants={item}
            data-motion=""
            className="cc-mail-card"
            style={{ ["--d" as string]: `${delay + stagger + 0.7}s` }}
          >
            <div className={`${card} text-forest bg-[#fffdf8]`}>
              <a href={`mailto:${contact.email}`} className={stretch} aria-label={`Email ${contact.email}`} />
              <span className={`${badge} text-forest bg-ivory-deep group-hover:bg-forest group-hover:text-ivory`}>
                <MailIcon />
              </span>
              <h2 className="t-h4 m-0 mt-1">Email</h2>
              <CopyText
                text={contact.email}
                label="email address"
                className="t-small text-ink m-0 [font-size:0.9375rem]"
              >
                {contact.email.split("@")[0]}
                <wbr />@{contact.email.split("@")[1]}
              </CopyText>
            </div>
          </motion.div>
          <motion.div
            variants={item}
            data-motion=""
            className="cc-pin-card"
            style={{ ["--d" as string]: `${delay + stagger * 2 + 0.7}s` }}
          >
            <div className={`${card} text-forest bg-[#fffdf8]`}>
              <span className={`${badge} text-forest bg-ivory-deep group-hover:bg-forest group-hover:text-ivory`}>
                <PinIcon />
              </span>
              <h2 className="t-h4 m-0 mt-1">Visit</h2>
              <address className="t-small text-ink m-0 [font-size:1rem] not-italic">{contact.address}</address>
            </div>
          </motion.div>
          <motion.div
            variants={item}
            data-motion=""
            className="cc-chat-card"
            style={{ ["--d" as string]: `${delay + stagger * 3 + 0.7}s` }}
          >
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={`${card} bg-forest-deep text-ivory no-underline`}
            >
              <span className={`${badge} bg-ivory/12 text-gold-soft group-hover:bg-gold group-hover:text-forest-deep`}>
                <ChatIcon />
              </span>
              <h2 className="t-h4 m-0 mt-1">Chat on WhatsApp</h2>
              <p className="t-small m-0 [font-size:1rem]">{phone}</p>
              <span className="t-small text-gold-soft mt-auto inline-flex items-center gap-2 pt-1">
                Start a chat
                <ArrowIcon className="size-4 transition-transform duration-500 group-hover:translate-x-1.5" />
                <span className="sr-only"> (opens in a new tab)</span>
              </span>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
