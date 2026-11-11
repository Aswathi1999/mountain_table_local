"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { HOME_FX } from "@/components/motion/home-fx.config";
import { SCROLL_SPRING } from "@/components/motion/tokens";
import { useAllowMotion } from "@/components/motion/useAllowMotion";
import { useHomeFx } from "@/components/motion/useHomeFx";
import { ArrowIcon } from "@/components/ui/BookNowButton";
import { showcaseServices } from "@/data/servicesShowcase";
import "./ServicesShowcase.css";

/** Tilt of each corner photograph, as in the Discover collage. */
const TILT = [-3, 2, 3, -2] as const;

/**
 * "Our Services", composed like the Discover section: four tilted photographs drift in from the edges and converge around centred
 * copy as the section scrolls past. The photographs are the first four services in `src/data/servicesShowcase.ts`.
 */
export function ServicesShowcase() {
  const photos = showcaseServices.slice(0, 4);
  const sectionRef = useRef<HTMLElement>(null);

  // Scroll choreography shared with Discover (same config, same easing of the scroll value).
  const on = useHomeFx("discover");
  const wide = useAllowMotion(1024);
  const config = HOME_FX.discover;
  const tablet = useAllowMotion(750);
  // Phones have a compact stage, so the photographs travel less to stay clear of the copy.
  const travel = config.travelVh * (wide ? 1 : tablet ? config.mobileFactor : 0.08);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const progress = useSpring(scrollYProgress, SCROLL_SPRING);
  const topY = useTransform(progress, [0, 1], ["-" + travel + "svh", travel + "svh"]);
  const bottomY = useTransform(progress, [0, 1], [travel + "svh", "-" + travel + "svh"]);
  const photoY = useTransform(progress, [0, 1], ["-" + config.photoDrift + "%", config.photoDrift + "%"]);
  const copyOpacity = useTransform(progress, [0.12, 0.38], [0, 1]);
  const copyY = useTransform(progress, [0.12, 0.38], [config.copyRise, 0]);

  return (
    <section ref={sectionRef} id="services" aria-labelledby="services-title" className="svc-collage">
      <div className="svc-stage">
        {photos.map((item, slot) => (
          <motion.div
            key={item.id}
            data-motion=""
            className={`svc-photo svc-photo-${slot}`}
            style={{ y: on ? (slot < 2 ? topY : bottomY) : 0, rotate: TILT[slot] }}
          >
            <motion.div className="svc-photo-inner" style={{ y: on ? photoY : 0, scale: on ? 1.12 : 1 }}>
              <Image
                src={item.image.src}
                alt={item.image.alt}
                fill
                sizes="(min-width: 1390px) 360px, (max-width: 749px) 43vw, 26vw"
                className="object-cover"
                style={{ objectPosition: item.image.position }}
              />
            </motion.div>
          </motion.div>
        ))}

        <div className="svc-copy-position wrap">
          <motion.div data-motion="" className="svc-copy" style={{ opacity: on ? copyOpacity : 1, y: on ? copyY : 0 }}>
            <p className="svc-label">Our Services</p>
            <h2 id="services-title">
              Thoughtful Services for a<em>Seamless Stay</em>
            </h2>
            <p className="svc-description">
              From the table to the trail to the spa, every detail is arranged quietly in the background — so all you
              have to do is enjoy it.
            </p>
            <div className="svc-actions">
              <Link href="/see-do" className="svc-cta">
                View All Services
                <ArrowIcon className="size-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
