"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import Image from "next/image";
import { GALLERY_FX } from "@/components/motion/home-fx.config";
import { Lines, Reveal } from "@/components/motion/primitives";
import { EASE, VIEW_ONCE } from "@/components/motion/tokens";
import { copy } from "@/data/copy";
import { instagramPosts } from "@/data/instagram";
import { social } from "@/lib/site";

const guests = GALLERY_FX.guests;

/** A small Instagram mark whose outline draws itself when the button scrolls into view. */
function InstagramMark() {
  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: VIEW_ONCE,
    transition: { duration: 1, ease: EASE, delay },
  });
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-[1.125rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <motion.rect x="3.5" y="3.5" width="17" height="17" rx="5" {...draw(0.1)} />
      <motion.circle cx="12" cy="12" r="4" {...draw(0.4)} />
      <motion.circle cx="17.2" cy="6.8" r="0.4" {...draw(0.8)} />
    </svg>
  );
}

/** Fixed pseudo-random tilts (so server and browser agree): each tile starts a little crooked and settles straight. */
const TILTS = [1.6, -1.2, 2, -1.8, 1, -2] as const;

/**
 * "Explore & Follow Us": a row of the property's own Instagram posts, each flipped over like an instant photograph when it scrolls
 * in (one after another), with a follow button whose Instagram mark draws itself. On hover (mouse) the photograph zooms and a
 * green veil shows a heart that pops and "View on Instagram". Settings: `GALLERY_FX.guests`.
 */
export function GalleryFollow() {
  const reduce = useReducedMotion();
  const posts = instagramPosts.slice(0, 6);
  const fx = guests.enabled && !reduce;
  return (
    <section id="follow" aria-labelledby="follow-title" className="bg-ivory relative py-20 desk:py-28">
      <div className="wrap">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <Reveal>
              <p className="t-eyebrow text-forest">Follow along</p>
            </Reveal>
            <Lines id="follow-title" as="h2" lines={[copy.about.followTitle]} className="t-h2 text-forest m-0 mt-4" />
          </div>
          <Reveal delay={0.1}>
            <a href={social.instagram} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
              <InstagramMark />
              Follow on Instagram
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </Reveal>
        </div>
        <div className="grid grid-cols-2 gap-4 [perspective:1100px] sm:grid-cols-3 lg:grid-cols-6">
          {posts.map((post, i) => (
            <motion.div
              key={post.src}
              data-motion=""
              initial={
                fx
                  ? { rotateY: guests.flipFrom, rotate: TILTS[i % TILTS.length] * (guests.tilt / 2), opacity: 0 }
                  : false
              }
              whileInView={{ rotateY: 0, rotate: 0, opacity: 1 }}
              viewport={VIEW_ONCE}
              transition={{ duration: 1, ease: EASE, delay: i * guests.stagger }}
            >
              <a
                href={post.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Instagram post ${i + 1} (opens in a new tab)`}
                className="gal-guest group relative block aspect-square overflow-hidden rounded-[14px]"
              >
                <Image
                  src={post.src}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 190px, (min-width: 640px) 33vw, 50vw"
                  className="object-cover transition-transform duration-[1000ms] ease-out group-hover:scale-[1.06]"
                />
                <span
                  aria-hidden="true"
                  className="gal-guest-overlay bg-forest-deep/70 text-ivory absolute inset-0 flex flex-col items-center justify-center gap-2 text-center"
                >
                  <svg viewBox="0 0 24 24" className="gal-heart size-7 text-[#e9c9a8]" fill="currentColor">
                    <path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z" />
                  </svg>
                  <span className="t-small [font-size:0.8125rem]">View on Instagram</span>
                </span>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
