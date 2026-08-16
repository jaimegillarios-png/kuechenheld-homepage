"use client";

import { useRef } from "react";
import Image from "next/image";
import MaybeLink from "./MaybeLink";
import { routes, storySlides } from "@/lib/content";
import { useRail } from "@/lib/useRail";
import shared from "@/styles/shared.module.css";
import styles from "./CustomerStories.module.css";

export default function CustomerStories() {
  const railRef = useRef<HTMLDivElement>(null);
  const rail = useRail(railRef);

  return (
    <section className={styles.section}>
      <div className={styles.media} {...rail.hoverProps}>
        <div
          ref={railRef}
          className={styles.rail}
          data-rail
          data-reveal-stagger
          data-reveal-stagger-step="110"
        >
          {storySlides.map((slide) => (
            <div key={slide.src} className={styles.slide}>
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                sizes="(max-width: 900px) 100vw, 50vw"
                className={styles.photo}
              />
              <span className={styles.caption}>{slide.caption}</span>
            </div>
          ))}
        </div>

        <button
          type="button"
          aria-label="Vorheriges Bild"
          className={styles.arrowPrev}
          style={{ opacity: rail.arrowOpacity }}
          onClick={rail.prev}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Nächstes Bild"
          className={styles.arrowNext}
          style={{ opacity: rail.arrowOpacity }}
          onClick={rail.next}
        >
          →
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.eyebrow} data-reveal="letter">
          Erfahrungsberichte
        </div>
        <h2 className={styles.heading} data-reveal="mask">
          Kundenerfahrungen: Gemeinsam Erfolge schaffen
        </h2>
        <p className={styles.lead} data-reveal="rise" data-reveal-delay="140">
          Sehen Sie, wie die Zusammenarbeit mit unserem Team zu
          transformierenden Ergebnissen für unsere KundInnen geführt hat.
        </p>
        <MaybeLink
          href={routes.testimonials}
          data-ul2
          className={shared.linkUnderline}
          data-reveal="rise"
          data-reveal-delay="240"
        >
          Erfahrungsberichte ansehen
        </MaybeLink>
      </div>
    </section>
  );
}
