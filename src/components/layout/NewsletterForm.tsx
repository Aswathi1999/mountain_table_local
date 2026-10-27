"use client";

import { motion } from "motion/react";
import { useId, useState, type FormEvent } from "react";
import { EASE } from "@/components/motion/tokens";
import { contact } from "@/lib/site";

/**
 * "Seasonal offers, straight to your inbox": an email field and a round arrow button. The site has no mailing-list service, so
 * (like the enquiry form) it opens the visitor's email app with a short request to the property, addressed to the property.
 */
export function NewsletterForm() {
  const id = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setDone(true);
    const subject = "Seasonal offers | The Mountain Table";
    const body = `Please send seasonal offers to ${email.trim()}.`;
    window.location.href = `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Newsletter">
      <div className="flex items-center gap-2.5">
        <label htmlFor={id} className="sr-only">
          Your email
        </label>
        <div className="group/n relative min-w-0 flex-1">
          <input
            id={id}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError("");
              if (done) setDone(false);
            }}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            className="text-ivory placeholder:text-ivory/50 focus:border-gold h-[46px] w-full rounded-full border border-ivory/30 bg-transparent px-[18px] text-[0.9375rem] outline-none transition-colors duration-300"
          />
          <span
            aria-hidden="true"
            className="bg-gold pointer-events-none absolute inset-x-5 bottom-0 h-px origin-left scale-x-0 transition-transform duration-300 ease-out group-focus-within/n:scale-x-100"
          />
        </div>
        <button
          type="submit"
          aria-label="Subscribe"
          className="bg-ivory text-forest-deep hover:bg-gold flex size-[46px] shrink-0 cursor-pointer items-center justify-center rounded-full border-0 transition-colors duration-300 active:scale-95"
        >
          {done ? (
            <svg
              viewBox="0 0 24 24"
              className="size-4"
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
                transition={{ duration: 0.3, ease: EASE }}
              />
            </svg>
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <path d="M4 12h15M13 6l6 6-6 6" />
            </svg>
          )}
        </button>
      </div>
      <p role="status" className="t-caption m-0 mt-2 min-h-[1.25rem] text-gold-soft">
        {done && !error ? (
          <motion.span
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: EASE }}
            className="inline-block"
          >
            Your email app should open. Thank you, you are on the list once you send it.
          </motion.span>
        ) : null}
      </p>
      {error ? (
        <p id={`${id}-error`} role="alert" className="t-caption m-0 mt-2 text-[#f0b4a8]">
          {error}
        </p>
      ) : null}
    </form>
  );
}
