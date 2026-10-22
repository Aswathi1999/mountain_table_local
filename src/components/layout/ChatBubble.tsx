"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { WHATSAPP_URL } from "@/lib/site";

type Tab = "chat" | "whatsapp";

const EMOJIS = ["🙂", "😊", "👍", "🙏", "😍", "🌿", "⛰️", "🏡"];

const chatIcon = (
  <svg viewBox="0 0 32 32" className="size-[18px] fill-current" aria-hidden="true">
    <path
      d="M21.133 16.933a1.4 1.4 0 11.001-2.8 1.4 1.4 0 010 2.8m-4.667 0a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8m-5.6 0a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8m18.904-3.656c-1.013-5.655-5.753-10.22-11.528-11.105-4.343-.667-8.642.627-11.807 3.547-3.168 2.917-4.763 7.043-4.38 11.318.59 6.582 6.08 11.952 12.768 12.487 1.153.095 2.303.05 3.428-.13a14.12 14.12 0 002.428-.612.59.59 0 01.364-.006l3.714 1.167c.785.246 1.588-.331 1.588-1.144l-.002-3.517c0-.17.086-.301.157-.38a14.028 14.028 0 001.58-2.147c1.705-2.862 2.29-6.14 1.69-9.478"
      fillRule="nonzero"
    />
  </svg>
);

const whatsappIcon = (
  <svg viewBox="0 0 24 24" className="size-[18px] fill-current" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

/**
 * Floating chat launcher (bottom-right) and the chat panel it opens, modelled on the reference screens: a dark header with the
 * logo, an online dot, "Let's Chat!" and a close button; a message area; a composer; and a Chat / WhatsApp switcher.
 * There is no chat server behind it, so messages are handed to WhatsApp (the number in the site's contact details) with the
 * text pre-filled, and the WhatsApp tab opens a conversation directly.
 */
export function ChatBubble() {
  const uid = useId();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("chat");
  const [text, setText] = useState("");
  const [sent, setSent] = useState<string[]>([]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        launcherRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  useEffect(() => {
    threadRef.current?.scrollTo({ top: threadRef.current.scrollHeight });
  }, [sent]);

  const whatsappLink = (message?: string) =>
    message ? `${WHATSAPP_URL}?text=${encodeURIComponent(message)}` : WHATSAPP_URL;

  const send = (e?: FormEvent) => {
    e?.preventDefault();
    const message = text.trim();
    if (!message) return;
    setSent((s) => [...s, message]);
    setText("");
    setEmojiOpen(false);
    window.open(whatsappLink(message), "_blank", "noopener,noreferrer");
  };
  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) send(e);
  };

  const tabClass = (active: boolean) =>
    `flex h-11 flex-1 cursor-pointer items-center justify-center rounded-full border-0 transition-[background-color,box-shadow,color] duration-300 ${
      active
        ? "bg-white text-forest-deep shadow-[0_1px_4px_rgba(20,42,33,0.18)]"
        : "bg-transparent text-muted hover:text-forest-deep"
    }`;

  return (
    <>
      {open ? (
        <section
          role="dialog"
          aria-label="Chat"
          className="fixed inset-x-3 bottom-[5.25rem] z-[100] flex h-[min(30rem,calc(100dvh-10.5rem))] origin-bottom-right flex-col overflow-hidden rounded-[22px] bg-white shadow-[0_18px_50px_rgba(20,42,33,0.35)] motion-safe:animate-[lb-in_0.35s_cubic-bezier(0.22,1,0.36,1)] desk:inset-x-auto desk:right-6 desk:bottom-[104px] desk:h-[min(640px,calc(100dvh-130px))] desk:w-[380px]"
        >
          <header className="flex items-center gap-4 bg-forest-deep px-5 py-4 text-ivory">
            <div className="relative shrink-0">
              <Image
                src="/images/81d784_b04585865a4143659f5fb16e59163c94.png"
                alt=""
                width={48}
                height={48}
                className="size-12 rounded-full border border-gold/60 bg-white"
              />
              <span
                aria-hidden="true"
                className="absolute right-0 bottom-0 size-3.5 rounded-full border-2 border-forest-deep bg-[#3fbf4a]"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="m-0 text-[1.25rem] leading-tight">Let&apos;s Chat!</p>
              <p className="m-0 mt-0.5 text-[0.875rem] leading-tight text-ivory/85">
                We&apos;ll reply as soon as we can
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setOpen(false);
                launcherRef.current?.focus();
              }}
              aria-label="Close chat"
              className="flex size-9 cursor-pointer items-center justify-center border-0 bg-transparent text-ivory transition-colors hover:text-gold-soft"
            >
              <svg
                viewBox="0 0 24 24"
                className="size-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                aria-hidden="true"
              >
                <path d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </header>

          <div
            ref={threadRef}
            className="flex flex-1 flex-col gap-3 overflow-y-auto bg-ivory-deep p-5"
            aria-live="polite"
          >
            {tab === "chat" ? (
              sent.map((m, i) => (
                <p
                  key={i}
                  className="m-0 max-w-[85%] self-end rounded-[16px] rounded-br-[4px] bg-forest px-4 py-3 text-[0.9375rem] leading-[1.5] break-words text-ivory"
                >
                  {m}
                </p>
              ))
            ) : (
              <div className="max-w-[88%] self-start rounded-[16px] bg-white p-5 shadow-[0_1px_3px_rgba(20,42,33,0.12)]">
                <p className="m-0 text-[1rem] leading-[1.6] text-ink">
                  We&apos;re available on WhatsApp. We&apos;d love to hear from you.
                </p>
                <a
                  href={whatsappLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex h-11 items-center gap-2 rounded-full bg-forest px-6 text-[0.9375rem] text-ivory no-underline transition-colors duration-300 hover:bg-gold hover:text-forest-deep focus-visible:bg-gold focus-visible:text-forest-deep"
                >
                  Open WhatsApp
                  <svg
                    viewBox="0 0 24 24"
                    className="size-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 01-1 1H5a1 1 0 01-1-1V7a1 1 0 011-1h5" />
                  </svg>
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </div>
            )}
          </div>

          <div className="relative bg-white px-5 pt-4 pb-4">
            {tab === "chat" ? (
              <form onSubmit={send} className="relative">
                <label htmlFor={`${uid}-msg`} className="sr-only">
                  Write your message
                </label>
                <div className="flex items-end gap-3 border-b border-ink/15 pb-2 transition-colors duration-300 focus-within:border-gold">
                  <textarea
                    id={`${uid}-msg`}
                    ref={inputRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={onKeyDown}
                    rows={1}
                    maxLength={800}
                    placeholder="Write your message…"
                    className="max-h-28 min-h-8 flex-1 resize-none border-0 bg-transparent p-0 text-[1.0625rem] leading-8 text-ink outline-none placeholder:text-ink/70"
                  />
                  <button
                    type="button"
                    onClick={() => setEmojiOpen((v) => !v)}
                    aria-label="Insert emoji"
                    aria-expanded={emojiOpen}
                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center border-0 bg-transparent text-forest/60 transition-colors hover:text-forest"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-[22px]"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      aria-hidden="true"
                    >
                      <circle cx="12" cy="12" r="9" />
                      <path d="M8.5 14c.8 1.4 2 2 3.5 2s2.7-.6 3.5-2" />
                      <circle cx="9" cy="10" r=".6" fill="currentColor" />
                      <circle cx="15" cy="10" r=".6" fill="currentColor" />
                    </svg>
                  </button>
                  <button
                    type="submit"
                    disabled={!text.trim()}
                    aria-label="Send message"
                    className="flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-full border-0 bg-forest text-ivory transition-[background-color,opacity] duration-300 hover:bg-gold hover:text-forest-deep disabled:cursor-default disabled:opacity-30 disabled:hover:bg-forest disabled:hover:text-ivory"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      className="size-4"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      aria-hidden="true"
                    >
                      <path d="M12 19V5M6 11l6-6 6 6" />
                    </svg>
                  </button>
                </div>
                {emojiOpen ? (
                  <ul className="absolute right-0 bottom-11 m-0 flex list-none gap-1 rounded-[14px] bg-white p-2 shadow-[0_6px_20px_rgba(20,42,33,0.25)]">
                    {EMOJIS.map((em) => (
                      <li key={em}>
                        <button
                          type="button"
                          onClick={() => {
                            setText((t) => t + em);
                            inputRef.current?.focus();
                          }}
                          aria-label={`Insert ${em}`}
                          className="size-8 cursor-pointer border-0 bg-transparent text-[1.125rem] transition-transform hover:scale-125"
                        >
                          {em}
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </form>
            ) : null}

            <div
              role="tablist"
              aria-label="Chat channel"
              className={`flex gap-1 rounded-full bg-ivory-deep p-1 ${tab === "chat" ? "mt-4" : ""}`}
            >
              <button
                type="button"
                role="tab"
                aria-selected={tab === "chat"}
                aria-label="Chat"
                onClick={() => setTab("chat")}
                className={tabClass(tab === "chat")}
              >
                {chatIcon}
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={tab === "whatsapp"}
                aria-label="WhatsApp"
                onClick={() => setTab("whatsapp")}
                className={tabClass(tab === "whatsapp")}
              >
                {whatsappIcon}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      <button
        ref={launcherRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close chat" : "Chat"}
        aria-expanded={open}
        className="fixed right-4 bottom-4 z-[100] flex size-[3.1rem] cursor-pointer items-center justify-center rounded-full border border-gold bg-forest-deep p-0 text-ivory shadow-[0_6px_18px_rgba(20,42,33,0.35)] transition-[background-color,color,transform] duration-300 hover:-translate-y-0.5 hover:bg-gold hover:text-forest-deep focus-visible:bg-gold focus-visible:text-forest-deep desk:right-6 desk:bottom-6 desk:size-14"
      >
        <svg viewBox="0 0 32 32" className="size-6 fill-current desk:size-7" aria-hidden="true">
          <path
            d="M21.133 16.933a1.4 1.4 0 11.001-2.8 1.4 1.4 0 010 2.8m-4.667 0a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8m-5.6 0a1.4 1.4 0 110-2.8 1.4 1.4 0 010 2.8m18.904-3.656c-1.013-5.655-5.753-10.22-11.528-11.105-4.343-.667-8.642.627-11.807 3.547-3.168 2.917-4.763 7.043-4.38 11.318.59 6.582 6.08 11.952 12.768 12.487 1.153.095 2.303.05 3.428-.13a14.12 14.12 0 002.428-.612.59.59 0 01.364-.006l3.714 1.167c.785.246 1.588-.331 1.588-1.144l-.002-3.517c0-.17.086-.301.157-.38a14.028 14.028 0 001.58-2.147c1.705-2.862 2.29-6.14 1.69-9.478"
            fillRule="nonzero"
          />
        </svg>
      </button>
    </>
  );
}
