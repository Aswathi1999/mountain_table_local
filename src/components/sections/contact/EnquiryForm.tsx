"use client";

import { useId, useState, type FormEvent, type ReactNode } from "react";
import { contact } from "@/lib/site";

type Fields = { name: string; email: string; phone: string; message: string };
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
    "",
    f.message.trim(),
  ]
    .filter((line) => line !== null)
    .join("\n");
  return `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

const fieldClass =
  "peer block w-full border-0 border-b border-ink/25 bg-transparent px-0 py-2 text-[1.0625rem] text-ink outline-none transition-colors duration-300 placeholder:text-ink/40 focus:border-forest aria-[invalid=true]:border-[#a32a2a] desk:text-[18px]";
const labelClass =
  "t-label block tracking-[0.24em] text-muted uppercase transition-colors duration-300 peer-focus:text-forest";

export function EnquiryForm() {
  const uid = useId();
  const [fields, setFields] = useState<Fields>({ name: "", email: "", phone: "", message: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [mailto, setMailto] = useState("");

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
      document.getElementById(`${uid}-${Object.keys(found)[0]}`)?.focus();
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
    return (
      <div role="status" className="border border-gold/50 p-6 desk:p-8">
        <p className="m-0 text-[1.25rem] tracking-[0.08em] text-forest desk:text-[22px]">
          Thank you, {fields.name.trim().split(" ")[0]}.
        </p>
        <p className="m-0 mt-4 text-[1rem] leading-[1.7rem] text-muted desk:text-[17px]">
          Your email app should now open with your message ready to send to {contact.email}. If nothing opened, use the
          button below or write to us directly.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a
            href={mailto}
            className="bg-gold text-forest-deep hover:bg-ivory inline-flex h-11 items-center px-7 text-[13px] tracking-[0.22em] uppercase no-underline transition-colors duration-300"
          >
            Open email
          </a>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="cursor-pointer border-0 bg-transparent p-0 text-[13px] tracking-[0.22em] text-muted uppercase underline underline-offset-8 transition-colors hover:text-forest"
          >
            Edit message
          </button>
        </div>
      </div>
    );
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
      <p id={`${uid}-${key}-error`} className="m-0 mt-2 text-[13px] text-[#a32a2a]">
        {errors[key]}
      </p>
    ) : null;

  const row = (key: keyof Fields, label: string, control: ReactNode) => (
    <div>
      <div className="flex flex-col-reverse">
        {control}
        <label htmlFor={`${uid}-${key}`} className={labelClass}>
          {label}
        </label>
      </div>
      {error(key)}
    </div>
  );

  return (
    <form onSubmit={onSubmit} noValidate aria-label="Enquiry" className="relative grid gap-5">
      <div className="grid gap-5 desk:grid-cols-2 desk:gap-x-8">
        {row(
          "name",
          "Name",
          <input
            {...field("name")}
            type="text"
            autoComplete="name"
            maxLength={LIMITS.name + 20}
            placeholder="Your name"
            required
            className={fieldClass}
          />,
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
            className={fieldClass}
          />,
        )}
      </div>
      {row(
        "phone",
        "Phone (optional)",
        <input
          {...field("phone")}
          type="tel"
          autoComplete="tel"
          inputMode="tel"
          placeholder="Optional"
          className={fieldClass}
        />,
      )}
      {row(
        "message",
        "Message",
        <textarea
          {...field("message")}
          rows={4}
          placeholder="Dates, number of guests, anything you would like to know"
          required
          className={`${fieldClass} resize-none`}
        />,
      )}

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

      <div className="flex flex-wrap items-center gap-5">
        <button
          type="submit"
          disabled={sending}
          className="bg-gold text-forest-deep hover:bg-ivory inline-flex h-12 min-w-[11rem] cursor-pointer items-center justify-center gap-3 border-0 px-8 text-[13px] tracking-[0.22em] uppercase transition-colors duration-300 disabled:cursor-wait disabled:opacity-80"
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
            "Send enquiry"
          )}
        </button>
        <p className="m-0 text-[13px] text-muted">Opens your email app with the message ready to send.</p>
      </div>
      <p role="alert" className="m-0 text-[14px] text-[#a32a2a]">
        {status === "error"
          ? `Your message is too long to send this way. Please shorten it, or write to ${contact.email}.`
          : Object.keys(errors).length
            ? "Please check the highlighted fields."
            : ""}
      </p>
    </form>
  );
}
