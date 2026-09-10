"use client";

import { useRef } from "react";
import Image from "next/image";
import { routes, storySlides } from "@/lib/content";
import { useRail } from "@/lib/useRail";
import { Eyebrow, Heading, Lede } from "./ui/SectionHeader";
import SplitSection from "./ui/SplitSection";
import TextLink from "./ui/TextLink";
import styles from "./CustomerStories.module.css";

export default function CustomerStories() {
  const railRef = useRef<HTMLDivElement>(null);
  const rail = useRail(railRef);

  return (
    <SplitSection
      even
      mediaKind="rail"
      mediaMinHeight={800}
      mediaMinHeightNarrow={360}
      mediaProps={rail.hoverProps}
      media={
        <>
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
        </>
      }
    >
      <Eyebrow gap={4}>Erfahrungsberichte</Eyebrow>
      <Heading measure="full" gap={4} hyphenate>
        Kundenerfahrungen: Gemeinsam Erfolge schaffen
      </Heading>
      <Lede measure="default" gap={7}>
        Sehen Sie, wie die Zusammenarbeit mit unserem Team zu transformierenden
        Ergebnissen für unsere KundInnen geführt hat.
      </Lede>
      <TextLink
        href={routes.testimonials}
        data-reveal="rise"
        data-reveal-delay={240}
      >
        Erfahrungsberichte ansehen
      </TextLink>
    </SplitSection>
  );
}
