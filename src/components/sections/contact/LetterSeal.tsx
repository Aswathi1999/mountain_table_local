"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import { CONTACT_FX } from "@/components/motion/home-fx.config";
import { EASE, EASE_REVEAL } from "@/components/motion/tokens";
import { contact } from "@/lib/site";

const seal = CONTACT_FX.form.seal;
const t = (step: readonly [number, number]) => ({ delay: step[0], duration: step[1] });

const paper = "absolute inset-x-0 h-[3.4rem] border border-[#e6dcc6] bg-[#fffdf8]";
const lines =
  "repeating-linear-gradient(to bottom, transparent 0 0.62rem, rgba(11,43,31,0.1) 0.62rem calc(0.62rem + 1px))";

/**
 * The letter is sealed: it folds in thirds, slides into an envelope that rises from below, the flap closes and a gold wax seal with
 * a small mountain is pressed onto it; then the envelope floats away. Decorative only (hidden from assistive technology), about two
 * seconds, and every step is an independent animation, so unmounting at any moment (navigating away, "Edit message") just stops it.
 */
function Sequence() {
  const fold = (origin: "bottom" | "top", step: readonly [number, number], z: number) => ({
    style: { transformOrigin: origin, zIndex: z },
    initial: { rotateX: 0 },
    animate: { rotateX: seal.foldAngle },
    transition: { ease: EASE_REVEAL, ...t(step) },
  });
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 flex items-center justify-center [perspective:1000px]"
    >
      <motion.div
        className="relative h-[15rem] w-[17.5rem]"
        initial={{ y: 0, opacity: 1 }}
        animate={{ y: -36, opacity: 0 }}
        transition={{ ease: EASE, ...t(seal.floatOut) }}
      >
        {/* The envelope (back, front pocket, flap, seal) rises from below. */}
        <motion.div
          className="absolute inset-x-0 bottom-0 h-[10rem]"
          initial={{ y: 240, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: EASE, ...t(seal.rise) }}
        >
          <div className="absolute inset-0 rounded-[6px] bg-[#d9ccaa]" />
        </motion.div>

        {/* The letter: three panels hinged like a folded sheet, then it slides down into the envelope. */}
        <motion.div
          className="absolute inset-x-0 top-0 mx-auto h-[10.2rem] w-[13.75rem]"
          initial={{ y: 0 }}
          animate={{ y: 100 }}
          transition={{ ease: EASE, ...t(seal.slideIn) }}
        >
          <div className="relative size-full [transform-style:preserve-3d]">
            <motion.div className={`${paper} top-0 rounded-t-[4px]`} {...fold("bottom", seal.fold1, 1)}>
              <div className="size-full" style={{ backgroundImage: lines }} />
            </motion.div>
            <div className={`${paper} top-[3.4rem]`} style={{ zIndex: 2 }}>
              <div className="size-full" style={{ backgroundImage: lines }} />
            </div>
            <motion.div className={`${paper} top-[6.8rem] rounded-b-[4px]`} {...fold("top", seal.fold2, 3)}>
              <div className="size-full" style={{ backgroundImage: lines }} />
            </motion.div>
          </div>
        </motion.div>

        <motion.div
          className="absolute inset-x-0 bottom-0 h-[10rem]"
          initial={{ y: 240, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ ease: EASE, ...t(seal.rise) }}
        >
          {/* Front pocket with a V-shaped opening */}
          <div
            className="absolute inset-0 rounded-[6px] bg-[#e9dfc6]"
            style={{ clipPath: "polygon(0 0, 50% 45%, 100% 0, 100% 100%, 0 100%)" }}
          />
          {/* Flap: open (turned up) until it closes over the pocket */}
          <motion.div
            className="absolute inset-x-0 top-0 h-[5.5rem] bg-[#dfd2b0]"
            style={{ transformOrigin: "top", clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            initial={{ rotateX: seal.foldAngle }}
            animate={{ rotateX: 0 }}
            transition={{ ease: EASE_REVEAL, ...t(seal.flap) }}
          />
          {/* Wax seal with a small mountain mark, pressed on with a soft pulse */}
          <div className="absolute top-[4.9rem] left-1/2 size-[3.25rem] -translate-x-1/2">
            <motion.span
              className="absolute inset-0 rounded-full bg-[#b8912f]/50"
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
              transition={{ ease: "easeOut", duration: 0.5, delay: seal.stamp[0] + 0.12 }}
            />
            <motion.span
              className="absolute inset-0 flex items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_30%,#d3ad4e,#a77f22_70%,#8a6a1c)] text-[#0a221b]/70 shadow-[0_3px_8px_rgba(10,34,27,0.35)]"
              initial={{ scale: 1.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ ease: EASE, ...t(seal.stamp) }}
            >
              <svg
                viewBox="0 0 32 24"
                className="h-5 w-7"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
                strokeLinecap="round"
              >
                <motion.path
                  d="M3 21 L13 6 L18 13 L22 8 L29 21 Z"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ ease: EASE, duration: 0.4, delay: seal.stamp[0] + 0.1 }}
                />
              </svg>
            </motion.span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

/**
 * What the visitor sees after sending. The thank-you text is in the page (and announced) straight away; focus moves to its heading
 * at once. With motion allowed, the sealing sequence plays over it for about two seconds and the text then fades in; with reduced
 * motion, or with the effect switched off, the thank-you simply shows. Settings: `CONTACT_FX.form.seal`.
 */
export function SuccessView({ name, mailto, onEdit }: { name: string; mailto: string; onEdit: () => void }) {
  const reduce = useReducedMotion();
  const sealed = CONTACT_FX.form.enabled && seal.enabled && !reduce;
  const [thanks, setThanks] = useState(!sealed);
  const heading = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, []);
  useEffect(() => {
    if (!sealed) return;
    const id = window.setTimeout(() => setThanks(true), seal.thanksAt * 1000);
    return () => window.clearTimeout(id);
  }, [sealed]);

  return (
    <div className="relative min-h-[22rem]">
      {sealed && !thanks ? <Sequence /> : null}
      <motion.div
        role="status"
        className="flex flex-col items-start gap-1 py-6 desk:py-10"
        initial={false}
        animate={{ opacity: thanks ? 1 : 0, y: thanks || !sealed ? 0 : 10 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        <svg
          viewBox="0 0 48 48"
          className="text-forest size-12"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <motion.circle
            cx="24"
            cy="24"
            r="21"
            initial={false}
            animate={{ pathLength: thanks || !sealed ? 1 : 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          />
          <motion.path
            d="M14.5 25l7 7 12-14"
            initial={false}
            animate={{ pathLength: thanks || !sealed ? 1 : 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          />
        </svg>
        <p ref={heading} tabIndex={-1} className="t-h4 text-forest m-0 mt-4 outline-none">
          Thank you, {name.trim().split(" ")[0]}.
        </p>
        <p className="t-small m-0 mt-4 text-muted">
          Message sent. Your email app should now open with your message ready to send to {contact.email}. If nothing
          opened, use the button below or write to us directly.
        </p>
        <motion.p
          className="t-script text-clay m-0 mt-4 text-[1.75rem]"
          initial={false}
          animate={{ clipPath: thanks || !sealed ? "inset(-20% -6% -20% -2%)" : "inset(-20% 100% -20% -2%)" }}
          transition={{ duration: 1.1, ease: EASE_REVEAL, delay: 0.5 }}
        >
          The mountains are waiting
        </motion.p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <a href={mailto} className="btn btn-gold btn-sm">
            Open email
          </a>
          <button
            type="button"
            onClick={onEdit}
            className="t-ui link-u cursor-pointer border-0 bg-transparent p-0 text-muted transition-colors hover:text-forest"
          >
            Edit message
          </button>
        </div>
      </motion.div>
    </div>
  );
}
