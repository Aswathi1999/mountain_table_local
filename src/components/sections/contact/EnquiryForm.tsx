"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useId, useState, type FormEvent, type ReactNode } from "react";
import { CONTACT_FX } from "@/components/motion/home-fx.config";
import { EASE, VIEW_ONCE } from "@/components/motion/tokens";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { contact } from "@/lib/site";
import { SuccessView } from "./LetterSeal";

type Fields = {
  name: string;
  email: string;
  phone: string;
  guests: string;
  arrival: string;
  departure: string;
  message: string;
};

const GUESTS = ["2 Adults", "1 Adult", "2 Adults, 1 Child", "2 Adults, 2 Children", "Group (5+)"] as const;
type Errors = Partial<Record<keyof Fields, string>>;
type Status = "idle" | "sending" | "success" | "error";

const LIMITS = { name: 80, message: 1500 } as const;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_PATTERN = /^[+()\d][\d\s().-]{5,19}$/;

function validate(f: Fields): Errors {
  const errors: Errors = {};
  if (f.name.trim().length < 2) errors.name = "Please enter your name.";
  else if (f.name.length > LIMITS.name) errors.name = `Please keep your name under ${LIMITS.name} characters.`;
  if (!EMAIL_PATTERN.test(f.email.trim())) errors.email = "Please enter a valid email address.";
  if (f.phone.trim() && !PHONE_PATTERN.test(f.phone.trim()))
    errors.phone = "Please enter a valid phone number, or leave it blank.";
  if (f.arrival && f.departure && f.departure < f.arrival) errors.departure = "Departure must be after arrival.";
  if (f.message.trim().length < 10) errors.message = "Please tell us a little more (at least 10 characters).";
  else if (f.message.length > LIMITS.message)
    errors.message = `Please keep your message under ${LIMITS.message} characters.`;
  return errors;
}

/** Opens the visitor's email app with the enquiry pre-filled to the property's address (the site has no mail backend). */
function buildMailto(f: Fields) {
  const subject = `Enquiry from ${f.name.trim()} | The Mountain Table`;
  const body = [
    `Name: ${f.name.trim()}`,
    `Email: ${f.email.trim()}`,
    f.phone.trim() ? `Phone: ${f.phone.trim()}` : null,
    `Guests: ${f.guests}`,
    f.arrival ? `Arrival: ${f.arrival}` : null,
    f.departure ? `Departure: ${f.departure}` : null,
    "",
    f.message.trim(),
  ]
    .filter((line) => line !== null)
    .join("\n");
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const fieldClass =
  "block w-full rounded-[10px] border border-[#ddd4c3] bg-ivory px-4 py-3.5 text-[0.9375rem] text-ink outline-none transition-[border-color,background-color,box-shadow] duration-300 placeholder:text-ink/40 focus:border-gold focus:bg-[#fffdf8] focus:shadow-[0_0_0_3px_rgba(184,147,90,0.25)] aria-[invalid=true]:border-[#8f4a37]";
const labelClass =
  "t-caption mb-2 block text-[0.6875rem] font-medium tracking-[0.16em] text-muted uppercase transition-[color,translate] duration-300 peer-focus-within:-translate-y-0.5 peer-focus-within:text-gold-ink";

/** A line of the letter being written: fades and settles in, one after another from the top (`CONTACT_FX.form.lineStep`). */
function Line({ i, children, className }: { i: number; children: ReactNode; className?: string }) {
  const { enabled, lineStep } = CONTACT_FX.form;
  return (
    <motion.div
      data-motion=""
      className={className}
      initial={enabled ? { opacity: 0, y: 12 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEW_ONCE}
      transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * lineStep }}
    >
      {children}
    </motion.div>
  );
}

/** A small green tick that draws in at the edge of a field that has been filled in correctly. */
function Tick({ className }: { className: string }) {
  const reduce = useReducedMotion();
  return (
    <svg
      viewBox="0 0 24 24"
      className={`pointer-events-none absolute size-5 text-[#3f7a55] ${className}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <motion.path
        d="M5 12.5l4.5 4.5L19 7.5"
        initial={reduce ? false : { pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.3, ease: EASE }}
      />
    </svg>
  );
}

/** Grows the message box to fit what has been typed, as a smooth height change (one read, then writes). */
function growTo(el: HTMLTextAreaElement) {
  const before = el.offsetHeight;
  el.style.height = "0px";
  const next = Math.max(el.scrollHeight + 2, 152);
  el.style.height = `${before}px`;
  requestAnimationFrame(() => {
    el.style.height = `${next}px`;
  });
}

export function EnquiryForm() {
  const uid = useId();
  const [fields, setFields] = useState<Fields>({
    name: "",
    email: "",
    phone: "",
    guests: GUESTS[0],
    arrival: "",
    departure: "",
    message: "",
  });
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState("");
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});

  const update = (key: keyof Fields) => (e: { target: { value: string } }) => {
    setFields((prev) => ({ ...prev, [key]: e.target.value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (honeypot) return; // bots fill the hidden field
    const found = validate(fields);
    setErrors(found);
    if (Object.keys(found).length) {
      setStatus("idle");
      const first = document.getElementById(`${uid}-${Object.keys(found)[0]}`);
      first?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "center",
      });
      first?.focus({ preventScroll: true });
      return;
    }
    const href = buildMailto(fields);
    if (href.length > 1900) {
      setStatus("error");
      return;
    }
    setMailto(href);
    setStatus("sending");
    window.setTimeout(() => {
      window.location.href = href;
      setStatus("success");
    }, 500);
  };

  if (status === "success") {
    return <SuccessView name={fields.name} mailto={mailto} onEdit={() => setStatus("idle")} />;
  }

  const sending = status === "sending";
  const field = (key: keyof Fields) => ({
    id: `${uid}-${key}`,
    name: key,
    value: fields[key],
    onChange: update(key),
    "aria-invalid": errors[key] ? true : undefined,
    "aria-describedby": errors[key] ? `${uid}-${key}-error` : undefined,
    disabled: sending,
  });
  const error = (key: keyof Fields) =>
    errors[key] ? (
      <motion.p
        id={`${uid}-${key}-error`}
        className="t-caption m-0 mt-2 text-[#8f4a37]"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25, ease: EASE }}
      >
        {errors[key]}
      </motion.p>
    ) : null;

  const valid = (key: keyof Fields) =>
    !!touched[key] && !errors[key] && !validate(fields)[key] && fields[key].trim() !== "";
  const row = (key: keyof Fields, label: string, control: ReactNode, tick: "none" | "field" | "box" = "none") => (
    <div onBlur={() => setTouched((prev) => (prev[key] ? prev : { ...prev, [key]: true }))}>
      <div className="flex flex-col-reverse">
        <div className="peer group/f relative">
          {control}
          <span
            aria-hidden="true"
            className="bg-gold pointer-events-none absolute inset-x-3 bottom-0 h-px origin-left scale-x-0 transition-transform duration-300 ease-out group-focus-within/f:scale-x-100"
          />
          {tick !== "none" && valid(key) ? (
            <Tick className={tick === "box" ? "top-3.5 right-3" : "top-1/2 right-3 -translate-y-1/2"} />
          ) : null}
          {key === "message" ? (
            <span
              aria-hidden="true"
              className="t-caption text-muted pointer-events-none absolute right-3 bottom-2 text-[0.6875rem] tabular-nums opacity-0 transition-opacity duration-300 group-focus-within/f:opacity-70"
            >
              {fields.message.length}/{LIMITS.message}
            </span>
          ) : null}
        </div>
        <label htmlFor={`${uid}-${key}`} className={labelClass}>
          {label}
        </label>
      </div>
      {error(key)}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Enquiry" className="relative grid gap-5">
      <Line i={0} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {row(
          "name",
          "Full name",
          <input
            {...field("name")}
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name + 20}
            placeholder="Your name"
            required
            className={`${fieldClass} pr-10`}
          />,
          "field",
        )}
        {row(
          "email",
          "Email",
          <input
            {...field("email")}
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@example.com"
            required
            className={`${fieldClass} pr-10`}
          />,
          "field",
        )}
        {row(
          "phone",
          "Phone (optional)",
          <input
            {...field("phone")}
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="Your phone number"
            className={`${fieldClass} pr-10`}
          />,
          "field",
        )}
      </Line>
      <Line i={1} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {row(
          "guests",
          "Guests",
          <select {...field("guests")} className={fieldClass}>
            {GUESTS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>,
        )}
        {row("arrival", "Arrival", <input {...field("arrival")} type="date" className={fieldClass} />)}
        {row(
          "departure",
          "Departure",
          <input {...field("departure")} type="date" min={fields.arrival || undefined} className={fieldClass} />,
        )}
      </Line>
      <Line i={2}>
        {row(
          "message",
          "Your message",
          <textarea
            {...field("message")}
            rows={5}
            placeholder="Tell us about your plans…"
            required
            className={`${fieldClass} min-h-[9.5rem] resize-none pr-10 pb-6 transition-[height,border-color,background-color,box-shadow] duration-200`}
            onInput={(e) => growTo(e.currentTarget)}
          />,
          "box",
        )}
      </Line>

      {/* Honeypot: hidden from people and assistive tech, bots tend to fill it. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label>
          Website
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => setHoneypot(e.target.value)}
          />
        </label>
      </div>

      <Line i={3} className="flex flex-wrap items-center justify-between gap-5">
        <p className="t-caption m-0 max-w-[18rem] text-muted">We only use your details to reply to your message.</p>
        <button
          type="submit"
          disabled={sending}
          className="btn btn-gold min-w-[11rem] border-0 disabled:cursor-wait disabled:opacity-80"
        >
          {sending ? (
            <>
              <span
                className="size-4 animate-spin rounded-full border-2 border-forest-deep/30 border-t-forest-deep"
                aria-hidden="true"
              />
              Preparing…
            </>
          ) : (
            <>
              Send Message
              <ArrowIcon />
            </>
          )}
        </button>
      </Line>
      <p role="alert" className="t-small m-0 text-[#8f4a37]">
        {status === "error"
          ? `Your message is too long to send this way. Please shorten it, or write to ${contact.email}.`
          : Object.keys(errors).length
            ? "Please check the highlighted fields."
            : ""}
      </p>
    </form>
  );
}
